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

import { useAuth } from "@/features/auth"
import { Card, CardContent } from "@/components/ui/card"
import { TicketDetailsModal } from "@/features/admin/components/TicketDetailsModal"

// SRP: Import hooks (business logic)
import { useAdminTickets } from "@/features/admin/hooks/useAdminTickets"
import { useTicketFilters } from "@/features/admin/hooks/useTicketFilters"
import { useTicketModal } from "@/features/admin/hooks/useTicketModal"

// SRP: Import components (presentation)
import { TicketFilters } from "@/features/admin/components/TicketFilters"
import { TicketsTable } from "@/features/admin/components/TicketsTable"

export function AdminTicketsPage() {
  const { profile } = useAuth()

  // SRP: Data fetching delegated to hook
  const { reports, categories, statuses, isLoading, error, refreshTickets } = useAdminTickets()

  // SRP: Filtering delegated to hook
  const { filteredReports, filters, setStatusFilter, setCategoryFilter, clearFilters } =
    useTicketFilters(reports)

  // SRP: Modal management delegated to hook
  const { selectedTicket, isModalOpen, openModal, closeModal } = useTicketModal()

  // Handler for ticket updates (orchestration logic)
  const handleTicketUpdate = () => {
    refreshTickets()
    closeModal()
  }

  // Guard:  Check admin role
  if (!profile || profile.role !== "admin") {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-muted-foreground">Access denied.  Admin role required.</p>
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

      {/* SRP: Filters delegated to component */}
      <TicketFilters
        statuses={statuses}
        categories={categories}
        selectedStatus={filters.status}
        selectedCategory={filters.category}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onClearFilters={clearFilters}
      />

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-red-300 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading reports...</p>
          </CardContent>
        </Card>
      )}

      {/* SRP: Table delegated to component */}
      {! isLoading && <TicketsTable reports={filteredReports} onRowClick={openModal} />}

      {/* Modal */}
      {isModalOpen && selectedTicket && (
        <TicketDetailsModal
          report={selectedTicket}
          onClose={closeModal}
          onUpdate={handleTicketUpdate}
        />
      )}
    </div>
  )
}
