import { fileTypeFromBuffer } from "file-type";
import { db, getFromDb, updateAtDb } from "../dbUtils.js";
import { log, parseBill, sendFailedResponse } from "../utils.js";

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

async function addProjectIndent(req, res) {
    const { ProjectNo, ProjectTitle, RequestedAmt, IndentID, Reason, RequestedDate } = req.body;
    if(!parseBill(req)) return;
    const BillCopy = req.files.BillCopy[0]
    let query = 'INSERT INTO indents (IndentID, IndentCategory, ProjectNo, IndentAmount, IndentDate, IndentedPersonID, IndentStatus) VALUES (?, ?, ?, ?, ?, ?, ?)';
    log([parseInt(IndentID), req.path.split('/').at(-1), parseInt(ProjectNo), parseInt(RequestedAmt), RequestedDate, req.processed.token.id, 'Pending']);
    db.query(query, [parseInt(IndentID), req.path.split('/').at(-1), parseInt(ProjectNo), parseInt(RequestedAmt), RequestedDate, req.processed.token.id, 'Pending']).then(result => {
        query = `INSERT INTO ${req.path.split('/').at(-1)} (ProjectNo, ProjectTitle, RequestedAmt, IndentID, RequestID, Reason, EmployeeID, RequestedDate, BillCopy) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;
        db.query(query, [parseInt(ProjectNo), ProjectTitle, parseInt(RequestedAmt), parseInt(IndentID), parseInt(IndentID), Reason, req.processed.id, RequestedDate, BillCopy.data]).then(result => {
            res.status(201).json({ message: 'Travel added successfully' }).end();
        }).catch(err => {sendFailedResponse(res, err.message, 500);});
    }).catch(err => { sendFailedResponse(res, err.message, 500); });

}

async function addPurchaseReq(req, res){
    const {IndentID, PRDate, PRRequestor} = req.body;
    await getFromDb('indents', ['*'], `IndentID=${IndentID}`).then((results) => {
        if(results.length === 0) {
            sendFailedResponse(res, 'Indent not found', 404);
            return;
        }
        const indent = results[0];
        if(indent.IndentStatus !== 'Approved') {
            sendFailedResponse(res, 'Indent not approved', 400);
            return;
        }
        const { ProjectNo, IndentAmount } = indent;
        const query = 'INSERT INTO purchaserequests (PurchaseReqID, PRDate, ProjectNo, IndentID, PurchaseRequestAmount, PRRequestor, PRStatus) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [parseInt(IndentID), PRDate, parseInt(ProjectNo), parseInt(IndentID), IndentAmount, PRRequestor, 'Pending']).then(result => {
            res.status(201).json({ message: 'Purchase request added successfully' }).end();
        }).catch(err => {
            sendFailedResponse(res, err.message, 500);
        });
    }).catch((err) => {
        sendFailedResponse(res, err.message, 500);
    });
}

async function addPOrder(req, res) {
    const { ExpenseID, ExpenseDate, ExpenseAmount, ExpenseDescription, ProjectNo } = req.body;
    await getFromDb('projects', ['*'], `ProjectNo=${ProjectNo}`).then((results) => {
        if (results.length === 0) {
            sendFailedResponse(res, 'Project not found', 404);
            return;
        }
        const query = 'INSERT INTO expenses (ExpenseID, ExpenseDate, ExpenseAmount, ExpenseDescription, ProjectNo) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [parseInt(ExpenseID), ExpenseDate, parseInt(ExpenseAmount), ExpenseDescription, parseInt(ProjectNo)]).then(result => {
            res.status(201).json({ message: 'Expense added successfully' }).end();
        }).catch(err => {
            sendFailedResponse(res, err.message, 500);
        });
    }).catch((err) => {
        sendFailedResponse(res, err.message, 500);
    });
}



export { addProject, addUser, addProjectIndent,addPurchaseReq, addPOrder };