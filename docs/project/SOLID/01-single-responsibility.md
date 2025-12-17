# Single Responsibility Principle (SRP)

## Definition

> "A class should have one, and only one, reason to change."
> — Robert C. Martin

The Single Responsibility Principle states that every module, class, or function should have responsibility over a single part of the functionality provided by the software.

## Problem: SubmitReportPage.tsx (Before Refactoring)

The original `SubmitReportPage.tsx` had **multiple responsibilities**:

1. **Form state management** - Managing title, description, categoryId, location, address states
2. **Validation logic** - Validating all form fields with specific rules
3. **Photo upload handling** - Validating file types, sizes, managing photo array
4. **UI rendering** - Rendering the entire form layout
5. **Navigation logic** - Redirecting after successful submission
6. **Error handling** - Managing validation and submission errors

### Problems with Multiple Responsibilities

- **4+ reasons to change**: Validation rules change, photo limits change, UI design changes, form fields change
- **Hard to test**: Can't test validation without rendering the component
- **Code reusability**: Can't reuse validation or photo handling in edit forms
- **Large file**: 280+ lines doing too many things
- **Tight coupling**: Changes to one responsibility might break others

## Solution: Separated Concerns

We extracted each responsibility into its own module:

### 1. Validation Module (`reportValidation.ts`)

```typescript
// src/features/reports/validation/reportValidation.ts
export function validateReportForm(data: ReportFormData): ValidationResult {
  const errors: ValidationErrors = {}

  // Title validation
  if (!data.title.trim()) {
    errors.title = "Title is required"
  } else if (data.title.length > 100) {
    errors.title = "Title must be 100 characters or less"
  }

  // ... other validations

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
```

**Responsibility**: Validate report form data
**Reason to change**: Only when validation rules change

### 2. Photo Upload Hook (`usePhotoUpload.ts`)

```typescript
// src/features/reports/hooks/usePhotoUpload.ts
export function usePhotoUpload(): PhotoUploadState {
  const [photos, setPhotos] = useState<File[]>([])

  const addPhotos = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(isValidPhoto)
    setPhotos((prev) => [...prev, ...validFiles].slice(0, MAX_PHOTOS))
  }, [])

  // ... other methods

  return { photos, addPhotos, removePhoto, clearPhotos, canAddMore, remainingSlots }
}
```

**Responsibility**: Manage photo uploads
**Reason to change**: Only when photo handling requirements change

### 3. Form State Hook (`useReportForm.ts`)

```typescript
// src/features/reports/hooks/useReportForm.ts
export function useReportForm(): ReportFormState {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  // ... other state

  const validate = useCallback((): boolean => {
    const result = validateReportForm(formData)
    setErrors(result.errors)
    return result.isValid
  }, [formData])

  return { title, setTitle, description, setDescription, /* ... */ validate, reset }
}
```

**Responsibility**: Manage form state
**Reason to change**: Only when form structure changes

### 4. UI Component (`SubmitReportPage.tsx`)

```typescript
// src/pages/SubmitReportPage.tsx
export function SubmitReportPage() {
  const form = useReportForm()
  const photoUpload = usePhotoUpload()

  // Component only handles UI composition and user interaction coordination
  return (
    <form onSubmit={handleSubmit}>
      {/* Clean, focused rendering */}
    </form>
  )
}
```

**Responsibility**: Render UI and coordinate user interactions
**Reason to change**: Only when UI design changes

## Benefits Achieved

| Before | After |
|--------|-------|
| 280 lines in one file | ~60-80 lines per module |
| Can't test validation alone | Validation tests run without UI |
| Photo logic tied to form | `usePhotoUpload` reusable anywhere |
| 4+ reasons to change one file | Each module has 1 reason to change |

## File Structure

```
src/
├── features/reports/
│   ├── validation/
│   │   ├── reportValidation.ts      # Validation logic only
│   │   └── reportValidation.test.ts # Unit tests
│   └── hooks/
│       ├── usePhotoUpload.ts        # Photo handling only
│       └── useReportForm.ts         # Form state only
└── pages/
    └── SubmitReportPage.tsx          # UI composition only
```

## Unit Tests

The validation module can now be tested in isolation:

```typescript
describe("validateReportForm", () => {
  it("should return error when title is empty", () => {
    const result = validateReportForm({ ...validFormData, title: "" })
    expect(result.isValid).toBe(false)
    expect(result.errors.title).toBe("Title is required")
  })

  it("should accept valid form data", () => {
    const result = validateReportForm(validFormData)
    expect(result.isValid).toBe(true)
  })
})
```

## Key Takeaways

1. **Identify responsibilities** by asking "What are the reasons this code might need to change?"
2. **Extract into modules** that each handle one responsibility
3. **Pure functions** (like validation) are easy to test and reason about
4. **Custom hooks** are great for separating state management from UI
5. **Composition** in the main component ties everything together

## Related Files

- `src/features/reports/validation/reportValidation.ts`
- `src/features/reports/hooks/usePhotoUpload.ts`
- `src/features/reports/hooks/useReportForm.ts`
- `src/pages/SubmitReportPage.tsx`
- `src/features/reports/validation/reportValidation.test.ts`
