Game.entity = [];

Entity = function(properties) {
  properties = properties || {};
  this.x = properties['x'] || 0;
  this.y = properties['y'] || 0;
  this.Player = false;
  this.Depth = properties['Depth'] || 1;
  this.level = properties['level'] || 1;
  Game.map[this.Depth].Tiles[this.x][this.y].Mob = true;
  this.name = properties['name'] || "npc";
  this.acts = properties['acts'] || {};
  this.drop = properties['drop'] || {};
  this.skills = properties['skills'] || {};
  this.Vision = properties['Vision'] || 5;
  this.Speed = properties['Speed'] || 100;
  this.Symbol = properties['Symbol'] || 'gorilla';
  this.Maxhp = properties['Maxhp'] || 10;
  this.Hp = this.Maxhp;
  this.Color = "#0000";
  this.confuse = false;
  this.stun = false;
  this.summoned = false;
  this.savecorpse = false;
  this.Minatk = properties['Minatk'] || 1;
  this.Maxatk = properties['Maxatk'] || 4;
  this.Range = properties['Range'] || 1;
  this.SkillRange = properties['SkillRange'] || 3;
  this.Armor = properties['Armor'] || 1;
  this.Crit = properties['Crit'] || 5;
  this.Str = properties['Str'] || 1;
  this.Agi = properties['Agi'] || 1;
  this.Int = properties['Int'] || 1;
  this.Con = properties['Con'] || 1;
  this.rareness = 1;
  this.rarechance = RareItemDefaultChance;
  this.affects = [];
  this.timestamp = Math.random()*1000 + Date.now();
  this.getSpeed = function() {
    return this.Speed;
  }
}

function mobPasses(x, y, level) {
  if (typeof level === 'undefined') {
    level = Game.entity[0].Depth;
  }
  if (x > 0 && x < Game.map[level].width && y > 0 && y < Game.map[level].height) {
    return (!(Game.map[level].Tiles[x][y].Blocked) && !(Game.map[level].Tiles[x][y].Mob));
  }
  return false;
}

Entity.prototype.randomize = function(rare) {
  if (rare == 2) {
    this.name = "%c{lightsalmon}rare " + this.name + "%c{}";
  }
  if (rare == 3) {
    this.name = "%c{skyblue}epic " + this.name + "%c{}";
    this.acts.Skills = true;
    this.SkillRange = 2+Math.floor(Math.random()*2);
    for (let i = 0; i < (rare - 1);i++) {
      let _skilllevel = Math.floor(this.level/5);
      let _randomProperty = null;
      switch (_skilllevel) {
        case 0:
          _randomProperty = ROT.RNG.getItem(["Weakness","Power", "Confusing touch", "Poison dart", "Magicdart", "Freeze", "Throw ice", "Throw flame"]);
          break;
//i havent enough highlevel skills
        default:
          _randomProperty = ROT.RNG.getItem(["Poison bolt", "Battle hymn", "Wall of fire", "Fireball", "Freeze", "Haste", "Ice armor", "Throw ice", "Throw flame"]);
          break;
      }  
      this.skills[_randomProperty] = Math.floor((Math.random()*2+1))+","+Math.floor((Math.random()*30+15));
    }
  }
  this.rareness = rare;
  this.rarechance = 40 + rare*20;
  this.drop.any = this.level+","+(this.level+rare)+","+(40 + rare*20);
  for (let i = 0; i < Math.floor(1+rare/2);i++) {
     let _randomProperty = ROT.RNG.getItem(["Hp", "Speed", "Minatk", "Maxatk", "Armor", "Crit", "Str", "Int"]);
       if (_randomProperty != "speed") {
         this[_randomProperty] = Math.floor(this[_randomProperty]*(Math.random()*rare+1));
       } else {
         this[_randomProperty] = Math.floor(this[_randomProperty]*(Math.random()*(rare/4)+1));
         if (_randomProperty == "Hp") this.Maxhp = this.Hp;
       }
  }
  
}

Entity.prototype.act = function() {
  this.doDie();
  if (this.stun) {
    return;
  }
  if ("Ballworms" in this.acts) {
    this.doWorms();
  }
  if (this.Depth != Game.entity[0].Depth) {
    return;
  }
  if ("Hunt" in this.acts) {
    this.doHunt();
  }
}

Entity.prototype.doWorms = function() {
  if (!this.hasOwnProperty('wormreplicate')) {
    this.wormreplicate = 5;
  }
  if (this.wormreplicate <= 0 || Math.random() > 0.05) {
    return;
  }
  var xOffset = Math.floor(Math.random() * 3) - 1;
  var yOffset = Math.floor(Math.random() * 3) - 1;

  if (xOffset == 0 && yOffset == 0) {
    return;
  }

  var xLoc = this.x + xOffset;
  var yLoc = this.y + yOffset;

  if (!mobPasses(xLoc, yLoc, this.Depth)) {
    return;
  }
  var tempentity = Game.EntityRepository.create('worm');
  tempentity.x = xLoc;
  tempentity.y = yLoc;
  tempentity.Depth = this.Depth;
  Game.entity.push(tempentity);
  if ("Actor" in Game.entity[Game.entity.length - 1].acts) {
    scheduler.add(Game.entity[Game.entity.length - 1], true);
  }
  if (Game.map[this.Depth].Tiles[this.x][this.y].Visible) {
    Game.messagebox.sendMessage("One worm left the tangle.")
  }
  this.wormreplicate--;
}

Entity.prototype.doUnsummon = function() {
  scheduler.remove(this);
  var level = this.Depth;
  Game.map[level].Tiles[this.x][this.y].Mob = false;
  Game.messagebox.sendMessage("The "+this.name+" is unsummoned.");
  for (var i = 0; i < Game.entity.length; i++) {
    if (Game.entity[i] === this) {
      Game.entity.splice(i, 1);
    }
  }
  Game.drawAll();
}

Entity.prototype.doDie = function() {
  if (this.Hp < 1) {
    var level = this.Depth;
    if ("Actor" in this.acts) {
      Game.messagebox.sendMessage("The " + this.name + " died.");
    } else {
      Game.messagebox.sendMessage("The " + this.name + " destroyed.");
    }
    scheduler.remove(this);
    if (this.savecorpse && !this.summoned) {
      let _corpse = Game.ItemRepository.create("corpse");
      _corpse.name = this.name + "'s corpse";
      _corpse.corpse = this;
      Game.map[level].Tiles[this.x][this.y].items.push(_corpse);
    }
    if (typeof this.drop !== 'undefined' && !this.summoned) {
      for (let [key, value] of Object.entries(this.drop)) {
        if (key == "any") {
          let _anyitem = value.split(',');
          if (Math.random() * 100 < _anyitem[2]) {
            let _item = Game.ItemRepository.createRandom(_anyitem[0], _anyitem[1]);
            if (Math.random() * 100 < this.rarechance) _item.randomize(this.rareness);
            Game.map[level].Tiles[this.x][this.y].items.push(_item);
          }
        } else {
          if (Math.random() * 100 < value) {
            let _item = Game.ItemRepository.create(key);
            if (Math.random() * 100 < this.rarechance) _item.randomize(this.rareness);
            Game.map[level].Tiles[this.x][this.y].items.push(_item);
          }
        }
      }
    }
    Game.map[level].Tiles[this.x][this.y].Mob = false;
    for (var i = 0; i < Game.entity.length; i++) {
      if (Game.entity[i] === this) {
        Game.entity.splice(i, 1);
      }
    }
    Game.drawAll();
  }
}

Entity.prototype.doSkills = function(targetnum) {
  for (let [key, value] of Object.entries(this.skills)) {
    let splitstr = value.split(",");
    if (Math.random() * 100 < splitstr[1]) {
      let _skill = Game.SkillRepository.create(key + "(" + splitstr[0] + ")");
      if (_skill.target == "range") {
        Game.useSkill(this, _skill, Game.entity[targetnum].x, Game.entity[targetnum].y);
      }
      if (_skill.target == "self") {
        Game.useSkill(this, _skill, this.x, this.y);
      }
      return;
    }
  }
}

Entity.prototype.doAttack = function(targetnum) {
  let dmg = Math.floor((Math.random() * (this.Str/2 + this.Maxatk - this.Minatk)) + this.Str/2 + this.Minatk);
  let _color = "%c{}";
  if (Math.random() * 100 < this.Crit) {
    dmg = dmg * 2;
    _color = "%c{lime}"
  }
  if (this.confuse && Math.random() > 0.5) {
    let _confused = ROT.DIRS[8][Math.floor(Math.random() * 7)];
    newx = this.x + _confused[0];
    newy = this.y + _confused[1];
    for (let i = 0; i < Game.entity.length; i++) {
      if (Game.entity[i].x == newx && Game.entity[i].y == newy && Game.entity[i].Depth == this.Depth) {
        let result = Game.entity[i].doGetDamage(dmg);
        Game.messagebox.sendMessage("The " + this.name + " hits " + Game.entity[i].name + " for " + _color + result + " %c{}damage.");
        Game.entity[i].doDie();
      }
    }
  } else {
    let result = Game.entity[targetnum].doGetDamage(dmg);
    Game.messagebox.sendMessage("The " + this.name + " hits "+Game.entity[targetnum].name+" for " + _color + result + " %c{}damage.");
  }
  Game.drawAll();
}

Entity.prototype.doGetDamage = function(dmg) {
  dmg -= this.Armor;
  dmg = Math.max(1, dmg);
  this.Hp -= dmg;
  return dmg;
}

Entity.prototype.doHunt = function() {
  if (this.Hp < 1) {
    return;
  }
  var level = this.Depth;
  var targetnum = 0;
  //ai for summoned
  if (this.summoned) {
    let enemyradius = this.Vision + 1;
    let enemymap = [];
    fov.compute(this.x, this.y, this.Vision, function(x, y, r, visibility) {
      enemymap[x + "," + y] = r;
    });
    for (let i = 1; i < Game.entity.length; i++) {
      var key = Game.entity[i].x + "," + Game.entity[i].y;
      console.log(key+" "+enemymap[key]);
      if (key in enemymap && !Game.entity[i].summoned && enemymap[key]<enemyradius) {
        enemyradius = enemymap[key];
        targetnum = i;
      }
    }
  }
  var x = Game.entity[targetnum].x;
  var y = Game.entity[targetnum].y;

  var astar = new ROT.Path.AStar(x, y, mobPasses, {
    topology: 8
  });

  var path = [];
  var pathCallback = function(x, y) {
    path.push([x, y]);
  }
  //костыль. подсчет пути начинается с места самого моба, а по мобам ходить нельзя
  Game.map[level].Tiles[this.x][this.y].Mob = false;
  astar.compute(this.x, this.y, pathCallback);
  Game.map[level].Tiles[this.x][this.y].Mob = true;
  path.shift();
  if (path.length > this.Vision) {
    return;
  }
  if (path.length > this.Range) {
    if (this.confuse && Math.random() > 0.5) {
      let _confused = ROT.DIRS[8][Math.floor(Math.random() * 7)];
      let newx = this.x + _confused[0];
      let newy = this.y + _confused[1];
      this.Move(newx, newy);
    } else {
      this.Move(path[0][0], path[0][1]);
    }
  } else if ("Attack" in this.acts && path.length == 1) {
    if ((this.summoned && targetnum !=0) || (!this.summoned && targetnum ==0)) {
      this.doAttack(targetnum);
    }
  }
  if ("Skills" in this.acts && path.length < this.SkillRange + 1 && path.length > 0) {
    if ((this.summoned && targetnum !=0) || (!this.summoned && targetnum ==0)) {
    this.doSkills(targetnum);
  }
  }
}

Entity.prototype.Move = function(newx, newy) {
  var level = this.Depth;
  Game.map[level].Tiles[this.x][this.y].Mob = false;
  this.x = newx;
  this.y = newy;
  Game.map[level].Tiles[this.x][this.y].Mob = true;
}

Entity.prototype.Draw = function() {
  if (this.Depth != Game.entity[0].Depth) {
    return;
  }
  var level = this.Depth;
  if (Game.map[level].Tiles[this.x][this.y].Visible) {
    let hpbar = Math.min(8,Math.floor((this.Hp * 8) / this.Maxhp));
    if (hpbar < 1) {
      hpbar = 1;
    }
    let _color = Game.map[level].Tiles[this.x][this.y].Color;
    if (this.summoned) {
      var hpmod = 30;
    } else {
      var hpmod = (this.rareness-1)*8;
    }
    Game.display.draw(Game.GetCamera(this.x, this.y)[0], Game.GetCamera(this.x, this.y)[1], [Game.map[level].Tiles[this.x][this.y].Symbol, this.Symbol, "hp" + (hpbar+hpmod)], [_color, this.Color, "#0000"], ["transparent", "transparent", "transparent"]);
  }
}


Player = function(properties) {
  properties = properties || {};
  this.x = properties['x'];
  this.y = properties['y'];
  this.Depth = 1;
  this.Str = 5;
  this.Int = 5;
  this.Agi = 5;
  this.Con = 5;
  this.Minatk = 0;
  this.Maxatk = 0;
  this.Armor = 0;
  this.Crit = 0;
  this.religion = 10;
  this.Player = true;
  this.Maxhp = this.Con * 4;
  this.Speed = 90;
  this.Color = "#0000";
  this.Maxmana = this.Int * 4;
  this.Hp = this.Maxhp;
  this.Mana = this.Maxmana;
  this.name = Game.namegen();
  this.Vision = properties['Vision'] || 5;
  this.Symbol = properties['Symbol'] || 'human';
  this.Hunger = this.Con * 50;
  this.confuse = false;
  this.stun = false;
  this.equipment = {};
  this.affects = [];
  this.books = [];
  this.getSpeed = function() {
    return (this.Speed + this.Agi * 2);
  }

}

Player.prototype.doDie = function() {
  //zaglushka
}

Player.prototype.doGetDamage = function(dmg) {
  dmg -= Game.entity[0].Armor + Math.floor(Game.entity[0].Agi / 4);
  dmg = Math.max(1, dmg);
  this.Hp -= dmg;
  return dmg;
}

Player.prototype.act = function() {
  if (this.stun) {
    return;
  }
  Game.engine.lock();
  Game.entity[0].applyStats();
  if (Game.entity[0].Hunger < 1) {
    Game.entity[0].Hp = Game.entity[0].Hp - Math.floor((Math.random() * Game.entity[0].Con) / 3);
  }
  if (Game.entity[0].Hp < 1 || Game.entity[0].Agi < 1 || Game.entity[0].Str < 1 || Game.entity[0].Int < 1) {
    Game.messagebox.sendMessage("Congratulations, you have died! Press %c{red}F5%c{} to start new game.");
    Game.drawAll();
    return;
  }
  this.doDie();
  window.addEventListener("keydown", this);
}

Player.prototype.godown = function() {
  var stairloc = Game.getStairup(Game.entity[0].Depth + 1);
  Game.entity[0].x = stairloc[0];
  Game.entity[0].y = stairloc[1];
  Game.entity[0].Depth++;
  Game.messagebox.sendMessage("You went down the stairs.");
}

Player.prototype.goup = function() {
  var stairloc = Game.getStairdown(Game.entity[0].Depth - 1);
  Game.entity[0].x = stairloc[0];
  Game.entity[0].y = stairloc[1];
  Game.entity[0].Depth--;
  Game.messagebox.sendMessage("You went up the stairs.");
}


Player.prototype.Draw = function() {
  let _hunger = "%c{crimson}Exhausted";
  if (Game.entity[0].Hunger > (Game.entity[0].Con * 12.5)) {
    _hunger = "%c{darksalmon}Hungry";
  }
  if (Game.entity[0].Hunger > (Game.entity[0].Con * 25)) {
    _hunger = "%c{#eeffee}Normal";
  }
  if (Game.entity[0].Hunger > (Game.entity[0].Con * 40)) {
    _hunger = "%c{lightgreen}Full";
  }
  let _color = Game.map[Game.entity[0].Depth].Tiles[this.x][this.y].Color;
  Game.display.draw(Game.GetCamera(Game.entity[0].x, Game.entity[0].y)[0], Game.GetCamera(Game.entity[0].x, Game.entity[0].y)[1], [Game.map[Game.entity[0].Depth].Tiles[Game.entity[0].x][Game.entity[0].y].Symbol, Game.entity[0].Symbol], [_color, this.Color], ["transparent", "transparent"]);
  var xoffset = Game.screenWidth * 4 - 27;
  Game.messages.drawText(xoffset, 1, "Name: " + Game.entity[0].name + "   " + _hunger);
  Game.messages.drawText(xoffset, 2, "HP: %c{red}" + Game.entity[0].Hp + "/" + Game.entity[0].Maxhp + " %c{}Mana: %c{blue}" + Game.entity[0].Mana + "/" + Game.entity[0].Maxmana);
  Game.messages.drawText(xoffset, 3, "Str: %c{gold}" + Game.entity[0].Str + " %c{}Int: %c{turquoise}" + Game.entity[0].Int);
  Game.messages.drawText(xoffset, 4, "Con: %c{yellowgreen}" + Game.entity[0].Con + " %c{}Agi: %c{wheat}" + Game.entity[0].Agi);
  Game.messages.drawText(xoffset, 5, "Armor: %c{coral}" + (Math.floor(Game.entity[0].Agi / 4) + Game.entity[0].Armor) + " %c{}Speed: %c{lightblue}" + this.getSpeed() + "%");
  Game.messages.drawText(xoffset, 6, "Atk: %c{red}" + Math.floor(Game.entity[0].Str/2 + Game.entity[0].Minatk) + " - " + (Game.entity[0].Str + Game.entity[0].Maxatk) + " %c{}Crit: %c{lime}" + Math.min(95, (Game.entity[0].Crit + Math.floor(Game.entity[0].Agi / 2) + 2)) + "%");
  Game.messages.drawText(xoffset, 11, "Lvl: " + Game.entity[0].Depth + " x: " + Game.entity[0].x + " y: " + Game.entity[0].y);
  let _piety = "%c{crimson}Nobody";
  if (Game.entity[0].religion > 20) {
    _piety = "%c{darksalmon}Noncommittal";
  }
  if (Game.entity[0].religion > 40) {
    _piety = "%c{lightsalmon}Noted your presence";
  }
  if (Game.entity[0].religion > 80) {
    _piety = "%c{peachpuff}Pleased";
  }
  if (Game.entity[0].religion > 150) {
    _piety = "%c{lightyellow}Most pleased";
  }
  if (Game.entity[0].religion > 220) {
    _piety = "%c{AntiqueWhite}Rising star";
  }
  if (Game.entity[0].religion > 300) {
    _piety = "%c{ivory}Shining star";
  }
  if (Game.entity[0].religion > 400) {
    _piety = "%c{white}Chosen one";
  }
  Game.messages.drawText(xoffset, 12, "Piety: " + _piety);
  var item = null;
  if (typeof Game.entity[0].equipment.righthand === 'undefined') {
    item = "-";
  } else {
    item = Game.entity[0].equipment.righthand.name;
  }
  Game.messages.drawText(xoffset, 7, "R. hand: " + item);
  if (typeof Game.entity[0].equipment.lefthand === 'undefined') {
    item = "-";
  } else {
    item = Game.entity[0].equipment.lefthand.name;
  }
  Game.messages.drawText(xoffset, 8, "L. hand: " + item);
  if (typeof Game.entity[0].equipment.body === 'undefined') {
    item = "-";
  } else {
    item = Game.entity[0].equipment.body.name;
  }
  Game.messages.drawText(xoffset, 9, "Body:    " + item);
  if (typeof Game.entity[0].equipment.neck === 'undefined') {
    item = "-";
  } else {
    item = Game.entity[0].equipment.neck.name;
  }
  Game.messages.drawText(xoffset, 10, "Neck:    " + item);
  if (Game.entity[0].affects.length > 0) {
    for (let i = 0; i < Game.entity[0].affects.length; i++) {
      Game.display.draw(Game.screenWidth - 1, i, ["whitesquare", Game.entity[0].affects[i].Symbol], ["#0000", "#0000"]);
    }
  }
}

Player.prototype.doAttack = function(x, y) {
  this.Hunger = Math.max(0, (this.Hunger - 1));
  for (let i = 0; i < Game.entity.length; i++) {
    if (Game.entity[i].x == x && Game.entity[i].y == y && Game.entity[i].Depth == Game.entity[0].Depth) {
      let dmg = Math.floor((Math.random() * (Game.entity[0].Str /2+ Game.entity[0].Maxatk - Game.entity[0].Minatk)) + Game.entity[0].Str/2 + Game.entity[0].Minatk);
      let _color = "%c{}";
      let _crit = Math.min(95, (Game.entity[0].Crit + Math.floor(Game.entity[0].Agi / 2) + 2));
      if (Math.random() * 100 < _crit) {
        dmg = dmg * 2;
        _color = "%c{lime}"
      }
      let result = Game.entity[i].doGetDamage(dmg);
      Game.messagebox.sendMessage("You hits " + Game.entity[i].name + " for " + _color + result + " %c{}damage.");
      Game.entity[i].doDie();
      Game.drawMap();
      Game.drawEntities();
    }
  }
}

Player.prototype.applyStats = function() {
  this.Maxhp = this.Con * 4;
  this.Maxmana = this.Int * 4;
  this.Hp = Math.min(this.Hp, this.Maxhp);
  this.Mana = Math.min(this.Mana, this.Maxmana);
}

Player.prototype.handleEvent = function(e) {
  var newx = this.x;
  var newy = this.y;
  var level = Game.entity[0].Depth;
  var code = e.keyCode;
  var keyMap = {};
  keyMap[38] = 0;
  keyMap[33] = 1;
  keyMap[39] = 2;
  keyMap[34] = 3;
  keyMap[40] = 4;
  keyMap[35] = 5;
  keyMap[37] = 6;
  keyMap[36] = 7;
  if (mode.mode == "skill") {
    newx = mode.skillx;
    newy = mode.skilly;
    switch (code) {
      case 13:
        mode.mode = "play";
        window.removeEventListener("keydown", this);
        Game.useSkill(Game.entity[0], Game.skills[mode.chosenskill], mode.skillx, mode.skilly);
        Game.drawAll();
        Game.engine.unlock();
        return;
        break;
      case 27:
        mode.mode = "play";
        Game.drawAll();
        window.removeEventListener("keydown", this);
        Game.engine.unlock();
        return;
        break;
      case 35:
      case 37:
      case 36:
      case 38:
      case 33:
      case 39:
      case 40:
      case 34:
        var diff = ROT.DIRS[8][keyMap[code]];
        newx = newx + diff[0];
        newy = newy + diff[1];
        break;
      default:
        break;
    }
    var key = newx + "," + newy;
    if (key in mode.skillmap) {
      mode.skillx = newx;
      mode.skilly = newy;
      Game.drawSkillMap();
    }
    return;
  }

  if (mode.mode == "item") {
    switch (code) {
      case 69:
        Game.doItem("eat");
        break;
      case 68:
        Game.doItem("drop");
        break;
      case 83:
        Game.doItem("sacrifice");
        break;
      case 87:
        Game.doItem("wield");
        break;
      case 27:
        break;
      default:
        Game.messagebox.sendMessage("You cant do this.");
    }
    mode.mode = "play";
    Game.drawAll();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
    return;
  }
  if (mode.mode == "play") {
    switch (code) {
      case 87:
        this.doWorship();
        break;
      case 191:
        Game.printhelp();
        break;
      case 35:
      case 37:
      case 36:
      case 38:
      case 33:
      case 39:
      case 40:
      case 34:
        var diff = ROT.DIRS[8][keyMap[code]];
        newx = newx + diff[0];
        newy = newy + diff[1];
        break;
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        Game.chooseSkill(code - 49);
        return;
        break;
      case 65:
      case 66:
      case 67:
      case 68:
      case 69:
      case 70:
      case 71:
      case 72:
      case 73:
      case 74:
      case 75:
      case 76:
      case 77:
      case 78:
      case 79:
      case 80:
        Game.chooseItem(code - 65);
        return;
        break;
      case 190:
        if (!Game.map[level].Tiles[newx][newy].Stairdown) {
          Game.messagebox.sendMessage("You cant go down there.");

        } else {
          if (typeof Game.map[level + 1] === 'undefined') {
            Game.generateMap(level + 1);
          }
          Game.entity[0].godown();
          newx = this.x;
          newy = this.y;
          level = Game.entity[0].Depth;
        }
        break;
      case 188:
        Game.entity[0].goup();
        newx = this.x;
        newy = this.y;
        level = Game.entity[0].Depth;
        break;
      case 220:
        Game.pickupItem();
        break;
      case 12:
      case 90:
        newx = this.x;
        newy = this.y;
        break;
      default:
        return;
    }
    if (this.confuse && Math.random() > 0.5) {
      let _confused = ROT.DIRS[8][Math.floor(Math.random() * 7)];
      newx = this.x + _confused[0];
      newy = this.y + _confused[1];
    }
    if (Game.map[level].Tiles[newx][newy].Blocked) {
      if (Game.map[level].Tiles[newx][newy].Door) {
        Game.messagebox.sendMessage("You open the door.");
        Game.map[level].Tiles[newx][newy].Door = false;
        Game.map[level].Tiles[newx][newy].Symbol = Game.map[level].Tiles[newx][newy].Symbol.replace('close', 'open');
        Game.map[level].Tiles[newx][newy].Blocked = false;
        Game.map[level].Tiles[newx][newy].BlocksSight = false;
      } else {
        Game.messagebox.sendMessage("You cant walk here.");
      }
      newx = this.x;
      newy = this.y;
    }
    if (Game.map[level].Tiles[newx][newy].Mob) {
      this.doAttack(newx, newy);
      newx = this.x;
      newy = this.y;
    }
    if (typeof Game.map[level].Tiles[newx][newy].items[0] !== 'undefined') {
      if (this.x != newx || this.y != newy) {
        var itemname = Game.map[level].Tiles[newx][newy].items[0].name;
        for (let i = 1; i < Game.map[level].Tiles[newx][newy].items.length; i++) {
          itemname = itemname + ", " + Game.map[level].Tiles[newx][newy].items[i].name;
        }
        Game.messagebox.sendMessage("You see the " + itemname + " on the floor.");
      }
    }
    this.x = newx;
    this.y = newy;
    this.Hunger = Math.max(0, (this.Hunger - 1));
    Game.drawAll();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
  }
}

Player.prototype.doWorship = function() {
  if (Game.entity[0].religion < 21) {
    Game.messagebox.sendMessage("You are nobody for God of Random. Sacrifice something.");
    return;
  }
  let _piety = Game.entity[0].religion / 15;
  let _pietymin = Math.floor(_piety * 0.75);
  let _pietymax = Math.floor(_piety * 1.25) + 1;
  let newitem = Game.ItemRepository.createRandom(_pietymin, _pietymax);
  if (Math.random() * 100 < RareItemDefaultChance) newitem.randomize(1);
  Game.messagebox.sendMessage("God of Random gifts you " + newitem.name + ".");
  if (Game.inventory.length > 16) {
    Game.map[Game.entity[0].Depth].Tiles[Game.entity[0].x][Game.entity[0].y].items.push(newitem);
  } else {
    Game.inventory.push(newitem);
  }
  Game.entity[0].religion = Math.floor(Game.entity[0].religion * 0.75);
}

Game.drawEntities = function() {
  Game.entity[0].Draw();
  for (let i = 0; i < Game.entity.length; i++) {
    Game.entity[i].Draw();
  }
}

Hpregen = function() {
  this.getSpeed = function() {
    let speed = Game.entity[0].Con * 5 + 5;
    return speed;
  }
}

Hpregen.prototype.act = function() {
  Game.entity[0].Hp = Math.min(Game.entity[0].Hp + 1, Game.entity[0].Maxhp);
}

Manaregen = function() {
  this.getSpeed = function() {
    let speed = Game.entity[0].Int * 5 + 5;
    return speed;
  }
}

Manaregen.prototype.act = function() {
  Game.entity[0].Mana = Math.min(Game.entity[0].Mana + 1, Game.entity[0].Maxmana);
}
