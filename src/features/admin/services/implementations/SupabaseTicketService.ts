import { supabase } from "@/lib/supabase";
import { Profile, Status } from "@/types/database.types";
import { ITicketService, TicketUpdatePayload } from "../interfaces/ITicketService";

export class SupabaseTicketService implements ITicketService {
    async updateTicket(ticketId: string, changes: TicketUpdatePayload): Promise<void> {
        const { error } = await supabase
            .from('report')
            .update(changes)
            .eq('id', ticketId);

        if (error) {
            console.error('Error updating ticket:', error);
            throw new Error(`Failed to update ticket: ${error.message}`);
        }
    }

    async getCityServices(): Promise<Profile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'cityservice')
            .order("username")

        if (error) {
            console.error('Error fetching city services:', error);
            throw new Error(`Failed to fetch city services: ${error.message}`);
        }

        return data as Profile[]
    }

    async getStatuses(): Promise<Status[]> {
        const { data, error } = await supabase
            .from("status")
            .select("*")
            .order("sort_order")

        if (error) {
            console.error("Error fetching statuses:", error)
            throw new Error(`Failed to fetch statuses: ${error.message}`)
        }

        return data as Status[]
    }
}