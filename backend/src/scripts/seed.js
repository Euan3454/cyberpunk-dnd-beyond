require('dotenv').config();
const { connectDB } = require('../config/db');
const Cyberware = require('../models/Cyberware');
const Weapon = require('../models/Weapon');
const Skill = require('../models/Skill');
const QuickHack = require('../models/QuickHack');
const CharacterClass = require('../models/CharacterClass');
const User = require('../models/User');
const Character = require('../models/Character');
const bcrypt = require('bcryptjs');

const categories = ['Arms', 'Legs', 'Eyes', 'Nervous System', 'Skeletal', 'Skin', 'Organs'];
const weaponCategories = ['Pistols', 'Rifles', 'Shotguns', 'Melee', 'Explosives', 'Grenades'];
const tiers = ['Common', 'Rare', 'Epic', 'Legendary'];
const difficulties = ['Easy', 'Medium', 'Hard', 'Legendary'];
const trees = ['Solo', 'Netrunner', 'Techie', 'Nomad', 'Street Samurai', 'Operative', 'Ghost', 'MedTech'];

const buildCyberware = () =>
  Array.from({ length: 56 }, (_, i) => ({
    name: `Cyberware Mk-${i + 1}`,
    category: categories[i % categories.length],
    tier: tiers[i % tiers.length],
    essenceCost: Number((0.2 + (i % 5) * 0.2).toFixed(1)),
    statBonuses: { dexterity: (i % 3) + 1, intelligence: i % 2 },
    compatibleWith: [categories[i % categories.length]],
    description: `Synthetic upgrade unit ${i + 1}`,
  }));

const buildWeapons = () =>
  Array.from({ length: 120 }, (_, i) => ({
    name: `Weapon-${i + 1}`,
    category: weaponCategories[i % weaponCategories.length],
    damage: `${1 + (i % 4)}d${6 + (i % 3) * 2}`,
    range: 10 + (i % 8) * 15,
    rarity: tiers[i % tiers.length],
    ammoType: i % 3 === 0 ? 'Energy Cell' : i % 2 === 0 ? 'Heavy Ammo' : 'Standard Ammo',
    attackBonus: i % 4,
    mods: [{ name: 'Scope', attackModifier: 1, damageModifier: 0 }],
    description: `Weapon platform ${i + 1}`,
  }));

const buildSkills = () => {
  const skills = [];
  for (let i = 0; i < trees.length; i += 1) {
    for (let j = 0; j < 6; j += 1) {
      skills.push({
        name: `${trees[i]} Skill ${j + 1}`,
        tree: trees[i],
        category: trees[i],
        levelRequirement: j + 1,
        masteryLevel: (j % 5) + 1,
        perk: `Perk ${j + 1} of ${trees[i]}`,
        description: `Progression skill ${j + 1} in ${trees[i]}`,
      });
    }
  }
  return skills;
};

const buildQuickHacks = () =>
  Array.from({ length: 55 }, (_, i) => ({
    name: `QuickHack-${i + 1}`,
    category: ['Control', 'Damage', 'Distraction', 'Stealth'][i % 4],
    difficulty: difficulties[i % difficulties.length],
    effects: ['Disrupt', 'Stun', 'Burn'].slice(0, (i % 3) + 1),
    baseSuccessRate: 50 + (i % 5) * 8,
    chainable: i % 2 === 0,
    description: `Quickhack protocol ${i + 1}`,
  }));

const classes = [
  { name: 'Netrunner', description: 'Master of systems and intrusion', baseStats: { intelligence: 15, dexterity: 12, constitution: 10, wisdom: 12, charisma: 10, strength: 8 } },
  { name: 'Solo', description: 'Combat specialist', baseStats: { strength: 14, dexterity: 13, constitution: 13, intelligence: 8, wisdom: 10, charisma: 8 } },
  { name: 'Techie', description: 'Engineer and inventor', baseStats: { intelligence: 14, dexterity: 11, constitution: 11, wisdom: 12, charisma: 9, strength: 9 } },
  { name: 'Nomad', description: 'Mobile survivalist', baseStats: { strength: 11, dexterity: 13, constitution: 12, intelligence: 10, wisdom: 11, charisma: 10 } },
  { name: 'MedTech', description: 'Cybernetic field medic', baseStats: { intelligence: 13, dexterity: 12, constitution: 11, wisdom: 13, charisma: 10, strength: 8 } },
];

async function runSeed() {
  await connectDB();
  await Promise.all([
    Cyberware.deleteMany({}),
    Weapon.deleteMany({}),
    Skill.deleteMany({}),
    QuickHack.deleteMany({}),
    CharacterClass.deleteMany({}),
    User.deleteMany({}),
    Character.deleteMany({}),
  ]);

  const [cyberware, weapons, classesSaved, hacks] = await Promise.all([
    Cyberware.insertMany(buildCyberware()),
    Weapon.insertMany(buildWeapons()),
    CharacterClass.insertMany(classes),
    QuickHack.insertMany(buildQuickHacks()),
  ]);

  const skillDocs = await Skill.insertMany(buildSkills());
  const skillMap = new Map(skillDocs.map((s) => [s.name, s]));

  for (const skill of skillDocs) {
    const index = Number(skill.name.match(/(\\d+)$/)?.[1] || 1);
    if (index > 1) {
      const prevName = `${skill.tree} Skill ${index - 1}`;
      skill.prerequisites = [skillMap.get(prevName)._id];
      await skill.save();
    }
  }

  const user = await User.create({
    username: 'demo',
    email: 'demo@cyberpunk.local',
    passwordHash: await bcrypt.hash('demo12345', 10),
  });

  const classOne = classesSaved[0];
  await Character.insertMany([
    {
      userId: user._id,
      name: 'Specter',
      className: classOne.name,
      level: 6,
      stats: classOne.baseStats,
      equippedCyberware: cyberware.slice(0, 3).map((c) => c._id),
      equippedWeapons: weapons.slice(0, 2).map((w) => w._id),
      learnedSkills: skillDocs.slice(0, 4).map((s) => s._id),
      learnedQuickHacks: hacks.slice(0, 3).map((h) => h._id),
      essenceMax: 6,
      essenceUsed: cyberware.slice(0, 3).reduce((sum, c) => sum + c.essenceCost, 0),
    },
    {
      userId: user._id,
      name: 'Chrome Viper',
      className: classesSaved[1].name,
      level: 4,
      stats: classesSaved[1].baseStats,
      equippedCyberware: cyberware.slice(3, 6).map((c) => c._id),
      equippedWeapons: weapons.slice(2, 5).map((w) => w._id),
      learnedSkills: skillDocs.slice(5, 8).map((s) => s._id),
      learnedQuickHacks: hacks.slice(4, 7).map((h) => h._id),
      essenceMax: 6,
      essenceUsed: cyberware.slice(3, 6).reduce((sum, c) => sum + c.essenceCost, 0),
    },
  ]);

  console.log('Seed complete');
  process.exit(0);
}

runSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});
