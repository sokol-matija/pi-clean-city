import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { ReportWithRelations, Category, Status } from '@/types/database.types'

export function AdminTicketsPage() {
  const { profile } = useAuth()
  const [reports, setReports] = useState<ReportWithRelations[]>([])
  const [allReports, setAllReports] = useState<ReportWithRelations[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch reports with relations
      const { data: reportsData, error: reportsError } = await supabase
        .from('report')
        .select(`
          *,
          category(*),
          status(*),
          user: profiles! report_user_id_fkey(*),
          assigned_worker:profiles!report_assigned_worker_id_fkey(*)
        `)
        .order('created_at', { ascending: false })

      if (reportsError) throw reportsError

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('category')
        .select('*')
        .order('name')

      if (categoriesError) throw categoriesError

      // Fetch statuses
      const { data: statusesData, error: statusesError } = await supabase
        .from('status')
        .select('*')
        .order('sort_order')

      if (statusesError) throw statusesError

      setReports(reportsData as ReportWithRelations[])
      setAllReports(reportsData as ReportWithRelations[])
      setCategories(categoriesData as Category[])
      setStatuses(statusesData as Status[])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = [... allReports]

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status_id === parseInt(selectedStatus))
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category_id === parseInt(selectedCategory))
    }

    setReports(filtered)
  }

  // Apply filters when selection changes
  useEffect(() => {
    applyFilters()
  }, [selectedStatus, selectedCategory])

  const clearFilters = () => {
    setSelectedStatus('all')
    setSelectedCategory('all')
    setReports(allReports)
  }

  // Helper:  Get status badge color
  const getStatusColor = (statusName: string | undefined) => {
    if (!statusName) return 'default'
    const name = statusName.toLowerCase()
    if (name.includes('new') || name.includes('open')) return 'destructive'
    if (name. includes('progress')) return 'default'
    if (name.includes('resolved')) return 'default'
    if (name.includes('closed')) return 'secondary'
    return 'default'
  }

  // Helper: Get priority badge color
  const getPriorityColor = (priority: string | null | undefined) => {
    if (!priority) return 'secondary'
    const p = priority.toLowerCase()
    if (p === 'critical') return 'destructive'
    if (p === 'high') return 'destructive'
    if (p === 'medium') return 'default'
    if (p === 'low') return 'secondary'
    return 'secondary'
  }

  if (! profile || profile.role !== 'admin') {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-muted-foreground">
              Access denied.  Admin role required.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin - Ticketing System</h1>
        <p className="text-muted-foreground mt-2">
          Manage all citizen reports
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md: grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-red-300 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading reports... </p>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>
              Reports
              <Badge variant="secondary" className="ml-2">
                {reports.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No reports found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports. map((report) => (
                      <TableRow key={report. id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          {report.id. slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(report.status?. name) as any}>
                            {report. status?.name || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(report.priority) as any}>
                            {report.priority || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.category?. name || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {report.user?.email || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {report.address ?  `${report.address}` : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}