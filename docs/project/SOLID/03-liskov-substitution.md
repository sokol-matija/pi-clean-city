# Liskov Substitution Principle (LSP)

## Definition

> "Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program."
> — Barbara Liskov

The Liskov Substitution Principle states that if S is a subtype of T, then objects of type T can be replaced with objects of type S without altering any of the desirable properties of the program.

## Problem: Bad Inheritance Hierarchies

A common LSP violation occurs when subclasses can't fully substitute for their parent class:

```typescript
// BAD: Inheritance that violates LSP
class Report {
  constructor(
    public title: string,
    public description: string,
    public location: { lat: number; lng: number },
    public userId: string
  ) {}

  getDistance(other: Report): number {
    // Calculate distance between locations
    return Math.sqrt(
      Math.pow(other.location.lat - this.location.lat, 2) +
      Math.pow(other.location.lng - this.location.lng, 2)
    )
  }

  submit(): Promise<void> {
    // Submit with user_id
    return database.insert({ ...this, user_id: this.userId })
  }
}

// VIOLATION: Anonymous reports don't have userId!
class AnonymousReport extends Report {
  constructor(title: string, description: string, location: { lat: number; lng: number }) {
    super(title, description, location, "") // Empty userId - hack!
  }

  submit(): Promise<void> {
    // Must override to handle missing userId
    throw new Error("Anonymous reports use submitAnonymously()") // Breaks LSP!
  }
}

// VIOLATION: Suggestions don't have location!
class SuggestionReport extends Report {
  constructor(title: string, description: string, userId: string) {
    super(title, description, { lat: 0, lng: 0 }, userId) // Fake location!
  }

  getDistance(other: Report): number {
    throw new Error("Suggestions don't have locations") // Breaks LSP!
  }
}
```

### Problems with This Approach

- **Exceptions in subclasses**: Methods throw errors instead of working
- **Fake data**: Must provide fake values to satisfy parent constructor
- **Broken polymorphism**: Can't use `Report[]` array safely
- **Runtime errors**: Bugs only discovered at runtime, not compile time

## Solution: Interface Composition

Instead of inheritance, we use **interface composition** to define capabilities:

### Capability Interfaces

```typescript
// src/features/reports/types/ReportInterfaces.ts

// Define CAPABILITIES, not hierarchies
interface Locatable {
  readonly latitude: number
  readonly longitude: number
  getDistanceFrom(other: Locatable): number
}

interface Photographable {
  readonly photoUrls: string[]
  getPhotoCount(): number
  hasPhotos(): boolean
}

interface UserOwned {
  readonly userId: string
  isOwnedBy(userId: string): boolean
}

interface Submittable {
  validate(): SubmissionValidationResult
  toSubmissionData(): Record<string, unknown>
}

// Base interface - minimal contract for ALL reports
interface BaseReport {
  readonly title: string
  readonly description: string
}
```

### Composed Report Types

```typescript
// Standard report - has ALL capabilities
interface StandardReport extends BaseReport, Locatable, Photographable, UserOwned, Submittable {
  readonly categoryId: number
}

// Anonymous report - has location and photos, but NO user
interface AnonymousReport extends BaseReport, Locatable, Photographable, Submittable {
  readonly categoryId: number
  // Note: NO UserOwned - anonymous reports don't have users
}

// Suggestion report - has user, but NO location or photos
interface SuggestionReport extends BaseReport, UserOwned, Submittable {
  readonly category: string
  // Note: NO Locatable or Photographable
}
```

### LSP-Compliant Implementations

```typescript
// src/features/reports/types/ReportImplementations.ts

class StandardReportImpl implements StandardReport {
  // Implements ALL methods fully - no exceptions, no fake data

  getDistanceFrom(other: Locatable): number {
    return haversineDistance(this.latitude, this.longitude, other.latitude, other.longitude)
  }

  isOwnedBy(userId: string): boolean {
    return this.userId === userId
  }

  // ... all other methods work correctly
}

class AnonymousReportImpl implements AnonymousReport {
  // Only implements what it CAN do
  // Does NOT implement UserOwned - and that's by design!

  getDistanceFrom(other: Locatable): number {
    return haversineDistance(this.latitude, this.longitude, other.latitude, other.longitude)
  }

  // No userId, no isOwnedBy - TypeScript enforces this
}

class SuggestionReportImpl implements SuggestionReport {
  // Only implements what it CAN do
  // Does NOT implement Locatable - and that's by design!

  isOwnedBy(userId: string): boolean {
    return this.userId === userId
  }

  // No location, no getDistanceFrom - TypeScript enforces this
}
```

### Functions That Accept Interfaces

```typescript
// These functions work with ANY type that satisfies the interface

// Works with StandardReport OR AnonymousReport
function calculateDistance(a: Locatable, b: Locatable): number {
  return a.getDistanceFrom(b)
}

// Works with StandardReport OR AnonymousReport
function getTotalPhotoCount(items: Photographable[]): number {
  return items.reduce((total, item) => total + item.getPhotoCount(), 0)
}

// Works with StandardReport OR SuggestionReport
function filterByOwner<T extends UserOwned>(items: T[], userId: string): T[] {
  return items.filter((item) => item.isOwnedBy(userId))
}

// Works with ALL report types
function validateAll(items: Submittable[]): SubmissionValidationResult {
  // ...
}
```

## LSP in Action

```typescript
// All these work correctly - LSP is satisfied!

const standard = new StandardReportImpl({ /* ... */ })
const anonymous = new AnonymousReportImpl({ /* ... */ })
const suggestion = new SuggestionReportImpl({ /* ... */ })

// Mix location-aware reports
const locatableReports: Locatable[] = [standard, anonymous]
const distance = calculateDistance(locatableReports[0], locatableReports[1]) // Works!

// Mix user-owned reports
const userReports: UserOwned[] = [standard, suggestion]
const myReports = filterByOwner(userReports, "user-123") // Works!

// All reports are submittable
const allReports: Submittable[] = [standard, anonymous, suggestion]
const validation = validateAll(allReports) // Works!

// TypeScript PREVENTS misuse:
// const bad: Locatable[] = [suggestion] // Compile error! Suggestions aren't Locatable
// const bad: UserOwned[] = [anonymous]  // Compile error! Anonymous aren't UserOwned
```

## Benefits Achieved

| Before (Bad Inheritance) | After (Interface Composition) |
|--------------------------|-------------------------------|
| Methods throw exceptions | All methods work correctly |
| Fake data in constructors | Only real data needed |
| Runtime errors | Compile-time errors |
| Tight coupling | Loose coupling |
| Hard to extend | Easy to add new types |

## Key Takeaways

1. **Prefer composition over inheritance**: Interfaces let you mix capabilities
2. **Don't force subclasses to lie**: If a type doesn't have location, don't make it implement Locatable
3. **Use TypeScript**: The type system catches LSP violations at compile time
4. **Think in capabilities**: Ask "what can this type DO?" not "what is this type?"
5. **Test substitutability**: If you can use type A where type B is expected, LSP is satisfied

## Related Files

- `src/features/reports/types/ReportInterfaces.ts` - Capability interfaces
- `src/features/reports/types/ReportImplementations.ts` - Concrete implementations
- `src/features/reports/types/ReportTypes.test.ts` - LSP tests
