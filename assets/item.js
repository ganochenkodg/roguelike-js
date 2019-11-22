Game.inventory = [];

Item = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.options = properties['options'] || {};
  this.Symbol = properties['Symbol'] || "apple";
  this.type = properties['type'] || 'other';
}
