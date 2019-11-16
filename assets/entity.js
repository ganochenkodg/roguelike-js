Game.player = {};
Game.entity = {};

Entity = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Name = properties['Name'] || "npc";
  this.Vision = properties['Vision'] || 5;
  this.Speed = properties['Speed'] || 20;
  this.Symbol = properties['Symbol'] || 'gorilla';
  this.HP = properties['HP'] || 10;
  this.getSpeed = function() {
    return this.Speed;
  }
}

Entity.prototype.act = function() {
  var x = Game.player.x;
  var y = Game.player.y;

  var astar = new ROT.Path.AStar(x, y, lightPasses, {
    topology: 8
  });

  var path = [];
  var pathCallback = function(x, y) {
    path.push([x, y]);
  }
  astar.compute(this.x, this.y, pathCallback);

  path.shift();
  if (path.length > 0) {
    this.x = path[0][0];
    this.y = path[0][1];
  }
  Game.messages.drawText(20, 2, "path length: " + path.length);
}

Entity.prototype.Draw = function() {
  Game.display.draw(Game.GetCamera(this.x, this.y)[0], Game.GetCamera(this.x, this.y)[1], [Game.map.Tiles[this.x][this.y].Symbol, this.Symbol]);
  Game.messages.drawText(1, 2, "npc speed: " + this.getSpeed());
}


Player = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Name = properties['Name'] || "player";
  this.Vision = properties['Vision'] || 5;
  this.Speed = properties['Speed'] || 10;
  this.Symbol = properties['Symbol'] || '@';
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
  Game.messages.drawText(1, 3, "player speed: " + this.getSpeed());
}

Player.prototype.handleEvent = function(e) {
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
  /* one of numpad directions? */
  if (!(code in keyMap)) {
    return;
  }
  /* is there a free space? */
  var dir = ROT.DIRS[8][keyMap[code]];
  var newX = this.x + dir[0];
  var newY = this.y + dir[1];
  var newKey = newX + "," + newY;
  if (Game.map.Tiles[newX][newY].Blocked) {
    return;
  }
  this.x = newX;
  this.y = newY;
  Game.drawAll();
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
}

Game.drawEntities = function() {
  this.player.Draw();
  this.entity.Draw();
}
