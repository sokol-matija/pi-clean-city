const TOPIC_PREFIX = "pi-clean-city"

export function getUserTopic(username: string): string {
  const safeName = username
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9\-_.]/g, "")

  return `${TOPIC_PREFIX}-${safeName}`
}
