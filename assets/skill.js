Game.skills = [];

Skill = function(properties) {
  properties = properties || {};
  this.name = properties['name'] || "";
  this.options = properties['options'] || {};
  this.Symbol = properties['Symbol'] || "";
  this.type = properties['type'] || '';
}
