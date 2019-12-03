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
  checkaffects: null,
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
      height: 14,
      fontSize: 13
    });
    document.body.appendChild(this.display.getContainer());
    document.body.appendChild(this.podskazka.getContainer());
    document.body.appendChild(this.messages.getContainer());
    this.generateMap(1);
    this.messagebox = new Game.MessageBox(Game.screenWidth * 4 - 30, 12);
    var freeplace = this.returnFree(1);
    let _player = new Player({
      Name: "player",
      x: freeplace[0],
      y: freeplace[1],
      Symbol: ROT.RNG.getItem(["dwarf","human","elf"])
    });
    Game.entity.unshift(_player);
    this.hpregen = new Hpregen();
    this.manaregen = new Manaregen();
    this.checkaffects = new AffectsCheck();
    scheduler.add(this.hpregen, true);
    scheduler.add(this.manaregen, true);
    scheduler.add(Game.entity[0], true);
    scheduler.add(this.checkaffects, true);
    let newitem = {};
    for (let i=0; i<6; i++) {
      newitem = Game.ItemRepository.createRandom(1,1);
      Game.inventory.push(newitem);
    }
//    newitem = Game.ItemRepository.create("bookofice");
//    Game.inventory.push(newitem);
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
  var level = Game.entity[0].Depth;
  if ((Math.round(this.screenWidth / 2) - Game.entity[0].x - 1) > 0) {
    xoffset = Game.entity[0].x - (Math.round(this.screenWidth / 2)) + 1;
  }
  if (Game.map[level].width - Game.entity[0].x - 1 < (Math.round(this.screenWidth / 2))) {
    xoffset = Game.entity[0].x + Math.round(this.screenWidth / 2) - Game.map[level].width;
  }
  if ((Math.round(this.screenHeight / 2) - Game.entity[0].y - 1) > 0) {
    yoffset = Game.entity[0].y - (Math.round(this.screenHeight / 2)) + 1;
  }
  if (Game.map[level].height - Game.entity[0].y - 1 < (Math.round(this.screenHeight / 2))) {
    yoffset = Game.entity[0].y + Math.round(this.screenHeight / 2) - Game.map[level].height;
  }
  let newx = Math.round(this.screenWidth / 2) + x - Game.entity[0].x - 1 + xoffset;
  let newy = Math.round(this.screenHeight / 2) + y - Game.entity[0].y - 1 + yoffset;
  return [newx, newy];
}
window.onload = function() {
  Game.init();
}

Game.printhelp = function() {
  Game.messagebox.sendMessage("Arrows, numpad - Move your character.");
  Game.messagebox.sendMessage("a..p - Choose item from inventory.");
  Game.messagebox.sendMessage("1..9 - Use skill/magic.");
  Game.messagebox.sendMessage("w - Worship the God of Random.");
  Game.messagebox.sendMessage("\\ - Pick up item.");
  Game.messagebox.sendMessage("> - Move on the next level of dungeon.");
  Game.messagebox.sendMessage("< - Move on the previous level of dungeon.");
  this.messagebox.Draw();
}
