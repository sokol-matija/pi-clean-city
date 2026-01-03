# Notification System Architecture - Design Patterns Implementation

**Author:** Matija Sokol
**Date:** 2026-01-03
**Project:** Pi Clean City
**Feature Branch:** `feature/design-patterns-ms`
**Purpose:** Lab Assignment - Design Patterns Implementation using NTFY.sh

---

## Executive Summary

This document outlines the architecture for implementing a real-time notification system using **NTFY.sh** as the delivery mechanism, integrated with **all 7 design patterns** already implemented by the team (Singleton, Factory, Builder, Observer, Decorator, Strategy, Repository, Dependency Injection).

### Key Design Decisions

1. **Notification Service**: NTFY.sh for topic-based pub/sub notifications
2. **Topic Pattern**: `pi-clean-city-{username}` for user-specific notifications
3. **Event Types**: Comment notifications, status updates, assignment notifications
4. **Design Patterns**: All 7 patterns from team implementations + Facade for complex workflows

---

## Design Patterns Architecture

### Pattern Usage Overview

| Pattern                  | Purpose                                 | Implementation                                                           |
| ------------------------ | --------------------------------------- | ------------------------------------------------------------------------ |
| **Singleton**            | Single NTFY service instance            | `NtfyServiceManager` - global notification service                       |
| **Factory**              | Create different notification types     | `NotificationFactory` - create comment, status, assignment notifications |
| **Builder**              | Construct complex notifications         | `NotificationBuilder` - chainable API for notification options           |
| **Observer**             | Event-driven notification triggers      | `NotificationEventEmitter` - emit events when actions occur              |
| **Decorator**            | Enrich notifications with metadata      | `NotificationDecorator` - add priority, tags, actions                    |
| **Strategy**             | Different delivery strategies           | `NotificationStrategy` - NTFY, in-app, browser push                      |
| **Repository**           | Abstract notification history storage   | `NotificationRepository` - store/retrieve notification history           |
| **Dependency Injection** | Inject notification dependencies        | `NotificationContext` - provide services to components                   |
| **Facade**               | Simplify complex notification workflows | `NotificationFacade` - high-level API for sending notifications          |

---

## 1. Singleton Pattern - NTFY Service Manager

**Purpose:** Ensure single instance of NTFY service across the application

**File:** `src/features/notifications/patterns/Singleton/NtfyServiceManager.ts`

### Implementation

```typescript
/**
 * Singleton Pattern - NtfyServiceManager
 *
 * Ensures only one instance of the NTFY service exists
 * Manages configuration and provides global access point
 */
export class NtfyServiceManager {
  private static instance: NtfyServiceManager
  private ntfyService: NtfyService
  private config: NotificationConfig

  private constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_NTFY_BASE_URL || "https://ntfy.sh",
      authToken: import.meta.env.VITE_NTFY_AUTH_TOKEN,
      defaultPriority: 3,
      retryAttempts: 3,
      retryDelay: 1000,
      topicPrefix: "pi-clean-city",
    }

    this.ntfyService = new NtfyService(this.config.baseUrl, this.config.authToken)
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): NtfyServiceManager {
    if (!NtfyServiceManager.instance) {
      NtfyServiceManager.instance = new NtfyServiceManager()
    }
    return NtfyServiceManager.instance
  }

  /**
   * Get NTFY service
   */
  public getService(): NtfyService {
    return this.ntfyService
  }

  /**
   * Get configuration
   */
  public getConfig(): Readonly<NotificationConfig> {
    return { ...this.config }
  }

  /**
   * Update configuration (creates new config object)
   */
  public updateConfig(updates: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...updates }
    // Recreate service with new config if base URL or auth changed
    if (updates.baseUrl || updates.authToken) {
      this.ntfyService = new NtfyService(this.config.baseUrl, this.config.authToken)
    }
  }

  /**
   * Generate user topic
   */
  public getUserTopic(username: string): string {
    return `${this.config.topicPrefix}-${username}`
  }

  /**
   * Generate report topic
   */
  public getReportTopic(reportId: string): string {
    return `${this.config.topicPrefix}-report-${reportId}`
  }
}

// Export singleton instance getter
export const ntfyServiceManager = NtfyServiceManager.getInstance()
```

**Usage:**

```typescript
const manager = NtfyServiceManager.getInstance()
const service = manager.getService()
const topic = manager.getUserTopic("john_doe")
```

---

## 2. Factory Pattern - Notification Factory

**Purpose:** Create different types of notifications with consistent structure

**File:** `src/features/notifications/factories/NotificationFactory.ts`

### Implementation

```typescript
/**
 * Factory Pattern - NotificationFactory
 *
 * Creates different types of notifications for the application
 * Similar to BadgeFactory from ticketing feature
 */

export interface INotification {
  topic: string
  message: string
  title?: string
  priority?: NtfyPriority
  tags?: string[]
  click?: string
  actions?: NtfyAction[]
  icon?: string
}

export type NotificationType = "comment" | "status_update" | "assignment" | "resolution" | "mention"

export class NotificationFactory {
  /**
   * Create comment notification
   */
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
      tags: ["speech_balloon", "💬"],
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

  /**
   * Create status update notification
   */
  static createStatusUpdateNotification(params: {
    topic: string
    reportId: string
    oldStatus: string
    newStatus: string
    reportTitle: string
  }): INotification {
    const { emoji, color } = this.getStatusMetadata(params.newStatus)

    return {
      topic: params.topic,
      title: "Report Status Updated",
      message: `Status changed: ${params.oldStatus} → ${params.newStatus}`,
      priority: 4,
      tags: [emoji, color],
      click: `${window.location.origin}/reports/${params.reportId}`,
      icon: this.getStatusIcon(params.newStatus),
    }
  }

  /**
   * Create assignment notification
   */
  static createAssignmentNotification(params: {
    topic: string
    reportId: string
    assigneeName: string
    reportTitle: string
    reportLocation: string
  }): INotification {
    return {
      topic: params.topic,
      title: "New Assignment",
      message: `Assigned to ${params.assigneeName}: ${params.reportTitle}`,
      priority: 5,
      tags: ["person_raising_hand", "🔴"],
      click: `${window.location.origin}/reports/${params.reportId}`,
      actions: [
        {
          action: "view",
          label: "View Report",
          url: `${window.location.origin}/reports/${params.reportId}`,
        },
        {
          action: "view",
          label: "View Map",
          url: `${window.location.origin}/map?report=${params.reportId}`,
        },
      ],
    }
  }

  /**
   * Create resolution notification
   */
  static createResolutionNotification(params: {
    topic: string
    reportId: string
    reportTitle: string
    resolvedBy: string
  }): INotification {
    return {
      topic: params.topic,
      title: "Report Resolved ✅",
      message: `Your report "${params.reportTitle}" has been resolved by ${params.resolvedBy}`,
      priority: 4,
      tags: ["white_check_mark", "🟢"],
      click: `${window.location.origin}/reports/${params.reportId}`,
      icon: "✅",
    }
  }

  /**
   * Create mention notification
   */
  static createMentionNotification(params: {
    topic: string
    reportId: string
    mentionerName: string
    context: string
  }): INotification {
    return {
      topic: params.topic,
      title: "You were mentioned",
      message: `${params.mentionerName} mentioned you: "${params.context}"`,
      priority: 3,
      tags: ["at", "📢"],
      click: `${window.location.origin}/reports/${params.reportId}`,
    }
  }

  /**
   * Helper: Get status metadata
   */
  private static getStatusMetadata(status: string): { emoji: string; color: string } {
    const metadata: Record<string, { emoji: string; color: string }> = {
      pending: { emoji: "hourglass", color: "🟡" },
      in_progress: { emoji: "construction", color: "🔵" },
      resolved: { emoji: "white_check_mark", color: "🟢" },
      closed: { emoji: "lock", color: "⚫" },
    }
    return metadata[status.toLowerCase()] || { emoji: "info", color: "⚪" }
  }

  /**
   * Helper: Get status icon
   */
  private static getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      pending: "⏳",
      in_progress: "🚧",
      resolved: "✅",
      closed: "🔒",
    }
    return icons[status.toLowerCase()] || "ℹ️"
  }
}
```

**Usage:**

```typescript
const notification = NotificationFactory.createCommentNotification({
  topic: "pi-clean-city-john_doe",
  reportId: "123",
  commenterName: "Jane Smith",
  commentPreview: "This has been fixed!",
  reportTitle: "Garbage on Main Street",
})
```

---

## 3. Builder Pattern - Notification Builder

**Purpose:** Construct complex notifications step-by-step with chainable API

**File:** `src/features/notifications/patterns/Builder/NotificationBuilder.ts`

### Implementation

```typescript
/**
 * Builder Pattern - NotificationBuilder
 *
 * Provides chainable API for building complex notifications
 * Similar to PostValidator builder from community feature
 */
export class NotificationBuilder {
  private notification: Partial<INotification> = {}

  /**
   * Set topic (required)
   */
  setTopic(topic: string): this {
    this.notification.topic = topic
    return this
  }

  /**
   * Set message (required)
   */
  setMessage(message: string): this {
    this.notification.message = message
    return this
  }

  /**
   * Set title
   */
  setTitle(title: string): this {
    this.notification.title = title
    return this
  }

  /**
   * Set priority
   */
  setPriority(priority: NtfyPriority): this {
    this.notification.priority = priority
    return this
  }

  /**
   * Add tag
   */
  addTag(tag: string): this {
    if (!this.notification.tags) {
      this.notification.tags = []
    }
    this.notification.tags.push(tag)
    return this
  }

  /**
   * Add tags
   */
  addTags(tags: string[]): this {
    if (!this.notification.tags) {
      this.notification.tags = []
    }
    this.notification.tags.push(...tags)
    return this
  }

  /**
   * Set click URL
   */
  setClickUrl(url: string): this {
    this.notification.click = url
    return this
  }

  /**
   * Add action
   */
  addAction(action: NtfyAction): this {
    if (!this.notification.actions) {
      this.notification.actions = []
    }
    this.notification.actions.push(action)
    return this
  }

  /**
   * Set icon
   */
  setIcon(icon: string): this {
    this.notification.icon = icon
    return this
  }

  /**
   * Build and validate notification
   */
  build(): INotification {
    if (!this.notification.topic) {
      throw new Error("Notification must have a topic")
    }
    if (!this.notification.message) {
      throw new Error("Notification must have a message")
    }

    return this.notification as INotification
  }

  /**
   * Reset builder
   */
  reset(): this {
    this.notification = {}
    return this
  }
}

/**
 * Factory function for creating pre-configured builders
 */
export function createCommentNotificationBuilder(topic: string): NotificationBuilder {
  return new NotificationBuilder().setTopic(topic).setPriority(3).addTags(["speech_balloon", "💬"])
}

export function createUrgentNotificationBuilder(topic: string): NotificationBuilder {
  return new NotificationBuilder().setTopic(topic).setPriority(5).addTags(["warning", "🔴"])
}
```

**Usage:**

```typescript
const notification = new NotificationBuilder()
  .setTopic("pi-clean-city-john_doe")
  .setTitle("Critical Update")
  .setMessage("Your report requires immediate attention")
  .setPriority(5)
  .addTags(["warning", "🔴"])
  .addAction({
    action: "view",
    label: "View Now",
    url: "/reports/123",
  })
  .build()

// Or use pre-configured builder
const commentNotif = createCommentNotificationBuilder("pi-clean-city-john_doe")
  .setTitle("New Comment")
  .setMessage("Jane commented on your report")
  .build()
```

---

## 4. Observer Pattern - Notification Event Emitter

**Purpose:** Event-driven system for triggering notifications

**File:** `src/features/notifications/patterns/Observer/NotificationEventEmitter.ts`

### Implementation

```typescript
/**
 * Observer Pattern - NotificationEventEmitter
 *
 * Event-driven notification system
 * Based on PostEventEmitter from community feature
 */

export type NotificationEvent =
  | "report:commented"
  | "report:status_changed"
  | "report:assigned"
  | "report:resolved"
  | "user:mentioned"

export interface NotificationEventPayloads {
  "report:commented": {
    reportId: string
    reportOwnerId: string
    commenterId: string
    commenterName: string
    commentPreview: string
    reportTitle: string
  }
  "report:status_changed": {
    reportId: string
    reportOwnerId: string
    oldStatus: string
    newStatus: string
    reportTitle: string
    changedBy: string
  }
  "report:assigned": {
    reportId: string
    assigneeId: string
    assigneeName: string
    reportTitle: string
    reportLocation: string
    assignedBy: string
  }
  "report:resolved": {
    reportId: string
    reportOwnerId: string
    reportTitle: string
    resolvedBy: string
  }
  "user:mentioned": {
    mentionedUserId: string
    mentionerName: string
    reportId: string
    context: string
  }
}

export type NotificationEventHandler<T extends NotificationEvent> = (
  payload: NotificationEventPayloads[T]
) => void | Promise<void>

/**
 * Singleton event emitter for notifications
 */
export class NotificationEventEmitter {
  private static instance: NotificationEventEmitter
  private listeners: Map<NotificationEvent, Set<NotificationEventHandler<any>>> = new Map()

  private constructor() {}

  public static getInstance(): NotificationEventEmitter {
    if (!NotificationEventEmitter.instance) {
      NotificationEventEmitter.instance = new NotificationEventEmitter()
    }
    return NotificationEventEmitter.instance
  }

  /**
   * Subscribe to notification event
   */
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

  /**
   * Subscribe once (auto-unsubscribe after first call)
   */
  public subscribeOnce<T extends NotificationEvent>(
    event: T,
    handler: NotificationEventHandler<T>
  ): void {
    const wrappedHandler = async (payload: NotificationEventPayloads[T]) => {
      await handler(payload)
      this.listeners.get(event)?.delete(wrappedHandler)
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(wrappedHandler)
  }

  /**
   * Emit notification event
   */
  public async emit<T extends NotificationEvent>(
    event: T,
    payload: NotificationEventPayloads[T]
  ): Promise<void> {
    const handlers = this.listeners.get(event)
    if (!handlers || handlers.size === 0) {
      console.warn(`[NotificationEmitter] No handlers for event: ${event}`)
      return
    }

    console.log(`[NotificationEmitter] Emitting ${event}`, payload)

    const promises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(payload)
      } catch (error) {
        console.error(`[NotificationEmitter] Handler error for ${event}:`, error)
      }
    })

    await Promise.all(promises)
  }

  /**
   * Clear all listeners for an event
   */
  public clearListeners(event?: NotificationEvent): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }

  /**
   * Get listener count
   */
  public getListenerCount(event: NotificationEvent): number {
    return this.listeners.get(event)?.size || 0
  }
}

// Export singleton instance
export const notificationEventEmitter = NotificationEventEmitter.getInstance()
```

**Usage:**

```typescript
// Subscribe to events
const unsubscribe = notificationEventEmitter.subscribe("report:commented", async (payload) => {
  console.log("New comment:", payload)
  // Send notification
  await sendCommentNotification(payload)
})

// Emit event when comment is added
await notificationEventEmitter.emit("report:commented", {
  reportId: "123",
  reportOwnerId: "user-456",
  commenterId: "user-789",
  commenterName: "Jane Smith",
  commentPreview: "This looks fixed now!",
  reportTitle: "Garbage on Main Street",
})

// Cleanup
unsubscribe()
```

---

## 5. Decorator Pattern - Notification Decorator

**Purpose:** Enrich notifications with additional metadata and formatting

**File:** `src/features/notifications/patterns/Decorator/NotificationDecorator.ts`

### Implementation

```typescript
/**
 * Decorator Pattern - NotificationDecorator
 *
 * Adds additional properties to notifications without modifying core structure
 * Similar to PostDecorator from community feature
 */

export interface DecoratedNotification extends INotification {
  decorations: {
    priority: number
    urgencyLevel: "low" | "medium" | "high" | "critical"
    isRead: boolean
    timestamp: number
    category: NotificationType
    badges: string[]
  }
}

/**
 * Base decorator interface
 */
export interface INotificationDecorator {
  decorate(notification: INotification): DecoratedNotification
}

/**
 * Priority Decorator - Calculates urgency level
 */
export class PriorityNotificationDecorator implements INotificationDecorator {
  decorate(notification: INotification): DecoratedNotification {
    const urgencyLevel = this.calculateUrgency(notification.priority || 3)

    return {
      ...notification,
      decorations: {
        priority: notification.priority || 3,
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
    if (notification.message.includes("comment")) return "comment"
    if (notification.message.includes("status")) return "status_update"
    if (notification.message.includes("assigned")) return "assignment"
    if (notification.message.includes("resolved")) return "resolution"
    if (notification.message.includes("mentioned")) return "mention"
    return "comment"
  }

  private generateBadges(urgency: string): string[] {
    const badges: string[] = []
    if (urgency === "critical") badges.push("🔴", "URGENT")
    if (urgency === "high") badges.push("🟠", "HIGH")
    return badges
  }
}

/**
 * Timestamp Decorator - Adds human-readable timestamp
 */
export class TimestampNotificationDecorator implements INotificationDecorator {
  decorate(notification: DecoratedNotification): DecoratedNotification {
    const timeAgo = this.getTimeAgo(notification.decorations.timestamp)

    return {
      ...notification,
      decorations: {
        ...notification.decorations,
        timeAgo,
      } as any,
    }
  }

  private getTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
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
      } as any,
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

/**
 * Factory for creating decorator chains
 */
export function createDefaultDecoratorChain(): NotificationDecoratorChain {
  return new NotificationDecoratorChain()
    .addDecorator(new TimestampNotificationDecorator())
    .addDecorator(new CategoryIconDecorator())
}
```

**Usage:**

```typescript
const chain = createDefaultDecoratorChain()
const decorated = chain.decorate(notification)

console.log(decorated.decorations)
// {
//   priority: 4,
//   urgencyLevel: 'high',
//   isRead: false,
//   timestamp: 1704279600000,
//   category: 'comment',
//   badges: ['🟠', 'HIGH'],
//   timeAgo: '5m ago',
//   categoryIcon: '💬'
// }
```

---

## 6. Strategy Pattern - Notification Delivery Strategy

**Purpose:** Different delivery methods for notifications

**File:** `src/features/notifications/patterns/Strategy/NotificationStrategy.ts`

### Implementation

```typescript
/**
 * Strategy Pattern - NotificationStrategy
 *
 * Allows switching between different notification delivery methods
 * Similar to validation rules in PostValidator
 */

export interface INotificationDeliveryStrategy {
  deliver(notification: INotification): Promise<void>
  supportsFeature(feature: "actions" | "attachments" | "priority"): boolean
}

/**
 * NTFY Delivery Strategy - Send via NTFY.sh
 */
export class NtfyDeliveryStrategy implements INotificationDeliveryStrategy {
  constructor(private ntfyService: NtfyService) {}

  async deliver(notification: INotification): Promise<void> {
    await this.ntfyService.publish({
      topic: notification.topic,
      message: notification.message,
      title: notification.title,
      priority: notification.priority,
      tags: notification.tags,
      click: notification.click,
      actions: notification.actions,
      icon: notification.icon,
    })
  }

  supportsFeature(feature: "actions" | "attachments" | "priority"): boolean {
    return true // NTFY supports all features
  }
}

/**
 * Browser Notification Strategy - Use Web Notifications API
 */
export class BrowserNotificationStrategy implements INotificationDeliveryStrategy {
  async deliver(notification: INotification): Promise<void> {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title || "Notification", {
        body: notification.message,
        icon: notification.icon,
        tag: notification.topic,
        data: { click: notification.click },
      })
    }
  }

  supportsFeature(feature: "actions" | "attachments" | "priority"): boolean {
    // Browser notifications have limited support
    return feature === "priority"
  }
}

/**
 * Console Logger Strategy - Log to console (for testing)
 */
export class ConsoleLoggerStrategy implements INotificationDeliveryStrategy {
  async deliver(notification: INotification): Promise<void> {
    console.log("[NOTIFICATION]", {
      topic: notification.topic,
      title: notification.title,
      message: notification.message,
    })
  }

  supportsFeature(): boolean {
    return true // Console supports logging everything
  }
}

/**
 * Multi-Strategy - Deliver via multiple channels
 */
export class MultiDeliveryStrategy implements INotificationDeliveryStrategy {
  constructor(private strategies: INotificationDeliveryStrategy[]) {}

  async deliver(notification: INotification): Promise<void> {
    await Promise.all(this.strategies.map((strategy) => strategy.deliver(notification)))
  }

  supportsFeature(feature: "actions" | "attachments" | "priority"): boolean {
    return this.strategies.some((s) => s.supportsFeature(feature))
  }
}

/**
 * Notification Delivery Context
 */
export class NotificationDeliveryContext {
  constructor(private strategy: INotificationDeliveryStrategy) {}

  setStrategy(strategy: INotificationDeliveryStrategy): void {
    this.strategy = strategy
  }

  async send(notification: INotification): Promise<void> {
    await this.strategy.deliver(notification)
  }

  supportsFeature(feature: "actions" | "attachments" | "priority"): boolean {
    return this.strategy.supportsFeature(feature)
  }
}
```

**Usage:**

```typescript
// Single strategy
const ntfyStrategy = new NtfyDeliveryStrategy(ntfyService)
const context = new NotificationDeliveryContext(ntfyStrategy)
await context.send(notification)

// Multi-channel delivery
const multiStrategy = new MultiDeliveryStrategy([
  new NtfyDeliveryStrategy(ntfyService),
  new BrowserNotificationStrategy(),
])
const context = new NotificationDeliveryContext(multiStrategy)
await context.send(notification)

// Switch strategy at runtime
context.setStrategy(new ConsoleLoggerStrategy())
await context.send(notification) // Now logs to console
```

---

## 7. Repository Pattern - Notification History Repository

**Purpose:** Abstract notification history storage and retrieval

**File:** `src/features/notifications/repositories/INotificationRepository.ts`

### Implementation

```typescript
/**
 * Repository Pattern - NotificationRepository
 *
 * Abstracts notification history storage
 * Based on ReportRepository from reports feature
 */

export interface NotificationHistoryRecord {
  id: string
  user_id: string
  topic: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  read_at: string | null
  created_at: string
}

export interface INotificationRepository {
  create(
    record: Omit<NotificationHistoryRecord, "id" | "created_at">
  ): Promise<NotificationHistoryRecord>
  findById(id: string): Promise<NotificationHistoryRecord | null>
  findByUserId(userId: string, filters?: NotificationFilters): Promise<NotificationHistoryRecord[]>
  markAsRead(id: string): Promise<void>
  markAllAsRead(userId: string): Promise<void>
  delete(id: string): Promise<void>
  getUnreadCount(userId: string): Promise<number>
}

export interface NotificationFilters {
  type?: NotificationType
  read?: boolean
  limit?: number
  offset?: number
  orderBy?: "created_at" | "read_at"
  orderDirection?: "asc" | "desc"
}

/**
 * Supabase implementation
 */
export class SupabaseNotificationRepository implements INotificationRepository {
  async create(
    record: Omit<NotificationHistoryRecord, "id" | "created_at">
  ): Promise<NotificationHistoryRecord> {
    const { data, error } = await supabase
      .from("notification_history")
      .insert(record)
      .select()
      .single()

    if (error) throw new Error(`Failed to create notification: ${error.message}`)
    return data
  }

  async findById(id: string): Promise<NotificationHistoryRecord | null> {
    const { data, error } = await supabase
      .from("notification_history")
      .select("*")
      .eq("id", id)
      .single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to find notification: ${error.message}`)
    }
    return data
  }

  async findByUserId(
    userId: string,
    filters?: NotificationFilters
  ): Promise<NotificationHistoryRecord[]> {
    let query = supabase
      .from("notification_history")
      .select("*")
      .eq("user_id", userId)
      .order(filters?.orderBy || "created_at", {
        ascending: filters?.orderDirection === "asc",
      })

    if (filters?.type) {
      query = query.eq("type", filters.type)
    }

    if (filters?.read !== undefined) {
      query = query.eq("read", filters.read)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query
    if (error) throw new Error(`Failed to fetch notifications: ${error.message}`)
    return data || []
  }

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from("notification_history")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw new Error(`Failed to mark as read: ${error.message}`)
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from("notification_history")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) throw new Error(`Failed to mark all as read: ${error.message}`)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("notification_history").delete().eq("id", id)

    if (error) throw new Error(`Failed to delete notification: ${error.message}`)
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("notification_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) throw new Error(`Failed to get unread count: ${error.message}`)
    return count || 0
  }
}

/**
 * Factory function
 */
export function createNotificationRepository(): INotificationRepository {
  return new SupabaseNotificationRepository()
}
```

---

## 8. Dependency Injection Pattern - Notification Context

**Purpose:** Provide notification services to React components

**File:** `src/features/notifications/context/NotificationContext.tsx`

### Implementation

```typescript
/**
 * Dependency Injection Pattern - NotificationContext
 *
 * Provides notification services to components
 * Based on RepositoryContext from reports feature
 */

export interface NotificationContextValue {
  ntfyService: NtfyService;
  notificationRepository: INotificationRepository;
  deliveryStrategy: INotificationDeliveryStrategy;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  ntfyService?: NtfyService;
  notificationRepository?: INotificationRepository;
  deliveryStrategy?: INotificationDeliveryStrategy;
}

export function NotificationProvider({
  children,
  ntfyService,
  notificationRepository,
  deliveryStrategy,
}: NotificationProviderProps) {
  const value = useMemo<NotificationContextValue>(
    () => ({
      ntfyService: ntfyService ?? ntfyServiceManager.getService(),
      notificationRepository: notificationRepository ?? createNotificationRepository(),
      deliveryStrategy: deliveryStrategy ?? new NtfyDeliveryStrategy(ntfyServiceManager.getService()),
    }),
    [ntfyService, notificationRepository, deliveryStrategy]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hooks to access injected services
 */
export function useNtfyService(): NtfyService {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNtfyService must be used within NotificationProvider');
  }
  return context.ntfyService;
}

export function useNotificationRepository(): INotificationRepository {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationRepository must be used within NotificationProvider');
  }
  return context.notificationRepository;
}

export function useNotificationDelivery(): INotificationDeliveryStrategy {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationDelivery must be used within NotificationProvider');
  }
  return context.deliveryStrategy;
}
```

**Usage:**

```typescript
// In App.tsx
<NotificationProvider>
  <YourApp />
</NotificationProvider>

// In any component
function MyComponent() {
  const ntfyService = useNtfyService();
  const repository = useNotificationRepository();

  // Use services...
}
```

---

## 9. Facade Pattern - Notification Facade

**Purpose:** Simplify complex notification workflows

**File:** `src/features/notifications/facades/NotificationFacade.ts`

### Implementation

```typescript
/**
 * Facade Pattern - NotificationFacade
 *
 * Provides high-level API for sending notifications
 * Orchestrates multiple patterns together
 */

export class NotificationFacade {
  constructor(
    private eventEmitter: NotificationEventEmitter,
    private deliveryStrategy: INotificationDeliveryStrategy,
    private repository: INotificationRepository,
    private decoratorChain: NotificationDecoratorChain
  ) {}

  /**
   * Send comment notification (high-level API)
   */
  async sendCommentNotification(params: {
    reportId: string
    reportOwnerId: string
    reportOwnerUsername: string
    commenterId: string
    commenterName: string
    commentPreview: string
    reportTitle: string
  }): Promise<void> {
    // 1. Generate topic
    const topic = ntfyServiceManager.getUserTopic(params.reportOwnerUsername)

    // 2. Create notification via Factory
    const notification = NotificationFactory.createCommentNotification({
      topic,
      reportId: params.reportId,
      commenterName: params.commenterName,
      commentPreview: params.commentPreview,
      reportTitle: params.reportTitle,
    })

    // 3. Decorate notification
    const decorated = this.decoratorChain.decorate(notification)

    // 4. Deliver notification via Strategy
    await this.deliveryStrategy.deliver(notification)

    // 5. Save to history via Repository
    await this.repository.create({
      user_id: params.reportOwnerId,
      topic,
      type: "comment",
      title: notification.title || "",
      message: notification.message,
      data: {
        reportId: params.reportId,
        commenterId: params.commenterId,
        commenterName: params.commenterName,
      },
      read: false,
      read_at: null,
    })

    // 6. Emit event via Observer
    await this.eventEmitter.emit("report:commented", {
      reportId: params.reportId,
      reportOwnerId: params.reportOwnerId,
      commenterId: params.commenterId,
      commenterName: params.commenterName,
      commentPreview: params.commentPreview,
      reportTitle: params.reportTitle,
    })
  }

  /**
   * Send status update notification
   */
  async sendStatusUpdateNotification(params: {
    reportId: string
    reportOwnerId: string
    reportOwnerUsername: string
    oldStatus: string
    newStatus: string
    reportTitle: string
    changedBy: string
  }): Promise<void> {
    const topic = ntfyServiceManager.getUserTopic(params.reportOwnerUsername)

    const notification = NotificationFactory.createStatusUpdateNotification({
      topic,
      reportId: params.reportId,
      oldStatus: params.oldStatus,
      newStatus: params.newStatus,
      reportTitle: params.reportTitle,
    })

    await this.deliveryStrategy.deliver(notification)

    await this.repository.create({
      user_id: params.reportOwnerId,
      topic,
      type: "status_update",
      title: notification.title || "",
      message: notification.message,
      data: {
        reportId: params.reportId,
        oldStatus: params.oldStatus,
        newStatus: params.newStatus,
      },
      read: false,
      read_at: null,
    })

    await this.eventEmitter.emit("report:status_changed", {
      reportId: params.reportId,
      reportOwnerId: params.reportOwnerId,
      oldStatus: params.oldStatus,
      newStatus: params.newStatus,
      reportTitle: params.reportTitle,
      changedBy: params.changedBy,
    })
  }

  /**
   * Send assignment notification
   */
  async sendAssignmentNotification(params: {
    reportId: string
    assigneeId: string
    assigneeUsername: string
    assigneeName: string
    reportTitle: string
    reportLocation: string
    assignedBy: string
  }): Promise<void> {
    const topic = ntfyServiceManager.getUserTopic(params.assigneeUsername)

    const notification = NotificationFactory.createAssignmentNotification({
      topic,
      reportId: params.reportId,
      assigneeName: params.assigneeName,
      reportTitle: params.reportTitle,
      reportLocation: params.reportLocation,
    })

    await this.deliveryStrategy.deliver(notification)

    await this.repository.create({
      user_id: params.assigneeId,
      topic,
      type: "assignment",
      title: notification.title || "",
      message: notification.message,
      data: {
        reportId: params.reportId,
        assignedBy: params.assignedBy,
      },
      read: false,
      read_at: null,
    })

    await this.eventEmitter.emit("report:assigned", {
      reportId: params.reportId,
      assigneeId: params.assigneeId,
      assigneeName: params.assigneeName,
      reportTitle: params.reportTitle,
      reportLocation: params.reportLocation,
      assignedBy: params.assignedBy,
    })
  }
}

/**
 * Factory for creating NotificationFacade
 */
export function createNotificationFacade(): NotificationFacade {
  return new NotificationFacade(
    notificationEventEmitter,
    new NtfyDeliveryStrategy(ntfyServiceManager.getService()),
    createNotificationRepository(),
    createDefaultDecoratorChain()
  )
}
```

**Usage (Simplified):**

```typescript
const facade = createNotificationFacade()

// One line to send complete notification!
await facade.sendCommentNotification({
  reportId: "123",
  reportOwnerId: "user-456",
  reportOwnerUsername: "john_doe",
  commenterId: "user-789",
  commenterName: "Jane Smith",
  commentPreview: "This is fixed!",
  reportTitle: "Garbage on Main Street",
})
```

---

## Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
│  (Header, NotificationCenter, ReportDetails, etc.)          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              Dependency Injection Layer                      │
│           NotificationContext (Provider/Hooks)               │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│   Facade     │ │ Observer │ │  Repository  │
│  (Simple     │ │ (Events) │ │  (Storage)   │
│   API)       │ └──────────┘ └──────────────┘
└──────┬───────┘
       │
       ↓ (Orchestrates)
┌─────────────────────────────────────────┐
│  Factory → Builder → Decorator          │
│  (Create) (Build)   (Enrich)           │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│       Strategy (Delivery Method)        │
│  NTFY / Browser / Console / Multi       │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│        Singleton (NTFY Service)         │
│    NtfyServiceManager.getInstance()     │
└─────────────┬───────────────────────────┘
              │
              ↓
     [NTFY.sh Server]
              │
              ↓
     [User's Device]
```

---

## Database Migration

```sql
-- Create notification_history table
CREATE TABLE notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('comment', 'status_update', 'assignment', 'resolution', 'mention')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes for performance
  INDEX idx_notification_history_user_id ON notification_history(user_id, created_at DESC),
  INDEX idx_notification_history_unread ON notification_history(user_id, read) WHERE read = FALSE,
  INDEX idx_notification_history_topic ON notification_history(topic)
);

-- RLS Policies
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notification_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notification_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notification_history FOR INSERT
  WITH CHECK (true);

-- Database function to send notification
CREATE OR REPLACE FUNCTION send_notification(
  p_user_id UUID,
  p_username VARCHAR,
  p_type VARCHAR,
  p_title VARCHAR,
  p_message TEXT,
  p_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_topic VARCHAR;
BEGIN
  v_topic := 'pi-clean-city-' || p_username;

  INSERT INTO notification_history (user_id, topic, type, title, message, data)
  VALUES (p_user_id, v_topic, p_type, p_title, p_message, p_data)
  RETURNING id INTO v_notification_id;

  -- TODO: Trigger HTTP POST to NTFY.sh via pg_net or external service

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Implementation Plan

### Phase 1: Core Patterns (Days 1-2)

- ✅ Singleton: NtfyServiceManager
- ✅ Factory: NotificationFactory
- ✅ Builder: NotificationBuilder
- ✅ Observer: NotificationEventEmitter

### Phase 2: Enhancement Patterns (Days 3-4)

- ✅ Decorator: NotificationDecorator
- ✅ Strategy: NotificationDeliveryStrategy
- ✅ Repository: NotificationRepository
- ✅ Dependency Injection: NotificationContext

### Phase 3: Orchestration (Day 5)

- ✅ Facade: NotificationFacade
- ✅ React Hooks: useNtfySubscription, useNotify
- ✅ UI Components: NotificationCenter

### Phase 4: Integration (Days 6-7)

- Database migration
- Integrate with existing features (comments, status updates)
- Testing and documentation

---

## Next Steps

1. **Create branch**: `feature/design-patterns-ms`
2. **Implement patterns** in order (Singleton → Factory → Builder → Observer → Decorator → Strategy → Repository → DI → Facade)
3. **Document each pattern** in `docs/design-patterns-explained.md`
4. **Write tests** for each pattern
5. **Create PR** with comprehensive examples

---

**Ready to implement?** Let's start with creating the branch and implementing the Singleton pattern first.
