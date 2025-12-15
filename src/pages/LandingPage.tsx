import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth"
import { MapPin, Send, Eye, Bell } from "lucide-react"

export function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background px-4 py-20">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Report Municipal Problems
            <br />
            <span className="text-primary">Make Your City Better</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            CleanCity makes it easy to report potholes, broken street lights, trash, and other
            community problems. Track your reports and see real progress.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Submit a Report</CardTitle>
                <CardDescription>
                  Take a photo, select the problem type, and pin the location on the map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our easy-to-use form guides you through reporting any municipal problem in just a
                  few clicks.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Track Progress</CardTitle>
                <CardDescription>Watch as your report moves through the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See real-time status updates from New to In Progress to Resolved. No more
                  wondering if anyone heard you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Get Notified</CardTitle>
                <CardDescription>Receive updates when your report status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay informed with notifications when municipal workers update your report or when
                  the problem is resolved.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Status Legend */}
      <section className="bg-muted/40 px-4 py-12">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold">Report Status Guide</h2>
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
      <section className="px-4 py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Make a Difference?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join thousands of citizens helping to improve our community. Your voice matters.
          </p>
          <Button size="lg" asChild>
            <Link to={user ? "/submit" : "/login"}>
              {user ? "Submit Your First Report" : "Get Started"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>CleanCity - Municipal Problem Reporting Platform</p>
        </div>
      </footer>
    </div>
  )
}
