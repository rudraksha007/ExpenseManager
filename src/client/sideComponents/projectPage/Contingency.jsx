import React, { useContext, useState } from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import { closePopup } from '../../assets/popup';
import { fetchDataWithFileUpload } from '../../assets/scripts';
import { ProjectContext } from '../../assets/ProjectData';
import { ProfileContext } from '../../assets/UserProfile';

function ContingencyPopup({ reset }) {
    const [loading, setLoading] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const { ProjectNo, ProjectTitle, RemainingContingencyAmt } = (useContext(ProjectContext)).project;
    const { id, name } = useContext(ProfileContext).profile;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        setLoading(true);
        const res = await fetchDataWithFileUpload('contingency', 'put', e.currentTarget);
        setLoading(false);
        if (res.reqStatus === 'success') {
            alert('Contingency Added Successfully');
            reset();
        } else {
            alert('Failed: ' + res.message);
        }
    };

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                {loading ? <Oval color='white' height={80} strokeWidth={5} /> : 
                <>
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e, reset)} />
                <h2>Add Contingency</h2>
                <form className='popupForm' id='addEquipmentForm' onSubmit={(e) => handleSubmit(e)}>

                    <label htmlFor="RequestedDate">Date:</label>
                    <input type="date" id="RequestedDate" name="RequestedDate" max={today} required />

                    <label htmlFor="ProjectNo">Project No:</label>
                    <input type="text" id="ProjectNo" name="ProjectNo" readOnly value={ProjectNo} />

                    <label htmlFor="ProjectTitle">Project Title:</label>
                    <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly value={ProjectTitle} />

                    <label htmlFor="EmployeeID">Employee ID:</label>
                    <input type="text" id="EmployeeID" name="EmployeeID" required readOnly value={id}/>

                    <label htmlFor="EmployeeName">Employee Name:</label>
                    <input type="text" id="EmployeeName" name="EmployeeName" required value={name}/>

                    <label htmlFor="Reason">Purpose:</label>
                    <input type="text" id="Reason" name="Reason" required />

                    <label htmlFor="RequestedAmt">Invoice Amount:</label>
                    <input type="number" id="RequestedAmt" name="RequestedAmt" min={0} max={RemainingContingencyAmt}/>

                    <label htmlFor="Remarks">Remarks:</label>
                    <textarea id="Remarks" name="Remarks" rows="4" />

                    <label htmlFor="BillCopy">Bill Copy (PDF):</label>
                    <input type="file" id="BillCopy" name="BillCopy" accept="application/pdf" required multiple/>
                </form>
                <button type="submit" form='addEquipmentForm' className='hoverable'>Submit</button>
                </>}
            </div>
        </div>
    );
};

export default ContingencyPopup;