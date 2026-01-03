// Observer pattern, obavjestavam vise komponenti kada se CRUD-a post
import type { Post } from "@/types/database.types"

export type PostEventType =
  | "post:created"
  | "post:updated"
  | "post:deleted"
  | "post:rated"
  | "post:commented"
  | "post:viewed"

// Mapa tipova dogadaja na njihove payloads
export interface PostEventPayloads {
  "post:created": { post: Post; authorId: string }
  "post:updated": { post: Post; changes: Partial<Post> }
  "post:deleted": { postId: number; deletedBy: string }
  "post:rated": { postId: number; userId: string; rating: number }
  "post:commented": { postId: number; userId: string; comment: string }
  "post:viewed": { postId: number; viewerId?: string }
}

export type PostEventHandler<T extends PostEventType> = (
  payload: PostEventPayloads[T]
) => void | Promise<void>

export interface Subscription {
  unsubscribe: () => void
}

// Interni tip za pohranu handlera
type AnyPostEventHandler = (payload: PostEventPayloads[PostEventType]) => void | Promise<void>

// POST EMITTER - GLAVNA KLASA OBSERVER PATTERNA
export class PostEventEmitter {
  private subscribers: Map<PostEventType, Set<AnyPostEventHandler>> = new Map()

  // Singleton pattern kombiniran s Observer
  private static instance: PostEventEmitter | null = null

  private constructor() {
    const eventTypes: PostEventType[] = [
      "post:created",
      "post:updated",
      "post:deleted",
      "post:rated",
      "post:commented",
      "post:viewed",
    ]
    eventTypes.forEach((type) => this.subscribers.set(type, new Set()))
  }

  public static getInstance(): PostEventEmitter {
    if (!PostEventEmitter.instance) {
      PostEventEmitter.instance = new PostEventEmitter()
    }
    return PostEventEmitter.instance
  }

  // Pretplata na određeni tip dogadaja, vraca subscription objekt s unsubscribe metodom
  public subscribe<T extends PostEventType>(
    eventType: T,
    handler: PostEventHandler<T>
  ): Subscription {
    const handlers = this.subscribers.get(eventType)
    const typedHandler = handler as AnyPostEventHandler
    if (handlers) {
      handlers.add(typedHandler)
      console.log(`[Observer] Pretplaćen na: ${eventType}`)
    }

    // Vraćamo objekt koji omogućuje odjavljivanje
    return {
      unsubscribe: () => {
        handlers?.delete(typedHandler)
        console.log(`[Observer] Odjavljen s: ${eventType}`)
      },
    }
  }

  // Emitiranje događaja svim pretplatnicima
  public emit<T extends PostEventType>(eventType: T, payload: PostEventPayloads[T]): void {
    const handlers = this.subscribers.get(eventType)
    if (handlers && handlers.size > 0) {
      console.log(`[Observer] Emitiranje: ${eventType}`, payload)
      handlers.forEach((handler) => {
        try {
          handler(payload)
        } catch (error) {
          console.error(`[Observer] Greška u handleru za ${eventType}:`, error)
        }
      })
    }
  }

  // Pretplata koja se odjavi nakon prvog događaja
  public subscribeOnce<T extends PostEventType>(
    eventType: T,
    handler: PostEventHandler<T>
  ): Subscription {
    const wrappedHandler: PostEventHandler<T> = (payload) => {
      handler(payload)
      subscription.unsubscribe()
    }
    const subscription = this.subscribe(eventType, wrappedHandler)
    return subscription
  }

  // Uklanja sve subscribere
  public clearAll(): void {
    this.subscribers.forEach((handlers) => handlers.clear())
    console.log("[Observer] Svi pretplatnici uklonjeni")
  }
}

// Handler za logiranje događaja u konzolu
export const createLoggingHandler = <T extends PostEventType>(
  eventType: T
): PostEventHandler<T> => {
  return (payload) => {
    console.log(`[PostEvent] ${eventType}:`, JSON.stringify(payload, null, 2))
  }
}

// Handler za slanje notifikacija prilikom kreiranja posta
export const createNotificationHandler = (): PostEventHandler<"post:created"> => {
  return (payload) => {
    console.log(`[Notifikacija] Novi post kreiran od korisnika: ${payload.authorId}`)
  }
}

// Exporti za dobivanje singleton instance
export function getPostEventEmitter(): PostEventEmitter {
  return PostEventEmitter.getInstance()
}

export const postEventEmitter = PostEventEmitter.getInstance()
