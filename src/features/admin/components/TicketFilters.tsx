/* 
    SRP Principle
    Render filter UI (status, category dropdowns)

    This component is responsible only for rendering filters
*/

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category, Status } from "@/types/database.types"
import { SelectItem } from "@radix-ui/react-select"

interface TicketFiltersProps {
  readonly statuses: Status[]
  readonly categories: Category[]
  readonly selectedStatus: string
  readonly selectedCategory: string
  readonly onStatusChange: (status: string) => void
  readonly onCategoryChange: (category: string) => void
  readonly onClearFilters: () => void
}

export function TicketFilters({
  statuses,
  categories,
  selectedStatus,
  selectedCategory,
  onStatusChange,
  onCategoryChange,
  onClearFilters,
}: TicketFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue>
                  {selectedStatus === "all"
                    ? "All Statuses"
                    : statuses.find((s) => s.id.toString() === selectedStatus)?.name ||
                      "Select status"}
                </SelectValue>
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
            <label htmlFor="category-select" className="mb-2 block text-sm font-medium">
              Category
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger id="category-select">
                <SelectValue>
                  {selectedCategory === "all"
                    ? "All Categories"
                    : categories.find((c) => c.id.toString() === selectedCategory)?.name ||
                      "Select category"}
                </SelectValue>
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

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={onClearFilters}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
