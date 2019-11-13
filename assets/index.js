var tileSet = document.createElement("img");
tileSet.src = "assets/Dungeon.png";

var Game = {
  display: null,
  messages: null,
  screenWidth: 25,
  screenHeight: 15,
  init: function() {
    this.display = new ROT.Display({
      width: this.screenWidth,
      height: this.screenHeight,
      layout: "tile",
      tileWidth: 32,
      tileHeight: 32,
      tileSet: tileSet,
      tileMap: {
        "#": [0, 0],
        ".": [32, 0]
      }
    });
    this.messages = new ROT.Display({
      width: 80,
      height: 10,
      fontSize: 16
    });
    document.body.appendChild(this.display.getContainer());
    document.body.appendChild(this.messages.getContainer());
    this.messages.drawText(1, 1, "Hello world");
    this.generateMap();
    this.drawWholeMap();
  }
}

window.onload = function() {
  Game.init();
}
