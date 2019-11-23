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

Game.ItemRepository.define('banana', {
  name: "banana",
  Symbol: "banana",
  type: "food",
  options: {
    food: 50,
    hprestore: 12
  }
});

Game.ItemRepository.define('bread', {
  name: "bread",
  Symbol: "bread",
  type: "food",
  options: {
    food: 100,
    hprestore: 20
  }
});
