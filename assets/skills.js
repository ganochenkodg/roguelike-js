Game.SkillRepository = new Game.Repository('skills', Skill);

for (let i = 1; i<4; i++) {
//physic
Game.SkillRepository.define('Shoot('+i+')', {
  level: i,
  rank: 1,
  name: "Shoot",
  Symbol: "shoot",
  target: "range",
  type: "skill",
  subtype: "damage",
  options: {
    cost: 2 + 2*i,
    description: "You shoot the target "+i+" - "+i*4+" dmg.",
    stat: "agi",
    range: 2+i,
    radius: 0
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 1,
    maxdmglvl: 4,
    withweapon: 1
  }
});

Game.SkillRepository.define('Slash('+i+')', {
  level: i,
  rank: 1,
  name: "Slash",
  Symbol: "slash",
  target: "range",
  type: "skill",
  subtype: "damage",
  options: {
    cost: 3 + 2*i,
    description: "You slash the target "+i+" - "+i*4+" dmg.",
    stat: "str",
    range: 1,
    radius: 0
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 1,
    maxdmglvl: 8,
    withweapon: 1 + i/2
  }
});
//magic
Game.SkillRepository.define('Fireball('+i+')', {
  level: i,
  rank: 1,
  name: "Fireball",
  Symbol: "fireball",
  target: "range",
  type: "spell",
  subtype: "damage",
  options: {
    cost: 8 + i*2,
    description: "You cast fireball with "+i+" - "+i*8+" dmg.",
    stat: "int",
    range: 3+i,
    radius: 1
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 1,
    maxdmglvl: 8
  }
  
});

Game.SkillRepository.define('Magicdart('+i+')', {
  level: i,
  rank: 1,
  name: "Magic dart",
  Symbol: "magicdart",
  target: "range",
  type: "spell",
  subtype: "damage",
  options: {
    cost: 3 + i*2,
    description: "You cast magic dart with "+i+" - "+i*6+" dmg.",
    stat: "int",
    range: 4+i,
    radius: 0
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 1,
    maxdmglvl: 6
  }
});

Game.SkillRepository.define('Freeze('+i+')', {
  level: i,
  rank: 1,
  name: "Freeze",
  Symbol: "freeze",
  target: "range",
  type: "spell",
  subtype: "damage",
  options: {
    cost: 2 + i*2,
    description: "You doing freezing touch with "+i+" - "+i*8+" dmg.",
    stat: "int",
    range: 1,
    radius: 0
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 1,
    maxdmglvl: 8
  }
});

Game.SkillRepository.define('Throw ice('+i+')', {
  level: i,
  rank: 2,
  name: "Throw ice",
  Symbol: "throwice",
  target: "range",
  type: "spell",
  subtype: "damage",
  options: {
    cost: 6 + i*2,
    description: "You throw ice with "+i*2+" - "+i*(8+i*2)+" dmg.",
    stat: "int",
    range: 4+i,
    radius: 0
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 2,
    maxdmglvl: (8+i*2)
  }
});

Game.SkillRepository.define('Blink('+i+')', {
  level: i,
  rank: 1,
  name: "Blink",
  Symbol: "blink",
  target: "self",
  type: "spell",
  subtype: "translocation",
  options: {
    cost: 5 + i*5,
    description: "Translocate yourself in random place with radius "+(4+i)+" .",
    stat: "int",
    range: 0,
    radius: 0
  },
  formulas: {
    range: 4+i
  }
});

Game.SkillRepository.define('Power('+i+')', {
  level: i,
  rank: 1,
  name: "Power",
  Symbol: "power",
  target: "self",
  type: "spell",
  subtype: "charm",
  options: {
    cost: 3 + i*3,
    description: "Increase your maximum dmg on "+(4*i)+" for "+(5+i)+" turns.",
    stat: "int",
    range: 0,
    radius: 0
  },
  formulas: {
    maxatk: 4*i,
    duration: 5+i
  }
});

Game.SkillRepository.define('Ice armor('+i+')', {
  level: i,
  rank: 3,
  name: "Ice armor",
  Symbol: "icearmor",
  target: "self",
  type: "spell",
  subtype: "charm",
  options: {
    cost: 10 + i*3,
    description: "Increase your armor on "+(5+i*2)+" for "+(19+i)+" turns.",
    stat: "int",
    range: 0,
    radius: 0
  },
  formulas: {
    armor: (5+i*2),
    duration: (19+i)
  }
});


Game.SkillRepository.define('Weakness('+i+')', {
  level: i,
  rank: 1,
  name: "Weakness",
  Symbol: "weakness",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 2 + i*2,
    description: "Decrease target str on "+i*(-2)+" for "+(5+i)+" turns.",
    stat: "int",
    range: 2+i,
    radius: 0
  },
  formulas: {
    str: i*(-2),
    duration: 5+i
  }
});

Game.SkillRepository.define('Poison dart('+i+')', {
  level: i,
  rank: 1,
  name: "Poison dart",
  Symbol: "poisondart",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 1 + i*2,
    description: "Magical dart of poison. Deals "+1*i+"-"+4*i+" dmg for "+(3+i)+" turns.",
    stat: "int",
    range: 3+i,
    radius: 0
  },
  formulas: {
    poisonmin: i,
    poisonmax: i*4,
    duration: 3+i
  }
});

//end of loop
}
