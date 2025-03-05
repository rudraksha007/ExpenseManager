"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CategoryReport } from "@/components/reports/category-report";
import { GeneralReport, ProjectReport } from "@/components/reports/general-report";
import YearlyReport from "@/components/reports/yearly-report";
import { QuarterlyReport } from "@/components/reports/quarterly-report";

interface Project {
  ProjectNo: string;
  ProjectTitle: string;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<{ data: ProjectReport[]; reportType: 'general' | 'category' | 'quarterly' | 'yearly' | null }>({ data: [], reportType: null });
  const [reportType, setReportType] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("1");

  useEffect(() => {
    setLoading(true);
    if (!projects || !projects.length) fetchProjects();
    if (!reportType) return;
    setReportData({ data: [], reportType: null });
    const timer = setTimeout(() => {
      generateReport();
    }, 500);

    return () => clearTimeout(timer);
  }, [reportType, selectedYear, selectedProject, selectedQuarter, projects]);

  const fetchProjects = async () => {
    try {
      console.log("Fetching projects...");

      setLoading(true);
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.map((proj: Project) => ({
          ProjectNo: proj.ProjectNo,
          ProjectTitle: proj.ProjectTitle
        })));
      } else {
        throw new Error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Unable to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  async function generateReport() {
    if (!reportType || reportType == '') return;
    if ((reportType === "yearly" || reportType === "quarterly") && (!selectedYear || !selectedProject)) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          year: selectedYear,
          projectNo: selectedProject,
          quarter: parseInt(selectedQuarter),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setReportData(data);
      } else {
        throw new Error("Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Unable to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading report...");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Category</Label>
              <Select
                value={reportType}
                onValueChange={setReportType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(reportType === "yearly" || reportType === "quarterly") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={selectedProject}
                    onValueChange={setSelectedProject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.ProjectNo} value={project.ProjectNo}>
                          ({project.ProjectNo}) {project.ProjectTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    type="number"
                    id="year"
                    min="2000"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  />
                </div>

                {reportType === "quarterly" && (
                  <div className="space-y-2">
                    <Label htmlFor="quarter">Quarter</Label>
                    <Select
                      value={selectedQuarter}
                      onValueChange={setSelectedQuarter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select quarter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Q1</SelectItem>
                        <SelectItem value="2">Q2</SelectItem>
                        <SelectItem value="3">Q3</SelectItem>
                        <SelectItem value="4">Q4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {reportData && (
              <div className="col-span-full flex justify-end">
                <Button onClick={handleDownload}>
                  Download Report
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {reportData && !loading && (
        <div className="grid gap-6">
          {/**@ts-expect-error */}
          {reportType === "category" && reportData.reportType == 'category' && <CategoryReport projects={reportData.data} />}
          {reportType === "general" && reportData.reportType == 'general' && <GeneralReport projects={reportData.data} />}
          {/**@ts-expect-error */}
          {reportType === "yearly" && reportData.reportType == 'yearly' && <YearlyReport data={reportData.data} year={selectedYear} />}
          {/**@ts-expect-error */}
          {reportType === "quarterly" && reportData.reportType == 'quarterly' && <QuarterlyReport data={reportData.data} />}
        </div>
      )}
    </div>
  );
}