import React from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';

function ConsumablesPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];
    let total = 0;

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e,reset)} />
                <h2>Add Consumable</h2>
                <form className='popupForm'>
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" name="date" max={today} required />
                    
                    <label htmlFor="consumableId">Consumable ID:</label>
                    <input type="text" id="consumableId" name="consumableId" required />
                    
                    <label htmlFor="consumableType">Consumable Type:</label>
                    <select id="consumableType" name="consumableType" required>
                        <option value="" disabled>Select type</option>
                        <option value="chemical">Chemical</option>
                        <option value="glassware">Glassware</option>
                        <option value="plasticware">Plasticware</option>
                        <option value="other">Other</option>
                    </select>
                    
                    <label htmlFor="rate">Rate per Piece:</label>
                    <input type="number" id="rate" name="rate" required onInput={() => total = calcInvoice()} />
                    
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" id="amount" name="amount" required onInput={() => total = calcInvoice()} />
                    
                    <label htmlFor="invoiceAmount">Invoice Amount:</label>
                    <input type="number" id="invoiceAmount" name="invoiceAmount" disabled value={total} />
                    
                    <label htmlFor="receipt">Receipt (PDF):</label>
                    <input type="file" id="receipt" name="receipt" accept="application/pdf" required />
                </form>
                <button type="submit" form='addConsumableForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

function calcInvoice() {
    let rate = document.getElementById('rate').value;
    let amount = document.getElementById('amount').value;
    let total = 0;
    if (rate && amount) {
        total = rate * amount;
    }
    document.getElementById('invoiceAmount').value = total;
}

export default ConsumablesPopup;