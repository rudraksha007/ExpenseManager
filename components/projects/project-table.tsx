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
import { Indents } from "@prisma/client";

interface Column {
  header: string;
  accessor: string | ((item: Indents, index: number) => string);
  render?: (item: Indents) => React.ReactNode;
}

interface ProjectTableProps {
  data: Indents[];
  columns: Column[];
  onAdd: null | (() => void);
}

export function ProjectTable({ data, columns, onAdd }: ProjectTableProps) {
  return (
    <div className="space-y-4">
      {onAdd &&
        <div className="flex justify-end">
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      }

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
                      //@ts-expect-error
                      item[column.accessor] as string}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}