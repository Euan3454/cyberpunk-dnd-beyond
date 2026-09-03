import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, setAuthToken } from '../api/client'

const tokenFromStorage = localStorage.getItem('token') || ''
if (tokenFromStorage) setAuthToken(tokenFromStorage)

type AuthState = {
  token: string
  user: { id: string; username: string; email: string } | null
  loading: boolean
  error: string
}

const initialState: AuthState = { token: tokenFromStorage, user: null, loading: false, error: '' }

export const register = createAsyncThunk('auth/register', async (payload: { username: string; email: string; password: string }) => {
  const { data } = await api.post('/auth/register', payload)
  return data
})

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const { data } = await api.post('/auth/login', payload)
  return data
})

export const loadProfile = createAsyncThunk('auth/loadProfile', async () => {
  const { data } = await api.get('/users/me')
  return data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
      setAuthToken(undefined)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem('token', action.payload.token)
        setAuthToken(action.payload.token)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Registration failed'
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem('token', action.payload.token)
        setAuthToken(action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
