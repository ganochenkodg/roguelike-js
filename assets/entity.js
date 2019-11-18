Game.player = {};
Game.entity = [];

Entity = function(properties) {
  properties = properties || {};
  this.x = properties['x']||0;
  this.y = properties['y']||0;
  Game.map.Tiles[this.x][this.y].Mob = true;
  this.Name = properties['Name'] || "npc";
  this.acts = properties['acts'] || {};
  this.Vision = properties['Vision'] || 5;
  this.Speed = properties['Speed'] || 10;
  this.Symbol = properties['Symbol'] || 'gorilla';
  this.Hp = properties['Hp'] || 10;
  this.Maxhp = properties['Maxhp'] || 10;
  this.getSpeed = function() {
    return this.Speed;
  }
}

function mobPasses(x, y) {
  if (x > 0 && x < Game.map.width && y > 0 && y < Game.map.height) {
    return (!(Game.map.Tiles[x][y].Blocked) && !(Game.map.Tiles[x][y].Mob));
  }
  return false;
}

Entity.prototype.act = function() {
  if ("Hunt" in this.acts) {
    this.doHunt();
  }
}

Entity.prototype.doHunt = function() {
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
  Game.map.Tiles[this.x][this.y].Mob = false;
  astar.compute(this.x, this.y, pathCallback);
  Game.map.Tiles[this.x][this.y].Mob = true;
  path.shift();
  if (path.length > this.Vision) {
    return;
  }
  if (path.length > 1) {
    this.Move(path[0][0], path[0][1]);
  }
}

Entity.prototype.Move = function(newx, newy) {
  Game.map.Tiles[this.x][this.y].Mob = false;
  this.x = newx;
  this.y = newy;
  Game.map.Tiles[this.x][this.y].Mob = true;
}

Entity.prototype.Draw = function() {
  if (Game.map.Tiles[this.x][this.y].Visible) {
    Game.display.draw(Game.GetCamera(this.x, this.y)[0], Game.GetCamera(this.x, this.y)[1], [Game.map.Tiles[this.x][this.y].Symbol, this.Symbol]);
  }
}


Player = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Str = 5;
  this.Int = 5;
  this.Agi = 5;
  this.Con = 5;
  this.Maxhp = this.Con * 4;
  this.Speed = this.Agi * 2;
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
  window.addEventListener("keydown", this);
}


Player.prototype.Draw = function() {
  Game.display.draw(Game.GetCamera(Game.player.x, Game.player.y)[0], Game.GetCamera(Game.player.x, Game.player.y)[1], [Game.map.Tiles[Game.player.x][Game.player.y].Symbol, Game.player.Symbol]);
  var xoffset = Game.screenWidth * 4 - 25;
  Game.messages.drawText(xoffset, 1, "Name: " + Game.player.Name);
  Game.messages.drawText(xoffset, 2, "HP: %c{red}" + Game.player.Hp + "/" + Game.player.Maxhp + " %c{}Mana: %c{blue}"+ Game.player.Mana + "/" + Game.player.Maxmana);
  Game.messages.drawText(xoffset,3,"Str: %c{gold}" + Game.player.Str + " %c{}Int: %c{turquoise}" + Game.player.Int);
  Game.messages.drawText(xoffset,4,"Con: %c{yellowgreen}" + Game.player.Con + " %c{}Agi: %c{wheat}" + Game.player.Agi);  
  Game.messages.drawText(xoffset, 9, "Speed: %c{lightblue}" + this.getSpeed()+" %c{}x: " + Game.player.x + " y: " + Game.player.y);
}

Player.prototype.handleEvent = function(e) {
  var keyMap = {};
  var newx = this.x;
  var newy = this.y;
  var keyMap = {};
  keyMap[38] = 0;
  keyMap[33] = 1;
  keyMap[39] = 2;
  keyMap[34] = 3;
  keyMap[40] = 4;
  keyMap[35] = 5;
  keyMap[37] = 6;
  keyMap[36] = 7;

  var code = e.keyCode;
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
    default:
      //return
      var newx = this.x;
      var newy = this.y;
  }

  if (Game.map.Tiles[newx][newy].Blocked) {
    //    return;
    var newx = this.x;
    var newy = this.y;
  }
  this.x = newx;
  this.y = newy;
  Game.drawAll();
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
}

Game.drawEntities = function() {
  this.player.Draw();
  for (let i = 0; i < Game.entity.length; i++) {
    Game.entity[i].Draw();
  }
}
