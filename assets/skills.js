Game.SkillRepository = new Game.Repository('skills', Skill);

for (let i = 1; i<4; i++) {
//physic
Game.SkillRepository.define('Shoot('+i+')', {
  level: i,
  name: "Shoot",
  Symbol: "shoot",
  target: "range",
  type: "skill",
  options: {
    cost: 2,
    description: "You shoot the target "+i+" - "+i*4+" dmg.",
    stat: "agi",
    range: 2+i,
    radius: 0
  }
});
//magic
Game.SkillRepository.define('Fireball('+i+')', {
  level: i,
  name: "Fireball",
  Symbol: "fireball",
  target: "range",
  type: "spell",
  options: {
    cost: 10,
    description: "You cast fireball with "+i+" - "+i*8+" dmg.",
    stat: "int",
    range: 3+i,
    radius: 1
  }
});
}
