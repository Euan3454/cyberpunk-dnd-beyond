const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash');
  return res.json(user);
});

router.patch('/me', auth, async (req, res) => {
  const allowed = {};
  if (typeof req.body.avatarUrl === 'string') allowed.avatarUrl = req.body.avatarUrl.trim();
  if (typeof req.body.bio === 'string') allowed.bio = req.body.bio.trim();
  if (typeof req.body.username === 'string' && req.body.username.trim().length >= 3) {
    allowed.username = req.body.username.trim();
  }
  const user = await User.findByIdAndUpdate(req.user.userId, allowed, { new: true }).select('-passwordHash');
  return res.json(user);
});

module.exports = router;
