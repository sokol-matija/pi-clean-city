/* 
    Ticket Service Interface
    SOLID Principle: DIP

    This interface defines operations for managing tickets
*/

import { Database, Profile, Status } from "@/types/database.types";

export type TicketUpdatePayload = Database["public"]["Tables"]["report"]["Update"]

export interface ITicketService {
    //update tickets with changes
    updateTicket(ticketId: string, changes: TicketUpdatePayload): Promise<void>

    //fetch all city service workers
    getCityServices(): Promise<Profile[]>

    //fetch all available statuses
    getStatuses(): Promise<Status[]>
}