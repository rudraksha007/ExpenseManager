"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  FileText, 
  FolderPlus, 
  ClipboardList 
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  
  if (pathname === "/login") return null;

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 mx-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold">Project Management System</h1>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" className={cn(
              pathname === "/dashboard" && "bg-accent"
            )}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href="/indents">
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Indents
                </DropdownMenuItem>
              </Link>
              <Link href="/projects/create">
                <DropdownMenuItem className="cursor-pointer">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Project
                </DropdownMenuItem>
              </Link>
              <Link href="/reports">
                <DropdownMenuItem className="cursor-pointer">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Reports
                </DropdownMenuItem>
              </Link>
              <Link href="/login">
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}