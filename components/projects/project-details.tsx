"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ProjectDetailsProps {
  project: any;
  onViewTeam: (type: string) => void;
}

export function ProjectDetails({ project, onViewTeam }: ProjectDetailsProps) {
  const details = [
    { label: "Funded By", value: project.FundedBy },
    { label: "Project Id", value: project.ProjectNo },
    { label: "Title", value: project.ProjectTitle },
    { label: "Sanction Order No", value: project.SanctionOrderNo },
    { label: "Total Sanction Amount", value: formatCurrency(project.TotalSanctionAmount) },
    { 
      label: "Project Start Date", 
      value: new Date(project.ProjectStartDate).toLocaleDateString() 
    },
    { 
      label: "Project End Date", 
      value: new Date(project.ProjectEndDate).toLocaleDateString() 
    },
    { 
      label: "PI Name", 
      value: (
        <Button 
          variant="ghost" 
          className="p-0 h-auto hover:bg-transparent"
          onClick={() => onViewTeam("PIs")}
        >
          View Team
        </Button>
      )
    },
    { 
      label: "Co-PIs", 
      value: (
        <Button 
          variant="ghost" 
          className="p-0 h-auto hover:bg-transparent"
          onClick={() => onViewTeam("CoPIs")}
        >
          View Team
        </Button>
      )
    },
    { 
      label: "Manpower Allocation Amt", 
      value: formatCurrency(project.ManpowerAllocationAmt) 
    },
    { 
      label: "Consumables Allocation Amt", 
      value: formatCurrency(project.ConsumablesAllocationAmt) 
    },
    { 
      label: "Contingency Allocation Amt", 
      value: formatCurrency(project.ContingencyAllocationAmt) 
    },
    { 
      label: "Overhead Allocation Amt", 
      value: formatCurrency(project.OverheadAllocationAmt) 
    },
    { 
      label: "Equipment Allocation Amt", 
      value: formatCurrency(project.EquipmentAllocationAmt) 
    },
    { 
      label: "Travel Allocation Amt", 
      value: formatCurrency(project.TravelAllocationAmt) 
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {detail.label}
              </p>
              <p className="text-sm font-medium">{detail.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}