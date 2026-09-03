const rollD20 = () => Math.floor(Math.random() * 20) + 1;

const calculateAttackRoll = ({ baseModifier = 0, weaponBonus = 0, cyberwareBonus = 0, skillBonus = 0 }) => {
  const d20 = rollD20();
  const totalModifier = baseModifier + weaponBonus + cyberwareBonus + skillBonus;
  return { d20, totalModifier, total: d20 + totalModifier };
};

const calculateDamage = ({ baseDamage = 0, weaponModifier = 0, crit = false }) => {
  const total = baseDamage + weaponModifier;
  return {
    baseDamage,
    weaponModifier,
    crit,
    total: crit ? total * 2 : total,
  };
};

const calculateQuickHackSuccess = ({ intelligence = 0, difficulty = 'Medium', chainDepth = 1 }) => {
  const difficultyPenalty = { Easy: 5, Medium: 15, Hard: 30, Legendary: 45 }[difficulty] || 15;
  const chainPenalty = Math.max(0, chainDepth - 1) * 10;
  const chance = Math.max(5, Math.min(95, 70 + intelligence * 2 - difficultyPenalty - chainPenalty));
  return { chance, chainDepth, difficulty };
};

module.exports = { calculateAttackRoll, calculateDamage, calculateQuickHackSuccess };
