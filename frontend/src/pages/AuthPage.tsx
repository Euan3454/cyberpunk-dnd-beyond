import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { login, register } from '../features/authSlice'

export default function AuthPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector((state) => state.auth.loading)
  const error = useAppSelector((state) => state.auth.error)

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [resetState, setResetState] = useState({ email: '', token: '', newPassword: '', status: '' })

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const action = mode === 'login' ? login({ email: form.email, password: form.password }) : register(form)
    const result = await dispatch(action)
    if (!result.meta.requestStatus || result.meta.requestStatus === 'fulfilled') navigate('/')
  }

  return (
    <div className="mx-auto mt-12 max-w-md rounded-lg border border-cyan-500/40 bg-black/50 p-6">
      <h2 className="mb-4 text-xl font-bold">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        {mode === 'register' && (
          <input className="w-full rounded bg-slate-900 p-2" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        )}
        <input className="w-full rounded bg-slate-900 p-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded bg-slate-900 p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full rounded bg-cyan-500 px-4 py-2 font-semibold text-black" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>
        {error && <p className="text-red-300">{error}</p>}
      </form>
      <button className="mt-4 text-sm text-cyan-300 underline" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
      <div className="mt-6 border-t border-cyan-800/60 pt-4 text-sm">
        <p className="mb-2 font-semibold">Password reset</p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              className="w-full rounded bg-slate-900 p-2"
              placeholder="Email"
              value={resetState.email}
              onChange={(e) => setResetState({ ...resetState, email: e.target.value })}
            />
            <button
              className="rounded border border-cyan-500 px-2 py-1"
              onClick={async () => {
                const { data } = await api.post('/auth/password-reset/request', { email: resetState.email })
                setResetState((prev) => ({ ...prev, token: data.resetToken || '', status: data.message }))
              }}
            >
              Request
            </button>
          </div>
          <input
            className="w-full rounded bg-slate-900 p-2"
            placeholder="Reset token"
            value={resetState.token}
            onChange={(e) => setResetState({ ...resetState, token: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              className="w-full rounded bg-slate-900 p-2"
              type="password"
              placeholder="New password"
              value={resetState.newPassword}
              onChange={(e) => setResetState({ ...resetState, newPassword: e.target.value })}
            />
            <button
              className="rounded border border-cyan-500 px-2 py-1"
              onClick={async () => {
                const { data } = await api.post('/auth/password-reset/confirm', {
                  token: resetState.token,
                  newPassword: resetState.newPassword,
                })
                setResetState((prev) => ({ ...prev, status: data.message }))
              }}
            >
              Confirm
            </button>
          </div>
          {resetState.status ? <p className="text-cyan-300">{resetState.status}</p> : null}
        </div>
      </div>
    </div>
  )
}
