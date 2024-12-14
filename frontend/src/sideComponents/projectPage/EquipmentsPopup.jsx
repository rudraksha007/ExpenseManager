import React, { useRef } from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';
import { fetchDataWithFileUpload } from '../../assets/scripts';

function EquipmentsPopup({ reset, projectNo, projectTitle }) {
    const today = new Date().toISOString().split('T')[0];
    const [total, setTotal] = React.useState(0);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        const res = await fetchDataWithFileUpload('equipment', 'put', e.currentTarget);
        if (res.reqStatus === 'success') {
            alert('Equipment Added Successfully');
            reset();
        } else {
            alert('Failed: ' + res.message);
        }
    };

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e, reset)} />
                <h2>Add Equipment</h2>
                <form className='popupForm' id='addEquipmentForm' onSubmit={(e)=>handleSubmit(e)}>
                    <label htmlFor="RequestID">Request ID:</label>
                    <input type="number" id="RequestID" name="RequestID" required />
                    <label htmlFor="RequestedDate">Date:</label>
                    <input type="date" id="RequestedDate" name="RequestedDate" max={today} required />

                    <label htmlFor="ProjectNo">Project No:</label>
                    <input type="number" id="ProjectNo" name="ProjectNo" readOnly value={projectNo} />

                    <label htmlFor="ProjectTitle">Project Title:</label>
                    <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly value={projectTitle} />

                    <label htmlFor="IndentID">Indent ID:</label>
                    <input type="number" id="IndentID" name="IndentID" required />

                    <label htmlFor="rate">Rate per Unit:</label>
                    <input type="number" id="rate" name="rate" required onChange={() => calcInvoice(setTotal)} />

                    <label htmlFor="RequestedNum">Requested Amount:</label>
                    <input type="number" id="RequestedNum" name="RequestedNum" required onChange={() => calcInvoice(setTotal)} />
                    
                    <label htmlFor="EmployeeID">Employee ID:</label>
                    <input type="number" id="EmployeeID" name="EmployeeID" required />

                    <label htmlFor="EmployeeName">Employee Name:</label>
                    <input type="text" id="EmployeeName" name="EmployeeName" required />
                    
                    <label htmlFor="Reason">Reason:</label>
                    <input type="text" id="Reason" name="Reason" required />
                    
                    <label htmlFor="RequestedAmt">Invoice Amount:</label>
                    <input type="number" id="RequestedAmt" name="RequestedAmt" readOnly value={total} />

                    <label htmlFor="Remarks">Remarks:</label>
                    <textarea id="Remarks" name="Remarks" rows="4" />
                    
                    <label htmlFor="BillCopy">Bill Copy (PDF):</label>
                    <input type="file" id="BillCopy" name="BillCopy" accept="application/pdf" required multiple/>
                </form>
                <button type="submit" form='addEquipmentForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

function calcInvoice(setTotal) {
    let rate = document.getElementById('rate').value;
    let requestedNum = document.getElementById('RequestedNum').value;
    if (rate && requestedNum) {
        setTotal(rate * requestedNum);
    }
}
export default EquipmentsPopup;