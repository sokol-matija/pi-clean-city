import { Fragment } from "react"

interface MentionTextProps {
  content: string
  className?: string
}

// Komponenta za renderanje teksta s highlightanim @userom
function MentionText({ content, className }: Readonly<MentionTextProps>) {
  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g // slova, brojevi, underscore i crtica
  mentionRegex.lastIndex = 0

  while ((match = mentionRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index))
    }

    const username = match[1]
    parts.push(
      <span
        key={`mention-${match.index}`}
        className="rounded bg-blue-100 px-1 font-medium text-blue-600"
      >
        @{username}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex))
  }

  return (
    <span className={className}>
      {parts.map((part, index) => (
        <Fragment key={typeof part === "string" ? `text-${index}-${part}` : `el-${index}`}>
          {part}
        </Fragment>
      ))}
    </span>
  )
}

export default MentionText
