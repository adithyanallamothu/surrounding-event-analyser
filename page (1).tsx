"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/event-types"
import { mockEvents } from "@/lib/mock-events"

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [showCredentialEditor, setShowCredentialEditor] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser")
    if (!adminUser) {
      router.push("/admin-login")
      return
    }

    const adminData = JSON.parse(adminUser)
    setAdmin(adminData)

    const loadEvents = () => {
      const userEvents = JSON.parse(localStorage.getItem("userEvents") || "[]")
      const allEvents = [...mockEvents, ...userEvents]
      setEvents(allEvents)
    }

    loadEvents()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userEvents") {
        loadEvents()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Fetch all users
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    setUsers(allUsers)

    setLoading(false)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    router.push("/admin-login")
  }

  const handleUpdateCredentials = () => {
    if (!newEmail || !newPassword) {
      alert("Please fill in both fields")
      return
    }

    const updatedCredentials = {
      email: newEmail,
      password: newPassword,
    }

    localStorage.setItem("adminCredentials", JSON.stringify(updatedCredentials))
    setSuccessMessage("Credentials updated successfully!")
    setNewEmail("")
    setNewPassword("")
    setShowCredentialEditor(false)

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const userEvents = JSON.parse(localStorage.getItem("userEvents") || "[]")
      const filtered = userEvents.filter((e: Event) => e.id !== eventId)
      localStorage.setItem("userEvents", JSON.stringify(filtered))

      setEvents(events.filter((e) => e.id !== eventId))
      alert("Event deleted successfully")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!admin) {
    return null
  }

  const userCreatedEventsCount = JSON.parse(localStorage.getItem("userEvents") || "[]").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EventHub Admin
            </h1>
            <p className="text-xs text-muted-foreground">Complete platform management</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{admin.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-transparent hover:bg-destructive/10 hover:text-destructive border-destructive/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{events.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {events.filter((e) => e.ticketPrice === 0).length} free,{" "}
                {events.filter((e) => e.ticketPrice > 0).length} paid
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">User Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{userCreatedEventsCount}</div>
              <p className="text-xs text-muted-foreground mt-2">Events added by community</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Registered attendees & organizers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-paid-event/10 to-paid-event/5 border-paid-event/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-paid-event">
                ${events.reduce((sum, e) => sum + e.ticketPrice * (e.venue.capacity - e.ticketsAvailable), 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">From paid events</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">All Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Key metrics and platform statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Button
                    className="bg-gradient-to-r from-accent to-accent/80 hover:shadow-lg text-accent-foreground h-20"
                    onClick={() => router.push("/admin/promotions")}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎉</div>
                      <div className="text-sm">Manage Promotions</div>
                    </div>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-secondary to-secondary/80 hover:shadow-lg text-secondary-foreground h-20"
                    onClick={() => router.push("/manage-tourist-places")}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🗺️</div>
                      <div className="text-sm">Manage Destinations</div>
                    </div>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg text-primary-foreground h-20"
                    onClick={() => router.push("/browse-events")}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">👀</div>
                      <div className="text-sm">View Platform</div>
                    </div>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg text-primary-foreground h-20"
                    onClick={() => router.push("/create-event")}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎫</div>
                      <div className="text-sm">Create New Event</div>
                    </div>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">Event Distribution</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Free Events:</span>
                        <span className="font-medium">{events.filter((e) => e.ticketPrice === 0).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid Events:</span>
                        <span className="font-medium">{events.filter((e) => e.ticketPrice > 0).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User Created Events:</span>
                        <span className="font-medium">{userCreatedEventsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">Platform Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Registered Users:</span>
                        <span className="font-medium">{users.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Bookings:</span>
                        <span className="font-medium">
                          {events.reduce((sum, e) => sum + (e.venue.capacity - e.ticketsAvailable), 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Event Price:</span>
                        <span className="font-medium">
                          $
                          {events.length > 0
                            ? Math.round(events.reduce((sum, e) => sum + e.ticketPrice, 0) / events.length)
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>
                  View and manage all events on the platform (includes user-created events)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Event Name</th>
                        <th className="text-left py-3 px-4 font-semibold">City</th>
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 font-semibold">Price</th>
                        <th className="text-left py-3 px-4 font-semibold">Capacity</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-foreground">{event.title}</td>
                          <td className="py-3 px-4">{event.venue.city}</td>
                          <td className="py-3 px-4">{new Date(event.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            {event.ticketPrice === 0 ? (
                              <Badge className="bg-free-event text-white">FREE</Badge>
                            ) : (
                              <Badge className="bg-paid-event text-white">${event.ticketPrice}</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {event.venue.capacity - event.ticketsAvailable}/{event.venue.capacity}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={event.ticketsAvailable > 0 ? "default" : "secondary"}>
                              {event.ticketsAvailable > 0 ? "Active" : "Full"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 border-destructive/20 bg-transparent"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>All registered attendees and organizers</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold">Email</th>
                          <th className="text-left py-3 px-4 font-semibold">Role</th>
                          <th className="text-left py-3 px-4 font-semibold">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((user, idx) => (
                          <tr key={idx} className="hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium text-foreground">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.role === "organizer" ? "default" : "secondary"}>
                                {user.role === "organizer" ? "Organizer" : "Attendee"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No registered users yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Settings</CardTitle>
                <CardDescription>Manage admin credentials and platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Credentials Section */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Admin Credentials</h3>
                  <p className="text-sm text-muted-foreground mb-4">Update your login credentials for secure access</p>

                  {!showCredentialEditor ? (
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => setShowCredentialEditor(true)}
                    >
                      Edit Credentials
                    </Button>
                  ) : (
                    <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                      <div>
                        <Label htmlFor="newEmail" className="text-sm mb-2 block">
                          New Email Address
                        </Label>
                        <Input
                          id="newEmail"
                          type="email"
                          placeholder="Enter new email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="newPassword" className="text-sm mb-2 block">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={handleUpdateCredentials}
                        >
                          Save Credentials
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => {
                            setShowCredentialEditor(false)
                            setNewEmail("")
                            setNewPassword("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* System Information */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">System Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform:</span>
                      <span className="font-medium">EventHub v1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span className="font-medium">{new Date(admin.loginTime).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Admin Role:</span>
                      <span className="font-medium">Super Administrator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Database:</span>
                      <span className="font-medium">Local Storage</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Events:</span>
                      <span className="font-medium">{events.length} (including user-created)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
