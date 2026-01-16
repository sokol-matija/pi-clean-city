import type { NtfyMessage } from "../types"

export class NtfyService {
  private static instance: NtfyService
  private readonly baseUrl: string = "https://ntfy.sh"
  private readonly authToken?: string

  private constructor() {}

  public static getInstance(): NtfyService {
    if (!NtfyService.instance) {
      NtfyService.instance = new NtfyService()
    }
    return NtfyService.instance
  }

  async publishSimple(topic: string, message: string): Promise<void> {
    const headers: HeadersInit = {
      "Content-Type": "text/plain",
    }

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`
    }

    const response = await fetch(`${this.baseUrl}/${topic}`, {
      method: "POST",
      headers,
      body: message,
    })

    if (!response.ok) {
      throw new Error(`Failed to publish: ${response.statusText}`)
    }
  }

  async publish(options: NtfyMessage): Promise<void> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`
    }

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`Failed to publish: ${response.statusText}`)
    }
  }

  async publishWithHeaders(
    topic: string,
    message: string,
    options?: {
      title?: string
      priority?: 1 | 2 | 3 | 4 | 5
      tags?: string[]
      click?: string
      markdown?: boolean
    }
  ): Promise<void> {
    const headers: HeadersInit = {
      "Content-Type": "text/plain",
    }

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`
    }

    if (options?.title) {
      headers["Title"] = options.title
    }

    if (options?.priority) {
      headers["Priority"] = options.priority.toString()
    }

    if (options?.tags) {
      headers["Tags"] = options.tags.join(",")
    }

    if (options?.click) {
      headers["Click"] = options.click
    }

    if (options?.markdown) {
      headers["Markdown"] = "yes"
    }

    const response = await fetch(`${this.baseUrl}/${topic}`, {
      method: "POST",
      headers,
      body: message,
    })

    if (!response.ok) {
      throw new Error(`Failed to publish: ${response.statusText}`)
    }
  }
}
