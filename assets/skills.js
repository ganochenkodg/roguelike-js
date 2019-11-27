Game.SkillRepository = new Game.Repository('skills', Skill);
//food
for (let i = 1; i<4; i++) {
Game.SkillRepository.define('Shoot('+i+')', {
  level: i,
  name: "Shoot",
  action: "use",
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

}
