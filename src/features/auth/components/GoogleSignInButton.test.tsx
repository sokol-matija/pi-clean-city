import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GoogleSignInButton } from "./GoogleSignInButton"
import * as authModule from "../index"
import type { AuthContextType } from "../AuthContext"

// Mock the useAuth hook
vi.mock("../index", () => ({
  useAuth: vi.fn(),
}))

describe("GoogleSignInButton", () => {
  // Create a mock function for signInWithGoogle
  const mockSignInWithGoogle = vi.fn()

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    // Setup the mock to return our mock function
    vi.mocked(authModule.useAuth).mockReturnValue({
      signInWithGoogle: mockSignInWithGoogle,
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      refreshProfile: vi.fn(),
    } as AuthContextType)
  })

  it("should render the button with correct text", () => {
    // Render the component
    render(<GoogleSignInButton />)

    // Find the button by its text
    const button = screen.getByRole("button", { name: /continue with google/i })

    // Assert it exists
    expect(button).toBeInTheDocument()
  })

  it("should call signInWithGoogle when clicked", async () => {
    // Setup
    const user = userEvent.setup()
    render(<GoogleSignInButton />)

    // Get the button
    const button = screen.getByRole("button", { name: /continue with google/i })

    // Click the button
    await user.click(button)

    // Assert the function was called
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
  })

  it("should show loading state when signing in", async () => {
    // Make the sign-in take some time
    mockSignInWithGoogle.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    const user = userEvent.setup()
    render(<GoogleSignInButton />)

    const button = screen.getByRole("button", { name: /continue with google/i })

    // Click the button
    await user.click(button)

    // Check if loading text appears
    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument()

    // Wait for the loading to finish
    await waitFor(() => {
      expect(screen.getByText(/continue with google/i)).toBeInTheDocument()
    })
  })

  it("should disable button while loading", async () => {
    mockSignInWithGoogle.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    const user = userEvent.setup()
    render(<GoogleSignInButton />)

    const button = screen.getByRole("button", { name: /continue with google/i })

    // Click the button
    await user.click(button)

    // Button should be disabled
    expect(button).toBeDisabled()

    // Wait for completion
    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it("should handle sign-in errors gracefully", async () => {
    // Mock console.error to avoid cluttering test output
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    // Make the sign-in fail
    const mockError = new Error("Sign in failed")
    mockSignInWithGoogle.mockRejectedValueOnce(mockError)

    const user = userEvent.setup()
    render(<GoogleSignInButton />)

    const button = screen.getByRole("button", { name: /continue with google/i })

    // Click the button
    await user.click(button)

    // Wait for error handling
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to sign in:", mockError)
    })

    // Button should be enabled again after error
    expect(button).not.toBeDisabled()

    consoleErrorSpy.mockRestore()
  })

  it("should have correct styling classes", () => {
    render(<GoogleSignInButton />)

    const button = screen.getByRole("button", { name: /continue with google/i })

    // Check for specific classes
    expect(button).toHaveClass("w-full")
    expect(button).toHaveClass("gap-2")
  })
})
