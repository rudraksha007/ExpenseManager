import React from 'react';
import '../css/Popup.css';
import { FaTimes } from 'react-icons/fa';

function DecManpowerPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont" id='manpowerPopupCont'>
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                <h2>Decrease Manpower</h2>
                <form id='decManpowerForm'>
                    <label htmlFor="date">Date: <input type="date" id="date" name="date" max={today} required /></label>
                    <label htmlFor="indentId">Indent ID: <input type="text" id="indentId" name="indentId" required /></label>
                </form>
                <button type="submit" form='decManpowerForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

function close(reset) {
    document.getElementById('decManpowerForm').reset();
    console.log('closed');
    reset();
}

export default DecManpowerPopup;