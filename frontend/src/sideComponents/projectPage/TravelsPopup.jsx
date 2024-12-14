import React from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';
import { fetchDataWithFileUpload } from '../../assets/scripts';

function TravelsPopup({ reset, projectNo, projectTitle }) {
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
                    <label htmlFor="ProjectTitle">Project Title:</label>
                    <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly value={projectTitle}/>
                    
                    <label htmlFor="RequestedDate">Date:</label>
                    <input type="date" id="RequestedDate" name="RequestedDate" max={today} required />

                    <label htmlFor="ProjectNo">Project No:</label>
                    <input type="number" id="ProjectNo" name="ProjectNo" readOnly value={projectNo}/>

                    <label htmlFor="IndentID">Indent ID:</label>
                    <input type="number" id="IndentID" name="IndentID" required />

                    <label htmlFor="EmployeeName">Employee Name:</label>
                    <input type="text" id="EmployeeName" name="EmployeeName" required />

                    <label htmlFor="EmployeeID">Employee ID:</label>
                    <input type="number" id="EmployeeID" name="EmployeeID" required />
                    
                    <label htmlFor="FromPlace">From Place:</label>
                    <input type="text" id="FromPlace" name="FromPlace" required />

                    <label htmlFor="FromDate">From Date:</label>
                    <input type="date" id="FromDate" name="FromDate" max={today} required />

                    <label htmlFor="Destination">Destination:</label>
                    <input type="text" id="Destination" name="Destination" required />

                    <label htmlFor="ToDate">To Date:</label>
                    <input type="date" id="ToDate" name="ToDate" max={today} required />

                    <label htmlFor="Purpose">Purpose:</label>
                    <input type="text" id="Purpose" name="Purpose" required />
                    
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