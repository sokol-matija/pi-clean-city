/**
 * Admin Tickets Page
 *
 * SOLID Principle: Open/Closed Principle (OCP)
 * Badge color resolution is now configuration-based, not hardcoded if-else chains.
 *
 * Before (BAD): getStatusColor/getPriorityColor used if-else chains that required
 * modification every time a new status or priority was added.
 *
 * After (GOOD): Uses badgeConfig.ts which is OPEN for extension (add new entries)
 * but CLOSED for modification (resolver functions never change).
 */

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/features/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TicketDetailsModal } from "@/components/admin/TicketDetailsModal"
import type { ReportWithRelations, Category, Status } from "@/types/database.types"
// OCP: Import configuration-based badge resolvers instead of hardcoded if-else
import {
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
} from "@/features/reports/config/badgeConfig"

export function AdminTicketsPage() {
  const { profile } = useAuth()
  const [reports, setReports] = useState<ReportWithRelations[]>([])
  const [allReports, setAllReports] = useState<ReportWithRelations[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Modal states
  const [selectedReport, setSelectedReport] = useState<ReportWithRelations | null>(null)
  const [showModal, setShowModal] = useState(false)

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
        .from("report")
        .select(
          `
          *,
          category(*),
          status(*),
          user: profiles! report_user_id_fkey(*),
          assigned_worker:profiles!report_assigned_worker_id_fkey(*)
        `
        )
        .order("created_at", { ascending: false })

      if (reportsError) throw reportsError

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("category")
        .select("*")
        .order("name")

      if (categoriesError) throw categoriesError

      // Fetch statuses
      const { data: statusesData, error: statusesError } = await supabase
        .from("status")
        .select("*")
        .order("sort_order")

      if (statusesError) throw statusesError

      setReports(reportsData as ReportWithRelations[])
      setAllReports(reportsData as ReportWithRelations[])
      setCategories(categoriesData as Category[])
      setStatuses(statusesData as Status[])
    } catch (err) {
      console.error("Error loading data:", err)
      setError("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...allReports]

    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status_id === parseInt(selectedStatus))
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((r) => r.category_id === parseInt(selectedCategory))
    }

    setReports(filtered)
  }, [allReports, selectedStatus, selectedCategory])

  // Apply filters when selection changes
  useEffect(() => {
    applyFilters()
  }, [selectedStatus, selectedCategory, applyFilters])

  const clearFilters = () => {
    setSelectedStatus("all")
    setSelectedCategory("all")
    setReports(allReports)
  }

  const handleRowClick = (report: ReportWithRelations) => {
    setSelectedReport(report)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedReport(null)
  }

  const handleUpdateReport = () => {
    loadData()
  }

  // OCP: Badge color functions removed!
  // Previously had if-else chains here that violated Open/Closed Principle.
  // Now using configuration-based resolvers from badgeConfig.ts
  // See: src/features/reports/config/badgeConfig.ts

  if (!profile || profile.role !== "admin") {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-muted-foreground">Access denied. Admin role required.</p>
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
        <p className="mt-2 text-muted-foreground">Manage all citizen reports</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
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
              <label className="mb-2 block text-sm font-medium">Category</label>
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
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading reports...</p>
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
              <div className="py-12 text-center text-muted-foreground">
                <p>No reports found</p>
                <p className="mt-1 text-sm">Try adjusting your filters</p>
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
                      <TableHead>Assigned To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow
                        key={report.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(report)}
                      >
                        <TableCell className="font-mono text-sm">
                          {report.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>
                          {/* OCP: Using config-based variant resolver */}
                          <Badge variant={getStatusBadgeVariant(report.status?.name)}>
                            {report.status?.name || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {/* OCP: Using config-based variant resolver */}
                          <Badge variant={getPriorityBadgeVariant(report.priority)}>
                            {report.priority || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.category?.name || "N/A"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {report.user?.email || "Unknown"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {report.address ? `${report.address}` : "N/A"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {report.assigned_worker ? (
                            <Badge variant="outline">
                              {report.assigned_worker.username || report.assigned_worker.email}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
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

      {/* Modal */}
      {showModal && selectedReport && (
        <TicketDetailsModal
          report={selectedReport}
          onClose={handleCloseModal}
          onUpdate={handleUpdateReport}
        />
      )}
    </div>
  )
}
