# Open/Closed Principle (OCP)

## Definition

> "Software entities should be open for extension, but closed for modification."
> — Bertrand Meyer

The Open/Closed Principle states that you should be able to extend a system's behavior without modifying its existing code.

## Problem: AdminTicketsPage.tsx (Before Refactoring)

The original `AdminTicketsPage.tsx` had **if-else chains** for determining badge colors:

```typescript
// BAD: Must modify this function every time a new status is added
const getStatusColor = (statusName: string | undefined) => {
  if (!statusName) return "default"
  const name = statusName.toLowerCase()
  if (name.includes("new") || name.includes("open")) return "destructive"
  if (name.includes("progress")) return "default"
  if (name.includes("resolved")) return "default"
  if (name.includes("closed")) return "secondary"
  return "default"
}

// BAD: Must modify this function every time a new priority is added
const getPriorityColor = (priority: string | null | undefined) => {
  if (!priority) return "secondary"
  const p = priority.toLowerCase()
  if (p === "critical") return "destructive"
  if (p === "high") return "destructive"
  if (p === "medium") return "default"
  if (p === "low") return "secondary"
  return "secondary"
}
```

### Problems with If-Else Chains

- **Must modify code** to add new status/priority types
- **Growing if-else chains** become hard to maintain
- **Risk of regression**: Changing one case might break others
- **No type safety**: Typos in strings won't be caught
- **Violates OCP**: The function is "open for modification"

## Solution: Configuration-Based Approach

We replaced the if-else chains with **configuration objects**:

### Configuration File (`badgeConfig.ts`)

```typescript
// src/features/reports/config/badgeConfig.ts

// Configuration is OPEN for extension - just add new entries!
export const STATUS_BADGE_CONFIG: Record<string, BadgeVariant> = {
  new: "destructive",
  "in progress": "default",
  resolved: "secondary",
  closed: "outline",
  // Adding a new status? Just add a line here:
  // "escalated": "destructive",
}

export const PRIORITY_BADGE_CONFIG: Record<string, BadgeVariant> = {
  critical: "destructive",
  high: "destructive",
  medium: "default",
  low: "secondary",
  // Adding a new priority? Just add a line here:
  // "urgent": "destructive",
}

// Resolver functions are CLOSED for modification - they never change!
export function getStatusBadgeVariant(statusName: string | undefined | null): BadgeVariant {
  if (!statusName) return DEFAULT_STATUS_VARIANT
  const normalizedStatus = statusName.toLowerCase().trim()
  return STATUS_BADGE_CONFIG[normalizedStatus] ?? DEFAULT_STATUS_VARIANT
}

export function getPriorityBadgeVariant(priority: string | undefined | null): BadgeVariant {
  if (!priority) return DEFAULT_PRIORITY_VARIANT
  const normalizedPriority = priority.toLowerCase().trim()
  return PRIORITY_BADGE_CONFIG[normalizedPriority] ?? DEFAULT_PRIORITY_VARIANT
}
```

### Usage in Component

```typescript
// src/pages/AdminTicketsPage.tsx
import { getStatusBadgeVariant, getPriorityBadgeVariant } from "@/features/reports/config/badgeConfig"

// In the component:
<Badge variant={getStatusBadgeVariant(report.status?.name)}>
  {report.status?.name || "Unknown"}
</Badge>

<Badge variant={getPriorityBadgeVariant(report.priority)}>
  {report.priority || "N/A"}
</Badge>
```

## How to Extend (Without Modification)

### Adding a New Status

1. Add to database:
```sql
INSERT INTO status (name, color, description, sort_order)
VALUES ('Escalated', '#ff0000', 'Escalated to management', 5);
```

2. Add to config (one line):
```typescript
export const STATUS_BADGE_CONFIG: Record<string, BadgeVariant> = {
  // ... existing entries
  escalated: "destructive", // NEW - no other changes needed!
}
```

**No modification to resolver functions or component code!**

### Adding a New Priority

```typescript
export const PRIORITY_BADGE_CONFIG: Record<string, BadgeVariant> = {
  // ... existing entries
  urgent: "destructive", // NEW - no other changes needed!
}
```

## Benefits Achieved

| Before (If-Else) | After (Configuration) |
|------------------|----------------------|
| Modify code for new types | Add config entry only |
| Growing if-else chains | Simple key-value lookup |
| Risk of regression | Isolated changes |
| No compile-time safety | TypeScript checks config |
| Hard to test | Config and logic separate |

## Database Integration

The configuration aligns with the actual database values:

```sql
-- Current statuses in database
SELECT * FROM status ORDER BY sort_order;

-- id | name        | color    | description
-- 1  | New         | #ff6b6b  | Newly submitted report
-- 2  | In Progress | #ffd93d  | Being worked on
-- 3  | Resolved    | #6bcf7f  | Problem fixed
-- 4  | Closed      | #95a5a6  | Closed and verified
```

## Unit Tests

```typescript
describe("Badge Configuration (Open/Closed Principle)", () => {
  it("should return destructive for 'New' status", () => {
    expect(getStatusBadgeVariant("New")).toBe("destructive")
    expect(getStatusBadgeVariant("new")).toBe("destructive") // case-insensitive
  })

  it("demonstrates extensibility: adding new status requires only config change", () => {
    // The resolver function never needs to change
    // Just add: STATUS_BADGE_CONFIG["escalated"] = "destructive"
    const configKeysCount = Object.keys(STATUS_BADGE_CONFIG).length
    expect(configKeysCount).toBeGreaterThanOrEqual(4)
  })
})
```

## Key Takeaways

1. **Configuration over code**: Use data structures instead of conditionals
2. **Separate what changes from what doesn't**: Config changes frequently, resolvers don't
3. **Strategy Pattern**: The config acts as a strategy lookup table
4. **Default handling**: Always have fallbacks for unknown values
5. **Case-insensitive**: Normalize inputs to prevent bugs

## Related Files

- `src/features/reports/config/badgeConfig.ts` - Configuration and resolvers
- `src/features/reports/config/badgeConfig.test.ts` - Unit tests
- `src/pages/AdminTicketsPage.tsx` - Component using the config
