Game.skills = [];

Skill = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.action = properties['action'] || "";
  this.level = properties['level'] || 1;
  this.options = properties['options'] || {};
  this.Symbol = properties['Symbol'] || "";
  this.target = properties['target'] || '';
  this.type = properties['type'] || '';
}

Game.chooseSkill = function(num) {
  if (typeof Game.skills[num] === 'undefined') {
    Game.messagebox.sendMessage("You havent skill in slot [" + (num + 1)+ "].");
    Game.drawAll();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
    return;
  }
  Game.messages.clear();
  Game.podskazka.draw((num) * 4 + 1, 0, (num+1), "#0f0");
  Game.messages.drawText(1, 1, Game.skills[num].name + "("+Game.skills[num].level +"):");
  var iterator = 1;
  for (let [key, value] of Object.entries(Game.skills[num].options)) {
    iterator++;
    Game.messages.drawText(1, iterator, `${key}: ${value}`);
  }
  Game.player.Draw();
  mode.mode = "skill";
  mode.chosenskill = num;
  Game.generateSkillMap();
  Game.setSkillXY();
  Game.drawSkillMap();
}

Game.setSkillXY = function(){
  var level = Game.player.Depth;
  mode.skillx = Game.player.x;
  mode.skilly = Game.player.y;
  for (let i = 0; i < Game.entity.length; i++) {
    var key = Game.entity[i].x + "," + Game.entity[i].y;
    if (key in mode.skillmap) {
      mode.skillx = Game.entity[i].x;
      mode.skilly = Game.entity[i].y;
      return;
    }
 }
}

Game.generateSkillMap = function() {
  mode.skillmap = {};
  var level = Game.player.Depth;
  fov.compute(Game.player.x, Game.player.y, Game.skills[mode.chosenskill].options.range, function(x, y, r, visibility) {
    mode.skillmap[x+","+y] = 1;
  });
}

Game.drawSkillMap = function() {
  this.drawMap();
  var level = Game.player.Depth;
  fov.compute(Game.player.x, Game.player.y, Game.skills[mode.chosenskill].options.range, function(x, y, r, visibility) {
    let xco = Game.GetCamera(x, y)[0];
    let yco = Game.GetCamera(x, y)[1];
    let _color = "#f882";
    if (yco < Game.screenHeight && yco > -1 && xco < Game.screenWidth && xco > -1) {
      if (typeof Game.map[level].Tiles[x][y].items[0] !== 'undefined') {
        Game.display.draw(xco, yco, [Game.map[level].Tiles[x][y].Symbol, Game.map[level].Tiles[x][y].items[0].Symbol], ["#0000", _color]);
      } else {
        Game.display.draw(xco, yco, Game.map[level].Tiles[x][y].Symbol, _color);
      }
      Game.map[level].Tiles[x][y].Color = _color;
    }
  });
  fov.compute(mode.skillx, mode.skilly, Game.skills[mode.chosenskill].options.radius, function(x, y, r, visibility) {
    let xco = Game.GetCamera(x, y)[0];
    let yco = Game.GetCamera(x, y)[1];
    let _color = "#0f03";
    if (yco < Game.screenHeight && yco > -1 && xco < Game.screenWidth && xco > -1) {
      if (typeof Game.map[level].Tiles[x][y].items[0] !== 'undefined') {
        Game.display.draw(xco, yco, [Game.map[level].Tiles[x][y].Symbol, Game.map[level].Tiles[x][y].items[0].Symbol], ["#0000", _color]);
      } else {
        Game.display.draw(xco, yco, Game.map[level].Tiles[x][y].Symbol, _color);
      }
      Game.map[level].Tiles[x][y].Color = _color;
    }
  });
  Game.player.Draw();
  Game.drawEntities();
};
