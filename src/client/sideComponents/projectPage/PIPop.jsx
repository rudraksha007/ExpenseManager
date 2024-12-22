import React from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';

function PIPop({ reset, data, type }) {
    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">

                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => reset()} />
                <h2>{type}</h2>
                <div className='table' style={{ gridTemplateColumns: '1fr 4fr' }}>
                    <div className='tableTitle'>Employee ID</div>
                    <div className='tableTitle'>Name</div>
                    {
                        data.map((item, index) => {
                            let parsed = JSON.parse(item);  
                            return (
                                <>
                                    <div>{parsed.id}</div>
                                    <div>{parsed.name}</div>
                                </>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default PIPop;