/**
 * FACTORY PATTERN - NotificationFactory
 *
 * Purpose: Creates different types of notifications with consistent structure
 *
 * This pattern centralizes notification creation logic, making it easy to:
 * - Create different notification types (comment, status, assignment, etc.)
 * - Ensure consistent structure across all notifications
 * - Add new notification types without modifying existing code
 *
 * Similar to BadgeFactory from feature/ticketing-design-patterns
 */

import type { INotification } from "../../types"

export type NotificationType = "comment" | "status_update" | "assignment" | "resolution" | "mention"

/**
 * Factory class for creating different types of notifications
 */
export class NotificationFactory {
  /**
   * Create comment notification
   * Triggered when someone comments on a user's report
   */
  static createCommentNotification(params: {
    topic: string
    reportId: string
    commenterName: string
    commentPreview: string
    reportTitle: string
  }): INotification {
    return {
      topic: params.topic,
      title: "New Comment",
      message: `${params.commenterName} commented: "${params.commentPreview}"`,
      priority: 3,
      tags: ["speech_balloon"],
      click: `${window.location.origin}/reports/${params.reportId}`,
      actions: [
        {
          action: "view",
          label: "View Report",
          url: `${window.location.origin}/reports/${params.reportId}`,
        },
        {
          action: "view",
          label: "Reply",
          url: `${window.location.origin}/reports/${params.reportId}#comments`,
        },
      ],
    }
  }

  /**
   * Create status update notification
   * Triggered when report status changes
   */
  static createStatusUpdateNotification(params: {
    topic: string
    reportId: string
    oldStatus: string
    newStatus: string
    reportTitle: string
  }): INotification {
    return {
      topic: params.topic,
      title: "Report Status Updated",
      message: `Status changed: ${params.oldStatus} → ${params.newStatus}`,
      priority: 4,
      tags: ["chart_with_upwards_trend"],
      click: `${window.location.origin}/reports/${params.reportId}`,
    }
  }

  /**
   * Create assignment notification
   * Triggered when report is assigned to a worker
   */
  static createAssignmentNotification(params: {
    topic: string
    reportId: string
    assigneeName: string
    reportTitle: string
    reportLocation: string
  }): INotification {
    return {
      topic: params.topic,
      title: "New Assignment",
      message: `Assigned to ${params.assigneeName}: ${params.reportTitle}`,
      priority: 5,
      tags: ["clipboard"],
      click: `${window.location.origin}/reports/${params.reportId}`,
      actions: [
        {
          action: "view",
          label: "View Report",
          url: `${window.location.origin}/reports/${params.reportId}`,
        },
        {
          action: "view",
          label: "View Map",
          url: `${window.location.origin}/map?report=${params.reportId}`,
        },
      ],
    }
  }

  /**
   * Create resolution notification
   * Triggered when report is marked as resolved
   */
  static createResolutionNotification(params: {
    topic: string
    reportId: string
    reportTitle: string
    resolvedBy: string
  }): INotification {
    return {
      topic: params.topic,
      title: "Report Resolved",
      message: `Your report "${params.reportTitle}" has been resolved by ${params.resolvedBy}`,
      priority: 4,
      tags: ["white_check_mark"],
      click: `${window.location.origin}/reports/${params.reportId}`,
    }
  }

  /**
   * Create mention notification
   * Triggered when user is mentioned in a comment
   */
  static createMentionNotification(params: {
    topic: string
    reportId: string
    mentionerName: string
    context: string
  }): INotification {
    return {
      topic: params.topic,
      title: "You were mentioned",
      message: `${params.mentionerName} mentioned you: "${params.context}"`,
      priority: 3,
      tags: ["loudspeaker"],
      click: `${window.location.origin}/reports/${params.reportId}`,
    }
  }
}
