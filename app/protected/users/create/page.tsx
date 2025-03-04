"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";
import CryptoJS from "crypto-js";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Form validation schema
const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    id: z.number().min(1, "Employee ID is required"),
    password: z.string().min(6).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
        "Password must contain uppercase, lowercase and special character"
    ),
    role: z.enum(["RA", "Pi", "SuperAdmin"]),
    BasicSalary: z.number().min(0).optional(),
    HRA_Percentage: z.number().min(0).max(100).optional(),
});

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: "Pi",
            BasicSalary: 0,
            HRA_Percentage: 0,
        },
    });

    useEffect(() => {
        async function fetchLatestId() {
            setIsLoading(true);
            const response = await fetch('/api/users/newId', {
                method: 'GET',
            });
            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch latest ID",
                });
                setIsLoading(false);
                router.push('/protected/dashboard');
                return;
            }
            const result = await response.json();

            console.log(result);

            form.setValue('id', result.id);
            setIsLoading(false);
        }
        fetchLatestId();
    }, []);

    async function onSubmit(data: z.infer<typeof signupSchema>) {
        setIsLoading(true);
        try {
            const submitData = {
                ...data,
                password: CryptoJS.SHA256(data.password).toString(),
            };

            const response = await fetch('/api/users/create', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();

            if (response.status === 200) {
                toast({
                    title: "Success!",
                    description: "Account created successfully.",
                });
            
                router.push('/protected/dashboard');
            } else {
                throw new Error(result.msg);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const showFinancialFields = form.watch("role") !== "Pi" && form.watch("role") !== "SuperAdmin";

    return (
        <div className="flex items-center justify-center min-h-fit py-8 w-screen">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>
                        Enter details of Employee to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter name" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employee ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter employee ID" {...field} type="number" disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Pi">PI</SelectItem>
                                                <SelectItem value="SuperAdmin">Technician</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {(form.watch("role") === "Pi" || form.watch("role") === "SuperAdmin") && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="email@example.com" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Enter your password" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormDescription>
                                                    Password must be at least 6 characters with uppercase, lowercase and special characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {showFinancialFields && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="BasicSalary"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Basic Salary</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter basic salary"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="HRA_Percentage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>HRA Percentage</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter HRA percentage"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <div className="flex items-center justify-between">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Creating account..." : "Create account"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}