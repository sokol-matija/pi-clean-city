# Pi Network Notification Topics API Research

**Date:** 2026-01-03
**Project:** Pi Clean City
**Purpose:** Research Pi Network's notification topics API for implementing `pi-clean-city-<username>` pattern

---

## Executive Summary

After comprehensive research, **Pi Network does NOT currently provide a dedicated notification topics API with subscribe/publish functionality** (like MQTT or traditional pub/sub systems). The Pi Network Platform API focuses on:

1. **User Authentication** - Access token-based user verification
2. **Payment Operations** - Pi currency transactions
3. **Authorization** - API key and access token management

**Recommended Approach:** Implement notifications using **Supabase Realtime** (already integrated in the project) or **Firebase Cloud Messaging (FCM)** for push notifications.

---

## Part 1: Pi Network Platform API Analysis

### Official Documentation Sources

- **GitHub Repository:** [pi-apps/pi-platform-docs](https://github.com/pi-apps/pi-platform-docs)
- **Developer Portal:** [developers.minepi.com](https://developers.minepi.com/)
- **API Base URL:** `api.minepi.com/v2`
- **Community Guide:** [Pi App Platform APIs](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformAPIs/)

### Available API Endpoints

#### 1. Authentication Endpoint

```typescript
GET / me
// Retrieves user information with consented scopes
// Authorization: Bearer {access_token}
// Response: UserDTO
```

**UserDTO Structure:**

```typescript
{
  uid: string,
  credentials: {
    scopes: Scope[],
    valid_until: {
      timestamp: number,
      iso8601: string
    }
  },
  username?: string
}
```

#### 2. Payment Endpoints

**Create Server-Initiated Payment (A2U):**

```typescript
POST / payments
// Authorization: Server API Key
// Body: { payment: { amount, memo, metadata, uid } }
// Response: PaymentDTO
```

**Get Payment Details:**

```typescript
GET / payments / { payment_id }
// Authorization: Server API Key
// Response: PaymentDTO
```

**Approve Payment:**

```typescript
POST / payments / { payment_id } / approve
// Authorization: Server API Key
// Response: PaymentDTO
```

**Complete Payment:**

```typescript
POST / payments / { payment_id } / complete
// Authorization: Server API Key
// Body: { txid: string }
// Response: PaymentDTO
```

**Cancel Payment:**

```typescript
POST / payments / { payment_id } / cancel
// Authorization: Server API Key
// Response: PaymentDTO
```

**List Incomplete Payments:**

```typescript
GET / payments / incomplete_server_payments
// Authorization: Server API Key
// Response: { incomplete_server_payments: PaymentDTO[] }
```

#### 3. Ads Endpoint

```typescript
GET /ads_network/status/:adId
// Verifies rewarded ad completion
// Authorization: Server API Key
// Response: RewardedAdStatusDTO
```

### Authorization Mechanisms

Pi Network Platform API supports two authorization methods:

#### Method 1: User Access Token

- Obtained from `Pi.Authenticate()` function (Pi App Platform SDK)
- Used for user-specific resources (e.g., `/me` endpoint)
- Dynamic identifier for Pioneer verification
- Must be passed from frontend to backend for API calls

#### Method 2: Server API Key

- Obtained from Developer Portal
- Required for backend operations (payments, ads)
- Used for elevated permissions

### What's Missing: No Notification Topics API

The Pi Network Platform API **does not include**:

- Subscribe/publish to topics functionality
- Real-time messaging or notification channels
- WebSocket connections for live updates
- Push notification services
- Topic-based routing (like `pi-clean-city-<username>`)

---

## Part 2: Pi Network Messaging Features

### Pi Chat & Staked Direct Messages

Pi Network does have a messaging feature called **Staked Direct Messages**, but this is:

1. **User-to-User Messaging** - Not programmatic API access
2. **Requires Pi Staking** - Users stake Pi to send message requests
3. **Built into Pi Chat App** - Available in Pi Browser mobile app
4. **Not Available for Third-Party Apps** - Cannot be integrated into custom applications

**Source:** [Pi Network Staked DMs Announcement](https://minepi.com/blog/pi-staked-dms/)

### How Staked DMs Work

1. Pioneer stakes Pi to send a message request
2. If rejected: Requester forfeits staked Pi
3. If accepted: Requester reclaims staked Pi
4. Designed to prevent spam in direct messaging

**Note:** This is NOT an API for app developers; it's a feature within Pi Network's own apps.

---

## Part 3: Alternative Solutions for Notifications

Since Pi Network lacks a notification topics API, here are viable alternatives:

### Option 1: Supabase Realtime (Recommended)

**Why Recommended:**

- Already integrated in the project
- PostgreSQL-based real-time subscriptions
- No additional dependencies
- Secure with Row Level Security (RLS)

#### Implementation Pattern

**1. Enable Realtime on Tables**

```sql
-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

**2. Create Notifications Table**

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  topic VARCHAR(255) NOT NULL, -- e.g., 'pi-clean-city-john_doe'
  type VARCHAR(50) NOT NULL, -- 'comment', 'status_update', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional metadata
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Index for efficient topic filtering
  INDEX idx_notifications_topic ON notifications(topic),
  INDEX idx_notifications_user_id ON notifications(user_id, read)
);
```

**3. Apply RLS Policies**

```sql
-- Users can only read their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert notifications
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
```

**4. Subscribe to Notifications (Client-Side)**

```typescript
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export function useNotifications(username: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Subscribe to topic: pi-clean-city-{username}
    const topic = `pi-clean-city-${username}`

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `topic=eq.${topic}`,
        },
        (payload) => {
          console.log("New notification:", payload.new)
          setNotifications((prev) => [payload.new, ...prev])

          // Show browser notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(payload.new.title, {
              body: payload.new.message,
              icon: "/logo.png",
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [username])

  return notifications
}
```

**5. Publish Notifications (Server-Side/Database Function)**

```sql
-- Function to publish notification
CREATE OR REPLACE FUNCTION notify_user(
  p_user_id UUID,
  p_username VARCHAR,
  p_type VARCHAR,
  p_title VARCHAR,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, topic, type, title, message, data)
  VALUES (
    p_user_id,
    'pi-clean-city-' || p_username,
    p_type,
    p_title,
    p_message,
    p_data
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**6. Usage Example: Comment Notification**

```sql
-- Trigger on new comment
CREATE OR REPLACE FUNCTION notify_report_owner_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_report_owner_id UUID;
  v_report_owner_username VARCHAR;
  v_commenter_username VARCHAR;
BEGIN
  -- Get report owner details
  SELECT user_id, u.username
  INTO v_report_owner_id, v_report_owner_username
  FROM report r
  JOIN users u ON r.user_id = u.id
  WHERE r.id = NEW.report_id;

  -- Get commenter username
  SELECT username INTO v_commenter_username
  FROM users WHERE id = NEW.user_id;

  -- Send notification
  PERFORM notify_user(
    v_report_owner_id,
    v_report_owner_username,
    'comment',
    'New Comment on Your Report',
    v_commenter_username || ' commented on your report',
    jsonb_build_object(
      'report_id', NEW.report_id,
      'comment_id', NEW.id,
      'commenter', v_commenter_username
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_comment
  AFTER INSERT ON comment
  FOR EACH ROW
  EXECUTE FUNCTION notify_report_owner_on_comment();
```

**Performance Considerations:**

- Each change event checks if subscribed user has access
- For 100 users subscribed to a table with 1 insert = 100 reads
- Use filters to reduce overhead: `filter: 'topic=eq.pi-clean-city-john'`

**Documentation:**

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Subscribing to Database Changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes)
- [Building Real-time Notifications with Supabase](https://makerkit.dev/blog/tutorials/real-time-notifications-supabase-nextjs)

---

### Option 2: Firebase Cloud Messaging (FCM)

**Why Consider FCM:**

- Industry-standard push notification service
- Works when app is closed or in background
- Cross-platform (Web, Android, iOS)
- Free to use

#### Implementation Pattern

**1. Setup Firebase Project**

```bash
npm install firebase
```

**2. Initialize Firebase (Client-Side)**

```typescript
// src/lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export { messaging }
```

**3. Request Permission & Get Token**

```typescript
// src/hooks/usePushNotifications.ts
import { messaging } from "@/lib/firebase"
import { getToken } from "firebase/messaging"
import { supabase } from "@/lib/supabase"

export async function requestNotificationPermission(userId: string, username: string) {
  try {
    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      })

      // Store token in database with topic
      await supabase.from("notification_tokens").insert({
        user_id: userId,
        topic: `pi-clean-city-${username}`,
        token: token,
        platform: "web",
      })

      return token
    }
  } catch (error) {
    console.error("Error getting notification permission:", error)
  }
}
```

**4. Listen for Messages**

```typescript
import { onMessage } from "firebase/messaging"

onMessage(messaging, (payload) => {
  console.log("Message received:", payload)

  // Display notification
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  })
})
```

**5. Send Notifications (Server-Side)**

```typescript
// Backend API endpoint
import { initializeApp, cert } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"

initializeApp({
  credential: cert(serviceAccount),
})

async function sendNotificationToTopic(
  topic: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  const message = {
    notification: { title, body },
    data: data || {},
    topic: topic, // e.g., 'pi-clean-city-john_doe'
  }

  await getMessaging().send(message)
}

// Usage
await sendNotificationToTopic(
  "pi-clean-city-john_doe",
  "New Comment",
  "Someone commented on your report",
  { reportId: "123", commentId: "456" }
)
```

**Topic Pattern:**

- Subscribe users to topics: `pi-clean-city-{username}`
- Send to all users: `pi-clean-city-all`
- Category-specific: `pi-clean-city-municipal-workers`

**Documentation:**

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Complete Guide to Firebase Web Push](https://www.magicbell.com/blog/firebase-web-push-notifications)

---

### Option 3: Custom WebSocket Server

**When to Use:**

- Need full control over infrastructure
- Real-time bidirectional communication required
- Already have backend infrastructure

**Not Recommended Because:**

- Supabase Realtime already provides this
- Additional infrastructure complexity
- Extra costs and maintenance

---

## Part 4: Recommended Implementation Plan

### Phase 1: Supabase Realtime Notifications

**Goal:** Implement in-app real-time notifications using existing Supabase infrastructure

**Tasks:**

1. Create `notifications` table with RLS policies
2. Add database triggers for automatic notifications:
   - New comment on user's report
   - Status update on user's report
   - Report assigned to municipal worker
3. Implement `useNotifications` hook for real-time subscriptions
4. Create notification UI component (bell icon with badge)
5. Add notification center page/modal

**Notification Types:**

```typescript
type NotificationType =
  | "comment" // New comment on report
  | "status_update" // Report status changed
  | "assignment" // Report assigned to worker
  | "resolution" // Report resolved
  | "mention" // User mentioned in comment
```

**Topic Pattern:**

```
pi-clean-city-{username}  // User-specific
pi-clean-city-worker-{worker_id}  // Worker-specific
pi-clean-city-admin  // Admin broadcasts
```

### Phase 2: Browser Push Notifications (Optional Enhancement)

**Goal:** Send notifications even when app is closed

**Requirements:**

- User grants browser notification permission
- Service worker registered
- FCM or Web Push API integration

**Implementation:**

1. Request notification permission on login
2. Register service worker for background notifications
3. Store FCM tokens in database
4. Send push notifications for critical events only

---

## Part 5: Data Structures

### Notification Table Schema

```typescript
interface Notification {
  id: string // UUID
  user_id: string // UUID reference to auth.users
  topic: string // 'pi-clean-city-{username}'
  type: "comment" | "status_update" | "assignment" | "resolution" | "mention"
  title: string // 'New Comment on Your Report'
  message: string // 'John Doe commented: "This has been fixed"'
  data: {
    report_id?: string
    comment_id?: string
    actor_username?: string
    old_status?: string
    new_status?: string
    [key: string]: any
  }
  read: boolean
  created_at: string // ISO timestamp
}
```

### API Response Format

```typescript
interface NotificationResponse {
  notifications: Notification[]
  unread_count: number
  has_more: boolean
  next_cursor?: string
}
```

---

## Part 6: Security & Authorization

### Row Level Security (RLS) Policies

**Critical:** Users must only see their own notifications

```sql
-- SELECT: Users can only read their notifications
CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE: Users can mark own notifications as read
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete own notifications
CREATE POLICY "Users delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- INSERT: Only system/triggers can create notifications
CREATE POLICY "System creates notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
```

### Realtime Channel Authorization

```typescript
// Subscribe with user-specific filter
const subscription = supabase
  .channel("user-notifications")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${currentUser.id}`, // Only user's notifications
    },
    handleNotification
  )
  .subscribe()
```

---

## Part 7: Example Use Cases

### Use Case 1: Comment Notification

**Scenario:** User A creates a report. User B adds a comment.

**Flow:**

1. User B submits comment via API
2. Database trigger detects new comment
3. Trigger calls `notify_user()` function
4. Notification inserted into `notifications` table with topic `pi-clean-city-{userA_username}`
5. User A (if online) receives real-time update via Supabase subscription
6. Notification appears in User A's notification center

**Database Trigger:**

```sql
CREATE TRIGGER notify_comment
  AFTER INSERT ON comment
  FOR EACH ROW
  EXECUTE FUNCTION notify_report_owner_on_comment();
```

### Use Case 2: Status Update Notification

**Scenario:** Municipal worker changes report status from "Pending" to "In Progress"

**Flow:**

1. Worker updates report status
2. Database trigger detects status change
3. Notification sent to report owner: "Your report is now In Progress"
4. User receives real-time notification

**Database Trigger:**

```sql
CREATE TRIGGER notify_status_update
  AFTER UPDATE OF status_id ON report
  FOR EACH ROW
  WHEN (OLD.status_id IS DISTINCT FROM NEW.status_id)
  EXECUTE FUNCTION notify_status_change();
```

### Use Case 3: Assignment Notification

**Scenario:** Admin assigns report to municipal worker

**Flow:**

1. Admin assigns report to worker
2. Notification sent to worker: "New report assigned to you"
3. Worker receives notification on their device

---

## Part 8: Testing Strategy

### Unit Tests

```typescript
describe("Notification Service", () => {
  it("should create notification for comment", async () => {
    const result = await createCommentNotification({
      reportId: "report-123",
      commentId: "comment-456",
      actorUsername: "john_doe",
      recipientId: "user-789",
    })

    expect(result.topic).toBe("pi-clean-city-recipient_username")
    expect(result.type).toBe("comment")
  })

  it("should mark notification as read", async () => {
    await markNotificationAsRead("notification-123")
    const notification = await getNotification("notification-123")
    expect(notification.read).toBe(true)
  })
})
```

### Integration Tests

```typescript
describe("Realtime Notifications", () => {
  it("should receive notification in real-time", async () => {
    const received = new Promise((resolve) => {
      const subscription = supabase
        .channel("test-notifications")
        .on(
          "postgres_changes",
          {
            /* config */
          },
          resolve
        )
        .subscribe()
    })

    // Trigger notification
    await createNotification({
      /* data */
    })

    // Should resolve within 1 second
    await expect(received).resolves.toBeDefined()
  })
})
```

---

## Part 9: Migration Path

### Current State

- No notification system
- Landing page mentions notifications (line 96: "Stay informed with notifications...")

### Migration Steps

**Step 1: Database Setup**

```bash
# Create migration file
supabase migration new add_notifications
```

**Step 2: Implement Core Functionality**

- [ ] Create notifications table
- [ ] Add RLS policies
- [ ] Create notification functions
- [ ] Add database triggers

**Step 3: Client Integration**

- [ ] Create `useNotifications` hook
- [ ] Build notification UI components
- [ ] Add notification center page
- [ ] Integrate with existing features

**Step 4: Testing & Rollout**

- [ ] Write tests
- [ ] QA in development environment
- [ ] Enable for beta users
- [ ] Monitor performance and errors
- [ ] Full rollout

---

## Part 10: Performance Optimization

### Indexing Strategy

```sql
-- Fast lookups by user and read status
CREATE INDEX idx_notifications_user_read
  ON notifications(user_id, read, created_at DESC);

-- Fast topic-based queries
CREATE INDEX idx_notifications_topic
  ON notifications(topic);

-- Composite index for realtime filters
CREATE INDEX idx_notifications_realtime
  ON notifications(user_id, created_at DESC)
  WHERE read = false;
```

### Pagination

```typescript
async function getNotifications(userId: string, cursor?: string, limit = 20) {
  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (cursor) {
    query = query.lt("created_at", cursor)
  }

  return query
}
```

### Cleanup Old Notifications

```sql
-- Archive notifications older than 90 days
CREATE OR REPLACE FUNCTION archive_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND read = true;
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron extension
SELECT cron.schedule(
  'archive-notifications',
  '0 2 * * *', -- Daily at 2 AM
  'SELECT archive_old_notifications()'
);
```

---

## Summary & Conclusion

### Key Findings

1. **Pi Network Does NOT Provide Notification Topics API**
   - No subscribe/publish functionality
   - No WebSocket/real-time messaging
   - API focused on authentication and payments

2. **Recommended Solution: Supabase Realtime**
   - Already integrated in project
   - PostgreSQL-based real-time subscriptions
   - Secure with RLS
   - No additional costs

3. **Topic Pattern Implementation**
   - Use `pi-clean-city-{username}` as database field
   - Filter subscriptions by user_id for security
   - Database triggers for automatic notifications

4. **Notification Types to Support**
   - Comment notifications
   - Status update notifications
   - Assignment notifications (for workers)
   - Mention notifications

### Next Steps

1. Create database migration for notifications table
2. Implement database triggers for automatic notifications
3. Build `useNotifications` React hook
4. Create notification UI components
5. Add notification center to app
6. Consider FCM for background notifications (Phase 2)

### References

**Pi Network Documentation:**

- [Pi App Platform APIs](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformAPIs/)
- [Pi Network Platform API (GitHub)](https://github.com/pi-apps/pi-platform-docs/blob/master/platform_API.md)
- [Pi Staked Direct Messages](https://minepi.com/blog/pi-staked-dms/)

**Supabase Documentation:**

- [Supabase Realtime Guide](https://supabase.com/docs/guides/realtime)
- [Subscribing to Database Changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes)
- [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Building Real-time Notifications Tutorial](https://makerkit.dev/blog/tutorials/real-time-notifications-supabase-nextjs)

**Firebase Cloud Messaging:**

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Web Push Notifications Guide](https://www.magicbell.com/blog/firebase-web-push-notifications)

---

**Research Completed:** 2026-01-03
**Recommended Approach:** Supabase Realtime with database triggers
**Next Action:** Create database migration and implement notification system
