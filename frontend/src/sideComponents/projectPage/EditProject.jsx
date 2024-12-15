import React, { useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { ProjectContext } from "../../assets/ProjectData";

function EditProject({ reset }) {
    const [form, setForm] = React.useState(useContext(ProjectContext).project);
    const handleSubmit = (e) => {
        if(!e.currentTarget.checkValidity())return;
        //submit
    };

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => reset()}/>
                <h2>Edit Project</h2>
                <form className='popupForm' id='editProjectForm' onSubmit={handleSubmit}>
                    <label>Funded By:</label>
                    <input type="text" name="FundedBy" value={form.FundedBy || ''} onChange={(e) => setForm({ ...form, FundedBy: e.target.value })} />

                    <label>Project Id:</label>
                    <input type="text" name="id" value={form.ProjectNo || ''} onChange={(e) => setForm({ ...form, id: e.target.value })} />

                    <label>Title:</label>
                    <input type="text" name="ProjectTitle" value={form.ProjectTitle || ''} onChange={(e) => setForm({ ...form, ProjectTitle: e.target.value })} />

                    <label>Sanction Order No:</label>
                    <input type="text" name="SanctionOrderNo" value={form.SanctionOrderNo || ''} onChange={(e) => setForm({ ...form, SanctionOrderNo: e.target.value })} />

                    <label>Total Sanction Amount:</label>
                    <input type="text" name="TotalSanctionAmount" value={form.TotalSanctionAmount || ''} onChange={(e) => setForm({ ...form, TotalSanctionAmount: e.target.value })} />

                    <label>Project Start Date:</label>
                    <input type="date" name="ProjectStartDate" value={form.ProjectStartDate ? form.ProjectStartDate.split('T')[0] : ''} onChange={(e) => setForm({ ...form, ProjectStartDate: e.target.value })} />

                    <label>Project End Date:</label>
                    <input type="date" name="ProjectEndDate" value={form.ProjectEndDate ? form.ProjectEndDate.split('T')[0] : ''} onChange={(e) => setForm({ ...form, ProjectEndDate: e.target.value })} />

                    <label>PI Name:</label>
                    <input type="text" name="PIName" value={form.PIName || ''} onChange={(e) => setForm({ ...form, PIName: e.target.value })} />

                    <label>Co-PIs:</label>
                    <input type="text" name="CoPIs" value={form.CoPIs || ''} onChange={(e) => setForm({ ...form, CoPIs: e.target.value })} />

                    <label>Manpower Allocation Amt:</label>
                    <input type="text" name="ManpowerAllocationAmt" value={form.ManpowerAllocationAmt || 0} onChange={(e) => setForm({ ...form, ManpowerAllocationAmt: e.target.value })} />

                    <label>Consumables Allocation Amt:</label>
                    <input type="text" name="ConsumablesAllocationAmt" value={form.ConsumablesAllocationAmt || 0} onChange={(e) => setForm({ ...form, ConsumablesAllocationAmt: e.target.value })} />

                    <label>Contingency Allocation Amt:</label>
                    <input type="text" name="ContingencyAllocationAmt" value={form.ContingencyAllocationAmt || 0} onChange={(e) => setForm({ ...form, ContingencyAllocationAmt: e.target.value })} />

                    <label>Overhead Allocation Amt:</label>
                    <input type="text" name="OverheadAllocationAmt" value={form.OverheadAllocationAmt || 0} onChange={(e) => setForm({ ...form, OverheadAllocationAmt: e.target.value })} />

                    <label>Equipment Allocation Amt:</label>
                    <input type="text" name="EquipmentAllocationAmt" value={form.EquipmentAllocationAmt || 0} onChange={(e) => setForm({ ...form, EquipmentAllocationAmt: e.target.value })} />

                    <label>Travel Allocation Amt:</label>
                    <input type="text" name="TravelAllocationAmt" value={form.TravelAllocationAmt || 0} onChange={(e) => setForm({ ...form, TravelAllocationAmt: e.target.value })} />
                </form>
                <button type="submit" form='editProjectForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
}

export default EditProject;