/**
 * Notification Types
 * Core type definitions for the notification system
 */

export type NtfyPriority = 1 | 2 | 3 | 4 | 5

export interface NtfyAction {
  action: "view" | "http" | "broadcast"
  label: string
  url?: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: string
}

export interface NtfyMessage {
  topic: string
  message: string
  title?: string
  priority?: NtfyPriority
  tags?: string[]
  click?: string
  attach?: string
  actions?: NtfyAction[]
  markdown?: boolean
  icon?: string
  delay?: string
  email?: string
}

export type NotificationType = "comment" | "status_update" | "assignment" | "resolution" | "mention"

export interface INotification {
  topic: string
  message: string
  title?: string
  priority?: NtfyPriority
  tags?: string[]
  click?: string
  actions?: NtfyAction[]
  icon?: string
}

export interface NotificationConfig {
  baseUrl: string
  authToken?: string
  defaultPriority: number
  retryAttempts: number
  retryDelay: number
  topicPrefix: string
}
