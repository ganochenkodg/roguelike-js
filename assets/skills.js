Game.SkillRepository = new Game.Repository('skills', Skill);

for (let i = 1; i<4; i++) {
//physic
Game.SkillRepository.define('Shoot('+i+')', {
  level: i,
  name: "Shoot",
  Symbol: "shoot",
  target: "range",
  type: "skill",
  subtype: "damage",
  options: {
    cost: 1 + i,
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
//magic
Game.SkillRepository.define('Fireball('+i+')', {
  level: i,
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

Game.SkillRepository.define('Blink('+i+')', {
  level: i,
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

//end of loop
}
