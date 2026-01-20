import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/types/database.types"

interface TicketAssignment {
  assigned_worker_id: string | null
  assigned_worker: Profile | null | undefined
}

interface TicketAssignmentBadgeProps {
  assignment: TicketAssignment
}

export function TicketAssignmentBadge({ assignment }: Readonly<TicketAssignmentBadgeProps>) {
  if (!assignment.assigned_worker) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Unassigned
      </Badge>
    )
  }

  const workerName = assignment.assigned_worker.username || assignment.assigned_worker.email

  return <Badge variant="secondary">{workerName}</Badge>
}
