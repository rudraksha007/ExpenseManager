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
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from '../ui/button';
import { exportQuarterlyReport } from '@/lib/file-exporter';

export interface BudgetAllocation {
  Category: string;
  Allocation: number;
  IndentedProposed: number;
  Paid: number;
  Committed: number;
  Remaining: number;
  ManpowerAllocationAmt: number;
  TravelAllocationAmt: number;
  ConsumablesAllocationAmt: number;
  ContingencyAllocationAmt: number;
  OverheadAllocationAmt: number;
  EquipmentAllocationAmt: number;
  TotalIndented: number;
}

interface BudgetAllocationReportProps {
  data: BudgetAllocation[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384'];

export function QuarterlyReport({ data }: BudgetAllocationReportProps) {
  // Prepare data for pie charts and bar charts
  const pieChartData = useMemo(() => {
    return data.map(item => ({
      name: item.Category,
      value: item.Committed
    }));
  }, [data]);

  const barChartData = useMemo(() => {
    return data.map(item => ({
      name: item.Category,
      Allocated: item.Allocation,
      Committed: item.Committed,
      Available: item.Remaining
    }));
  }, [data]);

  const totals = useMemo(() => {
      return {
        totalAllocation: data.reduce((sum, item) => sum + item.Allocation, 0),
        totalIndented: data.reduce((sum, item) => sum + item.IndentedProposed, 0),
        totalPaid: data.reduce((sum, item) => sum + item.Paid, 0),
        totalCommitted: data.reduce((sum, item) => sum + item.Committed, 0),
        totalAvailable: data.reduce((sum, item) => sum + item.Remaining, 0),
      };
    }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Allocation Pie Chart */}
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

        {/* Proposed vs Available Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Proposed vs Available Budget</CardTitle>
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
                <Bar dataKey="IndentedProposed" fill="#0088FE" />
                <Bar dataKey="Total" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Budget Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.Category}>
                <TableCell className="font-medium">{item.Category}</TableCell>
                <TableCell>₹{item.IndentedProposed.toLocaleString()}</TableCell>
                <TableCell>₹{item.Paid.toLocaleString()}</TableCell>
                <TableCell>₹{item.Committed.toLocaleString()}</TableCell>
                <TableCell>₹{item.Remaining.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell>Total</TableCell>
              <TableCell>₹{totals.totalIndented.toLocaleString()}</TableCell>
              <TableCell>₹{totals.totalPaid.toLocaleString()}</TableCell>
              <TableCell>₹{totals.totalCommitted.toLocaleString()}</TableCell>
              <TableCell>₹{totals.totalAvailable.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </CardContent>
      </Card>
      <Button onClick={() => exportQuarterlyReport(data)}>Download Report</Button>
    </div>
  );
}

export default QuarterlyReport;