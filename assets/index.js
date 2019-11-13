var Game = {
  display: null,
  messages: null,
  screenWidth: 23,
  screenHeight: 15,
  init: function() {
    this.display = new ROT.Display({
      width: this.screenWidth * 4,
      height: this.screenHeight * 2 + 6,
      fontSize: 16
    });
    this.messages = new ROT.Display({
      width: 92,
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
