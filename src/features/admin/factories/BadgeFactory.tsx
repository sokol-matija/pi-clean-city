/**
 * Badge Factory
 *
 * DESIGN PATTERN: Factory Method (Creational)
 */

import { type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import {
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
} from "@/features/reports/config/badgeConfig"
import type { Status, Profile } from "@/types/database.types"

interface BadgeComponent {
  render(): ReactNode
  getLabel(): string
}

// Status Badge - show ticket status
class StatusBadge implements BadgeComponent {
  private readonly status: Status | null | undefined

  constructor(status: Status | null | undefined) {
    this.status = status
  }

  render(): ReactNode {
    const statusName: string = this.status?.name || "Unknown"
    const variant = getStatusBadgeVariant(statusName)

    return <Badge variant={variant}>{statusName}</Badge>
  }

  getLabel(): string {
    return this.status?.name || "Unknown"
  }
}

//Priority Badge - show ticket priority
class PriorityBadge implements BadgeComponent {
  private readonly priority: string | null | undefined

  constructor(priority: string | null | undefined) {
    this.priority = priority
  }

  render(): ReactNode {
    const priorityValue: string = this.priority || "N/A"
    const variant = getPriorityBadgeVariant(priorityValue)

    return <Badge variant={variant}>{priorityValue}</Badge>
  }

  getLabel(): string {
    return this.priority || "N/A"
  }
}

// Assignment Badge - show assigned worker
class AssignmentBadge implements BadgeComponent {
  private readonly worker: Profile | null | undefined

  constructor(worker: Profile | null | undefined) {
    this.worker = worker
  }

  render(): ReactNode {
    if (!this.worker) {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Unassigned
        </Badge>
      )
    }

    const workerName: string = this.worker.username || this.worker.email || "Unknown"

    return <Badge variant="secondary">{workerName}</Badge>
  }

  getLabel(): string {
    return this.worker?.username || this.worker?.email || "Unassigned"
  }
}

// Category Badge - show ticket category
class CategoryBadge implements BadgeComponent {
  private readonly categoryName: string | null | undefined

  constructor(categoryName: string | null | undefined) {
    this.categoryName = categoryName
  }

  render(): ReactNode {
    const name: string = this.categoryName || "N/A"

    return <Badge variant="outline">{name}</Badge>
  }

  getLabel(): string {
    return this.categoryName || "N/A"
  }
}

/**
 * FACTORY METHOD
 */
export const createStatusBadge = (status: Status | null | undefined): BadgeComponent => {
  return new StatusBadge(status)
}

export const createPriorityBadge = (priority: string | null | undefined): BadgeComponent => {
  return new PriorityBadge(priority)
}

export const createAssignmentBadge = (worker: Profile | null | undefined): BadgeComponent => {
  return new AssignmentBadge(worker)
}

export const createCategoryBadge = (categoryName: string | null | undefined): BadgeComponent => {
  return new CategoryBadge(categoryName)
}

// Renderer for BadgeComponent
interface BadgeRendererProps {
  badge: BadgeComponent
}

export function BadgeRenderer({ badge }: Readonly<BadgeRendererProps>): JSX.Element {
  return <>{badge.render()}</>
}
