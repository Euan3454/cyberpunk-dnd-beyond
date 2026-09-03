const express = require('express');
const Cyberware = require('../models/Cyberware');
const Weapon = require('../models/Weapon');
const Skill = require('../models/Skill');
const QuickHack = require('../models/QuickHack');
const CharacterClass = require('../models/CharacterClass');

const router = express.Router();

router.get('/cyberware', async (req, res) => {
  const { q = '', category = '', tier = '' } = req.query;
  const filter = {
    ...(q ? { name: { $regex: q, $options: 'i' } } : {}),
    ...(category ? { category } : {}),
    ...(tier ? { tier } : {}),
  };
  const items = await Cyberware.find(filter).limit(500);
  return res.json(items);
});

router.get('/weapons', async (req, res) => {
  const { q = '', category = '', rarity = '' } = req.query;
  const filter = {
    ...(q ? { name: { $regex: q, $options: 'i' } } : {}),
    ...(category ? { category } : {}),
    ...(rarity ? { rarity } : {}),
  };
  const items = await Weapon.find(filter).limit(500);
  return res.json(items);
});

router.get('/skills', async (_req, res) => {
  const skills = await Skill.find().populate('prerequisites', 'name');
  return res.json(skills);
});

router.get('/skill-trees', async (_req, res) => {
  const skills = await Skill.find();
  const grouped = skills.reduce((acc, skill) => {
    acc[skill.tree] = acc[skill.tree] || [];
    acc[skill.tree].push(skill);
    return acc;
  }, {});
  return res.json(grouped);
});

router.get('/quickhacks', async (req, res) => {
  const { q = '', category = '', difficulty = '' } = req.query;
  const filter = {
    ...(q ? { name: { $regex: q, $options: 'i' } } : {}),
    ...(category ? { category } : {}),
    ...(difficulty ? { difficulty } : {}),
  };
  const hacks = await QuickHack.find(filter).limit(500);
  return res.json(hacks);
});

router.get('/classes', async (_req, res) => {
  const classes = await CharacterClass.find();
  return res.json(classes);
});

module.exports = router;
