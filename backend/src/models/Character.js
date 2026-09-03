const mongoose = require('mongoose');

const appearanceSchema = new mongoose.Schema(
  {
    avatarUrl: String,
    eyes: String,
    hair: String,
    bodyType: String,
    style: String,
  },
  { _id: false }
);

const characterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    className: { type: String, required: true },
    level: { type: Number, default: 1, min: 1 },
    stats: {
      strength: { type: Number, default: 8 },
      dexterity: { type: Number, default: 8 },
      constitution: { type: Number, default: 8 },
      intelligence: { type: Number, default: 8 },
      wisdom: { type: Number, default: 8 },
      charisma: { type: Number, default: 8 },
    },
    statPointsRemaining: { type: Number, default: 12 },
    essenceMax: { type: Number, default: 6 },
    essenceUsed: { type: Number, default: 0 },
    equippedCyberware: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cyberware' }],
    equippedWeapons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Weapon' }],
    learnedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    learnedQuickHacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuickHack' }],
    skillPoints: { type: Number, default: 0 },
    appearance: { type: appearanceSchema, default: {} },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Character', characterSchema);
