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
