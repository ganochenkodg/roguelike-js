Game.map = {};

function lightPasses(x, y) {
  if (x>0 && x<Game.map.width && y>0 && y<Game.map.height) {
    return !(Game.map.Tiles[x][y].Blocked);
  }
  return false;
}

var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);

Game.Tile = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Blocked = properties['Blocked'] || true;
  this.Blocks_sight = properties['Blocks_sight'] || true;
  this.Visited = properties['Visited'] || false;
  this.Visible = properties['Visible'] || false;
  this.Symbol = properties['Visible'] || '#';
};

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
};

Game.returnFree = function() {
  var xrand = Math.round(Math.random() * (this.map.width - 1));
  var yrand = Math.round(Math.random() * (this.map.height - 1));
  while (this.map.Tiles[xrand][yrand].Blocked) {
    xrand = Math.round(Math.random() * (this.map.width - 1));
    yrand = Math.round(Math.random() * (this.map.height - 1));
  }
  return [xrand, yrand];
};

Game.generateMap = function() {
  var digger = new ROT.Map.Uniform(50, 35, {
    roomWidth: [2, 10],
    roomHeight: [2, 8],
    corridorLength: [1, 8],
    roomDugPercentage: 0.8
  });
  this.map = new Game.GameMap(50, 35);
  var digCallback = function(x, y, value) {
    if (value) {
      return;
    }
    this.map.Tiles[x][y].Symbol = '.';
    this.map.Tiles[x][y].Blocked = false;
    this.map.Tiles[x][y].BlocksSight = false;
  }
  digger.create(digCallback.bind(this));
};

Game.drawMap = function() {
  Game.clearTiles();
  for (let i = 0; i < this.map.width; i++) {
    for (let j = 0; j < this.map.height; j++) {
      let _color = "#000f"
      if (this.map.Tiles[i][j].Visited) {
        _color = "#0009"
      }
      this.display.draw(Game.GetCamera(i, j)[0], Game.GetCamera(i, j)[1], this.map.Tiles[i][j].Symbol, _color);
    }
  }
  fov.compute(this.player.x, this.player.y, this.player.Vision, function(x, y, r, visibility) {
    if (r>9) {
      r = 9;
    }
    Game.display.draw(Game.GetCamera(x, y)[0],Game.GetCamera(x, y)[1], Game.map.Tiles[x][y].Symbol, "#000"+r);
    Game.map.Tiles[x][y].Visited = true;
  });
};
