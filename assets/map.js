Game.map = {};

function lightPasses(x, y) {
  var level = Game.entity[0].Depth;
  if (x > 0 && x < Game.map[level].width && y > 0 && y < Game.map[level].height) {
    return !(Game.map[level].Tiles[x][y].BlocksSight);
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
  this.Stairup = false;
  this.Stairdown = false;
  this.items = [];
};

Game.getStairup = function(level) {
  for (let i = 0; i < Game.map[level].width; i++) {
    for (let j = 0; j < Game.map[level].height; j++) {
      if (Game.map[level].Tiles[i][j].Stairup) {
        return [i, j];
      }
    }
  }
};

Game.getStairdown = function(level) {
  for (let i = 0; i < Game.map[level].width; i++) {
    for (let j = 0; j < Game.map[level].height; j++) {
      if (Game.map[level].Tiles[i][j].Stairdown) {
        return [i, j];
      }
    }
  }
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

Game.returnFree = function(level) {
  var xrand = Math.round(Math.random() * (Game.map[level].width - 1));
  var yrand = Math.round(Math.random() * (Game.map[level].height - 1));
  while (Game.map[level].Tiles[xrand][yrand].Blocked ||Game.map[level].Tiles[xrand][yrand].Mob) {
    xrand = Math.round(Math.random() * (Game.map[level].width - 1));
    yrand = Math.round(Math.random() * (Game.map[level].height - 1));
  }
  return [xrand, yrand];
};

Game.returnDoor = function(level) {
  var xrand = Math.round(Math.random() * (Game.map[level].width - 3)) + 1;
  var yrand = Math.round(Math.random() * (Game.map[level].height - 3)) + 1;
  var result = Game.isDoorReady(xrand, yrand, level);
  while (!result) {
    xrand = Math.round(Math.random() * (Game.map[level].width - 3)) + 1;
    yrand = Math.round(Math.random() * (Game.map[level].height - 3)) + 1;
    result = Game.isDoorReady(xrand, yrand, level);
  }
  return [xrand, yrand];
};

Game.isDoorReady = function(x, y, level) {
  if (Game.map[level].Tiles[x - 1][y].Blocked && Game.map[level].Tiles[x + 1][y].Blocked && !Game.map[level].Tiles[x][y - 1].Blocked && !Game.map[level].Tiles[x][y + 1].Blocked) {
    return true;
  }
  if (Game.map[level].Tiles[x][y - 1].Blocked && Game.map[level].Tiles[x][y + 1].Blocked && !Game.map[level].Tiles[x - 1][y].Blocked && !Game.map[level].Tiles[x + 1][y].Blocked) {
    return true;
  }
  return false;
};

Game.generateMap = function(level) {
  var newmapwidth = Math.floor(Math.random() * 40) + 35;
  var newmapheight = Math.floor(Math.random() * 30) + 15;
  if (Math.random() > 0.1) {
    var digger = new ROT.Map.Uniform(newmapwidth, newmapheight, {
      roomWidth: [2, 10],
      roomHeight: [2, 8],
      corridorLength: [1, 8],
      roomDugPercentage: (Math.random()/2)+0.3
    });
  } else if (Math.random() > 0.4) {
    var digger = new ROT.Map.Digger(newmapwidth, newmapheight, {
      roomWidth: [2, 10],
      roomHeight: [2, 14],
      corridorLength: [1, 10],
      dugPercentage: 0.6
    });
  } else {
    var digger = new ROT.Map.DividedMaze(newmapwidth, newmapheight);
  }
  var terrain = terrains[Math.floor(Math.random() * terrains.length)];
  Game.map[level] = new Game.GameMap(newmapwidth, newmapheight);
  var digCallback = function(x, y, value) {
    if (value) {
      Game.map[level].Tiles[x][y].Symbol = terrain + "wall";
      return;
    }
    Game.map[level].Tiles[x][y].Symbol = terrain + "floor";
    if (Math.random() < 0.02) {
      Game.map[level].Tiles[x][y].Symbol = terrain + "floorrandom";
    }
    Game.map[level].Tiles[x][y].Blocked = false;
    Game.map[level].Tiles[x][y].BlocksSight = false;
  }
  digger.create(digCallback.bind(this));
  var doorplace = null;
  let doornum = Math.floor(Math.random() * 5) + 5;
  for (let i = 0; i < doornum; i++) {
    doorplace = this.returnDoor(level);
    let xloc = doorplace[0];
    let yloc = doorplace[1];
    Game.map[level].Tiles[xloc][yloc].Symbol = terrain + "doorclose";
    Game.map[level].Tiles[xloc][yloc].Blocked = true;
    Game.map[level].Tiles[xloc][yloc].BlocksSight = true;
    Game.map[level].Tiles[xloc][yloc].Door = true;
  }
  //create monsters
  let tempentity = null;
  let freeplace = null;
  let maxmon = Math.floor(Math.random() * level) * 2 + 15;
  for (let i = 0; i < maxmon; i++) {
    freeplace = this.returnFree(level);
    tempentity = Game.EntityRepository.createRandom(level-1,level+1);
    tempentity.x = freeplace[0];
    tempentity.y = freeplace[1];
    tempentity.Depth = level;
    if (Math.random() * 100 < RareMobChance) {
      if (Math.random() * 100 < RareBossChance) {
        tempentity.randomize(3);
      } else {
        tempentity.randomize(2);
      }
    }
    Game.map[level].Tiles[tempentity.x][tempentity.y].Mob = true;
    Game.entity.push(tempentity);
    if ("Actor" in Game.entity[Game.entity.length - 1].acts) {
      scheduler.add(Game.entity[Game.entity.length - 1], true);
    }
  }
  //create stair down
  doorplace = this.returnFree(level);
  let xloc = doorplace[0];
  let yloc = doorplace[1];
  Game.map[level].Tiles[xloc][yloc].Symbol = terrain + "stairdown";
  Game.map[level].Tiles[xloc][yloc].Stairdown = true;
  if (level > 1) {
    doorplace = this.returnFree(level);
    let xloc = doorplace[0];
    let yloc = doorplace[1];
    Game.map[level].Tiles[xloc][yloc].Symbol = terrain + "stairup";
    Game.map[level].Tiles[xloc][yloc].Stairup = true;
  }
};

Game.drawMap = function() {
  Game.clearTiles();
  var level = Game.entity[0].Depth;
  for (let i = 0; i < Game.map[level].width; i++) {
    for (let j = 0; j < Game.map[level].height; j++) {
      let _color = "#000f"
      if (Game.map[level].Tiles[i][j].Visited) {
        _color = "#0009"
      }
      let xco = Game.GetCamera(i, j)[0];
      let yco = Game.GetCamera(i, j)[1];
      if (yco < Game.screenHeight && yco > -1 && xco < Game.screenWidth && xco > -1) {
        if (typeof Game.map[level].Tiles[i][j].items[0] !== 'undefined') {
          this.display.draw(xco, yco, [Game.map[level].Tiles[i][j].Symbol, Game.map[level].Tiles[i][j].items[0].Symbol], ["#0000", _color]);
        } else {
          this.display.draw(xco, yco, Game.map[level].Tiles[i][j].Symbol, _color);
        }
        Game.map[level].Tiles[i][j].Color = _color;
      }
      Game.map[level].Tiles[i][j].Visible = false;
    }
  }
  fov.compute(Game.entity[0].x, Game.entity[0].y, Game.entity[0].Vision, function(x, y, r, visibility) {
    if (r > 9) {
      r = 9;
    }
    let xco = Game.GetCamera(x, y)[0];
    let yco = Game.GetCamera(x, y)[1];
    let _color = "#000" + r;
    if (yco < Game.screenHeight && yco > -1 && xco < Game.screenWidth && xco > -1) {
      if (typeof Game.map[level].Tiles[x][y].items[0] !== 'undefined') {
        Game.display.draw(xco, yco, [Game.map[level].Tiles[x][y].Symbol, Game.map[level].Tiles[x][y].items[0].Symbol], ["#0000", _color]);
      } else {
        Game.display.draw(xco, yco, Game.map[level].Tiles[x][y].Symbol, _color);
      }
      Game.map[level].Tiles[x][y].Color = _color;
    }
    Game.map[level].Tiles[x][y].Visited = true;
    Game.map[level].Tiles[x][y].Visible = true;
  });
};
