import type { INotification, NotificationType } from "../../types"

interface DecoratedNotification extends INotification {
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

interface INotificationDecorator {
  decorate(notification: INotification | DecoratedNotification): DecoratedNotification
}

class PriorityNotificationDecorator implements INotificationDecorator {
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

class TimestampNotificationDecorator implements INotificationDecorator {
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

class CategoryIconDecorator implements INotificationDecorator {
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

class NotificationDecoratorChain {
  private readonly decorators: INotificationDecorator[] = []

  addDecorator(decorator: INotificationDecorator): this {
    this.decorators.push(decorator)
    return this
  }

  decorate(notification: INotification): DecoratedNotification {
    let decorated = new PriorityNotificationDecorator().decorate(notification)

    for (const decorator of this.decorators) {
      decorated = decorator.decorate(decorated)
    }

    return decorated
  }
}

export function createDefaultDecoratorChain(): NotificationDecoratorChain {
  return new NotificationDecoratorChain()
    .addDecorator(new TimestampNotificationDecorator())
    .addDecorator(new CategoryIconDecorator())
}
