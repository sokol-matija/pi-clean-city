# Interface Segregation Principle (ISP)

## Definition

> "Clients should not be forced to depend on interfaces they do not use."
> — Robert C. Martin

The Interface Segregation Principle states that no client should be forced to depend on methods it doesn't use. Instead of one large interface, many smaller, specific interfaces are preferred.

## Problem: Fat Interface

A common ISP violation is the "fat interface" - one large interface that includes methods for all possible operations:

```typescript
// BAD: Fat interface that forces all implementations to include everything
interface IReportOperations {
  // Reading (everyone needs)
  getReport(id: string): Promise<Report>
  getReports(filters?: Filters): Promise<Report[]>

  // Creating (citizens need)
  createReport(data: CreateData): Promise<Report>

  // Photos (citizens need)
  uploadPhoto(reportId: string, file: File): Promise<Photo>
  deletePhoto(photoId: string): Promise<void>

  // Comments (everyone needs)
  addComment(reportId: string, content: string): Promise<Comment>

  // Admin only - but everyone has to implement!
  updateStatus(reportId: string, statusId: number): Promise<Report>
  assignWorker(reportId: string, workerId: string): Promise<Report>
  deleteReport(reportId: string): Promise<void>

  // Analytics - admin only, but everyone has to implement!
  getStatistics(): Promise<Stats>
  exportToCSV(): Promise<string>
}

// Citizen implementation - forced to have methods it can't use!
class CitizenService implements IReportOperations {
  // These work...
  async getReport(id: string) { /* ... */ }
  async createReport(data: CreateData) { /* ... */ }
  async uploadPhoto(reportId: string, file: File) { /* ... */ }

  // But these throw errors - BAD!
  async updateStatus() {
    throw new Error("Citizens cannot update status")
  }
  async assignWorker() {
    throw new Error("Citizens cannot assign workers")
  }
  async getStatistics() {
    throw new Error("Citizens cannot access statistics")
  }
  // ... more "not implemented" methods
}
```

### Problems with Fat Interfaces

- **Forced dependencies**: Citizens depend on admin methods they can't use
- **Runtime errors**: "Not implemented" exceptions instead of compile-time safety
- **Coupling**: Changes to admin methods affect citizen code
- **Testing burden**: Must mock methods that aren't used
- **Violates LSP**: Implementations that throw exceptions can't substitute properly

## Solution: Segregated Interfaces

Split the fat interface into focused, role-specific interfaces:

### Small, Focused Interfaces

```typescript
// src/features/reports/interfaces/ReportOperations.ts

// Read-only operations
interface IReportReader {
  getReport(id: string): Promise<Report | null>
  getReports(filters?: ReportFilters): Promise<Report[]>
}

// Create operations
interface IReportCreator {
  createReport(data: CreateReportData): Promise<Report>
}

// Update operations
interface IReportUpdater {
  updateReport(id: string, data: Partial<Report>): Promise<Report>
}

// Photo operations
interface IPhotoManager {
  uploadPhoto(reportId: string, file: File): Promise<Photo>
  deletePhoto(photoId: string): Promise<void>
}

// Comment operations
interface ICommentManager {
  addComment(reportId: string, content: string, userId: string): Promise<Comment>
  getComments(reportId: string): Promise<Comment[]>
}

// Admin-only operations
interface IReportAdmin {
  updateStatus(reportId: string, statusId: number): Promise<Report>
  assignWorker(reportId: string, workerId: string): Promise<Report>
  deleteReport(reportId: string): Promise<void>
}

// Analytics - admin only
interface IReportAnalytics {
  getStatistics(filters?: ReportFilters): Promise<ReportStats>
  exportToCSV(filters?: ReportFilters): Promise<string>
}
```

### Role-Based Composed Interfaces

```typescript
// Citizen service - only what citizens need
interface ICitizenReportService
  extends IReportReader,    // Can read reports
          IReportCreator,   // Can create reports
          IPhotoManager,    // Can manage photos
          ICommentManager { // Can comment
  // NO IReportAdmin, NO IReportAnalytics
}

// Worker service - only what workers need
interface IWorkerReportService
  extends IReportReader,    // Can read reports
          IReportUpdater,   // Can update reports
          ICommentManager { // Can comment
  // NO IReportCreator, NO IReportAdmin, NO IReportAnalytics
}

// Admin service - full access
interface IAdminReportService
  extends IReportReader,
          IReportCreator,
          IReportUpdater,
          IPhotoManager,
          ICommentManager,
          IReportAdmin,      // Admin operations
          IReportAnalytics { // Analytics access
  // Everything!
}
```

### Clean Implementations

```typescript
// Citizen service - implements ONLY citizen interfaces
class CitizenReportService implements ICitizenReportService {
  // IReportReader
  async getReport(id: string): Promise<Report | null> { /* ... */ }
  async getReports(filters?: ReportFilters): Promise<Report[]> { /* ... */ }

  // IReportCreator
  async createReport(data: CreateReportData): Promise<Report> { /* ... */ }

  // IPhotoManager
  async uploadPhoto(reportId: string, file: File): Promise<Photo> { /* ... */ }
  async deletePhoto(photoId: string): Promise<void> { /* ... */ }

  // ICommentManager
  async addComment(reportId: string, content: string, userId: string): Promise<Comment> { /* ... */ }
  async getComments(reportId: string): Promise<Comment[]> { /* ... */ }

  // NO updateStatus, assignWorker, getStatistics - not in interface!
  // TypeScript prevents calling these methods at compile time.
}
```

## ISP in Action

### Functions Accept Minimal Interfaces

```typescript
// Function only needs reading capability
async function countReports(reader: IReportReader): Promise<number> {
  const reports = await reader.getReports()
  return reports.length
}

// ALL services can be passed - they all implement IReportReader
await countReports(citizenService)  // Works!
await countReports(workerService)   // Works!
await countReports(adminService)    // Works!
```

### Type System Prevents Misuse

```typescript
// Function requires admin capabilities
async function performAdminTask(admin: IReportAdmin): Promise<void> {
  await admin.updateStatus("1", 2)
  await admin.assignWorker("1", "worker-1")
}

await performAdminTask(adminService)   // Works!
await performAdminTask(citizenService) // Compile error! Missing IReportAdmin
await performAdminTask(workerService)  // Compile error! Missing IReportAdmin
```

### Compose Interfaces for Specific Needs

```typescript
// A function that needs both reading and analytics
type ReportAnalyst = IReportReader & IReportAnalytics

async function analyzeReports(analyst: ReportAnalyst): Promise<void> {
  const reports = await analyst.getReports()
  const stats = await analyst.getStatistics()
  // ...
}

await analyzeReports(adminService)    // Works! Admin has both
await analyzeReports(citizenService)  // Compile error! Missing IReportAnalytics
```

## Benefits Achieved

| Before (Fat Interface) | After (Segregated Interfaces) |
|------------------------|-------------------------------|
| 15+ methods in one interface | 2-4 methods per interface |
| "Not implemented" exceptions | Compile-time errors |
| All roles depend on all methods | Each role depends only on what it uses |
| Changes affect everyone | Changes are isolated |
| Hard to test | Easy to mock specific interfaces |

## Role Capabilities Matrix

| Capability | Citizen | Worker | Admin |
|------------|---------|--------|-------|
| Read reports | ✅ | ✅ | ✅ |
| Create reports | ✅ | ❌ | ✅ |
| Update reports | ❌ | ✅ | ✅ |
| Upload photos | ✅ | ❌ | ✅ |
| Add comments | ✅ | ✅ | ✅ |
| Change status | ❌ | ❌ | ✅ |
| Assign workers | ❌ | ❌ | ✅ |
| Delete reports | ❌ | ❌ | ✅ |
| View analytics | ❌ | ❌ | ✅ |
| Export data | ❌ | ❌ | ✅ |

## Key Takeaways

1. **Prefer many small interfaces over one large interface**
2. **Design interfaces around client needs**, not implementations
3. **Use TypeScript** to enforce interface segregation at compile time
4. **Compose interfaces** using `extends` for role-specific combinations
5. **No "not implemented" methods** - if a type doesn't support an operation, don't include it in the interface

## Related Files

- `src/features/reports/interfaces/ReportOperations.ts` - Segregated interfaces
- `src/features/reports/interfaces/ReportOperations.test.ts` - ISP tests
