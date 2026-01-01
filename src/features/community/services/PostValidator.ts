export interface CreatePostData {
  title: string
  content: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface IValidationRule {
  validate(data: CreatePostData): ValidationResult
  ruleName: string
}

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

export class PostValidator {
  private rules: IValidationRule[] = []

  addRule(rule: IValidationRule): PostValidator {
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

export function createStrictValidator(): PostValidator {
  return new PostValidator()
    .addRule(new RequiredFieldsRule())
    .addRule(new MinLengthRule(5, 50))
    .addRule(new NoSpamRule())
}
