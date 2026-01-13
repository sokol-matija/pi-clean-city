import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  TicketSubject,
  UIRefreshObserver,
  LoggerObserver,
  type TicketObserver,
} from "./TicketObserver"

describe("TicketObserver Pattern", () => {
  //spies
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // spy na console.log
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
    consoleLogSpy.mockRestore()
  })

  describe("TicketSubject", () => {
    let subject: TicketSubject

    beforeEach(() => {
      subject = new TicketSubject()
    })

    describe("attach", () => {
      it("should add observer to observers list", () => {
        const observer: TicketObserver = {
          update: vi.fn(),
        }

        //ACT
        subject.attach(observer)

        //ASSERT
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining("[TicketSubject] Observer attached")
        )

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Total observers: 1"))
      })

      it("should not add the same observer twice", () => {
        const observer: TicketObserver = {
          update: vi.fn(),
        }

        //ACT
        subject.attach(observer)
        subject.attach(observer) //attach again

        //ASSERT
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining("[TicketSubject] Observer already attached")
        )

        // Ensure only one observer is attached
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Total observers: 1"))
      })

      it("should allow multiple different observers", () => {
        const observer1: TicketObserver = {
          update: vi.fn(),
        }
        const observer2: TicketObserver = {
          update: vi.fn(),
        }

        //ACT
        subject.attach(observer1)
        subject.attach(observer2)

        //ASSERT
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Total observers: 2"))
      })
    })

    describe("detach", () => {
      it("should remove observer from observers list", () => {
        const mockObserver: TicketObserver = {
          update: vi.fn(),
        }

        //ARRANGE
        subject.attach(mockObserver)
        consoleLogSpy.mockClear() //clear previous logs

        //ACT
        subject.detach(mockObserver)

        //ASSERT
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining("[TicketSubject] Observer detached")
        )

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Total observers: 0"))
      })

      it("should log warning when trying to detach non-existing observer", () => {
        const mockObserver: TicketObserver = {
          update: vi.fn(),
        }

        //ACT
        subject.detach(mockObserver)

        //ASSERT
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining("[TicketSubject] Observer not found")
        )
      })

      it("should only remove the specified observer", () => {
        const observer1: TicketObserver = {
          update: vi.fn(),
        }
        const observer2: TicketObserver = {
          update: vi.fn(),
        }

        //ARRANGE
        subject.attach(observer1)
        subject.attach(observer2)
        consoleLogSpy.mockClear() //clear previous logs

        //ACT
        subject.detach(observer1)

        //ASSERT
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Total observers: 1"))
      })
    })
    describe("notify", () => {
      it("should call update() on all attached observers", () => {
        //ARRANGE
        const observer1: TicketObserver = {
          update: vi.fn(),
        }
        const observer2: TicketObserver = {
          update: vi.fn(),
        }

        subject.attach(observer1)
        subject.attach(observer2)

        const ticketId = "123"
        const changes = { priority: "high", status_id: 2 }

        //ACT
        subject.notify(ticketId, changes)

        //ASSERT
        expect(observer1.update).toHaveBeenCalledWith(ticketId, changes)
        expect(observer2.update).toHaveBeenCalledWith(ticketId, changes)
        expect(observer1.update).toHaveBeenCalledTimes(1)
        expect(observer2.update).toHaveBeenCalledTimes(1)
      })

      it("should pass correct ticketId and changes to observers", () => {
        //ARRANGE
        const mockObserver: TicketObserver = {
          update: vi.fn(),
        }
        subject.attach(mockObserver)

        const ticketId = "test-ticket-456"
        const changes = {
          priority: "critical",
          status_id: 3,
          assigned_worker_id: "worker-789",
        }

        //ACT
        subject.notify(ticketId, changes)

        //ASSERT
        expect(mockObserver.update).toHaveBeenCalledWith(ticketId, changes)
      })

      it("should not fail when no observers are attached", () => {
        //ACT & ASSERT
        expect(() => {
          subject.notify("ticket-123", { priority: "high" })
        }).not.toThrow()

        //logira 0 observers
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining("[TicketSubject] Notifying 0 observers")
        )
      })

      it("should not notify detached observers", () => {
        // ARRANGE
        const observer1: TicketObserver = { update: vi.fn() }
        const observer2: TicketObserver = { update: vi.fn() }

        subject.attach(observer1)
        subject.attach(observer2)
        subject.detach(observer1) // ← Detach observer1

        // ACT
        subject.notify("ticket-123", { priority: "high" })

        // ASSERT - Samo observer2 pozvan
        expect(observer1.update).not.toHaveBeenCalled()
        expect(observer2.update).toHaveBeenCalledTimes(1)
      })
    })

    describe("UIRefreshObserver", () => {
      it("should call refresh callback when updated", () => {
        //ARRANGE
        const mockRefreshCallback = vi.fn()
        const uiObserver = new UIRefreshObserver(mockRefreshCallback)

        const ticketId = "ticket-123"
        const changes = { priority: "high" }

        //ACT
        uiObserver.update(ticketId, changes)

        //ASSERT - callback pozvan
        expect(mockRefreshCallback).toHaveBeenCalledTimes(1)
      })

      it("should log ticket update", () => {
        //ARRANGE
        const mockRefreshCallback = vi.fn()
        const uiObserver = new UIRefreshObserver(mockRefreshCallback)

        consoleLogSpy.mockClear() //clear previous logs

        uiObserver.update("ticket-456", { status_id: 2 })

        //ASSERT - logira update
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining("[UIRefreshObserver] Ticket ticket-456 updated, refreshing UI")
        )
      })

      it("should log changes made to the ticket", () => {
        //ARRANGE
        const mockRefreshCallback = vi.fn()
        const uiObserver = new UIRefreshObserver(mockRefreshCallback)

        const changes = { priority: "crticial", status_id: 3 }
        consoleLogSpy.mockClear() //clear previous logs

        //ACT
        uiObserver.update("ticket-789", changes)

        //ASSERT - logira changes
        expect(consoleLogSpy).toHaveBeenCalledWith("[UIRefreshObserver] Changes: ", changes)
      })

      it("should work with TicketSubject", () => {
        //ARRANGE
        const subject = new TicketSubject()
        const mockRefreshCallback = vi.fn()
        const uiObserver = new UIRefreshObserver(mockRefreshCallback)

        subject.attach(uiObserver)

        //ACT
        subject.notify("ticket-999", { priority: "low" })

        //ASSERT
        expect(mockRefreshCallback).toHaveBeenCalledTimes(1)
      })
    })

    describe("LoggerObserver", () => {
      it("should log ticket update details with timestamps", () => {
        //ARRANGE
        const loggerObserver = new LoggerObserver()
        consoleLogSpy.mockClear() //clear previous logs

        //ACT
        loggerObserver.update("ticket-321", { priority: "medium" })

        //ASSERT
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringMatching(/\[LoggerObserver\] .* - Ticket ticket-321 updated/)
        )
      })

      it("should log the changes made to the ticket", () => {
        //ARRANGE
        const loggerObserver = new LoggerObserver()
        const changes = { priority: "critical", status_id: 3 }
        consoleLogSpy.mockClear() //clear previous logs

        //ACT
        loggerObserver.update("ticket-654", changes)

        //ASSERT
        expect(consoleLogSpy).toHaveBeenCalledWith("[LoggerObserver] Changes:", changes)
      })

      it("should include ISO timestamp in the log", () => {
        //ARRANGE
        const loggerObserver = new LoggerObserver()
        consoleLogSpy.mockClear() //clear previous logs

        //ACT
        loggerObserver.update("ticket-987", { priority: "low" })

        //ASSERT
        const logCall = consoleLogSpy.mock.calls.find(
          (call: unknown[]) =>
            typeof call[0] === "string" &&
            call[0].includes("[LoggerObserver]") &&
            call[0].includes("Ticket")
        )

        expect(logCall).toBeDefined()
        expect(logCall?.[0]).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      })

      it("should work with TicketSubject", () => {
        //ARRANGE
        const subject = new TicketSubject()
        const loggerObserver = new LoggerObserver()

        subject.attach(loggerObserver)
        consoleLogSpy.mockClear() //clear previous logs

        // ACT
        subject.notify("ticket-123", { priority: "high" })

        // ASSERT - Logger pozvan kroz notify
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("[LoggerObserver]"))
      })
    })

    describe("Observer Pattern Integration", () => {
      it("should work with multiple observer types together", () => {
        // ARRANGE
        const subject = new TicketSubject()
        const mockRefreshCallback = vi.fn()
        const uiObserver = new UIRefreshObserver(mockRefreshCallback)
        const loggerObserver = new LoggerObserver()

        subject.attach(uiObserver)
        subject.attach(loggerObserver)
        consoleLogSpy.mockClear()

        // ACT
        subject.notify("ticket-123", { priority: "high", status_id: 2 })

        // ASSERT
        // UI observer callback pozvan
        expect(mockRefreshCallback).toHaveBeenCalledTimes(1)

        // Logger observer logirao
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("[LoggerObserver]"))

        // UI observer logirao
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("[UIRefreshObserver]"))
      })
    })
  })
})
