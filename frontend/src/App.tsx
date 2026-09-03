import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './app/hooks'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { loadProfile } from './features/authSlice'
import { loadCatalog } from './features/catalogSlice'
import { loadCharacters } from './features/charactersSlice'
import AuthPage from './pages/AuthPage'
import CharacterSheetPage from './pages/CharacterSheetPage'
import CreateCharacterPage from './pages/CreateCharacterPage'
import CyberwarePage from './pages/CyberwarePage'
import DashboardPage from './pages/DashboardPage'
import QuickHacksPage from './pages/QuickHacksPage'
import SkillsPage from './pages/SkillsPage'
import WeaponsPage from './pages/WeaponsPage'

function AppContent() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(loadProfile())
      dispatch(loadCatalog())
      dispatch(loadCharacters())
    }
  }, [dispatch, token])

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/create" element={<CreateCharacterPage />} />
        <Route path="/character" element={<CharacterSheetPage />} />
        <Route path="/cyberware" element={<CyberwarePage />} />
        <Route path="/weapons" element={<WeaponsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/quickhacks" element={<QuickHacksPage />} />
      </Route>
      <Route path="*" element={<Navigate to={token ? '/' : '/auth'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
