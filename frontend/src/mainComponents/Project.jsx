import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Project.css';
import { FaPlus, FaEdit } from 'react-icons/fa';
import AddManpowerPopup from '../sideComponents/projectPage/AddManpowerPopup';
import TravelsPopup from '../sideComponents/projectPage/TravelsPopup';
import ConsumablesPopup from '../sideComponents/projectPage/ConsumablesPopup';
import EquipmentsPopup from '../sideComponents/projectPage/EquipmentsPopup';
import ContingencyPopup from '../sideComponents/projectPage/Contingency';
import { fetchData } from '../assets/scripts';
import { Oval } from 'react-loader-spinner';
import DecManpowerPopup from '../sideComponents/projectPage/DecManpowerPopup';
import PDFPopup from '../sideComponents/PDFPopup';
import EditProject from '../sideComponents/projectPage/EditProject';
import { ProjectContext, ProjectProvider } from '../assets/ProjectData';

function ProjectContent() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Consumables');
    const [table, setTable] = useState([]);
    const { project, setProject } = useContext(ProjectContext);
    const [popup, setPopup] = useState(null);
    const [loading, setLoading] = useState(true);
    const tabNames = ['Consumables', 'Contingency', 'Travels', 'Equipments', 'Manpower'];
    const fillData = async () => {
        setLoading(true);
        let response = await fetchData(`projects/${id}`, 'post');
        if (response.reqStatus != 'success') { alert('Error: ' + response.message); setLoading(false); return; }
        console.log(response.data);

        setTable(compileDate(response.data, setPopup));
        setProject(response.data);
        document.title = `Project: ${response.data.ProjectTitle}`;
        setLoading(false);
    }
    useEffect(() => {
        if (popup) return;
        fillData();
        setActiveTab('Consumables');
    }, [popup]);

    useEffect(() => {
        const tabContentElements = document.querySelectorAll('.projectTabContentData');
        if (document.querySelector('#projectTabsActive')) {
            document.querySelector('#projectTabsActive').id = '';
            document.querySelector('#projectTabs').children[tabNames.indexOf(activeTab)].id = 'projectTabsActive';
        }
        tabContentElements.forEach((element) => {
            element.style.transform = `translateX(${-tabNames.indexOf(activeTab) * 100}%)`;
        });
    }, [activeTab]);
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='projectMainDiv'>
                    {popup}
                    <h1>Project Details <FaEdit size={40} className='hoverable' title='Edit' style={{ position: 'absolute', right: 20 }} onClick={() => navigate('/newproject', {
                        state: {
                            EditFormData: project
                        }
                    })} /></h1>

                    <div id="projectDetails">
                        <div><b>Funded By:</b> <span>{project.FundedBy}</span></div>
                        <div><b>Project Id:</b> <span>{id}</span></div>
                        <div><b>Title:</b> <span>{project.ProjectTitle}</span></div>
                        <div><b>Sanction Order No:</b> <span>{project.SanctionOrderNo}</span></div>
                        <div><b>Total Sanction Amount:</b> <span>₹{project.TotalSanctionAmount}</span></div>
                        <div><b>Project Start Date:</b> <span>{new Date(project.ProjectStartDate).toLocaleDateString()}</span></div>
                        <div><b>Project End Date:</b> <span>{new Date(project.ProjectEndDate).toLocaleDateString()}</span></div>
                        <div><b>PI Name:</b> <span>{project.PIs}</span></div>
                        <div><b>Co-PIs:</b> <span>{project.CoPIs}</span></div>
                        <div><b>Manpower Allocation Amt:</b> <span>₹{project.ManpowerAllocationAmt}</span></div>
                        <div><b>Consumables Allocation Amt:</b> <span>₹{project.ConsumablesAllocationAmt}</span></div>
                        <div><b>Contingency Allocation Amt:</b> <span>₹{project.ContingencyAllocationAmt}</span></div>
                        <div><b>Overhead Allocation Amt:</b> <span>₹{project.OverheadAllocationAmt}</span></div>
                        <div><b>Equipment Allocation Amt:</b> <span>₹{project.EquipmentAllocationAmt}</span></div>
                        <div><b>Travel Allocation Amt:</b> <span>₹{project.TravelAllocationAmt}</span></div>
                    </div>
                    <div id="projectTabs" style={{ color: 'white' }}>
                        <div className="hoverable" id='projectTabsActive' onClick={() => setActiveTab('Consumables')}><b>Consumables</b></div>
                        <div className="hoverable" onClick={() => setActiveTab('Contingency')}><b>Contingency</b></div>
                        <div className="hoverable" onClick={() => setActiveTab('Travels')}><b>Travels</b></div>
                        <div className="hoverable" onClick={() => setActiveTab('Equipments')}><b>Equipments</b></div>
                        <div className="hoverable" onClick={() => setActiveTab('Manpower')}><b>Manpower</b></div>
                    </div>
                    <div id="projectTabContent">
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 4fr 3fr 2fr 4fr 2fr" }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Date</span>
                            <span className="tableTitle">Purpose</span>
                            <span className="tableTitle">Bill</span>
                            {table[0]}
                            <div className="add hoverable" onClick={() => setPopup(<ConsumablesPopup reset={() => setPopup(null)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 4fr 3fr 2fr 4fr 2fr" }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Date</span>
                            <span className="tableTitle">Purpose</span>
                            <span className="tableTitle">Bill</span>
                            {table[1]}
                            <div className="add hoverable" onClick={() => setPopup(<ContingencyPopup reset={() => setPopup(null)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 3fr 3fr 4fr 4fr 3fr 2fr" }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Source (Date)</span>
                            <span className="tableTitle">Destination (Date)</span>
                            <span className="tableTitle">Purpose</span>
                            <span className="tableTitle">Bill</span>
                            {table[2]}
                            <div className="add hoverable" onClick={() => setPopup(<TravelsPopup reset={() => setPopup(null)} />)} ><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 4fr 3fr 2fr 3fr 1fr" }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Date</span>
                            <span className="tableTitle">Purpose</span>
                            <span className="tableTitle">Bill</span>
                            {table[3]}
                            <div className="add hoverable" onClick={() => setPopup(<EquipmentsPopup reset={() => setPopup(null)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 4fr 3fr 2fr 2fr 2fr" }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">From Date</span>
                            <span className="tableTitle">To Date</span>
                            <span className="tableTitle">Total</span>
                            {table[4]}
                            <div className='hoverable inherit' onClick={() => setPopup(<AddManpowerPopup reset={() => setPopup(null)} workers={project.Workers} />)}><FaPlus size={20} /></div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}


function compileDate(response, setPopup) {
    let arr = [];

    let tempArray = [];
    if (response.consumables) {
        Object.keys(response.consumables).forEach((key, index) => {
            console.log(response.consumables[key].IndentStatus);

            tempArray.push([
                <div key={`${key}-sl`}>{index + 1}</div>,
                <div key={`${key}-employeeId`}>{response.consumables[key].EmployeeID}</div>,
                <div key={`${key}-indentId`}>{response.consumables[key].IndentID}</div>,
                <div key={`${key}-date`}>{response.consumables[key].RequestedDate.split('T')[0]}</div>,
                <div key={`${key}-reason`}>{response.consumables[key].Reason}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.consumables[key].BillCopy} />)}>₹{response.consumables[key].RequestedAmt}</div>
            ])
        });
    }
    arr.push(tempArray);

    tempArray = [];
    if (response.contingency) {
        Object.keys(response.contingency).forEach((key) => (
            tempArray.push([
                <div key={`${key}-sl`}>{key + 1}</div>,
                <div key={`${key}-employeeId`}>{response.contingency[key].EmployeeID}</div>,
                <div key={`${key}-indentId`}>{response.contingency[key].IndentID}</div>,
                <div key={`${key}-date`}>{response.contingency[key].RequestedDate.split('T')[0]}</div>,
                <div key={`${key}-reason`}>{response.contingency[key].Reason}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.contingency[key].BillCopy} />)}>₹{response.contingency[key].RequestedAmt}</div>
            ])
        ));
    }
    arr.push(tempArray);

    tempArray = []
    if (response.travel) {
        Object.keys(response.travel).forEach((key) => (
            tempArray.push([
                <div key={`${key}-sl`}>{key + 1}</div>,
                <div key={`${key}-employeeId`}>{response.travel[key].EmployeeID}</div>,
                <div key={`${key}-indentId`}>{response.travel[key].IndentID}</div>,
                <div key={`${key}-source`}>{response.travel[key].Source} ({response.travel[key].FromDate.split('T')[0]})</div>,
                <div key={`${key}-destination`}>{response.travel[key].Destination} ({response.travel[key].DestinationDate.split('T')[0]})</div>,
                <div key={`${key}-purpose`}>{response.travel[key].Reason}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.travel[key].BillCopy} />)}>₹{response.travel[key].RequestedAmt}</div>
            ])
        ));
    }
    arr.push(tempArray);

    tempArray = [];
    if (response.equipment) {
        Object.keys(response.equipment).forEach((key) => (
            tempArray.push([
                <div key={`${key}-sl`}>{key + 1}</div>,
                <div key={`${key}-employeeId`}>{response.equipment[key].EmployeeID}</div>,
                <div key={`${key}-indentId`}>{response.equipment[key].IndentID}</div>,
                <div key={`${key}-date`}>{response.equipment[key].RequestedDate.split('T')[0]}</div>,
                <div key={`${key}-purpose`}>{response.equipment[key].Reason}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.equipment[key].BillCopy} />)}>₹{response.equipment[key].RequestedAmt}</div>
            ])
        ));
    }
    arr.push(tempArray);

    tempArray = [];
    response.manpower.map((item, index) => {
        tempArray.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-employeeId`}>{item.EmployeeID}</div>,
            <div key={`${item.id}-indentId`}>{item.IndentID}</div>,
            <div key={`${item.id}-fromDate`}>{item.JoiningDate.split('T')[0] || 'N/A'}</div>,
            <div key={`${item.id}-toDate`}>{item.EndDate.split('T')[0] || 'N/A'}</div>,
            <div key={`${item.id}-total`}>₹{item.RequestedAmt}</div>
        ]);
    });
    arr.push(tempArray);

    tempArray = [];
    if (response.overhead) {
        Object.keys(response.overhead).forEach((key) => (
            tempArray.push([
                <div key={`${key}-sl`}>{key + 1}</div>,
                <div key={`${key}-requestId`}>{response.overhead[key].RequestID}</div>,
                <div key={`${key}-indentId`}>{response.overhead[key].IndentID}</div>,
                <div key={`${key}-date`}>{response.overhead[key].RequestedDate.split('T')[0]}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.overhead[key].BillCopy} />)}>₹{response.overhead[key].RequestedAmt}</div>
            ])
        ));
    }
    arr.push(tempArray);
    return arr;
}

function Project() {
    return (
        <ProjectProvider>
            <ProjectContent />
        </ProjectProvider>
    );
}
export default Project;