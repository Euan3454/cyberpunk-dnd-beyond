import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api/client'
import type { Character } from '../types'

type CharactersState = {
  items: Character[]
  selected: Character | null
  loading: boolean
  comparison:
    | {
        first: Character
        second: Character
        statDiff: Record<string, number>
        essenceDiff: number
        levelDiff: number
      }
    | null
}

const initialState: CharactersState = { items: [], selected: null, loading: false, comparison: null }

export const loadCharacters = createAsyncThunk('characters/load', async () => {
  const { data } = await api.get('/characters')
  return data
})

export const createCharacter = createAsyncThunk('characters/create', async (payload: Partial<Character>) => {
  const { data } = await api.post('/characters', payload)
  return data
})

export const selectCharacterById = createAsyncThunk('characters/select', async (id: string) => {
  const { data } = await api.get(`/characters/${id}`)
  return data
})

export const deleteCharacter = createAsyncThunk('characters/delete', async (id: string) => {
  await api.delete(`/characters/${id}`)
  return id
})

export const compareCharacters = createAsyncThunk(
  'characters/compare',
  async ({ firstId, secondId }: { firstId: string; secondId: string }) => {
    const { data } = await api.get(`/characters/compare/${firstId}/${secondId}`)
    return data
  },
)

export const equipCyberware = createAsyncThunk(
  'characters/equipCyberware',
  async ({ characterId, cyberwareId }: { characterId: string; cyberwareId: string }) => {
    const { data } = await api.post(`/characters/${characterId}/cyberware/${cyberwareId}/equip`)
    return data
  },
)

export const equipWeapon = createAsyncThunk(
  'characters/equipWeapon',
  async ({ characterId, weaponId }: { characterId: string; weaponId: string }) => {
    const { data } = await api.post(`/characters/${characterId}/weapons/${weaponId}/equip`)
    return data
  },
)

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCharacters.pending, (state) => {
        state.loading = true
      })
      .addCase(loadCharacters.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        if (!state.selected && action.payload.length > 0) state.selected = action.payload[0]
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.selected = action.payload
      })
      .addCase(selectCharacterById.fulfilled, (state, action) => {
        state.selected = action.payload
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item))
      })
      .addCase(deleteCharacter.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload)
        if (state.selected?._id === action.payload) state.selected = state.items[0] || null
      })
      .addCase(compareCharacters.fulfilled, (state, action) => {
        state.comparison = action.payload
      })
      .addCase(equipCyberware.fulfilled, (state, action) => {
        state.selected = action.payload
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item))
      })
      .addCase(equipWeapon.fulfilled, (state, action) => {
        state.selected = action.payload
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item))
      })
  },
})

export default charactersSlice.reducer
