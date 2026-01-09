import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  PostEventEmitter,
  getPostEventEmitter,
  createLoggingHandler,
  createNotificationHandler,
  type PostEventType,
  type PostEventPayloads,
} from "./PostEventEmitter"

describe("PostEventEmitter", () => {
  let emitter: PostEventEmitter

  beforeEach(() => {
    // Resetamo singleton za svaki test
    // @ts-expect-error <- bypass pristup privatnoj varijabli za testiranje
    PostEventEmitter.instance = null
    emitter = PostEventEmitter.getInstance()

    // Mock konzole da ne spama test output
    vi.spyOn(console, "log").mockImplementation(() => {})
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    emitter.clearAll()
    vi.restoreAllMocks()
  })

  describe("Singleton pattern", () => {
    it("should return the same instance", () => {
      const instance1 = PostEventEmitter.getInstance()
      const instance2 = PostEventEmitter.getInstance()

      expect(instance1).toBe(instance2)
    })

    it("should return same instance via getPostEventEmitter helper", () => {
      const instance1 = PostEventEmitter.getInstance()
      const instance2 = getPostEventEmitter()

      expect(instance1).toBe(instance2)
    })
  })

  describe("subscribe", () => {
    it("should allow subscribing to events", () => {
      const handler = vi.fn()
      const subscription = emitter.subscribe("post:created", handler)

      expect(subscription).toHaveProperty("unsubscribe")
      expect(typeof subscription.unsubscribe).toBe("function")
    })

    it("should call handler when event is emitted", () => {
      const handler = vi.fn()
      emitter.subscribe("post:created", handler)

      const payload: PostEventPayloads["post:created"] = {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      }

      emitter.emit("post:created", payload)

      expect(handler).toHaveBeenCalledWith(payload)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it("should support multiple handlers for same event", () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      emitter.subscribe("post:created", handler1)
      emitter.subscribe("post:created", handler2)

      const payload: PostEventPayloads["post:created"] = {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      }

      emitter.emit("post:created", payload)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it("should not call handlers for different event types", () => {
      const createdHandler = vi.fn()
      const deletedHandler = vi.fn()

      emitter.subscribe("post:created", createdHandler)
      emitter.subscribe("post:deleted", deletedHandler)

      const payload: PostEventPayloads["post:created"] = {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      }

      emitter.emit("post:created", payload)

      expect(createdHandler).toHaveBeenCalledTimes(1)
      expect(deletedHandler).not.toHaveBeenCalled()
    })
  })

  describe("unsubscribe", () => {
    it("should stop receiving events after unsubscribe", () => {
      const handler = vi.fn()
      const subscription = emitter.subscribe("post:created", handler)

      subscription.unsubscribe()

      const payload: PostEventPayloads["post:created"] = {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      }

      emitter.emit("post:created", payload)

      expect(handler).not.toHaveBeenCalled()
    })

    it("should only unsubscribe specific handler", () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const subscription1 = emitter.subscribe("post:created", handler1)
      emitter.subscribe("post:created", handler2)

      subscription1.unsubscribe()

      const payload: PostEventPayloads["post:created"] = {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      }

      emitter.emit("post:created", payload)

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it("should not show if subscribing to an event type that is missing in the map", () => {
      // @ts-expect-error <- maknem event iz mape da handlers bude undefined
      emitter.subscribers.delete("post:created")

      const handler = vi.fn()

      expect(() => emitter.subscribe("post:created", handler)).not.toThrow()

      const sub = emitter.subscribe("post:created", handler)
      expect(() => sub.unsubscribe()).not.toThrow()
    })
  })

  describe("emit", () => {
    it("should emit post:created event", () => {
      const handler = vi.fn()
      emitter.subscribe("post:created", handler)

      emitter.emit("post:created", {
        post: {
          id: 1,
          title: "New Post",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      })

      expect(handler).toHaveBeenCalled()
    })

    it("should emit post:updated event", () => {
      const handler = vi.fn()
      emitter.subscribe("post:updated", handler)

      emitter.emit("post:updated", {
        post: {
          id: 1,
          title: "Updated Post",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        changes: { title: "Updated Post" },
      })

      expect(handler).toHaveBeenCalled()
    })

    it("should emit post:deleted event", () => {
      const handler = vi.fn()
      emitter.subscribe("post:deleted", handler)

      emitter.emit("post:deleted", {
        postId: 1,
        deletedBy: "user-123",
      })

      expect(handler).toHaveBeenCalledWith({
        postId: 1,
        deletedBy: "user-123",
      })
    })

    it("should emit post:rated event", () => {
      const handler = vi.fn()
      emitter.subscribe("post:rated", handler)

      emitter.emit("post:rated", {
        postId: 1,
        userId: "user-123",
        rating: 5,
      })

      expect(handler).toHaveBeenCalledWith({
        postId: 1,
        userId: "user-123",
        rating: 5,
      })
    })

    it("should emit post:commented event", () => {
      const handler = vi.fn()
      emitter.subscribe("post:commented", handler)

      emitter.emit("post:commented", {
        postId: 1,
        userId: "user-123",
        comment: "Great post!",
      })

      expect(handler).toHaveBeenCalledWith({
        postId: 1,
        userId: "user-123",
        comment: "Great post!",
      })
    })

    it("should emit post:viewed event", () => {
      const handler = vi.fn()
      emitter.subscribe("post:viewed", handler)

      emitter.emit("post:viewed", {
        postId: 1,
        viewerId: "user-123",
      })

      expect(handler).toHaveBeenCalledWith({
        postId: 1,
        viewerId: "user-123",
      })
    })

    it("should handle errors in handlers gracefully", () => {
      const errorHandler = vi.fn().mockImplementation(() => {
        throw new Error("Handler error")
      })
      const successHandler = vi.fn()

      emitter.subscribe("post:created", errorHandler)
      emitter.subscribe("post:created", successHandler)

      emitter.emit("post:created", {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      })

      expect(console.error).toHaveBeenCalled()
      expect(successHandler).toHaveBeenCalled()
    })

    it("should not throw when emitting with no subscribers", () => {
      expect(() => {
        emitter.emit("post:created", {
          post: {
            id: 1,
            title: "Test",
            content: "Content",
            created_at: "2026-01-08T10:00:00Z",
            userId: "user-123",
            imageId: null,
            averageRating: null,
          },
          authorId: "user-123",
        })
      }).not.toThrow()
    })
  })

  describe("subscribeOnce", () => {
    it("should only call handler once", () => {
      const handler = vi.fn()
      emitter.subscribeOnce("post:created", handler)

      const payload: PostEventPayloads["post:created"] = {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      }

      emitter.emit("post:created", payload)
      emitter.emit("post:created", payload)
      emitter.emit("post:created", payload)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it("should return subscription with unsubscribe", () => {
      const handler = vi.fn()
      const subscription = emitter.subscribeOnce("post:created", handler)

      expect(subscription).toHaveProperty("unsubscribe")
    })

    it("should be unsubscribable before first emit", () => {
      const handler = vi.fn()
      const subscription = emitter.subscribeOnce("post:created", handler)

      subscription.unsubscribe()

      emitter.emit("post:created", {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      })

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe("clearAll", () => {
    it("should remove all subscribers", () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      emitter.subscribe("post:created", handler1)
      emitter.subscribe("post:deleted", handler2)

      emitter.clearAll()

      emitter.emit("post:created", {
        post: {
          id: 1,
          title: "Test",
          content: "Content",
          created_at: "2026-01-08T10:00:00Z",
          userId: "user-123",
          imageId: null,
          averageRating: null,
        },
        authorId: "user-123",
      })

      emitter.emit("post:deleted", {
        postId: 1,
        deletedBy: "user-123",
      })

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
    })
  })

  describe("Helper handlers", () => {
    describe("createLoggingHandler", () => {
      it("should create handler that logs events", () => {
        const handler = createLoggingHandler("post:created")

        emitter.subscribe("post:created", handler)

        emitter.emit("post:created", {
          post: {
            id: 1,
            title: "Test",
            content: "Content",
            created_at: "2026-01-08T10:00:00Z",
            userId: "user-123",
            imageId: null,
            averageRating: null,
          },
          authorId: "user-123",
        })

        expect(console.log).toHaveBeenCalled()
      })
    })

    describe("createNotificationHandler", () => {
      it("should create handler for post:created notifications", () => {
        const handler = createNotificationHandler()

        emitter.subscribe("post:created", handler)

        emitter.emit("post:created", {
          post: {
            id: 1,
            title: "Test",
            content: "Content",
            created_at: "2026-01-08T10:00:00Z",
            userId: "user-123",
            imageId: null,
            averageRating: null,
          },
          authorId: "user-123",
        })

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("[Notifikacija]"))
      })
    })
  })

  describe("Event types", () => {
    const eventTypes: PostEventType[] = [
      "post:created",
      "post:updated",
      "post:deleted",
      "post:rated",
      "post:commented",
      "post:viewed",
    ]

    eventTypes.forEach((eventType) => {
      it(`should support ${eventType} event type`, () => {
        const handler = vi.fn()

        // subanje na event
        const subscription = emitter.subscribe(eventType, handler)

        expect(subscription).toBeDefined()
        expect(subscription.unsubscribe).toBeDefined()
      })
    })
  })
})
