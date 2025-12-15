import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Insertable } from "@/types/database.types"

interface CreateReportData {
  report: Insertable<"report">
  photos?: File[]
}

// Sanitize filename to be safe for storage
function sanitizeFilename(filename: string): string {
  // Remove special characters, keep alphanumeric, dots, hyphens, underscores
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_")

  // Ensure it has a valid extension
  const parts = sanitized.split(".")
  if (parts.length < 2) {
    return `${sanitized}.jpg`
  }
  return sanitized
}

export function useCreateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ report, photos }: CreateReportData) => {
      // Insert the report
      const { data: newReport, error: reportError } = await supabase
        .from("report")
        .insert(report)
        .select()
        .single()

      if (reportError) {
        console.error("Error creating report:", reportError)
        throw reportError
      }

      // Upload photos if any
      if (photos && photos.length > 0) {
        const uploadPromises = photos.map(async (photo, index) => {
          try {
            const sanitizedName = sanitizeFilename(photo.name)
            const filename = `${newReport.id}/${Date.now()}-${index}-${sanitizedName}`

            const { error: uploadError } = await supabase.storage
              .from("report-photos")
              .upload(filename, photo, {
                contentType: photo.type || "image/jpeg",
                upsert: false,
              })

            if (uploadError) {
              console.error("Error uploading photo:", uploadError)
              return null
            }

            const {
              data: { publicUrl },
            } = supabase.storage.from("report-photos").getPublicUrl(filename)

            // Save photo record
            const { error: photoRecordError } = await supabase.from("photo").insert({
              report_id: newReport.id,
              url: publicUrl,
              filename: photo.name,
            })

            if (photoRecordError) {
              console.error("Error saving photo record:", photoRecordError)
              return null
            }

            return publicUrl
          } catch (err) {
            console.error("Unexpected error uploading photo:", err)
            return null
          }
        })

        await Promise.all(uploadPromises)
      }

      return newReport
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
    },
  })
}
