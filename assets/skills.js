Game.SkillRepository = new Game.Repository('skills', Skill);
//food

Game.SkillRepository.define('Shoot', {
  level: 1,
  name: "Shoot",
  action: "use",
  Symbol: "shoot",
  type: "range",
  options: {
    description: ("base damage (lvl - lvl*4)"),
    mainstat: "agi",
    range: 2,
    radius: 1
  }
});
