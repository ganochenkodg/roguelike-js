Game.ItemRepository = new Game.Repository('items', Item);
//food

Game.ItemRepository.define('meat', {
  name: "chunk of meat",
  Symbol: "meat",
  price: 2,
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
  price: 3,
  options: {
    food: 100,
    hprestore: 20,
    manarestore: 20,
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
    agi: 1
  }
});

Game.ItemRepository.define('glefa', {
  name: "glefa",
  Symbol: "glefa",
  level: 2,
  price: 7,
  type: "weapon",
  options: {
    wielded: "no",
    size: "twohand",
    minatk: 1,
    maxatk: 8,
    agi: 2
  }
});

Game.ItemRepository.define('longsword', {
  name: "longsword",
  Symbol: "longsword",
  level: 3,
  price: 10,
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
  price: 3,
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

Game.ItemRepository.define('elvishbow', {
  name: "elvish bow",
  Symbol: "bow1",
  level: 3,
  price: 10,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 1,
    maxatk: 10,
    agi: 2,
    speed: 10
  },
  skills: {
    Shoot: 1
  }
});

Game.ItemRepository.define('hunterbow', {
  name: "hunter bow",
  Symbol: "bow2",
  level: 5,
  price: 12,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 2,
    maxatk: 14,
    agi: 4,
    con: 1,
    vision: 1
  },
  skills: {
    Shoot: 1
  }
});

Game.ItemRepository.define('guardianbow', {
  name: "guardian bow",
  Symbol: "bow3",
  level: 7,
  price: 18,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 3,
    maxatk: 16,
    agi: 5,
    con: 2,
  },
  skills: {
    Shoot: 2,
    "Stunning shot": 1
  }
});

Game.ItemRepository.define('orcsbow', {
  name: "long bow of orcs",
  Symbol: "bow4",
  level: 8,
  price: 20,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 8,
    maxatk: 20,
    agi: 5,
    con: 4,
    vision: 1
  },
  skills: {
    Shoot: 2,
    "Stunning shot": 2
  }
});


Game.ItemRepository.define('woodencrossbow', {
  name: "wooden crossbow",
  Symbol: "woodencrossbow",
  level: 3,
  price: 10,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 4,
    maxatk: 8,
    agi: 2
  },
  skills: {
    Shoot: 1
  }
});

Game.ItemRepository.define('steelcrossbow', {
  name: "steel crossbow",
  Symbol: "steelcrossbow",
  level: 5,
  price: 15,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 8,
    maxatk: 12,
    agi: 2,
    con: 1
  },
  skills: {
    Shoot: 1,
    "Stunning shot": 1
  }
});

Game.ItemRepository.define('goldencrossbow', {
  name: "golden crossbow",
  Symbol: "goldencrossbow",
  level: 8,
  price: 20,
  type: "weapon",
  options: {
    size: "twohand",
    minatk: 12,
    maxatk: 16,
    agi: 5
  },
  skills: {
    Shoot: 2,
    "Stunning shot": 1
  }
});

Game.ItemRepository.define('staffofapprentice', {
  name: "staff of apprentice",
  Symbol: "staff",
  level: 3,
  price: 5,
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
  price: 5,
  type: "potion",
  options: {
    str: 1
  }
});

Game.ItemRepository.define('smallintpotion', {
  name: "small potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 1,
  price: 5,
  type: "potion",
  options: {
    int: 1
  }
});

Game.ItemRepository.define('smallagipotion', {
  name: "small potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 1,
  price: 5,
  type: "potion",
  options: {
    agi: 1
  }
});

Game.ItemRepository.define('smallconpotion', {
  name: "small potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 1,
  price: 5,
  type: "potion",
  options: {
    con: 1
  }
});

Game.ItemRepository.define('mediumstrpotion', {
  name: "medium potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 3,
  price: 10,
  type: "potion",
  options: {
    str: 2
  }
});

Game.ItemRepository.define('mediumintpotion', {
  name: "medium potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 3,
  price: 10,
  type: "potion",
  options: {
    int: 2
  }
});

Game.ItemRepository.define('mediumagipotion', {
  name: "medium potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 3,
  price: 10,
  type: "potion",
  options: {
    agi: 2
  }
});

Game.ItemRepository.define('mediumconpotion', {
  name: "medium potion",
  Symbol: "potion" + (Math.floor(Math.random()*25)+1),
  level: 3,
  price: 10,
  type: "potion",
  options: {
    con: 2
  }
});

//books
Game.ItemRepository.define('bookofnovicewarrior', {
  name: "book of novice warrior",
  Symbol: "book"+(Math.floor(Math.random()*25)+1),
  level: 1,
  price: 10,
  type: "book",
  skills: {
    Slash: 1,
    Power: 1,
  }
});

Game.ItemRepository.define('bookofnovicemage', {
  name: "book of wizard apprentice",
  Symbol: "book"+(Math.floor(Math.random()*25)+1),
  level: 1,
  price: 10,
  type: "book",
  skills: {
    Fireball: 1,
    Magicdart: 1,
  }
});

Game.ItemRepository.define('bookofsmallevil', {
  name: "book of small evil",
  Symbol: "book"+(Math.floor(Math.random()*25)+1),
  level: 1,
  price: 10,
  type: "book",
  skills: {
    Weakness: 1,
    "Poison dart":1,
  }
});

Game.ItemRepository.define('toxicbook', {
  name: "toxic book",
  Symbol: "book"+(Math.floor(Math.random()*25)+1),
  level: 1,
  price: 10,
  type: "book",
  skills: {
    "Poison dart":2,
    "Poison cloud":1,
    "Venomous circle":1,
  }
});

Game.ItemRepository.define('bookofice', {
  name: "book of ice",
  Symbol: "book"+(Math.floor(Math.random()*25)+1),
  level: 3,
  price: 30,
  type: "book",
  skills: {
    Freeze: 1,
    "Throw ice": 1,
    "Ice armor": 1,
  }
});
