/* 
    Ticket Service Interface
    SOLID Principle: DIP

    This interface defines operations for managing tickets
*/

import { Profile, Status } from "@/types/database.types";

export interface TicketUpdatePayload {
    assigned_worker_id?: string | null
    priority?: string
    status_id?: number | null
}

export interface ITicketService {
    //update tickets with changes
    updateTicket(ticketId: string, changes: TicketUpdatePayload): Promise<void>

    //fetch all city service workers
    getCityServices(): Promise<Profile[]>

    //fetch all available statuses
    getStatuses(): Promise<Status[]>
}