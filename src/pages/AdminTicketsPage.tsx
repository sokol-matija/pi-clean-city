import { useAuth } from "@/features/auth"
import { Card, CardContent } from "@/components/ui/card"
import { TicketDetailsModal } from "@/features/admin/components/TicketDetailsModal"

import { useAdminTickets } from "@/features/admin/hooks/useAdminTickets"
import { useTicketFilters } from "@/features/admin/hooks/useTicketFilters"
import { useTicketModal } from "@/features/admin/hooks/useTicketModal"

import { TicketFilters } from "@/features/admin/components/TicketFilters"
import { TicketsTable } from "@/features/admin/components/TicketsTable"

export function AdminTicketsPage() {
  const { profile } = useAuth()
  const { reports, categories, statuses, isLoading, error, refreshTickets } = useAdminTickets()
  const { filteredReports, filters, setStatusFilter, setCategoryFilter, clearFilters } =
    useTicketFilters(reports)
  const { selectedTicket, isModalOpen, openModal, closeModal } = useTicketModal()

  const handleTicketUpdate = () => {
    refreshTickets()
    closeModal()
  }

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin - Ticketing System</h1>
        <p className="mt-2 text-muted-foreground">Manage all citizen reports</p>
      </div>

      <TicketFilters
        statuses={statuses}
        categories={categories}
        selectedStatus={filters.status}
        selectedCategory={filters.category}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onClearFilters={clearFilters}
      />

      {error && (
        <Card className="mb-6 border-red-300 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading reports...</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && <TicketsTable reports={filteredReports} onRowClick={openModal} />}

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
