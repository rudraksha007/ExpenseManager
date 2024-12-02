import React from 'react';
import '../css/Popup.css';
import { FaTimes } from 'react-icons/fa';

function ConsumablesPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                <h2>Add Consumable</h2>
                <form id='addConsumableForm'>
                    <label htmlFor="date">Date: <input type="date" id="date" name="date" max={today} required /></label>
                    <label htmlFor="consumableId">Consumable ID: <input type="text" id="consumableId" name="consumableId" required /></label>
                    <label htmlFor="receipt">Receipt (PDF): <input type="file" id="receipt" name="receipt" accept="application/pdf" required /></label>
                </form>
                <button type="submit" form='addConsumableForm'>Submit</button>
            </div>
        </div>
    );
};

function close(reset) {
    document.getElementById('addConsumableForm').reset();
    console.log('closed');
    reset();
}

export default ConsumablesPopup;