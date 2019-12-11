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
  "hp9": [384,256],
  "hp10": [416,256],
  "hp11": [448,256],
  "hp12": [480,256],
  "hp13": [512,256],
  "hp14": [544,256],
  "hp15": [576,256],
  "hp16": [608,256],
  "hp17": [640,256],
  "hp18": [672,256],
  "hp19": [704,256],
  "hp20": [736,256],
  "hp21": [768,256],
  "hp22": [800,256],
  "hp23": [832,256],
  "hp24": [864,256],
  "hp31": [0,480],
  "hp32": [32,480],
  "hp33": [64,480],
  "hp34": [96,480],
  "hp35": [128,480],
  "hp36": [160,480],
  "hp37": [192,480],
  "hp38": [224,480],
  "gorilla": [32, 32],
  "flyingeye": [64, 32],
  "leech": [96, 32],
  "giant": [128, 32],
  "tangleofworms": [160,32],
  "worm": [192,32],
  "wizardapprentice": [224,32],
  "chest": [288,64],
  "ogre": [256,96],
  "imp": [32,64],
  "bat": [64,64],
  "mushroom": [160,160],
  "smallmushroom": [352,160],
  "giantzombie": [512,32],
  "icebeast": [576,32],
  "scorpion1": [608,32],
  "scorpion2": [640,32],
  "snake1": [672,32],
  "snake2": [704,32],
  "orc1": [576,64],
  "orc2": [608,64],
  "orc3": [640,64],
  "orc4": [672,64],
  "skeleton": [320,96],
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
//amulets
"amulet1": [0,512],
"amulet2": [32,512],
"amulet3": [64,512],
"amulet4": [96,512],
"amulet5": [128,512],
"amulet6": [160,512],
"amulet7": [192,512],
"amulet8": [224,512],
"amulet9": [256,512],
"amulet10": [288,512],
"amulet11": [320,512],
"amulet12": [352,512],
"amulet13": [384,512],
"amulet14": [416,512],
"amulet15": [448,512],
"amulet16": [480,512],
"amulet17": [512,512],
//shields
"shield1": [0,544],
"shield2": [32,544],
"shield3": [64,544],
"shield4": [96,544],
"shield5": [128,544],
"shield6": [160,544],
"shield7": [192,544],
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
  "shortsword1": [416,320],
  "shortsword2": [448,320],
  "shortsword3": [480,320],
  "shortsword4": [512,320],
  "shortsword5": [544,320],
  "shortsword6": [576,320],
  "shortsword7": [608,320],
  "shortsword8": [640,320],
  "shortsword9": [672,320],
  "longsword2": [704,320],
  "longsword3": [736,320],
  "staff1": [0,576],
  "staff2": [32,576],
  "staff3": [64,576],
  "staff4": [96,576],
  "staff5": [128,576],
  "staff6": [160,576],
  "staff7": [192,576],
  "staff8": [224,576],
  "staff9": [256,576],
  "staff10": [288,576],
  "staff11": [320,576],
  "staff12": [352,576],
  "staff13": [384,576],
  "staff14": [416,576],
  "staff15": [448,576],
  "staff16": [480,576],
  "staff17": [512,576],
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
  "poisoncloud": [512,384],
  "venomouscircle": [544,384],
  "poisonbolt": [576,384],
  "throwflame": [608,384],
  "walloffire": [640,384],
  "twistingslash": [672,384],
  "haste": [704,384],
  "battlehymn": [736,384],
  "summonsmall": [768,384],
  "savethecorpse": [800,384],
  "corpse": [160,288],
  "animateskeleton": [832,384],
//armor
  "simplecloak": [32,352],
  "chainmail": [0,352],
  "cloak1": [64,352],
  "cloak2": [96,352],
  "cloak3": [128,352],
  "armor1": [160,352],
  "armor2": [192,352],
  "armor3": [224,352],
  "armor4": [256,352],
};
