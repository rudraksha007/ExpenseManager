"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Column {
  header: string;
  accessor: string | ((item: any, index: number) => any);
  render?: (item: any) => React.ReactNode;
}

interface ProjectTableProps {
  data: any[];
  columns: Column[];
  onAdd: () => void;
}

export function ProjectTable({ data, columns, onAdd }: ProjectTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.render ? column.render(item) : 
                   typeof column.accessor === "function" ? 
                     column.accessor(item, rowIndex) : 
                     item[column.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}