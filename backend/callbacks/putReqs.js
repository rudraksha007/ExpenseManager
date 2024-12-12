import { fileTypeFromBuffer } from "file-type";
import { db } from "../dbUtils.js";
import { log, sendFailedResponse } from "../utils.js";

async function addProject(req, res) {
    const { ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate, SanctionOrderNo, TotalSanctionamount, PIname, CoPIs, ManpowerAllocationAmt, ConsumablesAllocationAmt, ContingencyAllocationAmt, OverheadAllocationAmt, EquipmentAllocationAmt, TravelAllocationAmt, FundedBy } = req.body;
    const query = 'INSERT INTO projects (ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate,SanctionOrderNo,TotalSanctionamount,PIname,CoPIs,ManpowerAllocationAmt,ConsumablesAllocationAmt,ContingencyAllocationAmt,OverheadAllocationAmt,EquipmentAllocationAmt,TravelAllocationAmt, FundedBy ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
    db.query(query,
        [ProjectTitle, ProjectNo,
            ProjectStartDate, ProjectEndDate, SanctionOrderNo,
            parseInt(TotalSanctionamount), PIname, CoPIs, parseInt(ManpowerAllocationAmt),
            parseInt(ConsumablesAllocationAmt), parseInt(ContingencyAllocationAmt),
            parseInt(OverheadAllocationAmt), parseInt(EquipmentAllocationAmt),
            parseInt(TravelAllocationAmt), FundedBy]).then(result => {
                res.status(201).json({ message: 'Project added successfully' }).end();
            }).catch(err => {
                sendFailedResponse(res, err.message, 500);
            });
}

function addUser(req, res) {
    let x = { ...req.body, projects: '[]', status: 1 };
    const { id, name, email, password, projects, role, status } = x;
    const query = 'INSERT INTO users(id,name,email,password,projects,status,role) VALUES (?, ?, ?, ?, ?, ?,?)';
    db.query(query, [parseInt(id), name, email, password, projects, status, role]).then(result => {
        res.status(201).json({ message: 'Profile added successfully' }).end();
    }).catch(err => {
        sendFailedResponse(res, err.message, 500);
    });
}

async function addTravel(req, res) {
    const { ProjectNo, ProjectTitle, TravelRequestedAmt, IndentID, Reason, RequestedDate } = req.body;
    const BillCopy = req.files?.BillCopy[0];
    if (!BillCopy || !BillCopy.data) {
        return sendFailedResponse(res, 'Bill copy not found', 400);
    }
    const buffer = BillCopy.data;

    // Use the file-type library to get the actual file type
    const type = await fileTypeFromBuffer(buffer);

    if (!type || type.mime !== 'application/pdf') {
        return sendFailedResponse(res, 'Invalid file type', 400);
    }
    console.log(req.body);
    let query = 'INSERT INTO indents (IndentID, IndentCategory, ProjectNo, IndentAmount, IndentDate, IndentedPersonID, IndentStatus) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [parseInt(IndentID), 'Travel', parseInt(ProjectNo), parseInt(TravelRequestedAmt), RequestedDate, req.processed.id, 'Pending']).then(result => {
        query = 'INSERT INTO travel (ProjectNo, ProjectTitle, RequestedAmt, IndentID, RequestID, Reason, EmployeeID, RequestedDate, BillCopy) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
        db.query(query, [parseInt(ProjectNo), ProjectTitle, parseInt(TravelRequestedAmt), parseInt(IndentID), parseInt(IndentID), Reason, req.processed.id, RequestedDate, BillCopy.data]).then(result => {
            res.status(201).json({ message: 'Travel added successfully' }).end();
        }).catch(err => {sendFailedResponse(res, err.message, 500);});
    }).catch(err => { sendFailedResponse(res, err.message, 500); });

}
export { addProject, addUser, addTravel };