import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function Save({data, type}){
    return(
        <button onClick={(e) => {
            e.preventDefault();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet1');
            if (type === 'category') {
                worksheet.columns = [
                    { header: 'Sl.', key: 'sl', width: 5 },
                    { header: 'Project Title', key: 'ProjectTitle', width: 30 },
                    { header: 'Total Sanction', key: 'TotalSanctionAmount', width: 15 },
                    { header: 'Manpower Used', key: 'ManpowerUsed', width: 15 },
                    { header: 'Consumable Used', key: 'ConsumablesUsed', width: 15 },
                    { header: 'Contingency Used', key: 'ContingencyUsed', width: 15 },
                    { header: 'Overhead Used', key: 'OverheadUsed', width: 15 },
                    { header: 'Equipment Used', key: 'EquipmentUsed', width: 15 },
                    { header: 'Travel Used', key: 'TravelUsed', width: 15 },
                    { header: 'Remaining Amount', key: 'RemainingAmount', width: 15 },
                ];
            } else if(type === 'general') {
                worksheet.columns = [
                    { header: 'Sl.', key: 'sl', width: 5 },
                    { header: 'Project Title', key: 'ProjectTitle', width: 30 },
                    { header: 'Total Sanction', key: 'TotalSanctionAmount', width: 15 },
                    { header: 'Total Indent', key: 'TotalIndentAmount', width: 15 },
                    { header: 'Remaining Amount', key: 'RemainingAmount', width: 15 },
                ];
            }
            else{
                worksheet.columns = [
                    { header: 'Sl.', key: 'sl', width: 5 },
                    { header: 'Category', key: 'Category', width: 15 },
                    { header: 'Allocation', key: 'Allocation', width: 15 },
                    { header: 'Indented/proposed', key: 'IndentedProposed', width: 15 },
                    { header: 'Paid', key: 'Paid', width: 15 },
                    { header: 'Committed', key: 'Committed', width: 15 },
                    { header: 'Available', key: 'Available', width: 15 },
                ];
            }

            data.forEach((proj, i) => {
                worksheet.addRow({
                    sl: i + 1,
                    ...proj
                });
            });

            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'data.xlsx')
            });
        }}>Download As Excel</button>
    )
}

export default Save;