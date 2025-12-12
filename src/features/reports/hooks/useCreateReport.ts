import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Insertable } from '@/types/database.types'

interface CreateReportData {
  report: Insertable<'report'>
  photos?: File[]
}

export function useCreateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ report, photos }: CreateReportData) => {
      // Insert the report
      const { data: newReport, error: reportError } = await supabase
        .from('report')
        .insert(report)
        .select()
        .single()

      if (reportError) throw reportError

      // Upload photos if any
      if (photos && photos.length > 0) {
        for (const photo of photos) {
          const filename = `${newReport.id}/${Date.now()}-${photo.name}`

          const { error: uploadError } = await supabase.storage
            .from('report-photos')
            .upload(filename, photo)

          if (uploadError) {
            console.error('Error uploading photo:', uploadError)
            continue
          }

          const { data: { publicUrl } } = supabase.storage
            .from('report-photos')
            .getPublicUrl(filename)

          // Save photo record
          await supabase.from('photo').insert({
            report_id: newReport.id,
            url: publicUrl,
            filename: photo.name,
          })
        }
      }

      return newReport
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}
