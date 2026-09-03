import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { createCharacter } from '../features/charactersSlice'
import type { Stats } from '../types'

const statsKeys: (keyof Stats)[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

export default function CreateCharacterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const classes = useAppSelector((state) => state.catalog.classes)
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [appearance, setAppearance] = useState({ avatarUrl: '', hair: '', eyes: '' })
  const [stats, setStats] = useState<Stats>({ strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 })

  const pointsLeft = useMemo(() => 42 - statsKeys.reduce((sum, key) => sum + stats[key], 0), [stats])

  const updateStat = (key: keyof Stats, delta: number) => {
    const next = stats[key] + delta
    if (next < 8 || next > 15) return
    const nextTotal = statsKeys.reduce((sum, statKey) => sum + (statKey === key ? next : stats[statKey]), 0)
    if (nextTotal > 42) return
    setStats({ ...stats, [key]: next })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const result = await dispatch(createCharacter({ name, className, stats, appearance, statPointsRemaining: pointsLeft }))
    if (result.meta.requestStatus === 'fulfilled') navigate('/character')
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="rounded border border-cyan-500/40 bg-black/50 p-4">
        <h2 className="text-xl font-bold">Character Creation Wizard</h2>
        <p className="text-sm text-cyan-200">Allocate stats and define your profile.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded bg-slate-900 p-2" placeholder="Character Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <select className="rounded bg-slate-900 p-2" required value={className} onChange={(e) => setClassName(e.target.value)}>
          <option value="">Select class</option>
          {classes.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <input className="rounded bg-slate-900 p-2" placeholder="Avatar URL" value={appearance.avatarUrl} onChange={(e) => setAppearance({ ...appearance, avatarUrl: e.target.value })} />
        <input className="rounded bg-slate-900 p-2" placeholder="Hair" value={appearance.hair} onChange={(e) => setAppearance({ ...appearance, hair: e.target.value })} />
      </div>
      <div className="rounded border border-cyan-500/40 bg-black/50 p-4">
        <h3 className="mb-2 font-semibold">Stat Allocation • Points left: {pointsLeft}</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {statsKeys.map((key) => (
            <div key={key} className="flex items-center justify-between rounded bg-slate-900 px-3 py-2">
              <span className="capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded border px-2" onClick={() => updateStat(key, -1)}>
                  -
                </button>
                <span>{stats[key]}</span>
                <button type="button" className="rounded border px-2" onClick={() => updateStat(key, 1)}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="rounded bg-cyan-500 px-4 py-2 font-semibold text-black">Save Character</button>
    </form>
  )
}
