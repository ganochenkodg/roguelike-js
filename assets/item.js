Game.inventory = [];

Item = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.options = properties['options'] || {};
  this.Symbol = properties['Symbol'] || "apple";
  this.type = properties['type'] || 'other';
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
  Game.messages.drawText(1, 1, "You see the " + Game.inventory[num].name + ", options:");
  var iterator = 1;
  for (let [key, value] of Object.entries(Game.inventory[num].options)) {
    iterator++;
    Game.messages.drawText(1, iterator, `${key}: ${value}`);
  }
  Game.messages.drawText(1, iterator + 1, "d) Drop");
  var itemtype = Game.inventory[num].type;
  if (itemtype == "food") {
    Game.messages.drawText(1, iterator + 2, "e) Eat");
  }
  if (itemtype == "weapon") {
    if (Game.inventory[num].options.wielded == "no") {
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
    if (Game.inventory[num].options.wielded == "no") {
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
      Game.inventory[num].options.wielded = "yes";
      Game.messagebox.sendMessage("You wielded the " + Game.inventory[num].name + ".");
    } else {
      Game.doItemOptions();
      Game.inventory[num].options.wielded = "no";
      if (Game.player.equipment.righthand == Game.inventory[num]) {
        delete Game.player.equipment.righthand;
      } else {
        delete Game.player.equipment.lefthand;
      }
      Game.messagebox.sendMessage("You unwielded the " + Game.inventory[num].name + ".");
    }

  }
  if (action == "drop") {
    if (itemtype == "weapon" || itemtype == "armor" || itemtype == "amulet") {
      if (Game.inventory[num].options.wielded == "yes") {
        //unwield item
        Game.doItem("wield");
      }
    }
    Game.messagebox.sendMessage("You droped the " + Game.inventory[num].name + ".");
    Game.map[Game.player.Depth].Tiles[Game.player.x][Game.player.y].items.push(Game.inventory[num]);
    delete Game.inventory.splice(num, 1);
  }
  if (action == "eat") {
    if (itemtype != "food") {
      Game.messagebox.sendMessage("You cant do this.");
      return;
    }
    Game.doFoodOptions();
    Game.messagebox.sendMessage("You eat the " + Game.inventory[num].name + ".");
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
  }
}
Game.doItemOptions = function() {
  var num = mode.chosenitem;
  var itemtype = Game.inventory[num].type;
  for (let [key, value] of Object.entries(Game.inventory[num].options)) {
    if (Game.inventory[num].options.wielded == "no") {
      if (key == "minatk") {Game.player.Minatk += value};
      if (key == "maxatk") {Game.player.Maxatk += value};
      if (key == "str") {Game.player.Str += value};
      if (key == "agi") {Game.player.Agi += value};
      if (key == "con") {Game.player.Con += value};
      if (key == "int") {Game.player.Int += value};
    }
    if (Game.inventory[num].options.wielded == "yes") {
      if (key == "minatk") {Game.player.Minatk -= value};
      if (key == "maxatk") {Game.player.Maxatk -= value};
      if (key == "str") {Game.player.Str -= value};
      if (key == "agi") {Game.player.Agi -= value};
      if (key == "con") {Game.player.Con -= value};
      if (key == "int") {Game.player.Int -= value};
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
    Game.messagebox.sendMessage("You picked up " + pickitem.Symbol);
    Game.inventory.push(pickitem);
  } else {
    Game.messagebox.sendMessage("You cant pickup anything.");
  }
}

Game.drawBar = function() {
  for (let i = 1; i < 10; i++) {
    Game.podskazka.draw((i - 1) * 4 + 1, 0, i, "beige");
    Game.display.draw((i - 1), Game.screenHeight, "blanksquare");
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
      if (itemtype == "weapon") {
        if (Game.inventory[i].options.wielded == "no") {
          _color = "red";
        } else {
          _color = "redwield";
        }
      }
      Game.display.draw(i + Game.screenWidth - 16, Game.screenHeight, [_color + "square", Game.inventory[i].Symbol], ["#0000", "#0000"]);
    }
  }
}
