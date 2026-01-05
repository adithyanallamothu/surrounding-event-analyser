"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const touristPlaces = [
  {
    id: "1",
    name: "Statue of Liberty",
    city: "New York",
    description: "Iconic symbol of freedom and one of the most visited attractions in the US",
    image: "/placeholder.svg?key=cw4tf",
  },
  {
    id: "2",
    name: "Golden Gate Bridge",
    city: "San Francisco",
    description: "Iconic suspension bridge connecting San Francisco to Marin County",
    image: "/placeholder.svg?key=if3da",
  },
  {
    id: "3",
    name: "Hollywood Sign",
    city: "Los Angeles",
    description: "Famous landmark overlooking the Hollywood district of Los Angeles",
    image: "/placeholder.svg?key=2rcly",
  },
  {
    id: "4",
    name: "Space Needle",
    city: "Seattle",
    description: "Observation tower offering panoramic views of Seattle and surrounding mountains",
    image: "/placeholder.svg?key=nrp4m",
  },
  {
    id: "5",
    name: "Disney World",
    city: "Orlando",
    description: "World-renowned theme park resort with attractions for all ages",
    image: "/placeholder.svg?key=sdme1",
  },
  {
    id: "6",
    name: "Niagara Falls",
    city: "New York",
    description: "Breathtaking natural waterfall and major tourist attraction",
    image: "/placeholder.svg?key=e9kck",
  },
]

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCustomerCare, setShowCustomerCare] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("eventUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Header with enhanced styling */}
        <nav className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
            <div
              className="cursor-pointer hover:opacity-80 transition-opacity group"
              onClick={() => router.push("/evely")}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:animate-pulse">
                EVELY
              </h1>
              <p className="text-xs text-muted-foreground">Your Event Companion</p>
            </div>
            <div className="flex gap-4 items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomerCare(!showCustomerCare)}
                className="hover:bg-primary/10"
              >
                💬 Help & Support
              </Button>
              <span className="text-sm text-muted-foreground hidden md:inline">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("eventUser")
                  setUser(null)
                }}
                className="bg-transparent hover:bg-destructive/10 hover:text-destructive border-destructive/20"
              >
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              Welcome to EVELY
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover incredible events, create unforgettable experiences, and connect with communities
            </p>
          </div>

          {/* Main Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card
              className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-primary/20 bg-gradient-to-br from-card to-card/80 group"
              onClick={() => router.push("/browse-events")}
            >
              <CardHeader>
                <div className="text-4xl mb-2 group-hover:animate-float inline-block">🎭</div>
                <CardTitle className="text-primary">Browse Events</CardTitle>
                <CardDescription>Discover amazing events</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Find events near you or matching your interests</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-secondary/20 bg-gradient-to-br from-card to-card/80 group"
              onClick={() => router.push("/create-event")}
            >
              <CardHeader>
                <div className="text-4xl mb-2 group-hover:animate-float inline-block">✨</div>
                <CardTitle className="text-secondary">Host Event</CardTitle>
                <CardDescription>Create your own event</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Share your vision with the world</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-accent/20 bg-gradient-to-br from-card to-card/80 group"
              onClick={() => router.push("/manage-tourist-places")}
            >
              <CardHeader>
                <div className="text-4xl mb-2 group-hover:animate-float inline-block">🗺️</div>
                <CardTitle className="text-accent">Share Destinations</CardTitle>
                <CardDescription>Add tourist places</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Help others discover amazing places</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-primary/20 bg-gradient-to-br from-card to-card/80 group"
              onClick={() => router.push("/my-bookings")}
            >
              <CardHeader>
                <div className="text-4xl mb-2 group-hover:animate-float inline-block">🎟️</div>
                <CardTitle className="text-primary">My Bookings</CardTitle>
                <CardDescription>Your tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Check your upcoming events</p>
              </CardContent>
            </Card>

            {user.role === "organizer" && (
              <>
                <Card
                  className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-secondary/20 bg-gradient-to-br from-card to-card/80 group"
                  onClick={() => router.push("/organizer-dashboard")}
                >
                  <CardHeader>
                    <div className="text-4xl mb-2 group-hover:animate-float inline-block">📊</div>
                    <CardTitle className="text-secondary">My Events</CardTitle>
                    <CardDescription>Manage events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Create and manage your events</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-accent/20 bg-gradient-to-br from-card to-card/80 group"
                  onClick={() => router.push("/analytics")}
                >
                  <CardHeader>
                    <div className="text-4xl mb-2 group-hover:animate-float inline-block">📈</div>
                    <CardTitle className="text-accent">Analytics</CardTitle>
                    <CardDescription>Event insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">View performance & predictions</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Tourist Places Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Popular Tourist Destinations</h2>
                <p className="text-muted-foreground mt-1">Explore amazing places and events worldwide</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {touristPlaces.map((place) => (
                <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={place.image || "/placeholder.svg"}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{place.name}</CardTitle>
                    <CardDescription className="font-medium">{place.city}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{place.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Customer Care Section */}
          {showCustomerCare && (
            <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-border">
              <div className="max-w-4xl">
                <h3 className="text-3xl font-bold mb-6 text-foreground">Customer Care & Support</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-card/50 backdrop-blur rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold text-primary mb-2 text-lg">📞 Phone Support</h4>
                    <p className="text-muted-foreground mb-2">Available 24/7</p>
                    <p className="text-xl font-bold text-foreground">+1 (800) EVELY-99</p>
                    <p className="text-xs text-muted-foreground mt-2">Toll-free from anywhere</p>
                  </div>
                  <div className="bg-card/50 backdrop-blur rounded-lg p-6 border border-border hover:border-secondary/50 transition-colors">
                    <h4 className="font-semibold text-secondary mb-2 text-lg">✉️ Email Support</h4>
                    <p className="text-muted-foreground mb-2">Response within 2 hours</p>
                    <p className="text-xl font-bold text-foreground break-all">support@evely.com</p>
                    <p className="text-xs text-muted-foreground mt-2">Detailed responses guaranteed</p>
                  </div>
                  <div className="bg-card/50 backdrop-blur rounded-lg p-6 border border-border hover:border-accent/50 transition-colors">
                    <h4 className="font-semibold text-accent mb-2 text-lg">💬 Live Chat</h4>
                    <p className="text-muted-foreground mb-3">Instant assistance</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-accent/10 border-accent/30 hover:bg-accent/20"
                    >
                      Start Chat Now
                    </Button>
                  </div>
                  <div className="bg-card/50 backdrop-blur rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold text-primary mb-2 text-lg">❓ FAQ & Help Center</h4>
                    <p className="text-muted-foreground mb-3">Common questions answered</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-primary/10 border-primary/30 hover:bg-primary/20"
                    >
                      Visit Help Center
                    </Button>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Have a suggestion? Email us at <span className="font-semibold">feedback@evely.com</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 animate-fade-in-scale">
            EVELY
          </h1>
          <p className="text-muted-foreground text-lg font-light">Your Gateway to Unforgettable Experiences</p>
          <p className="text-sm text-muted-foreground mt-2">Discover, Create & Celebrate Events Like Never Before</p>
        </div>
        <div className="flex gap-3 flex-col">
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-white"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:shadow-lg hover:shadow-secondary/50 text-white"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </Button>
          <Button className="w-full bg-transparent" variant="outline" onClick={() => router.push("/admin-login")}>
            Admin Access
          </Button>
        </div>
      </div>
    </div>
  )
}
