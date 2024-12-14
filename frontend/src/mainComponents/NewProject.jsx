import { useNavigate } from 'react-router-dom';
import { fetchDataWithParams } from '../assets/scripts';
import '../css/NewProject.css';
import { useState } from 'react';

function NewProject() {
    const [formData, setFormData] = useState({
        ProjectTitle: '',
        ProjectNo: 0,
        ProjectStartDate: '',
        ProjectEndDate: '',
        SanctionOrderNo: '',
        TotalSanctionamount: 0,
        PIname: '',
        CoPIs: '',
        ManpowerAllocationAmt: 0,
        ConsumablesAllocationAmt: 0,
        ContingencyAllocationAmt: 0,
        OverheadAllocationAmt: 0,
        EquipmentAllocationAmt: 0,
        TravelAllocationAmt: 0
    });
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        
        let res = await fetchDataWithParams('projects','put', formData);
        if(res.reqStatus=='success'){
            alert('Project Created Successfully');
            setFormData({});
            navigate('/');
        }
        else{
            alert('Failed to create project: '+res.message);
        }
    }
    return (
        <form id="newProjectDiv" onSubmit={(e) => handleSubmit(e)}>
            <label>
                Project Title:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" name="ProjectTitle" placeholder="Enter project title" required onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.ProjectTitle || ''} />

            <label>
                Project No:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="number" name="ProjectNo" placeholder="Enter project number" required min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.ProjectNo || ''} />

            <label>
                Project Start Date:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="date" name="ProjectStartDate" placeholder="Enter start date" required onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.ProjectStartDate || ''} max={formData.ProjectEndDate || ''} />

            <label>
                Project End Date:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="date" name="ProjectEndDate" placeholder="Enter end date" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.ProjectEndDate || ''} min={formData.ProjectStartDate || ''} />

            <label>
                Sanction Order No:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" name="SanctionOrderNo" placeholder="Enter sanction order number" required onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.SanctionOrderNo || ''} />

            <label>
                Total Sanction amount:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="number" name="TotalSanctionamount" placeholder="Enter total sanction amount" required min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.TotalSanctionamount || ''} />
            <label>
                Funded By:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" name="FundedBy" placeholder="Enter funding agency" required onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.FundedBy || ''} />
            <label>
                PI name:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" name="PIname" placeholder="Enter PI name" required onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.PIname || ''} />

            <label>
                CoPIs:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" name="CoPIs" placeholder="Enter CoPIs" required onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.CoPIs || ''} />

            <label>
                Overhead Amount:<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="number" name="OverheadAmount" placeholder="Enter overhead amount" required min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.OverheadAmount || ''} />
            
            <label>
                Manpower Allocation Amt:
            </label>
            <input type="number" name="ManpowerAllocationAmt" placeholder="Enter manpower allocation amount" min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.ManpowerAllocationAmt || ''} />

            <label>
                Consumables Allocation Amt:
            </label>
            <input type="number" name="ConsumablesAllocationAmt" placeholder="Enter consumables allocation amount" min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.ConsumablesAllocationAmt || ''} />

            <label>
                Contingency Allocation Amt:
            </label>
            <input type="number" name="ContingencyAllocationAmt" placeholder="Enter contingency allocation amount" min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.ContingencyAllocationAmt || ''} />

            <label>
                Overhead Allocation Amt:
            </label>
            <input type="number" name="OverheadAllocationAmt" placeholder="Enter overhead allocation amount" min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.OverheadAllocationAmt || ''} />

            <label>
                Equipment Allocation Amt:
            </label>
            <input type="number" name="EquipmentAllocationAmt" placeholder="Enter equipment allocation amount" min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.EquipmentAllocationAmt || ''} />

            <label>
                Travel Allocation Amt:
            </label>
            <input type="number" name="TravelAllocationAmt" placeholder="Enter travel allocation amount" min="0" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} value={formData.TravelAllocationAmt || ''} />
            <footer>
                <input type="submit" value="Create New Project" className='hoverable tableTitle' />
            </footer>
        </form>
    )
}

export default NewProject;