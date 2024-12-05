import React, { useEffect, useState } from 'react';
import '../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { fetchData } from '../assets/scripts';
import { Oval } from 'react-loader-spinner';

function ManpowerPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getProfiles() {
            const data = await fetchData('profiles');
            if (data) {
                let l = [];
                data.profiles.map((profile, index) => (
                    l.push(
                        <React.Fragment key={profile.id}>
                            <div><input type="checkbox" value={profile.id}/></div>
                            <div>{profile.name}</div>
                            <div>{profile.id}</div>
                        </React.Fragment>
                    )
                ));
                setProfiles(l);
            }
            setLoading(false);
        }
        getProfiles();
    }, []);
    return (
        <div className='projectPopup'>
            <div className="projectPopupCont" id='manpowerPopupCont'>
                <>
                    {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                        <>
                            <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                            <h2>Add Manpower</h2>
                            <form id='addManpowerForm'>
                                <label htmlFor="date">Date: <input type="date" id="date" name="date" max={today} required /></label>
                                <label htmlFor="indentId">Indent ID: <input type="text" id="indentId" name="indentId" required /></label>
                                <div id="addManpowerPopupProfileTable">
                                    <div className="tableTitle">Tick</div>
                                    <div className="tableTitle">Name</div>
                                    <div className="tableTitle">Emp ID</div>
                                    {profiles}
                                </div>
                            </form>
                            <button type="submit" form='addManpowerForm' className='hoverable'>Submit</button>
                        </>
                    }
                </>

            </div>
        </div>
    );
};
function close(reset) {
    document.getElementById('addManpowerForm').reset();
    console.log('closed');
    reset();
}
export default ManpowerPopup;