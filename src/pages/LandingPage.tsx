import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth'
import { MapPin, Send, Eye, Bell } from 'lucide-react'

export function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Report Municipal Problems
            <br />
            <span className="text-primary">Make Your City Better</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            CleanCity makes it easy to report potholes, broken street lights, trash, and other
            community problems. Track your reports and see real progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/map">
                <MapPin className="mr-2 h-5 w-5" />
                View Map
              </Link>
            </Button>
            {user ? (
              <Button size="lg" variant="outline" asChild>
                <Link to="/submit">
                  <Send className="mr-2 h-5 w-5" />
                  Submit Report
                </Link>
              </Button>
            ) : (
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In to Report</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Submit a Report</CardTitle>
                <CardDescription>
                  Take a photo, select the problem type, and pin the location on the map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our easy-to-use form guides you through reporting any municipal problem
                  in just a few clicks.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Track Progress</CardTitle>
                <CardDescription>
                  Watch as your report moves through the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See real-time status updates from New to In Progress to Resolved.
                  No more wondering if anyone heard you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Get Notified</CardTitle>
                <CardDescription>
                  Receive updates when your report status changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay informed with notifications when municipal workers update
                  your report or when the problem is resolved.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Status Legend */}
      <section className="py-12 px-4 bg-muted/40">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Report Status Guide</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-status-new"></div>
              <span className="text-sm font-medium">New</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-status-progress"></div>
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-status-resolved"></div>
              <span className="text-sm font-medium">Resolved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-status-closed"></div>
              <span className="text-sm font-medium">Closed</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of citizens helping to improve our community.
            Your voice matters.
          </p>
          <Button size="lg" asChild>
            <Link to={user ? '/submit' : '/login'}>
              {user ? 'Submit Your First Report' : 'Get Started'}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>CleanCity - Municipal Problem Reporting Platform</p>
          <p className="mt-2">Software Engineering Project - Algebra University</p>
        </div>
      </footer>
    </div>
  )
}
