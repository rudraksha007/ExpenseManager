import { useLocation, useNavigate } from 'react-router-dom';
import { fetchDataWithParams } from '../assets/scripts';
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
            let dum = null;        
            if (EditFormData.PIs) {
                dum = JSON.parse(EditFormData.PIs);
                selected.current.PIs = dum;
                formData.PIs = dum;
            }
            if (EditFormData.CoPIs) {
                dum = JSON.parse(EditFormData.CoPIs);
                selected.current.CoPIs = dum;
                formData.CoPIs = dum;
            }
            if (EditFormData.Workers) {
                dum = JSON.parse(EditFormData.Workers);
                selected.current.Workers = dum;
                formData.Workers = dum;
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
        let totalAllocated = 0;
        Object.keys(formData).forEach(key => {
            if (key.includes("AllocationAmt") && key !== allocationField) {
                totalAllocated += Number(formData[key]);
            }
        });
        return formData.TotalSanctionAmount - totalAllocated;
    };

    function getMin(allocationField) {        
        return EditFormData? EditFormData[allocationField] - remaining[allocationField]:0;
    }

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

                <label>
                    Total Sanction Amount:<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="number"
                    name="TotalSanctionAmount"
                    placeholder="Enter total sanction amount"
                    required
                    min="0"
                    step="0.01"
                    onChange={handleChange}
                    value={formData.TotalSanctionAmount || ''}
                />

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

                <label>
                    Manpower Allocation Amt:
                </label>
                <input
                    type="number"
                    name="ManpowerAllocationAmt"
                    placeholder="Enter manpower allocation amount"
                    min={getMin('ManpowerAllocationAmt')}
                    step="0.01"
                    onChange={handleChange}
                    value={formData.ManpowerAllocationAmt || 0}
                    max={getMax('ManpowerAllocationAmt')}
                />

                <label>
                    Consumables Allocation Amt:
                </label>
                <input
                    type="number"
                    name="ConsumablesAllocationAmt"
                    placeholder="Enter consumables allocation amount"
                    min={getMin('ConsumablesAllocationAmt')}
                    step="0.01"
                    onChange={handleChange}
                    value={formData.ConsumablesAllocationAmt || 0}
                    max={getMax('ConsumablesAllocationAmt')}
                />

                <label>
                    Contingency Allocation Amt:
                </label>
                <input
                    type="number"
                    name="ContingencyAllocationAmt"
                    placeholder="Enter contingency allocation amount"
                    min={getMin('ContingencyAllocationAmt')}
                    step="0.01"
                    onChange={handleChange}
                    value={formData.ContingencyAllocationAmt || 0}
                    max={getMax('ContingencyAllocationAmt')}
                />

                <label>
                    Overhead Allocation Amt:
                </label>
                <input
                    type="number"
                    name="OverheadAllocationAmt"
                    placeholder="Enter overhead allocation amount"
                    min={getMin('OverheadAllocationAmt')}
                    step="0.01"
                    onChange={handleChange}
                    value={formData.OverheadAllocationAmt || 0}
                    max={getMax('OverheadAllocationAmt')}
                />

                <label>
                    Equipment Allocation Amt:
                </label>
                <input
                    type="number"
                    name="EquipmentAllocationAmt"
                    placeholder="Enter equipment allocation amount"
                    min={getMin('EquipmentAllocationAmt')}
                    step="0.01"
                    onChange={handleChange}
                    value={formData.EquipmentAllocationAmt || 0}
                    max={getMax('EquipmentAllocationAmt')}
                />

                <label>
                    Travel Allocation Amt:
                </label>
                <input
                    type="number"
                    name="TravelAllocationAmt"
                    placeholder="Enter travel allocation amount"
                    min={getMin('TravelAllocationAmt')}
                    step="0.01"
                    onChange={handleChange}
                    value={formData.TravelAllocationAmt || 0}
                    max={getMax('TravelAllocationAmt')}
                />

                <footer>
                    <input type="submit" value={EditFormData ? "Save Changes" : "Create New Project"} className="hoverable tableTitle" />
                </footer>
            </form>
        </>
    );
}

export default NewProject;
