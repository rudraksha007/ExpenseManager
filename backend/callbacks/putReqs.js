import { db } from "../dbUtils.js";
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
                res.status(500).json({ message: err.message }).end();
            });
}
export { addProject };