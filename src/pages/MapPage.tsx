import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { supabase } from "@/lib/supabase"
import { Camera } from "lucide-react"
import type { ReportWithRelations, Photo } from "@/types/database.types"

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Status colors for markers
const statusColors: Record<number, string> = {
  1: "#ff6b6b", // New
  2: "#ffd93d", // In Progress
  3: "#6bcf7f", // Resolved
  4: "#95a5a6", // Closed
}

function createColoredIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

// Component to center map on Zagreb
function SetViewOnLoad() {
  const map = useMap()
  useEffect(() => {
    map.setView([45.815, 15.982], 13)
  }, [map])
  return null
}

// Photo carousel component for popup
function PopupPhotoPreview({ photos }: Readonly<{ photos: Photo[] }>) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) return null

  return (
    <div className="relative -mx-1 -mt-1 mb-3">
      <div className="aspect-video w-full overflow-hidden rounded-t bg-gray-100">
        <img
          src={photos[currentIndex].url}
          alt="Report attachment"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {photos.length > 1 && (
        <>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
            <Camera className="h-3 w-3" />
            {photos.length}
          </div>
        </>
      )}
    </div>
  )
}

export function MapPage() {
  const [reports, setReports] = useState<ReportWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      // Fetch reports with photos
      const { data: reportsData, error: reportsError } = await supabase
        .from("report")
        .select("*, category(*), status(*)")
        .order("created_at", { ascending: false })

      if (reportsError) {
        console.error("Error fetching reports:", reportsError)
        setIsLoading(false)
        return
      }

      // Fetch all photos for all reports
      const reportIds = reportsData.map((r) => r.id)
      const { data: photosData } = await supabase
        .from("photo")
        .select("*")
        .in("report_id", reportIds)
        .order("uploaded_at", { ascending: true })

      // Group photos by report_id for efficient lookup
      const photosByReportId = new Map<string, Photo[]>()
      for (const photo of photosData || []) {
        const reportId = String(photo.report_id)
        const existing = photosByReportId.get(reportId) || []
        existing.push(photo)
        photosByReportId.set(reportId, existing)
      }

      // Merge photos with reports
      const reportsWithPhotos = reportsData.map((report) => ({
        ...report,
        photos: photosByReportId.get(String(report.id)) || [],
      })) as ReportWithRelations[]

      setReports(reportsWithPhotos)
      setIsLoading(false)
    }

    fetchReports()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <MapContainer center={[45.815, 15.982]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnLoad />
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[Number(report.latitude), Number(report.longitude)]}
            icon={createColoredIcon(statusColors[report.status_id] || "#95a5a6")}
          >
            <Popup>
              <div className="min-w-[240px] max-w-[280px]">
                {report.photos && report.photos.length > 0 && (
                  <PopupPhotoPreview photos={report.photos} />
                )}
                <div className={report.photos?.length ? "px-1" : ""}>
                  <h3 className="mb-1 line-clamp-1 text-lg font-bold">{report.title}</h3>
                  <p className="mb-2 line-clamp-2 text-sm text-gray-600">{report.description}</p>
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: report.status?.color || "#95a5a6" }}
                    ></span>
                    <span className="text-sm font-medium">{report.status?.name}</span>
                  </div>
                  <p className="mb-2 text-xs text-gray-500">Category: {report.category?.name}</p>
                  <Link
                    to={`/report/${report.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-white p-4 shadow-lg">
        <h4 className="mb-2 text-sm font-semibold">Status Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-status-new"></div>
            <span className="text-xs">New</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-status-progress"></div>
            <span className="text-xs">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-status-resolved"></div>
            <span className="text-xs">Resolved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-status-closed"></div>
            <span className="text-xs">Closed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
