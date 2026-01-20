import { createContext, useContext, type ReactNode } from "react"
import type { ITicketService } from "../services"
import { SupabaseTicketService } from "../services"
import { LoggingTicketServiceDecorator } from "../services/decorators/TicketServiceDecorator"
import { useMemo } from "react"

const TicketServiceContext = createContext<ITicketService | undefined>(undefined)

interface TicketServiceProviderProps {
  readonly children: ReactNode
  readonly service?: ITicketService //STRATEGY: Allow injection of different service implementations
}

export function TicketServiceProvider({ children, service }: TicketServiceProviderProps) {
  const baseService = useMemo(() => service || new SupabaseTicketService(), [service])
  const decoratedService = useMemo(
    () => new LoggingTicketServiceDecorator(baseService),
    [baseService]
  )

  return (
    <TicketServiceContext.Provider value={decoratedService}>
      {children}
    </TicketServiceContext.Provider>
  )
}

export function useTicketService(): ITicketService {
  const context = useContext(TicketServiceContext)
  if (!context) {
    throw new Error("useTicketService must be used within a TicketServiceProvider")
  }
  return context // SINGLETON: Return the existing service instance for all components
}
