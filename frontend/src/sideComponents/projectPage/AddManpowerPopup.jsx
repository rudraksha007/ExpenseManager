import React, { useContext, useEffect, useState } from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { fetchData, fetchDataWithParams } from '../../assets/scripts';
import { Oval } from 'react-loader-spinner';
import { closePopup } from '../../assets/popup';
import { ProjectContext } from '../../assets/ProjectData';

function ManpowerPopup({ reset }) {
    const [profiles, setProfiles] = useState([]);
    const [filter, setFilter] = useState({ text: '', role: ''});
    const [loading, setLoading] = useState(true);
    const [ind, setInd] = useState('Dummy Indent');
    const {project} = useContext(ProjectContext);
    useEffect(() => {
        async function getProfiles() {
            // const data = await fetchDataWithParams('profiles', {projectId: project.id, action: add});
            const data = await fetchDataWithParams('profiles', 'post', filter);
            if (data) {
                let l = [];
                data.profiles.map((profile, index) => (
                    l.push(
                        <React.Fragment key={profile.id}>
                            <div><input type="checkbox" value={profile.id} /></div>
                            <div>{profile.name}</div>
                            <div>{profile.id}</div>
                        </React.Fragment>
                    )
                ));
                setInd('IND-Dummy');
                setProfiles(l);
            }
            setLoading(false);
        }
        getProfiles();
    }, []);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont" id='largePopupCont'>
                <>
                    {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                        <>
                            <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e,reset)} />
                            <h2>Add Manpower</h2>
                            <form className='largePopupForm' >
                                <div className='largePopupDetails' style={{gridTemplateColumns: '1fr 2fr 1fr 2fr'}}>
                                    <label htmlFor="ProjectNo">Project No:</label>
                                    <input type="number" id="ProjectNo" name="ProjectNo" readOnly value={project.ProjectNo} />

                                    <label htmlFor="ProjectTitle">Project Title:</label>
                                    <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly value={project.ProjectTitle} />
                                    <label htmlFor="indentId">Indent ID:</label>
                                    <input type="text" id="indentId" name="indentId" readOnly value={ind} />
                                    <label htmlFor="fromDate">From Date:</label>
                                    <input type="date" id="fromDate" name="fromDate" max={toDate} value={fromDate} onChange={(e)=>setFromDate(e.currentTarget.value)} required/>
                                    <label htmlFor="toDate">To Date:</label>
                                    <input type="date" id="toDate" name="toDate" min={fromDate} value={toDate} onChange={(e)=>setToDate(e.currentTarget.value)} required />
                                </div>
                                <hr style={{border: '1px solid black'}}/>
                                <form className="largePopupDetails" style={{display:'grid', gridTemplateColumns: '1fr 2fr 1fr 2fr'}}>
                                    <label htmlFor="filterText">Filter by Name:</label>
                                    <input 
                                        type="text" 
                                        id="filterText" 
                                        name="filterText" 
                                        value={filter.text} 
                                        onChange={(e) => setFilter({ ...filter, text: e.target.value })} 
                                    />

                                    <label htmlFor="filterRole">Filter by Designation:</label>
                                    <select 
                                        id="filterRole" 
                                        name="filterRole" 
                                        value={filter.role} 
                                        onChange={(e) => setFilter({ ...filter, role: e.target.value })} 
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="Engineer">Engineer</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Technician">Technician</option>
                                    </select>
                                </form>
                                <div className='table' style={{ gridTemplateColumns: '1fr 3fr 6fr 3fr 3fr' }}>
                                    <div className="tableTitle">Tick</div>
                                    <div className="tableTitle">Employee ID</div>
                                    <div className="tableTitle">Name</div>
                                    <div className="tableTitle">Designation</div>
                                    <div className="tableTitle">Salary</div>
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
export default ManpowerPopup;