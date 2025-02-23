"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  ProjectTitle: string;
  ProjectNo: string;
  ProjectStartDate: string;
  ProjectEndDate: string;
  SanctionOrderNo: string;
  TotalSanctionAmount: number;
  FundedBy: string;
  PIs: any[];
  CoPIs: any[];
  Workers: any[];
  ManpowerAllocationAmt: number;
  ConsumablesAllocationAmt: number;
  ContingencyAllocationAmt: number;
  OverheadAllocationAmt: number;
  EquipmentAllocationAmt: number;
  TravelAllocationAmt: number;
  [key: string]: any;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    ProjectTitle: "",
    ProjectNo: "",
    ProjectStartDate: "",
    ProjectEndDate: "",
    SanctionOrderNo: "",
    TotalSanctionAmount: 0,
    FundedBy: "",
    PIs: [],
    CoPIs: [],
    Workers: [],
    ManpowerAllocationAmt: 0,
    ConsumablesAllocationAmt: 0,
    ContingencyAllocationAmt: 0,
    OverheadAllocationAmt: 0,
    EquipmentAllocationAmt: 0,
    TravelAllocationAmt: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [popupContent, setPopupContent] = useState<string | null>(null);
  const selected = useRef({ PIs: [], CoPIs: [], Workers: [] });
  const [remaining, setRemaining] = useState<Record<string, number>>({});
  const [editMode] = useState(false);

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const getMax = (allocationField: string) => {
    let totalAllocated = 0;
    Object.keys(formData).forEach(key => {
      if (key.includes("AllocationAmt") && key !== allocationField) {
        totalAllocated += Number(formData[key]);
      }
    });
    return formData.TotalSanctionAmount - totalAllocated;
  };

  const getMin = (allocationField: string) => {
    return editMode ? remaining[allocationField] || 0 : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name.includes("AllocationAmt")) {
      const max = getMax(name);
      if (Number(value) > max) {
        e.currentTarget.setCustomValidity(`Allocation amount exceeds the remaining budget`);
      } else {
        e.currentTarget.setCustomValidity("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.PIs.length === 0 || formData.Workers.length === 0) {
      alert("Please select at least one PI and Worker");
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Project Created Successfully");
        router.push("/projects");
      } else {
        const error = await response.json();
        alert(`Failed to create project: ${error.message}`);
      }
    } catch (error) {
      alert("Failed to create project. Please try again.");
    }
  };

  const handleUserSelection = (user: User, role: string) => {
    const currentSelection = selected.current[role as keyof typeof selected.current];
    const userIndex = currentSelection.findIndex((u: User) => u.id === user.id);
    
    if (userIndex === -1) {
      selected.current[role as keyof typeof selected.current] = [...currentSelection, user];
    } else {
      selected.current[role as keyof typeof selected.current] = currentSelection.filter((u: User) => u.id !== user.id);
    }
    
    setFormData(prev => ({
      ...prev,
      [role]: selected.current[role as keyof typeof selected.current],
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ProjectTitle">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ProjectTitle"
                  name="ProjectTitle"
                  placeholder="Enter project title"
                  required
                  value={formData.ProjectTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ProjectNo">
                  Project No <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ProjectNo"
                  name="ProjectNo"
                  placeholder="Enter project number"
                  required
                  value={formData.ProjectNo}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ProjectStartDate">
                  Project Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ProjectStartDate"
                  name="ProjectStartDate"
                  type="date"
                  required
                  value={formData.ProjectStartDate}
                  onChange={handleChange}
                  max={formData.ProjectEndDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ProjectEndDate">
                  Project End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ProjectEndDate"
                  name="ProjectEndDate"
                  type="date"
                  required
                  value={formData.ProjectEndDate}
                  onChange={handleChange}
                  min={formData.ProjectStartDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="SanctionOrderNo">
                  Sanction Order No <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="SanctionOrderNo"
                  name="SanctionOrderNo"
                  placeholder="Enter sanction order number"
                  required
                  value={formData.SanctionOrderNo}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="TotalSanctionAmount">
                  Total Sanction Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="TotalSanctionAmount"
                  name="TotalSanctionAmount"
                  type="number"
                  placeholder="Enter total sanction amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.TotalSanctionAmount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="FundedBy">
                  Funded By <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="FundedBy"
                  name="FundedBy"
                  placeholder="Enter funding agency"
                  required
                  value={formData.FundedBy}
                  onChange={handleChange}
                />
              </div>

              {/* Team Selection */}
              <div className="space-y-2">
                <Label>
                  PIs <span className="text-red-500">*</span>
                </Label>
                <Input
                  readOnly
                  value={`${formData.PIs.length} PI(s) selected`}
                  className="cursor-pointer"
                  onClick={() => setPopupContent("PIs")}
                />
              </div>

              <div className="space-y-2">
                <Label>CoPIs</Label>
                <Input
                  readOnly
                  value={`${formData.CoPIs.length} CoPI(s) selected`}
                  className="cursor-pointer"
                  onClick={() => setPopupContent("CoPIs")}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Workers <span className="text-red-500">*</span>
                </Label>
                <Input
                  readOnly
                  value={`${formData.Workers.length} Worker(s) selected`}
                  className="cursor-pointer"
                  onClick={() => setPopupContent("Workers")}
                />
              </div>

              {/* Allocation Amounts */}
              {[
                "Manpower",
                "Consumables",
                "Contingency",
                "Overhead",
                "Equipment",
                "Travel"
              ].map(type => (
                <div key={type} className="space-y-2">
                  <Label htmlFor={`${type}AllocationAmt`}>
                    {type} Allocation Amount
                  </Label>
                  <Input
                    id={`${type}AllocationAmt`}
                    name={`${type}AllocationAmt`}
                    type="number"
                    placeholder={`Enter ${type.toLowerCase()} allocation amount`}
                    min={getMin(`${type}AllocationAmt`)}
                    max={getMax(`${type}AllocationAmt`)}
                    step="0.01"
                    value={formData[`${type}AllocationAmt`]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/projects")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* User Selection Dialog */}
      <Dialog open={!!popupContent} onOpenChange={() => setPopupContent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select {popupContent}</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.current[popupContent as keyof typeof selected.current]?.some(
                        (u: User) => u.id === user.id
                      )}
                      onCheckedChange={() => handleUserSelection(user, popupContent as string)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}