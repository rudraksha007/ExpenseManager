'use client';
import { ProjectTable } from "@/components/projects/project-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDialog } from "@/components/ui/form-dialog";
import { Tabs, TabsList,TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { FieldMap } from "./page";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Indents, IndentType, Project } from "@prisma/client";
import { EquipmentIndent } from "@/components/indents/equipment-indent";
import { ManpowerIndent } from "@/components/indents/manpower-indent";
import { useRouter } from "next/navigation";

const consumablesColumns = [
    { header: "Indent ID", accessor: "IndentNo" },
    { header: "Employee ID", accessor: "IndentPersonId" },
    { header: "Date", accessor: "IndentDate", render: (item: Indents) => new Date(item.IndentDate).toISOString().split('T')[0] },
    { header: "Description", accessor: "IndentReason" },
    {
        header: "Amount",
        accessor: "IndentAmount",
        render: (item: Indents) => formatCurrency(item.IndentAmount)
    },
    { header: "Status", accessor: "IndentStatus" }
];

const manpowerColumns = [
    { header: "Indent ID", accessor: "IndentNo" },
    { header: "Employee ID", accessor: "IndentPersonId" },
    { header: "Date", accessor: "IndentDate", render: (item: Indents) => new Date(item.IndentDate).toISOString().split('T')[0] },
    { header: "Description", accessor: "IndentReason" },
    {
        header: "Amount",
        accessor: "IndentAmount",
        render: (item: Indents) => formatCurrency(item.IndentAmount)
    },
];

const travelsColumns = [
    { header: "Indent ID", accessor: "IndentNo" },
    { header: "Employee ID", accessor: "IndentPersonId" },
    { header: "Travel Date", accessor: "IndentDate", render: (item: Indents) => new Date(item.IndentDate).toISOString().split('T')[0] },
    { header: "Purpose", accessor: "IndentReason" },
    {
        header: "Amount",
        accessor: "IndentAmount",
        render: (item: Indents) => formatCurrency(item.IndentAmount)
    },
    { header: "Status", accessor: "IndentStatus" }
];
export interface ExtendedProject extends Project {
    RemainingConsumablesAmt: number;
    ConsumablesAllocationAmt: number;
    RemainingTravelAmt: number;
    TravelAllocationAmt: number;
    projectRemainingContingencyAmt: number;
    ContingencyAllocationAmt: number;
    Indents: Indents[];
}

export default function ProjectTabs({ project, isOpen, setIsOpen, loading, setLoading, reloadData, activeTab, setActiveTab }:{project: ExtendedProject, isOpen: boolean, setIsOpen: (value: boolean) => void, loading: boolean, setLoading: (value: boolean) => void, reloadData: () => void, activeTab: "Consumables" | "Travel" | "Contingency" | "Equipment" | "Manpower", setActiveTab: (value: "Consumables" | "Travel" | "Contingency" | "Equipment" | "Manpower") => void}) {
    const user = useSession().data?.user;
    const [popLoading, setPopLoading] = useState<boolean>(false);
    const [newIndentNo, setNewIndentNo] = useState<number>(0);
    const routr = useRouter();

    //@ts-expect-error
    const fieldMap: FieldMap = useMemo(() => {
        return {
            Consumables: [
                {
                    id: "IndentDate",
                    label: "Date",
                    type: "date",
                    required: true,
                    min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
                    max: project?.createdAt ? new Date(project.ProjectEndDate||'').toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
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
                    required: true,
                    value: newIndentNo,
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
                    required: true,
                    value: newIndentNo,
                },
                {
                    id: "IndentDate",
                    label: "Requested Date",
                    type: "date",
                    required: true,
                    min: project?.createdAt ? new Date(project.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Project start date
                    max: project?.createdAt ? new Date(project.ProjectEndDate||'').toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
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
                    max: project?.createdAt ? new Date(project.ProjectEndDate||'').toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
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
                    max: project?.createdAt ? new Date(project.ProjectEndDate||'').toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
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
                    max: project?.createdAt ? new Date(project.ProjectEndDate||'').toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
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
                    required: true,
                    value: newIndentNo,
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
                    max: project?.createdAt ? new Date(project.ProjectEndDate||'').toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
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
                    required: true,
                    value: newIndentNo,
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
                    max: project?.createdAt ? new Date(project.ProjectEndDate||'').toISOString().split('T')[0] : new Date().toISOString().split("T")[0], // Today's date
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
                    type: "number",
                    required: true,
                    value: newIndentNo,
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
    }, [project, user, newIndentNo]);
    const handleSubmit = async (data: FormData) => {
        setLoading(true);
        const BillCopy = data.getAll("BillCopy") as string[];
        
        
        const newIndent: Record<string, any> = {
            ProjectNo: project?.ProjectNo || "",
            ProjectTitle: project?.ProjectTitle || "",
            IndentNo: parseInt(data.get("IndentNo")?.toString() || "0"),
            IndentDate: new Date(data.get("IndentDate")?.toString() || "").toISOString().split("T")[0],
            Type: activeTab.toUpperCase() as IndentType,
            IndentAmount: data.get("IndentAmount"),
            IndentQty: parseInt(data.get('IndentQty')?.toString() || "1"),
            ActionDate: new Date().toISOString().split("T")[0],
            ActionedById: user?.EmployeeId || "",
            IndentReason: data.get("IndentReason"),
            IndentRemarks: data.get("IndentRemarks"),
            BillCopy: BillCopy ? BillCopy : [],
            ...Object.fromEntries(data.entries().filter(([key]) => !["ProjectNo", "ProjectTitle", "IndentNo", "IndentDate", "Type", "IndentAmount", "IndentQty", "ActionDate", "ActionedById", "IndentReason", "IndentRemarks", "BillCopy"].includes(key)))
        };         
        if(project[`${activeTab}AllocationAmt`] < project.Indents.reduce((acc, i)=> i.Type==activeTab.toUpperCase()?acc+i.IndentAmount:acc, 0) + parseFloat(newIndent.IndentAmount)){
            toast({
                title: "Error",
                description: "Allocation amount exceeded",
                variant: 'destructive'
            });
            setLoading(false);
            return;
        }   
               
        try {
            const resp = await fetch('/api/indents/create', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newIndent)
            });
            if(resp.status==400){
                throw new Error("Indent No already exists");
            }
            else if(resp.ok){
                toast({
                    title: "Indent created successfully",
                    description: "The indent has been created successfully.",
                    variant: 'default'
                });
                reloadData();
            }
            else {
                throw new Error("Failed to create new indent");
            }
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message as string,
                variant: 'destructive'
            });
            setLoading(false);
        }
        finally {
            setIsOpen(false);
        }
    }
    const handleAddNew = () => {
        setIsOpen(true);
    };
    useEffect(()=>{
        async function fetchNewId(){
            setPopLoading(true);
            const resp = await fetch('/api/newId?type=indent');
            if(resp.ok){
                const data = await resp.json();
                setNewIndentNo(data.id);
                setPopLoading(false);
            }
            else{
                toast({
                    title: 'Error',
                    description: 'Failed to fetch new indent number',
                    variant: 'destructive'
                });
                routr.push('/protected/dashboard');
            }
            
        }
        if(!loading)return;
        fetchNewId();        
    }, [loading]);

    return (
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
                            data={project.Indents ? project.Indents.filter((i: Indents) => i.Type === IndentType.CONSUMABLES) : []}
                            columns={consumablesColumns}
                            onAdd={handleAddNew}
                            reload={reloadData}
                        />
                    </TabsContent>

                    <TabsContent value="Travel">
                        <ProjectTable
                            data={project.Indents ? project.Indents.filter((i: Indents) => i.Type === IndentType.TRAVEL) : []}
                            columns={travelsColumns}
                            onAdd={handleAddNew}
                            reload={reloadData}
                        />
                    </TabsContent>
                    <TabsContent value="Contingency">
                        <ProjectTable
                            data={project.Indents ? project.Indents.filter((i) => i.Type === IndentType.CONTINGENCY) : []}
                            columns={consumablesColumns} // Assuming similar columns for Contingency
                            onAdd={handleAddNew}
                            reload={reloadData}
                        />
                    </TabsContent>

                    <TabsContent value="Equipment">
                        <ProjectTable
                            data={project.Indents ? project.Indents.filter((i) => i.Type === IndentType.EQUIPMENT) : []}
                            columns={consumablesColumns} // Assuming similar columns for Equipments
                            onAdd={null}
                            reload={reloadData}
                        />
                        <EquipmentIndent onSubmit={handleSubmit} project={project} loading={popLoading} newIndentId={newIndentNo}/>
                    </TabsContent>

                    <TabsContent value="Manpower">
                        <ProjectTable
                            data={project.Indents ? project.Indents.filter((i) => i.Type === IndentType.MANPOWER) : []}
                            columns={manpowerColumns} // Assuming similar columns for Manpower
                            onAdd={null}
                            reload={reloadData}
                        />
                        <ManpowerIndent onSubmit={handleSubmit} project={project} loading={popLoading} newIndentId={newIndentNo}/>
                    </TabsContent>
                    <FormDialog
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onSubmit={handleSubmit}
                        title={`Add ${activeTab}`}
                        fields={activeTab=="Manpower"||activeTab=="Equipment"?null:fieldMap[activeTab]}
                        loading={popLoading}
                    />
                </Tabs>
            </CardContent>
        </Card>
    )
}