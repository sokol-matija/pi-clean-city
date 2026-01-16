import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from ".."
import type { Profile } from "@/types/database.types"

interface ProtectedRouteProps {
  readonly children: React.ReactNode
  readonly allowedRoles?: Profile["role"][]
}

export function ProtectedRoute({ children, allowedRoles }: Readonly<ProtectedRouteProps>) {
  const { user, profile, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
