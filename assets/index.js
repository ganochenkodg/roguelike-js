var scheduler = new ROT.Scheduler.Speed();

var Game = {
  display: null,
  messages: null,
  podzkazka: null,
  engine: null,
  screenWidth: MapWidth,
  screenHeight: MapHeight,
  init: function() {
    if (this.screenWidth < 25) {
      this.screenWidth = 25;
    }
    if (this.screenHeight < 10) {
      this.screenHeight = 10;
    }
    this.display = new ROT.Display({
      width: this.screenWidth,
      height: this.screenHeight + 1,
      layout: "tile",
      tileColorize: true,
      fg: "transparent",
      bg: "transparent",
      tileWidth: 32,
      tileHeight: 32,
      tileSet: tileSet,
      tileMap: gameTilemap
    });
    this.podskazka = new ROT.Display({
      width: this.screenWidth * 4,
      height: 1,
      fontSize: 13
    });
    this.messages = new ROT.Display({
      width: this.screenWidth * 4,
      height: 11,
      fontSize: 13
    });
    document.body.appendChild(this.display.getContainer());
    document.body.appendChild(this.podskazka.getContainer());
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
      if ("Actor" in Game.entity[Game.entity.length - 1].acts) {
        scheduler.add(Game.entity[Game.entity.length - 1], true);
      }
    }
    this.drawAll();
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  }
}

Game.drawBar = function() {
  for (let i = 1; i < 10; i++) {
    Game.podskazka.draw((i - 1) * 4 + 1, 0, i, "beige");
    Game.display.draw((i - 1), Game.screenHeight, "blanksquare");
  }
  var invpodsk = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
  for (let i = 0; i < 16; i++) {
    Game.podskazka.draw((i + Game.screenWidth - 16) * 4 + 2, 0, invpodsk[i], "beige");
    Game.display.draw(i + Game.screenWidth - 16, Game.screenHeight, "blanksquare");
  }
}

Game.drawAll = function() {
  this.messages.clear();
  this.drawMap();
  this.drawBar();
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
  if (Game.map.width - this.player.x - 1 < (Math.round(this.screenWidth / 2))) {
    xoffset = this.player.x + Math.round(this.screenWidth / 2) - Game.map.width;
  }
  if ((Math.round(this.screenHeight / 2) - this.player.y - 1) > 0) {
    yoffset = this.player.y - (Math.round(this.screenHeight / 2)) + 1;
  }
  if (Game.map.height - this.player.y - 1 < (Math.round(this.screenHeight / 2))) {
    yoffset = this.player.y + Math.round(this.screenHeight / 2) - Game.map.height;
  }
  let newx = Math.round(this.screenWidth / 2) + x - this.player.x - 1 + xoffset;
  let newy = Math.round(this.screenHeight / 2) + y - this.player.y - 1 + yoffset;
  return [newx, newy];
}
window.onload = function() {
  Game.init();
}
