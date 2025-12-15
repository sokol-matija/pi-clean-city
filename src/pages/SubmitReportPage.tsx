import { useState } from "react"
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
import { LocationPicker } from "@/features/reports/components/LocationPicker"
import { Upload, X, Loader2, CheckCircle } from "lucide-react"

export function SubmitReportPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const createReport = useCreateReport()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        return false
      }
      return true
    })

    setPhotos((prev) => [...prev, ...validFiles].slice(0, 5))
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.length > 100) {
      newErrors.title = "Title must be 100 characters or less"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    } else if (description.length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    } else if (description.length > 500) {
      newErrors.description = "Description must be 500 characters or less"
    }

    if (!categoryId) {
      newErrors.category = "Category is required"
    }

    if (!location) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !user || !location) return

    try {
      await createReport.mutateAsync({
        report: {
          title: title.trim(),
          description: description.trim(),
          category_id: parseInt(categoryId),
          latitude: location.lat,
          longitude: location.lng,
          address: address.trim() || null,
          user_id: user.id,
        },
        photos,
      })

      navigate("/map")
    } catch (error) {
      console.error("Error creating report:", error)
      setErrors({ submit: "Failed to submit report. Please try again." })
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              <p className="text-xs text-muted-foreground">{title.length}/100</p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
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
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide details about the problem..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">{description.length}/500</p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <LocationPicker value={location || undefined} onChange={setLocation} />
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>

            {/* Address (optional) */}
            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                placeholder="Street address or landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label>Photos (optional, max 5)</Label>
              <div className="flex flex-wrap gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative h-20 w-20 overflow-hidden rounded-md border">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
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

            {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}

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
