import { CategoryReportProps } from '@/components/reports/category-report';
import { ProjectReport } from '@/components/reports/general-report';
import { BudgetAllocation } from '@/components/reports/quarterly-report';
import { YearlyBudgetAllocation } from '@/components/reports/yearly-report';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportGeneralReport(projects: ProjectReport[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Project Report");

  // Define columns
  worksheet.columns = [
    { header: "Project No", key: "ProjectNo", width: 15 },
    { header: "Project Title", key: "ProjectTitle", width: 30 },
    { header: "Manpower Used", key: "ManpowerUsed", width: 15 },
    { header: "Consumables Used", key: "ConsumablesUsed", width: 15 },
    { header: "Contingency Used", key: "ContingencyUsed", width: 15 },
    { header: "Overhead Used", key: "OverheadUsed", width: 15 },
    { header: "Equipment Used", key: "EquipmentUsed", width: 15 },
    { header: "Travel Used", key: "TravelUsed", width: 15 },
    { header: "Remaining Allocated", key: "RemainingAllocatedAmount", width: 20 },
    { header: "Remaining Unallocated", key: "UnallocatedAmount", width: 20 },
    { header: "Total Sanctioned Amount", key: "TotalSanctionAmount", width: 20 },
  ];

  // Add data rows
  projects.forEach(project => {
    worksheet.addRow({
      ProjectNo: project.ProjectNo,
      ProjectTitle: project.ProjectTitle,
      ManpowerUsed: project.ManpowerUsed,
      ConsumablesUsed: project.ConsumablesUsed,
      ContingencyUsed: project.ContingencyUsed,
      OverheadUsed: project.OverheadUsed,
      EquipmentUsed: project.EquipmentUsed,
      TravelUsed: project.TravelUsed,
      RemainingAllocatedAmount: project.RemainingAllocatedAmount,
      UnallocatedAmount: project.UnallocatedAmount,
      TotalSanctionAmount: project.TotalSanctionAmount,
    });
  });

  // Generate the file and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, "Project_Report.xlsx");
}

export async function exportCategoryReport(projects: CategoryReportProps['projects']) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Category Spending');

  // Define headers
  worksheet.columns = [
    { header: 'Category', key: 'name', width: 20 },
    { header: 'Total Spent', key: 'total', width: 20 },
    { header: 'Total Allocated', key: 'allocated', width: 20 },
    { header: '% of Total Allocated', key: 'percentage', width: 20 },
  ];

  // Calculate category totals
  const categoryTotals = [
    { 
      name: 'Manpower', 
      total: projects.reduce((sum, p) => sum + p.ManpowerUsed, 0),
      allocated: projects.reduce((sum, p) => sum + p.TotalManpowerAmount, 0),
    },
    { 
      name: 'Consumables', 
      total: projects.reduce((sum, p) => sum + p.ConsumablesUsed, 0),
      allocated: projects.reduce((sum, p) => sum + p.TotalConsumablesAmount, 0),
    },
    { 
      name: 'Contingency', 
      total: projects.reduce((sum, p) => sum + p.ContingencyUsed, 0),
      allocated: projects.reduce((sum, p) => sum + p.TotalContingencyAmount, 0),
    },
    { 
      name: 'Overhead', 
      total: projects.reduce((sum, p) => sum + p.OverheadUsed, 0),
      allocated: projects.reduce((sum, p) => sum + p.TotalOverheadAmount, 0),
    },
    { 
      name: 'Equipment', 
      total: projects.reduce((sum, p) => sum + p.EquipmentUsed, 0),
      allocated: projects.reduce((sum, p) => sum + p.TotalEquipmentAmount, 0),
    },
    { 
      name: 'Travel', 
      total: projects.reduce((sum, p) => sum + p.TravelUsed, 0),
      allocated: projects.reduce((sum, p) => sum + p.TotalTravelAmount, 0),
    }
  ];

  // Add rows
  categoryTotals.forEach(category => {
    worksheet.addRow({
      name: category.name,
      total: `₹${category.total.toLocaleString('HI')}`,
      allocated: `₹${category.allocated.toLocaleString('HI')}`,
      percentage: ((category.total / category.allocated) * 100).toFixed(2) + '%',
    });
  });

  // Generate Excel file and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Category_Spending_Report.xlsx');
}

export async function exportQuarterlyReport(data: BudgetAllocation[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Quarterly Report');

  // Define headers
  worksheet.addRow([
    'Category', 'Paid (₹)', 'Committed (₹)', 'Allocation (₹)', 'Utilization (%)'
  ]);

  // Add data rows
  data.forEach(item => {
    const allocationMap = {
      'MANPOWER': item.ManpowerAllocationAmt,
      'TRAVEL': item.TravelAllocationAmt,
      'CONSUMABLES': item.ConsumablesAllocationAmt,
      'CONTINGENCY': item.ContingencyAllocationAmt,
      'OVERHEAD': item.OverheadAllocationAmt,
      'EQUIPMENT': item.EquipmentAllocationAmt,
    };

    const allocation = allocationMap[item.Category.toUpperCase() as keyof typeof allocationMap] || 0;
    const utilization = allocation ? ((item.TotalIndented / allocation) * 100).toFixed(2) : '0.00';

    worksheet.addRow([
      item.Category,
      item.Paid,
      item.Committed,
      allocation,
      utilization
    ]);
  });

  // Add total row
  const totalPaid = data.reduce((sum, item) => sum + item.Paid, 0);
  const totalCommitted = data.reduce((sum, item) => sum + item.Committed, 0);
  const totalAllocation = data.reduce((sum, item) =>
    sum + item.ManpowerAllocationAmt +
    item.TravelAllocationAmt +
    item.ConsumablesAllocationAmt +
    item.ContingencyAllocationAmt +
    item.OverheadAllocationAmt +
    item.EquipmentAllocationAmt, 0);

  worksheet.addRow(['Total', totalPaid, totalCommitted, totalAllocation, '-']);

  // Generate and save file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Quarterly_Report.xlsx');
}

export async function exportYearlyReport(data: YearlyBudgetAllocation[], year: number) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Yearly Report ${year}-${year + 1}`);

  // Define columns
  worksheet.columns = [
    { header: 'Category', key: 'Category', width: 25 },
    { header: 'Indented', key: 'IndentedProposed', width: 15 },
    { header: 'Paid', key: 'Paid', width: 15 },
    { header: 'Committed', key: 'Committed', width: 15 },
    { header: 'Available', key: 'AvailableAllocatedAmt', width: 15 },
    { header: 'Unallocated', key: 'UnallocatedAmt', width: 15 },
    { header: 'Utilization %', key: 'Utilization', width: 15 },
  ];

  // Add rows
  data.forEach((item) => {
    const utilizationPercentage = item.Allocation > 0 
      ? ((item.IndentedProposed / item.Allocation) * 100).toFixed(2) + '%'
      : '0.00%';

    worksheet.addRow({
      Category: item.Category,
      IndentedProposed: item.IndentedProposed,
      Paid: item.Paid,
      Committed: item.Committed,
      AvailableAllocatedAmt: item.AvailableAllocatedAmt,
      UnallocatedAmt: item.UnallocatedAmt,
      Utilization: utilizationPercentage,
    });
  });

  // Save file
  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `Yearly_Budget_Report_${year}-${year + 1}.xlsx`;
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);
}