var Game = {
  display: null,
  screenWidth: 23,
  screenHeight: 15,
  init: function() {
    this.display = new ROT.Display({
      width: this.screenWidth * 4,
      height: this.screenHeight * 2 + 6,
      fontSize: 16
    });
    document.body.appendChild(this.display.getContainer());
    this.generateMap();
    this.drawWholeMap();
  }
}

window.onload = function() {
        Game.init();
      }
