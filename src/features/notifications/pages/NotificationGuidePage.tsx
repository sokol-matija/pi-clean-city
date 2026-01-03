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

export function NotificationGuidePage() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  // Generate user topic
  const topic = user?.username ? `pi-clean-city-${user.username}` : ""

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
            <CardTitle>Prijava potrebna</CardTitle>
            <CardDescription>Molimo prijavite se da biste vidjeli svoj NTFY topic.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Postavi obavijesti 🔔</h1>
        <p className="text-gray-600">
          Primaj obavijesti o svojim prijavama u realnom vremenu putem NTFY aplikacije
        </p>
      </div>

      {/* Your Topic Card */}
      <Card className="mb-6 border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Tvoj NTFY Topic
          </CardTitle>
          <CardDescription>Ovo je tvoj jedinstveni topic za primanje obavijesti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <code className="flex-1 font-mono text-lg font-semibold text-primary">{topic}</code>
            <Button onClick={copyTopic} variant="outline" size="sm" className="gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Kopirano!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Kopiraj
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">📱 Mobilna aplikacija</Badge>
            <Badge variant="secondary">💻 Web pregledač</Badge>
            <Badge variant="secondary">🔔 Besplatno</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Korak 1: Preuzmi NTFY aplikaciju
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">📱 Za Android:</h4>
              <a
                href="https://play.google.com/store/apps/details?id=io.heckel.ntfy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Preuzmi s Google Play Store →
              </a>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">🍎 Za iOS:</h4>
              <a
                href="https://apps.apple.com/us/app/ntfy/id1625396347"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Preuzmi s App Store →
              </a>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">💻 Za web pregledač:</h4>
              <a
                href="https://ntfy.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Otvori ntfy.sh u pregledniku →
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Korak 2: Pretplati se na svoj topic</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-inside list-decimal space-y-3">
              <li>Otvori NTFY aplikaciju ili web stranicu</li>
              <li>
                Klikni na <strong>"Subscribe to topic"</strong> ili <strong>"+"</strong> gumb
              </li>
              <li>
                Zalijepi svoj topic:{" "}
                <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">{topic}</code>
              </li>
              <li>
                Klikni <strong>"Subscribe"</strong>
              </li>
              <li>Gotovo! 🎉</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Korak 3: Omogući obavijesti</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Kako bi primao/la obavijesti i kada aplikacija nije otvorena:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>U postavkama telefona omogući obavijesti za NTFY</li>
              <li>Omogući zvuk i vibraciju za obavijesti</li>
              <li>U NTFY aplikaciji omogući Background/Push notifikacije</li>
            </ul>
          </CardContent>
        </Card>

        {/* What notifications you'll receive */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Koje obavijesti ćeš primati?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="font-semibold">Novi komentari</h4>
                  <p className="text-sm text-gray-600">Kada netko komentira na tvoju prijavu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold">Promjena statusa</h4>
                  <p className="text-sm text-gray-600">
                    Kada komunalni radnik promijeni status tvoje prijave
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold">Riješena prijava</h4>
                  <p className="text-sm text-gray-600">
                    Kada je tvoja prijava označena kao riješena
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📢</span>
                <div>
                  <h4 className="font-semibold">Spomenut/a si</h4>
                  <p className="text-sm text-gray-600">Kada te netko spomene u komentaru</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test notification */}
        <Card>
          <CardHeader>
            <CardTitle>Testiraj obavijesti</CardTitle>
            <CardDescription>
              Pošalji testnu obavijest kako bi provjerio/la je li sve ispravno postavljeno
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
                      title: "Test obavijest 🎉",
                      message: "Uspješno si postavio/la NTFY obavijesti za Pi Clean City!",
                      priority: 3,
                      tags: ["white_check_mark", "✅"],
                    }),
                  })
                  alert("Testna obavijest poslana! Provjeri svoj NTFY.")
                } catch {
                  alert("Greška pri slanju testne obavijesti.")
                }
              }}
              className="w-full"
            >
              Pošalji testnu obavijest
            </Button>
          </CardContent>
        </Card>

        {/* Help section */}
        <Card>
          <CardHeader>
            <CardTitle>Trebaš pomoć?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              📖 Pročitaj{" "}
              <a
                href="https://docs.ntfy.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                službenu NTFY dokumentaciju
              </a>
            </p>
            <p>
              💡 NTFY je potpuno besplatan i open-source! Tvoj topic je javan, ali samo ti i naša
              aplikacija znamo za njega.
            </p>
            <p className="text-sm text-gray-500">
              Napomena: Obavijesti se šalju putem NTFY.sh servisa i ne koriste Pi Network API.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
