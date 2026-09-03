const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ userId: user._id.toString(), username: user.username }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  });

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

router.post(
  '/register',
  [body('username').isString().isLength({ min: 3 }), body('email').isEmail(), body('password').isLength({ min: 8 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, password } = req.body;
      const email = normalizeEmail(req.body.email);
      const exists = await User.findOne({ $or: [{ username: String(username).trim() }, { email }] });
      if (exists) {
        return res.status(409).json({ message: 'User already exists' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const normalizedUsername = String(username).trim();
      const user = await User.create({ username: normalizedUsername, email, passwordHash });
      return res.status(201).json({ token: signToken(user), user: { id: user._id, username: normalizedUsername, email } });
    } catch (error) {
      return next(error);
    }
  }
);

router.post('/login', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ token: signToken(user), user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    return next(error);
  }
});

router.post('/password-reset/request', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: 'If your account exists, a reset token has been generated.' });
  }
  const resetToken = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '15m' });
  return res.json({ message: 'Password reset token generated', resetToken });
});

router.post('/password-reset/confirm', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(payload.userId, { passwordHash });
    return res.json({ message: 'Password reset successful' });
  } catch {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }
});

module.exports = router;
