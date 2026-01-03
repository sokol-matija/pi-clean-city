# Design Patterns - Complete Guide with Real Examples

This document explains all design patterns implemented in the Pi Clean City project, with real code examples from our codebase.

---

## Table of Contents

### Creational Patterns (How objects are created)

1. [Factory Pattern](#1-factory-pattern-creational)
2. [Builder Pattern](#2-builder-pattern-creational)
3. [Singleton Pattern](#3-singleton-pattern-creational)

### Structural Patterns (How objects are composed)

4. [Repository Pattern](#4-repository-pattern-structural)
5. [Adapter Pattern](#5-adapter-pattern-structural)
6. [Dependency Injection](#6-dependency-injection-pattern-structural)

### Behavioral Patterns (How objects communicate)

7. [Strategy Pattern](#7-strategy-pattern-behavioral)

---

# CREATIONAL PATTERNS

Creational patterns deal with **object creation mechanisms**, trying to create objects in a manner suitable to the situation.

---

## 1. Factory Pattern (Creational)

### What is it?

The Factory Pattern is a creational pattern that **provides an interface for creating objects** without specifying the exact class of object that will be created. Think of it as a "factory" that produces objects based on what you request.

### Why use it?

- ✅ Centralizes object creation logic
- ✅ Makes code more flexible (easy to add new types)
- ✅ Reduces code duplication
- ✅ Follows Open/Closed Principle (open for extension, closed for modification)

### Real Example from Our Code

**Location:** `src/features/community/services/PostFormatter.ts:136-146`

```typescript
// Factory function that creates different formatters based on type
export function createFormatter(type: "standard" | "relative" | "compact"): IPostFormatter {
  switch (type) {
    case "relative":
      return new RelativeTimePostFormatter()
    case "compact":
      return new CompactPostFormatter()
    default:
      return new StandardPostFormatter()
  }
}
```

**Usage Example:**

```typescript
// Instead of doing this (tightly coupled):
const formatter = new StandardPostFormatter()

// We do this (flexible):
const formatter = createFormatter("relative") // Easy to switch types!
```

**Another Factory Example:**
`src/features/reports/repositories/SupabaseReportRepository.ts:170-180`

```typescript
// Factory functions for creating repositories
export function createSupabaseReportRepository(): IReportRepository {
  return new SupabaseReportRepository()
}

export function createSupabasePhotoStorage(): IPhotoStorage {
  return new SupabasePhotoStorage()
}

export function createSupabasePhotoRepository(): IPhotoRepository {
  return new SupabasePhotoRepository()
}
```

### How it Works

```
User Request → Factory Function → Correct Object Created
              ↓
         "relative"  →  RelativeTimePostFormatter
         "compact"   →  CompactPostFormatter
         "standard"  →  StandardPostFormatter
```

---

## 2. Builder Pattern (Creational)

### What is it?

The Builder Pattern allows you to **construct complex objects step by step**. Instead of creating an object with one giant constructor call, you build it piece by piece using a chainable API.

### Why use it?

- ✅ Makes object creation more readable
- ✅ Allows optional parameters elegantly
- ✅ Can validate during construction
- ✅ Chainable API is intuitive

### Real Example from Our Code

**Location:** `src/features/community/services/PostValidator.ts:86-109`

```typescript
export class PostValidator {
  private rules: IValidationRule[] = []

  // Builder method - returns 'this' for chaining!
  addRule(rule: IValidationRule): PostValidator {
    this.rules.push(rule)
    return this // ← Key to the Builder Pattern!
  }

  validate(data: CreatePostData): ValidationResult {
    const allErrors: string[] = []
    for (const rule of this.rules) {
      const result = rule.validate(data)
      if (!result.isValid) {
        allErrors.push(...result.errors)
      }
    }
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    }
  }
}
```

**Factory Functions Using Builder:**

```typescript
// Build a basic validator step by step
export function createBasicValidator(): PostValidator {
  return new PostValidator().addRule(new RequiredFieldsRule()).addRule(new MinLengthRule(3, 10))
}

// Build a strict validator with more rules
export function createStrictValidator(): PostValidator {
  return new PostValidator()
    .addRule(new RequiredFieldsRule())
    .addRule(new MinLengthRule(5, 50))
    .addRule(new NoSpamRule())
}
```

**Usage Example:**

```typescript
// Build your validator exactly how you want it
const validator = new PostValidator()
  .addRule(new RequiredFieldsRule())
  .addRule(new MinLengthRule(5, 20))
  .addRule(new NoSpamRule())

// Validate data
const result = validator.validate({
  title: "My Post",
  content: "Some content here",
})

if (!result.isValid) {
  console.log(result.errors) // Array of validation errors
}
```

### How it Works

```
new PostValidator()
  ↓
.addRule(rule1)  → Returns PostValidator instance
  ↓
.addRule(rule2)  → Returns PostValidator instance
  ↓
.addRule(rule3)  → Returns PostValidator instance
  ↓
.validate(data)  → Final result
```

---

## 3. Singleton Pattern (Creational)

### What is it?

The Singleton Pattern ensures **only one instance of a class exists** throughout the entire application. Everyone who needs that object gets the same instance.

### Why use it?

- ✅ Ensures single source of truth (e.g., database connection)
- ✅ Saves memory (no duplicate instances)
- ✅ Provides global access point
- ✅ Perfect for shared resources

### Real Example from Our Code

**Location:** `src/lib/supabase.ts:1-19`

```typescript
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// ⭐ SINGLETON: Created once, exported, reused everywhere
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: "cleancity-auth",
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
```

**Why This is a Singleton:**

- The `supabase` client is created **once** when the module loads
- Every file that imports it gets the **same instance**
- This ensures all database queries use the same connection pool

**Usage Example:**

```typescript
// File 1
import { supabase } from "@/lib/supabase"
const user = await supabase.auth.getUser()

// File 2
import { supabase } from "@/lib/supabase" // ← Same instance!
const data = await supabase.from("report").select()

// Both files share the SAME supabase client instance
```

### How it Works

```
First Import:
  import { supabase } → Creates client instance → Stores in memory
                                                         ↓
Second Import:                                           |
  import { supabase } → Returns SAME instance ←----------┘
```

---

# STRUCTURAL PATTERNS

Structural patterns deal with **object composition**, creating relationships between objects to form larger structures.

---

## 4. Repository Pattern (Structural)

### What is it?

The Repository Pattern **encapsulates data access logic**, providing a collection-like interface for accessing domain objects. It acts as a middle layer between your business logic and data access.

### Why use it?

- ✅ Separates business logic from data access
- ✅ Makes testing easier (can swap with mock)
- ✅ Centralizes data queries
- ✅ Can switch databases without changing business logic
- ✅ Follows Single Responsibility Principle

### Real Example from Our Code

#### Step 1: Define the Interface (Contract)

**Location:** `src/features/reports/repositories/IReportRepository.ts:1-33`

```typescript
// Interface defines WHAT operations are available
// It doesn't care HOW they're implemented
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

export interface IPhotoRepository {
  create(photo: Insertable<"photo">): Promise<Photo>
  findByReportId(reportId: string): Promise<Photo[]>
  delete(id: string): Promise<void>
}
```

#### Step 2: Implement the Repository (Supabase Version)

**Location:** `src/features/reports/repositories/SupabaseReportRepository.ts:10-99`

```typescript
// Concrete implementation using Supabase
export class SupabaseReportRepository implements IReportRepository {
  async create(report: Insertable<"report">): Promise<Report> {
    const { data, error } = await supabase.from("report").insert(report).select().single()

    if (error) {
      throw new Error(`Failed to create report: ${error.message}`)
    }
    return data
  }

  async findById(id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from("report")
      .select("*, category(*), status(*)")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null
      throw new Error(`Failed to find report: ${error.message}`)
    }
    return data
  }

  async findAll(filters?: ReportFilters): Promise<Report[]> {
    let query = supabase
      .from("report")
      .select("*, category(*), status(*)")
      .order(filters?.orderBy || "created_at", {
        ascending: filters?.orderDirection === "asc",
      })

    // Apply filters
    if (filters?.statusId) query = query.eq("status_id", filters.statusId)
    if (filters?.categoryId) query = query.eq("category_id", filters.categoryId)
    if (filters?.userId) query = query.eq("user_id", filters.userId)

    const { data, error } = await query
    if (error) throw new Error(`Failed to fetch reports: ${error.message}`)
    return data || []
  }

  async update(id: string, data: Partial<Report>): Promise<Report> {
    const { data: updated, error } = await supabase
      .from("report")
      .update(data)
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update report: ${error.message}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("report").delete().eq("id", id)
    if (error) throw new Error(`Failed to delete report: ${error.message}`)
  }
}
```

#### Step 3: Use the Repository

```typescript
// In your React hooks or services
import { useReportRepository } from "./useRepositories"

export function useCreateReport() {
  const repository = useReportRepository()

  return useMutation({
    mutationFn: async (data) => {
      // Uses the repository interface - doesn't know about Supabase!
      return await repository.create(data)
    },
  })
}
```

### Benefits Visualization

```
❌ WITHOUT Repository Pattern:
Component → Directly calls Supabase → Database
  ↓
  Tightly coupled, hard to test, hard to change database

✅ WITH Repository Pattern:
Component → Repository Interface → Implementation → Database
                                        ↓
                                   Can be: Supabase
                                           MongoDB
                                           MockRepository
                                           LocalStorage
```

---

## 5. Adapter Pattern (Structural)

### What is it?

The Adapter Pattern allows **objects with incompatible interfaces to work together**. It wraps an object and provides a different interface that clients expect. Think of it like a power adapter for different countries.

### Why use it?

- ✅ Makes incompatible interfaces compatible
- ✅ Allows reuse of existing code
- ✅ Follows Open/Closed Principle
- ✅ Multiple adapters can provide different "views" of the same data

### Real Example from Our Code

**Location:** `src/features/community/services/PostFormatter.ts:1-147`

#### The Interface (What Clients Expect)

```typescript
// All adapters must implement this interface
export interface IPostFormatter {
  formatDate(dateString: string): string
  formatContent(content: string, maxLength?: number): string
  formatPost(post: PostWithProfile): FormattedPost
}

export interface FormattedPost {
  id: number
  title: string
  content: string
  excerpt: string
  formattedDate: string
  authorName: string
  authorAvatar: string
}
```

#### Base Adapter (Abstract Class)

```typescript
export abstract class BasePostFormatter implements IPostFormatter {
  abstract formatDate(dateString: string): string
  abstract formatContent(content: string, maxLength?: number): string
  abstract formatPost(post: PostWithProfile): FormattedPost

  // Shared helper method
  protected createExcerpt(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + "..."
  }
}
```

#### Adapter 1: Standard Format

```typescript
// Adapts post data to a standard format
export class StandardPostFormatter extends BasePostFormatter {
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("hr-HR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  formatContent(content: string, maxLength?: number): string {
    if (maxLength && content.length > maxLength) {
      return content.substring(0, maxLength) + "..."
    }
    return content
  }

  formatPost(post: PostWithProfile): FormattedPost {
    return {
      id: post.id,
      title: post.title,
      content: this.formatContent(post.content),
      excerpt: this.createExcerpt(post.content),
      formattedDate: this.formatDate(post.created_at),
      authorName: post.user?.username || "Anonymous",
      authorAvatar: post.user?.avatar_url || "/default-avatar.jpg",
    }
  }
}
```

#### Adapter 2: Relative Time Format

```typescript
// Adapts the SAME data to a different format (relative time)
export class RelativeTimePostFormatter extends BasePostFormatter {
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "upravo sada"
    if (diffInSeconds < 3600) return `prije ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `prije ${Math.floor(diffInSeconds / 3600)} h`
    if (diffInSeconds < 604800) return `prije ${Math.floor(diffInSeconds / 86400)} dana`

    return date.toLocaleDateString("hr-HR")
  }

  formatContent(content: string, maxLength?: number): string {
    // Same as standard
    if (maxLength && content.length > maxLength) {
      return content.substring(0, maxLength) + "..."
    }
    return content
  }

  formatPost(post: PostWithProfile): FormattedPost {
    return {
      id: post.id,
      title: post.title,
      content: this.formatContent(post.content),
      excerpt: this.createExcerpt(post.content, 150), // Longer excerpt
      formattedDate: this.formatDate(post.created_at), // Relative time!
      authorName: post.user?.username || "Anonimno",
      authorAvatar: post.user?.avatar_url || "/default-avatar.jpg",
    }
  }
}
```

#### Adapter 3: Compact Format

```typescript
// Adapts to a compact, mobile-friendly format
export class CompactPostFormatter extends BasePostFormatter {
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit", // Short date: "23.12"
    })
  }

  formatContent(content: string, maxLength: number = 50): string {
    return this.createExcerpt(content, maxLength) // Always truncated
  }

  formatPost(post: PostWithProfile): FormattedPost {
    return {
      id: post.id,
      title: post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title, // Compact title
      content: this.formatContent(post.content, 50), // Short content
      excerpt: this.createExcerpt(post.content, 50),
      formattedDate: this.formatDate(post.created_at),
      authorName: post.user?.username?.substring(0, 10) || "Anon", // Short name
      authorAvatar: post.user?.avatar_url || "/default-avatar.jpg",
    }
  }
}
```

### Usage Example

```typescript
// Get the same post formatted in different ways
const post = {
  id: 1,
  title: "Important Announcement",
  content: "This is a very important announcement about...",
  created_at: "2024-01-15T10:30:00Z",
  user: { username: "john_doe", avatar_url: "/john.jpg" },
}

// Standard format
const standardFormatter = new StandardPostFormatter()
console.log(standardFormatter.formatPost(post))
// Output: formattedDate: "15. siječnja 2024."

// Relative time format
const relativeFormatter = new RelativeTimePostFormatter()
console.log(relativeFormatter.formatPost(post))
// Output: formattedDate: "prije 2 h"

// Compact format
const compactFormatter = new CompactPostFormatter()
console.log(compactFormatter.formatPost(post))
// Output: { title: "Important Announcemen...", formattedDate: "15.01" }
```

### How it Works

```
Same Raw Data (PostWithProfile)
        ↓
   ┌────┴────┬──────────┐
   ↓         ↓          ↓
Standard  Relative  Compact
Adapter   Adapter   Adapter
   ↓         ↓          ↓
"15. siječnja" "prije 2h" "15.01"
```

### Why This is Adapter Pattern

The adapters take incompatible raw post data (`PostWithProfile`) and **adapt** it to the format clients expect (`FormattedPost`). Each adapter provides a different "view" of the same data:

- **StandardPostFormatter**: Full, formal display
- **RelativeTimePostFormatter**: Social media style
- **CompactPostFormatter**: Mobile-friendly

---

## 6. Dependency Injection Pattern (Structural)

### What is it?

Dependency Injection (DI) is a pattern where **objects receive their dependencies from external sources** rather than creating them internally. Instead of `new MyDatabase()` inside your class, you pass the database in from outside.

### Why use it?

- ✅ Makes code testable (easy to inject mocks)
- ✅ Reduces coupling between classes
- ✅ Makes dependencies explicit
- ✅ Follows Dependency Inversion Principle
- ✅ Easier to swap implementations

### Real Example from Our Code

**Location:** `src/features/reports/repositories/RepositoryContext.tsx:1-136`

#### Step 1: Define What We Need (Interface)

```typescript
export interface RepositoryContextValue {
  reportRepository: IReportRepository
  photoStorage: IPhotoStorage
  photoRepository: IPhotoRepository
}
```

#### Step 2: Create the Injection Mechanism (Context Provider)

```typescript
interface RepositoryProviderProps {
  children: ReactNode
  // ⭐ Dependencies can be INJECTED from outside
  reportRepository?: IReportRepository
  photoStorage?: IPhotoStorage
  photoRepository?: IPhotoRepository
}

export function RepositoryProvider({
  children,
  reportRepository,
  photoStorage,
  photoRepository,
}: RepositoryProviderProps) {
  // Create default implementations if not provided
  const value = useMemo<RepositoryContextValue>(
    () => ({
      // Use injected dependency OR create default
      reportRepository: reportRepository ?? createSupabaseReportRepository(),
      photoStorage: photoStorage ?? createSupabasePhotoStorage(),
      photoRepository: photoRepository ?? createSupabasePhotoRepository(),
    }),
    [reportRepository, photoStorage, photoRepository]
  )

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  )
}
```

#### Step 3: Consume the Injected Dependencies

```typescript
// Hook to access injected repositories
export function useReportRepository(): IReportRepository {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error("useReportRepository must be used within RepositoryProvider")
  }
  return context.reportRepository
}

// Usage in a component
function ReportList() {
  const repository = useReportRepository()  // ⭐ Injected dependency!

  const { data: reports } = useQuery({
    queryKey: ["reports"],
    queryFn: () => repository.findAll()  // Uses injected implementation
  })

  return <div>{/* render reports */}</div>
}
```

### Production vs Testing Usage

```typescript
// ✅ PRODUCTION: Use real Supabase implementations
function App() {
  return (
    <RepositoryProvider>  {/* No props = default implementations */}
      <ReportList />
    </RepositoryProvider>
  )
}

// ✅ TESTING: Inject mock implementations
function ReportListTest() {
  const mockRepo = {
    findAll: jest.fn().mockResolvedValue([
      { id: "1", title: "Test Report" }
    ])
  }

  return (
    <RepositoryProvider reportRepository={mockRepo}>
      <ReportList />
    </RepositoryProvider>
  )
}
```

### Another DI Example

**Location:** `src/features/admin/context/TicketServiceContext.tsx:1-26`

```typescript
const TicketServiceContext = createContext<ITicketService | undefined>(undefined)

interface TicketServiceProviderProps {
  children: ReactNode
  service?: ITicketService  // ⭐ Injected dependency
}

export function TicketServiceProvider({
  children,
  service = new SupabaseTicketService(),  // Default if not provided
}: TicketServiceProviderProps) {
  return (
    <TicketServiceContext.Provider value={service}>
      {children}
    </TicketServiceContext.Provider>
  )
}

export function useTicketService(): ITicketService {
  const context = useContext(TicketServiceContext)
  if (!context) {
    throw new Error("useTicketService must be used within TicketServiceProvider")
  }
  return context  // ⭐ Returns injected service
}
```

### How it Works

```
WITHOUT Dependency Injection (BAD):
┌──────────────┐
│  Component   │
│              │
│  const repo  │
│  = new       │──┐ Tightly coupled!
│  SupabaseRepo│  │ Hard to test!
└──────────────┘  │
                  ↓
           ┌────────────┐
           │  Supabase  │
           └────────────┘

WITH Dependency Injection (GOOD):
┌──────────────┐
│   Provider   │
│              │
│  Creates or  │
│  receives    │
│  repo        │
└──────┬───────┘
       ↓ (injects)
┌──────────────┐
│  Component   │
│              │
│  Gets repo   │──→ Can be Supabase
│  from        │    Can be Mock
│  context     │    Can be MongoDB
└──────────────┘    etc.
```

### Key Benefits

1. **Easy Testing**: Inject mocks instead of real services
2. **Flexibility**: Swap implementations without changing code
3. **Explicit Dependencies**: You can see what a component needs
4. **Loose Coupling**: Component doesn't know about concrete implementations

---

# BEHAVIORAL PATTERNS

Behavioral patterns deal with **communication between objects**, defining how they interact and distribute responsibility.

---

## 7. Strategy Pattern (Behavioral)

### What is it?

The Strategy Pattern defines a **family of algorithms** (strategies), encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it.

### Why use it?

- ✅ Avoids multiple if/else or switch statements
- ✅ Makes algorithms easily swappable
- ✅ Follows Open/Closed Principle (add new strategies without modifying existing code)
- ✅ Each strategy is self-contained and testable

### Real Example from Our Code

**Location:** `src/features/community/services/PostValidator.ts:1-121`

#### Step 1: Define the Strategy Interface

```typescript
// Common interface all strategies must implement
export interface IValidationRule {
  validate(data: CreatePostData): ValidationResult
  ruleName: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}
```

#### Step 2: Implement Different Strategies

**Strategy 1: Required Fields Validation**

```typescript
export class RequiredFieldsRule implements IValidationRule {
  ruleName = "RequiredFields"

  validate(data: CreatePostData): ValidationResult {
    const errors: string[] = []

    if (!data.title || data.title.trim().length === 0) {
      errors.push("Title is required")
    }

    if (!data.content || data.content.trim().length === 0) {
      errors.push("Content is required")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
```

**Strategy 2: Minimum Length Validation**

```typescript
export class MinLengthRule implements IValidationRule {
  ruleName = "MinLength"

  constructor(
    private minTitleLength: number = 3,
    private minContentLength: number = 10
  ) {}

  validate(data: CreatePostData): ValidationResult {
    const errors: string[] = []

    if (data.title && data.title.length < this.minTitleLength) {
      errors.push(`Title must be at least ${this.minTitleLength} characters`)
    }

    if (data.content && data.content.length < this.minContentLength) {
      errors.push(`Content must be at least ${this.minContentLength} characters`)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
```

**Strategy 3: Spam Detection Validation**

```typescript
export class NoSpamRule implements IValidationRule {
  ruleName = "NoSpam"

  private spamKeywords = ["spam", "click here", "free money", "buy now"]

  validate(data: CreatePostData): ValidationResult {
    const errors: string[] = []
    const contentLower = data.content.toLowerCase()
    const titleLower = data.title.toLowerCase()

    for (const keyword of this.spamKeywords) {
      if (contentLower.includes(keyword) || titleLower.includes(keyword)) {
        errors.push(`Content contains prohibited keyword: "${keyword}"`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
```

#### Step 3: Context That Uses Strategies

```typescript
export class PostValidator {
  private rules: IValidationRule[] = []

  // Add any strategy dynamically
  addRule(rule: IValidationRule): PostValidator {
    this.rules.push(rule)
    return this
  }

  // Execute all strategies
  validate(data: CreatePostData): ValidationResult {
    const allErrors: string[] = []

    for (const rule of this.rules) {
      const result = rule.validate(data) // ⭐ Calls the strategy
      if (!result.isValid) {
        allErrors.push(...result.errors)
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    }
  }
}
```

### Usage Examples

```typescript
// Basic validation (only required fields and min length)
const basicValidator = new PostValidator()
  .addRule(new RequiredFieldsRule())
  .addRule(new MinLengthRule(3, 10))

const result1 = basicValidator.validate({
  title: "Hi", // Too short!
  content: "Short", // Too short!
})
// result1.errors: ["Title must be at least 3 characters", "Content must be at least 10 characters"]

// Strict validation (includes spam detection)
const strictValidator = new PostValidator()
  .addRule(new RequiredFieldsRule())
  .addRule(new MinLengthRule(5, 50))
  .addRule(new NoSpamRule())

const result2 = strictValidator.validate({
  title: "Click here for free money!", // Spam detected!
  content: "This is a legitimate post with enough content to pass min length",
})
// result2.errors: ["Content contains prohibited keyword: "click here"", "Content contains prohibited keyword: "free money""]

// Custom validation (pick and choose strategies)
const customValidator = new PostValidator()
  .addRule(new RequiredFieldsRule())
  .addRule(new NoSpamRule())
// No min length check!

const result3 = customValidator.validate({
  title: "OK", // Short but allowed (no MinLengthRule)
  content: "Hi", // Short but allowed
})
// result3.isValid: true
```

### Adding New Strategies

Want to add a new validation? Just create a new class implementing `IValidationRule`:

```typescript
// New strategy: Check for profanity
export class NoProfanityRule implements IValidationRule {
  ruleName = "NoProfanity"

  private badWords = ["badword1", "badword2"]

  validate(data: CreatePostData): ValidationResult {
    const errors: string[] = []
    const text = `${data.title} ${data.content}`.toLowerCase()

    for (const word of this.badWords) {
      if (text.includes(word)) {
        errors.push(`Content contains inappropriate language`)
        break
      }
    }

    return { isValid: errors.length === 0, errors }
  }
}

// Use it
const validator = new PostValidator()
  .addRule(new RequiredFieldsRule())
  .addRule(new NoProfanityRule()) // ⭐ New strategy added!
```

### How it Works

```
PostValidator
     ↓
  validate()
     ↓
   Runs each strategy in order:
     ↓
┌────────────────┐
│ Strategy 1:    │ → RequiredFieldsRule
│ validate(data) │
└────────────────┘
     ↓
┌────────────────┐
│ Strategy 2:    │ → MinLengthRule
│ validate(data) │
└────────────────┘
     ↓
┌────────────────┐
│ Strategy 3:    │ → NoSpamRule
│ validate(data) │
└────────────────┘
     ↓
Combines all errors
     ↓
Returns final result
```

### Why This is Strategy Pattern

1. **Family of Algorithms**: Each validation rule is a different algorithm
2. **Interchangeable**: Can swap rules in and out (`addRule()`)
3. **Common Interface**: All rules implement `IValidationRule`
4. **Runtime Selection**: Choose which strategies to use at runtime
5. **Open/Closed**: Add new rules without modifying `PostValidator`

---

## Summary Table

| Pattern                  | Category   | Purpose                                       | When to Use                                    |
| ------------------------ | ---------- | --------------------------------------------- | ---------------------------------------------- |
| **Factory**              | Creational | Create objects without specifying exact class | When you need flexibility in object creation   |
| **Builder**              | Creational | Construct complex objects step-by-step        | When objects have many optional parameters     |
| **Singleton**            | Creational | Ensure only one instance exists               | For shared resources (DB, config)              |
| **Repository**           | Structural | Abstract data access layer                    | To separate business logic from data access    |
| **Adapter**              | Structural | Make incompatible interfaces work together    | When you need different views of the same data |
| **Dependency Injection** | Structural | Pass dependencies from outside                | For testability and loose coupling             |
| **Strategy**             | Behavioral | Define family of interchangeable algorithms   | When you have multiple ways to do something    |

---

## SOLID Principles in Our Patterns

Our design patterns follow SOLID principles:

### S - Single Responsibility Principle

- ✅ Each repository handles ONE data entity
- ✅ Each validation rule does ONE type of validation
- ✅ Each formatter has ONE formatting style

### O - Open/Closed Principle

- ✅ Add new formatters without changing existing code
- ✅ Add new validation rules without modifying `PostValidator`
- ✅ Add new repositories without changing interfaces

### L - Liskov Substitution Principle

- ✅ All formatters can replace `IPostFormatter` (see `PostFormatter.ts:1-3`)
- ✅ All repositories can replace their interfaces
- ✅ All validation rules can replace `IValidationRule`

### I - Interface Segregation Principle

- ✅ Interfaces are small and focused (`IReportRepository`, `IPhotoStorage`)
- ✅ Clients only depend on methods they use

### D - Dependency Inversion Principle

- ✅ Components depend on interfaces, not concrete implementations
- ✅ Dependencies are injected via Context (Dependency Injection)
- ✅ High-level modules don't depend on low-level modules

---

## Next Steps: Missing Patterns to Implement

Based on `tasks/design-patterns-todo.md`, we still need:

### Behavioral Patterns (Priority)

1. **Observer Pattern** - For notifications/real-time updates
2. **Template Method** - For CRUD workflows
3. **Command Pattern** - For undo/redo functionality

### Structural Patterns (Enhancement)

4. **Facade Pattern** - For complex workflow orchestration
5. **Decorator Pattern** - For cross-cutting concerns (logging, auth)

See the full implementation plan in `tasks/design-patterns-todo.md`.

---

## Resources

- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [TypeScript Design Patterns](https://github.com/torokmark/design_patterns_in_typescript)
- [React Patterns](https://reactpatterns.com/)

---

**Last Updated:** 2026-01-02
**Project:** Pi Clean City
**Purpose:** Lab Assignment - Design Patterns Implementation
