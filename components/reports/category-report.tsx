import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '../ui/button';
import { exportCategoryReport } from '@/lib/file-exporter';

interface Project {
  ProjectNo: string;
  ProjectTitle: string;
  TotalSanctionAmount: number;
  ManpowerUsed: number;
  ConsumablesUsed: number;
  ContingencyUsed: number;
  OverheadUsed: number;
  EquipmentUsed: number;
  TravelUsed: number;
  UnallocatedAmount: number;
  RemainingAllocatedAmount: number;
  TotalManpowerAmount: number;
  TotalConsumablesAmount: number;
  TotalContingencyAmount: number;
  TotalOverheadAmount: number;
  TotalEquipmentAmount: number;
  TotalTravelAmount: number;
}

export interface CategoryReportProps {
  projects: Project[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function CategoryReport({ projects }: CategoryReportProps) {
  // Prepare data for category-wise bar chart
  const categoryData = useMemo(() => {
    const categories = [
      { name: 'Manpower', key: 'ManpowerUsed' },
      { name: 'Consumables', key: 'ConsumablesUsed' },
      { name: 'Contingency', key: 'ContingencyUsed' },
      { name: 'Overhead', key: 'OverheadUsed' },
      { name: 'Equipment', key: 'EquipmentUsed' },
      { name: 'Travel', key: 'TravelUsed' }
    ];

    // Aggregate data across all projects
    const aggregatedData = categories.map(category => ({
      name: category.name,
      ...projects.reduce((acc, project) => {
        //@ts-expect-error
        acc[project.ProjectTitle] = project[category.key as keyof Project];
        return acc;
      }, {} as Record<string, number>)
    }));

    return aggregatedData;
  }, [projects]);

  // Calculate total spending for each category
  const categoryTotals = useMemo(() => {
    console.log(projects);
    

    return [
      {
        name: 'Manpower',
        total: projects.reduce((sum, p) => sum + p.ManpowerUsed, 0),
        allocated: projects.reduce((sum, p) => sum + p.TotalManpowerAmount, 0),
        percentage: (projects.reduce((sum, p) => sum + p.ManpowerUsed, 0) /
          projects.reduce((sum, p) => sum + p.TotalManpowerAmount, 0) * 100).toFixed(2)
      },
      {
        name: 'Consumables',
        total: projects.reduce((sum, p) => sum + p.ConsumablesUsed, 0),
        allocated: projects.reduce((sum, p) => sum + p.TotalConsumablesAmount, 0),
        percentage: (projects.reduce((sum, p) => sum + p.ConsumablesUsed, 0) /
          projects.reduce((sum, p) => sum + p.TotalConsumablesAmount, 0) * 100).toFixed(2)
      },
      {
        name: 'Contingency',
        total: projects.reduce((sum, p) => sum + p.ContingencyUsed, 0),
        allocated: projects.reduce((sum, p) => sum + p.TotalContingencyAmount, 0),
        percentage: (projects.reduce((sum, p) => sum + p.ContingencyUsed, 0) /
          projects.reduce((sum, p) => sum + p.TotalContingencyAmount, 0) * 100).toFixed(2)
      },
      {
        name: 'Overhead',
        total: projects.reduce((sum, p) => sum + p.OverheadUsed, 0),
        allocated: projects.reduce((sum, p) => sum + p.TotalOverheadAmount, 0),
        percentage: (projects.reduce((sum, p) => sum + p.OverheadUsed, 0) /
          projects.reduce((sum, p) => sum + p.TotalOverheadAmount, 0) * 100).toFixed(2)
      },
      {
        name: 'Equipment',
        total: projects.reduce((sum, p) => sum + p.EquipmentUsed, 0),
        allocated: projects.reduce((sum, p) => sum + p.TotalEquipmentAmount, 0),
        percentage: (projects.reduce((sum, p) => sum + p.EquipmentUsed, 0) /
          projects.reduce((sum, p) => sum + p.TotalEquipmentAmount, 0) * 100).toFixed(2)
      },
      {
        name: 'Travel',
        total: projects.reduce((sum, p) => sum + p.TravelUsed, 0),
        allocated: projects.reduce((sum, p) => sum + p.TotalTravelAmount, 0),
        percentage: (projects.reduce((sum, p) => sum + p.TravelUsed, 0) /
          projects.reduce((sum, p) => sum + p.TotalTravelAmount, 0) * 100).toFixed(2)
      }
    ];
  }, [projects]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category-wise Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{
                top: 20,
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
              {projects.map((project, index) => (
                <Bar
                  key={project.ProjectNo}
                  dataKey={project.ProjectTitle}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Spending Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Total Allocated</TableHead>
                <TableHead>% of Total Allocated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryTotals.map((category) => (
                <TableRow key={category.name}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>₹{category.total.toLocaleString('HI')}</TableCell>
                  <TableCell>₹{category.allocated.toLocaleString('HI')}</TableCell>
                  <TableCell>{category.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button onClick={() => exportCategoryReport(projects)}>Download Report</Button>
    </div>
  );
}

export default CategoryReport;