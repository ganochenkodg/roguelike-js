Game.player = {};
Game.entity = [];

Entity = function(properties) {
  properties = properties || {};
  this.x = properties['x'] || 0;
  this.y = properties['y'] || 0;
  this.Player = false;
  this.Depth = properties['Depth'] || 1;
  this.level = properties['level'] || 1;
  Game.map[this.Depth].Tiles[this.x][this.y].Mob = true;
  this.name = properties['name'] || "npc";
  this.acts = properties['acts'] || {};
  this.drop = properties['drop'] || {};
  this.skills = properties['skills'] || {};
  this.Vision = properties['Vision'] || 5;
  this.Speed = properties['Speed'] || 10;
  this.Symbol = properties['Symbol'] || 'gorilla';
  this.Maxhp = properties['Maxhp'] || 10;
  this.Hp = this.Maxhp;
  this.Minatk = properties['Minatk'] || 1;
  this.Maxatk = properties['Maxatk'] || 4;
  this.Range = properties['Range'] || 1;
  this.Armor = properties['Armor'] || 1;
  this.Crit = properties['Crit'] || 5;
  this.Str = properties['Str'] || 1;
  this.Agi = properties['Agi'] || 1;
  this.Int = properties['Int'] || 1;
  this.Con = properties['Con'] || 1;
  this.getSpeed = function() {
    return this.Speed;
  }
}

function mobPasses(x, y, level) {
  if (typeof level === 'undefined') {
    level = Game.player.Depth;
  }
  if (x > 0 && x < Game.map[level].width && y > 0 && y < Game.map[level].height) {
    return (!(Game.map[level].Tiles[x][y].Blocked) && !(Game.map[level].Tiles[x][y].Mob));
  }
  return false;
}

Entity.prototype.act = function() {
  this.doDie();
  if ("Ballworms" in this.acts) {
    this.doWorms();
  }
  if (this.Depth != Game.player.Depth) {
    return;
  }
  if ("Hunt" in this.acts) {
    this.doHunt();
  }
}

Entity.prototype.doWorms = function() {
  if (!this.hasOwnProperty('wormreplicate')) {
    this.wormreplicate = 5;
  }
  if (this.wormreplicate <= 0 || Math.random() > 0.05) {
    return;
  }
  var xOffset = Math.floor(Math.random() * 3) - 1;
  var yOffset = Math.floor(Math.random() * 3) - 1;

  if (xOffset == 0 && yOffset == 0) {
    return;
  }

  var xLoc = this.x + xOffset;
  var yLoc = this.y + yOffset;

  if (!mobPasses(xLoc, yLoc, this.Depth)) {
    return;
  }
  var tempentity = Game.EntityRepository.create('worm');
  tempentity.x = xLoc;
  tempentity.y = yLoc;
  tempentity.Depth = this.Depth;
  Game.entity.push(tempentity);
  if ("Actor" in Game.entity[Game.entity.length - 1].acts) {
    scheduler.add(Game.entity[Game.entity.length - 1], true);
  }
  if (Game.map[this.Depth].Tiles[this.x][this.y].Visible) {
    Game.messagebox.sendMessage("One worm left the tangle.")
  }
  this.wormreplicate--;
}

Entity.prototype.doDie = function() {
  if (this.Hp < 1) {
    var level = this.Depth;
    if ("Actor" in this.acts) {
      Game.messagebox.sendMessage("The " + this.name + " died.");
    } else {
      Game.messagebox.sendMessage("The " + this.name + " destroyed.");
    }
    scheduler.remove(this);
    if (typeof this.drop !== 'undefined') {
      for (let [key, value] of Object.entries(this.drop)) {
        if (key == "any") {
          let _anyitem = value.split(',');
          if (Math.random() * 100 < _anyitem[2]) {
            let _item = Game.ItemRepository.createRandom(_anyitem[0], _anyitem[1]);
            Game.map[level].Tiles[this.x][this.y].items.push(_item);
          }
        } else {
          if (Math.random() * 100 < value) {
            let _item = Game.ItemRepository.create(key);
            Game.map[level].Tiles[this.x][this.y].items.push(_item);
          }
        }
      }
    }
    Game.map[level].Tiles[this.x][this.y].Mob = false;
    for (var i = 0; i < Game.entity.length; i++) {
      if (Game.entity[i] === this) {
        Game.entity.splice(i, 1);
      }
    }
    Game.drawMap();
    Game.drawEntities();
  }
}

Entity.prototype.doSkills = function() {
  for (let [key, value] of Object.entries(this.skills)) {
    let splitstr = value.split(",");
    if (Math.random() * 100 < splitstr[1]) {
      let _skill = Game.SkillRepository.create(key + "(" + splitstr[0] + ")");
      Game.useSkill(this, _skill, Game.player.x, Game.player.y);
      return;
    }
  }
}

Entity.prototype.doAttack = function() {
  let dmg = Math.floor(Math.random() * (this.Maxatk - this.Minatk)) + this.Minatk - Game.player.Armor - Math.floor(Game.player.Agi / 4);
  dmg = Math.max(1, dmg);
  let _color = "%c{}";
  if (Math.random() * 100 < this.Crit) {
    dmg = dmg * 2;
    _color = "%c{lime}"
  }
  Game.player.Hp -= dmg;
  Game.messagebox.sendMessage("The " + this.name + " hits you for " + _color + dmg + " %c{}damage.");
  Game.drawAll();
}

Entity.prototype.doHunt = function() {
  if (this.Hp < 1) {
    return;
  }
  var level = this.Depth;
  var x = Game.player.x;
  var y = Game.player.y;

  var astar = new ROT.Path.AStar(x, y, mobPasses, {
    topology: 8
  });

  var path = [];
  var pathCallback = function(x, y) {
    path.push([x, y]);
  }
  //костыль. подсчет пути начинается с места самого моба, а по мобам ходить нельзя
  Game.map[level].Tiles[this.x][this.y].Mob = false;
  astar.compute(this.x, this.y, pathCallback);
  Game.map[level].Tiles[this.x][this.y].Mob = true;
  path.shift();
  if (path.length > this.Vision) {
    return;
  }
  if (path.length > this.Range) {
    this.Move(path[0][0], path[0][1]);
  } else if ("Attack" in this.acts && path.length == 1) {
    this.doAttack();
  }
  if ("Skills" in this.acts && path.length < this.Range + 1 && path.length > 0) {
    this.doSkills();
  }
}

Entity.prototype.Move = function(newx, newy) {
  var level = this.Depth;
  Game.map[level].Tiles[this.x][this.y].Mob = false;
  this.x = newx;
  this.y = newy;
  Game.map[level].Tiles[this.x][this.y].Mob = true;
}

Entity.prototype.Draw = function() {
  if (this.Depth != Game.player.Depth) {
    return;
  }
  var level = this.Depth;
  if (Game.map[level].Tiles[this.x][this.y].Visible) {
    let hpbar = Math.floor((this.Hp * 8) / this.Maxhp);
    if (hpbar < 1) {
      hpbar = 1;
    }
    let _color = Game.map[level].Tiles[this.x][this.y].Color;
    Game.display.draw(Game.GetCamera(this.x, this.y)[0], Game.GetCamera(this.x, this.y)[1], [Game.map[level].Tiles[this.x][this.y].Symbol, this.Symbol, "hp" + hpbar], ["#0000", _color, "#0000"]);
  }
}


Player = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Depth = 1;
  this.Str = 5;
  this.Int = 5;
  this.Agi = 5;
  this.Con = 5;
  this.Minatk = 0;
  this.Maxatk = 0;
  this.Armor = 0;
  this.Crit = 0;
  this.Player = true;
  this.Maxhp = this.Con * 4;
  this.Speed = 90 + this.Agi * 2;
  this.Maxmana = this.Int * 4;
  this.Hp = this.Maxhp;
  this.Mana = this.Maxmana;
  this.name = Game.namegen();
  this.Vision = properties['Vision'] || 5;
  this.Symbol = '@';
  this.Hunger = this.Con * 50;
  this.equipment = {};
  this.getSpeed = function() {
    return this.Speed;
  }

}

Player.prototype.doDie = function() {
//zaglushka
}
Player.prototype.act = function() {
  Game.engine.lock();
  if (Game.player.Hunger < 1) {
    Game.player.Hp = Game.player.Hp - Math.floor((Math.random() * Game.player.Con) / 3);
  }
  if (Game.player.Hp < 1 || Game.player.Agi < 1 || Game.player.Str < 1 || Game.player.Int < 1) {
    Game.messagebox.sendMessage("Congratulations, you have died! Press %c{red}F5%c{} to start new game.");
    Game.drawAll();
    return;
  }
  this.doDie();
  window.addEventListener("keydown", this);
}

Player.prototype.godown = function() {
  var stairloc = Game.getStairup(Game.player.Depth + 1);
  Game.player.x = stairloc[0];
  Game.player.y = stairloc[1];
  Game.player.Depth++;
  Game.messagebox.sendMessage("You went down the stairs.");
}

Player.prototype.goup = function() {
  var stairloc = Game.getStairdown(Game.player.Depth - 1);
  Game.player.x = stairloc[0];
  Game.player.y = stairloc[1];
  Game.player.Depth--;
  Game.messagebox.sendMessage("You went up the stairs.");
}


Player.prototype.Draw = function() {
  let _hunger = "%c{crimson}Exhausted";
  if (Game.player.Hunger > (Game.player.Con * 12.5)) {
    _hunger = "%c{darksalmon}Hungry";
  }
  if (Game.player.Hunger > (Game.player.Con * 25)) {
    _hunger = "%c{#eeffee}Normal";
  }
  if (Game.player.Hunger > (Game.player.Con * 40)) {
    _hunger = "%c{lightgreen}Full";
  }
  let _color = Game.map[Game.player.Depth].Tiles[this.x][this.y].Color;
  Game.display.draw(Game.GetCamera(Game.player.x, Game.player.y)[0], Game.GetCamera(Game.player.x, Game.player.y)[1], [Game.map[Game.player.Depth].Tiles[Game.player.x][Game.player.y].Symbol, Game.player.Symbol], ["#0000", _color]);
  var xoffset = Game.screenWidth * 4 - 26;
  Game.messages.drawText(xoffset, 1, "Name: " + Game.player.name + "   " + _hunger);
  Game.messages.drawText(xoffset, 2, "HP: %c{red}" + Game.player.Hp + "/" + Game.player.Maxhp + " %c{}Mana: %c{blue}" + Game.player.Mana + "/" + Game.player.Maxmana);
  Game.messages.drawText(xoffset, 3, "Str: %c{gold}" + Game.player.Str + " %c{}Int: %c{turquoise}" + Game.player.Int);
  Game.messages.drawText(xoffset, 4, "Con: %c{yellowgreen}" + Game.player.Con + " %c{}Agi: %c{wheat}" + Game.player.Agi);
  Game.messages.drawText(xoffset, 5, "Armor: %c{coral}" + (Math.floor(Game.player.Agi / 4) + Game.player.Armor) + " %c{}Speed: %c{lightblue}" + this.getSpeed() + "%");
  Game.messages.drawText(xoffset, 6, "Atk: %c{red}" + (Game.player.Str + Game.player.Minatk) + " - " + (Game.player.Str * 2 + Game.player.Maxatk) + " %c{}Crit: %c{lime}" + Math.min(95, (Game.player.Crit + Math.floor(Game.player.Agi / 2) + 2)) + "%");
  Game.messages.drawText(xoffset, 11, "Lvl: " + Game.player.Depth + " x: " + Game.player.x + " y: " + Game.player.y);
  var item = null;
  if (typeof Game.player.equipment.righthand === 'undefined') {
    item = "-";
  } else {
    item = Game.player.equipment.righthand.name;
  }
  Game.messages.drawText(xoffset, 7, "R. hand: " + item);
  if (typeof Game.player.equipment.lefthand === 'undefined') {
    item = "-";
  } else {
    item = Game.player.equipment.lefthand.name;
  }
  Game.messages.drawText(xoffset, 8, "L. hand: " + item);
  if (typeof Game.player.equipment.body === 'undefined') {
    item = "-";
  } else {
    item = Game.player.equipment.body.name;
  }
  Game.messages.drawText(xoffset, 9, "Body:    " + item);
  if (typeof Game.player.equipment.neck === 'undefined') {
    item = "-";
  } else {
    item = Game.player.equipment.neck.name;
  }
  Game.messages.drawText(xoffset, 10, "Neck:    " + item);
}

Player.prototype.doAttack = function(x, y) {
  this.Hunger = Math.max(0, (this.Hunger - 1));
  for (let i = 0; i < Game.entity.length; i++) {
    if (Game.entity[i].x == x && Game.entity[i].y == y) {
      let dmg = Math.floor(Math.random() * (Game.player.Str + Game.player.Maxatk - Game.player.Minatk)) + Game.player.Str + Game.player.Minatk - Game.entity[i].Armor;
      dmg = Math.max(1, dmg);
      let _color = "%c{}";
      let _crit = Math.min(95, (Game.player.Crit + Math.floor(Game.player.Agi / 2) + 2));
      if (Math.random() * 100 < _crit) {
        dmg = dmg * 2;
        _color = "%c{lime}"
      }
      Game.entity[i].Hp -= dmg;
      Game.messagebox.sendMessage("You hits " + Game.entity[i].name + " for " + _color + dmg + " %c{}damage.")
      Game.entity[i].doDie();
      Game.drawMap();
      Game.drawEntities();
    }
  }
}

Player.prototype.applyStats = function() {
  this.Maxhp = this.Con * 4;
  this.Speed = 90 + this.Agi * 2;
  this.Maxmana = this.Int * 4;
  this.Hp = Math.min(this.Hp, this.Maxhp);
  this.Mana = Math.min(this.Mana, this.Maxmana);
}

Player.prototype.handleEvent = function(e) {
  var newx = this.x;
  var newy = this.y;
  var level = Game.player.Depth;
  var code = e.keyCode;
  var keyMap = {};
  keyMap[38] = 0;
  keyMap[33] = 1;
  keyMap[39] = 2;
  keyMap[34] = 3;
  keyMap[40] = 4;
  keyMap[35] = 5;
  keyMap[37] = 6;
  keyMap[36] = 7;
  if (mode.mode == "skill") {
    newx = mode.skillx;
    newy = mode.skilly;
    switch (code) {
      case 13:
        mode.mode = "play";
        window.removeEventListener("keydown", this);
        Game.useSkill(Game.player, Game.skills[mode.chosenskill], mode.skillx, mode.skilly);
        Game.drawAll();
        Game.engine.unlock();
        return;
        break;
      case 27:
        mode.mode = "play";
        Game.drawAll();
        window.removeEventListener("keydown", this);
        Game.engine.unlock();
        return;
        break;
      case 35:
      case 37:
      case 36:
      case 38:
      case 33:
      case 39:
      case 40:
      case 34:
        var diff = ROT.DIRS[8][keyMap[code]];
        newx = newx + diff[0];
        newy = newy + diff[1];
        break;
      default:
        break;
    }
    var key = newx + "," + newy;
    if (key in mode.skillmap) {
      mode.skillx = newx;
      mode.skilly = newy;
      Game.drawSkillMap();
    }
    return;
  }

  if (mode.mode == "item") {
    switch (code) {
      case 69:
        Game.doItem("eat");
        break;
      case 68:
        Game.doItem("drop");
        break;
      case 87:
        Game.doItem("wield");
      case 27:
        break;
      default:
        Game.messagebox.sendMessage("You cant do this.");
    }
    mode.mode = "play";
    Game.drawAll();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
    return;
  }
  if (mode.mode == "play") {
    switch (code) {
      case 35:
      case 37:
      case 36:
      case 38:
      case 33:
      case 39:
      case 40:
      case 34:
        var diff = ROT.DIRS[8][keyMap[code]];
        newx = newx + diff[0];
        newy = newy + diff[1];
        break;
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        Game.chooseSkill(code - 49);
        return;
        break;
      case 65:
      case 66:
      case 67:
      case 68:
      case 69:
      case 70:
      case 71:
      case 72:
      case 73:
      case 74:
      case 75:
      case 76:
      case 77:
      case 78:
      case 79:
      case 80:
        Game.chooseItem(code - 65);
        return;
        break;
      case 190:
        if (!Game.map[level].Tiles[newx][newy].Stairdown) {
          Game.messagebox.sendMessage("You cant go down there.");

        } else {
          if (typeof Game.map[level + 1] === 'undefined') {
            Game.generateMap(level + 1);
          }
          Game.player.godown();
          newx = this.x;
          newy = this.y;
          level = Game.player.Depth;
        }
        break;
      case 188:
        Game.player.goup();
        newx = this.x;
        newy = this.y;
        level = Game.player.Depth;
        break;
      case 220:
        Game.pickupItem();
        break;
      default:
        //return
        newx = this.x;
        newy = this.y;
    }

    if (Game.map[level].Tiles[newx][newy].Blocked) {
      if (Game.map[level].Tiles[newx][newy].Door) {
        Game.messagebox.sendMessage("You open the door.");
        Game.map[level].Tiles[newx][newy].Door = false;
        Game.map[level].Tiles[newx][newy].Symbol = Game.map[level].Tiles[newx][newy].Symbol.replace('close', 'open');
        Game.map[level].Tiles[newx][newy].Blocked = false;
        Game.map[level].Tiles[newx][newy].BlocksSight = false;
      } else {
        Game.messagebox.sendMessage("You cant walk here.");
      }
      newx = this.x;
      newy = this.y;
    }
    if (Game.map[level].Tiles[newx][newy].Mob) {
      this.doAttack(newx, newy);
      newx = this.x;
      newy = this.y;
    }
    if (typeof Game.map[level].Tiles[newx][newy].items[0] !== 'undefined') {
      if (this.x != newx || this.y != newy) {
        var itemname = Game.map[level].Tiles[newx][newy].items[0].name;
        for (let i = 1; i < Game.map[level].Tiles[newx][newy].items.length; i++) {
          itemname = itemname + ", " + Game.map[level].Tiles[newx][newy].items[i].name;
        }
        Game.messagebox.sendMessage("You see the " + itemname + " on the floor.");
      }
    }
    this.x = newx;
    this.y = newy;
    this.Hunger = Math.max(0, (this.Hunger - 1));
    Game.drawAll();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
  }
}

Game.drawEntities = function() {
  this.player.Draw();
  for (let i = 0; i < Game.entity.length; i++) {
    Game.entity[i].Draw();
  }
}

Hpregen = function() {
  this.getSpeed = function() {
    let speed = Game.player.Con * 5 + 5;
    return speed;
  }
}

Hpregen.prototype.act = function() {
  Game.player.Hp = Math.min(Game.player.Hp + 1, Game.player.Maxhp);
}

Manaregen = function() {
  this.getSpeed = function() {
    let speed = Game.player.Int * 5 + 5;
    return speed;
  }
}

Manaregen.prototype.act = function() {
  Game.player.Mana = Math.min(Game.player.Mana + 1, Game.player.Maxmana);
}
