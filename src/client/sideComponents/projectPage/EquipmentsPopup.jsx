import React, { useContext, useRef, useState } from 'react';
import '../../css/Popup.css';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { closePopup } from '../../assets/popup';
import { fetchDataWithFileUpload } from '../../assets/scripts';
import { ProjectContext } from '../../assets/ProjectData';
import { Oval } from 'react-loader-spinner';
import { ProfileContext } from '../../assets/UserProfile';

function EquipmentsPopup({ reset }) {
    const { ProjectNo, ProjectTitle } = (useContext(ProjectContext)).project;
    const { id, name } = useContext(ProfileContext).profile;
    const today = new Date().toISOString().split('T')[0];
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [equipments, setEquipments] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        setLoading(true);
        
        
        
        const res = await fetchDataWithFileUpload('equipment', 'put', e.currentTarget, { Items: JSON.stringify(Object.values(equipments)) });
        if (res.reqStatus === 'success') {
            alert('Equipment Added Successfully');
            reset();
        } else {
            alert('Failed: ' + res.message);
        }
        setLoading(false);
    };

    function handlePriceChange(e) {
        const equipmentInputs = document.querySelectorAll('#equipmentsTable input[type="number"]');
        let newTotal = 0;
        equipmentInputs.forEach(input => {
            newTotal += parseFloat(input.value) || 0;
        });
        setTotal(newTotal);
    }
    const removeEquipment = (id) => {
        setEquipments((prevEquipments) => {
            const updatedEquipments = { ...prevEquipments };
            delete updatedEquipments[id];
            return updatedEquipments;
        });
    };

    function handleChange (id, field, value){
        setEquipments({...equipments, [id]:{...equipments[id], [field]:value}});
    }

    const addEquipment = () => {
        
        setEquipments((prevEquipments) => {
            let date = new Date().getTime();
            return {...prevEquipments, [date]: {name: '', description: '', installation: '', warranty: '', price: 0 } };
        });
    };

    return (
        <div className='projectPopup'>
            <div className="projectPopupCont" id='largePopupCont'>
                {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                    <>
                        <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e, reset)} />
                        <h2>Add Equipment</h2>
                        <form className='largePopupForm' id='addEquipmentForm' onSubmit={(e) => handleSubmit(e)}>
                            <div className='largePopupDetails' style={{ gridTemplateColumns: '1fr 2fr 1fr 2fr' }}>
                                <label htmlFor="RequestedDate">Date:</label>
                                <input type="date" id="RequestedDate" name="RequestedDate" max={today} required />

                                <label htmlFor="ProjectNo">Project No:</label>
                                <input type="number" id="ProjectNo" name="ProjectNo" readOnly value={ProjectNo} />

                                <label htmlFor="ProjectTitle">Project Title:</label>
                                <input type="text" id="ProjectTitle" name="ProjectTitle" readOnly value={ProjectTitle} />

                                <label htmlFor="EmployeeID">Employee ID:</label>
                                <input type="number" id="EmployeeID" name="EmployeeID" required readOnly value={id} />

                                <label htmlFor="EmployeeName">Employee Name:</label>
                                <input type="text" id="EmployeeName" name="EmployeeName" required readOnly value={name} />

                                <label htmlFor="Reason">Reason:</label>
                                <input type="text" id="Reason" name="Reason" required />

                                <label htmlFor="Remarks">Remarks:</label>
                                <textarea id="Remarks" name="Remarks" rows="4" />

                                <label htmlFor="BillCopy">Bill Copy (PDF):</label>
                                <input type="file" id="BillCopy" name="BillCopy" accept="application/pdf" required multiple />

                                <label htmlFor="TotalAmount">Total Amount:</label>
                                <input type="number" id="TotalAmount" name="RequestedAmt" readOnly value={total} />
                            </div>
                            <div className='table largePopupDetails' style={{ gridTemplateColumns: '1fr 3fr 5fr 3fr 3fr 2fr 1fr', gap: '2px' }} id='equipmentsTable'>
                                <div className="tableTitle">Sl.</div>
                                <div className="tableTitle">Equipment</div>
                                <div className="tableTitle">Description</div>
                                <div className="tableTitle">Installation</div>
                                <div className="tableTitle">Warranty</div>
                                <div className="tableTitle">Price</div>
                                <div className="tableTitle">-</div>
                                {
                                    Object.keys(equipments).map((equipment, index) => (
                                        <React.Fragment key={equipment}>
                                            <div>{index+1}</div>
                                            <input type="text" onChange={(e)=>handleChange(equipment, 'name', e.target.value)} />
                                            <input type="text" onChange={(e)=>handleChange(equipment, 'description', e.target.value)}/>
                                            <input type="date" onChange={(e)=>handleChange(equipment, 'installation', e.target.value)}/>
                                            <input type="text" onChange={(e)=>handleChange(equipment, 'warranty', e.target.value)}/>
                                            <input type="number"min={0} onChange={(e) => { handleChange(equipment, 'price', e.target.value);handlePriceChange(e) }}
                                            />
                                            <div className='hoverable' style={{ textAlign: 'center', alignContent: 'center' }} onClick={() => { removeEquipment(equipment) }}><FaTimes /></div>
                                        </React.Fragment>
                                    ))}
                                <div className='hoverable' onClick={(e) => addEquipment(e)}><FaPlus /></div>
                            </div>
                        </form>
                        <button type="submit" form='addEquipmentForm' className='hoverable'>Submit</button>
                    </>
                }
            </div>
        </div>
    );
};

export default EquipmentsPopup;
