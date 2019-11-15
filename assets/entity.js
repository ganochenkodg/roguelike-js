Game.player = {};

Player = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Name = properties['Name'] || "npc";
  this.Vision = properties['Vision'] || 5;
  this.Speed = properties['Speed'] || 10;
  this.Symbol = properties['Symbol'] || '@';
  this.HP = properties['HP'] || 10;
}

Player.prototype.act = function() {
  Game.engine.lock();
  window.addEventListener("keydown", this);
}

Player.prototype.getSpeed = function() {
  return this.speed;
}

Player.prototype.Draw = function() {
  Game.display.draw(Game.GetCamera(Game.player.x, Game.player.y)[0],Game.GetCamera(Game.player.x, Game.player.y)[1], [Game.map.Tiles[Game.player.x][Game.player.y].Symbol, Game.player.Symbol]);
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
}
