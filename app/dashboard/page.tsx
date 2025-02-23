"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Eye, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";

// Mock data remains the same
const mockProjects = [
  { id: 1, title: "E-commerce Platform", status: "Active", role: "Lead Developer" },
  { id: 2, title: "CRM System", status: "Pending", role: "Frontend Developer" },
  { id: 3, title: "Mobile App", status: "Completed", role: "Full Stack Developer" },
  { id: 4, title: "Analytics Dashboard", status: "Active", role: "Backend Developer" },
  { id: 5, title: "Content Management", status: "Pending", role: "Project Manager" },
  { id: 6, title: "Social Media Platform", status: "Active", role: "Tech Lead" },
  { id: 7, title: "Payment Gateway", status: "Completed", role: "System Architect" },
  { id: 8, title: "Inventory System", status: "Active", role: "Developer" },
];

const mockFundData = {
  projectFund: [
    { name: "Allocated", value: 70000 },
    { name: "Remaining", value: 30000 },
  ],
  piFund: [
    { name: "Research", value: 40000 },
    { name: "Equipment", value: 20000 },
    { name: "Travel", value: 10000 },
  ],
  agencyFund: [
    { name: "Government", value: 50000 },
    { name: "Private", value: 30000 },
    { name: "NGO", value: 20000 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Project {
  id: number;
  title: string;
  status: string;
  role: string;
}

const TableRowContent = ({ project, index }: { project: Project; index: number }) => (
  <TableRow>
    <TableCell>{index + 1}</TableCell>
    <TableCell className="font-medium">{project.title}</TableCell>
    <TableCell>
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs",
          {
            "bg-green-100 text-green-800": project.status === "Active",
            "bg-yellow-100 text-yellow-800": project.status === "Pending",
            "bg-gray-100 text-gray-800": project.status === "Completed"
          }
        )}
      >
        {project.status}
      </span>
    </TableCell>
    <TableCell>{project.role}</TableCell>
    <TableCell>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export default function DashboardPage() {
  const [hasData] = useState(true);
  const [showAll, setShowAll] = useState(false);
  
  const initialProjects = mockProjects.slice(0, 5);
  const additionalProjects = mockProjects.slice(5);

  const renderPieChart = (data: any[], title: string) => (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>User Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sl.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Always show first 5 items */}
                  {initialProjects.map((project, index) => (
                    <TableRowContent key={project.id} project={project} index={index} />
                  ))}
                  
                  {/* Animate additional items */}
                  <AnimatePresence>
                    {showAll && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={5} className="p-0">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <Table>
                              <TableBody>
                                {additionalProjects.map((project, index) => (
                                  <TableRowContent 
                                    key={project.id} 
                                    project={project} 
                                    index={index + 5} 
                                  />
                                ))}
                              </TableBody>
                            </Table>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
              
              {mockProjects.length > 5 && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-2"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showAll ? 'less' : 'more'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        {showAll ? (
                          <>
                            Show Less
                            <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Show More
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderPieChart(mockFundData.projectFund, "Project Fund Distribution")}
        {renderPieChart(mockFundData.piFund, "PI Fund Distribution")}
        {renderPieChart(mockFundData.agencyFund, "Agency Fund Distribution")}
      </div>
    </div>
  );
}