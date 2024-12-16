import React, { useContext, useEffect } from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';
import { fetchDataWithFileUpload, fetchDataWithParams } from '../../assets/scripts';
import { ProjectContext } from '../../assets/ProjectData';
import { ProfileContext } from '../../assets/UserProfile';

function ConsumablesPopup({ reset }) {
    const { ProjectNo, ProjectTitle, ConsumablesAllocationAmt, AllocatedConsumables } = (useContext(ProjectContext)).project;
    const {profile} = useContext(ProfileContext);
    const today = new Date().toISOString().split('T')[0];
    const [IndentId, setIndentId] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        const res = await fetchDataWithFileUpload('consumables', 'put', e.currentTarget);
        if (res.reqStatus === 'success') {
            alert('Consumable Added Successfully');
            reset();
        } else {
            alert('Failed: ' + res.message);
        }
    };
    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e,reset)} />
                <h2>Add Consumable</h2>
                <form className='popupForm' onSubmit={(e)=> handleSubmit(e)} id='consumableForm'>
                    <label htmlFor="RequestedDate">Date:</label>
                    <input type="date" id="RequestedDate" name="RequestedDate" max={today} required />

                    <label htmlFor="ProjectNo">Project No:</label>
                    <input type="number" id="ProjectNo" name="ProjectNo" readOnly value={ProjectNo} onChange={()=>{}} />

                    <label htmlFor="ProjectTitle">Project Title:</label>
                    <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly value={ProjectTitle} onChange={()=>{}} />
                    
                    <label htmlFor="RequestedAmt">Invoice Amount:</label>
                    <input type="number" id="RequestedAmt" name="RequestedAmt"  min={1} max={ConsumablesAllocationAmt-AllocatedConsumables}/>

                    <label htmlFor="Overhead">Overhead:</label>
                    <input type="number" id="Overhead" name="Overhead" required min={1}/>
                    
                    <label htmlFor="EmployeeID">Employee ID:</label>
                    <input type="text" id="EmployeeID" name="EmployeeID" value={profile.id} required readOnly />

                    <label htmlFor="EmployeeName">Employee Name:</label>
                    <input type="text" id="EmployeeName" name="EmployeeName" required readOnly value={profile.name}/>
                    
                    <label htmlFor="Reason">Reason:</label>
                    <input type="text" id="Reason" name="Reason" required />
                    
                    <label htmlFor="Remarks">Remarks:</label>
                    <textarea id="Remarks" name="Remarks" rows="4" />
                    
                    <label htmlFor="BillCopy">Support Document (PDF):</label>
                    <input type="file" id="BillCopy" name="BillCopy" accept="application/pdf" required multiple />
                </form>
                <button type="submit" form='consumableForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

export default ConsumablesPopup;