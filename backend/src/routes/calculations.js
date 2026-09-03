const express = require('express');
const { calculateAttackRoll, calculateDamage, calculateQuickHackSuccess } = require('../utils/calculations');

const router = express.Router();

router.post('/attack-roll', (req, res) => {
  return res.json(calculateAttackRoll(req.body));
});

router.post('/damage', (req, res) => {
  return res.json(calculateDamage(req.body));
});

router.post('/quickhack-success', (req, res) => {
  return res.json(calculateQuickHackSuccess(req.body));
});

module.exports = router;
