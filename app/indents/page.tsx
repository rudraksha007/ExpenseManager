"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormDialog } from "@/components/ui/form-dialog";
import { set } from "react-hook-form";

// Mock data - replace with your actual data fetching logic
const generateMockData = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `IND${String(i + 1).padStart(4, '0')}`,
        projectNo: `PRJ${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        projectTitle: `Project ${i + 1}`,
        indentAmount: Math.floor(Math.random() * 100000),
        status: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)],
    }));
};

const ITEMS_PER_PAGE = 25;
const TOTAL_ITEMS = 100; // Replace with actual total count

interface RequestDetails {
    ProjectNo: string;
    ProjectTitle: string;
    IndentID: string;
    IndentDate: string;
    IndentStatus: string;
    IndentCategory: string;
    IndentAmount: number;
    IndentedPersonId: string;
}

export default function IndentsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
    const [popup, setPopup] = useState(false);

    const totalPages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);
    const data = generateMockData(ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setLoading(true);
        setCurrentPage(page);
        // Simulate loading
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <div className="container mx-auto py-10 space-y-6">
            <h1 className="text-3xl font-bold text-center">All Indents</h1>
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            handlePageChange={handlePageChange}
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
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                            <Skeleton className="h-6 w-full" />
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    data.map((item, index) => (
                    <TableRow key={item.id} onClick={() => setPopup(true)}>
                        <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                        <TableCell>{item.projectNo}</TableCell>
                        <TableCell>{item.projectTitle}</TableCell>
                        <TableCell>₹{item.indentAmount.toLocaleString()}</TableCell>
                        <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                            }`}>
                            {item.status}
                        </div>
                        </TableCell>
                        <TableCell>
                        <Button variant="link" className="p-0">
                            {item.id}
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            </div>
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            handlePageChange={handlePageChange}
            loading={loading}
            />
            <FormDialog
            isOpen={popup} // or manage this state as needed
            onClose={() => {setPopup(false)}} // or provide a proper handler
            title="Indent Details"
            fields={[
                { label: "Project No", value: requestDetails?.ProjectNo||"", readOnly: true, id: "projectNo", type: "text" },
                { label: "Title", value: requestDetails?.ProjectTitle, readOnly: true, id: "title", type: "text" },
                { label: "Indent ID", value: requestDetails?.IndentID, readOnly: true, id: "indentId", type: "text" },
                { label: "Indent Date", value: requestDetails?.IndentDate?.split("T")[0], readOnly: true, id: "indentDate", type: "text" },
                { label: "Indent Status", value: requestDetails?.IndentStatus, readOnly: true, id: "indentStatus", type: "text" },
                { label: "Indent Category", value: requestDetails?.IndentCategory, readOnly: true, id: "indentCategory", type: "text" },
                { label: "Indent Amount", value: requestDetails?.IndentAmount, readOnly: true, id: "indentAmount", type: "text" },
                { label: "Indented Person ID", value: requestDetails?.IndentedPersonId, readOnly: true, id: "indentedPersonId", type: "text" },
              ]}
            onSubmit={(data) => console.log(data)}
            />
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    handlePageChange: (page: number) => void;
    loading: boolean;
}

function Pagination({ currentPage, totalPages, onPageChange, handlePageChange, loading }: PaginationProps) {
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