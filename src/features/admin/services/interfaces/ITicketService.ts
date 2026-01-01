import { Database, Profile, Status } from "@/types/database.types"

export type TicketUpdatePayload = Database["public"]["Tables"]["report"]["Update"]

export interface ITicketService {
  updateTicket(ticketId: string, changes: TicketUpdatePayload): Promise<void>
  getCityServices(): Promise<Profile[]>
  getStatuses(): Promise<Status[]>
}
