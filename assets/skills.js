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
    withweapon: 1 + i/4
  }
});

Game.SkillRepository.define('Stunning shot('+i+')', {
  level: i,
  rank: 3,
  name: "Stunning shot",
  Symbol: "stunningshot",
  target: "range",
  type: "skill",
  subtype: "damage",
  options: {
    cost: 4 + 2*i,
    description: "You shoot the target "+i+" - "+i*4+" dmg and stun.",
    stat: "agi",
    range: 2 + 2*i,
    radius: 0
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 2,
    maxdmglvl: 10,
    withweapon: 1 + i/3,
    stun: 100
  }
});

Game.SkillRepository.define('Power('+i+')', {
  level: i,
  rank: 1,
  name: "Power",
  Symbol: "power",
  target: "self",
  type: "skill",
  subtype: "charm",
  options: {
    cost: 3 + i*3,
    description: "Increase your maximum dmg on "+(4*i)+" for "+(5+i)+" turns.",
    stat: "str",
    range: 0,
    radius: 0
  },
  formulas: {
    maxatk: 4*i,
    duration: 5+i
  }
});

Game.SkillRepository.define('Haste('+i+')', {
  level: i,
  rank: 3,
  name: "Haste",
  Symbol: "haste",
  target: "self",
  type: "skill",
  subtype: "charm",
  options: {
    cost: 5 + i*3,
    description: "Increase your speed on"+(20*i)+" % for "+(8+i*2)+" turns.",
    stat: "agi",
    range: 0,
    radius: 0
  },
  formulas: {
    speed: 20*i,
    duration: 8+i*2
  }
});

Game.SkillRepository.define('Battle hymn('+i+')', {
  level: i,
  rank: 4,
  name: "Battle hymn",
  Symbol: "battlehymn",
  target: "self",
  type: "skill",
  subtype: "charm",
  options: {
    cost: 15 + i*3,
    description: "Increase your physical stats for "+(10+i*5)+" turns.",
    stat: "str",
    range: 0,
    radius: 0
  },
  formulas: {
    armor: 5*i,
    minatk: 4*i,
    maxatk: 8*i,
    agi: 2*i,
    int: -3*i,
    duration: 10+i*5
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
    withweapon: 1 + i/3
  }
});

Game.SkillRepository.define('Twisting slash('+i+')', {
  level: i,
  rank: 3,
  name: "Twisting slash",
  Symbol: "twistingslash",
  target: "self",
  type: "skill",
  subtype: "damage",
  options: {
    cost: 6 + 2*i,
    description: "You slash the nearby targets "+i+" - "+i*4+" dmg.",
    stat: "str",
    range: 0,
    radius: Math.floor(1+i/3)
  },
  formulas: {
    selfprotect: true,
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 4,
    maxdmglvl: 16,
    withweapon: 1 + i/2
  }
});
//magic

Game.SkillRepository.define('Stun('+i+')', {
  level: i,
  rank: 3,
  name: "Stun",
  Symbol: "stun",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 15 + i*2,
    description: "Stun target for "+(2+i*2)+" turns.",
    stat: "int",
    range: 4+i,
    radius: 0
  },
  formulas: {
    stun: true,
    duration: 2+i*2
  }
});

Game.SkillRepository.define('Confuse('+i+')', {
  level: i,
  rank: 3,
  name: "Confuse",
  Symbol: "confuse",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 15 + i*2,
    description: "Confuse target for "+(2+i*2)+" turns.",
    stat: "int",
    range: 4+i,
    radius: 0
  },
  formulas: {
    confuse: true,
    duration: 2+i*2
  }
});

Game.SkillRepository.define('Frozen('+i+')', {
  level: i,
  rank: 3,
  name: "Frozen",
  Symbol: "frozen",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 15 + i*2,
    description: "Frozen for "+(2+i*2)+" turns.",
    stat: "int",
    range: 4+i,
    radius: 0
  },
  formulas: {
    frozen: true,
    duration: 2+i*2
  }
});

Game.SkillRepository.define('Confusing touch('+i+')', {
  level: i,
  rank: 2,
  name: "Confusing touch",
  Symbol: "confusingtouch",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 5 + i*2,
    description: "Confuse nearby target for "+(2+i*2)+" turns.",
    stat: "int",
    range: 1,
    radius: 0
  },
  formulas: {
    confuse: true,
    duration: 2+i*2
  }
});

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
    maxdmglvl: 8,
    confuse:5
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
    maxdmglvl: 8,
    frozen: 10
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
    maxdmglvl: (8+i*2),
    frozen: 15
  }
});

Game.SkillRepository.define('Throw flame('+i+')', {
  level: i,
  rank: 2,
  name: "Throw flame",
  Symbol: "throwflame",
  target: "range",
  type: "spell",
  subtype: "damage",
  options: {
    cost: 8 + i*2,
    description: "You throw flame with "+i*4+" - "+i*(10+i*2)+" dmg.",
    stat: "int",
    range: 4+i,
    radius: 0
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 4,
    maxdmglvl: (10+i*2),
    burning: 35
  }
});

Game.SkillRepository.define('Wall of fire('+i+')', {
  level: i,
  rank: 4,
  name: "Wall of fire",
  Symbol: "walloffire",
  target: "range",
  type: "spell",
  subtype: "damage",
  options: {
    cost: 12 + i*2,
    description: "You create wall of fire "+i*5+" - "+i*(13+i*2)+" dmg.",
    stat: "int",
    range: 4+i,
    radius: 2
  },
  formulas: {
    mindmg: 0,
    maxdmg: 0,
    mindmglvl: 5,
    maxdmglvl: (13+i*2),
    burning: 50
  }
});

Game.SkillRepository.define('Burning('+i+')', {
  level: i,
  rank: 1,
  name: "Burning",
  Symbol: "walloffire",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 10 + i*2,
    description: "Target burning, "+2*i+"-"+6*i+" dmg for "+(2+i)+" turns.",
    stat: "int",
    range: 3+i,
    radius: 1
  },
  formulas: {
    burningmin: i*2,
    burningmax: i*6,
    duration: 2+i
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

Game.SkillRepository.define('Poison cloud('+i+')', {
  level: i,
  rank: 3,
  name: "Poison cloud",
  Symbol: "poisoncloud",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 10 + i*2,
    description: "Cloud of poison, "+2*i+"-"+10*i+" dmg for "+(4+i)+" turns.",
    stat: "int",
    range: 3+i,
    radius: 1
  },
  formulas: {
    poisonmin: i*2,
    poisonmax: i*10,
    duration: 4+i*1
  }
});

Game.SkillRepository.define('Venomous circle('+i+')', {
  level: i,
  rank: 4,
  name: "Venomous circle",
  Symbol: "venomouscircle",
  target: "self",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 13 + i*2,
    description: "Circle of poison, "+5*i+"-"+15*i+" dmg for "+(2+i*2)+" turns.",
    stat: "int",
    range: 0,
    radius: 2+i
  },
  formulas: {
    poisonmin: i*5,
    poisonmax: i*15,
    duration: 2+i*2,
    selfprotect: true,
    confuse: 20
  }
});

Game.SkillRepository.define('Poison bolt('+i+')', {
  level: i,
  rank: 5,
  name: "Poison bolt",
  Symbol: "poisonbolt",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 12 + i*3,
    description: "Magical bolt of poison. Deals "+12*i+"-"+20*i+" dmg for "+(2+i)+" turns.",
    stat: "int",
    range: 3+i,
    radius: 0
  },
  formulas: {
    poisonmin: i*10,
    poisonmax: i*24,
    duration: 2+i,
    confuse: 40
  }
});

Game.SkillRepository.define('Save the corpse('+i+')', {
  level: i,
  rank: 1,
  name: "Save the corpse",
  Symbol: "savethecorpse",
  target: "range",
  type: "spell",
  subtype: "hex",
  options: {
    cost: 12 + i*3,
    description: "Save enemy corpse after death. Duration "+10*i+" turns.",
    stat: "int",
    range: 4+i,
    radius: 0
  },
  formulas: {
    savecorpse: true,
    duration: 10*i,
  }
});

Game.SkillRepository.define('Summon small animal('+i+')', {
  level: i,
  rank: 1,
  name: "Summon small animal",
  Symbol: "summonsmall",
  target: "range",
  type: "spell",
  subtype: "summon",
  options: {
    cost: 5 + i*3,
    description: "Summon small animal for "+10*i+" turns.",
    stat: "int",
    range: 4+i,
    radius: 0
  },
  formulas: {
    summon: "small",
    duration: 10*i,
  }
});

//end of loop
}
