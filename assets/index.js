var scheduler = new ROT.Scheduler.Speed();
var mode = {
  mode: "play",
  chosenitem: -1,
  chosenskill: -1,
  skillmap: null,
  skillx: -1,
  skilly: -1,
  blinkmap: null
  
}
var Game = {
  display: null,
  messages: null,
  podzkazka: null,
  engine: null,
  hpregen: null,
  manaregen: null,
  screenWidth: MapWidth,
  screenHeight: MapHeight,
  init: function() {
    if (this.screenWidth < 25) {
      this.screenWidth = 25;
    }
    if (this.screenHeight < 10) {
      this.screenHeight = 10;
    }
//init main display
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
//bar with nums
    this.podskazka = new ROT.Display({
      width: this.screenWidth * 4,
      height: 1,
      fontSize: 13
    });
//messages
    this.messages = new ROT.Display({
      width: this.screenWidth * 4,
      height: 13,
      fontSize: 13
    });
    document.body.appendChild(this.display.getContainer());
    document.body.appendChild(this.podskazka.getContainer());
    document.body.appendChild(this.messages.getContainer());
    this.generateMap(1);
    this.messagebox = new Game.MessageBox(Game.screenWidth * 4 - 30, 11);
    var freeplace = this.returnFree(1);
    this.player = new Player({
      Name: "player",
      x: freeplace[0],
      y: freeplace[1],
      Symbol: ROT.RNG.getItem(["dwarf","human","elf"])
    });
    this.hpregen = new Hpregen();
    this.manaregen = new Manaregen();
    scheduler.add(this.hpregen, true);
    scheduler.add(this.manaregen, true);
    scheduler.add(this.player, true);
    let newitem = {};
    for (let i=0; i<6; i++) {
      newitem = Game.ItemRepository.createRandom(1,1);
      Game.inventory.push(newitem);
    }
    newitem = Game.ItemRepository.create("longsword");
    Game.inventory.push(newitem);
    this.drawAll();
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
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
  var level = Game.player.Depth;
  if ((Math.round(this.screenWidth / 2) - this.player.x - 1) > 0) {
    xoffset = this.player.x - (Math.round(this.screenWidth / 2)) + 1;
  }
  if (Game.map[level].width - this.player.x - 1 < (Math.round(this.screenWidth / 2))) {
    xoffset = this.player.x + Math.round(this.screenWidth / 2) - Game.map[level].width;
  }
  if ((Math.round(this.screenHeight / 2) - this.player.y - 1) > 0) {
    yoffset = this.player.y - (Math.round(this.screenHeight / 2)) + 1;
  }
  if (Game.map[level].height - this.player.y - 1 < (Math.round(this.screenHeight / 2))) {
    yoffset = this.player.y + Math.round(this.screenHeight / 2) - Game.map[level].height;
  }
  let newx = Math.round(this.screenWidth / 2) + x - this.player.x - 1 + xoffset;
  let newy = Math.round(this.screenHeight / 2) + y - this.player.y - 1 + yoffset;
  return [newx, newy];
}
window.onload = function() {
  Game.init();
}

Game.printhelp = function() {
  Game.messagebox.sendMessage("Arrows, numpad - Move your character.");
  Game.messagebox.sendMessage("a..p - Choose item from inventory.");
  Game.messagebox.sendMessage("1..9 - Use skill/magic.");
  Game.messagebox.sendMessage("\\ - Pick up item.");
  Game.messagebox.sendMessage("> - Move on the next level of dungeon.");
  Game.messagebox.sendMessage("< - Move on the previous level of dungeon.");
  this.messagebox.Draw();
}
