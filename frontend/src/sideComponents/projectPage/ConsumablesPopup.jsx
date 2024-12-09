import React from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';

function ConsumablesPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];
    let total = 0;

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                <h2>Add Consumable</h2>
                <form id='addConsumableForm'>
                    <label htmlFor="date">Date: <input type="date" id="date" name="date" max={today} required /></label>
                    <label htmlFor="consumableId">Consumable ID: <input type="text" id="consumableId" name="consumableId" required /></label>
                    <label htmlFor="consumableType">Consumable Type:
                        <select id="consumableType" name="consumableType" required>
                            <option value="" disabled>Select type</option>
                            <option value="chemical">Chemical</option>
                            <option value="glassware">Glassware</option>
                            <option value="plasticware">Plasticware</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label htmlFor="rate">Rate per Piece: <input type="number" id="rate" name="rate" required onInput={() => total = calcInvoice()} /></label>
                    <label htmlFor="amount">Amount: <input type="number" id="amount" name="amount" required onInput={() => total = calcInvoice()} /></label>
                    <label htmlFor="invoiceAmount">Invoice Amount: <input type="number" id="invoiceAmount" name="invoiceAmount" disabled value={total} /></label>
                    <label htmlFor="receipt">Receipt (PDF): <input type="file" id="receipt" name="receipt" accept="application/pdf" required /></label>
                </form>
                <button type="submit" form='addConsumableForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

function close(reset) {
    document.getElementById('addConsumableForm').reset();
    reset();
}

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