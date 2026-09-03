const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash');
  return res.json(user);
});

router.patch('/me', auth, async (req, res) => {
  const allowed = { avatarUrl: req.body.avatarUrl, bio: req.body.bio, username: req.body.username };
  const user = await User.findByIdAndUpdate(req.user.userId, allowed, { new: true }).select('-passwordHash');
  return res.json(user);
});

module.exports = router;
