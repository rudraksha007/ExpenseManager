"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Project } from "@prisma/client";

interface ManpowerItem {
    employeeName: string;
    dailySalary: number;
    numberOfDays: number;
    hraPercentage?: number| 0;
    remarks?: string;
}

interface ManpowerIndentProps {
    onSubmit: (data: globalThis.FormData) => void;
    project: Project;
    loading: boolean;
    newIndentId: number;
}

interface FormData {
    items: ManpowerItem[];
    IndentAmount: number;
    IndentNo: string;
    IndentDate: string;
    IndentReason: string;
    IndentRemarks: string;
}

export function ManpowerIndent({ onSubmit, project, loading, newIndentId }: ManpowerIndentProps) {
    const [items, setItems] = useState<ManpowerItem[]>([
        { employeeName: "", dailySalary: 0, numberOfDays: 1, remarks: "" }
    ]);    
    const [formData, setFormData] = useState<FormData>({
        items: items,
        IndentAmount: 0,
        IndentNo: newIndentId.toString(),
        IndentDate: "",
        IndentReason: "",
        IndentRemarks: ""
    });

    const addItem = () => {
        setItems([...items, { employeeName: "", dailySalary: 0, numberOfDays: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof ManpowerItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [field]: field === "employeeName"||"remarks" ? value : Number(value)
        };
        setItems(newItems);
    };

    const calculateTotal = (item: ManpowerItem) => {
        return item.dailySalary * item.numberOfDays * (1 + (item.hraPercentage || 0) / 100);
    };

    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + calculateTotal(item), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("IndentNo", formData.IndentNo);
        data.append("IndentDate", formData.IndentDate);
        data.append("IndentAmount", calculateGrandTotal().toString());
        data.append("indentData", JSON.stringify(items));
        data.append("IndentReason", formData.IndentReason);
        data.append("IndentRemarks", formData.IndentRemarks);

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-5 border rounded-lg border-gray-200">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor='IndentNo'>IndentNo</Label>
                        <Input
                            id={`IndentNo`}
                            value={formData.IndentNo}
                            onChange={(e) => setFormData({ ...formData, IndentNo: (e.target.value) })}
                            placeholder="Enter IndentNo"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor='IndentDate'>Indent Date</Label>
                        {
                            project &&
                            <Input
                            id={`IndentDate`}
                            type="date"
                            value={formData.IndentDate}
                            onChange={(e) => setFormData({ ...formData, IndentDate: e.target.value })}
                            placeholder="Enter Indent Date"
                            min={project?.ProjectStartDate.toString().split('T')[0]}
                            max={project?.ProjectEndDate?.toString().split('T')[0]}
                            required
                        />
                        }
                    </div>
                </div>
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 items-end border p-4 rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor={`employee-${index}`}>Employee Name</Label>
                            <Input
                                id={`employee-${index}`}
                                value={item.employeeName}
                                onChange={(e) => updateItem(index, "employeeName", e.target.value)}
                                placeholder="Enter employee name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`salary-${index}`}>Daily Salary</Label>
                            <Input
                                id={`salary-${index}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.dailySalary}
                                onChange={(e) => updateItem(index, "dailySalary", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`days-${index}`}>Number of Days</Label>
                            <Input
                                id={`days-${index}`}
                                type="number"
                                min="1"
                                value={item.numberOfDays}
                                onChange={(e) => updateItem(index, "numberOfDays", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`hra-${index}`}>HRA %</Label>
                            <Input
                                id={`hra-${index}`}
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={item.hraPercentage || 0}
                                onChange={(e) => updateItem(index, "hraPercentage", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`remarks-${index}`}>Remarks</Label>
                            <Input
                                id={`remarks-${index}`}
                                value={item.remarks || ""}
                                type="text"
                                onChange={(e) => updateItem(index, "remarks", e.target.value)}
                                placeholder="Enter remarks"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                                Total: {formatCurrency(calculateTotal(item))}
                            </div>
                            {items.length > 1 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeItem(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                </Button>

                <div className="text-lg font-semibold">
                    Grand Total: {formatCurrency(calculateGrandTotal())}
                </div>
            </div>

            <div className="flex justify-end">
                {loading? <Button type="submit" disabled>Loading...</Button> : <Button type="submit">Submit</Button>}
            </div>
        </form>
    );
}