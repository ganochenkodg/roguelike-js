var gameTilemap = {
  "#": [0, 0],
  ".": [32, 0],
  "@": [0, 32],
  "gorilla": [32, 32],
  "flyingeye": [64, 32],
  "leech": [96, 32],
  "giant": [128, 32],
  "ballofworms": [160,32],
  "worm": [192,32],
};

Game.EntityRepository = new Game.Repository('entities', Entity);

Game.EntityRepository.define('gorilla', {
  name: 'gorilla',
  Symbol: 'gorilla',
  Maxhp: 10,
  Hp: 10,
  Speed: 15,
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
  Speed: 20,
  Vision: 15,
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
  Speed: 5,
  Vision: 4,
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
  Speed: 2,
  Vision: 7,
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true,
    Actor: true
  }
});

Game.EntityRepository.define('ballofworms', {
  name: 'ball of worms',
  Symbol: 'ballofworms',
  Maxhp: 40,
  Hp: 40,
  Speed: 7,
  Vision: 3,
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
  Speed: 7,
  Vision: 3,
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true,
    Actor: true
  }
});
