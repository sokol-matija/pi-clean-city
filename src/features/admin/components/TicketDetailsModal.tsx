import { useState, useEffect } from "react"
//import { supabase } from "@/lib/supabase"
import { useTicketService } from "../context/TicketServiceContext"
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

import { PRIORITY_OPTIONS  } from "../config/priorityConfig"

import { useTicketForm } from "../hooks/useTicketForm"

interface TicketDetailsModalProps {
  report: ReportWithRelations
  onClose: () => void
  onUpdate: () => void
}

export function TicketDetailsModal({ report, onClose, onUpdate }: TicketDetailsModalProps) {
  const ticketService = useTicketService()

  const [cityServices, setCityServices] = useState<Profile[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    selectedWorker,
    setSelectedWorker,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    changes,
    hasChanges,
  } = useTicketForm(report)

  useEffect(() => {
    loadData()
  }, [])


  const loadData = async () => {
    try {
      const [servicesData, statusesData] = await Promise.all([
        ticketService.getCityServices(),
        ticketService.getStatuses()
      ])

      setCityServices(servicesData)
      setStatuses(statusesData)
    } catch (err) {
      console.error("Error loading modal data:", err)
      alert("Failed to load dropdown data")
    }
  }

  // const loadData = async () => {
  //   try {
  //     const { data: servicesData, error:  servicesError } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("role", "cityservice")
  //       .order("username")

  //     if (servicesError) throw servicesError

  //     const { data: statusesData, error: statusesError } = await supabase
  //       .from("status")
  //       .select("*")
  //       .order("sort_order")

  //     if (statusesError) throw statusesError

  //     setCityServices(servicesData as Profile[])
  //     setStatuses(statusesData as Status[])
  //   } catch (err) {
  //     console.error("Error loading modal data:", err)
  //     alert("Failed to load dropdown data")
  //   }
  // }

  const handleSaveChanges = async () => {
    if (!hasChanges) {
      alert("No changes to save")
      return
    }
    
    try {
      setIsLoading(true)
      await ticketService.updateTicket(report.id, changes)

      alert("Ticket updated successfully!")
      onUpdate()
      onClose()
    } catch (err) {
      console.error("Error saving changes:", err)
      alert(err instanceof Error ? err.message :  "Failed to save changes")
    } finally {
      setIsLoading(false)
    }
  }

  // const handleSaveChanges = async () => {
  //   if (!hasChanges) {
  //     alert("No changes to save")
  //     return
  //   }

  //   try {
  //     setIsLoading(true)

  //     const { error } = await supabase
  //       .from("report")
  //       .update(changes)
  //       .eq("id", report.id)

  //     if (error) throw error

  //     alert("Ticket updated successfully!")
  //     onUpdate()
  //     onClose()
  //   } catch (err) {
  //     console.error("Error saving changes:", err)
  //     alert(err instanceof Error ? err.message :  "Failed to save changes")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const formatServiceName = (profile: Profile | null | undefined): string => {
    if (!profile) return "Unknown"

    if (profile.username) return profile.username

    const email = profile.email || ""
    const serviceNames:  Record<string, string> = {
      "roads@cleancity.com": "Roads Service",
      "lighting@cleancity.com": "Public Lighting Service",
      "waste@cleancity.com": "Waste Management Service",
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
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 p-6">
          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
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
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium">Assigned To:</span>
                  <span className="col-span-2">
                    <Badge variant="outline">{formatServiceName(report.assigned_worker)}</Badge>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assign Worker */}
              <div>
                <label className="mb-2 block text-sm font-medium">Assign to City Service</label>
                <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select worker..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cityServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {formatServiceName(service)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {report.assigned_worker && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current: {formatServiceName(report.assigned_worker)}
                  </p>
                )}
              </div>

              {/* Change Priority */}
              <div>
                <label className="mb-2 block text-sm font-medium">Priority</label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem> */}
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                {report.priority && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current: <span className="capitalize">{report.priority}</span>
                  </p>
                )}
              </div>

              {/* Change Status */}
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
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
                {report.status && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current: {report.status.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sticky bottom-0 flex justify-between border-t bg-background p-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isLoading || !hasChanges}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}