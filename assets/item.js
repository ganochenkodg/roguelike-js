Game.inventory = [];

Item = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.options = properties['options'] || {};
  this.skills = properties['skills'] || {};
  this.Symbol = properties['Symbol'] || "";
  this.type = properties['type'] || 'other';
  this.level = properties['level'] || 1;
  this.price = properties['price'] || 1;
  this.timestamp = Math.random()*1000 + Date.now();
}

Item.prototype.randomize = function(rare) {
  if (this.type != "weapon" && this.type != "armor" && this.type != "amulet" && this.type != "book" && this.type != "potion") {
    return;
  }
  if (rare == 1) {
    this.name = "%c{mistyrose}blessed " + this.name + "%c{}";
  }
  if (rare == 2) {
    this.name = "%c{lightsalmon}rare " + this.name + "%c{}";
  }
  if (rare == 3) {
    this.name = "%c{skyblue}epic " + this.name + "%c{}";
  }
  this.price = Math.floor(this.price*(Math.random()*rare+1));
  if (this.type == "weapon") {
    var keys = Object.keys(this.options);
    for (let i = 0; i < Math.floor(1+rare/2);i++) {
       let _randomProperty = keys[Math.floor(Math.random()*keys.length)];
       if ( _randomProperty == "size") {
         i--;
       } else {
         this.options[_randomProperty] = Math.floor(this.options[_randomProperty]*(Math.random()*rare+1));
       }
    }
  }
  if (this.type == "armor" || this.type == "amulet" ||this.type == "potion") {
    var keys = Object.keys(this.options);
    for (let i = 0; i < Math.floor(1+rare/2);i++) {
       let _randomProperty = keys[Math.floor(Math.random()*keys.length)];
         this.options[_randomProperty] = Math.floor(this.options[_randomProperty]*(Math.random()*rare+1));
    }
  }
  if (this.type == "book") {
    var keys = Object.keys(this.skills);
    for (let i = 0; i < Math.floor(1+rare/2);i++) {
       let _randomProperty = keys[Math.floor(Math.random()*keys.length)];
         this.skills[_randomProperty] = Math.min(3, Math.floor(this.skills[_randomProperty]*(Math.random()*rare+1)));
    }
  }
}

Item.prototype.isWielded = function() {
  if (typeof Game.entity[0].equipment.righthand !== 'undefined') {
    if (Game.entity[0].equipment.righthand == this) {
      return 1;
    }
  }
  if (typeof Game.entity[0].equipment.lefthand !== 'undefined') {
    if (Game.entity[0].equipment.lefthand == this) {
      return 1;
    }
  }
  if (typeof Game.entity[0].equipment.body !== 'undefined') {
    if (Game.entity[0].equipment.body == this) {
      return 1;
    }
  }
  if (typeof Game.entity[0].equipment.neck !== 'undefined') {
    if (Game.entity[0].equipment.neck == this) {
      return 1;
    }
  }
  if (typeof Game.entity[0].books !== 'undefined') {
    for (let i = 0; i < Game.entity[0].books.length; i++) {
      if (Game.entity[0].books[i] == this) {return 1;}
    }
  }
  return 0;
}

Game.chooseItem = function(num) {
  var invpodsk = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
  if (typeof Game.inventory[num] === 'undefined') {
    Game.messagebox.sendMessage("You havent item in slot [" + invpodsk[num] + "].");
    Game.drawAll();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
    return;
  }
  Game.messages.clear();
  Game.podskazka.draw((num + Game.screenWidth - 16) * 4 + 2, 0, invpodsk[num], "#0f0");
  Game.messages.drawText(1, 1, "You see the " + Game.inventory[num].name + ":");
  var iterator = 1;
  for (let [key, value] of Object.entries(Game.inventory[num].options)) {
    iterator++;
    Game.messages.drawText(1, iterator, `${key}: ${value}`);
  }
  if (typeof Game.inventory[num].skills !== 'undefined') {
    for (let [key, value] of Object.entries(Game.inventory[num].skills)) {
      iterator++;
      Game.messages.drawText(1, iterator, `${key}: (${value})`);
    }
  }
  Game.messages.drawText(1, iterator + 1, "d) Drop");
  var itemtype = Game.inventory[num].type;
  if (itemtype == "food") {
    Game.messages.drawText(1, iterator + 2, "e) Eat");
  }
  if (itemtype == "potion") {
    Game.messages.drawText(1, iterator + 2, "e) Drink");
  }
  if (itemtype == "weapon" || itemtype == "armor" || itemtype == "amulet"|| itemtype == "book") {
    if (Game.inventory[num].isWielded() == 0) {
      Game.messages.drawText(1, iterator + 2, "w) Wield");
    } else {
      Game.messages.drawText(1, iterator + 2, "w) Unwield");
    }
  }
  Game.messages.drawText(1, iterator + 3, "s) Sacrifice");
  Game.entity[0].Draw();
  mode.mode = "item";
  mode.chosenitem = num;
}

Game.doItem = function(action) {
  var num = mode.chosenitem;
  var itemtype = Game.inventory[num].type;
  if (action == "wield") {
    if (itemtype != "weapon" && itemtype != "armor" && itemtype != "amulet"&& itemtype != "book") {
      Game.messagebox.sendMessage("You cant do this.");
      return;
    }
    if (Game.inventory[num].isWielded() == 0 && itemtype == "weapon") {
      if (Game.inventory[num].options.size == "twohand") {
        if (typeof Game.entity[0].equipment.righthand !== 'undefined' || typeof Game.entity[0].equipment.righthand !== 'undefined') {
          Game.messagebox.sendMessage("You hands are busy.");
          return;
        } else {
          Game.entity[0].equipment.righthand = Game.inventory[num];
        }
      } else {
        if (typeof Game.entity[0].equipment.righthand === 'undefined') {
          Game.entity[0].equipment.righthand = Game.inventory[num];
        } else if (typeof Game.entity[0].equipment.lefthand === 'undefined' && Game.entity[0].equipment.righthand.options.size != "twohand") {
          Game.entity[0].equipment.lefthand = Game.inventory[num];
        } else {
          Game.messagebox.sendMessage("You hands are busy.");
          return;
        }
      }
      Game.doItemOptions();
      Game.messagebox.sendMessage("You wielded the " + Game.inventory[num].name + ".");
    } else if (Game.inventory[num].isWielded() == 0 && itemtype == "armor") {
      if (typeof Game.entity[0].equipment.body === 'undefined') {
        Game.entity[0].equipment.body = Game.inventory[num];
        Game.doItemOptions();
        Game.messagebox.sendMessage("You wielded the " + Game.inventory[num].name + ".");
      } else {
        Game.messagebox.sendMessage("You already have armor.");
        return;
      }
    } else if (Game.inventory[num].isWielded() == 0 && itemtype == "book") {
      Game.entity[0].books.push(Game.inventory[num]);
      Game.doItemOptions();
      Game.messagebox.sendMessage("You wielded the " + Game.inventory[num].name + ".");
    } else {
      if (Game.entity[0].equipment.righthand == Game.inventory[num]) {
        delete Game.entity[0].equipment.righthand;
      } else if (Game.entity[0].equipment.lefthand == Game.inventory[num]) {
        delete Game.entity[0].equipment.lefthand;
      } else if (Game.entity[0].equipment.body == Game.inventory[num]) {
        delete Game.entity[0].equipment.body;
      }
      if (typeof Game.entity[0].books !== 'undefined') {
        for (let i = 0; i < Game.entity[0].books.length; i++) {
          if (Game.entity[0].books[i] == Game.inventory[num]) {Game.entity[0].books.splice(i,1);}
        }
      }
      Game.doItemOptions();
      Game.messagebox.sendMessage("You unwielded the " + Game.inventory[num].name + ".");
    }
  }
  if (action == "sacrifice") {
    if (itemtype == "weapon" || itemtype == "armor" || itemtype == "amulet"|| itemtype == "book") {
      if (Game.inventory[num].isWielded() == 1) {
        //unwield item
        Game.doItem("wield");
      }
    }
    Game.messagebox.sendMessage("You sacrificed the " + Game.inventory[num].name + ".");
    Game.entity[0].religion += Game.inventory[num].price;
    Game.inventory.splice(num, 1);
  }
  if (action == "drop") {
    if (itemtype == "weapon" || itemtype == "armor" || itemtype == "amulet"|| itemtype == "book") {
      if (Game.inventory[num].isWielded() == 1) {
        //unwield item
        Game.doItem("wield");
      }
    }
    Game.messagebox.sendMessage("You droped the " + Game.inventory[num].name + ".");
    Game.map[Game.entity[0].Depth].Tiles[Game.entity[0].x][Game.entity[0].y].items.push(Game.inventory[num]);
    Game.inventory.splice(num, 1);
  }
  if (action == "eat") {
    if (itemtype != "food" && itemtype != "potion" ) {
      Game.messagebox.sendMessage("You cant do this.");
      return;
    }
    if (itemtype == "food") {
      Game.messagebox.sendMessage("You eat the " + Game.inventory[num].name + ".");
    }
    if (itemtype == "potion") {
      Game.messagebox.sendMessage("You drink the " + Game.inventory[num].name + ".");
    }
    Game.doFoodOptions();
    Game.inventory.splice(num, 1);
  }
}

Game.doFoodOptions = function() {
  var num = mode.chosenitem;
  var itemtype = Game.inventory[num].type;
  for (let [key, value] of Object.entries(Game.inventory[num].options)) {
    if (key == "hprestore") {
      Game.entity[0].Hp = Math.min(Game.entity[0].Maxhp, Game.entity[0].Hp + value);
      Game.messagebox.sendMessage("You restored %c{red}" + value + " HP%c{}.");
    }
    if (key == "manarestore") {
      Game.entity[0].Mana = Math.min(Game.entity[0].Maxmana, Game.entity[0].Mana + value);
      Game.messagebox.sendMessage("You restored %c{blue}" + value + " MP%c{}.");
    }
    if (key == "str") {
      Game.entity[0].Str = Game.entity[0].Str + value;
      Game.messagebox.sendMessage("You feel stronger.");
    }
    if (key == "agi") {
      Game.entity[0].Agi = Game.entity[0].Agi + value;
      Game.messagebox.sendMessage("You feel more agile.");
    }
    if (key == "int") {
      Game.entity[0].Int = Game.entity[0].Int + value;
      Game.messagebox.sendMessage("You feel smarter.");
    }
    if (key == "con") {
      Game.entity[0].Con = Game.entity[0].Con + value;
      Game.messagebox.sendMessage("You feel tighter.");
    }
    if (key == "food") {
      Game.entity[0].Hunger = Math.min(Game.entity[0].Con*50, Game.entity[0].Hunger + value);
    }
  }
  Game.entity[0].applyStats();
}
Game.doItemOptions = function() {
  var num = mode.chosenitem;
  var itemtype = Game.inventory[num].type;
  var skill = {};
  if (typeof Game.inventory[num].skills !== 'undefined') {
    for (let [key, value] of Object.entries(Game.inventory[num].skills)) {
      skill = Game.SkillRepository.create((key+"("+value+")"), {
        level: value
      });
      if (Game.inventory[num].isWielded() == 1) {
        if (Game.skills.length > 8) {
          Game.messagebox.sendMessage("You learn maximum skills.");
        } else {
          Game.messagebox.sendMessage("Now you can use " + skill.name+"("+skill.level+").");
          Game.skills.push(skill);
        }
      } else {
        for (let j = 0; j < Game.skills.length; j++) {
          if (Game.skills[j].name == skill.name && Game.skills[j].level == skill.level) {
            Game.skills.splice(j, 1)
          };
        }
      }
    }
  }
  for (let [key, value] of Object.entries(Game.inventory[num].options)) {
    if (Game.inventory[num].isWielded() == 1) {
      var valueresult = value;
    } else {
      var valueresult = -value;
    }
      if (key == "minatk") Game.entity[0].Minatk += valueresult;
      if (key == "maxatk") Game.entity[0].Maxatk += valueresult;
      if (key == "str") Game.entity[0].Str += valueresult;
      if (key == "agi") Game.entity[0].Agi += valueresult;
      if (key == "con") Game.entity[0].Con += valueresult;
      if (key == "int") Game.entity[0].Int += valueresult;
      if (key == "armor") Game.entity[0].Armor += valueresult;
      if (key == "crit") Game.entity[0].Crit += valueresult;
      if (key == "speed") Game.entity[0].Speed += valueresult;
      if (key == "speed") Game.entity[0].Speed += valueresult;
      if (key == "vision") Game.entity[0].Vision += valueresult;
  }
  //new max hp, mana and speed
  Game.entity[0].applyStats();
}

Game.pickupItem = function() {
  if (Game.inventory.length > 16) {
    Game.messagebox.sendMessage("Your invetory is full");
    return;
  }
  let level = Game.entity[0].Depth;
  let x = Game.entity[0].x;
  let y = Game.entity[0].y;
  if (typeof Game.map[level].Tiles[x][y].items[0] !== 'undefined') {
    var pickitem = Game.map[level].Tiles[x][y].items.shift();
    Game.messagebox.sendMessage("You picked up " + pickitem.name+"%c{}.");
    Game.inventory.push(pickitem);
  } else {
    Game.messagebox.sendMessage("You cant pickup anything.");
  }
}

Game.drawBar = function() {
  for (let i = 0; i < 9; i++) {
    Game.podskazka.draw(i * 4 + 1, 0, (i + 1), "beige");
    if (typeof Game.skills[i] === 'undefined') {
      Game.display.draw(i, Game.screenHeight, "blanksquare");
    } else {
      Game.display.draw(i, Game.screenHeight, ["whitesquare", Game.skills[i].Symbol], ["#0000", "#0000"]);
    }
  }
  var invpodsk = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
  for (let i = 0; i < 16; i++) {
    Game.podskazka.draw((i + Game.screenWidth - 16) * 4 + 2, 0, invpodsk[i], "beige");
    if (typeof Game.inventory[i] === 'undefined') {
      Game.display.draw(i + Game.screenWidth - 16, Game.screenHeight, "blanksquare");
    } else {
      var itemtype = Game.inventory[i].type;
      var _color = "blank";
      if (itemtype == "food") _color = "green";
      if (itemtype == "potion") _color = "pink";
      if (itemtype == "weapon") {
        if (Game.inventory[i].isWielded() == 0) {
          _color = "red";
        } else {
          _color = "redwield";
        }
      }
      if (itemtype == "armor") {
        if (Game.inventory[i].isWielded() == 0) {
          _color = "yellow";
        } else {
          _color = "yellowwield";
        }
      }
      if (itemtype == "book") {
        if (Game.inventory[i].isWielded() == 0) {
          _color = "cyan";
        } else {
          _color = "cyanwield";
        }
      }
      Game.display.draw(i + Game.screenWidth - 16, Game.screenHeight, [_color + "square", Game.inventory[i].Symbol], ["#0000", "#0000"]);
    }
  }
}
