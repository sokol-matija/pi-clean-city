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
    reportOwnerUsername: string
    commenterId: string
    commenterName: string
    commentPreview: string
    reportTitle: string
  }
  "report:status_changed": {
    reportId: string
    reportOwnerId: string
    reportOwnerUsername: string
    oldStatus: string
    newStatus: string
    reportTitle: string
    changedBy: string
  }
  "report:assigned": {
    reportId: string
    assigneeId: string
    assigneeUsername: string
    assigneeName: string
    reportTitle: string
    reportLocation: string
    assignedBy: string
  }
  "report:resolved": {
    reportId: string
    reportOwnerId: string
    reportOwnerUsername: string
    reportTitle: string
    resolvedBy: string
  }
  "user:mentioned": {
    mentionedUserId: string
    mentionedUsername: string
    mentionerName: string
    reportId: string
    context: string
  }
}

export type NotificationEventHandler<T extends NotificationEvent> = (
  payload: NotificationEventPayloads[T]
) => void | Promise<void>

export class NotificationEventEmitter {
  private static instance: NotificationEventEmitter
  private listeners: Map<NotificationEvent, Set<NotificationEventHandler<NotificationEvent>>> =
    new Map()

  private constructor() {
    console.log("[NotificationEventEmitter] Instance created")
  }

  public static getInstance(): NotificationEventEmitter {
    if (!NotificationEventEmitter.instance) {
      NotificationEventEmitter.instance = new NotificationEventEmitter()
    }
    return NotificationEventEmitter.instance
  }

  public subscribe<T extends NotificationEvent>(
    event: T,
    handler: NotificationEventHandler<T>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.add(handler as NotificationEventHandler<NotificationEvent>)
    }

    console.log(
      `[NotificationEventEmitter] Subscribed to ${event} (${this.getListenerCount(event)} listeners)`
    )

    return () => {
      this.listeners.get(event)?.delete(handler as NotificationEventHandler<NotificationEvent>)
      console.log(
        `[NotificationEventEmitter] Unsubscribed from ${event} (${this.getListenerCount(event)} listeners)`
      )
    }
  }

  public subscribeOnce<T extends NotificationEvent>(
    event: T,
    handler: NotificationEventHandler<T>
  ): void {
    const wrappedHandler = async (payload: NotificationEventPayloads[T]) => {
      await handler(payload)
      this.listeners
        .get(event)
        ?.delete(wrappedHandler as NotificationEventHandler<NotificationEvent>)
      console.log(`[NotificationEventEmitter] Auto-unsubscribed from ${event}`)
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.add(wrappedHandler as NotificationEventHandler<NotificationEvent>)
    }
    console.log(`[NotificationEventEmitter] Subscribed once to ${event}`)
  }

  public async emit<T extends NotificationEvent>(
    event: T,
    payload: NotificationEventPayloads[T]
  ): Promise<void> {
    const handlers = this.listeners.get(event)

    if (!handlers || handlers.size === 0) {
      console.warn(`[NotificationEventEmitter] No handlers for event: ${event}`)
      return
    }

    console.log(
      `[NotificationEventEmitter] Emitting ${event} to ${handlers.size} handler(s)`,
      payload
    )

    const promises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(payload)
      } catch (error) {
        console.error(`[NotificationEventEmitter] Handler error for ${event}:`, error)
      }
    })

    await Promise.all(promises)
  }

  public clearListeners(event?: NotificationEvent): void {
    if (event) {
      this.listeners.delete(event)
      console.log(`[NotificationEventEmitter] Cleared listeners for ${event}`)
    } else {
      this.listeners.clear()
      console.log("[NotificationEventEmitter] Cleared all listeners")
    }
  }

  public getListenerCount(event: NotificationEvent): number {
    return this.listeners.get(event)?.size || 0
  }

  public getActiveEvents(): NotificationEvent[] {
    return Array.from(this.listeners.keys())
  }
}

export const notificationEventEmitter = NotificationEventEmitter.getInstance()
