"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { ProjectDetails } from "@/components/projects/project-details";
import { ProjectTable } from "@/components/projects/project-table";
import { formatCurrency } from "@/lib/utils";
import { FormDialog, type FormField } from "@/components/ui/form-dialog";
import { useSession } from "next-auth/react";
import { IndentType } from "@prisma/client";
import { toast } from "sonner";

// Define columns for different indent types
interface FieldMap {
  Consumables: FormField[];
  Travel: FormField[];
  Contingency: FormField[];
  Equipment: FormField[];
  Manpower: FormField[];
}
const consumablesColumns = [
  { header: "Indent ID", accessor: "IndentNo" },
  { header: "Employee ID", accessor: "ActionedById" },
  { header: "Date", accessor: "IndentDate", render: (item: any) => new Date(item.IndentDate).toISOString().split('T')[0] },
  { header: "Description", accessor: "IndentReason" },
  {
    header: "Amount",
    accessor: "IndentAmount",
    render: (item: any) => formatCurrency(item.IndentAmount)
  },
  { header: "Status", accessor: "IndentStatus" }
];

const travelsColumns = [
  { header: "Indent ID", accessor: "IndentNo" },
  { header: "Employee ID", accessor: "ActionedById" },
  { header: "Travel Date", accessor: "IndentDate", render: (item: any) => new Date(item.IndentDate).toISOString().split('T')[0] },
  { header: "Purpose", accessor: "IndentReason" },
  {
    header: "Amount",
    accessor: "IndentAmount",
    render: (item: any) => formatCurrency(item.IndentAmount)
  },
  { header: "Status", accessor: "IndentStatus" }
];

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useSession().data?.user;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popLoading, setPopLoading] = useState<boolean>(false);
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Consumables" | "Travel" | "Contingency" | "Equipment" | "Manpower">("Consumables");
  const [dialogContent, setDialogContent] = useState(null);
  //@ts-ignore
  const fieldMap: FieldMap = useMemo(() => {
    return {
      Consumables: [
        {
          id: "IndentDate",
          label: "Date",
          type: "date",
          required: true,
          min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
          max: project?.createdAt ? new Date(project.ProjectEndDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
        },
        {
          id: "ProjectNo",
          label: "Project No",
          type: "text",
          readOnly: true,
          value: project?.ProjectNo || "",
        },
        {
          id: "ProjectTitle",
          label: "Project Title",
          type: "text",
          readOnly: true,
          value: project?.ProjectTitle || "",
        },
        {
          id: "IndentNo",
          label: "Indent No",
          type: "text",
          required: true
        },
        {
          id: "IndentAmount",
          label: "Invoice Amount",
          type: "number",
          min: 1,
          max: project?.RemainingConsumablesAmt || project?.ConsumablesAllocationAmt.toString(),
        },
        {
          id: "EmployeeID",
          label: "Employee ID",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.EmployeeId || "Error",
        },
        {
          id: "EmployeeName",
          label: "Employee Name",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.name || "Error",
        },
        {
          id: "IndentReason",
          label: "Reason",
          type: "text",
          required: true,
        },
        {
          id: "IndentRemarks",
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
      Travel: [
        {
          id: "ProjectNo",
          label: "Project No",
          type: "text",
          readOnly: true,
          value: project?.ProjectNo || "",
        },
        {
          id: "ProjectTitle",
          label: "Project Title",
          type: "text",
          readOnly: true,
          value: project?.ProjectTitle || "",
        },
        {
          id: "IndentNo",
          label: "Indent No",
          type: "text",
          required: true
        },
        {
          id: "IndentDate",
          label: "Requested Date",
          type: "date",
          required: true,
          min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
          max: project?.createdAt ? new Date(project.ProjectEndDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
        },
        {
          id: "EmployeeName",
          label: "Employee Name",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.name || "",
        },
        {
          id: "EmployeeID",
          label: "Employee ID",
          type: "number",
          required: true,
          readOnly: true,
          value: user?.EmployeeId || "",
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
          min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
          max: project?.createdAt ? new Date(project.ProjectEndDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
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
          min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
          max: project?.createdAt ? new Date(project.ProjectEndDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
        },
        {
          id: "IndentReason",
          label: "Purpose",
          type: "text",
          required: true,
        },
        {
          id: "IndentAmount",
          label: "Invoice Amount",
          type: "number",
          min: 1,
          required: true,
          max: project?.RemainingTravelAmt || project?.TravelAllocationAmt.toString(),
        },
        {
          id: "IndentRemarks",
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
          title: "Upload Receipt",
        },
      ],
      Contingency: [
        {
          id: "IndentDate",
          label: "Date",
          type: "date",
          required: true,
          min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
          max: project?.createdAt ? new Date(project.ProjectEndDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
        },
        {
          id: "ProjectNo",
          label: "Project No",
          type: "text",
          readOnly: true,
          value: project?.ProjectNo || "",
        },
        {
          id: "IndentNo",
          label: "Indent No",
          type: "text",
          required: true
        },
        {
          id: "ProjectTitle",
          label: "Project Title",
          type: "text",
          readOnly: true,
          value: project?.ProjectTitle || "",
        },
        {
          id: "EmployeeID",
          label: "Employee ID",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.EmployeeId || "",
        },
        {
          id: "EmployeeName",
          label: "Employee Name",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.name || "",
        },
        {
          id: "IndentReason",
          label: "Purpose",
          type: "text",
          required: true,
        },
        {
          id: "IndentAmount",
          label: "Invoice Amount",
          type: "number",
          min: 0,
          max: project?.projectRemainingContingencyAmt || project?.ContingencyAllocationAmt.toString(),
        },
        {
          id: "IndentRemarks",
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
      Equipment: [
        {
          id: "IndentDate",
          label: "Date",
          type: "date",
          required: true,
          min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
          max: project?.createdAt ? new Date(project.ProjectEndDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
        },
        {
          id: "ProjectNo",
          label: "Project No",
          type: "text",
          readOnly: true,
          value: project?.ProjectNo || "",
        },
        {
          id: "ProjectTitle",
          label: "Project Title",
          type: "text",
          readOnly: true,
          value: project?.ProjectTitle || "",
        },
        {
          id: "IndentNo",
          label: "Indent No",
          type: "text",
          required: true
        },
        {
          id: "IndentAmount",
          label: "Invoice Amount",
          type: "number",
          min: 1,
          max: project?.RemainingConsumablesAmt || project?.ConsumablesAllocationAmt.toString(),
        },
        {
          id: "EmployeeID",
          label: "Employee ID",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.EmployeeId || "Error",
        },
        {
          id: "EmployeeName",
          label: "Employee Name",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.name || "Error",
        },
        {
          id: "IndentReason",
          label: "Equipment Name",
          type: "text",
          required: true,
        },
        {
          id: "IndentRemarks",
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
      Manpower: [
        {
          id: "IndentDate",
          label: "Date",
          type: "date",
          required: true,
          min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
          max: project?.createdAt ? new Date(project.ProjectEndDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
        },
        {
          id: "ProjectNo",
          label: "Project No",
          type: "text",
          readOnly: true,
          value: project?.ProjectNo || "",
        },
        {
          id: "ProjectTitle",
          label: "Project Title",
          type: "text",
          readOnly: true,
          value: project?.ProjectTitle || "",
        },
        {
          id: "IndentNo",
          label: "Indent No",
          type: "text",
          required: true
        },
        {
          id: "IndentAmount",
          label: "Invoice Amount",
          type: "number",
          min: 1,
          max: project?.RemainingConsumablesAmt || project?.ConsumablesAllocationAmt.toString(),
        },
        {
          id: "EmployeeID",
          label: "Employee ID",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.EmployeeId || "Error",
        },
        {
          id: "EmployeeName",
          label: "Employee Name",
          type: "text",
          required: true,
          readOnly: true,
          value: user?.name || "Error",
        },
        {
          id: "IndentReason",
          label: "Person Name",
          type: "text",
          required: true,
        },
        {
          id: "IndentRemarks",
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
    };
  }, [project, user]);
  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const files = data.getAll("BillCopy") as File[];
    let BillCopy;
    if (files.length !== 0) {
      BillCopy = await Promise.all(files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }));
    }

    const newIndent = {
      ProjectNo: project?.ProjectNo || "",
      ProjectTitle: project?.ProjectTitle || "",
      IndentNo: data.get("IndentNo"),
      IndentDate: new Date().toISOString().split("T")[0],
      Type: activeTab.toUpperCase() as IndentType,
      IndentAmount: data.get("IndentAmount"),
      IndentQty: parseInt(data.get('IndentQty')?.toString() || "1"),
      ActionDate: new Date().toISOString().split("T")[0],
      ActionedById: user?.EmployeeId || "",
      IndentReason: data.get("IndentReason"),
      IndentRemarks: data.get("IndentRemarks"),
      BillCopy: BillCopy ? BillCopy : [],
      indentData: Object.fromEntries(data.entries().filter(([key]) => !["ProjectNo", "ProjectTitle", "IndentNo", "IndentDate", "Type", "IndentAmount", "IndentQty", "ActionDate", "ActionedById", "IndentReason", "IndentRemarks", "BillCopy"].includes(key)))
    };

    console.log(newIndent);
    try {
      const resp = await fetch('/api/indents/create', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newIndent)
      });
      if (!resp.ok) {
        throw new Error("Failed to create new indent");
      }
      else {
        toast.success("Indent created successfully", {
          position: 'top-right'
        });
      }
    } catch (err) {
      toast.error("Failed to create new indent",
        {
          position: 'top-right'
        }
      );
    }
    finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error("Failed to fetch project data");
      const data = await response.json();
      if (data) {
        setProject(data);
      }
      console.log(data);

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
        <Button variant="outline" onClick={() => { router.push(`/protected/projects/create?id=${encodeURIComponent(project.ProjectNo)}`) }}>
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "Consumables" | "Travel" | "Contingency" | "Equipment" | "Manpower")}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="Consumables">Consumables</TabsTrigger>
              <TabsTrigger value="Contingency">Contingency</TabsTrigger>
              <TabsTrigger value="Travel">Travels</TabsTrigger>
              <TabsTrigger value="Equipment">Equipments</TabsTrigger>
              <TabsTrigger value="Manpower">Manpower</TabsTrigger>
            </TabsList>

            <TabsContent value="Consumables">
              <ProjectTable
                data={project.Indents ? project.Indents.filter((i: any) => i.Type === IndentType.CONSUMABLES) : []}
                columns={consumablesColumns}
                onAdd={handleAddNew}
              />
            </TabsContent>

            <TabsContent value="Travel">
              <ProjectTable
                data={project.Indents ? project.Indents.filter((i: any) => i.Type === IndentType.TRAVEL) : []}
                columns={travelsColumns}
                onAdd={handleAddNew}
              />
            </TabsContent>
            <TabsContent value="Contingency">
              <ProjectTable
                data={project.Indents ? project.Indents.filter((i: any) => i.Type === IndentType.CONTINGENCY) : []}
                columns={consumablesColumns} // Assuming similar columns for Contingency
                onAdd={handleAddNew}
              />
            </TabsContent>

            <TabsContent value="Equipment">
              <ProjectTable
                data={project.Indents ? project.Indents.filter((i: any) => i.Type === IndentType.EQUIPMENT) : []}
                columns={consumablesColumns} // Assuming similar columns for Equipments
                onAdd={handleAddNew}
              />
            </TabsContent>

            <TabsContent value="Manpower">
              <ProjectTable
                data={project.Indents ? project.Indents.filter((i: any) => i.Type === IndentType.MANPOWER) : []}
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