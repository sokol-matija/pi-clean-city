/**
 * Submit Report Page
 *
 * SOLID Principle: Single Responsibility (SRP)
 * This component now has ONE responsibility: composing UI and coordinating user interactions.
 *
 * Responsibilities REMOVED (extracted to separate modules):
 * - Validation logic → src/features/reports/validation/reportValidation.ts
 * - Photo upload handling → src/features/reports/hooks/usePhotoUpload.ts
 * - Form state management → src/features/reports/hooks/useReportForm.ts
 *
 * Benefits:
 * - Component is now ~150 lines instead of 280 lines
 * - Each module can be tested independently
 * - Validation can be reused in edit forms
 * - Photo upload can be reused in other features
 * - Easier to maintain and understand
 */

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/features/auth"
import { useCategories } from "@/features/reports/hooks/useCategories"
import { useCreateReport } from "@/features/reports/hooks/useCreateReport"
import { useReportForm } from "@/features/reports/hooks/useReportForm"
import { usePhotoUpload } from "@/features/reports/hooks/usePhotoUpload"
import { LocationPicker } from "@/features/reports/components/LocationPicker"
import { Upload, X, Loader2, CheckCircle } from "lucide-react"

export function SubmitReportPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const createReport = useCreateReport()

  // SRP: Form state managed by dedicated hook
  const form = useReportForm()

  // SRP: Photo upload managed by dedicated hook
  const photoUpload = usePhotoUpload()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    photoUpload.addPhotos(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // SRP: Validation delegated to form hook (which uses validation module)
    if (!form.validate() || !user || !form.location) return

    try {
      await createReport.mutateAsync({
        report: {
          title: form.title.trim(),
          description: form.description.trim(),
          category_id: parseInt(form.categoryId),
          latitude: form.location.lat,
          longitude: form.location.lng,
          address: form.address.trim() || null,
          user_id: user.id,
        },
        photos: photoUpload.photos,
      })

      navigate("/map")
    } catch (error) {
      console.error("Error creating report:", error)
      form.setSubmitError("Failed to submit report. Please try again.")
    }
  }

  if (createReport.isSuccess) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
            <h2 className="mb-2 text-2xl font-bold">Report Submitted!</h2>
            <p className="mb-4 text-muted-foreground">
              Thank you for helping improve our community. Your report has been submitted and will
              be reviewed shortly.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate("/map")}>View on Map</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Report</CardTitle>
          <CardDescription>
            Help improve your community by reporting municipal problems like potholes, broken
            lights, or trash.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Brief description of the problem"
                value={form.title}
                onChange={(e) => form.setTitle(e.target.value)}
                maxLength={100}
              />
              {form.errors.title && <p className="text-sm text-destructive">{form.errors.title}</p>}
              <p className="text-xs text-muted-foreground">{form.title.length}/100</p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={form.categoryId} onValueChange={form.setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {form.errors.category && (
                <p className="text-sm text-destructive">{form.errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide details about the problem..."
                value={form.description}
                onChange={(e) => form.setDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
              {form.errors.description && (
                <p className="text-sm text-destructive">{form.errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">{form.description.length}/500</p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <LocationPicker value={form.location || undefined} onChange={form.setLocation} />
              {form.errors.location && (
                <p className="text-sm text-destructive">{form.errors.location}</p>
              )}
            </div>

            {/* Address (optional) */}
            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                placeholder="Street address or landmark"
                value={form.address}
                onChange={(e) => form.setAddress(e.target.value)}
              />
            </div>

            {/* Photos - SRP: Using dedicated photo upload hook */}
            <div className="space-y-2">
              <Label>Photos (optional, max 5)</Label>
              <div className="flex flex-wrap gap-2">
                {photoUpload.photos.map((photo, index) => (
                  <div key={index} className="relative h-20 w-20 overflow-hidden rounded-md border">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => photoUpload.removePhoto(index)}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {photoUpload.canAddMore && (
                  <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors hover:border-primary">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="mt-1 text-xs text-muted-foreground">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Max 10MB per image. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            {form.errors.submit && <p className="text-sm text-destructive">{form.errors.submit}</p>}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={createReport.isPending}>
              {createReport.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
