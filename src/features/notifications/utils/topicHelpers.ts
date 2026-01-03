const TOPIC_PREFIX = "pi-clean-city"

export function getUserTopic(username: string): string {
  const safeName = username
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_.]/g, "")

  return `${TOPIC_PREFIX}-${safeName}`
}
