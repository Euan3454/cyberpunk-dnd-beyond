import { useMemo, useState } from 'react'
import { api } from '../api/client'
import { useAppSelector } from '../app/hooks'

export default function QuickHacksPage() {
  const character = useAppSelector((state) => state.characters.selected)
  const quickhacks = useAppSelector((state) => state.catalog.quickhacks)
  const [q, setQ] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [chainDepth, setChainDepth] = useState(1)
  const [successRate, setSuccessRate] = useState<number | null>(null)

  const filtered = useMemo(
    () => quickhacks.filter((item) => item.name.toLowerCase().includes(q.toLowerCase()) && (difficulty ? item.difficulty === difficulty : true)),
    [quickhacks, q, difficulty],
  )

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold">Quick Hack Browser</h2>
      <div className="flex gap-2">
        <input className="w-full rounded bg-slate-900 p-2" placeholder="Search quick hacks" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="rounded bg-slate-900 p-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All difficulty</option>
          {['Easy', 'Medium', 'Hard', 'Legendary'].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>
      <div className="rounded border border-cyan-500/40 bg-black/50 p-3 text-sm">
        <h3 className="font-semibold">Quickhacking Success Rate Calculator</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <label className="rounded bg-slate-900 px-2 py-1">
            Chain depth
            <input
              className="ml-2 w-16 rounded bg-slate-800 p-1"
              type="number"
              min={1}
              max={5}
              value={chainDepth}
              onChange={(e) => setChainDepth(Number(e.target.value))}
            />
          </label>
          <button
            className="rounded bg-cyan-500 px-3 py-1 font-semibold text-black"
            onClick={async () => {
              const { data } = await api.post('/calculations/quickhack-success', {
                intelligence: character?.stats.intelligence || 10,
                difficulty: difficulty || 'Medium',
                chainDepth,
              })
              setSuccessRate(data.chance)
            }}
          >
            Calculate
          </button>
        </div>
        {successRate !== null ? <p className="mt-2 text-cyan-200">Estimated success rate: {successRate}%</p> : null}
      </div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <div key={item._id} className="rounded border border-cyan-600/50 bg-black/50 p-3 text-sm">
            <p className="font-semibold">{item.name}</p>
            <p>
              {item.category} • {item.difficulty}
            </p>
            <p>Base success: {item.baseSuccessRate}%</p>
            <p>{item.effects.join(', ')}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
