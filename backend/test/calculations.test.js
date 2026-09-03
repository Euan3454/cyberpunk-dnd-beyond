const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateDamage, calculateQuickHackSuccess } = require('../src/utils/calculations');

test('calculateDamage doubles on crit', () => {
  const result = calculateDamage({ baseDamage: 10, weaponModifier: 3, crit: true });
  assert.equal(result.total, 26);
});

test('quickhack success decreases with chain depth and difficulty', () => {
  const normal = calculateQuickHackSuccess({ intelligence: 8, difficulty: 'Easy', chainDepth: 1 });
  const harder = calculateQuickHackSuccess({ intelligence: 8, difficulty: 'Legendary', chainDepth: 3 });
  assert.ok(normal.chance > harder.chance);
});
