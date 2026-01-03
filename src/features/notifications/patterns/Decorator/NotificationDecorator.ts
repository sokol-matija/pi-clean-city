/**
 * DECORATOR PATTERN - NotificationDecorator
 *
 * Purpose: Enrich notifications with additional metadata without modifying core structure
 *
 * This pattern allows adding features to notifications dynamically:
 * - Add timestamps, urgency levels, badges, icons
 * - Multiple decorators can be chained together
 * - Original notification object remains unchanged
 * - Easy to add new decorations without modifying existing code
 *
 * Based on PostDecorator from feature/community-design-patterns
 */

import type { INotification, NotificationType } from "../../types"

/**
 * Extended notification with decorations
 */
export interface DecoratedNotification extends INotification {
  decorations: {
    priority: number
    urgencyLevel: "low" | "medium" | "high" | "critical"
    isRead: boolean
    timestamp: number
    category: NotificationType
    badges: string[]
    timeAgo?: string
    categoryIcon?: string
  }
}

/**
 * Base decorator interface
 */
export interface INotificationDecorator {
  decorate(notification: INotification | DecoratedNotification): DecoratedNotification
}

/**
 * Priority Decorator - Calculates urgency level from priority
 */
export class PriorityNotificationDecorator implements INotificationDecorator {
  decorate(notification: INotification): DecoratedNotification {
    const priority = notification.priority || 3
    const urgencyLevel = this.calculateUrgency(priority)

    return {
      ...notification,
      decorations: {
        priority,
        urgencyLevel,
        isRead: false,
        timestamp: Date.now(),
        category: this.inferCategory(notification),
        badges: this.generateBadges(urgencyLevel),
      },
    }
  }

  private calculateUrgency(priority: number): "low" | "medium" | "high" | "critical" {
    if (priority >= 5) return "critical"
    if (priority >= 4) return "high"
    if (priority >= 3) return "medium"
    return "low"
  }

  private inferCategory(notification: INotification): NotificationType {
    const message = notification.message.toLowerCase()
    const title = notification.title?.toLowerCase() || ""

    if (message.includes("comment") || title.includes("comment")) return "comment"
    if (message.includes("status") || title.includes("status")) return "status_update"
    if (message.includes("assigned") || title.includes("assignment")) return "assignment"
    if (message.includes("resolved") || title.includes("resolved")) return "resolution"
    if (message.includes("mentioned") || title.includes("mentioned")) return "mention"

    return "comment" // Default
  }

  private generateBadges(urgency: string): string[] {
    const badges: string[] = []
    if (urgency === "critical") badges.push("🔴", "URGENT")
    if (urgency === "high") badges.push("🟠", "HIGH")
    if (urgency === "medium") badges.push("🟡", "MEDIUM")
    return badges
  }
}

/**
 * Timestamp Decorator - Adds human-readable relative time
 */
export class TimestampNotificationDecorator implements INotificationDecorator {
  decorate(notification: DecoratedNotification): DecoratedNotification {
    const timeAgo = this.getTimeAgo(notification.decorations.timestamp)

    return {
      ...notification,
      decorations: {
        ...notification.decorations,
        timeAgo,
      },
    }
  }

  private getTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)

    if (seconds < 60) return "upravo sada" // just now
    if (seconds < 3600) return `prije ${Math.floor(seconds / 60)} min` // X minutes ago
    if (seconds < 86400) return `prije ${Math.floor(seconds / 3600)} h` // X hours ago
    return `prije ${Math.floor(seconds / 86400)} dana` // X days ago
  }
}

/**
 * Category Icon Decorator - Adds category-specific icons
 */
export class CategoryIconDecorator implements INotificationDecorator {
  decorate(notification: DecoratedNotification): DecoratedNotification {
    const categoryIcon = this.getCategoryIcon(notification.decorations.category)

    return {
      ...notification,
      decorations: {
        ...notification.decorations,
        categoryIcon,
      },
    }
  }

  private getCategoryIcon(category: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      comment: "💬",
      status_update: "📊",
      assignment: "📋",
      resolution: "✅",
      mention: "📢",
    }
    return icons[category]
  }
}

/**
 * Decorator Chain - Combines multiple decorators
 */
export class NotificationDecoratorChain {
  private decorators: INotificationDecorator[] = []

  /**
   * Add decorator to chain
   */
  addDecorator(decorator: INotificationDecorator): this {
    this.decorators.push(decorator)
    return this
  }

  /**
   * Apply all decorators in sequence
   */
  decorate(notification: INotification): DecoratedNotification {
    // First apply priority decorator (creates base decorated notification)
    let decorated = new PriorityNotificationDecorator().decorate(notification)

    // Then apply all additional decorators
    for (const decorator of this.decorators) {
      decorated = decorator.decorate(decorated)
    }

    return decorated
  }
}

/**
 * Factory function for creating default decorator chain
 */
export function createDefaultDecoratorChain(): NotificationDecoratorChain {
  return new NotificationDecoratorChain()
    .addDecorator(new TimestampNotificationDecorator())
    .addDecorator(new CategoryIconDecorator())
}

/**
 * Factory function for minimal decorator chain (priority only)
 */
export function createMinimalDecoratorChain(): NotificationDecoratorChain {
  return new NotificationDecoratorChain()
}
