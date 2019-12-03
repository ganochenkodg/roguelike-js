var tileSet = document.createElement("img");
tileSet.src = "assets/tiles.png";
var gameTilemap = {
//terrains
  "dungeonwall": [0, 0],
  "dungeonfloor": [32, 0],
  "dungeonfloorrandom": [64, 0],
  "dungeondoorclose": [96, 0],
  "dungeondooropen": [128, 0],
  "dungeonstairdown": [160, 0],
  "dungeonstairup": [192, 0],
  "sandwall": [224, 0],
  "sandfloor": [256, 0],
  "sandfloorrandom": [288, 0],
  "sanddoorclose": [320, 0],
  "sanddooropen": [352, 0],
  "sandstairdown": [384, 0],
  "sandstairup": [416, 0],
  "junglewall": [448, 0],
  "junglefloor": [480, 0],
  "junglefloorrandom": [512, 0],
  "jungledoorclose": [544, 0],
  "jungledooropen": [576, 0],
  "junglestairdown": [608, 0],
  "junglestairup": [640, 0],
  "oldmazewall": [672, 0],
  "oldmazefloor": [704, 0],
  "oldmazefloorrandom": [736, 0],
  "oldmazedoorclose": [768, 0],
  "oldmazedooropen": [800, 0],
  "oldmazestairdown": [832, 0],
  "oldmazestairup": [864, 0],
//entities
  "@": [0, 32],
  "dwarf": [256,256],
  "elf": [288,256],
  "human": [320,256],
  "goblin": [352,256],
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
  "wizardapprentice": [224,32],
  "chest": [288,64],
  "ogre": [256,96],
//bar
  "whitesquare": [64,224],
  "pinksquare": [32,224],
  "redsquare": [160,224],
  "redwieldsquare": [416,224],
  "blanksquare": [384,224],
  "greensquare": [352,224],
  "yellowsquare": [320,224],
  "yellowwieldsquare": [448,224],
  "cyansquare": [0,224],
  "cyanwieldsquare": [480,224],
//food
  "apple": [0,288],
  "banana": [32,288],
  "bread": [64,288],
  "meat": [96,288],
  "slime": [128,288],
//potion
  "potion1": [0,416],
  "potion2": [32,416],
  "potion3": [64,416],
  "potion4": [96,416],
  "potion5": [128,416],
  "potion6": [160,416],
  "potion7": [192,416],
  "potion8": [224,416],
  "potion9": [256,416],
  "potion10": [288,416],
  "potion11": [320,416],
  "potion12": [352,416],
  "potion13": [384,416],
  "potion14": [416,416],
  "potion15": [448,416],
  "potion16": [480,416],
  "potion17": [512,416],
  "potion18": [544,416],
  "potion19": [576,416],
  "potion20": [608,416],
  "potion21": [640,416],
  "potion22": [672,416],  
  "potion23": [704,416],
  "potion24": [736,416],
  "potion25": [768,416],  
  "potion26": [800,416],
//books
"book1": [0,448],
"book2": [32,448],
"book3": [64,448],
"book4": [96,448],
"book5": [128,448],
"book6": [160,448],
"book7": [192,448],
"book8": [224,448],
"book9": [256,448],
"book10": [288,448],
"book11": [320,448],
"book12": [352,448],
"book13": [384,448],
"book14": [416,448],
"book15": [448,448],
"book16": [480,448],
"book17": [512,448],
"book18": [544,448],
"book19": [576,448],
"book20": [608,448],
"book21": [640,448],
"book22": [672,448],  
"book23": [704,448],
"book24": [736,448],
"book25": [768,448],  
"book26": [800,448],
//weapon
  "knife": [0,320],
  "spear": [32,320],
  "glefa": [64,320],
  "longsword": [96,320],
  "bow": [128,320],
  "staff": [160,320],
  "woodencrossbow": [192,320],
  "steelcrossbow": [224,320],
  "goldencrossbow": [256,320],
  "bow1": [288,320],
  "bow2": [320,320],
  "bow3": [352,320],
  "bow4": [384,320],
//skills
  "shoot": [0,384],
  "fireball": [32,384],
  "magicdart": [64,384],
  "blink": [96,384],
  "slash": [128,384],
  "power": [160,384],
  "weakness": [192,384],
  "poisondart": [224,384],
  "icearmor": [256,384],
  "freeze": [288,384],
  "throwice": [320,384],
  "confuse": [352,384],
  "stun": [384,384],
  "frozen": [416,384],
  "confusingtouch": [448,384],
  "stunningshot": [480,384],
//armor
  "simplecloak": [32,352],
  "chainmail": [0,352]
};
