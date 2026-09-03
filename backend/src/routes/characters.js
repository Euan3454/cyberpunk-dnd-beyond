const express = require('express');
const auth = require('../middleware/auth');
const Character = require('../models/Character');
const Cyberware = require('../models/Cyberware');
const Weapon = require('../models/Weapon');
const Skill = require('../models/Skill');

const router = express.Router();

const populateCharacter = (query) =>
  query
    .populate('equippedCyberware')
    .populate('equippedWeapons')
    .populate('learnedSkills', 'name tree category levelRequirement masteryLevel perk')
    .populate('learnedQuickHacks');

router.post('/', auth, async (req, res) => {
  const character = await Character.create({ ...req.body, userId: req.user.userId });
  return res.status(201).json(await populateCharacter(Character.findById(character._id)));
});

router.get('/', auth, async (req, res) => {
  const characters = await populateCharacter(Character.find({ userId: req.user.userId }));
  return res.json(characters);
});

router.get('/:id', auth, async (req, res) => {
  const character = await populateCharacter(Character.findOne({ _id: req.params.id, userId: req.user.userId }));
  if (!character) return res.status(404).json({ message: 'Character not found' });
  return res.json(character);
});

router.put('/:id', auth, async (req, res) => {
  const character = await Character.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, req.body, { new: true });
  if (!character) return res.status(404).json({ message: 'Character not found' });
  return res.json(await populateCharacter(Character.findById(character._id)));
});

router.delete('/:id', auth, async (req, res) => {
  const deleted = await Character.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  if (!deleted) return res.status(404).json({ message: 'Character not found' });
  return res.status(204).send();
});

router.get('/compare/:firstId/:secondId', auth, async (req, res) => {
  const ids = [req.params.firstId, req.params.secondId];
  const characters = await Character.find({ _id: { $in: ids }, userId: req.user.userId });
  if (characters.length !== 2) return res.status(404).json({ message: 'Characters not found' });
  const [a, b] = characters;
  const statDiff = Object.keys(a.stats.toObject()).reduce((acc, key) => {
    acc[key] = a.stats[key] - b.stats[key];
    return acc;
  }, {});
  return res.json({ first: a, second: b, statDiff, essenceDiff: a.essenceUsed - b.essenceUsed, levelDiff: a.level - b.level });
});

router.post('/:id/cyberware/:cyberwareId/equip', auth, async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id, userId: req.user.userId });
  const cyberware = await Cyberware.findById(req.params.cyberwareId);
  if (!character || !cyberware) return res.status(404).json({ message: 'Character or cyberware not found' });
  if (character.equippedCyberware.some((id) => id.toString() === cyberware._id.toString())) {
    return res.status(409).json({ message: 'Cyberware already equipped' });
  }

  const currentCyberware = await Cyberware.find({ _id: { $in: character.equippedCyberware } });
  const hasConflict = currentCyberware.some((item) =>
    cyberware.conflictsWith.some((conflictId) => conflictId.toString() === item._id.toString())
  );
  if (hasConflict) {
    return res.status(400).json({ message: 'Cyberware compatibility conflict detected' });
  }

  const newEssence = character.essenceUsed + cyberware.essenceCost;
  if (newEssence > character.essenceMax) {
    return res.status(400).json({ message: 'Insufficient essence capacity' });
  }

  character.equippedCyberware.push(cyberware._id);
  character.essenceUsed = newEssence;
  await character.save();
  return res.json(await populateCharacter(Character.findById(character._id)));
});

router.post('/:id/cyberware/:cyberwareId/unequip', auth, async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id, userId: req.user.userId });
  const cyberware = await Cyberware.findById(req.params.cyberwareId);
  if (!character || !cyberware) return res.status(404).json({ message: 'Character or cyberware not found' });

  character.equippedCyberware = character.equippedCyberware.filter((id) => id.toString() !== cyberware._id.toString());
  character.essenceUsed = Math.max(0, character.essenceUsed - cyberware.essenceCost);
  await character.save();
  return res.json(await populateCharacter(Character.findById(character._id)));
});

router.post('/:id/weapons/:weaponId/equip', auth, async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id, userId: req.user.userId });
  const weapon = await Weapon.findById(req.params.weaponId);
  if (!character || !weapon) return res.status(404).json({ message: 'Character or weapon not found' });

  if (!character.equippedWeapons.some((id) => id.toString() === weapon._id.toString())) {
    character.equippedWeapons.push(weapon._id);
    await character.save();
  }
  return res.json(await populateCharacter(Character.findById(character._id)));
});

router.post('/:id/weapons/:weaponId/unequip', auth, async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!character) return res.status(404).json({ message: 'Character not found' });
  character.equippedWeapons = character.equippedWeapons.filter((id) => id.toString() !== req.params.weaponId);
  await character.save();
  return res.json(await populateCharacter(Character.findById(character._id)));
});

router.post('/:id/skills/:skillId/learn', auth, async (req, res) => {
  const character = await Character.findOne({ _id: req.params.id, userId: req.user.userId });
  const skill = await Skill.findById(req.params.skillId);
  if (!character || !skill) return res.status(404).json({ message: 'Character or skill not found' });

  if (character.level < skill.levelRequirement) {
    return res.status(400).json({ message: 'Level too low for this skill' });
  }
  const learned = new Set(character.learnedSkills.map((id) => id.toString()));
  const missingReq = skill.prerequisites.some((id) => !learned.has(id.toString()));
  if (missingReq) {
    return res.status(400).json({ message: 'Missing skill prerequisite' });
  }
  if (!learned.has(skill._id.toString())) {
    character.learnedSkills.push(skill._id);
    await character.save();
  }
  return res.json(await populateCharacter(Character.findById(character._id)));
});

module.exports = router;
