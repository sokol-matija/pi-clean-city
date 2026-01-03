# Design Patterns Quick Summary

**Pi Clean City Notification System**

---

## Pattern #1: Factory Pattern

**Purpose:** Create different types of notifications

**Example:**

```typescript
NotificationFactory.createCommentNotification({
  topic: "pi-clean-city-john",
  commenterName: "Jane",
  commentPreview: "Great work!",
  reportTitle: "Street Light",
})
```

**Types:** Comment, Status Update, Assignment, Resolution, Mention

---

## Pattern #2: Observer Pattern

**Purpose:** Event-driven notification system

**Example:**

```typescript
// Subscribe
emitter.subscribe("report:commented", async (data) => {
  await sendNotification(data)
})

// Emit
emitter.emit("report:commented", {
  reportId, commenterName, ...
})
```

**Events:** commented, status_changed, assigned, resolved, mentioned

---

## Pattern #3: Singleton Pattern

**Purpose:** Single event emitter instance

**Example:**

```typescript
const emitter = NotificationEventEmitter.getInstance()
// Always returns the same instance
```

**Why:** Consistent state, prevent conflicts, memory efficient

---

## Pattern #4: Decorator Pattern

**Purpose:** Add features to notifications dynamically

**Example:**

```typescript
const decorated = chain
  .addDecorator(new TimestampDecorator())
  .addDecorator(new CategoryIconDecorator())
  .decorate(notification)

// Adds: timestamp, urgency, badges, icons, etc.
```

**Decorators:** Priority, Timestamp, Category Icons

---

## Real Implementation

**File:** `src/features/reports/hooks/useAddComment.ts`

```typescript
// 1. Create notification (Factory)
const notification = NotificationFactory.createCommentNotification({...})

// 2. Send notification
await ntfyService.publish(notification)

// Result: User gets push notification on their phone!
```

---

## Key Stats

- **4 Patterns**: Factory, Observer, Singleton, Decorator
- **5 Notification Types**: Comment, Status, Assignment, Resolution, Mention
- **3 Decorators**: Priority, Timestamp, Icons
- **1 Working Feature**: Comment notifications live in production
- **100% Type-Safe**: Full TypeScript support

---

## What Users See

1. Go to Notifications page
2. Copy their topic: `pi-clean-city-username`
3. Subscribe in NTFY app
4. Get push notifications when:
   - Someone comments on their report
   - Report status changes
   - Report is resolved
   - They're mentioned

---

## Next Steps

- Implement remaining notification types
- Add notification history UI
- Add in-app notification bell
- User preferences (mute/unmute)
