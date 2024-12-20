import React, { useEffect } from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';

function ManpowerEditDetailsPopup({ reset, entry }) {
    const today = new Date().toISOString().split('T')[0];
    const [manpowerDetails, setManpowerDetails] = React.useState([]);    
    useEffect(() => {
        let manpowerDetails = []
        entry.users.map((profile, index) => (
            manpowerDetails.push(
                <React.Fragment key={profile.id}>
                    <div>{index + 1}</div>
                    <div>{profile.name}</div>
                    <div>{profile.id}</div>
                    <div>{profile.role}</div>
                </React.Fragment>
            )
        ));
        setManpowerDetails(manpowerDetails);
        
    }, [entry]);
    return (
        <div className='projectPopup'>
            <div className="projectPopupCont" id="largePopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                <h2>Manpower Details</h2>
                <div id='manpowerDetails' className='table'>
                    <div className='tableTitle'>Sl.</div>
                    <div className='tableTitle'>Name</div>
                    <div className='tableTitle'>Eployee Id</div>
                    <div className='tableTitle'>Role</div>
                    {manpowerDetails}
                </div>
            </div>
        </div>
    );
};

function close(reset) {
    reset();
}

export default ManpowerEditDetailsPopup;