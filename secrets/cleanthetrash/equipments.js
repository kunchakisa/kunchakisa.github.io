"use strict"
if (!window.hasOwnProperty('Game')) window.Game = {}

Game.Equipments = {
  'null': {
    type: 'any',
    stats: {},
    name: 'None',
    lore: '',
    rarity: '',
  },
  // ==================================
  //  STARTING WEAPONS and EQUIPMENTS
  // ==================================
  'broom': {
    type: 'weapon',
    stats: {},
    name: 'Broom',
    lore: 'A simple broom used by anyone who wants to clean.',
    rarity: 'common',
  },
  'cool_cap': {
    type: 'helmet',
    stats: {},
    name: 'Cool Cap',
    lore: 'Wearing this cool cap gives you the cool vibes.',
    rarity: 'common',
  },
  'facemask': {
    type: 'mask',
    stats: {},
    name: 'Face Mask',
    lore: 'Protects you from dust and foul smell.',
    rarity: 'common',
  },
  'normal_clothes': {
    type: 'clothes',
    stats: {},
    name: 'Normal Clothes',
    lore: 'Gives you a decent appearance when cleaning.',
    rarity: 'common',
  },
  'rubber_boots': {
    type: 'shoes',
    stats: {},
    name: 'Rubber Boots',
    lore: 'Standard hiking boots to gross trash mountains and traversing rivers of trash.',
    rarity: 'common',
  },
  // ==================================
  //  WEAPONS
  // ==================================
  'tingting': {
    type: 'weapon',
    stats: {
      efficiency: 10,
    },
    name: 'Tingting',
    lore: 'A rigid cleaning tool that makes you a bit more efficient when cleaning.',
    rarity: 'uncommon',
  },
  'vacuum_cleaner': {
    type: 'weapon',
    stats: {
      efficiency: 15,
      cleaningSpeed: 6,
    },
    name: 'Vacuum Cleaner',
    lore: 'A good indoor cleaning tool. But this one can also clean outdoors!',
    rarity: 'uncommon',
  },
  'cleaning_sword': {
    type: 'weapon',
    stats: {
      efficiency: 22,
      cleaningSpeed: 10,
      stamina: 4,
    },
    name: 'Cleaning Sword',
    lore: 'Slash everything! Works like how it\'s advertised.\n'
      +'&b&cred.WARNING&rr: Keep out of reach of children!',
    rarity: 'rare',
  },
  'flying_automaton': {
    type: 'weapon',
    stats: {
      efficiency: 25,
      cleaningSpeed: 15,
      stamina: 5,
    },
    name: 'Flying Automaton',
    lore: 'Never had to work! This automaton helps you clean.\n'
      +'\n'
      +'&b&cyellow.Special Effect&rr: Automated Cleaning\n'
      +'This weapon cleans for you, never requiring you to tap just to clean.',
    rarity: 'epic',
  },
  'longreach_slashing_broom': {
    type: 'weapon',
    stats: {
      efficiency: 70,
      cleaningSpeed: 25,
      stamina: 15,
    },
    name: 'Long-reach Slashing Broom',
    lore: 'This long-reach broom is very effective in slashing trash out of '
      + 'existence. It also automatically recycles everything.\n'
      + '\n'
      + 'Special Effect: RECYCLE\n'
      + 'This weapon gives +100% extra coins.',
    rarity: 'lengendary',
  },
  // ==================================
  //  HELMETS
  // ==================================
  'agility_cap': {
    type: 'helmet',
    stats: {
      cleaningSpeed: 5,
    },
    name: 'Agility Cap',
    lore: 'It is made of light materials that\'s also comfortable to wear.',
    rarity: 'uncommon',
  },
  'motivational_bandana': {
    type: 'helmet',
    stats: {
      efficiency: 8,
      cleaningSpeed: 2,
    },
    name: 'Motivational Bandana',
    lore: 'This makes you look very inspirational to others, and that also makes you clean more efficiently!',
    rarity: 'uncommon',
  },
  'cleaning_cap': {
    type: 'helmet',
    stats: {
      efficiency: 15,
      cleaningSpeed: 5,
    },
    name: 'Cap of Cleaning',
    lore: 'This unusual cap seems to be used by some cleaning groups. They all wear this cap.',
    rarity: 'rare',
  },
  'goodwill_cap': {
    type: 'helmet',
    stats: {
      efficiency: 18,
      cleaningSpeed: 7,
      stamina: 3,
    },
    name: 'Cap of Goodwill',
    lore: 'Mark of goodwill. This looks like an ordinary cap, but it gives you energy to clean.',
    rarity: 'rare',
  },
  'fact_or_cap': {
    type: 'helmet',
    stats: {
      efficiency: 30,
      cleaningSpeed: 10,
      stamina: 5,
    },
    name: 'Fact or Cap',
    lore: 'Some content creators have worn this cap, and they wanted to see if this really makes you clean faster. They\'ve benn slapped.',
    rarity: 'epic',
  },
  'cappy_paste': {
    type: 'helmet',
    stats: {
      efficiency: 60,
      cleaningSpeed: 15,
      stamina: 10,
    },
    name: 'Cappy Paste',
    lore: 'Copy pasting seems to make tasks easier and faster.',
    rarity: 'epic',
  },
  'cap': {
    type: 'helmet',
    stats: {
      efficiency: 200,
      cleaningSpeed: 50,
      stamina: 20,
    },
    name: 'Cap',
    lore: 'Sometimes, the simplest cap is the powerful one. And that seems to be the case!',
    rarity: 'legendary',
  },
  'light_cap': {
    type: 'helmet',
    stats: {
      efficiency: 200,
      cleaningSpeed: 250,
      stamina: 30,
    },
    name: 'Cap of Light',
    lore: 'A lighter cap of simplicity. This is faster than the legendary cap.',
    rarity: 'legendary',
  },
  // ==================================
  //  FACEMASK
  // ==================================
  'facemask_v2': {
    type: 'mask',
    stats: {
      efficiency: 20,
      criticalChance: 10,
    },
    name: 'Facemask v2',
    lore: 'Gives more protection to foul dust and smell.',
    rarity: 'rare',
  },
  'gasmask': {
    type: 'mask',
    stats: {
      efficiency: 50,
      criticalChance: 40,
    },
    name: 'Gas Mask',
    lore: 'Overcautious fellow.',
    rarity: 'legendary',
  },
  // ==================================
  //  CLOTHES
  // ==================================
  'light_clothes': {
    type: 'clothes',
    stats: {
      efficiency: 0,
      cleaningSpeed: 25,
      stamina: 4,
    },
    name: 'Light Clothes',
    lore: 'Very comfortable clothes.',
    rarity: 'common',
  },
  'motivational_tee': {
    type: 'clothes',
    stats: {
      efficiency: 12,
      cleaningSpeed: 20,
      stamina: 4,
    },
    name: 'Motivational Tee',
    lore: 'This makes you look very inspirational to others, and that also makes you clean more efficiently!\n'
      + '"Clean as you go."',
    rarity: 'uncommon',
  },
  'waterproof_jacket': {
    type: 'clothes',
    stats: {
      efficiency: 20,
      cleaningSpeed: 20,
      stamina: 10,
    },
    name: 'Waterproof Jacket',
    lore: 'Mud won\'t stick to your clothes. A very powerful equipment indeed.',
    rarity: 'rare',
  },
  'disclothes': {
    type: 'clothes',
    stats: {
      efficiency: 22,
      cleaningSpeed: 60,
      stamina: 20,
    },
    name: 'Disclothes',
    lore: 'It\'s the disco, come on, let\'s dance!\n'
      +'It\'s good to have some fun while doing your work.',
    rarity: 'epic',
  },
  'thick_outfit': {
    type: 'clothes',
    stats: {
      efficiency: 200,
      cleaningSpeed: -30,
      stamina: 20,
    },
    name: 'Thick Outfit',
    lore: 'This thick &ithing&r won\'t let any dirt and dust stick to your body.'
      +'This is too heavy to wear, but it lets you clean more efficiently.\n',
    rarity: 'legendary',
  },
  // ==================================
  //  SHOES
  // ==================================
  'combat_shoes': {
    type: 'shoes',
    stats: {
      efficiency: 10,
      cleaningSpeed: -1,
      criticalChance: 2,
      criticalDamage: 20,
    },
    name: 'Combat Shoes',
    lore: 'It\'s a bit hard to move while wearing these, but it makes you '
      +'feel more comfortable with your steps.\n'
      +'Stompy stompy',
    rarity: 'uncommon',
  },
  'mist_shoes': {
    type: 'shoes',
    stats: {
      efficiency: 20,
      cleaningSpeed: 5,
      criticalChance: 4,
      criticalDamage: 30,
    },
    name: 'Mist Shoes',
    lore: 'Guises you in a mist, helping you clean more efficiently and hitting '
      +'the trashes\' weak points more effectively.\n',
    rarity: 'rare',
  },
  'heavy_shoes': {
    type: 'shoes',
    stats: {
      efficiency: 80,
      cleaningSpeed: -20,
      criticalChance: 4,
      criticalDamage: 80,
    },
    name: 'Heavy Shoes',
    lore: 'A very heavy pair of shoes that stomps the trash flat.\n'
      + '\n'
      + 'Special Effect: SKILLED STOMPING\n'
      + 'These shoes gives more efficiency based on your level.',
    rarity: 'epic',
  },
  'thunderboots': {
    type: 'shoes',
    stats: {
      efficiency: 100,
      cleaningSpeed: 20,
      criticalChance: 5,
      criticalDamage: 150,
    },
    name: 'Thunderboots',
    lore: 'A magical pair of boots that lets you control, or be the thunder.\n'
      +'\n'
      +'Special Effect&rr: SOARING THUNDER\n'
      +'Gives the power of the thunder, giving you 50% more cleaning speed and 2x more efficiency. '
      +'It also lets you see some of the things that won\'t ever be known to man.',
    rarity: 'legendary',
  },
  // ==================================
  //  OBFUSCATED
  // ==================================
  'obfuscated_cap': {
    type: 'helmet',
    stats: {
      efficiency: 1000,
      cleaningSpeed: 500,
      stamina: 300,
    },
    name: 'RoaxXwvkza',
    lore: 'This seems to be a glitch in this world. This cap embodies the pain of the one who\'ve worn it for the longest time.'
      +'\n'
      +'Special Effect: Ridiculous Learning\n'
      +'Allows you to learn so much faster.',
    rarity: 'mythic',
  },
  'obfuscated_weapon': {
    type: 'weapon',
    stats: {
      efficiency: 2000,
      stamina: 50,
      criticalChance: 1100,
      criticalDamage: 2000,
    },
    name: 'Dzcjswue&otaPj',
    lore: 'This seems to be a glitch in this world. This &oweapon&r is so hard to wield to the point that it divides your stamina by 4. '
      + 'Whoever used it before must be sooo tired already.\n'
      +'\n'
      +'&b&cyellow.Special Effect&rr: &oAutomated Cleaning&r\n'
      +'This &oweapon&r does the &ocleaning&r for you, &onever requiring you to tap just to clean&r.',
    rarity: 'mythic',
  },
  'obfuscated_mask': {
    type: 'mask',
    stats: {
      efficiency: 100,
      stamina: 500,
    },
    name: '&mGzndivzeYoon',
    lore: 'This seems to be a glitch in this world. The design seems to cover even your eyes and ears, not allowing you to hear, see, and think. '
      + 'This mask of indoctrination divides your critical chance by 20, but it multiplies your crit damage by x1000. '
      + 'This bonus becomes x7,000,000 when your crit chance reaches 100% even after the critical chance debuff.',
    rarity: 'mythic',
  },
  'obfuscated_clothes': {
    type: 'clothes',
    stats: {
      efficiency: 150,
      stamina: -200,
      cleaningSpeed: 100,
    },
    name: 'AnznnIg',
    lore: 'This seems to be a glitch in this world. The clothes are changing in colors and sizes, but you can still wear it. '
      + 'It multiplies your stamina by x1500. '
      + 'This also multiplies your efficiency by x5, your cleaning speed by x2, and your crit damage by x10',
    rarity: 'mythic',
  },
  'obfuscated_shoes': {
    type: 'shoes',
    stats: {
      efficiency: 200,
      cleaningSpeed: 70,
      criticalChance: 15,
      criticalDamage: 300,
    },
    name: 'Poxximxmxm',
    lore: 'This seems to be a glitch in this world. The &oxximxmxm within this equipment makes you gain knowledge relatively fast, '
      + 'making you learn things equally with the same time and effort.\n'
      + '\n'
      + 'Special Effect&rr: THE STOMPING\n'
      + 'These shoes gives more efficiency based on your level.\n'
      + '\n'
      +'Special Effect&rr: THUNDER\n'
      +'Gives the power of the thunder, giving you 50% more cleaning speed and 2x more efficiency. '
      +'It also lets you see some of the things that won\'t ever be known to man.',
    rarity: 'mythic',
  },
  'obfuscated_ring': {
    type: 'accessory',
    stats: {},
    name: 'Xkxnje',
    lore: 'This seems to be a glitch in this world. This ring cheat the constancy of equipments, letting them grow with your level.',
    rarity: 'mythic',
  },
  'obfuscated_necklace': {
    type: 'accessory',
    stats: {},
    name: 'Moo&ewwr',
    lore: 'This seems to be a glitch in this world. This necklace balances all the odds of visiting different places.',
    rarity: 'mythic',
  },
}
