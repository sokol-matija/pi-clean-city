export interface TicketObserver {
  update(ticketId: string, changes: Record<string, unknown>): void
}

export class TicketSubject {
  private observers: TicketObserver[] = []

  // Subscribe an observer to ticket updates

  attach(observer: TicketObserver): void {
    const isExist = this.observers.includes(observer)
    if (isExist) {
      console.log("[TicketSubject] Observer already attached")
      return
    }

    this.observers.push(observer)
    console.log(`[TicketSubject] Observer attached.  Total observers: ${this.observers.length}`)
  }

  // Unsubscribe an observer from ticket updates

  detach(observer: TicketObserver): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex === -1) {
      console.log("[TicketSubject] Observer not found")
      return
    }

    this.observers.splice(observerIndex, 1)
    console.log(`[TicketSubject] Observer detached. Total observers: ${this.observers.length}`)
  }

  /**
   * Notify all observers of a ticket update
   */
  notify(ticketId: string, changes: Record<string, unknown>): void {
    console.log(
      `[TicketSubject] Notifying ${this.observers.length} observers about ticket ${ticketId}`
    )

    for (const observer of this.observers) {
      observer.update(ticketId, changes)
    }
  }
}

//Concrete Observer:  UI Refresh
//Refreshes the UI when ticket is updated

export class UIRefreshObserver implements TicketObserver {
  constructor(private refreshCallback: () => void) {}

  update(ticketId: string, changes: Record<string, unknown>): void {
    console.log(`[UIRefreshObserver] Ticket ${ticketId} updated, refreshing UI`)
    console.log(`[UIRefreshObserver] Changes: `, changes)

    this.refreshCallback()
  }
}

//Concrete Observer: Logger
// Logs ticket updates for debugging/auditing

export class LoggerObserver implements TicketObserver {
  update(ticketId: string, changes: Record<string, unknown>): void {
    const timestamp = new Date().toISOString()
    console.log(`[LoggerObserver] ${timestamp} - Ticket ${ticketId} updated`)
    console.log(`[LoggerObserver] Changes:`, changes)
  }
}

export const ticketSubject = new TicketSubject()
