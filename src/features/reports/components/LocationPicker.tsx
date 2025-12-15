import { useEffect, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { MapPin, Crosshair } from "lucide-react"

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface LocationPickerProps {
  value?: { lat: number; lng: number }
  onChange: (location: { lat: number; lng: number }) => void
}

function LocationMarker({
  position,
  setPosition,
}: {
  position: { lat: number; lng: number } | null
  setPosition: (pos: { lat: number; lng: number }) => void
}) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  return position ? <Marker position={[position.lat, position.lng]} /> : null
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(value || null)
  const [isLocating, setIsLocating] = useState(false)

  const handlePositionChange = useCallback(
    (pos: { lat: number; lng: number }) => {
      setPosition(pos)
      onChange(pos)
    },
    [onChange]
  )

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        handlePositionChange(newPos)
        setIsLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to get your location. Please click on the map to select a location.")
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  }, [handlePositionChange])

  useEffect(() => {
    if (value && (value.lat !== position?.lat || value.lng !== position?.lng)) {
      setPosition(value)
    }
  }, [value, position])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Location <span className="text-destructive">*</span>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLocating}
        >
          <Crosshair className="mr-1 h-4 w-4" />
          {isLocating ? "Locating..." : "Use my location"}
        </Button>
      </div>

      <div className="relative h-[300px] overflow-hidden rounded-md border">
        <MapContainer
          center={position ? [position.lat, position.lng] : [45.815, 15.982]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={handlePositionChange} />
        </MapContainer>

        {!position && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="flex items-center gap-2 rounded-md bg-background px-4 py-2 shadow">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click on the map to select location
              </span>
            </div>
          </div>
        )}
      </div>

      {position && (
        <p className="text-xs text-muted-foreground">
          Selected: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
      )}
    </div>
  )
}
