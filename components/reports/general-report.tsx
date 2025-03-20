import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '../ui/button';
import { exportGeneralReport } from '@/lib/file-exporter';

export interface ProjectReport {
  ProjectNo: string;
  ProjectTitle: string;
  TotalSanctionAmount: number;
  ManpowerUsed: number;
  ConsumablesUsed: number;
  ContingencyUsed: number;
  OverheadUsed: number;
  EquipmentUsed: number;
  TravelUsed: number;
  RemainingAllocatedAmount: number;
  UnallocatedAmount: number;
}

export interface GeneralReportProps {
  projects: ProjectReport[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function GeneralReport({ projects }: { projects: ProjectReport[] }) {
  // Prepare data for pie charts
  const fundingDistributionData = useMemo(() => {
    if (!projects) return;
    return [
      { name: 'Manpower', value: projects.reduce((sum, p) => sum + p.ManpowerUsed, 0) },
      { name: 'Consumables', value: projects.reduce((sum, p) => sum + p.ConsumablesUsed, 0) },
      { name: 'Contingency', value: projects.reduce((sum, p) => sum + p.ContingencyUsed, 0) },
      { name: 'Overhead', value: projects.reduce((sum, p) => sum + p.OverheadUsed, 0) },
      { name: 'Equipment', value: projects.reduce((sum, p) => sum + p.EquipmentUsed, 0) },
      { name: 'Travel', value: projects.reduce((sum, p) => sum + p.TravelUsed, 0) }
    ];
  }, [projects]);

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project No</TableHead>
                <TableHead>Project Title</TableHead>
                <TableHead>Manpower Used</TableHead>
                <TableHead>Consumables Used</TableHead>
                <TableHead>Contingency Used</TableHead>
                <TableHead>Overhead Used</TableHead>
                <TableHead>Equipment Used</TableHead>
                <TableHead>Travel Used</TableHead>
                <TableHead>Remaining Allocated</TableHead>
                <TableHead>Remaining Unallocated</TableHead>
                <TableHead>Total Sanctioned Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.ProjectNo}>
                  <TableCell>{project.ProjectNo}</TableCell>
                  <TableCell>{project.ProjectTitle}</TableCell>
                  <TableCell>₹{project.ManpowerUsed.toLocaleString("HI")}</TableCell>
                  <TableCell>₹{project.ConsumablesUsed.toLocaleString("HI")}</TableCell>
                  <TableCell>₹{project.ContingencyUsed.toLocaleString("HI")}</TableCell>
                  <TableCell>₹{project.OverheadUsed.toLocaleString("HI")}</TableCell>
                  <TableCell>₹{project.EquipmentUsed.toLocaleString("HI")}</TableCell>
                  <TableCell>₹{project.TravelUsed.toLocaleString("HI")}</TableCell>
                  <TableCell>₹{project.RemainingAllocatedAmount.toLocaleString("HI")}</TableCell>
                  <TableCell>₹{project.UnallocatedAmount.toLocaleString("HI")}</TableCell>
                  <TableCell>₹{project.TotalSanctionAmount.toLocaleString("HI")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Funding Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey="value"
                // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {fundingDistributionData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Button onClick={() => exportGeneralReport(projects)}>Download Report</Button>
    </div>
  );
}

export default GeneralReport;