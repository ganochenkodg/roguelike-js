Game.EntityRepository = new Game.Repository('entities', Entity);

Game.EntityRepository.define('gorilla', {
  name: 'Gorilla',
  Symbol: 'gorilla',
  Maxhp: 10,
  Hp: 10,
  Speed: 15,
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true
  }
});

Game.EntityRepository.define('flyingeye', {
  name: 'Flying Eye',
  Symbol: 'flyingeye',
  Maxhp: 10,
  Hp: 10,
  Speed: 20,
  Vision: 15,
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true
  }
});

Game.EntityRepository.define('leech', {
  name: 'Leech',
  Symbol: 'leech',
  Maxhp: 20,
  Hp: 20,
  Speed: 5,
  Vision: 4,
  acts: {
    Hunt: true,
    Attack: true,
    Candie: true
  }
});
