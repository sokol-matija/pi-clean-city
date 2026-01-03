# Notification System - Design Patterns Implementation

**Author:** Matija Sokol
**Branch:** `feature/design-patterns-ms`
**Date:** 2026-01-03

This feature implements a real-time notification system using **NTFY.sh** with three design patterns:

1. **Factory Pattern** - Create notifications
2. **Observer Pattern** - Event-driven notification triggers
3. **Decorator Pattern** - Enrich notifications with metadata

---

## Architecture Overview

```
User Action (e.g., add comment)
        ↓
Observer emits event: 'report:commented'
        ↓
Event handler receives event
        ↓
Factory creates notification
        ↓
Decorator enriches notification
        ↓
NTFY service sends to topic: pi-clean-city-{username}
        ↓
User receives notification on their device
```

---

## Pattern 1: Factory Pattern

**File:** `patterns/Factory/NotificationFactory.ts`

**Purpose:** Centralized creation of different notification types

### Usage Example

```typescript
import { NotificationFactory } from "@/features/notifications/patterns/Factory/NotificationFactory"

// Create a comment notification
const notification = NotificationFactory.createCommentNotification({
  topic: "pi-clean-city-john_doe",
  reportId: "123",
  commenterName: "Jane Smith",
  commentPreview: "This has been fixed!",
  reportTitle: "Garbage on Main Street",
})

console.log(notification)
// {
//   topic: 'pi-clean-city-john_doe',
//   title: 'New Comment 💬',
//   message: 'Jane Smith commented: "This has been fixed!"',
//   priority: 3,
//   tags: ['speech_balloon', '💬'],
//   click: 'http://localhost:5173/reports/123',
//   actions: [...]
// }
```

### Available Factory Methods

- `createCommentNotification()` - New comment on user's report
- `createStatusUpdateNotification()` - Report status changed
- `createAssignmentNotification()` - Report assigned to worker
- `createResolutionNotification()` - Report marked as resolved
- `createMentionNotification()` - User mentioned in comment

---

## Pattern 2: Observer Pattern

**File:** `patterns/Observer/NotificationEventEmitter.ts`

**Purpose:** Event-driven system for decoupled notification triggering

### Usage Example

```typescript
import { notificationEventEmitter } from "@/features/notifications/patterns/Observer/NotificationEventEmitter"

// Subscribe to events
const unsubscribe = notificationEventEmitter.subscribe("report:commented", async (payload) => {
  console.log("Comment event received:", payload)
  // Send notification
  await sendNotification(payload)
})

// Emit event when comment is added
await notificationEventEmitter.emit("report:commented", {
  reportId: "123",
  reportOwnerId: "user-456",
  reportOwnerUsername: "john_doe",
  commenterId: "user-789",
  commenterName: "Jane Smith",
  commentPreview: "This looks good!",
  reportTitle: "Garbage Report",
})

// Cleanup
unsubscribe()
```

### Available Events

- `report:commented` - Comment added to report
- `report:status_changed` - Report status updated
- `report:assigned` - Report assigned to worker
- `report:resolved` - Report marked as resolved
- `user:mentioned` - User mentioned in comment

---

## Pattern 3: Decorator Pattern

**File:** `patterns/Decorator/NotificationDecorator.ts`

**Purpose:** Add metadata to notifications without modifying original structure

### Usage Example

```typescript
import { createDefaultDecoratorChain } from "@/features/notifications/patterns/Decorator/NotificationDecorator"
import { NotificationFactory } from "@/features/notifications/patterns/Factory/NotificationFactory"

// Create base notification
const notification = NotificationFactory.createCommentNotification({
  topic: "pi-clean-city-john_doe",
  reportId: "123",
  commenterName: "Jane",
  commentPreview: "Fixed!",
  reportTitle: "Garbage",
})

// Decorate it
const chain = createDefaultDecoratorChain()
const decorated = chain.decorate(notification)

console.log(decorated.decorations)
// {
//   priority: 3,
//   urgencyLevel: 'medium',
//   isRead: false,
//   timestamp: 1704279600000,
//   category: 'comment',
//   badges: ['🟡', 'MEDIUM'],
//   timeAgo: '5 min ago',
//   categoryIcon: '💬'
// }
```

### Available Decorators

- `PriorityNotificationDecorator` - Adds urgency level, badges
- `TimestampNotificationDecorator` - Adds human-readable time ("5 min ago")
- `CategoryIconDecorator` - Adds category-specific icons

---

## Complete Integration Example

```typescript
import { NotificationFactory } from "@/features/notifications/patterns/Factory/NotificationFactory"
import { notificationEventEmitter } from "@/features/notifications/patterns/Observer/NotificationEventEmitter"
import { createDefaultDecoratorChain } from "@/features/notifications/patterns/Decorator/NotificationDecorator"
import { NtfyService } from "@/features/notifications/services/NtfyService"

// 1. Setup Observer
notificationEventEmitter.subscribe("report:commented", async (payload) => {
  // 2. Create notification using Factory
  const notification = NotificationFactory.createCommentNotification({
    topic: `pi-clean-city-${payload.reportOwnerUsername}`,
    reportId: payload.reportId,
    commenterName: payload.commenterName,
    commentPreview: payload.commentPreview,
    reportTitle: payload.reportTitle,
  })

  // 3. Decorate notification
  const chain = createDefaultDecoratorChain()
  const decorated = chain.decorate(notification)

  console.log("Sending notification:", decorated)

  // 4. Send via NTFY
  const ntfy = new NtfyService()
  await ntfy.publish({
    topic: notification.topic,
    message: notification.message,
    title: notification.title,
    priority: notification.priority,
    tags: notification.tags,
    click: notification.click,
    actions: notification.actions,
  })
})

// 5. Emit event from your code
await notificationEventEmitter.emit("report:commented", {
  reportId: "123",
  reportOwnerId: "user-456",
  reportOwnerUsername: "john_doe",
  commenterId: "user-789",
  commenterName: "Jane Smith",
  commentPreview: "This is fixed now!",
  reportTitle: "Garbage on Main Street",
})
```

---

## User Guide Page

**Route:** `/notifications/guide`
**File:** `pages/NotificationGuidePage.tsx`

Shows users:

- Their personal NTFY topic: `pi-clean-city-{username}`
- Setup instructions for NTFY app
- What notifications they'll receive
- Test notification button

---

## NTFY Service

**File:** `services/NtfyService.ts`

Basic NTFY.sh API wrapper with three publishing methods:

```typescript
const ntfy = new NtfyService("https://ntfy.sh")

// Simple text message
await ntfy.publishSimple("pi-clean-city-john", "Hello!")

// Full JSON options
await ntfy.publish({
  topic: "pi-clean-city-john",
  message: "Your report was updated",
  title: "Status Update",
  priority: 4,
  tags: ["warning"],
  click: "https://app.com/report/123",
})

// Headers-based (alternative)
await ntfy.publishWithHeaders("pi-clean-city-john", "Message text", { title: "Title", priority: 3 })
```

---

## File Structure

```
src/features/notifications/
├── types/
│   └── index.ts                        # TypeScript types
├── services/
│   └── NtfyService.ts                  # NTFY API wrapper
├── patterns/
│   ├── Factory/
│   │   └── NotificationFactory.ts      # Factory Pattern
│   ├── Observer/
│   │   └── NotificationEventEmitter.ts # Observer Pattern
│   └── Decorator/
│       └── NotificationDecorator.ts    # Decorator Pattern
├── pages/
│   └── NotificationGuidePage.tsx       # User guide UI
└── README.md                           # This file
```

---

## Testing

### Test Factory Pattern

```typescript
import { NotificationFactory } from "./patterns/Factory/NotificationFactory"

const notif = NotificationFactory.createCommentNotification({
  topic: "test-topic",
  reportId: "1",
  commenterName: "Test User",
  commentPreview: "Test comment",
  reportTitle: "Test Report",
})

console.assert(notif.title === "New Comment 💬")
console.assert(notif.priority === 3)
console.assert(notif.tags.includes("💬"))
```

### Test Observer Pattern

```typescript
import { NotificationEventEmitter } from "./patterns/Observer/NotificationEventEmitter"

const emitter = NotificationEventEmitter.getInstance()

let received = false
emitter.subscribe("report:commented", (payload) => {
  received = true
  console.log("Received:", payload)
})

await emitter.emit("report:commented", {
  reportId: "1",
  reportOwnerId: "2",
  reportOwnerUsername: "test",
  commenterId: "3",
  commenterName: "Test",
  commentPreview: "Hi",
  reportTitle: "Test",
})

console.assert(received === true)
```

### Test Decorator Pattern

```typescript
import { createDefaultDecoratorChain } from "./patterns/Decorator/NotificationDecorator"

const notification = {
  topic: "test",
  message: "Test message",
  priority: 4,
}

const decorated = createDefaultDecoratorChain().decorate(notification)

console.assert(decorated.decorations.urgencyLevel === "high")
console.assert(decorated.decorations.badges.includes("🟠"))
console.assert(decorated.decorations.categoryIcon !== undefined)
```

---

## Next Steps

1. **Singleton Pattern** - Create `NtfyServiceManager` for global configuration
2. **Strategy Pattern** - Multiple delivery methods (NTFY, Browser, Console)
3. **Repository Pattern** - Store notification history in Supabase
4. **Dependency Injection** - React Context for service injection
5. **Facade Pattern** - High-level API combining all patterns

---

## References

- [NTFY Documentation](https://docs.ntfy.sh)
- [Design Patterns Explained](../../docs/design-patterns-explained.md)
- [Notification Architecture](../../docs/notification-architecture.md)
