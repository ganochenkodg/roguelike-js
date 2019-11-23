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
  Game.player.Draw();
  mode.mode = "item";
  mode.chosenitem = num;
}

Game.doItem = function(action) {
  var num = mode.chosenitem;
  if (action == "drop") {
    Game.messagebox.sendMessage("You droped the " + Game.inventory[num].name + ".");
    Game.map[Game.player.Depth].Tiles[Game.player.x][Game.player.y].items.push(Game.inventory[num]);
    delete Game.inventory.splice(num, 1);
  }
  if (action == "eat") {
    Game.messagebox.sendMessage("You eat the " + Game.inventory[num].name + ".");
    for (let [key, value] of Object.entries(Game.inventory[num].options)) {
      if (key == "hprestore") {
          Game.player.Hp = Math.min(Game.player.Maxhp, Game.player.Hp + value);
          Game.messagebox.sendMessage("You restored " + value+" %c{red}HP%c{}.");
      }
    }
    Game.inventory.splice(num, 1);
  }
}

Game.pickupItem = function() {
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
