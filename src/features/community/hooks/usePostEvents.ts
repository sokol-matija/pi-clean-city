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
