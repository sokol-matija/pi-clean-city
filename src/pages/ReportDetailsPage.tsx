import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useReport } from '@/features/reports/hooks/useReport'
import { useAddComment } from '@/features/reports/hooks/useAddComment'
import { useAuth } from '@/features/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

// Create a simple marker icon
const markerIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

export function ReportDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: report, isLoading, error } = useReport(id)
  const { user } = useAuth()
  const addComment = useAddComment()
  const [newComment, setNewComment] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Report not found</p>
            <Link to="/map">
              <Button className="mt-4">Back to Map</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !id) return

    await addComment.mutateAsync({
      reportId: id,
      content: newComment.trim(),
    })
    setNewComment('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hr-HR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <Link to="/map" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Map
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{report.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      style={{
                        backgroundColor: report.status?.color || '#95a5a6',
                        color: 'white',
                      }}
                    >
                      {report.status?.name}
                    </Badge>
                    <Badge variant="outline">
                      {report.category?.icon} {report.category?.name}
                    </Badge>
                    <Badge variant="secondary">{report.priority} priority</Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  <p>Submitted: {formatDate(report.created_at)}</p>
                  {report.resolved_at && (
                    <p>Resolved: {formatDate(report.resolved_at)}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
              {report.address && (
                <p className="mt-4 text-sm">
                  <span className="font-medium">Location:</span> {report.address}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Photos Gallery */}
          {report.photos && report.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Photos ({report.photos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {report.photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedImage(photo.url)}
                      className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={photo.url}
                        alt={photo.filename}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Comments ({report.comments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Comment List */}
              {report.comments && report.comments.length > 0 ? (
                <div className="space-y-4">
                  {report.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(comment.user?.username || comment.user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.user?.username || comment.user?.email || 'Anonymous'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}

              <Separator />

              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || addComment.isPending}
                    size="sm"
                  >
                    {addComment.isPending ? 'Posting...' : 'Post Comment'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sign in to leave a comment
                  </p>
                  <Link to="/login">
                    <Button size="sm" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mini Map */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[250px] rounded-b-lg overflow-hidden">
                <MapContainer
                  center={[Number(report.latitude), Number(report.longitude)]}
                  zoom={15}
                  className="h-full w-full"
                  scrollWheelZoom={false}
                  dragging={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[Number(report.latitude), Number(report.longitude)]}
                    icon={markerIcon}
                  />
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Reporter Info */}
          {report.user && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reported By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={report.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(report.user.username || report.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {report.user.username || report.user.email || 'Anonymous'}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {report.user.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Worker */}
          {report.assigned_worker && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={report.assigned_worker.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(report.assigned_worker.username || report.assigned_worker.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {report.assigned_worker.username || report.assigned_worker.email}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Municipal Worker
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
