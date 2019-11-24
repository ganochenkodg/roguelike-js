Game.ItemRepository = new Game.Repository('items', Item);
//food

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

//weapon
Game.ItemRepository.define('knife', {
  name: "knife",
  Symbol: "knife",
  type: "weapon",
  options: {
    size: "onehand",
    minatk: 1,
    maxatk: 2,
    agi: 1,
    wielded: "no"
  }
});

Game.ItemRepository.define('spear', {
  name: "spear",
  Symbol: "spear",
  type: "weapon",
  options: {
    size: "onehand",
    minatk: 1,
    maxatk: 4,
    int: 1,
    wielded: "no"
  }
});

Game.ItemRepository.define('glefa', {
  name: "glefa",
  Symbol: "glefa",
  type: "weapon",
  options: {
    wielded: "no",
    size: "twohand",
    minatk: 1,
    maxatk: 8,
    con: 2,
    wielded: "no"
  }
});

Game.ItemRepository.define('longsword', {
  name: "longsword",
  Symbol: "longsword",
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 3,
    maxatk: 7,
    str: 2,
    con: 2,
    agi: -1,
    wielded: "no"
  }
});
