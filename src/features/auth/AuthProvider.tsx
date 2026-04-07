import { useEffect, useReducer, useCallback, useRef, useMemo } from "react"
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/types/database.types"
import { AuthContext } from "./AuthContext"

type AuthState = {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
}

type AuthAction =
  | { type: "INIT_COMPLETE"; session: Session | null; user: User | null; profile: Profile | null }
  | { type: "TOKEN_REFRESHED"; session: Session | null }
  | { type: "SIGNED_OUT" }
  | { type: "AUTH_CHANGED"; session: Session | null; user: User | null; profile: Profile | null }
  | { type: "SET_PROFILE"; profile: Profile | null }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "INIT_COMPLETE":
      return {
        user: action.user,
        session: action.session,
        profile: action.profile,
        isLoading: false,
      }
    case "TOKEN_REFRESHED":
      return { ...state, session: action.session }
    case "SIGNED_OUT":
      return { user: null, session: null, profile: null, isLoading: false }
    case "AUTH_CHANGED":
      return {
        user: action.user,
        session: action.session,
        profile: action.profile,
        isLoading: false,
      }
    case "SET_PROFILE":
      return { ...state, profile: action.profile }
  }
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [{ user, session, profile, isLoading }, dispatch] = useReducer(authReducer, {
    user: null,
    session: null,
    profile: null,
    isLoading: true,
  })
  const initializingRef = useRef(true)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      return data as Profile
    } catch (err) {
      console.error("Error fetching profile:", err)
      return null
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      dispatch({ type: "SET_PROFILE", profile: profileData })
    }
  }, [user, fetchProfile])

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          // Clear potentially corrupted session
          await supabase.auth.signOut()
          if (mounted) {
            dispatch({ type: "INIT_COMPLETE", session: null, user: null, profile: null })
          }
          return
        }

        if (mounted) {
          const profileData = session?.user ? await fetchProfile(session.user.id) : null
          if (mounted) {
            dispatch({
              type: "INIT_COMPLETE",
              session,
              user: session?.user ?? null,
              profile: profileData,
            })
            initializingRef.current = false
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
        if (mounted) {
          dispatch({ type: "INIT_COMPLETE", session: null, user: null, profile: null })
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      // Skip during initialization to avoid race conditions
      if (initializingRef.current) return

      if (!mounted) return

      // Handle specific auth events
      if (event === "TOKEN_REFRESHED") {
        dispatch({ type: "TOKEN_REFRESHED", session })
        return
      }

      if (event === "SIGNED_OUT") {
        dispatch({ type: "SIGNED_OUT" })
        return
      }

      // Update session, user, and profile atomically
      const profileData = session?.user ? await fetchProfile(session.user.id) : null
      if (mounted) {
        dispatch({
          type: "AUTH_CHANGED",
          session,
          user: session?.user ?? null,
          profile: profileData,
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${globalThis.location.origin}/`,
      },
    })

    if (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in with password:", error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
      throw error
    }

    dispatch({ type: "SIGNED_OUT" })
  }

  const contextValue = useMemo(
    () => ({
      user,
      session,
      profile,
      isLoading,
      signInWithGoogle,
      signInWithPassword,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, isLoading, refreshProfile]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
