import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { equipCyberware } from '../features/charactersSlice'

function DraggableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes} className="w-full rounded border border-cyan-700/60 bg-slate-900 p-2 text-left text-sm">
      {label}
    </button>
  )
}

export default function CyberwarePage() {
  const dispatch = useAppDispatch()
  const character = useAppSelector((state) => state.characters.selected)
  const allCyberware = useAppSelector((state) => state.catalog.cyberware)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  const { setNodeRef, isOver } = useDroppable({ id: 'equip-zone' })

  const items = useMemo(
    () =>
      allCyberware.filter(
        (item) =>
          item.name.toLowerCase().includes(q.toLowerCase()) &&
          (category ? item.category === category : true),
      ),
    [allCyberware, q, category],
  )

  const onDragEnd = (event: DragEndEvent) => {
    if (!character) return
    if (event.over?.id === 'equip-zone') {
      dispatch(equipCyberware({ characterId: character._id, cyberwareId: String(event.active.id) }))
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded border border-cyan-500/40 bg-black/50 p-3">
        <h2 className="mb-2 text-lg font-bold">Cyberware Browser</h2>
        <div className="mb-3 flex gap-2">
          <input className="w-full rounded bg-slate-900 p-2" placeholder="Search cyberware" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="rounded bg-slate-900 p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {['Arms', 'Legs', 'Eyes', 'Nervous System', 'Skeletal', 'Skin', 'Organs'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <DndContext onDragEnd={onDragEnd}>
          <div className="max-h-[60vh] space-y-2 overflow-auto pr-1">
            {items.map((item) => (
              <DraggableItem key={item._id} id={item._id} label={`${item.name} • ${item.category} • ${item.essenceCost}`} />
            ))}
          </div>

          <div ref={setNodeRef} className={`mt-4 rounded border-2 border-dashed p-3 ${isOver ? 'border-cyan-300 bg-cyan-950/30' : 'border-cyan-700/60'}`}>
            Drag cyberware here to equip on selected character
          </div>
        </DndContext>
      </div>

      <div className="rounded border border-cyan-500/40 bg-black/50 p-3">
        <h3 className="font-semibold">Equipped on {character?.name || 'None'}</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {character?.equippedCyberware.map((item) => (
            <li key={item._id} className="rounded bg-slate-900 p-2">
              {item.name} • {item.tier}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
