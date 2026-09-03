const mongoose = require('mongoose');

const cyberwareSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['Arms', 'Legs', 'Eyes', 'Nervous System', 'Skeletal', 'Skin', 'Organs'],
      required: true,
    },
    tier: { type: String, enum: ['Common', 'Rare', 'Epic', 'Legendary'], required: true },
    essenceCost: { type: Number, required: true, min: 0 },
    statBonuses: { type: Map, of: Number, default: {} },
    compatibleWith: [{ type: String }],
    conflictsWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cyberware' }],
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cyberware', cyberwareSchema);
