Game.inventory = [];

Item = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.options = properties['options'] || {};
  this.skills = properties['skills'] || {};
  this.Symbol = properties['Symbol'] || "";
  this.type = properties['type'] || 'other';
  this.level = properties['level'] || 1;
  this.timestamp = Math.random()*1000 + Date.now();
}

Item.prototype.isWielded = function() {
  if (typeof Game.player.equipment.righthand !== 'undefined') {
    if (Game.player.equipment.righthand == this) {
      return 1;
    }
  }
  if (typeof Game.player.equipment.lefthand !== 'undefined') {
    if (Game.player.equipment.lefthand == this) {
      return 1;
    }
  }
  if (typeof Game.player.equipment.body !== 'undefined') {
    if (Game.player.equipment.body == this) {
      return 1;
    }
  }
  if (typeof Game.player.equipment.neck !== 'undefined') {
    if (Game.player.equipment.neck == this) {
      return 1;
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
  if (itemtype == "weapon" || itemtype == "armor" || itemtype == "amulet") {
    if (Game.inventory[num].isWielded() == 0) {
      Game.messages.drawText(1, iterator + 2, "w) Wield");
    } else {
      Game.messages.drawText(1, iterator + 2, "w) Unwield");
    }
  }
  Game.player.Draw();
  mode.mode = "item";
  mode.chosenitem = num;
}

Game.doItem = function(action) {
  var num = mode.chosenitem;
  var itemtype = Game.inventory[num].type;
  if (action == "wield") {
    if (itemtype != "weapon" && itemtype != "armor" && itemtype != "amulet") {
      Game.messagebox.sendMessage("You cant do this.");
      return;
    }
    if (Game.inventory[num].isWielded() == 0 && itemtype == "weapon") {
      if (Game.inventory[num].options.size == "twohand") {
        if (typeof Game.player.equipment.righthand !== 'undefined' || typeof Game.player.equipment.righthand !== 'undefined') {
          Game.messagebox.sendMessage("You hands are busy.");
          return;
        } else {
          Game.player.equipment.righthand = Game.inventory[num];
        }
      } else {
        if (typeof Game.player.equipment.righthand === 'undefined') {
          Game.player.equipment.righthand = Game.inventory[num];
        } else if (typeof Game.player.equipment.lefthand === 'undefined' && Game.player.equipment.righthand.options.size != "twohand") {
          Game.player.equipment.lefthand = Game.inventory[num];
        } else {
          Game.messagebox.sendMessage("You hands are busy.");
          return;
        }
      }
      Game.doItemOptions();
      Game.messagebox.sendMessage("You wielded the " + Game.inventory[num].name + ".");
    } else if (Game.inventory[num].isWielded() == 0 && itemtype == "armor") {
      if (typeof Game.player.equipment.body === 'undefined') {
        Game.player.equipment.body = Game.inventory[num];
        Game.doItemOptions();
        Game.messagebox.sendMessage("You wielded the " + Game.inventory[num].name + ".");
      } else {
        Game.messagebox.sendMessage("You already have armor.");
        return;
      }
    } else {
      if (Game.player.equipment.righthand == Game.inventory[num]) {
        delete Game.player.equipment.righthand;
      } else if (Game.player.equipment.lefthand == Game.inventory[num]) {
        delete Game.player.equipment.lefthand;
      } else if (Game.player.equipment.body == Game.inventory[num]) {
        delete Game.player.equipment.body;
      }
      Game.doItemOptions();
      Game.messagebox.sendMessage("You unwielded the " + Game.inventory[num].name + ".");
    }    console.log(itemtype);

  }
  if (action == "drop") {
    if (itemtype == "weapon" || itemtype == "armor" || itemtype == "amulet") {
      if (Game.inventory[num].isWielded() == 1) {
        //unwield item
        Game.doItem("wield");
      }
    }
    Game.messagebox.sendMessage("You droped the " + Game.inventory[num].name + ".");
    Game.map[Game.player.Depth].Tiles[Game.player.x][Game.player.y].items.push(Game.inventory[num]);
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
      Game.player.Hp = Math.min(Game.player.Maxhp, Game.player.Hp + value);
      Game.messagebox.sendMessage("You restored %c{red}" + value + " HP%c{}.");
    }
    if (key == "manarestore") {
      Game.player.Mana = Math.min(Game.player.Maxmana, Game.player.Mana + value);
      Game.messagebox.sendMessage("You restored %c{blue}" + value + " MP%c{}.");
    }
    if (key == "str") {
      Game.player.Str = Game.player.Str + value;
      Game.messagebox.sendMessage("You feel stronger.");
    }
    if (key == "agi") {
      Game.player.Agi = Game.player.Agi + value;
      Game.messagebox.sendMessage("You feel more agile.");
    }
    if (key == "int") {
      Game.player.Int = Game.player.Int + value;
      Game.messagebox.sendMessage("You feel smarter.");
    }
    if (key == "con") {
      Game.player.Con = Game.player.Con + value;
      Game.messagebox.sendMessage("You feel tighter.");
    }
    if (key == "food") {
      Game.player.Hunger = Math.min(Game.player.Con*50, Game.player.Hunger + value);
    }
  }
  Game.player.applyStats();
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
      if (key == "minatk") {
        Game.player.Minatk += value;
      };
      if (key == "maxatk") {
        Game.player.Maxatk += value;
      };
      if (key == "str") {
        Game.player.Str += value;
      };
      if (key == "agi") {
        Game.player.Agi += value;
      };
      if (key == "con") {
        Game.player.Con += value;
      };
      if (key == "int") {
        Game.player.Int += value;
      };
      if (key == "armor") {
        Game.player.Armor += value;
      };
      if (key == "crit") {
        Game.player.Crit += value;
      };
    }
    if (Game.inventory[num].isWielded() == 0) {
      if (key == "minatk") {
        Game.player.Minatk -= value;
      };
      if (key == "maxatk") {
        Game.player.Maxatk -= value;
      };
      if (key == "str") {
        Game.player.Str -= value;
      };
      if (key == "agi") {
        Game.player.Agi -= value;
      };
      if (key == "con") {
        Game.player.Con -= value;
      };
      if (key == "int") {
        Game.player.Int -= value;
      };
      if (key == "armor") {
        Game.player.Armor -= value;
      };
      if (key == "crit") {
        Game.player.Crit -= value;
      };
    }
  }
  //new max hp, mana and speed
  Game.player.applyStats();
}

Game.pickupItem = function() {
  if (Game.inventory.length > 15) {
    Game.messagebox.sendMessage("Your invetory is full");
    return;
  }
  let level = Game.player.Depth;
  let x = Game.player.x;
  let y = Game.player.y;
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
      if (itemtype == "food") {
        _color = "green";
      }
      if (itemtype == "potion") {
        _color = "pink";
      }
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
      Game.display.draw(i + Game.screenWidth - 16, Game.screenHeight, [_color + "square", Game.inventory[i].Symbol], ["#0000", "#0000"]);
    }
  }
}
