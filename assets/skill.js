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
        result = result + Math.floor(Math.random() * skill.formulas.withweapon * (actor.Maxatk - actor.Minatk)) + skill.formulas.withweapon * actor.Minatk;
      }
      var _color = "%c{}";
      var _crit = 0;
      if (skill.options.stat == "agi") {
        result = result + Math.floor(Math.random() * actor.Agi) + actor.Agi;
      }
      if (skill.options.stat == "str") {
        result = result + Math.floor(Math.random() * actor.Str) + actor.Str;
      }
      if (skill.options.stat == "con") {
        result = result + Math.floor(Math.random() * actor.Con) + actor.Con;
      }
      if (skill.options.stat == "int") {
        result = result + Math.floor(Math.random() * actor.Int) + actor.Int;
      }
      _crit = Math.min(95, (actor.Crit + Math.floor(actor.Agi / 2) + 2));
      if (Math.random() * 100 < _crit) {
        result = result * 2;
        _color = "%c{lime}"
      }
      if (key in mode.skillmap) {
        let dmg = result - skilltargets[i].Armor;
        dmg = Math.max(1, dmg);
        if (actor.Player) {
          Game.messagebox.sendMessage("You does " + _color + dmg + " %c{}damage to " + skilltargets[i].name + ".");
        } else {
          Game.messagebox.sendMessage("The " + actor.name + " does " + _color + dmg + " %c{}damage to " + skilltargets[i].name + ".");
        }
        skilltargets[i].Hp = skilltargets[i].Hp - dmg;
        if (i < (skilltargets.length - 1)) {
          skilltargets[i].doDie();
        }
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
    if (key in mode.skillmap) {
      mode.skillx = Game.entity[i].x;
      mode.skilly = Game.entity[i].y;
      return;
    }
  }
}

Game.generateSkillMap = function() {
  mode.skillmap = {};
  var level = Game.player.Depth;
  fov.compute(Game.player.x, Game.player.y, Game.skills[mode.chosenskill].options.range, function(x, y, r, visibility) {
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
