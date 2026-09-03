import { useMemo } from 'react'
import { useAppSelector } from '../app/hooks'

export default function SkillsPage() {
  const skills = useAppSelector((state) => state.catalog.skills)

  const grouped = useMemo(() => {
    return skills.reduce<Record<string, typeof skills>>((acc, skill) => {
      acc[skill.tree] = acc[skill.tree] || []
      acc[skill.tree].push(skill)
      return acc
    }, {})
  }, [skills])

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold">Skill Tree Visualization</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {Object.entries(grouped).map(([tree, list]) => (
          <div key={tree} className="rounded border border-cyan-600/60 bg-black/50 p-3">
            <h3 className="mb-2 font-semibold text-cyan-300">{tree}</h3>
            <div className="space-y-2 text-sm">
              {list
                .slice()
                .sort((a, b) => a.levelRequirement - b.levelRequirement)
                .map((skill) => (
                  <div key={skill._id} className="rounded bg-slate-900 p-2">
                    <p className="font-medium">{skill.name}</p>
                    <p>Level {skill.levelRequirement} • Mastery {skill.masteryLevel}</p>
                    <p className="text-cyan-200">{skill.perk}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
