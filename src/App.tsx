import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, ProtectedRoute } from '@/features/auth'
import { Layout } from '@/components/layout/Layout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { MapPage } from '@/pages/MapPage'
import { SubmitReportPage } from '@/pages/SubmitReportPage'
import { ReportDetailsPage } from '@/pages/ReportDetailsPage'
import PostFeedPage from './pages/community/PostFeedPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/report/:id" element={<ReportDetailsPage />} />
              <Route
                path="/submit"
                element={
                  <ProtectedRoute>
                    <SubmitReportPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/community" element={ <ProtectedRoute><PostFeedPage /></ProtectedRoute> } />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
