"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormDialog } from "@/components/ui/form-dialog";
import { Indents, IndentStatus } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";

const ITEMS_PER_PAGE = 25;

export interface RequestDetails {
    IndentNo: string;
    ProjectNo: string;
    ProjectTitle: string;
    IndentID: string;
    IndentDate: string;
    IndentStatus: string;
    Type: string;
    IndentAmount: number;
    IndentPersonId: string;
    BillCopy?: string[];
    IndentPerson: {
        name: string;
        email: string;
    }
    indentData: string;
}

export default function IndentsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
    const [popup, setPopup] = useState(false);
    const [data, setData] = useState<Indents[] | []>([]);
    const [reqLoading, setReqLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await fetch("/api/indents");
            const data = await response.json();
            setData(data);
            setLoading(false);
        }
        if (popup) {

            return;
        }
        fetchData();
    }, [popup]);

    const handlePageChange = (page: number) => {
        setLoading(true);
        setCurrentPage(page);
        setTimeout(() => setLoading(false), 500);
    };

    async function fetchDetail(id: string) {
        try {
            setReqLoading(true);
            setPopup(true);
            const response = await fetch(`/api/indents/${id}`);
            const data = await response.json();
            setRequestDetails(data);
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
            setLoading(true);
            console.log(requestDetails?.IndentNo);

            const response = await fetch("/api/indents/action", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    approved: approved,
                    IndentNo: requestDetails?.IndentNo,
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
            setRequestDetails(null);
            setPopup(false);
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 space-y-6">
            <h1 className="text-3xl font-bold text-center">All Indents</h1>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(data.length / ITEMS_PER_PAGE) || 1}
                onPageChange={setCurrentPage}
                handlePageChange={handlePageChange}
                TOTAL_ITEMS={data.length}
                loading={loading}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Sl.</TableHead>
                            <TableHead>Project No</TableHead>
                            <TableHead>Project Title</TableHead>
                            <TableHead>Indent Amount</TableHead>
                            <TableHead>Indent Status</TableHead>
                            <TableHead>Indent ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Skeleton className="h-6 w-full flex justify-center" >
                                        <Loader className="animate-spin" />
                                    </Skeleton>
                                </TableCell>

                            </TableRow>

                        ) : data.length != 0 ? (
                            data.map((item, index) => (
                                <TableRow key={item.id} onClick={() => {
                                    fetchDetail(item.id);
                                }}>
                                    <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                                    <TableCell>{item.ProjectNo}</TableCell>
                                    <TableCell>{item.ProjectTitle}</TableCell>
                                    <TableCell>₹{item.IndentAmount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.IndentStatus === IndentStatus.APPROVED ? 'bg-green-100 text-green-800' :
                                            item.IndentStatus === IndentStatus.REJECTED ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {item.IndentStatus}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="link" className="p-0">
                                            {item.id}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <div className="text-center text-lg text-muted-foreground">No data found</div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(data.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                handlePageChange={handlePageChange}
                TOTAL_ITEMS={data.length}
                loading={loading}
            />
            <FormDialog
                isOpen={popup}
                loading={reqLoading}
                onClose={() => { setPopup(false) }}
                title="Indent Details"

                fields={[
                    { label: "Project No", value: requestDetails?.ProjectNo || "", readOnly: true, id: "projectNo", type: "text" },
                    { label: "Title", value: requestDetails?.ProjectTitle, readOnly: true, id: "title", type: "text" },
                    { label: "Indent No", value: requestDetails?.IndentNo, readOnly: true, id: "indentId", type: "text" },
                    { label: "Indent Date", value: requestDetails?.IndentDate?.split("T")[0], readOnly: true, id: "indentDate", type: "text" },
                    { label: "Indent Status", value: requestDetails?.IndentStatus, readOnly: true, id: "indentStatus", type: "text" },
                    { label: "Indent Category", value: requestDetails?.Type, readOnly: true, id: "indentCategory", type: "text" },
                    { label: "Indent Amount", value: requestDetails?.IndentAmount, readOnly: true, id: "indentAmount", type: "text" },
                    { label: "Indented Person ID", value: requestDetails?.IndentPersonId, readOnly: true, id: "indentedPersonId", type: "text" },
                    { label: "Indented Person", value: requestDetails?.IndentPerson?.name, readOnly: true, id: "indentedPerson", type: "text" },
                    { label: "Indented Person Email", value: requestDetails?.IndentPerson?.email, readOnly: true, id: "email", type: "text" },
                ]}
                buttons={
                    requestDetails?.BillCopy && requestDetails.BillCopy.length !== 0
                        ? requestDetails.BillCopy.map((bill, index) => ({
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
                        : []
                }
                onSubmit={(data) => { return; }}
            />
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    TOTAL_ITEMS: number;
    onPageChange: (page: number) => void;
    handlePageChange: (page: number) => void;
    loading: boolean;
}

function Pagination({ currentPage, totalPages, handlePageChange, loading, TOTAL_ITEMS }: PaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, TOTAL_ITEMS)} of {TOTAL_ITEMS} entries
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || loading}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                            const distance = Math.abs(page - currentPage);
                            return distance === 0 || distance === 1 || page === 1 || page === totalPages;
                        })
                        .map((page, i, arr) => (
                            <div key={page} className="flex items-center">
                                {i > 0 && arr[i - 1] !== page - 1 && (
                                    <span className="px-2">...</span>
                                )}
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(page)}
                                    disabled={loading}
                                    className="w-8 h-8"
                                >
                                    {page}
                                </Button>
                            </div>
                        ))}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || loading}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}