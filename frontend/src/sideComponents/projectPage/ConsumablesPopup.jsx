import React from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';
import { fetchDataWithFileUpload } from '../../assets/scripts';

function ConsumablesPopup({ reset, projectNo, projectTitle }) {
    const today = new Date().toISOString().split('T')[0];
    let total = 0;
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
                    <input type="number" id="ProjectNo" name="ProjectNo" readOnly value={projectNo} />

                    <label htmlFor="ProjectTitle">Project Title:</label>
                    <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly value={projectTitle} />

                    <label htmlFor="IndentID">Indent ID:</label>
                    <input type="number" id="IndentID" name="IndentID" required />
                    
                    <label htmlFor="Rate">Rate per Unit:</label>
                    <input type="number" id="Rate" name="Rate" required min="1" onInput={() => total = calcInvoice()} />

                    <label htmlFor="RequestedNumber">Requested Amount:</label>
                    <input type="number" id="RequestedNumber" name="RequestedNumber" required min="1" onInput={() => total = calcInvoice()} />
                    
                    <label htmlFor="EmployeeID">Employee ID:</label>
                    <input type="number" id="EmployeeID" name="EmployeeID" required min="1" />
                    
                    <label htmlFor="Reason">Reason:</label>
                    <input type="text" id="Reason" name="Reason" required />
                    
                    <label htmlFor="RequestedAmt">Invoice Amount:</label>
                    <input type="number" id="RequestedAmt" name="RequestedAmt" readOnly value={total} />
                    
                    <label htmlFor="BillCopy">Receipt (PDF):</label>
                    <input type="file" id="BillCopy" name="BillCopy" accept="application/pdf" required />
                </form>
                <button type="submit" form='consumableForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

function calcInvoice() {
    let rate = document.getElementById('Rate').value;
    let amount = document.getElementById('RequestedNumber').value;
    let total = 0;
    if (rate && amount) {
        total = rate * amount;
    }
    document.getElementById('RequestedAmt').value = total;
}

export default ConsumablesPopup;