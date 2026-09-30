import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { ToastProvider } from './context/ToastContext'
import { AppShell } from './components/layout/AppShell'
import { RequireAdmin, RequireAuth, RequireClass } from './components/routing/RequireAuth'
import { FullScreenLoader } from './components/ui/FullScreenLoader'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CodexPage = lazy(() => import('./pages/CodexPage'))
const BossRaidPage = lazy(() => import('./pages/BossRaidPage'))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={<FullScreenLoader />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<RequireAuth />}>
                  <Route element={<RequireClass />}>
                    <Route element={<AppShell />}>
                      <Route index element={<DashboardPage />} />
                      <Route path="onboarding" element={<OnboardingPage />} />
                      <Route path="modulos/:moduleId/codice" element={<CodexPage />} />
                      <Route path="modulos/:moduleId/raid" element={<BossRaidPage />} />
                      <Route path="modulos/:moduleId/entrenar" element={<BossRaidPage mode="training" />} />
                      <Route path="leaderboard" element={<LeaderboardPage />} />
                      <Route path="perfil" element={<ProfilePage />} />

                      {/* Ruta oculta: no aparece en la navegación */}
                      <Route element={<RequireAdmin />}>
                        <Route path="admin" element={<AdminPage />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </ProfileProvider>
    </AuthProvider>
  )
}
