var tileSet = document.createElement("img");
tileSet.src = "assets/tiles.png";

var Game = {
  display: null,
  messages: null,
  engine: null,
  screenWidth: 25,
  screenHeight: 15,
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
      tileMap: {
        "#": [0, 0],
        ".": [32, 0],
        "@": [0, 32]
      }
    });
    this.messages = new ROT.Display({
      width: 80,
      height: 10,
      fontSize: 16
    });
    document.body.appendChild(this.display.getContainer());
    document.body.appendChild(this.messages.getContainer());
    this.generateMap();
    var freeplace = this.returnFree();
    this.player = new Player({
      Name: "player",
      x: freeplace[0],
      y: freeplace[1]
    })
    this.drawMap();
    this.drawEntities();
    this.messages.drawText(1, 1, "Hello world");
    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  }
}

window.onload = function() {
  Game.init();
}
