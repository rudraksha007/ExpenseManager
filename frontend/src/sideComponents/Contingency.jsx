import React from 'react';
import '../css/Popup.css';
import { FaTimes } from 'react-icons/fa';

function ContingencyPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                <h2>Add Contingency</h2>
                <form id='addContingencyForm'>
                    <label htmlFor="date">Date: <input type="date" id="date" name="date" max={today} required /></label>
                    <label htmlFor="contingencyId">Contingency ID: <input type="text" id="contingencyId" name="contingencyId" required /></label>
                    <label htmlFor="description">Description: <textarea id="description" name="description" required /></label>
                </form>
                <button type="submit" form='addContingencyForm'>Submit</button>
            </div>
        </div>
    );
};

function close(reset) {
    document.getElementById('addContingencyForm').reset();
    console.log('closed');
    reset();
}

export default ContingencyPopup;