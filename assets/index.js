var tileSet = document.createElement("img");
tileSet.src = "assets/tiles.png";
var scheduler = new ROT.Scheduler.Speed();

var Game = {
  display: null,
  messages: null,
  engine: null,
  screenWidth: MapWidth,
  screenHeight: MapHeight,
  init: function() {
    this.display = new ROT.Display({
      width: this.screenWidth,
      height: this.screenHeight,
      layout: "tile",
      tileColorize: true,
      fg: "transparent",
      bg: "transparent",
      tileWidth: 32,
      tileHeight: 32,
      tileSet: tileSet,
      tileMap: gameTilemap
    });
    this.messages = new ROT.Display({
      width: this.screenWidth * 4,
      height: 11,
      fontSize: 13
    });
    document.body.appendChild(this.display.getContainer());
    document.body.appendChild(this.messages.getContainer());
    this.generateMap();
    this.messagebox = new Game.MessageBox(Game.screenWidth * 4 - 30, 9);
    var freeplace = this.returnFree();
    this.player = new Player({
      Name: "player",
      x: freeplace[0],
      y: freeplace[1]
    })
    scheduler.add(this.player, true);
    var tempentity = null;
    for (let i = 0; i < 17; i++) {
      freeplace = this.returnFree();
      tempentity = Game.EntityRepository.createRandom();
      tempentity.x = freeplace[0];
      tempentity.y = freeplace[1];
      Game.entity.push(tempentity);
      if ("Actor" in Game.entity[Game.entity.length-1].acts) {
        scheduler.add(Game.entity[Game.entity.length-1], true);
      }
    }
    this.drawAll();
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  }
}

Game.drawAll = function() {
  this.messages.clear();
  this.drawMap();
  this.drawEntities();
  this.messagebox.Draw();
}

Game.clearTiles = function() {
  for (let i = 0; i < this.screenWidth; i++) {
    for (let j = 0; j < this.screenHeight; j++) {
      Game.display.draw(i, j, "", "black");
    }
  }
}

Game.GetCamera = function(x, y) {
  let xoffset = 0;
  let yoffset = 0;
  if ((Math.round(this.screenWidth / 2) - this.player.x - 1) > 0) {
    xoffset = this.player.x - (Math.round(this.screenWidth / 2)) + 1;
  }
  if (this.map.width - this.player.x - 1 < (Math.round(this.screenWidth / 2))) {
    xoffset = this.player.x + Math.round(this.screenWidth / 2) - this.map.width;
  }
  if ((Math.round(this.screenHeight / 2) - this.player.y - 1) > 0) {
    yoffset = this.player.y - (Math.round(this.screenHeight / 2)) + 1;
  }
  if (this.map.height - this.player.y - 1 < (Math.round(this.screenHeight / 2))) {
    yoffset = this.player.y + Math.round(this.screenHeight / 2) - this.map.height;
  }
  let newx = Math.round(this.screenWidth / 2) + x - this.player.x - 1 + xoffset;
  let newy = Math.round(this.screenHeight / 2) + y - this.player.y - 1 + yoffset;
  return [newx, newy];
}
window.onload = function() {
  Game.init();
}
