"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Project } from "@prisma/client";

interface EquipmentItem {
    name: string;
    quantity: number;
    pricePerUnit: number;
}

interface EquipmentIndentProps {
    onSubmit: (data: any) => void;
    project: Project;
}

interface FormData {
    items: EquipmentItem[];
    IndentAmount: number;
    IndentNo: string;
    IndentDate: string;
    IndentReason: string;
    IndentRemarks: string;
}

export function EquipmentIndent({ onSubmit, project }: EquipmentIndentProps) {
    const [items, setItems] = useState<EquipmentItem[]>([
        { name: "", quantity: 1, pricePerUnit: 0 }
    ]);
    const [formData, setFormData] = useState<FormData>({
        items: items,
        IndentAmount: 0,
        IndentNo: '',
        IndentDate: "",
        IndentReason: "",
        IndentRemarks: ""
    });
    const addItem = () => {
        setItems([...items, { name: "", quantity: 1, pricePerUnit: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof EquipmentItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [field]: field === "name" ? value : Number(value)
        };
        setItems(newItems);
    };

    const calculateTotal = (item: EquipmentItem) => {
        return item.quantity * item.pricePerUnit;
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
                    <div className="space-y-2">
                        <Label htmlFor='IndentReason'>Indent Reason</Label>
                        <Input
                            id={`IndentReason`}
                            value={formData.IndentReason}
                            onChange={(e) => setFormData({ ...formData, IndentReason: e.target.value })}
                            placeholder="Enter Indent Reason"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor='Remarks'>Remarks</Label>
                        <Input
                            id={`Remarks`}
                            value={formData.IndentRemarks}
                            onChange={(e) => setFormData({ ...formData, IndentRemarks: e.target.value })}
                            placeholder="Enter Remarks"
                        />
                    </div>
                </div>
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-end border p-4 rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor={`equipment-${index}`}>Equipment Name</Label>
                            <Input
                                id={`equipment-${index}`}
                                value={item.name}
                                onChange={(e) => updateItem(index, "name", e.target.value)}
                                placeholder="Enter equipment name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                            <Input
                                id={`quantity-${index}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`price-${index}`}>Price per Unit</Label>
                            <Input
                                id={`price-${index}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.pricePerUnit}
                                onChange={(e) => updateItem(index, "pricePerUnit", e.target.value)}
                                required
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
                    Add Equipment
                </Button>

                <div className="text-lg font-semibold">
                    Grand Total: {formatCurrency(calculateGrandTotal())}
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">Submit Indent</Button>
            </div>
        </form>
    );
}