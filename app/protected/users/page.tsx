"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Key, Loader2 } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    id: z.coerce.number().min(1, "Employee ID is required"),
    password: z.string().min(6).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
        "Password must contain uppercase, lowercase and special character"
    ),
    role: z.enum(["RA", "Pi", "SuperAdmin"]),
    BasicSalary: z.coerce.number().min(0).optional(),
    HRA_Percentage: z.coerce.number().min(0).max(100).optional(),
});

interface User {
    id: string;
    name: string;
    email: string;
    EmployeeId: string;
    isAdmin: boolean;
}

export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({ new: "", confirm: "" });
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        EmployeeId: "",
        isAdmin: false
    });

    useEffect(()=>{
        if(submitting)return;
        async function fetchUsers() {
            setLoading(true);
            try {
                const resp = await fetch("/api/users");
                if(resp.status !=500){
                    const data = await resp.json();
                    if(!resp.ok) throw new Error(data.msg);
                    else setUsers(data);
                }else throw new Error("Internal Server Error");
            }catch(error: any){
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            }finally{
                setLoading(false);
            }
        }
        fetchUsers();
    },[submitting]);

    const handlePasswordChange = async () => {
        setSubmitting(true);
        if (passwords.new !== passwords.confirm) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }
        try {
            const resp = await fetch('/api/users/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    EmployeeId: selectedUser?.EmployeeId,
                    password: passwords.new,
                }),
            });
            if(resp.status == 500) throw new Error("Internal Server Error");
            else{
                const data = await resp.json();
                if(!resp.ok) throw new Error(data.msg);
                toast({
                    title: "Success",
                    description: "Password updated successfully",
                });
            }
        } catch (error:any) {
            toast({
                title: "Error",
                description: error.msg,
                variant: "destructive",
            });
        }finally{
            setPasswords({ new: "", confirm: "" });
            setShowPasswordDialog(false);
            setSubmitting(false);
        }
    };

    const handleEditUser = async () => {
        try {
            setSubmitting(true);
            signupSchema.parse(editForm); // Validate the editForm using the schema
            const updatedUsers = users.map(user =>
                user.id === selectedUser?.id
                    ? { ...user, ...editForm }
                    : user
            );
            const resp = await fetch('/api/users/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editForm,
                    EmployeeId: selectedUser?.EmployeeId,
                }),
            })
            if(resp.status == 500) throw new Error("Internal Server Error");
            else{
                const data = await resp.json();
                if(!resp.ok) throw new Error(data.msg);
                setUsers(updatedUsers);
                toast({
                    title: "Success",
                    description: "User details updated successfully",
                });
            }
            setShowEditDialog(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.msg || error.message,
                variant: "destructive",
            });
        }finally{
            setSubmitting(false);
        }
    };

    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            EmployeeId: user.EmployeeId,
            isAdmin: user.isAdmin,
        });
        setShowEditDialog(true);
    };

    const openPasswordDialog = (user: User) => {
        setSelectedUser(user);
        setShowPasswordDialog(true);
    };

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Employee ID</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading &&
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        <div className="flex justify-center items-center w-full py-4">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            }
                            {!loading && users.length === 0 ?
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                                :
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.EmployeeId}</TableCell>
                                        <TableCell>{user.isAdmin}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(user)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openPasswordDialog(user)}
                                                >
                                                    <Key className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Employee ID</Label>
                            <Input
                                id="EmployeeId"
                                type="number"
                                value={editForm.EmployeeId}
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Select
                                value={editForm.isAdmin ? "Technician" : "PI"}
                                onValueChange={(value) => setEditForm({ ...editForm, isAdmin: value !== "PI" })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select designation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Technician">Technician</SelectItem>
                                    <SelectItem value="PI">PI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditUser} disabled={submitting}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePasswordChange} disabled={submitting}>Change Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}