/**
 * Notification Guide Page
 *
 * Shows users their NTFY topic and provides setup instructions
 */

import { useState } from "react"
import { Copy, Check, Bell, Smartphone } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getUserTopic } from "@/features/notifications/utils/topicHelpers"

export function NotificationGuidePage() {
  const { user, profile } = useAuth()
  const [copied, setCopied] = useState(false)

  // Generate user topic from profile username (URL-safe)
  const topic = profile?.username ? getUserTopic(profile.username) : ""

  const copyTopic = async () => {
    if (topic) {
      await navigator.clipboard.writeText(topic)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please sign in to view your NTFY topic.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Setup Notifications</h1>
        <p className="text-gray-600">
          Receive real-time notifications about your reports via the NTFY app
        </p>
      </div>

      {/* Your Topic Card */}
      <Card className="mb-6 border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Your NTFY Topic
          </CardTitle>
          <CardDescription>This is your unique topic for receiving notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <code className="flex-1 font-mono text-lg font-semibold text-primary">{topic}</code>
            <Button onClick={copyTopic} variant="outline" size="sm" className="gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Mobile app</Badge>
            <Badge variant="secondary">Web browser</Badge>
            <Badge variant="secondary">Free</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Step 1: Download NTFY app
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">For Android:</h4>
              <a
                href="https://play.google.com/store/apps/details?id=io.heckel.ntfy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download from Google Play Store →
              </a>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">For iOS:</h4>
              <a
                href="https://apps.apple.com/us/app/ntfy/id1625396347"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download from App Store →
              </a>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">For web browser:</h4>
              <a
                href="https://ntfy.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open ntfy.sh in browser →
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Subscribe to your topic</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-inside list-decimal space-y-3">
              <li>Open the NTFY app or website</li>
              <li>
                Click on <strong>"Subscribe to topic"</strong> or the <strong>"+"</strong> button
              </li>
              <li>
                Paste your topic:{" "}
                <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">{topic}</code>
              </li>
              <li>
                Click <strong>"Subscribe"</strong>
              </li>
              <li>Done!</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Enable notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">To receive notifications even when the app is not open:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>In your phone settings, enable notifications for NTFY</li>
              <li>Enable sound and vibration for notifications</li>
              <li>In the NTFY app, enable Background/Push notifications</li>
            </ul>
          </CardContent>
        </Card>

        {/* What notifications you'll receive */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>What notifications will you receive?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div>
                  <h4 className="font-semibold">New comments</h4>
                  <p className="text-sm text-gray-600">When someone comments on your report</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <h4 className="font-semibold">Status changes</h4>
                  <p className="text-sm text-gray-600">
                    When a worker changes the status of your report
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <h4 className="font-semibold">Resolved reports</h4>
                  <p className="text-sm text-gray-600">When your report is marked as resolved</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <h4 className="font-semibold">Mentions</h4>
                  <p className="text-sm text-gray-600">When someone mentions you in a comment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test notification */}
        <Card>
          <CardHeader>
            <CardTitle>Test notifications</CardTitle>
            <CardDescription>
              Send a test notification to verify everything is set up correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={async () => {
                try {
                  await fetch("https://ntfy.sh", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      topic: topic,
                      title: "Test notification",
                      message: "You've successfully set up NTFY notifications for Pi Clean City!",
                      priority: 3,
                      tags: ["white_check_mark"],
                    }),
                  })
                  alert("Test notification sent! Check your NTFY app.")
                } catch {
                  alert("Error sending test notification.")
                }
              }}
              className="w-full"
            >
              Send test notification
            </Button>
          </CardContent>
        </Card>

        {/* Help section */}
        <Card>
          <CardHeader>
            <CardTitle>Need help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              Read the{" "}
              <a
                href="https://docs.ntfy.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                official NTFY documentation
              </a>
            </p>
            <p>
              NTFY is completely free and open-source! Your topic is public, but only you and our
              application know about it.
            </p>
            <p className="text-sm text-gray-500">
              Note: Notifications are sent via the NTFY.sh service and do not use the Pi Network
              API.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
