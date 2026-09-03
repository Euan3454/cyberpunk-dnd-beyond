import { useMemo, useState } from 'react'
import { api } from '../api/client'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { equipWeapon } from '../features/charactersSlice'

export default function WeaponsPage() {
  const dispatch = useAppDispatch()
  const character = useAppSelector((state) => state.characters.selected)
  const weapons = useAppSelector((state) => state.catalog.weapons)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [calc, setCalc] = useState<{ attackTotal?: number; damageTotal?: number }>({})

  const filtered = useMemo(
    () => weapons.filter((item) => item.name.toLowerCase().includes(q.toLowerCase()) && (category ? item.category === category : true)),
    [weapons, q, category],
  )

  return (
    <section className="space-y-3">
      <div className="rounded border border-cyan-500/40 bg-black/50 p-3">
        <h2 className="text-lg font-bold">Weapons Database</h2>
        <div className="mt-2 flex gap-2">
          <input className="w-full rounded bg-slate-900 p-2" placeholder="Search weapons" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="rounded bg-slate-900 p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {['Pistols', 'Rifles', 'Shotguns', 'Melee', 'Explosives', 'Grenades'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <div key={item._id} className="rounded border border-cyan-700/60 bg-slate-950/70 p-3 text-sm">
            <h3 className="font-semibold">{item.name}</h3>
            <p>
              {item.category} • {item.rarity}
            </p>
            <p>
              {item.damage} • {item.range}m • {item.ammoType}
            </p>
            <button
              className="mt-2 rounded bg-cyan-500 px-2 py-1 font-semibold text-black disabled:opacity-50"
              disabled={!character}
              onClick={() => character && dispatch(equipWeapon({ characterId: character._id, weaponId: item._id }))}
            >
              Equip
            </button>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded border border-cyan-500 px-2 py-1 text-xs"
                onClick={async () => {
                  const { data } = await api.post('/calculations/attack-roll', {
                    baseModifier: Math.floor(((character?.stats.dexterity || 10) - 10) / 2),
                    weaponBonus: item.attackBonus,
                    cyberwareBonus: 0,
                    skillBonus: 0,
                  })
                  setCalc((prev) => ({ ...prev, attackTotal: data.total }))
                }}
              >
                Attack Roll
              </button>
              <button
                className="rounded border border-cyan-500 px-2 py-1 text-xs"
                onClick={async () => {
                  const { data } = await api.post('/calculations/damage', {
                    baseDamage: Number(item.damage.split('d')[1]) || 6,
                    weaponModifier: item.attackBonus,
                    crit: false,
                  })
                  setCalc((prev) => ({ ...prev, damageTotal: data.total }))
                }}
              >
                Damage Calc
              </button>
            </div>
          </div>
        ))}
      </div>
      {(calc.attackTotal || calc.damageTotal) && (
        <div className="rounded border border-cyan-500/40 bg-black/50 p-3 text-sm">
          {calc.attackTotal ? <p>Latest attack roll total: {calc.attackTotal}</p> : null}
          {calc.damageTotal ? <p>Latest damage total: {calc.damageTotal}</p> : null}
        </div>
      )}
    </section>
  )
}
