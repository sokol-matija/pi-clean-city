# Dependency Inversion Principle (DIP)

## Definition

> "High-level modules should not depend on low-level modules. Both should depend on abstractions.
> Abstractions should not depend on details. Details should depend on abstractions."
> — Robert C. Martin

The Dependency Inversion Principle states that code should depend on abstractions (interfaces) rather than concrete implementations.

## Problem: Direct Supabase Dependencies

Throughout the application, components and hooks directly import and use Supabase:

```typescript
// BAD: useCreateReport.ts - Direct dependency on Supabase
import { supabase } from "@/lib/supabase"  // Low-level module!

export function useCreateReport() {
  return useMutation({
    mutationFn: async ({ report, photos }) => {
      // Tightly coupled to Supabase API
      const { data, error } = await supabase
        .from("report")
        .insert(report)
        .select()
        .single()

      if (error) throw error

      // More Supabase-specific code...
      if (photos) {
        await supabase.storage.from("report-photos").upload(...)
      }

      return data
    },
  })
}
```

### Problems with Direct Dependencies

- **Can't test without Supabase**: Need real database for tests
- **Can't switch backends**: Locked into Supabase forever
- **Business logic mixed with data access**: Hard to understand and maintain
- **No mocking**: Can't use mock data in development
- **Changes propagate everywhere**: Supabase API change affects every file

## Solution: Repository Pattern with Interfaces

### Step 1: Define Abstractions (Interfaces)

```typescript
// src/features/reports/repositories/IReportRepository.ts

/**
 * Report repository interface - the ABSTRACTION.
 * High-level modules depend on this, not on Supabase.
 */
export interface IReportRepository {
  create(report: Insertable<"report">): Promise<Report>
  findById(id: string): Promise<Report | null>
  findAll(filters?: ReportFilters): Promise<Report[]>
  update(id: string, data: Partial<Report>): Promise<Report>
  delete(id: string): Promise<void>
}

export interface IPhotoStorage {
  upload(path: string, file: File): Promise<string>
  delete(path: string): Promise<void>
  getPublicUrl(path: string): string
}
```

### Step 2: Create Concrete Implementations

```typescript
// src/features/reports/repositories/SupabaseReportRepository.ts

/**
 * Supabase implementation - the DETAIL.
 * Contains all Supabase-specific code.
 */
export class SupabaseReportRepository implements IReportRepository {
  async create(report: Insertable<"report">): Promise<Report> {
    const { data, error } = await supabase
      .from("report")
      .insert(report)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async findById(id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from("report")
      .select("*")
      .eq("id", id)
      .single()

    if (error?.code === "PGRST116") return null
    if (error) throw new Error(error.message)
    return data
  }

  // ... other methods
}
```

### Step 3: Create Mock Implementations (for Testing)

```typescript
// src/features/reports/repositories/MockReportRepository.ts

/**
 * Mock implementation - another DETAIL.
 * Used for testing without a database.
 */
export class MockReportRepository implements IReportRepository {
  private reports: Map<string, Report> = new Map()

  async create(report: Insertable<"report">): Promise<Report> {
    const newReport = { ...report, id: `mock-${Date.now()}` } as Report
    this.reports.set(newReport.id, newReport)
    return newReport
  }

  async findById(id: string): Promise<Report | null> {
    return this.reports.get(id) || null
  }

  // ... other methods
}
```

### Step 4: Dependency Injection via Context

```typescript
// src/features/reports/repositories/RepositoryContext.tsx

const RepositoryContext = createContext<{
  reportRepository: IReportRepository
  photoStorage: IPhotoStorage
} | null>(null)

export function RepositoryProvider({ children, reportRepository, photoStorage }) {
  const value = useMemo(() => ({
    reportRepository: reportRepository ?? new SupabaseReportRepository(),
    photoStorage: photoStorage ?? new SupabasePhotoStorage(),
  }), [reportRepository, photoStorage])

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  )
}

export function useReportRepository(): IReportRepository {
  const context = useContext(RepositoryContext)
  if (!context) throw new Error("Must be within RepositoryProvider")
  return context.reportRepository
}
```

### Step 5: Use Abstractions in Hooks

```typescript
// GOOD: useCreateReport.ts - Depends on abstraction
import { useReportRepository, usePhotoStorage } from "./RepositoryContext"

export function useCreateReport() {
  const repository = useReportRepository()  // Interface, not Supabase!
  const storage = usePhotoStorage()

  return useMutation({
    mutationFn: async ({ report, photos }) => {
      // Uses interface methods, knows nothing about Supabase
      const newReport = await repository.create(report)

      if (photos) {
        for (const photo of photos) {
          const url = await storage.upload(`reports/${newReport.id}/${photo.name}`, photo)
          // ...
        }
      }

      return newReport
    },
  })
}
```

## DIP in Action

### Production Usage

```tsx
// main.tsx - Production uses Supabase implementations (default)
<RepositoryProvider>
  <App />
</RepositoryProvider>
```

### Testing Usage

```tsx
// Component.test.tsx - Tests use mock implementations
import { MockReportRepository } from "./MockReportRepository"

const mockRepo = new MockReportRepository()

render(
  <RepositoryProvider reportRepository={mockRepo}>
    <ComponentUnderTest />
  </RepositoryProvider>
)
```

### Swapping Databases

```typescript
// If we ever switch to Firebase, we just create:
class FirebaseReportRepository implements IReportRepository {
  // Firebase-specific implementation
}

// And inject it:
<RepositoryProvider reportRepository={new FirebaseReportRepository()}>
  <App />
</RepositoryProvider>

// NO CHANGES to business logic, hooks, or components!
```

## Benefits Achieved

| Before (Direct Supabase) | After (DIP with Interfaces) |
|--------------------------|----------------------------|
| Can't test without DB | Mock implementations for testing |
| Locked to Supabase | Can switch databases easily |
| Business logic mixed with DB | Clean separation |
| Supabase everywhere | Supabase isolated in one place |
| Hard to refactor | Easy to change implementations |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    High-Level Modules                    │
│  (Components, Hooks, Business Logic)                    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ useCreate   │  │ useReports  │  │ Component   │     │
│  │ Report      │  │             │  │             │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
└─────────┼────────────────┼────────────────┼─────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────┐
│                    Abstractions                          │
│  ┌─────────────────┐    ┌─────────────────┐             │
│  │ IReportRepository│    │  IPhotoStorage  │             │
│  └────────┬────────┘    └────────┬────────┘             │
└───────────┼──────────────────────┼──────────────────────┘
            │                      │
    ┌───────┴───────┐      ┌───────┴───────┐
    │               │      │               │
    ▼               ▼      ▼               ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ Supabase   │ │   Mock     │ │ Supabase   │ │   Mock     │
│ Report     │ │ Report     │ │ Photo      │ │ Photo      │
│ Repository │ │ Repository │ │ Storage    │ │ Storage    │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
    Low-Level Modules (Details)
```

## Key Takeaways

1. **High-level modules** (hooks, components) should not import low-level modules (Supabase)
2. **Create interfaces** that define the contract for data operations
3. **Concrete implementations** (Supabase, Mock) implement these interfaces
4. **Inject dependencies** via Context or constructor parameters
5. **Test with mocks**, deploy with real implementations

## Related Files

- `src/features/reports/repositories/IReportRepository.ts` - Interfaces (abstractions)
- `src/features/reports/repositories/SupabaseReportRepository.ts` - Supabase implementation
- `src/features/reports/repositories/MockReportRepository.ts` - Mock implementation
- `src/features/reports/repositories/RepositoryContext.tsx` - Dependency injection
- `src/features/reports/repositories/Repository.test.ts` - DIP tests
