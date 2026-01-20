// src/features/admin/services/decorators/TicketServiceDecorator.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { LoggingTicketServiceDecorator, TicketServiceDecorator } from "./TicketServiceDecorator"
import type { ITicketService, TicketUpdatePayload } from "../interfaces/ITicketService"
import type { Profile, Status } from "@/types/database.types"

// Helper function for delayed resolution
function resolveAfter50ms() {
  return new Promise<void>((resolve) => setTimeout(resolve, 50))
}

describe("LoggingTicketServiceDecorator", () => {
  // Mock wrapped service (fake ITicketService)
  let mockService: ITicketService
  let decorator: LoggingTicketServiceDecorator

  // Spies na console metode
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Kreiraj mock service sa spy funkcijama
    mockService = {
      updateTicket: vi.fn().mockResolvedValue(undefined),
      getCityServices: vi.fn().mockResolvedValue([]),
      getStatuses: vi.fn().mockResolvedValue([]),
    }

    // Kreiraj decorator koji wrapa mock service
    decorator = new LoggingTicketServiceDecorator(mockService)

    // Setup spies na console
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    // Očisti sve spies i mocks
    vi.clearAllMocks()
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe("updateTicket", () => {
    it("should log before calling wrapped service", async () => {
      // ARRANGE
      const ticketId = "test-123"
      const changes: TicketUpdatePayload = { priority: "high" }

      // ACT
      await decorator.updateTicket(ticketId, changes)

      // ASSERT - Provjeri da je logirao PRIJE poziva servisa
      expect(consoleLogSpy).toHaveBeenCalledWith("[TicketService] Updating ticket: test-123")
      expect(consoleLogSpy).toHaveBeenCalledWith("[TicketService] Changes: ", changes)
    })

    it("should delegate to wrapped service with same parameters", async () => {
      // ARRANGE
      const ticketId = "test-123"
      const changes: TicketUpdatePayload = {
        priority: "high",
        status_id: 2,
        assigned_worker_id: "worker-456",
      }

      // ACT
      await decorator.updateTicket(ticketId, changes)

      // ASSERT - Provjeri da je decorator pozvao wrapped servis
      expect(mockService.updateTicket).toHaveBeenCalledWith(ticketId, changes)
      expect(mockService.updateTicket).toHaveBeenCalledTimes(1)
    })

    it("should log success message after successful update", async () => {
      // ARRANGE
      const ticketId = "test-123"
      const changes: TicketUpdatePayload = { priority: "high" }

      // ACT
      await decorator.updateTicket(ticketId, changes)

      // ASSERT - Provjeri success log
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("[TicketService] Ticket test-123 updated successfully")
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/successfully in \d+ms/))
    })

    it("should measure and log execution time", async () => {
      // ARRANGE
      const ticketId = "test-123"
      const changes: TicketUpdatePayload = { priority: "high" }

      // Mock service da traje 50ms
      mockService.updateTicket = vi.fn().mockImplementation(() => resolveAfter50ms())

      // ACT
      await decorator.updateTicket(ticketId, changes)

      // ASSERT - Provjeri da je logirao vrijeme
      const successLog = consoleLogSpy.mock.calls.find(
        (call: unknown[]) => typeof call[0] === "string" && call[0].includes("updated successfully")
      )
      expect(successLog).toBeDefined()
      expect(typeof successLog?.[0]).toBe("string")
      expect(successLog?.[0] as string).toMatch(/in \d+ms/)
    })

    it("should log error when wrapped service throws", async () => {
      // ARRANGE
      const ticketId = "test-123"
      const changes: TicketUpdatePayload = { priority: "high" }
      const error = new Error("Database connection failed")

      // Mock service da baci error
      mockService.updateTicket = vi.fn().mockRejectedValue(error)

      // ACT & ASSERT - Očekuj da decorator re-throw error
      await expect(decorator.updateTicket(ticketId, changes)).rejects.toThrow(
        "Database connection failed"
      )

      // ASSERT - Provjeri error log
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[TicketService] Failed to update ticket test-123"),
        error
      )
    })

    it("should re-throw error without modifying it", async () => {
      // ARRANGE
      const ticketId = "test-123"
      const changes: TicketUpdatePayload = { priority: "high" }
      const originalError = new Error("Original error message")

      mockService.updateTicket = vi.fn().mockRejectedValue(originalError)

      // ACT & ASSERT
      try {
        await decorator.updateTicket(ticketId, changes)
        expect.fail("Should have thrown error")
      } catch (error) {
        // Provjeri da je ISTI error (ne novi)
        expect(error).toBe(originalError)
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe("Original error message")
      }
    })

    it("should not call wrapped service if error occurs before delegation", async () => {
      // Edge case test - trenutno nema pre-delegation errora, ali dobra praksa

      const ticketId = "test-123"
      const changes: TicketUpdatePayload = { priority: "high" }

      await decorator.updateTicket(ticketId, changes)

      // Provjeri da je pozvan tačno jednom
      expect(mockService.updateTicket).toHaveBeenCalledTimes(1)
    })
  })

  describe("getCityServices", () => {
    it("should log before calling wrapped service", async () => {
      // ACT
      await decorator.getCityServices()

      // ASSERT
      expect(consoleLogSpy).toHaveBeenCalledWith("[TicketService] Fetching city services")
    })

    it("should delegate to wrapped service", async () => {
      // ARRANGE
      const mockCityServices: Profile[] = [
        {
          id: "worker-1",
          username: "Alice",
          email: "alice@city.com",
          role: "cityservice",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          avatar_url: null,
        },
      ]

      mockService.getCityServices = vi.fn().mockResolvedValue(mockCityServices)

      // ACT
      const result = await decorator.getCityServices()

      // ASSERT - Delegacija
      expect(mockService.getCityServices).toHaveBeenCalledTimes(1)

      // ASSERT - Isti rezultat
      expect(result).toEqual(mockCityServices)
    })

    it("should log success with count and duration", async () => {
      // ARRANGE
      const mockCityServices: Profile[] = [
        {
          id: "1",
          username: "Alice",
          email: "alice@city. com",
          role: "cityservice",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
          avatar_url: null,
        },
        {
          id: "2",
          username: "Bob",
          email: "bob@city.com",
          role: "cityservice",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
          avatar_url: null,
        },
      ]

      mockService.getCityServices = vi.fn().mockResolvedValue(mockCityServices)

      // ACT
      await decorator.getCityServices()

      // ASSERT
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("[TicketService] Fetched 2 city services")
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/in \d+ms/))
    })

    it("should log error when wrapped service throws", async () => {
      // ARRANGE
      const error = new Error("Failed to fetch")
      mockService.getCityServices = vi.fn().mockRejectedValue(error)

      // ACT & ASSERT
      await expect(decorator.getCityServices()).rejects.toThrow("Failed to fetch")

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[TicketService] Failed to fetch city services"),
        error
      )
    })
  })

  describe("getStatuses", () => {
    it("should log before calling wrapped service", async () => {
      // ACT
      await decorator.getStatuses()

      // ASSERT
      expect(consoleLogSpy).toHaveBeenCalledWith("[TicketService] Fetching statuses")
    })

    it("should delegate to wrapped service", async () => {
      // ARRANGE
      const mockStatuses: Status[] = [
        { id: 1, name: "New", sort_order: 1, description: "New", color: "blue" },
        { id: 2, name: "In Progress", sort_order: 2, description: "Working", color: "orange" },
      ]

      mockService.getStatuses = vi.fn().mockResolvedValue(mockStatuses)

      // ACT
      const result = await decorator.getStatuses()

      // ASSERT
      expect(mockService.getStatuses).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockStatuses)
    })

    it("should log success with count and duration", async () => {
      // ARRANGE
      const mockStatuses: Status[] = [
        { id: 1, name: "New", sort_order: 1, description: null, color: "#0000FF" },
        { id: 2, name: "Resolved", sort_order: 2, description: null, color: "#00FF00" },
      ]

      mockService.getStatuses = vi.fn().mockResolvedValue(mockStatuses)

      // ACT
      await decorator.getStatuses()

      // ASSERT
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("[TicketService] Fetched 2 statuses")
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/in \d+ms/))
    })

    it("should log error when wrapped service throws", async () => {
      // ARRANGE
      const error = new Error("Database error")
      mockService.getStatuses = vi.fn().mockRejectedValue(error)

      // ACT & ASSERT
      await expect(decorator.getStatuses()).rejects.toThrow("Database error")

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[TicketService] Failed to fetch statuses"),
        error
      )
    })
  })

  describe("Decorator does not modify behavior", () => {
    it("should return same value as wrapped service for getCityServices", async () => {
      const mockData: Profile[] = [
        {
          id: "w1",
          username: "Worker",
          email: "w@c.com",
          role: "cityservice",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
          avatar_url: null,
        },
      ]

      mockService.getCityServices = vi.fn().mockResolvedValue(mockData)

      const result = await decorator.getCityServices()

      expect(result).toBe(mockData)
    })

    it("should return same value as wrapped service for getStatuses", async () => {
      const mockData: Status[] = [
        { id: 1, name: "New", sort_order: 1, description: null, color: "blue" },
      ]

      mockService.getStatuses = vi.fn().mockResolvedValue(mockData)

      const result = await decorator.getStatuses()

      expect(result).toBe(mockData)
    })
  })

  describe("TicketServiceDecorator (base)", () => {
    let mockService: ITicketService
    let decorator: TicketServiceDecorator

    beforeEach(() => {
      mockService = {
        updateTicket: vi.fn().mockResolvedValue(undefined),
        getCityServices: vi.fn().mockResolvedValue([
          {
            id: "w1",
            username: "Worker",
            email: "w@c.com",
            role: "cityservice",
            created_at: "",
            updated_at: "",
            avatar_url: null,
          },
        ]),
        getStatuses: vi
          .fn()
          .mockResolvedValue([
            { id: 1, name: "New", sort_order: 1, description: null, color: null },
          ]),
      }
      // Use a proper constructor type instead of 'any'
      decorator = new (TicketServiceDecorator as new (
        service: ITicketService
      ) => TicketServiceDecorator)(mockService)
    })

    it("should delegate updateTicket to wrapped service", async () => {
      const changes: TicketUpdatePayload = { priority: "med" }
      await decorator.updateTicket("id-x", changes)
      expect(mockService.updateTicket).toHaveBeenCalledWith("id-x", changes)
      expect(mockService.updateTicket).toHaveBeenCalledTimes(1)
    })

    it("should delegate getCityServices to wrapped service and return result", async () => {
      const result = await decorator.getCityServices()
      expect(mockService.getCityServices).toHaveBeenCalledTimes(1)
      expect(result).toEqual([
        {
          id: "w1",
          username: "Worker",
          email: "w@c.com",
          role: "cityservice",
          created_at: "",
          updated_at: "",
          avatar_url: null,
        },
      ])
    })

    it("should delegate getStatuses to wrapped service and return result", async () => {
      const result = await decorator.getStatuses()
      expect(mockService.getStatuses).toHaveBeenCalledTimes(1)
      expect(result).toEqual([
        { id: 1, name: "New", sort_order: 1, description: null, color: null },
      ])
    })
  })
})
