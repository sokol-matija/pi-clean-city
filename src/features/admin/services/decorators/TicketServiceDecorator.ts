import type { ITicketService, TicketUpdatePayload } from "../interfaces/ITicketService"
import type { Profile, Status } from "@/types/database.types"

// Decorator base class for TicketService
// Extends ITicketService and wraps another ITicketService instance
abstract class TicketServiceDecorator implements ITicketService {
  protected service: ITicketService

  constructor(service: ITicketService) {
    this.service = service
  }

  async updateTicket(ticketId: string, changes: TicketUpdatePayload): Promise<void> {
    return this.service.updateTicket(ticketId, changes)
  }

  async getCityServices(): Promise<Profile[]> {
    return this.service.getCityServices()
  }

  async getStatuses(): Promise<Status[]> {
    return this.service.getStatuses()
  }
}

export class LoggingTicketServiceDecorator extends TicketServiceDecorator {
  /**
   * Wraps updateTicket with logging
   */
  async updateTicket(ticketId: string, changes: TicketUpdatePayload): Promise<void> {
    console.log(`[TicketService] Updating ticket:  ${ticketId}`)
    console.log(`[TicketService] Changes: `, changes)

    const startTime = Date.now()

    try {
      // Call the original service method
      await this.service.updateTicket(ticketId, changes)

      const duration = Date.now() - startTime
      console.log(`[TicketService] Ticket ${ticketId} updated successfully in ${duration}ms`)
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(
        `[TicketService] Failed to update ticket ${ticketId} after ${duration}ms`,
        error
      )

      throw error
    }
  }

  /**
   * Wraps getCityServices with logging
   */
  async getCityServices(): Promise<Profile[]> {
    console.log(`[TicketService] Fetching city services`)
    const startTime = Date.now()

    try {
      // Call the original service method
      const result = await this.service.getCityServices()

      const duration = Date.now() - startTime
      console.log(`[TicketService] Fetched ${result.length} city services in ${duration}ms`)

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`[TicketService] Failed to fetch city services after ${duration}ms`, error)
      throw error
    }
  }

  // Wraps getStatuses with logging

  async getStatuses(): Promise<Status[]> {
    console.log(`[TicketService] Fetching statuses`)
    const startTime = Date.now()

    try {
      // Call the original service method
      const result = await this.service.getStatuses()

      const duration = Date.now() - startTime
      console.log(`[TicketService] Fetched ${result.length} statuses in ${duration}ms`)

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`[TicketService] Failed to fetch statuses after ${duration}ms`, error)
      throw error
    }
  }
}
