import React, { useContext, useEffect, useRef, useState } from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { fetchData, fetchDataWithParams } from '../../assets/scripts';
import { Oval } from 'react-loader-spinner';
import { closePopup } from '../../assets/popup';
import { ProjectContext } from '../../assets/ProjectData';

function ManpowerPopup({ reset, workers }) {
    const [profiles, setProfiles] = useState([]);
    const [filter, setFilter] = useState({ text: '' });
    const [loading, setLoading] = useState(true);
    const users = useRef({});
    const [totalAllocation, setTotalAllocation] = useState(0);
    const { project } = useContext(ProjectContext);
    
    useEffect(() => {
        async function getProfiles() {
            const data = await fetchDataWithParams('users', 'post', {filters: filter});
            if (data) {
                let l = [];
                let users1 = {};
                          
                data.users.map((profile, index) => {
                    if (profile.role === 'SuperAdmin'||profile.role === 'Pi') return;
                    if (workers.includes(JSON.stringify({id:profile.id, name:profile.name}))) return;
                    l.push(
                        <React.Fragment key={profile.id}>
                            <div style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                <input type="checkbox" value={JSON.stringify({id: profile.id, name: profile.name})} style={{height:'100%', width: '100%'}} className='tick' onChange={(e)=>handleChange(e)}/>
                                </div>
                            <div>{profile.id}</div>
                            <div>{profile.name}</div>
                            <div>{profile.role}</div>
                            <div>{profile.TotalSalary}</div>
                        </React.Fragment>
                    );
                    users1[profile.id] = profile;
                });
                console.log(users1);
                users.current = users1;
                setProfiles(l);
            }
            setLoading(false);
        }
        getProfiles();
    }, []);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('.tick');
        const selectedWorkers = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedWorkers.push(checkbox.value);
            }
        });
        let formData = new FormData(e.target);
        formData.append('workers', selectedWorkers);
        // let result = await fetchDataWithParams('manpower', 'put', formData);
        // if (result.reqStatus === 'success') {
        //     alert('Manpower added successfully');
        //     closePopup(e, reset);
        // } else {
        //     alert('Failed to add manpower');
        //     console.log(result.message);
        // }
        console.log(Object.fromEntries(formData));
        
    }
    
    useEffect(() => {
        if(!document.getElementById('totalAllocation'))return;
        document.getElementById('totalAllocation').value=parseFloat(document.getElementById('totalAllocation').value) + totalAllocation;
    }, [totalAllocation]);
        
    const handleChange = (e)=>{
        if (e.currentTarget.checked) {
            setTotalAllocation(users.current[JSON.parse(e.currentTarget.value).id].TotalSalary);
        }else{
            setTotalAllocation(-users.current[JSON.parse(e.currentTarget.value).id].TotalSalary);
        }
    }

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont" id='largePopupCont'>
                <>
                    {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                        <>
                            <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e, reset)} />
                            <h2>Add Manpower</h2>
                            <form className='largePopupForm' onSubmit={(e)=>handleSubmit(e)} id='manpowerForm' >
                                <div className='largePopupDetails' style={{ gridTemplateColumns: '1fr 2fr 1fr 2fr' }}>
                                    <label htmlFor="ProjectNo">Project No:</label>
                                    <input type="number" id="ProjectNo" name="ProjectNo" readOnly required value={project.ProjectNo} />

                                    <label htmlFor="ProjectTitle">Project Title:</label>
                                    <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly required value={project.ProjectTitle} />
                                    
                                    <label htmlFor="fromDate">From Date:</label>
                                    <input type="date" id="fromDate" name="fromDate" max={toDate} value={fromDate} onChange={(e) => setFromDate(e.currentTarget.value)} required />
                                    <label htmlFor="toDate">To Date:</label>
                                    <input type="date" id="toDate" name="toDate" min={fromDate} value={toDate} onChange={(e) => setToDate(e.currentTarget.value)} required />
                                    <label htmlFor="totalAllocation">Total Allocation:</label>
                                    <input type="number" id="totalAllocation"required readOnly defaultValue={0} />
                                </div>
                                <hr style={{ border: '1px solid black' }} />
                                <form className="largePopupDetails" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 2fr' }}>
                                    <label htmlFor="filterText">Filter by Name:</label>
                                    <input
                                        type="text"
                                        id="filterText"
                                        value={filter.text}
                                        onChange={(e) => setFilter({ ...filter, text: e.target.value })}
                                    />

                                    <label htmlFor="filterRole">Filter by Designation:</label>
                                    <select
                                        id="filterRole"
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
                            <button type="submit" className='hoverable' form='manpowerForm'>Submit</button>
                        </>
                    }
                </>

            </div>
        </div>
    );
};
export default ManpowerPopup;