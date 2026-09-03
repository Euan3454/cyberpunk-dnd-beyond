import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import catalogReducer from '../features/catalogSlice'
import charactersReducer from '../features/charactersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    characters: charactersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
