var terrains = ["dungeon", "sand", "jungle", "oldmaze"]

Game.EntityRepository = new Game.Repository('entities', Entity);

Game.EntityRepository.define('gorilla', {
  name: 'gorilla',
  Symbol: 'gorilla',
  Maxhp: 10,
  Hp: 10,
  Speed: 100,
  Maxatk: 8,
  drop: {
    meat: 25,
    banana: 25
  },
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true,
    Actor: true
  }
});

Game.EntityRepository.define('flyingeye', {
  name: 'flying eye',
  Symbol: 'flyingeye',
  Maxhp: 10,
  Hp: 10,
  Speed: 120,
  Vision: 15,
  drop: {
    slime: 35
  },
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true,
    Actor: true
  }
});

Game.EntityRepository.define('leech', {
  name: 'leech',
  Symbol: 'leech',
  Maxhp: 20,
  Hp: 20,
  Speed: 60,
  Vision: 4,
  drop: {
    slime: 20
  },
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true,
    Actor: true
  }
});

Game.EntityRepository.define('giant', {
  name: 'giant',
  Symbol: 'giant',
  Maxhp: 40,
  Hp: 40,
  Speed: 50,
  Vision: 7,
  Maxatk: 10,
  drop: {
    meat: 40
  },
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true,
    Actor: true
  }
});

Game.EntityRepository.define('tangleofworms', {
  name: 'tangle of worms',
  Symbol: 'tangleofworms',
  Maxhp: 40,
  Hp: 40,
  Speed: 75,
  Vision: 3,
  drop: {
    slime: 15
  },
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true,
    Actor: true,
    Ballworms: true
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
    Candie: true,
    Actor: true
  }
}, {
  disableRandomCreation: true
});
