import { useLocation, useNavigate } from 'react-router-dom';
import { fetchData, fetchDataWithParams } from '../assets/scripts';
import '../css/NewProject.css';
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

function NewProject() {
    const [popup, setPopup] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { EditFormData } = location.state || {};
    const [remaining, setRemaining] = useState({});
    const [formData, setFormData] = useState(EditFormData ? 
        { ...EditFormData, ProjectStartDate: EditFormData.ProjectStartDate.split('T')[0], 
            ProjectEndDate: EditFormData.ProjectEndDate.split('T')[0] } : {
        ProjectTitle: '',
        ProjectNo: '',
        ProjectStartDate: '',
        ProjectEndDate: '',
        SanctionOrderNo: '',
        TotalSanctionAmount: 0,
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
    const selected = useRef({ PIs: [], CoPIs: [], Workers: [] });
    const [users, setUsers] = useState([]);
    useEffect(() => {
        async function setData() {
            if (EditFormData) {
                const data = (await fetchDataWithParams('editProject', 'post', { ProjectNo: formData.ProjectNo }));
                const { RemainingManpowerAmt, RemainingConsumablesAmt,
                    RemainingContingencyAmt, RemainingOverheadAmt,
                    RemainingEquipmentAmt, RemainingTravelAmt } = data.data;
                    ;
                
                
                setRemaining({
                    ManpowerAllocationAmt: RemainingManpowerAmt,
                    ConsumablesAllocationAmt: RemainingConsumablesAmt,
                    ContingencyAllocationAmt: RemainingContingencyAmt,
                    OverheadAllocationAmt: RemainingOverheadAmt,
                    EquipmentAllocationAmt: RemainingEquipmentAmt,
                    TravelAllocationAmt: RemainingTravelAmt,
                });
            }
        }
        setData();
        if(EditFormData){
            if (EditFormData.PIs) {
                selected.current.PIs = EditFormData.PIs;
                formData.PIs = EditFormData.PIs;
            }
            if (EditFormData.CoPIs) {
                selected.current.CoPIs = EditFormData.CoPIs;
                formData.CoPIs = EditFormData.CoPIs;
            }
            if (EditFormData.Workers) {
                selected.current.Workers = EditFormData.Workers;
                formData.Workers = EditFormData.Workers;
            }
        }
        fetchDataWithParams('users', 'post', { filters: {} }).then(data => {
            setUsers(data.users);
        });
    }, []);

    useEffect(() => {
        setFormData({ ...formData, PIs: selected.current.PIs, CoPIs: selected.current.CoPIs, Workers: selected.current.Workers });
    }, [popup]);


    async function setPopupContent(type) {
        const isWorker = type === 'Worker';
        const filteredUsers = isWorker ? users.filter(profile => profile.id !== 0 && profile.role !== 'Pi') : users.filter(profile => profile.role === 'Pi');

        setPopup(
            <div className='projectPopup'>
                <form className="projectPopupCont" id="largePopupCont">
                    <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => { setPopup(null); }} />
                    <h2>Select {type}</h2>
                    <div className='table' style={{ gridTemplateColumns: '1fr 3fr 6fr 3fr 3fr' }}>
                        <div className="tableTitle">Tick</div>
                        <div className="tableTitle">Employee ID</div>
                        <div className="tableTitle">Name</div>
                        <div className="tableTitle">Designation</div>
                        <div className="tableTitle">Salary</div>
                        {filteredUsers.map((profile) => {
                            if (!isWorker && ((type === 'PI' && formData.CoPIs.includes(JSON.stringify({ id: profile.id, name: profile.name }))) || (type === 'CoPI' && formData.PIs.includes(JSON.stringify({ id: profile.id, name: profile.name }))))) return null;
                            return (
                                <React.Fragment key={profile.id}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            value={JSON.stringify({ id: profile.id, name: profile.name })}
                                            defaultChecked={type === 'PI' ? selected.current.PIs.includes(JSON.stringify({ id: profile.id, name: profile.name })) :
                                                type === 'CoPI' ? selected.current.CoPIs.includes(JSON.stringify({ id: profile.id, name: profile.name })) :
                                                    selected.current.Workers?.includes(JSON.stringify({ id: profile.id, name: profile.name }))}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    selected.current = type === 'PI'
                                                        ? { ...selected.current, PIs: [...selected.current.PIs, e.target.value] }
                                                        : type === 'CoPI'
                                                            ? { ...selected.current, CoPIs: [...selected.current.CoPIs, e.target.value] }
                                                            : { ...selected.current, Workers: [...selected.current.Workers, e.target.value] };
                                                } else {
                                                    selected.current = type === 'PI'
                                                        ? { ...selected.current, PIs: selected.current.PIs.filter(id => id !== e.target.value) }
                                                        : type === 'CoPI'
                                                            ? { ...selected.current, CoPIs: selected.current.CoPIs.filter(id => id !== e.target.value) }
                                                            : { ...selected.current, Workers: selected.current.Workers.filter(id => id !== e.target.value) };
                                                }
                                            }}
                                            style={{ height: '100%', width: '100%' }}
                                        />
                                    </div>
                                    <div>{profile.id}</div>
                                    <div>{profile.name}</div>
                                    <div>{profile.role}</div>
                                    <div>{profile.TotalSalary}</div>
                                </React.Fragment>
                            );
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
        return formData.TotalSanctionAmount - totalAllocated;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        if (formData.PIs.length === 0 || formData.Workers.length === 0) {
            alert('Please select at least one PI and Worker');
            return;
        }
        let res = null;
        if (EditFormData) {
            res = await fetchDataWithParams('editProject', 'put', formData);
            console.log(formData);

        } else {
            res = await fetchDataWithParams('projects', 'put', formData);
        }
        if (res.reqStatus === 'success') {
            alert(`Project ${EditFormData ? 'Saved' : 'Created'} Successfully`);
            setFormData({});
            navigate(EditFormData ? `/projects/${encodeURIComponent(formData.ProjectNo)}` : '/');
        } else {
            alert('Failed to create project: ' + res.message);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                <label>
                    Project Title:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="ProjectTitle"
                    placeholder="Enter project title"
                    required
                    readOnly={EditFormData ? true : false}
                    onChange={handleChange}
                    value={formData.ProjectTitle || ''}
                />

                {/* Project No */}
                <label>
                    Project No:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="ProjectNo"
                    placeholder="Enter project number"
                    required
                    readOnly={EditFormData ? true : false}
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
                    name="TotalSanctionAmount"
                    placeholder="Enter total sanction amount"
                    required
                    min="0"
                    onChange={handleChange}
                    value={formData.TotalSanctionAmount || ''}
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
                    onClick={() => setPopupContent('PI')}
                />
                <label>
                    CoPIs:
                </label>
                <input
                    type="text"
                    placeholder={`${formData.CoPIs.length} CoPI(s) selected`}
                    className='hoverable'
                    readOnly
                    onClick={() => setPopupContent('CoPI')}
                />
                <label>
                    Workers:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    placeholder={`${formData.Workers?.length || 0} Worker(s) selected`}
                    className='hoverable'
                    readOnly
                    onClick={() => setPopupContent('Worker')}
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
                            min={formData[field] - remaining[field]}
                            onChange={handleChange}
                            value={formData[field] || 0}
                            max={getMax(field)} // Dynamically adjust max for each field
                        />
                    </React.Fragment>
                ))}

                <footer>
                    <input type="submit" value={EditFormData ? "Save Changes" : "Create New Project"} className="hoverable tableTitle" />
                </footer>
            </form>
        </>
    );
}

export default NewProject;
