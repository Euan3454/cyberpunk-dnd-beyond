const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    baseStats: { type: Map, of: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CharacterClass', classSchema);
