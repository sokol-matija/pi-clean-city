// SupabaseTicketService.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest" //Vitest function for testing
import { SupabaseTicketService } from "./SupabaseTicketService"
import type { TicketUpdatePayload } from "../interfaces/ITicketService"
import { mockCityServices, mockStatuses } from "./__fixtures__/ticketServiceFixtures"
import type { Status } from "src/types/database.types.ts"

// Type for mock Supabase responses to avoid using 'any'
type MockSupabaseResponse<T> = { data: T | null; error: { message: string } | null }

//chain of mocks for supabase client methods

function expectStatusFields(obj: Status) {
  expect(obj).toHaveProperty("id")
  expect(obj).toHaveProperty("name")
  expect(obj).toHaveProperty("sort_order")
  expect(obj).toHaveProperty("description")
  expect(obj).toHaveProperty("color")
  expect(typeof obj.id).toBe("number")
  expect(typeof obj.name).toBe("string")
  expect(typeof obj.sort_order).toBe("number")
}

const { mockEq, mockUpdate, mockSelect, mockOrder, mockFrom } = vi.hoisted(() => {
  const mockEq = vi.fn(() =>
    Promise.resolve({ data: null, error: null } as MockSupabaseResponse<unknown>)
  )
  const mockOrder = vi.fn(() =>
    Promise.resolve({ data: [], error: null } as MockSupabaseResponse<unknown>)
  )
  const mockUpdate = vi.fn(() => ({ eq: mockEq }))
  const mockSelect = vi.fn(() => ({
    eq: vi.fn(() => ({ order: mockOrder })),
    order: mockOrder,
  }))

  const mockFrom = vi.fn((table: string) => {
    if (table === "report") {
      return { update: mockUpdate }
    }
    return { select: mockSelect }
  })

  return { mockEq, mockUpdate, mockSelect, mockOrder, mockFrom }
})

//Mock Supabase client
//vi - Vitest mock utility - fake verzije funkcija/objekata
// mockamo supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: mockFrom,
  },
}))

import { supabase } from "@/lib/supabase"

//describe() - Test suite - grupira povezane testove
describe("SupabaseTicketService", () => {
  let service: SupabaseTicketService //dostupna svima u describe bloku

  beforeEach(() => {
    service = new SupabaseTicketService() //svaki test dobiva novu instancu
    vi.clearAllMocks()
  })

  describe("updateTicket", () => {
    it("should update ticket successfully when Supabase returns no error", async () => {
      //testovi
      //ARRANGE
      const ticketId = "test-ticket-123"
      const changes: TicketUpdatePayload = {
        priority: "high",
        status_id: 2,
        assigned_worker_id: "worker-456",
      }

      //ACT
      await service.updateTicket(ticketId, changes) //poziva stvarni kod

      //LOG
      console.log("mockFrom pozvan:", mockFrom.mock.calls.length, "puta")
      console.log("mockUpdate pozvan sa:", mockUpdate.mock.calls[0])
      console.log("mockEq pozvan sa:", mockEq.mock.calls[0])

      //ASSERT
      // expect(true).toBe(true) //placeholder assert

      expect(supabase.from).toHaveBeenCalled() //provjerava da je supabase.from pozvan
      expect(supabase.from).toHaveBeenCalledWith("report") //provjerava da je pozvan s 'report' argumentom
      expect(supabase.from).toHaveBeenCalledTimes(1) //provjerava da je pozvan tocno jendom

      expect(mockUpdate).toHaveBeenCalled() //provjerava da je mockUpdate pozvan
      expect(mockUpdate).toHaveBeenCalledWith(changes) //provjerava da je pozvan s changes argumentom
      expect(mockUpdate).toHaveBeenCalledTimes(1) //provjerava da je pozvan tocno jednom

      expect(mockEq).toHaveBeenCalled() //provjerava da je mockEq pozvan
      expect(mockEq).toHaveBeenCalledWith("id", ticketId) //provjerava da je pozvan s 'id' i ticketId argumentima
      expect(mockEq).toHaveBeenCalledTimes(1) //provjerava da je pozvan tocno jednom
    })

    it("should throw an error when Supabase returns an error", async () => {
      //ARRANGE
      const ticketId = "test-ticket-123"
      const changes: TicketUpdatePayload = {
        priority: "high",
        status_id: 2,
        assigned_worker_id: "worker-456",
      }

      const supabaseError = { message: "Database connection failed" }

      mockEq.mockResolvedValueOnce({
        data: null,
        error: supabaseError,
      } as MockSupabaseResponse<null>)

      //ACT & ASSERT
      await expect(service.updateTicket(ticketId, changes)).rejects.toThrowError(
        `Failed to update ticket: ${supabaseError.message}`
      )
    })

    it("should handle empty changes object", async () => {
      //ARRANGE
      const ticketId = "test-ticket-123"
      const changes: TicketUpdatePayload = {}

      //ACT
      await service.updateTicket(ticketId, changes)

      //ASSERT
      expect(supabase.from).toHaveBeenCalledWith("report")
      expect(mockUpdate).toHaveBeenCalledWith(changes)
      expect(mockEq).toHaveBeenCalledWith("id", ticketId)
    })
  })

  describe("getCityServices", () => {
    it("should fetch city sercvices from Supabase with correct filters", async () => {
      //ARRANGE
      mockOrder.mockResolvedValueOnce({
        data: mockCityServices,
        error: null,
      } as MockSupabaseResponse<typeof mockCityServices>)

      //ACT
      const result = await service.getCityServices()

      //ASSERT
      expect(supabase.from).toHaveBeenCalledWith("profiles")
      expect(supabase.from).toHaveBeenCalledTimes(1)

      expect(mockSelect).toHaveBeenCalledWith("*")
      expect(mockSelect).toHaveBeenCalledTimes(1)

      expect(result).toEqual(mockCityServices)
      expect(result).toHaveLength(3) //expect 3 mock workers from fixtures, only length not full object check
      expect(result[0].id).toBe("worker-1")
      expect(result[0].username).toBe("Alice Johnson")
      expect(result[0].role).toBe("cityservice")
    })

    it("should throw an error when Supabase fails to fetch city services", async () => {
      //ARRANGE
      const supabaseError = { message: "Failed to connect to database" }

      mockOrder.mockResolvedValueOnce({
        data: null,
        error: supabaseError,
      } as MockSupabaseResponse<null>)

      //ACT & ASSERT
      await expect(service.getCityServices()).rejects.toThrowError(
        `Failed to fetch city services: ${supabaseError.message}`
      )
    })

    it("should return empty array when no city services exist", async () => {
      // ARRANGE
      mockOrder.mockResolvedValueOnce({ data: [], error: null } as MockSupabaseResponse<[]>)

      // ACT
      const result = await service.getCityServices()

      // ASSERT
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
      expect(Array.isArray(result)).toBe(true)
    })

    it("should return all city service workers with complete profile data", async () => {
      // ARRANGE
      mockOrder.mockResolvedValueOnce({
        data: mockCityServices,
        error: null,
      } as MockSupabaseResponse<typeof mockCityServices>)

      // ACT
      const result = await service.getCityServices()

      // ASSERT
      expect(result).toHaveLength(3)

      // Verify first worker
      expect(result[0]).toHaveProperty("id")
      expect(result[0]).toHaveProperty("username")
      expect(result[0]).toHaveProperty("email")
      expect(result[0]).toHaveProperty("role")
      expect(result[0]).toHaveProperty("created_at")
      expect(result[0]).toHaveProperty("updated_at")
      expect(result[0]).toHaveProperty("avatar_url")

      // Verify all workers have cityservice role
      result.forEach((worker) => {
        expect(worker.role).toBe("cityservice")
      })
    })

    describe("getStatuses", () => {
      it("should fetch statuses from Supabase ordered by sort_order", async () => {
        //ARRANGE
        mockOrder.mockResolvedValueOnce({ data: mockStatuses, error: null } as MockSupabaseResponse<
          typeof mockStatuses
        >)

        //ACT
        const result = await service.getStatuses()

        //ASSERT
        expect(supabase.from).toHaveBeenCalledWith("status")
        expect(supabase.from).toHaveBeenCalledTimes(1)

        expect(mockSelect).toHaveBeenCalledWith("*")
        expect(mockSelect).toHaveBeenCalledTimes(1)

        expect(result).toEqual(mockStatuses)
        expect(result).toHaveLength(4)
        expect(result[0].name).toBe("New")
        expect(result[0].sort_order).toBe(1)
      })

      it("should throw an error when Supabase fails to fetch statuses", async () => {
        //ARRANGE
        const supabaseError = { message: "Table does not exist" }

        mockOrder.mockResolvedValueOnce({
          data: null,
          error: supabaseError,
        } as MockSupabaseResponse<null>)

        //ACT & ASSERT
        await expect(service.getStatuses()).rejects.toThrowError(
          `Failed to fetch statuses: ${supabaseError.message}`
        )
      })

      it("should return empty array when no statuses exist", async () => {
        //ARRANGE
        mockOrder.mockResolvedValueOnce({ data: [], error: null } as MockSupabaseResponse<[]>)

        //ACT
        const result = await service.getStatuses()

        //ASSERT
        expect(result).toEqual([])
        expect(result).toHaveLength(0)
        expect(Array.isArray(result)).toBe(true)
      })

      it("should return all statuses with required fields", async () => {
        //ARRANGE
        mockOrder.mockResolvedValueOnce({ data: mockStatuses, error: null } as MockSupabaseResponse<
          typeof mockStatuses
        >)

        //ACT
        const result = await service.getStatuses()

        //ASSERT
        expect(result).toHaveLength(4)

        //Verify each status has required fields
        result.forEach(expectStatusFields)

        //verify statuses are ordered by sort_order
        expect(result[0].sort_order).toBe(1)
        expect(result[1].sort_order).toBe(2)
        expect(result[2].sort_order).toBe(3)
        expect(result[3].sort_order).toBe(4)
      })

      it("should include color information for each status", async () => {
        //ARRANGE
        mockOrder.mockResolvedValueOnce({ data: mockStatuses, error: null } as MockSupabaseResponse<
          typeof mockStatuses
        >)

        //ACT
        const result = await service.getStatuses()

        //ASSERT
        expect(result[0].color).toBe("blue")
        expect(result[1].color).toBe("orange")
        expect(result[2].color).toBe("green")
        expect(result[3].color).toBe("gray")
      })
    })
  })
})
