/**
 * Badge Configuration Module
 *
 * SOLID Principle: Open/Closed Principle (OCP)
 * This module is OPEN for extension (add new statuses/priorities via config)
 * but CLOSED for modification (no need to change the resolver logic).
 *
 * Benefits:
 * - Add new status/priority types by extending config, not modifying code
 * - Type-safe enums prevent typos
 * - Centralized configuration for all badge styles
 * - Easy to test configuration separately from logic
 *
 * BAD (before): if-else chains that must be modified for each new status
 * GOOD (after): Configuration objects that can be extended without code changes
 */

import type { BadgeProps } from "@/components/ui/badge"

// Type for badge variants (matches the Badge component)
export type BadgeVariant = BadgeProps["variant"]

/**
 * Status configuration - maps status names to badge variants.
 * To add a new status, simply add an entry here - no code changes needed!
 */
export const STATUS_BADGE_CONFIG: Record<string, BadgeVariant> = {
  // Current statuses from database
  new: "destructive",
  "in progress": "default",
  resolved: "secondary",
  closed: "outline",

  // Future statuses can be added here without modifying any logic:
  // "on hold": "secondary",
  // "escalated": "destructive",
  // "pending review": "default",
}

/**
 * Priority configuration - maps priority levels to badge variants.
 * To add a new priority, simply add an entry here - no code changes needed!
 */
export const PRIORITY_BADGE_CONFIG: Record<string, BadgeVariant> = {
  critical: "destructive",
  high: "destructive",
  medium: "default",
  low: "secondary",

  // Future priorities can be added here without modifying any logic:
  // "urgent": "destructive",
  // "none": "outline",
}

/**
 * Default variants when status/priority is unknown
 */
const DEFAULT_STATUS_VARIANT: BadgeVariant = "default"
const DEFAULT_PRIORITY_VARIANT: BadgeVariant = "secondary"

/**
 * Resolves the badge variant for a given status name.
 * Open for extension: Add new statuses to STATUS_BADGE_CONFIG
 * Closed for modification: This function never needs to change
 *
 * @param statusName - The status name from the database
 * @returns The appropriate badge variant
 */
export function getStatusBadgeVariant(statusName: string | undefined | null): BadgeVariant {
  if (!statusName) return DEFAULT_STATUS_VARIANT

  const normalizedStatus = statusName.toLowerCase().trim()
  return STATUS_BADGE_CONFIG[normalizedStatus] ?? DEFAULT_STATUS_VARIANT
}

/**
 * Resolves the badge variant for a given priority level.
 * Open for extension: Add new priorities to PRIORITY_BADGE_CONFIG
 * Closed for modification: This function never needs to change
 *
 * @param priority - The priority level from the database
 * @returns The appropriate badge variant
 */
export function getPriorityBadgeVariant(priority: string | undefined | null): BadgeVariant {
  if (!priority) return DEFAULT_PRIORITY_VARIANT

  const normalizedPriority = priority.toLowerCase().trim()
  return PRIORITY_BADGE_CONFIG[normalizedPriority] ?? DEFAULT_PRIORITY_VARIANT
}

/**
 * Example of extension without modification:
 *
 * To add a new status "Escalated" with destructive styling:
 *
 * 1. Add to database: INSERT INTO status (name, color) VALUES ('Escalated', '#ff0000');
 * 2. Add to config: STATUS_BADGE_CONFIG["escalated"] = "destructive"
 *
 * No changes needed to getStatusBadgeVariant function!
 * This is the Open/Closed Principle in action.
 */
