var terrains = ["dungeon", "sand", "jungle", "oldmaze"];

Game.EntityRepository = new Game.Repository('entities', Entity);

Game.EntityRepository.define('gorilla', {
  name: 'gorilla',
  Symbol: 'gorilla',
  Maxhp: 10,
  Speed: 100,
  Maxatk: 8,
  drop: {
    meat: 25,
    banana: 25,
    any: "1,3,5"
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true
  }
});

Game.EntityRepository.define('flyingeye', {
  name: 'flying eye',
  Symbol: 'flyingeye',
  Maxhp: 10,
  Speed: 120,
  Vision: 15,
  drop: {
    slime: 35
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true
  }
});

Game.EntityRepository.define('leech', {
  name: 'leech',
  Symbol: 'leech',
  Maxhp: 20,
  Speed: 60,
  Vision: 4,
  drop: {
    slime: 20
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true
  }
});

Game.EntityRepository.define('giant', {
  name: 'giant',
  Symbol: 'giant',
  level: 3,
  Maxhp: 40,
  Speed: 50,
  Vision: 7,
  Maxatk: 10,
  drop: {
    meat: 40,
    any: "1,3,5"
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true
  }
});

Game.EntityRepository.define('tangleofworms', {
  name: 'tangle of worms',
  Symbol: 'tangleofworms',
  Maxhp: 40,
  Speed: 75,
  Vision: 3,
  drop: {
    slime: 15
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Ballworms: true
  }
});

Game.EntityRepository.define('chest', {
  name: 'small chest',
  Symbol: 'chest',
  level:2,
  Maxhp: 40,
  drop: {
    any: "1,3,85"
  }
});

Game.EntityRepository.define('wizardapprentice', {
  name: 'wizard apprentice',
  Symbol: 'wizardapprentice',
  level: 3,
  Maxhp: 25,
  Speed: 90,
  Vision: 7,
  Range: 4,
  SkillRange: 4,
  drop: {
    staffofapprentice: 50,
    any: "1,3,5"
  },
  skills: {
    Fireball: "1,25",
    Magicdart: "1,85"
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('imp', {
  name: 'imp',
  Symbol: 'imp',
  level: 3,
  Maxhp: 20,
  Speed: 100,
  Vision: 5,
  Armor: 2,
  Minatk: 2,
  Maxatk: 10,
  Range: 1,
  SkillRange: 3,
  drop: {
    any: "2,4,7"
  },
  skills: {
    "Throw flame": "1,15",
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('bat', {
  name: 'bat',
  Symbol: 'bat',
  level: 3,
  Maxhp: 30,
  Speed: 120,
  Vision: 5,
  Armor: 2,
  Minatk: 4,
  Maxatk: 10,
  Range: 1,
  SkillRange: 3,
  drop: {
    meat: 40,
    any: "2,4,12"
  },
  skills: {
    "Haste": "1,20",
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('icebeast', {
  name: 'ice beast',
  Symbol: 'icebeast',
  level: 5,
  Maxhp: 40,
  Speed: 90,
  Vision: 5,
  Armor: 5,
  Minatk: 8,
  Maxatk: 18,
  Range: 1,
  SkillRange: 4,
  drop: {
    any: "2,6,35"
  },
  skills: {
    "Throw ice": "1,20",
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('scorpion1', {
  name: 'small scorpion',
  Symbol: 'scorpion1',
  level: 2,
  Maxhp: 20,
  Speed: 90,
  Vision: 4,
  Armor: 2,
  Minatk: 1,
  Maxatk: 10,
  Range: 1,
  SkillRange: 3,
  drop: {
    any: "1,3,15",
    slime: 35
  },
  skills: {
    "Poison dart": "1,20",
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('scorpion2', {
  name: 'scorpion',
  Symbol: 'scorpion2',
  level: 4,
  Maxhp: 35,
  Speed: 100,
  Vision: 6,
  Armor: 4,
  Minatk: 3,
  Maxatk: 14,
  Range: 1,
  SkillRange: 4,
  drop: {
    any: "1,4,20",
    slime: 50
  },
  skills: {
    "Poison dart": "2,20",
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('snake1', {
  name: 'small snake',
  Symbol: 'snake1',
  level: 3,
  Maxhp: 25,
  Speed: 90,
  Vision: 4,
  Armor: 2,
  Minatk: 4,
  Maxatk: 16,
  Range: 1,
  SkillRange: 3,
  drop: {
    any: "1,3,15",
    meat: 10
  },
  skills: {
    "Poison dart": "1,30",
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('snake2', {
  name: 'snake',
  Symbol: 'snake2',
  level: 5,
  Maxhp: 335,
  Speed: 100,
  Vision: 6,
  Armor: 6,
  Minatk: 8,
  Maxatk: 20,
  Range: 1,
  SkillRange: 4,
  drop: {
    any: "3,5,30",
    meat: 18
  },
  skills: {
    "Poison dart": "2,30",
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('ogre', {
  name: 'ogre',
  Symbol: 'ogre',
  level: 3,
  Maxhp: 35,
  Speed: 90,
  Vision: 5,
  Range: 1,
  SkillRange: 3,
  drop: {
    any: "1,3,25"
  },
  skills: {
    Power: "1,33"
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true,
    Skills: true
  }
});

Game.EntityRepository.define('worm', {
  name: 'worm',
  Symbol: 'worm',
  Maxhp: 10,
  Hp: 10,
  Speed: 70,
  Vision: 3,
  drop: {
    slime: 10
  },
  acts: {
    Hunt: true,
    Attack: true,
    Actor: true
  }
}, {
  disableRandomCreation: true
});
