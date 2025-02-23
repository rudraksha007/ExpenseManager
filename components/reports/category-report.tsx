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

interface CategoryReportProps {
  data: any;
}

export function CategoryReport({ data }: CategoryReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category-wise Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Total Projects</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Active Projects</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.categories.map((category: any) => (
              <TableRow key={category.name}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.totalProjects}</TableCell>
                <TableCell>₹{category.totalAmount.toLocaleString()}</TableCell>
                <TableCell>{category.activeProjects}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}