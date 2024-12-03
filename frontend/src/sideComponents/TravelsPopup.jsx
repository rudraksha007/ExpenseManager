import React from 'react';
import '../css/Popup.css';
import { FaTimes } from 'react-icons/fa';

function TravelsPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                <h2>Add Travel</h2>
                <form id='addTravelForm'>
                    <label htmlFor="date">Date: <input type="date" id="date" name="date" max={today} required /></label>
                    <label htmlFor="employeeId">Employee ID: <input type="text" id="employeeId" name="employeeId" required /></label>
                    <label htmlFor="reason">Reason: <input type="text" id="reason" name="reason" required /></label>
                    <label htmlFor="invoiceAmount">Invoice Amount: <input type="number" min='1' id="invoiceAmount" name="invoiceAmount" required /></label>
                    <label htmlFor="receipt">Receipt (PDF): <input type="file" id="receipt" name="receipt" accept="application/pdf" required /></label>
                </form>
                <button type="submit" form='addTravelForm'>Submit</button>
            </div>
        </div>
    );
};

function close(reset) {
    document.getElementById('addTravelForm').reset();
    console.log('closed');
    reset();
}

export default TravelsPopup;