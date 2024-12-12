import React from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';

function TravelsPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e,reset)} />
                <h2>Add Travel</h2>
                <form className='popupForm'>
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" name="date" max={today} required />
                    
                    <label htmlFor="employeeId">Employee ID:</label>
                    <input type="text" id="employeeId" name="employeeId" required />
                    
                    <label htmlFor="reason">Reason:</label>
                    <input type="text" id="reason" name="reason" required />
                    
                    <label htmlFor="invoiceAmount">Invoice Amount:</label>
                    <input type="number" min='1' id="invoiceAmount" name="invoiceAmount" required />
                    
                    <label htmlFor="receipt">Receipt (PDF):</label>
                    <input type="file" id="receipt" name="receipt" accept="application/pdf" required />
                </form>
                <button type="submit" form='addTravelForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

export default TravelsPopup;