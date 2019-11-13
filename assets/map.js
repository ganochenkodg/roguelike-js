Game.map = {};

Game.Tile = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Blocked = properties['Blocked'] || true;
  this.Blocks_sight = properties['Blocks_sight'] || true;
  this.Visited = properties['Visited'] || false;
  this.Visible = properties['Visible'] || false;
  this.Symbol = properties['Visible'] || '#';
  this.Color = properties['Color'] || '#fff';
}

Game.GameMap = function(width, height) {
  this.width = width;
  this.height = height;
  this.Tiles = {};
  for (let i = 0; i < this.width; i++) {
    this.Tiles[i] = new Array(this.height)
    for (let j = 0; j < this.height; j++) {
      this.Tiles[i][j] = new Game.Tile({
        x: i,
        y: j
      });
    }
  }
}

Game.returnFree = function() {
  var xrand = Math.round(Math.random() * (this.map.width-1));
  var yrand = Math.round(Math.random() * (this.map.height-1));
  while (this.map.Tiles[xrand][yrand].Blocked) {
    xrand = Math.round(Math.random() * (this.map.width-1));
    yrand = Math.round(Math.random() * (this.map.height-1));
  }
  return [xrand, yrand];
};

Game.generateMap = function() {
  var digger = new ROT.Map.Uniform(25, 15, {
    roomWidth: [2, 4],
    roomHeight: [2, 5],
    corridorLength: [1, 8],
    roomDugPercentage: 0.8
  });
  this.map = new Game.GameMap(25, 15);
  var digCallback = function(x, y, value) {
    if (value) {
      return;
    }
    this.map.Tiles[x][y].Symbol = '.';
    this.map.Tiles[x][y].Blocked = false;
    this.map.Tiles[x][y].BlocksSight = false;
  }
  digger.create(digCallback.bind(this));
}

Game.drawMap = function() {
  for (let i = 0; i < this.map.width; i++) {
    for (let j = 0; j < this.map.height; j++) {
      this.display.draw(i, j, this.map.Tiles[i][j].Symbol);
    }
  }
}
