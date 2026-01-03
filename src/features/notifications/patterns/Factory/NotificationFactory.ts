import type { INotification } from "../../types"

export type NotificationType = "comment" | "status_update" | "assignment" | "resolution" | "mention"

export class NotificationFactory {
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
      click: `${window.location.origin}/report/${params.reportId}`,
      actions: [
        {
          action: "view",
          label: "View Report",
          url: `${window.location.origin}/report/${params.reportId}`,
        },
        {
          action: "view",
          label: "Reply",
          url: `${window.location.origin}/report/${params.reportId}#comments`,
        },
      ],
    }
  }

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
      click: `${window.location.origin}/report/${params.reportId}`,
    }
  }

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
      click: `${window.location.origin}/report/${params.reportId}`,
      actions: [
        {
          action: "view",
          label: "View Report",
          url: `${window.location.origin}/report/${params.reportId}`,
        },
        {
          action: "view",
          label: "View Map",
          url: `${window.location.origin}/map?report=${params.reportId}`,
        },
      ],
    }
  }

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
      click: `${window.location.origin}/report/${params.reportId}`,
    }
  }

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
      click: `${window.location.origin}/report/${params.reportId}`,
    }
  }
}
