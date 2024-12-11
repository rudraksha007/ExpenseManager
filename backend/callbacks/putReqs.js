import { db } from "../dbUtils.js";
import { log, sendFailedResponse } from "../utils.js";
async function addProject(req, res) {
    const { ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate, SanctionOrderNo, TotalSanctionamount, PIname, CoPIs, ManpowerAllocationAmt, ConsumablesAllocationAmt, ContingencyAllocationAmt, OverheadAllocationAmt, EquipmentAllocationAmt, TravelAllocationAmt } = req.body;
    const query = 'INSERT INTO projects (ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate,SanctionOrderNo,TotalSanctionamount,PIname,CoPIs,ManpowerAllocationAmt,ConsumablesAllocationAmt,ContingencyAllocationAmt,OverheadAllocationAmt,EquipmentAllocationAmt,TravelAllocationAmt ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
    db.query(query,
        [ProjectTitle, ProjectNo,
            ProjectStartDate, ProjectEndDate, SanctionOrderNo,
            parseInt(TotalSanctionamount), PIname, CoPIs, parseInt(ManpowerAllocationAmt),
            parseInt(ConsumablesAllocationAmt), parseInt(ContingencyAllocationAmt),
            parseInt(OverheadAllocationAmt), parseInt(EquipmentAllocationAmt),
            parseInt(TravelAllocationAmt)]).then(result => {
                res.status(201).json({ message: 'Project added successfully' }).end();
            }).catch(err => {
                sendFailedResponse(res, err.message, 500);
            });
}
function addUser(req, res) {
    let x = { ...req.body, projects: '[]', status: 1 };
    const { id, name, email, password, projects, role, status } = x;
    const query = 'INSERT INTO users(id,name,email,password,projects,status,role) VALUES (?, ?, ?, ?, ?, ?,?)';
    db.query(query, [parseInt(id), name, email, password, projects, status,role]).then(result => {
        res.status(201).json({ message: 'Profile added successfully' }).end();
    }).catch(err => {
        sendFailedResponse(res, err.message, 500);
    });
}
export { addProject, addUser };