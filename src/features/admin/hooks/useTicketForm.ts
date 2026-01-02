import { useState, useMemo } from "react"
import type { ReportWithRelations } from "@/types/database.types"
import type { TicketUpdatePayload } from "../services/interfaces/ITicketService"

export function useTicketForm(report: ReportWithRelations) {
  const [selectedWorker, setSelectedWorker] = useState<string>(
    report.assigned_worker_id || ""
  )
  const [selectedPriority, setSelectedPriority] = useState<string>(
    report.priority || "medium"
  )
  const [selectedStatus, setSelectedStatus] = useState<string>(
    report.status_id?.toString() || ""
  )

  // Facade pattern: Simplify complex state management 
  const changes = useMemo(() => {
    const updates: TicketUpdatePayload = {}

    // Worker assignment
    const newWorkerId = selectedWorker || null
    const currentWorkerId = report.assigned_worker_id || null
    
    if (newWorkerId !== currentWorkerId) {
      updates.assigned_worker_id = newWorkerId
    }

    // Priority
    if (selectedPriority !== report.priority) {
      updates.priority = selectedPriority
    }

    // Status
    const newStatusId = selectedStatus ? parseInt(selectedStatus, 10) : undefined
    const currentStatusId = report.status_id
    
    if (newStatusId !== undefined && newStatusId !== currentStatusId) {
      updates.status_id = newStatusId
    }

    return updates
  }, [selectedWorker, selectedPriority, selectedStatus, report])

  const hasChanges = Object.keys(changes).length > 0

  return {
    selectedWorker,
    setSelectedWorker,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    
    // Computed
    changes,
    hasChanges,
  }
}
