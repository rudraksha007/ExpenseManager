import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '../ui/button';
import { exportYearlyReport } from '@/lib/file-exporter';

export interface YearlyBudgetAllocation {
  Category: string;
  Allocation: number;
  IndentedProposed: number;
  Paid: number;
  Committed: number;
  AvailableAllocatedAmt: number;
  UnallocatedAmt: number;
}

interface YearlyBudgetReportProps {
  data: YearlyBudgetAllocation[];
  year: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384'];

export default function YearlyReport({ data, year }: YearlyBudgetReportProps) {
  // Prepare data for pie charts
  const pieChartData = useMemo(() => {
    return data.map(item => ({
      name: item.Category,
      value: item.IndentedProposed
    }));
  }, [data]);

  // Prepare data for bar charts
  const barChartData = useMemo(() => {
    return data.map(item => ({
      name: item.Category,
      Allocated: item.Allocation,
      Indented: item.IndentedProposed,
      Available: item.AvailableAllocatedAmt
    }));
  }, [data]);

  // Calculate total allocations and spending
  const totals = useMemo(() => {
    return {
      totalAllocation: data.reduce((sum, item) => sum + item.Allocation, 0),
      totalIndented: data.reduce((sum, item) => sum + item.IndentedProposed, 0),
      totalPaid: data.reduce((sum, item) => sum + item.Paid, 0),
      totalCommitted: data.reduce((sum, item) => sum + item.Committed, 0),
      totalAvailable: data.reduce((sum, item) => sum + item.AvailableAllocatedAmt, 0),
      totalUnallocated: data.reduce((sum, item) => sum + item.UnallocatedAmt, 0)
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Yearly Budget Report for {year}-{year + 1}</CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Budget Allocation Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Comparison Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation vs Indented</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Allocated" fill="#0088FE" />
                <Bar dataKey="Indented" fill="#00C49F" />
                <Bar dataKey="Available" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Budget Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                {/* <TableHead>Allocated</TableHead> */}
                <TableHead>Indented</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Committed</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Unallocated</TableHead>
                <TableHead>Utilization %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                const utilizationPercentage = item.Allocation > 0 
                  ? ((item.IndentedProposed / item.Allocation) * 100).toFixed(2)
                  : '0.00';

                return (
                  <TableRow key={item.Category}>
                    <TableCell className="font-medium">{item.Category}</TableCell>
                    {/* <TableCell>₹{item.Allocation.toLocaleString()}</TableCell> */}
                    <TableCell>₹{item.IndentedProposed.toLocaleString()}</TableCell>
                    <TableCell>₹{item.Paid.toLocaleString()}</TableCell>
                    <TableCell>₹{item.Committed.toLocaleString()}</TableCell>
                    <TableCell>₹{item.AvailableAllocatedAmt.toLocaleString()}</TableCell>
                    <TableCell>₹{item.UnallocatedAmt.toLocaleString()}</TableCell>
                    <TableCell>{utilizationPercentage}%</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell>₹{totals.totalAllocation.toLocaleString()}</TableCell>
                {/* <TableCell>₹{totals.totalIndented.toLocaleString()}</TableCell> */}
                <TableCell>₹{totals.totalPaid.toLocaleString()}</TableCell>
                <TableCell>₹{totals.totalCommitted.toLocaleString()}</TableCell>
                <TableCell>₹{totals.totalAvailable.toLocaleString()}</TableCell>
                <TableCell>₹{totals.totalUnallocated.toLocaleString()}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button onClick={() => exportYearlyReport(data, year)}>Download Report</Button>
    </div>
  );
}