/* 
    SRP Principle
    Render tickets table

    This component is responsible only for rendering table
*/

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { getStatusBadgeVariant, getPriorityBadgeVariant } from "@/features/reports/config/badgeConfig";
import { ReportWithRelations } from "@/types/database.types";


interface TicketsTableProps {
    reports: ReportWithRelations[]
    onRowClick: (report: ReportWithRelations) => void
}

export function TicketsTable({reports, onRowClick}: TicketsTableProps) {
    if (reports.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                <p>No reports found.</p>
                <p className="mt-1 text-sm">Try adjusting your filters</p>
                </CardContent>
            </Card>
        )
    }

    return (
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
                  onClick={() => onRowClick(report)}
                >
                  <TableCell className="font-mono text-sm">
                    {report.id. slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(report.status?. name)}>
                      {report.status?.name || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(report.priority)}>
                      {report.priority || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.category?.name || "N/A"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.user?.email || "Unknown"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.address ?  `${report.address}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {report.assigned_worker ?  (
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
      </CardContent>
    </Card>
  )
}