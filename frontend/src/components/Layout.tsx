import { NavLink, Outlet } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { logout } from '../features/authSlice'

const links = [
  ['/', 'Dashboard'],
  ['/create', 'Create Character'],
  ['/character', 'Character Sheet'],
  ['/cyberware', 'Cyberware'],
  ['/weapons', 'Weapons'],
  ['/skills', 'Skills'],
  ['/quickhacks', 'Quick Hacks'],
]

export default function Layout() {
  const dispatch = useAppDispatch()

  return (
    <div className="min-h-screen text-cyan-100">
      <header className="border-b border-cyan-500/30 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 p-3">
          <h1 className="text-lg font-bold tracking-wide text-cyan-300">Cyberpunk D&D Beyond</h1>
          <button onClick={() => dispatch(logout())} className="rounded border border-cyan-400 px-3 py-1 text-sm hover:bg-cyan-900/50">
            Logout
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 px-3 pb-3">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded px-2 py-1 text-sm ${isActive ? 'bg-cyan-500 text-black' : 'border border-cyan-600/50 hover:bg-cyan-800/40'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl p-4">
        <Outlet />
      </main>
    </div>
  )
}
