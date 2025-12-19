/* 
    Ticket Service Interface
    SOLID Principle: DIP

    This interface defines operations for managing tickets
*/

import { Profile, Status } from "@/types/database.types";

export interface ITicketService {
    //update tickets with changes
    updateTicket(ticketId: string, changes: Record<string, any>): Promise<void>;

    //fetch all city service workers
    getCityServices(): Promise<Profile[]>

    //fetch all available statuses
    getStatuses(): Promise<Status[]>
}