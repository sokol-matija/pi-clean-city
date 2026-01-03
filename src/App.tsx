import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider, ProtectedRoute } from "@/features/auth"
import { Layout } from "@/components/layout/Layout"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { MapPage } from "@/pages/MapPage"
import { SubmitReportPage } from "@/pages/SubmitReportPage"
import { ReportDetailsPage } from "@/pages/ReportDetailsPage"
import { AdminTicketsPage } from "./pages/AdminTicketsPage"
import { TicketServiceProvider } from "./features/admin/context/TicketServiceContext"
import PostFeedPage from "./pages/community/PostFeedPage"
import { NotificationGuidePage } from "./features/notifications/pages/NotificationGuidePage"

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
              <Route
                path="/admin/tickets"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <TicketServiceProvider>
                      <AdminTicketsPage />
                    </TicketServiceProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <PostFeedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications/guide"
                element={
                  <ProtectedRoute>
                    <NotificationGuidePage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
