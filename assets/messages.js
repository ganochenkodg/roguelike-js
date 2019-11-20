Game.messagebox = null;
Game.MessageBox = function(width, height) {
  this.width = width;
  this.height = height;
  this.messages = [];
};


Game.MessageBox.prototype.sendMessage = function(message) {
  this.messages.push(message);
  if (this.messages.length > this.height) {
    this.messages.shift();
  }
};

Game.MessageBox.prototype.Draw = function() {
  for (let i = 0; i < this.messages.length; i++) {
    Game.messages.drawText(1, i+1, this.messages[i]);
  }
};
