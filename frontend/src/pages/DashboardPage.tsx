import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { compareCharacters, deleteCharacter, selectCharacterById } from '../features/charactersSlice'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const chars = useAppSelector((state) => state.characters.items)
  const comparison = useAppSelector((state) => state.characters.comparison)
  const [compareIds, setCompareIds] = useState({ firstId: '', secondId: '' })

  return (
    <section className="space-y-4">
      <div className="rounded border border-cyan-500/40 bg-black/50 p-4">
        <h2 className="text-xl font-bold">Welcome, {user?.username || 'Runner'}</h2>
        <p className="text-sm text-cyan-200">Manage your characters, gear, skill trees, and quick hacks.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {chars.map((character) => (
          <div key={character._id} className="rounded border border-cyan-700/50 bg-slate-950/70 p-3 hover:border-cyan-300">
            <h3 className="font-semibold">{character.name}</h3>
            <p className="text-sm">{character.className} • Lv {character.level}</p>
            <p className="text-xs text-cyan-300">
              Essence {character.essenceUsed.toFixed(1)}/{character.essenceMax}
            </p>
            <div className="mt-2 flex gap-2">
              <Link
                to="/character"
                className="rounded border border-cyan-600 px-2 py-1 text-xs"
                onClick={() => dispatch(selectCharacterById(character._id))}
              >
                Load
              </Link>
              <button className="rounded border border-red-400 px-2 py-1 text-xs" onClick={() => dispatch(deleteCharacter(character._id))}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded border border-cyan-500/40 bg-black/50 p-4">
        <h3 className="font-semibold">Character Comparison Tool</h3>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <select className="rounded bg-slate-900 p-2" value={compareIds.firstId} onChange={(e) => setCompareIds({ ...compareIds, firstId: e.target.value })}>
            <option value="">First character</option>
            {chars.map((character) => (
              <option key={character._id} value={character._id}>
                {character.name}
              </option>
            ))}
          </select>
          <select className="rounded bg-slate-900 p-2" value={compareIds.secondId} onChange={(e) => setCompareIds({ ...compareIds, secondId: e.target.value })}>
            <option value="">Second character</option>
            {chars.map((character) => (
              <option key={character._id} value={character._id}>
                {character.name}
              </option>
            ))}
          </select>
          <button
            className="rounded bg-cyan-500 px-3 py-2 font-semibold text-black disabled:opacity-50"
            disabled={!compareIds.firstId || !compareIds.secondId}
            onClick={() => dispatch(compareCharacters(compareIds))}
          >
            Compare
          </button>
        </div>
        {comparison && (
          <div className="mt-3 rounded bg-slate-950/70 p-3 text-sm">
            <p>
              {comparison.first.name} vs {comparison.second.name}
            </p>
            <p>Level diff: {comparison.levelDiff}</p>
            <p>Essence diff: {comparison.essenceDiff.toFixed(1)}</p>
          </div>
        )}
      </div>
    </section>
  )
}
