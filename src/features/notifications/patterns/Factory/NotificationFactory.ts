import type { INotification } from "../../types"

export const createCommentNotification = (params: {
  topic: string
  reportId: string
  commenterName: string
  commentPreview: string
  reportTitle: string
}): INotification => {
  return {
    topic: params.topic,
    title: "New Comment",
    message: `${params.commenterName} commented: "${params.commentPreview}"`,
    priority: 3,
    tags: ["speech_balloon"],
    click: `${globalThis.location.origin}/report/${params.reportId}`,
    actions: [
      {
        action: "view",
        label: "View Report",
        url: `${globalThis.location.origin}/report/${params.reportId}`,
      },
      {
        action: "view",
        label: "Reply",
        url: `${globalThis.location.origin}/report/${params.reportId}#comments`,
      },
    ],
  }
}
