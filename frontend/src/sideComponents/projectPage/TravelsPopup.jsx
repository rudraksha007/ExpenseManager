import React, { useContext } from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';
import { fetchDataWithFileUpload } from '../../assets/scripts';
import { ProjectContext } from '../../assets/ProjectData';
import { ProfileContext } from '../../assets/UserProfile';

function TravelsPopup({ reset }) {
    const { ProjectNo, ProjectTitle } = (useContext(ProjectContext)).project;
    const {id, name} = useContext(ProfileContext).profile;
    const today = new Date().toISOString().split('T')[0];
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!e.currentTarget.checkValidity())return;
        const res = await fetchDataWithFileUpload('travel', 'put', e.currentTarget);
        if(res.reqStatus === 'success'){
            alert('Travel Added Successfully');
            reset();
        }else{
            alert('Failed: '+res.message);
        }
    }

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e, reset)} />
                <h2>Add Travel</h2>
                <form className='popupForm' id='addTravelForm' onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="ProjectNo">Project No:</label>
                    <input type="text" id="ProjectNo" name="ProjectNo" readOnly value={ProjectNo} />
                    
                    <label htmlFor="ProjectTitle">Project Title:</label>
                    <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly value={ProjectTitle}/>
                    
                    <label htmlFor="RequestedDate">Requested Date:</label>
                    <input type="date" id="RequestedDate" name="RequestedDate" max={today} required />

                    <label htmlFor="IndentID">Project No:</label>
                    <input type="number" id="IndentID" name="IndentID" readOnly value={ProjectNo}/>

                    <label htmlFor="EmployeeName">Employee Name:</label>
                    <input type="text" id="EmployeeName" name="EmployeeName" required readOnly value={name}/>

                    <label htmlFor="EmployeeID">Employee ID:</label>
                    <input type="number" id="EmployeeID" name="EmployeeID" required readOnly value={id}/>
                    
                    <label htmlFor="Source">From Place:</label>
                    <input type="text" id="Source" name="Source" required />

                    <label htmlFor="FromDate">From Date:</label>
                    <input type="date" id="FromDate" name="FromDate" max={today} required />

                    <label htmlFor="Destination">Destination:</label>
                    <input type="text" id="Destination" name="Destination" required />

                    <label htmlFor="DestinationDate">To Date:</label>
                    <input type="date" id="DestinationDate" name="DestinationDate" max={today} required />

                    <label htmlFor="Reason">Purpose:</label>
                    <input type="text" id="Reason" name="Reason" required />
                    
                    <label htmlFor="RequestedAmt">Invoice Amount:</label>
                    <input type="number" min='1' id="RequestedAmt" name="RequestedAmt" required />
                    
                    <label htmlFor="Remarks">Remarks:</label>
                    <textarea id="Remarks" name="Remarks" rows="4" />

                    <label htmlFor="BillCopy">Travel Expense:</label>
                    <input type="file" id="BillCopy" name="BillCopy" accept="application/pdf" required title='Upload Reciept' multiple/>
                </form>
                <button type="submit" form='addTravelForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

export default TravelsPopup;