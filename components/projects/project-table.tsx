"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Indents, IndentType, User } from "@prisma/client";
import { useMemo, useState } from "react";
import { RequestDetails } from "@/app/protected/indents/page";
import { FormDialog, FormField } from "@/components/ui/form-dialog";
import { saveAs } from "file-saver";
import { toast } from "@/hooks/use-toast";

interface Column {
  header: string;
  accessor: string | ((item: Indents, index: number) => string);
  render?: (item: Indents) => React.ReactNode;
}

interface ProjectTableProps {
  data: Indents[];
  columns: Column[];
  onAdd: null | (() => void);
  reload: () => void;
}

export function ProjectTable({ data, columns, onAdd, reload }: ProjectTableProps) {
  const [reqDetails, setReqDetails] = useState<RequestDetails | null>(null);
  const [popup, setPopup] = useState<boolean>(false);
  const [reqLoading, setReqLoading] = useState(false);
  const indentData = useMemo(() => {
    if (!reqDetails) return [];
    // console.log(reqDetails.Type);

    const details = JSON.parse(reqDetails?.indentData || "[]") as Record<string, string | number>[];
    if (reqDetails.Type === IndentType.EQUIPMENT) return (details?.map((data, index) => ({
      label: `Item ${index + 1}`, value: `${data.quantity} x ${data.name}: (${data.pricePerUnit} per unit) = ${data.quantity as number * (data.pricePerUnit as number)}`, readOnly: true, id: `item-${index}`, type: "text" as FormField["type"]
    })) || []);
    else if (reqDetails.Type === IndentType.MANPOWER) return (details?.map((data, index) => ({
      label: `Person ${index + 1}`, value: `${data.employeeName}: (Salary) ${data.dailySalary} x ${data.numberOfDays} (days) = ${Number(data.dailySalary) * Number(data.numberOfDays)}: Remark: ${data.remarks}`, readOnly: true, id: `person-${index}`, type: "text" as FormField["type"]
    })) || []);
    // else return (details?.map((data, index) => ({
    //   label: `Item ${index + 1}`, value: `${data.name}: ${data.quantity} ${data.unit}`, readOnly: true, id: `item-${index}`, type: "text" as FormField["type"]
    // })) || []);
    //"employeeName":"ramash","dailySalary":135,"numberOfDays":16}
  }, [reqDetails]);
  async function fetchDetail(id: string) {
    try {
      setReqLoading(true);
      setPopup(true);
      const response = await fetch(`/api/indents/${id}`);
      const data = await response.json();
      setReqDetails(data);
      console.log(data);
    } catch (error: any) {
      console.error("Failed to fetch details", error);
      toast({
        title: "Failed to fetch details",
        variant: 'destructive',
        description: error.message,
      })
    } finally {
      setReqLoading(false);
    }
  }
  async function action(approved: boolean) {
    try {
        setReqLoading(true);
        console.log(reqDetails?.IndentNo);

        const response = await fetch("/api/indents/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                approved: approved,
                IndentNo: reqDetails?.IndentNo,
            }),
        });

        if (response.ok) {
            toast({
                title: "Action performed successfully",
                variant: 'default',
            });
        } else {
            if (response.status === 500) {
                throw new Error("Server Error");
            } else {
                const data = await response.json();
                throw new Error(data.msg);
            }
        };
    } catch (error: any) {
        console.error("Failed to perform action", error);
        toast({
            title: "Failed to perform action",
            variant: 'destructive',
            description: error.message,
        })
    } finally {
        setReqDetails(null);
        setPopup(false);
        setReqLoading(false);
        reload();
    }
}
  return (
    <div className="space-y-4">
      {onAdd &&
        <div className="flex justify-end">
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      }

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow key={rowIndex}
              className="cursor-pointer"
              onClick={
                () => { fetchDetail(item.id) }
              }>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.render ? column.render(item) :
                    typeof column.accessor === "function" ?
                      column.accessor(item, rowIndex) :
                      //@ts-expect-error
                      item[column.accessor] as string}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FormDialog
        isOpen={popup}
        loading={reqLoading}
        onClose={() => { setPopup(false); setReqDetails(null); }}
        title="Indent Details"

        fields={[
          { label: "Project No", value: reqDetails?.ProjectNo || "", readOnly: true, id: "projectNo", type: "text" },
          { label: "Title", value: reqDetails?.ProjectTitle, readOnly: true, id: "title", type: "text" },
          { label: "Indent No", value: reqDetails?.IndentNo, readOnly: true, id: "indentId", type: "text" },
          { label: "Indent Date", value: reqDetails?.IndentDate?.split("T")[0], readOnly: true, id: "indentDate", type: "text" },
          { label: "Indent Status", value: reqDetails?.IndentStatus, readOnly: true, id: "indentStatus", type: "text" },
          { label: "Indent Category", value: reqDetails?.Type, readOnly: true, id: "indentCategory", type: "text" },
          { label: "Indent Amount", value: reqDetails?.IndentAmount, readOnly: true, id: "indentAmount", type: "text" },
          { label: "Indented Person ID", value: reqDetails?.IndentPersonId, readOnly: true, id: "indentedPersonId", type: "text" },
          { label: "Indented Person", value: reqDetails?.IndentPerson?.name, readOnly: true, id: "indentedPerson", type: "text" },
          { label: "Indented Person Email", value: reqDetails?.IndentPerson?.email, readOnly: true, id: "email", type: "text" },
          ...(indentData || [])
        ]}
        buttons={[
          ...reqDetails?.BillCopy && reqDetails.BillCopy.length !== 0
            ? reqDetails.BillCopy.map((bill, index) => ({
              label: `Download Bill ${index + 1}`,
              onClick: () => {
                if (bill) {
                  try {
                    const base64Data = bill.split(',')[1] || bill;
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const file = new Blob([byteArray], { type: 'application/pdf' });
                    const url = URL.createObjectURL(file);
                    saveAs(url, `bill_copy_${index + 1}.pdf`);
                  } catch (error) {
                    console.error("Error downloading bill:", error);
                    toast({
                      title: "Download Failed",
                      variant: 'destructive',
                      description: "An error occurred while downloading the bill.",
                    });
                  }
                } else {
                  toast({
                    title: "No Bill Copy",
                    variant: 'destructive',
                    description: "No bill copy available to download.",
                  });
                }
              },
            }))
            : [],
            {
              label: "Approve",
              onClick: () => action(true),
            },
            {
              label: "Reject",
              onClick: () => action(false),
            },
        ]}
        onSubmit={(data) => { return; }}
      />
    </div>
  );
}