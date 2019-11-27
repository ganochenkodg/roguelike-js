Game.skills = [];

Skill = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.action = properties['action'] || "";
  this.level = properties['level'] || 1;
  this.options = properties['options'] || {};
  this.Symbol = properties['Symbol'] || "";
  this.target = properties['target'] || '';
  this.type = properties['type'] || '';
}

Game.useSkill = function(actor, skill) {
  var result = 0;
  var skilltargets = Game.entity;
  skilltargets.push(Game.player);
  if (actor.Player) {
    if (skill.type == "skill") {
      if (skill.options.cost > Game.player.Hunger) {
        Game.messagebox.sendMessage("You havent enough energy.");
        return;
      } else {
        skilltargets[skilltargets.length-1].Hunger = skilltargets[skilltargets.length-1].Hunger - skill.options.cost;
        Game.messagebox.sendMessage("You use " + skill.name + "(" + skill.level + ").");
      }
    }
    if (skill.type == "spell") {
      if (skill.options.cost > Game.player.Mana) {
        Game.messagebox.sendMessage("You havent enough mana.");
        return;
      } else {
        skilltargets[skilltargets.length-1].Mana = skilltargets[skilltargets.length-1].Mana - skill.options.cost;
        Game.messagebox.sendMessage("You cast " + skill.name + "(" + skill.level + ").");
      }
    }
  }
  if (skill.target == "range") {
    mode.skillmap = {};
    var level = Game.player.Depth;
    fov.compute(mode.skillx, mode.skilly, skill.options.radius, function(x, y, r, visibility) {
      mode.skillmap[x + "," + y] = 1;
    });
    for (let i = 0; i < skilltargets.length; i++) {
      var key = skilltargets[i].x + "," + skilltargets[i].y;
      if (skill.name == "Shoot") {
        result = Math.floor(Math.random() * skill.level) + 4 * skill.level;
      }
      if (skill.name == "Fireball") {
        result = Math.floor(Math.random() * skill.level) + 8 * skill.level;
      }
      var _color = "%c{}";
      var _crit = 0;
      if (actor.Player) {
        if (skill.options.stat == "agi") {
          result = result + Math.floor(Math.random() * Game.player.Agi) + Game.player.Agi;
        }
        if (skill.options.stat == "str") {
          result = result + Math.floor(Math.random() * Game.player.Str) + Game.player.Str;
        }
        if (skill.options.stat == "con") {
          result = result + Math.floor(Math.random() * Game.player.Con) + Game.player.Con;
        }
        if (skill.options.stat == "int") {
          result = result + Math.floor(Math.random() * Game.player.Int) + Game.player.Int;
        }
        _crit = Math.min(95, (Game.player.Crit + Math.floor(Game.player.Agi / 2) + 2));
        if (Math.random() * 100 < _crit) {
          result = result * 2;
          _color = "%c{lime}"
        }
      } else {
        let _crit = Math.min(95, actor.Crit);
        if (Math.random() * 100 < _crit) {
          result = result * 2;
          _color = "%c{lime}"
        }
      }      
      if (key in mode.skillmap) {
        let dmg = result - Game.entity[i].Armor;
        dmg = Math.max(1, dmg);
        if (actor.Player) {
          Game.messagebox.sendMessage("You does " + _color + dmg + " %c{}damage to " + skilltargets[i].name + ".");
        } else {
          Game.messagebox.sendMessage("The " + actor + " does " + _color + dmg + " %c{}damage to " + skilltargets[i].name + ".");
        }
        skilltargets[i].Hp = skilltargets[i].Hp - dmg;
        if (i<(skilltargets.length -1)) {skilltargets[i].doDie(); }
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
    let _color = "#f882";
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
    let _color = "#0f03";
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
