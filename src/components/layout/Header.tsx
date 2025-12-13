import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth'
import { MapPin, Menu, LogOut, User } from 'lucide-react'

export function Header() {
  const { user, profile, signOut, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">CleanCity</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/map"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Map
          </Link>
          {user && (
            <Link
              to="/submit"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Submit Report
            </Link>
          )}
          {profile?.role === 'worker' && (
            <Link
              to="/worker"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Worker Dashboard
            </Link>
          )}
          {profile?.role === 'admin' && (
            <Link
              to="/admin/tickets"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tickets
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>{profile?.username || user.email?.split('@')[0]}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted capitalize">
                  {profile?.role || 'citizen'}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
