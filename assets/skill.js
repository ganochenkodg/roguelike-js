Game.skills = [];

Skill = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.action = properties['action'] || "";
  this.level = properties['level'] || 1;
  this.options = properties['options'] || {};
  this.formulas = properties['formulas'] || {};
  this.Symbol = properties['Symbol'] || "";
  this.target = properties['target'] || '';
  this.type = properties['type'] || '';
  this.subtype = properties['subtype'] || '';
}

Game.useSkill = function(actor, skill, skillx, skilly) {
  var result = 0;
  var skilltargets = Game.entity;
  skilltargets.push(Game.player);
  if (actor.Player) {
    if (skill.type == "skill") {
      if (skill.options.cost > Game.player.Hunger) {
        Game.messagebox.sendMessage("You havent enough energy.");
        return;
      } else {
        skilltargets[skilltargets.length - 1].Hunger = skilltargets[skilltargets.length - 1].Hunger - skill.options.cost;
        Game.messagebox.sendMessage("You use " + skill.name + "(" + skill.level + ")%c{}.");
      }
    }
    if (skill.type == "spell") {
      if (skill.options.cost > Game.player.Mana) {
        Game.messagebox.sendMessage("You havent enough mana.");
        return;
      } else {
        skilltargets[skilltargets.length - 1].Mana = skilltargets[skilltargets.length - 1].Mana - skill.options.cost;
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
  var level = Game.player.Depth;
  fov.compute(skillx, skilly, skill.options.radius, function(x, y, r, visibility) {
    mode.skillmap[x + "," + y] = 1;
  });
  for (let i = 0; i < skilltargets.length; i++) {
    var key = skilltargets[i].x + "," + skilltargets[i].y;
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
        let dmg = skilltargets[i].doGetDamage(result);
        if (actor.Player) {
          Game.messagebox.sendMessage("You does " + _color + dmg + " %c{}damage to " + skilltargets[i].name + ".");
        } else {
          Game.messagebox.sendMessage("The " + actor.name + " does " + _color + dmg + " %c{}damage to " + skilltargets[i].name + ".");
        }
        skilltargets[i].doDie();
      }
    }
    //end of damage block
    if (skill.subtype == "translocation") {
      if (key in mode.skillmap) {
        mode.blinkmap = [];
        fov.compute(skilltargets[i].x, skilltargets[i].y, skill.formulas.range, function(x, y, r, visibility) {
          mode.blinkmap.push(x + "," + y);
        });
        var _coordarray = mode.blinkmap[Math.floor(mode.blinkmap.length * Math.random())].split(',');
        while (Game.map[level].Tiles[_coordarray[0]][_coordarray[1]].Blocked || Game.map[level].Tiles[_coordarray[0]][_coordarray[1]].Mob) {
          _coordarray = mode.blinkmap[mode.blinkmap.length * Math.random() << 0].split(',');
        }
        skilltargets[i].x = Number(_coordarray[0]);
        skilltargets[i].y = Number(_coordarray[1]);
        console.log(_coordarray[0] + " - " + typeof _coordarray[0]);
        console.log(_coordarray[1] + " - " + typeof _coordarray[1]);
        Game.messagebox.sendMessage("The " + skilltargets[i].name + " %c{}is teleportated.");
      }
    }
    //end of translocation block
    if (skill.subtype == "charm"||skill.subtype == "hex") {
      if (key in mode.skillmap) {
        if (skilltargets[i].affects.length > 0) {
          for (let j=0; j < skilltargets[i].affects.length; j++) {
            if (skilltargets[i].affects[j].name == skill.name) {
              Game.removeAffect(skilltargets[i].x,skilltargets[i].y,skilltargets[i].Depth,skilltargets,j);
            }
          }
        }
        Game.addAffect(skilltargets[i].x, skilltargets[i].y,skilltargets[i].Depth,skilltargets,skill,actor);
      }
    }
  }
  Game.player = skilltargets.pop();
  Game.entity = skilltargets;
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
  Game.player.Draw();
  mode.mode = "skill";
  mode.chosenskill = num;
  Game.generateSkillMap();
  Game.setSkillXY();
  Game.drawSkillMap();
}

Game.setSkillXY = function() {
  var level = Game.player.Depth;
  mode.skillx = Game.player.x;
  mode.skilly = Game.player.y;
  for (let i = 0; i < Game.entity.length; i++) {
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
  var level = Game.player.Depth;
  fov.compute(Game.player.x, Game.player.y, Math.min(Game.skills[mode.chosenskill].options.range,Game.player.Vision), function(x, y, r, visibility) {
    mode.skillmap[x + "," + y] = 1;
  });
}

Game.drawSkillMap = function() {
  this.drawMap();
  var level = Game.player.Depth;
  fov.compute(Game.player.x, Game.player.y, Game.skills[mode.chosenskill].options.range, function(x, y, r, visibility) {
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
  Game.player.Draw();
  Game.drawEntities();
};

Game.addAffect = function(x,y,level,skilltargets,affect,actor) {
  for (let i = 0; i < skilltargets.length; i++) {
    if (skilltargets[i].x == x && skilltargets[i].y == y && skilltargets[i].Depth == level) {
      for (let [key, value] of Object.entries(affect.formulas)) {
        if (affect.options.stat == "agi")  affect.formulas[key] = Math.floor(affect.formulas[key] * (1 + actor.Agi / 100));
        if (affect.options.stat == "str")  affect.formulas[key] = Math.floor(affect.formulas[key] * (1 + actor.Str / 100));
        if (affect.options.stat == "con")  affect.formulas[key] = Math.floor(affect.formulas[key] * (1 + actor.Con / 100));
        if (affect.options.stat == "int")  affect.formulas[key] = Math.floor(affect.formulas[key] * (1 + actor.Int / 100));
        if (key == "minatk") skilltargets[i].Minatk += affect.formulas[key];
        if (key == "maxatk") skilltargets[i].Maxatk += affect.formulas[key];
        if (key == "str") skilltargets[i].Str += affect.formulas[key];
        if (key == "con") skilltargets[i].Con += affect.formulas[key];
        if (key == "int") skilltargets[i].Int += affect.formulas[key];
        if (key == "agi") skilltargets[i].Agi += affect.formulas[key];
      }
      skilltargets[i].affects.push(affect);
      skilltargets[i].affects[skilltargets[i].affects.length -1].last = skilltargets[i].affects[skilltargets[i].affects.length -1].formulas.duration;
      Game.messagebox.sendMessage("The "+skilltargets[i].name+" now is affected by "+ affect.name+"("+affect.level+").");
    }
  }
}

Game.removeAffect = function(x,y,level,skilltargets,num) {
  for (let i = 0; i < skilltargets.length; i++) {
    if (skilltargets[i].x == x && skilltargets[i].y == y && skilltargets[i].Depth == level) {
      for (let [key, value] of Object.entries(skilltargets[i].affects[num].formulas)) {
        if (key == "minatk") skilltargets[i].Minatk -= value;
        if (key == "maxatk") skilltargets[i].Maxatk -= value;
        if (key == "str") skilltargets[i].Str -= value;
        if (key == "con") skilltargets[i].Con -= value;
        if (key == "int") skilltargets[i].Int -= value;
        if (key == "agi") skilltargets[i].Agi -= value;
      }
      Game.messagebox.sendMessage("The "+skilltargets[i].name+" now is not affected by "+ skilltargets[i].affects[num].name+"("+skilltargets[i].affects[num].level+").");  
      skilltargets[i].affects.splice(num,1);
    }
  }
}

AffectsCheck = function() {
  this.getSpeed = function() {
    return 100;
  }
}

AffectsCheck.prototype.act = function() {
  var skilltargets = Game.entity;
  skilltargets.push(Game.player);
  for (let i = 0; i < skilltargets.length; i++) {
    if (skilltargets[i].affects.length > 0) {
      for (let j=0; j < skilltargets[i].affects.length; j++) {
        if ("poisonmin" in skilltargets[i].affects[j].formulas) {
          let dmg = Math.floor(Math.random()*(skilltargets[i].affects[j].formulas.poisonmax-skilltargets[i].affects[j].formulas.poisonmin)+skilltargets[i].affects[j].formulas.poisonmin);
          let result = skilltargets[i].doGetDamage(dmg);
          if (Game.map[skilltargets[i].Depth].Tiles[skilltargets[i].x][skilltargets[i].y].Visible) {
            Game.messagebox.sendMessage("The " + skilltargets[i].name + " get " + result + " damage from poison.")
          }
        }
        skilltargets[i].affects[j].last -= 1;
        if (skilltargets[i].affects[j].last < 1) Game.removeAffect(skilltargets[i].x,skilltargets[i].y,skilltargets[i].Depth,skilltargets,j);
      }
    }
  }
  Game.player = skilltargets.pop();
  Game.entity = skilltargets;
}
