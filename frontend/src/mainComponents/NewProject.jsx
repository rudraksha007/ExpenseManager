import { useNavigate } from 'react-router-dom';
import { fetchDataWithParams } from '../assets/scripts';
import '../css/NewProject.css';
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

function NewProject() {
    const [popup, setPopup] = useState(null);
    const [formData, setFormData] = useState({
        ProjectTitle: '',
        ProjectNo: 0,
        ProjectStartDate: '',
        ProjectEndDate: '',
        SanctionOrderNo: '',
        TotalSanctionamount: 0,
        FundedBy: '',
        PIs: [],
        CoPIs: [],
        ManpowerAllocationAmt: 0,
        ConsumablesAllocationAmt: 0,
        ContingencyAllocationAmt: 0,
        OverheadAllocationAmt: 0,
        EquipmentAllocationAmt: 0,
        TravelAllocationAmt: 0
    });
    const selected = useRef({ PIs: [], CoPIs: [] });
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchDataWithParams('users', 'post', { filters: { role: 'Pi' } }).then(data => {
            setUsers(data.users);
        });
    }, []);

    useEffect(() => {
        setFormData({...formData, PIs: selected.current.PIs, CoPIs: selected.current.CoPIs});
    }, [popup]);
        

    async function setPI() {
        setPopup(
            <div className='projectPopup'>
                <form className="projectPopupCont" id="largePopupCont">
                    <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => { setPopup(null); }} />
                    <h2>Select PI</h2>
                    <div className='table' style={{ gridTemplateColumns: '1fr 3fr 6fr 3fr 3fr' }}>
                        <div className="tableTitle">Tick</div>
                        <div className="tableTitle">Employee ID</div>
                        <div className="tableTitle">Name</div>
                        <div className="tableTitle">Designation</div>
                        <div className="tableTitle">Salary</div>
                        {users.map((profile, index) => {
                            if (formData.CoPIs.includes(profile.id)) return;
                            return (
                                <React.Fragment key={profile.id}>
                                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <input
                                            type="checkbox"
                                            value={JSON.stringify({id:profile.id, name: profile.name})}
                                            defaultChecked={selected.current.PIs.includes(profile.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    selected.current = {CoPIs: selected.current.CoPIs, PIs: [...selected.current.PIs, e.target.value]};
                                                } else {
                                                    selected.current = {CoPIs: selected.current.CoPIs, PIs: selected.current.PIs.filter(id => id !== e.target.value)};
                                                }
                                            }}
                                            style={{height: '100%', width: '100%'}}
                                        />
                                    </div>
                                    <div>{profile.id}</div>
                                    <div>{profile.name}</div>
                                    <div>{profile.role}</div>
                                    <div>{profile.salary}</div>
                                </React.Fragment>);
                        })}
                    </div>
                </form>
            </div>
        );
    }

    async function setCoPI() {
        setPopup(
            <div className='projectPopup'>
                <form className="projectPopupCont" id="largePopupCont">
                    <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => { setPopup(null); }} />
                    <h2>Select CoPI</h2>
                    <div className='table' style={{ gridTemplateColumns: '1fr 3fr 6fr 3fr 3fr' }}>
                        <div className="tableTitle">Tick</div>
                        <div className="tableTitle">Employee ID</div>
                        <div className="tableTitle">Name</div>
                        <div className="tableTitle">Designation</div>
                        <div className="tableTitle">Salary</div>
                        {users.map((profile, index) => {
                            if (formData.PIs.includes(profile.id)) return;
                            return (
                                <React.Fragment key={profile.id}>
                                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <input
                                            type="checkbox"
                                            value={JSON.stringify({id:profile.id, name: profile.name})}
                                            defaultChecked={selected.current.CoPIs.includes(profile.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    selected.current = {PIs: selected.current.PIs, CoPIs: [...selected.current.CoPIs, e.target.value]};
                                                } else {
                                                    selected.current = {PIs: selected.current.PIs, CoPIs: selected.current.CoPIs.filter(id => id !== e.target.value)};
                                                }
                                            }}
                                            style={{height: '100%', width: '100%'}}
                                        />
                                    </div>
                                    <div>{profile.id}</div>
                                    <div>{profile.name}</div>
                                    <div>{profile.designation}</div>
                                    <div>{profile.salary}</div>
                                </React.Fragment>);
                        })}
                    </div>
                </form>
            </div>
        );
    }
    // Function to calculate the remaining budget (max value for each allocation input)
    const getMax = (allocationField) => {
        // Calculate the total allocated amount excluding the one field being edited
        const totalAllocated = Object.keys(formData).reduce((sum, key) => {
            // Sum all allocation amounts except the one currently being modified
            if (key.includes("AllocationAmt") && key !== allocationField) {
                sum += Number(formData[key]);
            }
            return sum;
        }, 0);

        // The remaining available amount for the allocation field
        return formData.TotalSanctionamount - totalAllocated;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        console.log(formData);

        let res = await fetchDataWithParams('projects', 'put', formData);
        if (res.reqStatus === 'success') {
            alert('Project Created Successfully');
            setFormData({});
            navigate('/');
        } else {
            alert('Failed to create project: ' + res.message);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        console.log('ran');

        if (e.target.name.includes("AllocationAmt")) {
            if (Number(e.target.value) > getMax(e.target.name)) {
                console.log('invalid');

                e.currentTarget.setCustomValidity(`Allocation amount exceeds the remaining budget`);
            } else {
                e.currentTarget.setCustomValidity('');
            }
        }
    };

    return (
        <>
            <form id="newProjectDiv" onSubmit={handleSubmit}>
                {popup}
                {/* Project Title */}
                <label>
                    Project Title:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="ProjectTitle"
                    placeholder="Enter project title"
                    required
                    onChange={handleChange}
                    value={formData.ProjectTitle || ''}
                />

                {/* Project No */}
                <label>
                    Project No:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="number"
                    name="ProjectNo"
                    placeholder="Enter project number"
                    required
                    min="0"
                    onChange={handleChange}
                    value={formData.ProjectNo || ''}
                />

                {/* Project Start Date */}
                <label>
                    Project Start Date:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="date"
                    name="ProjectStartDate"
                    placeholder="Enter start date"
                    required
                    onChange={handleChange}
                    value={formData.ProjectStartDate || ''}
                    max={formData.ProjectEndDate || ''}
                />

                {/* Project End Date */}
                <label>
                    Project End Date:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="date"
                    name="ProjectEndDate"
                    placeholder="Enter end date"
                    required
                    onChange={handleChange}
                    value={formData.ProjectEndDate || ''}
                    min={formData.ProjectStartDate || ''}
                />

                {/* Sanction Order No */}
                <label>
                    Sanction Order No:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="SanctionOrderNo"
                    placeholder="Enter sanction order number"
                    required
                    onChange={handleChange}
                    value={formData.SanctionOrderNo || ''}
                />

                {/* Total Sanction Amount */}
                <label>
                    Total Sanction Amount:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="number"
                    name="TotalSanctionamount"
                    placeholder="Enter total sanction amount"
                    required
                    min="0"
                    onChange={handleChange}
                    value={formData.TotalSanctionamount || ''}
                />

                {/* Funded By */}
                <label>
                    Funded By:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="FundedBy"
                    placeholder="Enter funding agency"
                    required
                    onChange={handleChange}
                    value={formData.FundedBy || ''}
                />

                <label>
                    PIs:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    placeholder={`${formData.PIs.length} PI(s) selected`}
                    className='hoverable'
                    readOnly
                    onClick={() => setPI()}
                />
                <label>
                    CoPIs:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    placeholder={`${formData.CoPIs.length} CoPI(s) selected`}
                    className='hoverable'
                    readOnly
                    onClick={() => setCoPI()}
                />

                {/* Allocation Amounts */}
                {[
                    'ManpowerAllocationAmt',
                    'ConsumablesAllocationAmt',
                    'ContingencyAllocationAmt',
                    'OverheadAllocationAmt',
                    'EquipmentAllocationAmt',
                    'TravelAllocationAmt',
                ].map((field) => (
                    <React.Fragment key={field}>
                        <label>
                            {field.replace(/([A-Z])/g, ' $1')}:
                        </label>
                        <input
                            type="number"
                            name={field}
                            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                            min="0"
                            onChange={handleChange}
                            value={formData[field] || 0}
                            max={getMax(field)} // Dynamically adjust max for each field
                        />
                    </React.Fragment>
                ))}

                <footer>
                    <input type="submit" value="Create New Project" className="hoverable tableTitle" />
                </footer>
            </form>
        </>
    );
}

export default NewProject;
