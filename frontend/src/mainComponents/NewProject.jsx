import { useNavigate } from 'react-router-dom';
import { fetchDataWithParams } from '../assets/scripts';
import '../css/NewProject.css';
import React, { useState } from 'react';

function NewProject() {
    const [formData, setFormData] = useState({
        ProjectTitle: '',
        ProjectNo: 0,
        ProjectStartDate: '',
        ProjectEndDate: '',
        SanctionOrderNo: '',
        TotalSanctionamount: 0,
        FundedBy: '',
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
            }else{
                e.currentTarget.setCustomValidity('');
            }
        }
    };

    return (
        <form id="newProjectDiv" onSubmit={handleSubmit}>
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

            {/* PI Name */}
            <label>
                PI Name:<span style={{ color: 'red' }}>*</span>
            </label>
            <input
                type="text"
                name="PIname"
                placeholder="Enter PI name"
                required
                onChange={handleChange}
                value={formData.PIname || ''}
            />

            {/* CoPIs */}
            <label>
                CoPIs:<span style={{ color: 'red' }}>*</span>
            </label>
            <input
                type="text"
                name="CoPIs"
                placeholder="Enter CoPIs"
                required
                onChange={handleChange}
                value={formData.CoPIs || ''}
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
    );
}

export default NewProject;
