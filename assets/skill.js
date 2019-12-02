Game.skills = [];

Skill = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.action = properties['action'] || "";
  this.level = properties['level'] || 1;
  this.rank = properties['rank'] || 1;
  this.options = properties['options'] || {};
  this.formulas = properties['formulas'] || {};
  this.Symbol = properties['Symbol'] || "";
  this.target = properties['target'] || '';
  this.type = properties['type'] || '';
  this.subtype = properties['subtype'] || '';
}

Game.useSkill = function(actor, skill, skillx, skilly) {
  var result = 0;
  if (actor.Player) {
    if (skill.type == "skill") {
      if (skill.options.cost > Game.entity[0].Hunger) {
        Game.messagebox.sendMessage("You havent enough energy.");
        return;
      } else {
        Game.entity[Game.entity.length - 1].Hunger = Game.entity[Game.entity.length - 1].Hunger - skill.options.cost;
        Game.messagebox.sendMessage("You use " + skill.name + "(" + skill.level + ")%c{}.");
      }
    }
    if (skill.type == "spell") {
      if (skill.options.cost > Game.entity[0].Mana) {
        Game.messagebox.sendMessage("You havent enough mana.");
        return;
      } else {
        Game.entity[Game.entity.length - 1].Mana = Game.entity[Game.entity.length - 1].Mana - skill.options.cost;
        Game.messagebox.sendMessage("You cast " + skill.name + "(" + skill.level + ")%c{}.");
      }
    }
  } else {
    if (skill.type == "skill") {
      Game.messagebox.sendMessage("The " + actor.name + " use " + skill.name + "(" + skill.level + ")%c{}.");
    }
    if (skill.type == "spell") {
      Game.messagebox.sendMessage("The " + actor.name + " cast " + skill.name + "(" + skill.level + ")%c{}.");
    }
  }
  mode.skillmap = {};
  var level = Game.entity[0].Depth;
  fov.compute(skillx, skilly, skill.options.radius, function(x, y, r, visibility) {
    mode.skillmap[x + "," + y] = 1;
  });
  for (let i = 0; i < Game.entity.length; i++) {
    var key = Game.entity[i].x + "," + Game.entity[i].y;
    //skill system. damage subtype
    if (skill.subtype == "damage") {
      result = Math.floor(Math.random() * skill.level * (skill.formulas.maxdmglvl - skill.formulas.mindmglvl)) + skill.formulas.mindmglvl * skill.level;
      result = result + Math.floor(Math.random() * (skill.formulas.maxdmg - skill.formulas.mindmg)) + skill.formulas.mindmg;
      if (typeof skill.formulas.withweapon !== 'undefined') {
        result = result + Math.floor(Math.random() * skill.formulas.withweapon * (actor.Maxatk - actor.Minatk)) + Math.floor(skill.formulas.withweapon * actor.Minatk);
      }
      var _color = "%c{}";
      var _crit = 0;
      if (skill.options.stat == "agi") result = Math.floor(result * (1 + actor.Agi / 100));
      if (skill.options.stat == "str") result = Math.floor(result * (1 + actor.Str / 100));
      if (skill.options.stat == "con") result = Math.floor(result * (1 + actor.Con / 100));
      if (skill.options.stat == "int") result = Math.floor(result * (1 + actor.Int / 100));
      _crit = Math.min(95, (actor.Crit + Math.floor(actor.Agi / 2) + 2));
      if (Math.random() * 100 < _crit) {
        result = result * 2;
        _color = "%c{lime}"
      }
      if (key in mode.skillmap) {
        let dmg = Game.entity[i].doGetDamage(result);
        if (actor.Player) {
          Game.messagebox.sendMessage("You does " + _color + dmg + " %c{}damage to " + Game.entity[i].name + ".");
        } else {
          Game.messagebox.sendMessage("The " + actor.name + " does " + _color + dmg + " %c{}damage to " + Game.entity[i].name + ".");
        }
        Game.entity[i].doDie();
      }
    }
    //end of damage block
    if (skill.subtype == "translocation") {
      if (key in mode.skillmap) {
        mode.blinkmap = [];
        fov.compute(Game.entity[i].x, Game.entity[i].y, skill.formulas.range, function(x, y, r, visibility) {
          mode.blinkmap.push(x + "," + y);
        });
        var _coordarray = mode.blinkmap[Math.floor(mode.blinkmap.length * Math.random())].split(',');
        while (Game.map[level].Tiles[_coordarray[0]][_coordarray[1]].Blocked || Game.map[level].Tiles[_coordarray[0]][_coordarray[1]].Mob) {
          _coordarray = mode.blinkmap[mode.blinkmap.length * Math.random() << 0].split(',');
        }
        Game.entity[i].x = Number(_coordarray[0]);
        Game.entity[i].y = Number(_coordarray[1]);
        console.log(_coordarray[0] + " - " + typeof _coordarray[0]);
        console.log(_coordarray[1] + " - " + typeof _coordarray[1]);
        Game.messagebox.sendMessage("The " + Game.entity[i].name + " %c{}is teleportated.");
      }
    }
    //end of translocation block
    if (skill.subtype == "charm"||skill.subtype == "hex") {
      if (key in mode.skillmap) {
        if (Game.entity[i].affects.length > 0) {
          for (let j=0; j < Game.entity[i].affects.length; j++) {
            if (Game.entity[i].affects[j].name == skill.name) {
              Game.removeAffect(Game.entity[i].x,Game.entity[i].y,Game.entity[i].Depth,j);
            }
          }
        }
        Game.addAffect(Game.entity[i].x, Game.entity[i].y,Game.entity[i].Depth,skill,actor);
      }
    }
  }
}



Game.chooseSkill = function(num) {
  if (typeof Game.skills[num] === 'undefined') {
    Game.messagebox.sendMessage("You havent skill in slot [" + (num + 1) + "].");
    Game.drawAll();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
    return;
  }
  Game.messages.clear();
  Game.podskazka.draw((num) * 4 + 1, 0, (num + 1), "#0f0");
  Game.messages.drawText(1, 1, Game.skills[num].name + "(" + Game.skills[num].level + ")");
  var iterator = 1;
  for (let [key, value] of Object.entries(Game.skills[num].options)) {
    iterator++;
    Game.messages.drawText(1, iterator, `${key}: ${value}`);
  }
  Game.entity[0].Draw();
  mode.mode = "skill";
  mode.chosenskill = num;
  Game.generateSkillMap();
  Game.setSkillXY();
  Game.drawSkillMap();
}

Game.setSkillXY = function() {
  var level = Game.entity[0].Depth;
  mode.skillx = Game.entity[0].x;
  mode.skilly = Game.entity[0].y;
  for (let i = 1; i < Game.entity.length; i++) {
    var key = Game.entity[i].x + "," + Game.entity[i].y;
    if (key in mode.skillmap && Game.entity[i].Depth == level) {
      mode.skillx = Game.entity[i].x;
      mode.skilly = Game.entity[i].y;
      return;
    }
  }
}

Game.generateSkillMap = function() {
  mode.skillmap = {};
  var level = Game.entity[0].Depth;
  fov.compute(Game.entity[0].x, Game.entity[0].y, Math.min(Game.skills[mode.chosenskill].options.range,Game.entity[0].Vision), function(x, y, r, visibility) {
    mode.skillmap[x + "," + y] = 1;
  });
}

Game.drawSkillMap = function() {
  this.drawMap();
  var level = Game.entity[0].Depth;
  fov.compute(Game.entity[0].x, Game.entity[0].y, Game.skills[mode.chosenskill].options.range, function(x, y, r, visibility) {
    let xco = Game.GetCamera(x, y)[0];
    let yco = Game.GetCamera(x, y)[1];
    let _color = "#fd06";
    if (yco < Game.screenHeight && yco > -1 && xco < Game.screenWidth && xco > -1) {
      if (typeof Game.map[level].Tiles[x][y].items[0] !== 'undefined') {
        Game.display.draw(xco, yco, [Game.map[level].Tiles[x][y].Symbol, Game.map[level].Tiles[x][y].items[0].Symbol], ["#0000", _color]);
      } else {
        Game.display.draw(xco, yco, Game.map[level].Tiles[x][y].Symbol, _color);
      }
      Game.map[level].Tiles[x][y].Color = _color;
    }
  });
  fov.compute(mode.skillx, mode.skilly, Game.skills[mode.chosenskill].options.radius, function(x, y, r, visibility) {
    let xco = Game.GetCamera(x, y)[0];
    let yco = Game.GetCamera(x, y)[1];
    let _color = "#7f07";
    if (yco < Game.screenHeight && yco > -1 && xco < Game.screenWidth && xco > -1) {
      if (typeof Game.map[level].Tiles[x][y].items[0] !== 'undefined') {
        Game.display.draw(xco, yco, [Game.map[level].Tiles[x][y].Symbol, Game.map[level].Tiles[x][y].items[0].Symbol], ["#0000", _color]);
      } else {
        Game.display.draw(xco, yco, Game.map[level].Tiles[x][y].Symbol, _color);
      }
      Game.map[level].Tiles[x][y].Color = _color;
    }
  });
  Game.entity[0].Draw();
  Game.drawEntities();
};

Game.addAffect = function(x,y,level,affect,actor) {
  for (let i = 0; i < Game.entity.length; i++) {
    if (Game.entity[i].x == x && Game.entity[i].y == y && Game.entity[i].Depth == level) {
      for (let [key, value] of Object.entries(affect.formulas)) {
        if (affect.options.stat == "agi")  affect.formulas[key] = Math.floor(affect.formulas[key] * (1 + actor.Agi / 100));
        if (affect.options.stat == "str")  affect.formulas[key] = Math.floor(affect.formulas[key] * (1 + actor.Str / 100));
        if (affect.options.stat == "con")  affect.formulas[key] = Math.floor(affect.formulas[key] * (1 + actor.Con / 100));
        if (affect.options.stat == "int")  affect.formulas[key] = Math.floor(affect.formulas[key] * (1 + actor.Int / 100));
        if (key == "minatk") Game.entity[i].Minatk += affect.formulas[key];
        if (key == "maxatk") Game.entity[i].Maxatk += affect.formulas[key];
        if (key == "str") Game.entity[i].Str += affect.formulas[key];
        if (key == "con") Game.entity[i].Con += affect.formulas[key];
        if (key == "int") Game.entity[i].Int += affect.formulas[key];
        if (key == "agi") Game.entity[i].Agi += affect.formulas[key];
      }
      Game.entity[i].affects.push(affect);
      Game.entity[i].affects[Game.entity[i].affects.length -1].last = Game.entity[i].affects[Game.entity[i].affects.length -1].formulas.duration;
      Game.messagebox.sendMessage("The "+Game.entity[i].name+" now is affected by "+ affect.name+"("+affect.level+").");
    }
  }
}

Game.removeAffect = function(x,y,level,num) {
  console.log(x+" "+y+" "+level+" "+num);
  for (let i = 0; i < Game.entity.length; i++) {
    if (Game.entity[i].x == x && Game.entity[i].y == y && Game.entity[i].Depth == level) {
      for (let [key, value] of Object.entries(Game.entity[i].affects[num].formulas)) {
        if (key == "minatk") Game.entity[i].Minatk -= value;
        if (key == "maxatk") Game.entity[i].Maxatk -= value;
        if (key == "str") Game.entity[i].Str -= value;
        if (key == "con") Game.entity[i].Con -= value;
        if (key == "int") Game.entity[i].Int -= value;
        if (key == "agi") Game.entity[i].Agi -= value;
      }
      Game.messagebox.sendMessage("The "+Game.entity[i].name+" now is not affected by "+ Game.entity[i].affects[num].name+"("+Game.entity[i].affects[num].level+").");  
      Game.entity[i].affects.splice(num,1);
    }
  }
}

AffectsCheck = function() {
  this.getSpeed = function() {
    return 100;
  }
}

AffectsCheck.prototype.act = function() {
  for (let i = 0; i < Game.entity.length; i++) {
    if (Game.entity[i].affects.length > 0) {
      for (let j=0; j < Game.entity[i].affects.length; j++) {
        if ("poisonmin" in Game.entity[i].affects[j].formulas) {
          let dmg = Math.floor(Math.random()*(Game.entity[i].affects[j].formulas.poisonmax-Game.entity[i].affects[j].formulas.poisonmin)+Game.entity[i].affects[j].formulas.poisonmin);
          let result = Game.entity[i].doGetDamage(dmg);
          if (Game.map[Game.entity[i].Depth].Tiles[Game.entity[i].x][Game.entity[i].y].Visible) {
            Game.messagebox.sendMessage("The " + Game.entity[i].name + " get " + result + " damage from poison.")
          }
        }
        Game.entity[i].affects[j].last -= 1;
        if (Game.entity[i].affects[j].last < 1) Game.removeAffect(Game.entity[i].x,Game.entity[i].y,Game.entity[i].Depth,j);
      }
    }
  }
}
