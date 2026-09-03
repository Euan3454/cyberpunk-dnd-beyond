const mongoose = require('mongoose');

const quickHackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Legendary'], required: true },
    effects: [{ type: String }],
    baseSuccessRate: { type: Number, required: true, min: 0, max: 100 },
    chainable: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuickHack', quickHackSchema);
