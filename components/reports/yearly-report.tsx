"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface YearlyReportProps {
  data: any;
}

export function YearlyReport({ data }: YearlyReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Project Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Allocated</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Remaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(data.allocations).map(([category, values]: [string, any]) => (
              <TableRow key={category}>
                <TableCell className="font-medium">{category}</TableCell>
                <TableCell>₹{values.allocated.toLocaleString()}</TableCell>
                <TableCell>₹{values.spent.toLocaleString()}</TableCell>
                <TableCell>₹{values.remaining.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}