import React from 'react';
import '../css/Popup.css';
import { FaTimes } from 'react-icons/fa';

function ManpowerPopup({reset}) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{position:'absolute',right:10, top: 10, cursor:'pointer'}} onClick={()=>close(reset)}/>
                <h2>Add Manpower</h2>
                <form id='addManpowerForm'>
                    <label htmlFor="date">Date: <input type="date" id="date" name="date" max={today} required /></label>
                    <label htmlFor="indentId">Indent ID: <input type="text" id="indentId" name="indentId" required /></label>
                    <label htmlFor="bill">Bill (PDF): <input type="file" id="bill" name="bill" accept="application/pdf" required /></label>
                </form>
                <button type="submit" form='addManpowerForm'>Submit</button>
            </div>
        </div>
    );
};
function close(reset){
    document.getElementById('addManpowerForm').reset();
    console.log('closed');
    reset();
}
export default ManpowerPopup;