import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, MapPin } from "lucide-react"
import type { ReportWithRelations, Profile, Status } from "@/types/database.types"

interface TicketDetailsModalProps {
  report: ReportWithRelations
  onClose: () => void
  onUpdate: () => void
}

export function TicketDetailsModal({ report, onClose, onUpdate }: TicketDetailsModalProps) {
  const [cityServices, setCityServices] = useState<Profile[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [selectedWorker, setSelectedWorker] = useState<string>(report.assigned_worker_id || "")
  const [selectedPriority, setSelectedPriority] = useState<string>(report.priority || "Medium")
  const [selectedStatus, setSelectedStatus] = useState<string>(report.status_id?.toString() || "")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Fetch city service profiles
      const { data: servicesData, error: servicesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "cityservice")
        .order("username")

      if (servicesError) throw servicesError

      // Fetch statuses
      const { data: statusesData, error: statusesError } = await supabase
        .from("status")
        .select("*")
        .order("sort_order")

      if (statusesError) throw statusesError

      setCityServices(servicesData as Profile[])
      setStatuses(statusesData as Status[])
    } catch (err) {
      console.error("Error loading modal data:", err)
    }
  }

  const handleAssignWorker = async () => {
    if (!selectedWorker) {
      alert("Please select a worker")
      return
    }

    try {
      setIsLoading(true)
      const { error } = await supabase
        .from("report")
        .update({ assigned_worker_id: selectedWorker })
        .eq("id", report.id)

      if (error) throw error

      alert("Worker assigned successfully!")
      onUpdate()
      onClose()
    } catch (err) {
      console.error("Error assigning worker:", err)
      alert("Failed to assign worker")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePriority = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from("report")
        .update({ priority: selectedPriority })
        .eq("id", report.id)

      if (error) throw error

      alert("Priority updated successfully!")
      onUpdate()
      onClose()
    } catch (err) {
      console.error("Error updating priority:", err)
      alert("Failed to update priority")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from("report")
        .update({ status_id: parseInt(selectedStatus) })
        .eq("id", report.id)

      if (error) throw error

      alert("Status updated successfully!")
      onUpdate()
      onClose()
    } catch (err) {
      console.error("Error updating status:", err)
      alert("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  const formatServiceName = (profile: Profile | null | undefined): string => {
    if (!profile) return "Unknown"

    // if (profile.username) return profile.username

    const email = profile.email || ""

    const serviceNames: Record<string, string> = {
      "roads@cleancity.com": "Roads Service",
      "lighting@cleancity.com": "Public Lighting Service",
      "waste@cleancity. com": "Waste Management Service",
    }

    return (
      serviceNames[email] ||
      email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-background p-4">
          <h2 className="text-xl font-bold">Ticket Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 p-6">
          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">ID:</span>
                <span className="col-span-2 font-mono text-sm">{report.id}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Title:</span>
                <span className="col-span-2">{report.title}</span>
              </div>

              {report.description && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium">Description: </span>
                  <span className="col-span-2">{report.description}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Category:</span>
                <span className="col-span-2">{report.category?.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Status:</span>
                <span className="col-span-2">
                  <Badge>{report.status?.name}</Badge>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Priority:</span>
                <span className="col-span-2">
                  <Badge>{report.priority || "N/A"}</Badge>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Created:</span>
                <span className="col-span-2">{new Date(report.created_at).toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Created By:</span>
                <span className="col-span-2">{report.user?.email}</span>
              </div>

              {report.address && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="h-4 w-4" /> Location:
                  </span>
                  <span className="col-span-2">
                    {report.address}
                    {report.latitude && report.longitude && (
                      <div className="text-xs text-muted-foreground">
                        GPS: {report.latitude}, {report.longitude}
                      </div>
                    )}
                  </span>
                </div>
              )}

              {report.assigned_worker && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Currently: {formatServiceName(report.assigned_worker)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle>⚙️ Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assign Worker */}
              <div>
                <label className="mb-2 block text-sm font-medium">Assign to City Service</label>
                <div className="flex gap-2">
                  <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select City Service..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cityServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {formatServiceName(service)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAssignWorker} disabled={isLoading || !selectedWorker}>
                    Assign
                  </Button>
                </div>
                {report.assigned_worker && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Currently: {report.assigned_worker.username || report.assigned_worker.email}
                  </p>
                )}
              </div>

              {/* Change Priority */}
              <div>
                <label className="mb-2 block text-sm font-medium">Change Priority</label>
                <div className="flex gap-2">
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleUpdatePriority} disabled={isLoading}>
                    Update
                  </Button>
                </div>
              </div>

              {/* Change Status */}
              <div>
                <label className="mb-2 block text-sm font-medium">Change Status</label>
                <div className="flex gap-2">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={status.id.toString()}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleUpdateStatus} disabled={isLoading}>
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end border-t bg-background p-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
