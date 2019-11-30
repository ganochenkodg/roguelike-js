Game.ItemRepository = new Game.Repository('items', Item);
//food

Game.ItemRepository.define('meat', {
  name: "chunk of meat",
  Symbol: "meat",
  type: "food",
  options: {
    food: 150,
    hprestore: 15,
    manarestore: 15
  }
});

Game.ItemRepository.define('slime', {
  name: "strange slime",
  Symbol: "slime",
  type: "food",
  options: {
    food: 40
  }
});

Game.ItemRepository.define('apple', {
  name: "apple",
  Symbol: "apple",
  type: "food",
  options: {
    food: 50,
    hprestore: 10,
    manarestore: 5
  }
});

Game.ItemRepository.define('banana', {
  name: "banana",
  Symbol: "banana",
  type: "food",
  options: {
    food: 70,
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
    agi: 1
  }
});

Game.ItemRepository.define('spear', {
  name: "spear",
  Symbol: "spear",
  level: 2,
  type: "weapon",
  options: {
    size: "onehand",
    minatk: 1,
    maxatk: 4,
    int: 1
  }
});

Game.ItemRepository.define('glefa', {
  name: "glefa",
  Symbol: "glefa",
  level: 2,
  type: "weapon",
  options: {
    wielded: "no",
    size: "twohand",
    minatk: 1,
    maxatk: 8,
    con: 2
  }
});

Game.ItemRepository.define('longsword', {
  name: "longsword",
  Symbol: "longsword",
  level: 3,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 3,
    maxatk: 7,
    str: 2,
    con: 2,
    agi: -1
  },
  skills: {
    Slash: 2
  }
});

Game.ItemRepository.define('bow', {
  name: "bow",
  Symbol: "bow",
  level: 2,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 1,
    maxatk: 4,
    agi: 1
  },
  skills: {
    Shoot: 1
  }
});

Game.ItemRepository.define('staffofapprentice', {
  name: "staff of apprentice",
  Symbol: "staff",
  level: 3,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 1,
    maxatk: 1,
    int: 1
  },
  skills: {
    Fireball: 1,
    Magicdart: 2,
  }
});
//armor
Game.ItemRepository.define('simplecloak', {
  name: "simple cloak",
  Symbol: "simplecloak",
  type: "armor",
  options: {
    armor: 0
  }
});

Game.ItemRepository.define('chainmail', {
  name: "chainmail",
  Symbol: "chainmail",
  type: "armor",
  options: {
    armor: 1,
    agi: -1
  }
});

//potions
Game.ItemRepository.define('smallstrpotion', {
  name: "small potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 1,
  type: "potion",
  options: {
    str: 1
  }
});

Game.ItemRepository.define('smallintpotion', {
  name: "small potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 1,
  type: "potion",
  options: {
    int: 1
  }
});

Game.ItemRepository.define('smallagipotion', {
  name: "small potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 1,
  type: "potion",
  options: {
    agi: 1
  }
});

Game.ItemRepository.define('smallconpotion', {
  name: "small potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 1,
  type: "potion",
  options: {
    con: 1
  }
});

Game.ItemRepository.define('mediumstrpotion', {
  name: "medium potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 3,
  type: "potion",
  options: {
    str: 3
  }
});

Game.ItemRepository.define('mediumintpotion', {
  name: "medium potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 3,
  type: "potion",
  options: {
    int: 3
  }
});

Game.ItemRepository.define('mediumagipotion', {
  name: "medium potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 3,
  type: "potion",
  options: {
    agi: 3
  }
});

Game.ItemRepository.define('mediumconpotion', {
  name: "medium potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 3,
  type: "potion",
  options: {
    con: 3
  }
});

//books
Game.ItemRepository.define('bookofnovicewarrior', {
  name: "book of novice warrior",
  Symbol: "book"+(Math.floor(Math.random()*25)+1),
  level: 1,
  type: "book",
  skills: {
    Slash: 1
  }
});

Game.ItemRepository.define('bookofnovicemage', {
  name: "book of novice wizard",
  Symbol: "book"+(Math.floor(Math.random()*25)+1),
  level: 1,
  type: "book",
  skills: {
    Fireball: 1,
    Magicdart: 1,
  }
});
