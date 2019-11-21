var tileSet = document.createElement("img");
tileSet.src = "assets/tiles.png";
var gameTilemap = {
  "dungeonwall": [0, 0],
  "dungeonfloor": [32, 0],
  "dungeonfloorrandom": [64, 0],
  "dungeondoorclose": [96, 0],
  "dungeondooropen": [128, 0],
  "@": [0, 32],
  "hp1": [0,256],
  "hp2": [32,256],
  "hp3": [64,256],
  "hp4": [96,256],
  "hp5": [128,256],
  "hp6": [160,256],
  "hp7": [192,256],
  "hp8": [224,256],
  "gorilla": [32, 32],
  "flyingeye": [64, 32],
  "leech": [96, 32],
  "giant": [128, 32],
  "tangleofworms": [160,32],
  "worm": [192,32],
  "whitesquare": [64,224],
  "blanksquare": [384,224]
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

Game.EntityRepository.define('tangleofworms', {
  name: 'tangle of worms',
  Symbol: 'tangleofworms',
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
