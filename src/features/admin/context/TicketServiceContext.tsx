import { createContext, useContext, type ReactNode } from "react"
import type { ITicketService } from "../services"
import { SupabaseTicketService } from "../services"

const TicketServiceContext = createContext<ITicketService | undefined>(undefined)

interface TicketServiceProviderProps {
  children: ReactNode
  service?: ITicketService //STRATEGY: Allow injection of different service implementations
}

export function TicketServiceProvider({
  children,
  service = new SupabaseTicketService(),
}: TicketServiceProviderProps) {
  return <TicketServiceContext.Provider value={service}>{children}</TicketServiceContext.Provider>
}

export function useTicketService(): ITicketService {
  const context = useContext(TicketServiceContext)
  if (!context) {
    throw new Error("useTicketService must be used within a TicketServiceProvider")
  }
  return context // SINGLETON: Return the existing service instance for all components
}
