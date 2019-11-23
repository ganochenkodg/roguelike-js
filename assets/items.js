Game.ItemRepository = new Game.Repository('items', Item);

Game.ItemRepository.define('apple', {
  name: "apple",
  Symbol: "apple",
  type: "food",
  options: {
    food: 50,
    hprestore: 10
  }
});
