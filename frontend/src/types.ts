export type Stats = {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export type Character = {
  _id: string
  name: string
  className: string
  level: number
  stats: Stats
  statPointsRemaining: number
  essenceMax: number
  essenceUsed: number
  equippedCyberware: Cyberware[]
  equippedWeapons: Weapon[]
  learnedSkills: Skill[]
  learnedQuickHacks: QuickHack[]
  appearance?: Record<string, string>
}

export type Cyberware = {
  _id: string
  name: string
  category: string
  tier: string
  essenceCost: number
  description: string
}

export type Weapon = {
  _id: string
  name: string
  category: string
  damage: string
  range: number
  rarity: string
  ammoType: string
  attackBonus: number
}

export type Skill = {
  _id: string
  name: string
  tree: string
  category: string
  levelRequirement: number
  masteryLevel: number
  perk: string
  description: string
}

export type QuickHack = {
  _id: string
  name: string
  category: string
  difficulty: string
  effects: string[]
  baseSuccessRate: number
  chainable: boolean
  description: string
}

export type CharacterClass = {
  _id: string
  name: string
  description: string
  baseStats: Stats
}
