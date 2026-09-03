const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    tree: { type: String, required: true },
    category: { type: String, required: true },
    levelRequirement: { type: Number, required: true, min: 1 },
    masteryLevel: { type: Number, default: 1, min: 1, max: 5 },
    perk: { type: String, default: '' },
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
