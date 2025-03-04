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

interface BudgetAllocation {
  Category: string;
  TotalIndented: number;
  IndentedProposed: number;
  Paid: number;
  Committed: number;
  Available: number;
  ManpowerAllocationAmt: number;
  TravelAllocationAmt: number;
  ConsumablesAllocationAmt: number;
  ContingencyAllocationAmt: number;
  OverheadAllocationAmt: number;
  EquipmentAllocationAmt: number;
}

interface BudgetAllocationReportProps {
  data: BudgetAllocation[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384'];

export function QuarterlyReport({ data }: BudgetAllocationReportProps) {
  // Prepare data for pie charts and bar charts
  const pieChartData = useMemo(() => {
    return data.map(item => {
      const dic: { [key: string]: number } = {
        MANPOWER: item.ManpowerAllocationAmt,
        TRAVEL: item.TravelAllocationAmt,
        CONSUMABLES: item.ConsumablesAllocationAmt,
        CONTINGENCY: item.ContingencyAllocationAmt,
        OVERHEAD: item.OverheadAllocationAmt,
        EQUIPMENT: item.EquipmentAllocationAmt
      }
      return {
        name: item.Category,
        value: dic[item.Category.toUpperCase()] / (item.ManpowerAllocationAmt +
          item.TravelAllocationAmt +
          item.ConsumablesAllocationAmt +
          item.ContingencyAllocationAmt +
          item.OverheadAllocationAmt +
          item.EquipmentAllocationAmt)
      }
    });
  }, [data]);

  const barChartData = useMemo(() => {
    return data.map(item => {
      const dic: { [key: string]: number } = {
        MANPOWER: item.ManpowerAllocationAmt,
        TRAVEL: item.TravelAllocationAmt,
        CONSUMABLES: item.ConsumablesAllocationAmt,
        CONTINGENCY: item.ContingencyAllocationAmt,
        OVERHEAD: item.OverheadAllocationAmt,
        EQUIPMENT: item.EquipmentAllocationAmt
      }
      return {
        name: item.Category,
        IndentedProposed: item.IndentedProposed,
        Total: dic[item.Category.toUpperCase()]
      }
    });
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Committed</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>Utilization %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                let utilization = { percent: 0, alloc: 0 };

                switch (item.Category.toUpperCase()) {
                  case 'MANPOWER':
                    utilization.percent = ((item.TotalIndented / item.ManpowerAllocationAmt) * 100);
                    utilization.alloc = item.ManpowerAllocationAmt;
                    break;
                  case 'TRAVEL':
                    utilization.percent = ((item.TotalIndented / item.TravelAllocationAmt) * 100);
                    utilization.alloc = item.TravelAllocationAmt;
                    break;
                  case 'CONSUMABLES':
                    utilization.percent = ((item.TotalIndented / item.ConsumablesAllocationAmt) * 100);
                    utilization.alloc = item.ConsumablesAllocationAmt;
                    break;
                  case 'CONTINGENCY':
                    utilization.percent = ((item.TotalIndented / item.ContingencyAllocationAmt) * 100);
                    utilization.alloc = item.ContingencyAllocationAmt;
                    break;
                  case 'OVERHEAD':
                    utilization.percent = ((item.TotalIndented / item.OverheadAllocationAmt) * 100);
                    utilization.alloc = item.OverheadAllocationAmt;
                    break;
                  case 'EQUIPMENT':
                    utilization.percent = ((item.TotalIndented / item.EquipmentAllocationAmt) * 100);
                    utilization.alloc = item.EquipmentAllocationAmt;
                    break;
                  default:
                    break;
                }

                return (
                  <TableRow key={item.Category}>
                    <TableCell className="font-medium">{item.Category}</TableCell>
                    <TableCell>₹{item.Paid.toLocaleString()}</TableCell>
                    <TableCell>₹{item.Committed.toLocaleString()}</TableCell>
                    <TableCell>₹{utilization.alloc.toLocaleString()}</TableCell>
                    <TableCell>{utilization.percent.toFixed(2)}%</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell>₹{data.reduce((sum, item) => sum + item.Paid, 0).toLocaleString()}</TableCell>
                <TableCell>₹{data.reduce((sum, item) => sum + item.Committed, 0).toLocaleString()}</TableCell>
                <TableCell>
                  ₹{data.reduce((sum, item) =>
                    sum + item.ManpowerAllocationAmt +
                    item.TravelAllocationAmt +
                    item.ConsumablesAllocationAmt +
                    item.ContingencyAllocationAmt +
                    item.OverheadAllocationAmt +
                    item.EquipmentAllocationAmt, 0).toLocaleString()}
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuarterlyReport;