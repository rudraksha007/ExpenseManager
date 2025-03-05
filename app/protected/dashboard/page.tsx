"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, ChevronDown, ChevronUp, Loader } from "lucide-react";
import { cn, FundData } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "./PieChart";
import { Project } from "@prisma/client";
import { ProjectStatus } from "@prisma/client";
import { useRouter } from "next/navigation";


const TableRowContent = ({ project, index, role, navigate }: { project: Project; index: number; role: "PI" | "CoPI" | "Tech"; navigate: (id: string) => void }) => (
  <TableRow>
    <TableCell>{index + 1}</TableCell>
    <TableCell className="font-medium">{project.ProjectTitle}</TableCell>
    <TableCell>
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs",
          {
            "bg-green-100 text-green-800": project.ProjectStatus === ProjectStatus.COMPLETED,
            "bg-gray-100 text-yellow-800": project.ProjectStatus === ProjectStatus.ONGOING
          }
        )}
      >
        {project.ProjectStatus}
      </span>
    </TableCell>
    <TableCell>{role}</TableCell>
    <TableCell>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/protected/projects/${encodeURIComponent(project.ProjectNo)}`)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" onClick={()=>navigate(`/protected/projects/create?id=${encodeURIComponent(project.ProjectNo)}`)} />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export default function DashboardPage() {
  const [showAll, setShowAll] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [funds, setFunds] = useState<FundData>();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const resp = await fetch('/api/projects', {
        method: 'GET',
      });
      const projectsData = await resp.json();
      setProjects(projectsData as Project[]);

      const funds = await fetch('/api/funds', {
        method: 'GET',
      });
      const fundData = await funds.json();
      setFunds(fundData as FundData);
      setLoading(false);
    }
    fetchData();
  }, []);

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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        <div className="flex justify-center items-center w-full py-4">
                          <Loader className="animate-spin" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : projects?.length <= 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No Projects To Show
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects?.slice(0, 5).map((project, index) => (
                      //@ts-expect-error
                      <TableRowContent key={project.ProjectNo} project={project} index={index} role={project.role} navigate={(location) => router.push(location)} />
                    ))
                  )}

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
                                {projects?.slice(5).map((project, index) => (
                                  <TableRowContent
                                    key={project.ProjectNo}
                                    project={project}
                                    index={index + 5}
                                    //@ts-expect-error
                                    role={project.role}
                                    navigate={(location) => router.push(location)}
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

              {projects?.slice(5).length > 0 && (
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
                        {
                          showAll ? (
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
        {loading ? <LoaderCard /> : <Chart data={funds?.projectFund} title="Project Fund Distribution" />}
        {loading ? <LoaderCard /> : <Chart data={funds?.piFund} title="PI Fund Distribution" />}
        {loading ? <LoaderCard /> : <Chart data={funds?.agencyFund} title="Agency Fund Distribution" />}
      </div>
    </div>
  );
}

const LoaderCard = () => (
  <Card className="h-24 flex items-center justify-center">
    <CardContent>
      <Loader className="animate-spin" />
    </CardContent>
  </Card>
);
