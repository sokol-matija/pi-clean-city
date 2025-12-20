/* 
    Ticket Service Context
    Provides dependecy injection for ITicketService
*/

import { createContext, useContext, type ReactNode } from "react"
import type { ITicketService } from "../services"
import { SupabaseTicketService } from "../services"

const TicketServiceContext = createContext<ITicketService | undefined>(undefined);

interface TicketServiceProviderProps {
    children: ReactNode;
    service?: ITicketService;
}

export function TicketServiceProvider({ children, service = new SupabaseTicketService()}: TicketServiceProviderProps) {
    return (
        <TicketServiceContext.Provider value={service}>
            {children}
        </TicketServiceContext.Provider>
    )
}

// Fast refresh: ignore non-component export warning for custom hook
// eslint-disable-next-line react-refresh/only-export-components
export function useTicketService(): ITicketService {
    const context = useContext(TicketServiceContext);
    if (!context) {
        throw new Error("useTicketService must be used within a TicketServiceProvider");
    }
    return context;
}   


