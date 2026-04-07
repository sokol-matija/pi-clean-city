interface CreatePostData {
  title: string
  content: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

interface IValidationRule {
  validate(data: CreatePostData): ValidationResult
  ruleName: string
}

class RequiredFieldsRule implements IValidationRule {
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

class MinLengthRule implements IValidationRule {
  ruleName = "MinLength"

  constructor(
    private readonly minTitleLength: number = 3,
    private readonly minContentLength: number = 10
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

// Interface za PostValidator (koristi se u Singleton patternu)
export interface IPostValidator {
  validate(data: CreatePostData): ValidationResult
  addRule(rule: IValidationRule): IPostValidator
}

class PostValidator implements IPostValidator {
  private readonly rules: IValidationRule[] = []

  addRule(rule: IValidationRule): this {
    this.rules.push(rule)
    return this
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

export function createBasicValidator(): PostValidator {
  return new PostValidator().addRule(new RequiredFieldsRule()).addRule(new MinLengthRule(3, 10))
}
