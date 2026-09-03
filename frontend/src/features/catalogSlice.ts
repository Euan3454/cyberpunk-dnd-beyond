import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api/client'
import type { CharacterClass, Cyberware, QuickHack, Skill, Weapon } from '../types'

type CatalogState = {
  cyberware: Cyberware[]
  weapons: Weapon[]
  skills: Skill[]
  quickhacks: QuickHack[]
  classes: CharacterClass[]
  loading: boolean
}

const initialState: CatalogState = {
  cyberware: [],
  weapons: [],
  skills: [],
  quickhacks: [],
  classes: [],
  loading: false,
}

export const loadCatalog = createAsyncThunk('catalog/load', async () => {
  const [cyberware, weapons, skills, quickhacks, classes] = await Promise.all([
    api.get('/catalog/cyberware'),
    api.get('/catalog/weapons'),
    api.get('/catalog/skills'),
    api.get('/catalog/quickhacks'),
    api.get('/catalog/classes'),
  ])
  return {
    cyberware: cyberware.data,
    weapons: weapons.data,
    skills: skills.data,
    quickhacks: quickhacks.data,
    classes: classes.data,
  }
})

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.loading = true
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        state.loading = false
        state.cyberware = action.payload.cyberware
        state.weapons = action.payload.weapons
        state.skills = action.payload.skills
        state.quickhacks = action.payload.quickhacks
        state.classes = action.payload.classes
      })
      .addCase(loadCatalog.rejected, (state) => {
        state.loading = false
      })
  },
})

export default catalogSlice.reducer
