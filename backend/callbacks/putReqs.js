import { fileTypeFromBuffer } from "file-type";
import { db, getFromDb, updateAtDb } from "../dbUtils.js";
import { log, parseBill, sendFailedResponse } from "../utils.js";

async function addProject(req, res) {
    try {
        const { ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate, SanctionOrderNo, TotalSanctionamount, PIs, CoPIs, ManpowerAllocationAmt, ConsumablesAllocationAmt, ContingencyAllocationAmt, OverheadAllocationAmt, EquipmentAllocationAmt, TravelAllocationAmt, FundedBy } = req.body;
        const query = 'INSERT INTO projects (ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate,SanctionOrderNo,TotalSanctionamount,PIs,CoPIs,ManpowerAllocationAmt,ConsumablesAllocationAmt,ContingencyAllocationAmt,OverheadAllocationAmt,EquipmentAllocationAmt,TravelAllocationAmt, FundedBy ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
        await db.query(query,
            [ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate, SanctionOrderNo,
                parseInt(TotalSanctionamount), JSON.stringify(PIs), JSON.stringify(CoPIs), parseInt(ManpowerAllocationAmt),
                parseInt(ConsumablesAllocationAmt), parseInt(ContingencyAllocationAmt),
                parseInt(OverheadAllocationAmt), parseInt(EquipmentAllocationAmt),
                parseInt(TravelAllocationAmt), FundedBy]);
        res.status(201).json({ message: 'Project added successfully' }).end();
        const uniqueIds = [];
        const parseAndAddUnique = (arr) => {
            arr.forEach(item => {
                const parsedItem = JSON.parse(item);
                if (!uniqueIds.includes(parsedItem.id)) {
                    uniqueIds.push(parsedItem.id);
                }
            });
        };
        parseAndAddUnique(PIs);
        parseAndAddUnique(CoPIs);

        await Promise.all(uniqueIds.map(async (id) => {
            const updateUserProjectsQuery = 'UPDATE users SET projects = JSON_ARRAY_APPEND(projects, "$", ?) WHERE id = ?';
            try {
                await db.query(updateUserProjectsQuery, [ProjectNo, id]);
                console.log(`User projects updated successfully for user ID: ${id}`);
            } catch (err) {
                console.error(`Failed to update user projects for user ID: ${id}:`, err.message);
            }
        }));
    } catch (err) {
        sendFailedResponse(res, err.message, 500);
    }
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
    const { ProjectNo, ProjectTitle, RequestedAmt, Reason, RequestedDate, EmployeeID, Remarks, Source, FromDate, Destination, DestinationDate, Items } = req.body;
    
    if (!await parseBill(req, res)) return;
    
    const BillCopy = req.files.BillCopy;
    const billFiles = Array.isArray(BillCopy) ? BillCopy : [BillCopy];
    
    // Convert BillCopy files to Base64 strings
    const billBase64Strings = await Promise.all(billFiles.map(async (file) => {
        
        
        const buffer = await file.data;
        return Buffer.from(buffer).toString('base64');
    }));

    try {
        // First query: Insert into the 'indents' table
        let query = 'INSERT INTO indents (IndentCategory, ProjectNo, IndentAmount, IndentDate, IndentedPersonID, IndentStatus) VALUES (?, ?, ?, ?, ?, ?)';
        console.log([req.path.split('/').at(-1), parseInt(ProjectNo), parseInt(RequestedAmt), RequestedDate, req.processed.token.id, 'Pending']);
        
        const result = await db.query(query, [req.path.split('/').at(-1), parseInt(ProjectNo), parseInt(RequestedAmt), RequestedDate, req.processed.token.id, 'Pending']);        
        // Get the auto-incremented IndentID from the first query
        const IndentID = result[0].insertId;
        // If IndentID is not properly generated, send an error response
        if (!IndentID) {
            return sendFailedResponse(res, 'Failed to generate IndentID', 500);
        }
        let values = [];
        switch (req.path.split('/').at(-1)) {
            case 'consumables':
                query = 'INSERT INTO consumables (IndentID, ProjectNo, ProjectTitle, RequestedAmt, EmployeeID, Reason, Remark, RequestedDate, BillCopy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                values = [IndentID, parseInt(ProjectNo), ProjectTitle, parseInt(RequestedAmt), EmployeeID, Reason, Remarks, RequestedDate, JSON.stringify(billBase64Strings)];
                break;
            case 'equipment':
                query = 'INSERT INTO equipment ( ProjectNo, ProjectTitle, RequestedAmt, EmployeeID, Reason, IndentID, RequestedDate, Items, BillCopy, Remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                values = [ parseInt(ProjectNo), ProjectTitle, parseInt(RequestedAmt), EmployeeID, Reason, IndentID, RequestedDate, JSON.stringify(Items), JSON.stringify(billBase64Strings), Remarks];
                break;
            case 'manpower':
                query = 'INSERT INTO manpower (IndentID, ProjectNo, ProjectTitle, RequestedAmt, Reason, EmployeeID, RequestedDate, BillCopy, Remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                values = [parseInt(ProjectNo), ProjectTitle, parseInt(RequestedAmt), IndentID, Reason, EmployeeID, RequestedDate, JSON.stringify(billBase64Strings), Remarks];
                break;
            case 'overhead':
                query = 'INSERT INTO overhead (IndentID, ProjectNo, ProjectTitle, RequestedAmt, Reason, EmployeeID, RequestedDate, BillCopy, Remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                values = [parseInt(ProjectNo), ProjectTitle, parseInt(RequestedAmt), IndentID, Reason, EmployeeID, RequestedDate, JSON.stringify(billBase64Strings), Remarks];
                break;
            case 'travel':
                query = 'INSERT INTO travel (IndentID, ProjectNo, RequestedAmt, EmployeeID, Source, FromDate, Destination, DestinationDate, Reason, Remark, RequestedDate, Traveler, BillCopy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                values = [IndentID, parseInt(ProjectNo), parseInt(RequestedAmt), EmployeeID, Source, FromDate, Destination, DestinationDate, Reason, Remarks, RequestedDate, EmployeeID, JSON.stringify(billBase64Strings)];
                break;
            case 'contingency':
                query = 'INSERT INTO contingency (IndentID, ProjectNo, ProjectTitle, RequestedAmt, EmployeeID, Reason, RequestedDate, BillCopy, Remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                values = [IndentID, parseInt(ProjectNo), ProjectTitle, parseInt(RequestedAmt), EmployeeID, Reason, RequestedDate, JSON.stringify(billBase64Strings), Remarks];
                break;
            default:
                {sendFailedResponse(res, 'Invalid indent category', 400);return}
        }

        await db.query(query, values);

        // Send success response
        res.status(201).json({ message: 'Project indent added successfully' }).end();
    } catch (err) {
        sendFailedResponse(res, err.message, 500);
    }
}


async function addTravel(req, res) {
    const {
      ProjectNo,
      RequestedAmt,
      EmployeeID,
      From,
      FromDate,
      Destination,
      DestinationDate,
      Reason,
      Remark,
      Traveler,
      BillCopy
    } = req.body;
  
    // Validate required fields
    if (!ProjectNo || !RequestedAmt || !From || !FromDate || !Destination || !DestinationDate || !Reason || !Traveler) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
  
    // Generate a unique IndentID
    const IndentIDGenerated = generateIndentID();
  
    // Set the current date as the RequestedDate
    const RequestedDate = new Date(); 
  
    // SQL query to insert travel record
    const query = `
      INSERT INTO travel (
        ProjectNo, IndentID, RequestedAmt, EmployeeID, From, FromDate,
        Destination, DestinationDate, Reason, Remark, RequestedDate,
        Traveler, BillCopy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    // Execute the query
    db.query(query, [
      ProjectNo, IndentIDGenerated, RequestedAmt, EmployeeID, From, FromDate,
      Destination, DestinationDate, Reason, Remark, RequestedDate, Traveler, JSON.stringify(BillCopy)
    ], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error adding travel record' });
      res.status(201).json({ message: 'Travel record added successfully', indentId: IndentIDGenerated });
    });
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



export { addProject, addUser, addProjectIndent,addPurchaseReq, addPOrder, addTravel };