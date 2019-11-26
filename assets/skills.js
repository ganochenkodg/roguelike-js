Game.SkillRepository = new Game.Repository('skills', Skill);
//food

Game.SkillRepository.define('Shoot', {
  level: 1,
  name: "Shoot",
  action: "use",
  Symbol: "shoot",
  type: "range",
  options: {
    description: "You shoot to the target",
    stat: "agi",
    range: 2,
    radius: 1
  }
});
