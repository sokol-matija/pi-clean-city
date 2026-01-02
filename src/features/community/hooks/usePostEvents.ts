// Hook za observer pattern - pretplata na dogadaje

import { useEffect, useRef } from "react"
import {
  postEventEmitter,
  type PostEventType,
  type PostEventHandler,
} from "../patterns/Observer/PostEventEmitter"

// Funkcija za subscribeanje na događaje
export function usePostEvents<T extends PostEventType>(
  eventType: T,
  handler: PostEventHandler<T>,
  enabled: boolean = true
): void {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    if (!enabled) return

    const stableHandler: PostEventHandler<T> = (payload) => {
      handlerRef.current(payload)
    }

    const subscription = postEventEmitter.subscribe(eventType, stableHandler)

    // Cleanup kad se unmounta
    return () => {
      subscription.unsubscribe()
    }
  }, [eventType, enabled])
}

// Funkcija za emitiranje
export function usePostEventEmitter() {
  const emit = <T extends PostEventType>(
    eventType: T,
    payload: Parameters<PostEventHandler<T>>[0]
  ): void => {
    postEventEmitter.emit(eventType, payload)
  }

  return { emit, emitter: postEventEmitter }
}

// Funkcija za subscribeanje (odjavljuje se nakon prvog događaja)
export function usePostEventOnce<T extends PostEventType>(
  eventType: T,
  handler: PostEventHandler<T>
): void {
  const hasRun = useRef(false)

  usePostEvents(
    eventType,
    (payload) => {
      if (!hasRun.current) {
        hasRun.current = true
        handler(payload)
      }
    },
    !hasRun.current
  )
}
