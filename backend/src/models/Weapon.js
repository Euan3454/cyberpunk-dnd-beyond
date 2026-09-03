const mongoose = require('mongoose');

const modSchema = new mongoose.Schema(
  {
    name: String,
    attackModifier: { type: Number, default: 0 },
    damageModifier: { type: Number, default: 0 },
  },
  { _id: false }
);

const weaponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['Pistols', 'Rifles', 'Shotguns', 'Melee', 'Explosives', 'Grenades'],
      required: true,
    },
    damage: { type: String, required: true },
    range: { type: Number, required: true },
    rarity: { type: String, enum: ['Common', 'Rare', 'Epic', 'Legendary'], required: true },
    ammoType: { type: String, required: true },
    attackBonus: { type: Number, default: 0 },
    mods: [modSchema],
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Weapon', weaponSchema);
