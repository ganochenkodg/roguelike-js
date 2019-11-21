Game.map = {};

function lightPasses(x, y) {
  if (x > 0 && x < Game.map.width && y > 0 && y < Game.map.height) {
    return !(Game.map.Tiles[x][y].BlocksSight);
  }
  return false;
}

var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);

Game.Tile = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Blocked = properties['Blocked'] || true;
  this.BlocksSight = properties['BlocksSight'] || true;
  this.Visited = properties['Visited'] || false;
  this.Visible = properties['Visible'] || false;
  this.Symbol = properties['Visible'] || 'dungeonwall';
  this.Mob = false;
  this.Color = "";
  this.Door = false;
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
  var xrand = Math.round(Math.random() * (Game.map.width - 1));
  var yrand = Math.round(Math.random() * (Game.map.height - 1));
  while (Game.map.Tiles[xrand][yrand].Blocked) {
    xrand = Math.round(Math.random() * (Game.map.width - 1));
    yrand = Math.round(Math.random() * (Game.map.height - 1));
  }
  return [xrand, yrand];
};

Game.returnDoor = function() {
  var xrand = Math.round(Math.random() * (Game.map.width - 3)) + 1;
  var yrand = Math.round(Math.random() * (Game.map.height - 3)) + 1;
  var result = Game.isDoorReady(xrand, yrand);
  while ( !result ) {
    xrand = Math.round(Math.random() * (Game.map.width - 3)) + 1;
    yrand = Math.round(Math.random() * (Game.map.height - 3)) + 1;
    result = Game.isDoorReady(xrand, yrand);
  }
  return [xrand, yrand];
};

Game.isDoorReady = function(x, y) {
  if (Game.map.Tiles[x - 1][y].Blocked && Game.map.Tiles[x + 1][y].Blocked && !Game.map.Tiles[x][y - 1].Blocked && !Game.map.Tiles[x][y + 1].Blocked) {
    return true;
  }
  if (Game.map.Tiles[x][y - 1].Blocked && Game.map.Tiles[x][y + 1].Blocked && !Game.map.Tiles[x - 1][y].Blocked && !Game.map.Tiles[x + 1][y].Blocked) {
    return true;
  }
  return false;
};

Game.generateMap = function(level) {
  var newmapwidth =  Math.floor(Math.random () * 40) + 35;
  var newmapheight =  Math.floor(Math.random () * 30) + 15;
  var digger = new ROT.Map.Uniform(newmapwidth, newmapheight, {
    roomWidth: [2, 10],
    roomHeight: [2, 8],
    corridorLength: [1, 8],
    roomDugPercentage: 0.8
  });
  Game.map = new Game.GameMap(newmapwidth, newmapheight);
  var digCallback = function(x, y, value) {
    if (value) {
      Game.map.Tiles[x][y].Symbol = 'dungeonwall';
      return;
    }
    Game.map.Tiles[x][y].Symbol = 'dungeonfloor';
    if (Math.random() < 0.02) {
      Game.map.Tiles[x][y].Symbol = 'dungeonfloorrandom';
    }
    Game.map.Tiles[x][y].Blocked = false;
    Game.map.Tiles[x][y].BlocksSight = false;
  }
  digger.create(digCallback.bind(this));
  var doorplace = null;
  let doornum = Math.floor(Math.random () * 10) + 5;
  for (let i = 0; i < doornum; i++) {
    doorplace = this.returnDoor();
    let xloc = doorplace[0];
    let yloc = doorplace[1];
    Game.map.Tiles[xloc][yloc].Symbol = 'dungeondoorclose';
    Game.map.Tiles[xloc][yloc].Blocked = true;
    Game.map.Tiles[xloc][yloc].BlocksSight = true;
    Game.map.Tiles[xloc][yloc].Door = true;
  }
};

Game.drawMap = function() {
  Game.clearTiles();
  for (let i = 0; i < Game.map.width; i++) {
    for (let j = 0; j < Game.map.height; j++) {
      let _color = "#000f"
      if (Game.map.Tiles[i][j].Visited) {
        _color = "#0007"
      }
      let xco = Game.GetCamera(i, j)[0];
      let yco = Game.GetCamera(i, j)[1];
      if (yco < Game.screenHeight) {
        this.display.draw(xco, yco, Game.map.Tiles[i][j].Symbol, _color);
        Game.map.Tiles[i][j].Color = _color;
      }
      Game.map.Tiles[i][j].Visible = false;
    }
  }
  fov.compute(this.player.x, this.player.y, this.player.Vision, function(x, y, r, visibility) {
    if (r > 11) {
      r = 11;
    }
    let xco = Game.GetCamera(x, y)[0];
    let yco = Game.GetCamera(x, y)[1];
    let _color = "#000" + Math.floor(r / 2);
    if (yco < Game.screenHeight) {
      Game.display.draw(xco, yco, Game.map.Tiles[x][y].Symbol, _color);
      Game.map.Tiles[x][y].Color = _color;
    }
    Game.map.Tiles[x][y].Visited = true;
    Game.map.Tiles[x][y].Visible = true;
  });
};
