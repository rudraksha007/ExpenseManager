"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { ProjectDetails } from "@/components/projects/project-details";
import { ProjectTable } from "@/components/projects/project-table";
import { formatCurrency } from "@/lib/utils";
import { FormDialog, type FormField } from "@/components/ui/form-dialog";

// Define columns for different indent types
interface FieldMap {
    Consumables: FormField[];
    Travels: FormField[];
    Contingency: FormField[];
    Equipments: FormField[];
    Manpower: FormField[];
}
const consumablesColumns = [
  { header: "Indent ID", accessor: "IndentID" },
  { header: "Employee ID", accessor: "EmployeeID" },
  { header: "Date", accessor: "RequestedDate" },
  { header: "Description", accessor: "Reason" },
  {
    header: "Amount",
    accessor: "RequestedAmt",
    render: (item: any) => formatCurrency(item.RequestedAmt)
  },
  { header: "Status", accessor: "Status" }
];

const travelsColumns = [
  { header: "Indent ID", accessor: "IndentID" },
  { header: "Employee ID", accessor: "EmployeeID" },
  { header: "Travel Date", accessor: "RequestedDate" },
  { header: "Purpose", accessor: "Reason" },
  {
    header: "Amount",
    accessor: "RequestedAmt",
    render: (item: any) => formatCurrency(item.RequestedAmt)
  },
  { header: "Status", accessor: "Status" }
];

const dummyProjectData = {
  ProjectTitle: "Sample Research Project",
  ProjectNo: "PRJ-2025-ABCD",
  FundedBy: "National Science Foundation",
  SanctionOrderNo: "NSF-12345",
  TotalSanctionAmount: 500000,
  ProjectStartDate: "2024-01-01",
  ProjectEndDate: "2026-12-31",
  PIs: [{ name: "Dr. John Doe" }],
  CoPIs: [{ name: "Dr. Jane Smith" }],
  Workers: [{ name: "Alice Johnson" }],
  ManpowerAllocationAmt: 100000,
  ConsumablesAllocationAmt: 50000,
  ContingencyAllocationAmt: 30000,
  OverheadAllocationAmt: 20000,
  EquipmentAllocationAmt: 200000,
  TravelAllocationAmt: 50000,
  indents: [
    {
      IndentType: "Consumables",
      EmployeeID: "EMP001",
      IndentID: "IND-001",
      RequestedDate: "2025-02-01",
      Reason: "Lab Equipment Purchase",
      RequestedAmt: 12000,
      Status: "Pending"
    },
    {
      IndentType: "Consumables",
      EmployeeID: "EMP003",
      IndentID: "IND-003",
      RequestedDate: "2025-02-15",
      Reason: "Chemical Reagents",
      RequestedAmt: 8000,
      Status: "Approved"
    },
    {
      IndentType: "Travels",
      EmployeeID: "EMP002",
      IndentID: "IND-002",
      RequestedDate: "2025-03-15",
      Reason: "Conference Visit",
      RequestedAmt: 30000,
      Status: "Approved"
    },
    {
      IndentType: "Travels",
      EmployeeID: "EMP001",
      IndentID: "IND-004",
      RequestedDate: "2025-04-01",
      Reason: "Field Research",
      RequestedAmt: 15000,
      Status: "Pending"
    }
  ],
};


export default function ProjectPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popLoading, setPopLoading] = useState<boolean>(false);
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Consumables" | "Travels" | "Contingency" | "Equipments" | "Manpower">("Consumables");
  const [dialogContent, setDialogContent] = useState(null);
  const fieldMap: FieldMap = {
    Consumables: [
      {
        id: "RequestedDate",
        label: "Date",
        type: "date",
        required: true,
        max: Number(new Date().toISOString().split("T")[0]), // Today's date
      },
      {
        id: "ProjectNo",
        label: "Project No",
        type: "text",
        readOnly: true,
        value: project?.ProjectNo||"",
      },
      {
        id: "ProjectTitle",
        label: "Project Title",
        type: "text",
        readOnly: true,
        value: project?.ProjectTitle||"",
      },
      {
        id: "RequestedAmt",
        label: "Invoice Amount",
        type: "number",
        min: 1,
        max: project?.RemainingConsumablesAmt||"",
      },
      {
        id: "EmployeeID",
        label: "Employee ID",
        type: "text",
        required: true,
        readOnly: true,
        value: "project.profile.id",
      },
      {
        id: "EmployeeName",
        label: "Employee Name",
        type: "text",
        required: true,
        readOnly: true,
        value: "project.profile.name",
      },
      {
        id: "Reason",
        label: "Reason",
        type: "text",
        required: true,
      },
      {
        id: "Remarks",
        label: "Remarks",
        type: "textarea",
        rows: 4,
      },
      {
        id: "BillCopy",
        label: "Support Document (PDF)",
        type: "file",
        required: true,
        accept: "application/pdf",
        multiple: true,
      },
    ],
    Travels: [
      {
        id: "ProjectNo",
        label: "Project No",
        type: "text",
        readOnly: true,
        value: project?.ProjectNo||"",
      },
      {
        id: "ProjectTitle",
        label: "Project Title",
        type: "text",
        readOnly: true,
        value: project?.ProjectTitle||"",
      },
      {
        id: "RequestedDate",
        label: "Requested Date",
        type: "date",
        required: true,
        max: Number(new Date().toISOString().split("T")[0]), // Today's date
      },
      {
        id: "EmployeeName",
        label: "Employee Name",
        type: "text",
        required: true,
        readOnly: true,
        value: "Employee name",
      },
      {
        id: "EmployeeID",
        label: "Employee ID",
        type: "number",
        required: true,
        readOnly: true,
        value: "id",
      },
      {
        id: "Source",
        label: "From Place",
        type: "text",
        required: true,
      },
      {
        id: "FromDate",
        label: "From Date",
        type: "date",
        required: true,
        max: Number(new Date().toISOString().split("T")[0]),
      },
      {
        id: "Destination",
        label: "Destination",
        type: "text",
        required: true,
      },
      {
        id: "DestinationDate",
        label: "To Date",
        type: "date",
        required: true,
        max: Number(new Date().toISOString().split("T")[0]),
      },
      {
        id: "Reason",
        label: "Purpose",
        type: "text",
        required: true,
      },
      {
        id: "RequestedAmt",
        label: "Invoice Amount",
        type: "number",
        min: 1,
        required: true,
        max: project?.RemainingTravelAmt,
      },
      {
        id: "Remarks",
        label: "Remarks",
        type: "textarea",
        rows: 4,
      },
      {
        id: "BillCopy",
        label: "Travel Expense",
        type: "file",
        required: true,
        accept: "application/pdf",
        multiple: true,
        // title: "Upload Receipt",
      },
    ],
    Contingency: [
      {
        id: "RequestedDate",
        label: "Date",
        type: "date",
        required: true,
        max: Number(new Date().toISOString().split("T")[0]), // Today's date
      },
      {
        id: "ProjectNo",
        label: "Project No",
        type: "text",
        readOnly: true,
        value: project?.ProjectNo||"",
      },
      {
        id: "ProjectTitle",
        label: "Project Title",
        type: "text",
        readOnly: true,
        value: project?.ProjectTitle||"",
      },
      {
        id: "EmployeeID",
        label: "Employee ID",
        type: "text",
        required: true,
        readOnly: true,
        value: "id",
      },
      {
        id: "EmployeeName",
        label: "Employee Name",
        type: "text",
        required: true,
        value: "name",
      },
      {
        id: "Reason",
        label: "Purpose",
        type: "text",
        required: true,
      },
      {
        id: "RequestedAmt",
        label: "Invoice Amount",
        type: "number",
        min: 0,
        max: project?.projectRemainingContingencyAmt,
      },
      {
        id: "Remarks",
        label: "Remarks",
        type: "textarea",
        rows: 4,
      },
      {
        id: "BillCopy",
        label: "Bill Copy (PDF)",
        type: "file",
        required: true,
        accept: "application/pdf",
        multiple: true,
      },
    ],
    Equipments: [],
    Manpower: [],
  };
  useEffect(() => {
    if (id === "abcd") {
      setProject(dummyProjectData);
      setLoading(false);
    } else {
      fetchProjectData();
    }
  }, [id]);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", Object.fromEntries(data.entries()));
    setLoading(false);
    setIsOpen(false);
};

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      if (data.success) {
        setProject(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch project data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    // Implement add new functionality
    console.log("Adding new indent for", activeTab);
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Project Details</h1>
        <Button variant="outline" onClick={() => {/* Implement edit navigation */ }}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </div>

      <ProjectDetails project={project} onViewTeam={(type: string) => console.log(`Viewing team of type: ${type}`)} />

      <Card>
        <CardHeader>
          <CardTitle>Project Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "Consumables" | "Travels" | "Contingency" | "Equipments" | "Manpower")}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="Consumables">Consumables</TabsTrigger>
              <TabsTrigger value="Contingency">Contingency</TabsTrigger>
              <TabsTrigger value="Travels">Travels</TabsTrigger>
              <TabsTrigger value="Equipments">Equipments</TabsTrigger>
              <TabsTrigger value="Manpower">Manpower</TabsTrigger>
            </TabsList>

            <TabsContent value="Consumables">
              <ProjectTable
                data={project.indents.filter((i:any) => i.IndentType === "Consumables")}
                columns={consumablesColumns}
                onAdd={handleAddNew}
              />
            </TabsContent>

            <TabsContent value="Travels">
              <ProjectTable
                data={project.indents.filter((i:any) => i.IndentType === "Travels")}
                columns={travelsColumns}
                onAdd={handleAddNew}
              />
            </TabsContent>
            <TabsContent value="Contingency">
              <ProjectTable
                data={project.indents.filter((i:any) => i.IndentType === "Contingency")}
                columns={consumablesColumns} // Assuming similar columns for Contingency
                onAdd={handleAddNew}
              />
            </TabsContent>

            <TabsContent value="Equipments">
              <ProjectTable
                data={project.indents.filter((i:any) => i.IndentType === "Equipments")}
                columns={consumablesColumns} // Assuming similar columns for Equipments
                onAdd={handleAddNew}
              />
            </TabsContent>

            <TabsContent value="Manpower">
              <ProjectTable
                data={project.indents.filter((i:any) => i.IndentType === "Manpower")}
                columns={consumablesColumns} // Assuming similar columns for Manpower
                onAdd={handleAddNew}
              />
            </TabsContent>
            <FormDialog
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onSubmit={handleSubmit}
              title={`Add ${activeTab}`}
              fields={fieldMap[activeTab]}
              loading={popLoading}
            />
          </Tabs>
        </CardContent>
      </Card>

      {dialogContent}
    </div>
  );
}