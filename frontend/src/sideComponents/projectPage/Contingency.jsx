import React from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';

function ContingencyPopup({ reset, projectNo, projectTitle }) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e, reset)} />
                <h2>Add Contingency</h2>
                <form className='popupForm'>
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" name="date" max={today} required />

                    <label htmlFor="ProjectNo">Project No:</label>
                    <input type="number" id="ProjectNo" name="ProjectNo" disabled value={projectNo} />

                    <label htmlFor="ProjectTitle">Project Title:</label>
                    <input type="text" id="ProjectTitle" name="ProjectTitle" disabled value={projectTitle} />

                    <label htmlFor="indentId">Indent ID:</label>
                    <input type="text" id="indentId" name="indentId" required />
                    <label htmlFor="contingencyId">Contingency ID:</label>
                    <input type="text" id="contingencyId" name="contingencyId" required />
                    <label htmlFor="description">Description:</label>
                    <input type='text' id="description" name="description" required />
                </form>
                <button type="submit" form='addContingencyForm' className='hoverable'>Submit</button>
            </div>
        </div>
    );
};

export default ContingencyPopup;