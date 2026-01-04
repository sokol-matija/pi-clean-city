import type { BadgeProps } from "@/components/ui/badge"

export type BadgeVariant = BadgeProps["variant"]

export const STATUS_BADGE_CONFIG: Record<string, BadgeVariant> = {
  // Current statuses from database
  new: "destructive",
  "in progress": "default",
  resolved: "secondary",
  closed: "outline",
}

export const PRIORITY_BADGE_CONFIG: Record<string, BadgeVariant> = {
  critical: "destructive",
  high: "destructive",
  medium: "default",
  low: "secondary",

  // Future priorities can be added here without modifying any logic:
  // "urgent": "destructive",
  // "none": "outline",
}

const DEFAULT_STATUS_VARIANT: BadgeVariant = "default"
const DEFAULT_PRIORITY_VARIANT: BadgeVariant = "secondary"

export function getStatusBadgeVariant(statusName: string | undefined | null): BadgeVariant {
  if (!statusName) return DEFAULT_STATUS_VARIANT

  const normalizedStatus = statusName.toLowerCase().trim()
  return STATUS_BADGE_CONFIG[normalizedStatus] ?? DEFAULT_STATUS_VARIANT
}

export function getPriorityBadgeVariant(priority: string | undefined | null): BadgeVariant {
  if (!priority) return DEFAULT_PRIORITY_VARIANT

  const normalizedPriority = priority.toLowerCase().trim()
  return PRIORITY_BADGE_CONFIG[normalizedPriority] ?? DEFAULT_PRIORITY_VARIANT
}
