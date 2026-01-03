# Design Patterns in Pi Clean City Notification System

**Meeting Presentation Document**

## Overview

This document presents the 4 design patterns implemented in our notification system, with real code examples from the `pi-clean-city` project.

---

## 1. Factory Pattern

**File:** `src/features/notifications/patterns/Factory/NotificationFactory.ts`

### What it does

Creates different types of notifications with consistent structure without needing complex conditional logic.

### Benefits

- Centralizes notification creation logic
- Easy to add new notification types
- Ensures consistent structure across all notifications
- Type-safe notification creation

### Implementation

```typescript
export class NotificationFactory {
  static createCommentNotification(params: {
    topic: string
    reportId: string
    commenterName: string
    commentPreview: string
    reportTitle: string
  }): INotification {
    return {
      topic: params.topic,
      title: "New Comment",
      message: `${params.commenterName} commented: "${params.commentPreview}"`,
      priority: 3,
      tags: ["speech_balloon"],
      click: `${window.location.origin}/reports/${params.reportId}`,
      actions: [
        {
          action: "view",
          label: "View Report",
          url: `${window.location.origin}/reports/${params.reportId}`,
        },
        {
          action: "view",
          label: "Reply",
          url: `${window.location.origin}/reports/${params.reportId}#comments`,
        },
      ],
    }
  }

  // 4 more factory methods:
  // - createStatusUpdateNotification
  // - createAssignmentNotification
  // - createResolutionNotification
  // - createMentionNotification
}
```

### Real Usage Example

```typescript
// In useAddComment.ts
const notification = NotificationFactory.createCommentNotification({
  topic: getUserTopic(report.user.username),
  reportId: reportId,
  commenterName: commenterProfile?.username || "Someone",
  commentPreview: content.substring(0, 50),
  reportTitle: report.title,
})
```

### Notification Types Supported

1. **Comment Notifications** - When someone comments on your report
2. **Status Update Notifications** - When report status changes
3. **Assignment Notifications** - When a worker is assigned to a report
4. **Resolution Notifications** - When a report is marked as resolved
5. **Mention Notifications** - When someone mentions you in a comment

---

## 2. Observer Pattern (with Singleton)

**File:** `src/features/notifications/patterns/Observer/NotificationEventEmitter.ts`

### What it does

Event-driven system that decouples notification triggers from notification sending.

### Benefits

- Components emit events when actions occur
- Observers listen and react to events
- Multiple observers can react to the same event
- Easy to add/remove observers without modifying existing code
- Singleton ensures only one event emitter exists

### Implementation

```typescript
export class NotificationEventEmitter {
  private static instance: NotificationEventEmitter
  private listeners: Map<NotificationEvent, Set<NotificationEventHandler<NotificationEvent>>>

  // Singleton implementation
  public static getInstance(): NotificationEventEmitter {
    if (!NotificationEventEmitter.instance) {
      NotificationEventEmitter.instance = new NotificationEventEmitter()
    }
    return NotificationEventEmitter.instance
  }

  // Subscribe to events
  public subscribe<T extends NotificationEvent>(
    event: T,
    handler: NotificationEventHandler<T>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(handler)
    }
  }

  // Emit events to all subscribers
  public async emit<T extends NotificationEvent>(
    event: T,
    payload: NotificationEventPayloads[T]
  ): Promise<void> {
    const handlers = this.listeners.get(event)
    if (!handlers || handlers.size === 0) return

    // Execute all handlers in parallel
    const promises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(payload)
      } catch (error) {
        console.error(`Handler error for ${event}:`, error)
      }
    })

    await Promise.all(promises)
  }
}
```

### Event Types

```typescript
type NotificationEvent =
  | "report:commented"
  | "report:status_changed"
  | "report:assigned"
  | "report:resolved"
  | "user:mentioned"
```

### Usage Example

```typescript
// Subscribe to comment events
const emitter = NotificationEventEmitter.getInstance()

emitter.subscribe("report:commented", async (payload) => {
  // Send notification via NTFY
  await ntfyService.publish({
    topic: getUserTopic(payload.reportOwnerUsername),
    title: "New Comment",
    message: `${payload.commenterName} commented on your report`,
  })
})

// Emit event when comment is created
emitter.emit("report:commented", {
  reportId: "123",
  reportOwnerId: "user-456",
  reportOwnerUsername: "john-doe",
  commenterId: "user-789",
  commenterName: "Jane Smith",
  commentPreview: "Great work on this!",
  reportTitle: "Broken Street Light",
})
```

---

## 3. Singleton Pattern

**Included in Observer Pattern implementation**

### What it does

Ensures only one instance of the NotificationEventEmitter exists throughout the application.

### Benefits

- Single source of truth for all notification events
- Prevents multiple event emitters from interfering with each other
- Memory efficient
- Consistent state across the entire app

### Implementation

```typescript
export class NotificationEventEmitter {
  private static instance: NotificationEventEmitter

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  public static getInstance(): NotificationEventEmitter {
    if (!NotificationEventEmitter.instance) {
      NotificationEventEmitter.instance = new NotificationEventEmitter()
    }
    return NotificationEventEmitter.instance
  }
}

// Export singleton instance for easy access
export const notificationEventEmitter = NotificationEventEmitter.getInstance()
```

---

## 4. Decorator Pattern

**File:** `src/features/notifications/patterns/Decorator/NotificationDecorator.ts`

### What it does

Adds additional features/metadata to notifications without modifying the original notification structure.

### Benefits

- Add features dynamically at runtime
- Multiple decorators can be chained together
- Original notification remains unchanged
- Easy to add new decorations without modifying existing code

### Implementation

```typescript
// Base decorator interface
export interface INotificationDecorator {
  decorate(notification: INotification | DecoratedNotification): DecoratedNotification
}

// Priority Decorator - Calculates urgency level
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
}

// Timestamp Decorator - Adds human-readable time
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
    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }
}

// Category Icon Decorator - Adds icons based on category
export class CategoryIconDecorator implements INotificationDecorator {
  decorate(notification: DecoratedNotification): DecoratedNotification {
    const icons = {
      comment: "💬",
      status_update: "📊",
      assignment: "📋",
      resolution: "✅",
      mention: "📢",
    }

    return {
      ...notification,
      decorations: {
        ...notification.decorations,
        categoryIcon: icons[notification.decorations.category],
      },
    }
  }
}
```

### Decorator Chain

```typescript
export class NotificationDecoratorChain {
  private decorators: INotificationDecorator[] = []

  addDecorator(decorator: INotificationDecorator): this {
    this.decorators.push(decorator)
    return this
  }

  decorate(notification: INotification): DecoratedNotification {
    // Apply priority decorator first
    let decorated = new PriorityNotificationDecorator().decorate(notification)

    // Then apply all additional decorators in sequence
    for (const decorator of this.decorators) {
      decorated = decorator.decorate(decorated)
    }

    return decorated
  }
}
```

### Usage Example

```typescript
// Create decorator chain
const decoratorChain = new NotificationDecoratorChain()
  .addDecorator(new TimestampNotificationDecorator())
  .addDecorator(new CategoryIconDecorator())

// Apply decorations
const baseNotification = NotificationFactory.createCommentNotification({...})
const decoratedNotification = decoratorChain.decorate(baseNotification)

// Result:
{
  topic: "pi-clean-city-john-doe",
  title: "New Comment",
  message: "Jane commented: 'Great work!'",
  priority: 3,
  decorations: {
    priority: 3,
    urgencyLevel: "medium",
    isRead: false,
    timestamp: 1704294000000,
    category: "comment",
    badges: ["🟡", "MEDIUM"],
    timeAgo: "2 min ago",
    categoryIcon: "💬"
  }
}
```

---

## Complete Implementation Flow

### 1. User Comments on Report

```typescript
// useAddComment.ts - Real production code

export function useAddComment() {
  const ntfyService = new NtfyService()

  return useMutation({
    mutationFn: async ({ reportId, content }: AddCommentData) => {
      // 1. Insert comment to database
      const { data: comment } = await supabase.from("comment").insert({...})

      // 2. Get report owner info
      const { data: report } = await supabase.from("report").select(...)

      // 3. Use Factory Pattern to create notification
      const notification = NotificationFactory.createCommentNotification({
        topic: getUserTopic(report.user.username),
        reportId: reportId,
        commenterName: commenterProfile?.username,
        commentPreview: content.substring(0, 50),
        reportTitle: report.title,
      })

      // 4. Send via NTFY service
      await ntfyService.publish(notification)

      return comment
    }
  })
}
```

### 2. Optional: Event-Driven Approach

```typescript
// Using Observer Pattern

// Subscribe to events (in app initialization)
notificationEventEmitter.subscribe("report:commented", async (payload) => {
  const notification = NotificationFactory.createCommentNotification({
    topic: getUserTopic(payload.reportOwnerUsername),
    reportId: payload.reportId,
    commenterName: payload.commenterName,
    commentPreview: payload.commentPreview,
    reportTitle: payload.reportTitle,
  })

  await ntfyService.publish(notification)
})

// Emit event (in useAddComment)
notificationEventEmitter.emit("report:commented", {
  reportId,
  reportOwnerId: report.user_id,
  reportOwnerUsername: report.user.username,
  commenterId: user.id,
  commenterName: commenterProfile.username,
  commentPreview: content.substring(0, 50),
  reportTitle: report.title,
})
```

### 3. Optional: Add Decorations

```typescript
// Create base notification
const notification = NotificationFactory.createCommentNotification({...})

// Apply decorators for UI display
const decoratorChain = createDefaultDecoratorChain()
const decoratedNotification = decoratorChain.decorate(notification)

// Now has: urgency badges, timestamps, category icons, etc.
```

---

## Architecture Benefits

### Separation of Concerns

- **Factory**: Creates notifications
- **Observer**: Manages event flow
- **Decorator**: Enhances notifications
- **NTFY Service**: Handles actual sending

### Scalability

- Easy to add new notification types (just add factory method)
- Easy to add new event types (just add to enum)
- Easy to add new decorations (just create decorator class)

### Maintainability

- Each pattern has single responsibility
- Changes in one pattern don't affect others
- Clear, predictable code structure

### Testability

- Each pattern can be tested independently
- Mock factories, emitters, decorators separately
- Type-safe interfaces make testing easier

---

## Files Structure

```
src/features/notifications/
├── patterns/
│   ├── Factory/
│   │   └── NotificationFactory.ts        # Factory Pattern
│   ├── Observer/
│   │   └── NotificationEventEmitter.ts   # Observer + Singleton
│   └── Decorator/
│       └── NotificationDecorator.ts      # Decorator Pattern
├── services/
│   └── NtfyService.ts                    # NTFY API integration
├── utils/
│   └── topicHelpers.ts                   # Helper functions
├── types/
│   └── index.ts                          # TypeScript interfaces
└── pages/
    └── NotificationGuidePage.tsx         # User-facing guide
```

---

## Current Implementation Status

### ✅ Implemented

- Factory Pattern (5 notification types)
- Observer Pattern with Singleton
- Decorator Pattern (3 decorators)
- NTFY Service integration
- Comment notifications (working)
- User guide page

### 🚧 Ready for Implementation

- Status update notifications
- Assignment notifications
- Resolution notifications
- Mention notifications
- Real-time notification display UI

---

## Key Takeaways for Meeting

1. **4 Design Patterns**: Factory, Observer, Singleton, Decorator
2. **Production Ready**: Currently sending real comment notifications via NTFY
3. **Scalable Architecture**: Easy to add new notification types
4. **Type-Safe**: Full TypeScript support with interfaces
5. **Real User Value**: Users get push notifications on their phones
6. **Clean Code**: Each pattern has clear responsibility and purpose

---

**Questions for Discussion:**

- Should we implement notification history UI?
- Should we add in-app notification bell icon?
- Do we want real-time websocket notifications in addition to NTFY?
- Should we add notification preferences (enable/disable per type)?
