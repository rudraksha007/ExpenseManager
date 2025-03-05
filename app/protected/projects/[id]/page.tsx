"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { ProjectDetails } from "@/components/projects/project-details";

import ProjectTabs, { ExtendedProject } from "./ProjectTabs";
import { FormField } from "@/components/ui/form-dialog";
import { Project } from "@prisma/client";

// Define columns for different indent types
export interface FieldMap {
  Consumables: FormField[];
  Travel: FormField[];
  Contingency: FormField[];
  Equipment: FormField[];
  Manpower: FormField[];
}

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dialogContent] = useState(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"Consumables" | "Travel" | "Contingency" | "Equipment" | "Manpower">("Consumables");
  
  useEffect(() => {
    fetchProjectData();
  }, [id]);

  async function fetchProjectData () {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error("Failed to fetch project data");
      const data = await response.json();
      if (data) {
        setProject(data);
      }
      console.log(data);

    } catch (error) {
      console.error("Failed to fetch project data:", error);
    } finally {
      setLoading(false);
    }
  };

  

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Project Details</h1>
        <Button variant="outline" onClick={() => { router.push(`/protected/projects/create?id=${encodeURIComponent(project.ProjectNo)}`) }}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </div>

      <ProjectDetails project={project} onViewTeam={(type: string) => console.log(`Viewing team of type: ${type}`)} />

      <ProjectTabs project={project as ExtendedProject} isOpen={isOpen} setIsOpen={setIsOpen} loading setLoading={setLoading} reloadData={fetchProjectData} activeTab={activeTab} setActiveTab={setActiveTab} />

      {dialogContent}
    </div>
  );
}