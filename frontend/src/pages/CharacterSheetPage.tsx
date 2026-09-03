import { useAppSelector } from '../app/hooks'

export default function CharacterSheetPage() {
  const character = useAppSelector((state) => state.characters.selected)
  if (!character) return <p>No character selected.</p>

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded border border-cyan-500/40 bg-black/50 p-4">
        {character.appearance?.avatarUrl ? <img src={character.appearance.avatarUrl} className="h-20 w-20 rounded object-cover" alt={character.name} /> : <div className="h-20 w-20 rounded bg-slate-800" />}
        <div>
          <h2 className="text-xl font-bold">{character.name}</h2>
          <p>
            {character.className} • Level {character.level}
          </p>
          <p className="text-sm text-cyan-300">
            Essence {character.essenceUsed.toFixed(1)} / {character.essenceMax}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(character.stats).map(([key, value]) => (
          <div key={key} className="rounded border border-cyan-700/40 bg-slate-950/70 p-3 text-center">
            <p className="text-xs uppercase text-cyan-300">{key}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded border border-cyan-700/40 bg-slate-950/70 p-3">
          <h3 className="mb-2 font-semibold">Equipped Cyberware</h3>
          <ul className="space-y-1 text-sm">
            {character.equippedCyberware.map((item) => (
              <li key={item._id} className="rounded bg-slate-900 p-2">
                {item.name} • {item.category} • {item.essenceCost} essence
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded border border-cyan-700/40 bg-slate-950/70 p-3">
          <h3 className="mb-2 font-semibold">Equipped Weapons</h3>
          <ul className="space-y-1 text-sm">
            {character.equippedWeapons.map((item) => (
              <li key={item._id} className="rounded bg-slate-900 p-2">
                {item.name} • {item.damage} • {item.category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
