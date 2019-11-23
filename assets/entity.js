Game.player = {};
Game.entity = [];

Entity = function(properties) {
  properties = properties || {};
  this.x = properties['x'] || 0;
  this.y = properties['y'] || 0;
  this.Depth = properties['y'] || 1;
  Game.map[this.Depth].Tiles[this.x][this.y].Mob = true;
  this.name = properties['name'] || "npc";
  this.acts = properties['acts'] || {};
  this.Vision = properties['Vision'] || 5;
  this.Speed = properties['Speed'] || 10;
  this.Symbol = properties['Symbol'] || 'gorilla';
  this.Hp = properties['Hp'] || 10;
  this.Maxhp = properties['Maxhp'] || 10;
  this.Minatk = properties['Minatk'] || 1;
  this.Maxatk = properties['Maxatk'] || 4;
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
  if ("Candie" in this.acts) {
    this.doDie();
  }
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
    Game.messagebox.sendMessage("The " + this.name + " died.")
    scheduler.remove(this);
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

Entity.prototype.doAttack = function() {
  let dmg = Math.floor(Math.random() * (this.Maxatk - this.Minatk)) + this.Minatk;
  Game.player.Hp -= dmg;
  Game.messagebox.sendMessage("The " + this.name + " hits you for " + dmg + " damage.")
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
  if (path.length > 1) {
    this.Move(path[0][0], path[0][1]);
  } else if ("Attack" in this.acts && path.length == 1) {
    this.doAttack();
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
  this.Maxhp = this.Con * 4;
  this.Speed = 90 + this.Agi * 2;
  this.Maxmana = this.Int * 4;
  this.Hp = this.Maxhp;
  this.Mana = this.Maxmana;
  this.Name = properties['Name'] || "player";
  this.Vision = properties['Vision'] || 5;
  this.Symbol = '@';
  this.HP = properties['HP'] || 10;
  this.getSpeed = function() {
    return this.Speed;
  }
}

Player.prototype.act = function() {
  Game.engine.lock();
  if (Game.player.Hp < 1) {
    Game.messagebox.sendMessage("You died. Press %c{red}F5%c{} to start new game.");
    Game.drawAll();
    return;
  } 
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
  Game.display.draw(Game.GetCamera(Game.player.x, Game.player.y)[0], Game.GetCamera(Game.player.x, Game.player.y)[1], [Game.map[Game.player.Depth].Tiles[Game.player.x][Game.player.y].Symbol, Game.player.Symbol]);
  var xoffset = Game.screenWidth * 4 - 25;
  Game.messages.drawText(xoffset, 1, "Name: " + Game.player.Name);
  Game.messages.drawText(xoffset, 2, "HP: %c{red}" + Game.player.Hp + "/" + Game.player.Maxhp + " %c{}Mana: %c{blue}" + Game.player.Mana + "/" + Game.player.Maxmana);
  Game.messages.drawText(xoffset, 3, "Str: %c{gold}" + Game.player.Str + " %c{}Int: %c{turquoise}" + Game.player.Int);
  Game.messages.drawText(xoffset, 4, "Con: %c{yellowgreen}" + Game.player.Con + " %c{}Agi: %c{wheat}" + Game.player.Agi);
  Game.messages.drawText(xoffset, 5, "Speed: %c{lightblue}" + this.getSpeed() + " %");
  Game.messages.drawText(xoffset, 9, "Lvl: " + Game.player.Depth + " x: " + Game.player.x + " y: " + Game.player.y);
}

Player.prototype.doAttack = function(x, y) {
  for (let i = 0; i < Game.entity.length; i++) {
    if (Game.entity[i].x == x && Game.entity[i].y == y) {
      let dmg = Math.floor(Math.random() * (Game.player.Str)) + Game.player.Str;
      Game.entity[i].Hp -= dmg;
      Game.messagebox.sendMessage("You hits " + Game.entity[i].name + " for " + dmg + " damage.")
      Game.entity[i].doDie();
      Game.drawMap();
      Game.drawEntities();
    }
  }
}

Player.prototype.handleEvent = function(e) {
  var keyMap = {};
  var newx = this.x;
  var newy = this.y;
  var level = Game.player.Depth;
  var code = e.keyCode;
  if (mode.mode == "item") {
    switch (code) {
      case 69:
        Game.doItem("eat");
        break;
      case 68:
        Game.doItem("drop");
        break;
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
    var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;

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
        for (let i = 1;i < Game.map[level].Tiles[newx][newy].items.length; i++) {
          itemname = itemname+", "+Game.map[level].Tiles[newx][newy].items[i].name;
        }
        Game.messagebox.sendMessage("You see the "+itemname+" on the floor.");
      }
    }  
    this.x = newx;
    this.y = newy;
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
