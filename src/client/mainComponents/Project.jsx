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
import PDFPopup from '../sideComponents/PDFPopup';
import { ProjectContext, ProjectProvider } from '../assets/ProjectData';
import PIPop from '../sideComponents/projectPage/PIPop';

function ProjectContent() {
    let { id } = useParams();
    id = decodeURIComponent(id);
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
                        <div style=
                            {{display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'left'}}>
                            <b>PI Name:</b> 
                            <span style=
                                {{backgroundColor: 'white', textAlign: 'right'}} className='hoverable'
                                onClick={()=>setPopup(<PIPop reset={() => setPopup(null)} data={project.PIs} type='PIs' />)}>
                                Click to See list
                            </span>
                        </div>
                        <div style=
                            {{display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'left'}}>
                            <b>Co-PIs:</b> 
                            <span style=
                                {{backgroundColor: 'white', textAlign: 'right'}} className='hoverable'
                                onClick={()=>setPopup(<PIPop reset={() => setPopup(null)} data={project.CoPIs} type='Co-PIs' />)}> 
                                Click to See list
                            </span>
                        </div>
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
    if (response.Consumables) {
        Object.keys(response.Consumables).forEach((key, index) => {
            console.log(response.Consumables[key].IndentStatus);

            tempArray.push([
                <div key={`${key}-sl`}>{index + 1}</div>,
                <div key={`${key}-employeeId`}>{response.Consumables[key].EmployeeID}</div>,
                <div key={`${key}-indentId`}>{response.Consumables[key].IndentID}</div>,
                <div key={`${key}-date`}>{response.Consumables[key].RequestedDate.split('T')[0]}</div>,
                <div key={`${key}-reason`}>{response.Consumables[key].Reason}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.Consumables[key].BillCopy} />)}>₹{response.Consumables[key].RequestedAmt}</div>
            ])
        });
    }
    arr.push(tempArray);

    tempArray = [];
    if (response.Contingency) {
        Object.keys(response.Contingency).forEach((key) => (
            tempArray.push([
                <div key={`${key}-sl`}>{key + 1}</div>,
                <div key={`${key}-employeeId`}>{response.Contingency[key].EmployeeID}</div>,
                <div key={`${key}-indentId`}>{response.Contingency[key].IndentID}</div>,
                <div key={`${key}-date`}>{response.Contingency[key].RequestedDate.split('T')[0]}</div>,
                <div key={`${key}-reason`}>{response.Contingency[key].Reason}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.Contingency[key].BillCopy} />)}>₹{response.Contingency[key].RequestedAmt}</div>
            ])
        ));
    }
    arr.push(tempArray);

    tempArray = []
    if (response.Travel) {
        Object.keys(response.Travel).forEach((key) => (
            tempArray.push([
                <div key={`${key}-sl`}>{key + 1}</div>,
                <div key={`${key}-employeeId`}>{response.Travel[key].EmployeeID}</div>,
                <div key={`${key}-indentId`}>{response.Travel[key].IndentID}</div>,
                <div key={`${key}-source`}>{response.Travel[key].Source} ({response.Travel[key].FromDate.split('T')[0]})</div>,
                <div key={`${key}-destination`}>{response.Travel[key].Destination} ({response.Travel[key].DestinationDate.split('T')[0]})</div>,
                <div key={`${key}-purpose`}>{response.Travel[key].Reason}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.Travel[key].BillCopy} />)}>₹{response.Travel[key].RequestedAmt}</div>
            ])
        ));
    }
    arr.push(tempArray);

    tempArray = [];
    if (response.Equipment) {
        Object.keys(response.Equipment).forEach((key) => (
            tempArray.push([
                <div key={`${key}-sl`}>{key + 1}</div>,
                <div key={`${key}-employeeId`}>{response.Equipment[key].EmployeeID}</div>,
                <div key={`${key}-indentId`}>{response.Equipment[key].IndentID}</div>,
                <div key={`${key}-date`}>{response.Equipment[key].RequestedDate.split('T')[0]}</div>,
                <div key={`${key}-purpose`}>{response.Equipment[key].Reason}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.Equipment[key].BillCopy} />)}>₹{response.Equipment[key].RequestedAmt}</div>
            ])
        ));
    }
    arr.push(tempArray);

    tempArray = [];
    response.Manpower.map((item, index) => {
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
    if (response.Overhead) {
        Object.keys(response.Overhead).forEach((key) => (
            tempArray.push([
                <div key={`${key}-sl`}>{key + 1}</div>,
                <div key={`${key}-requestId`}>{response.Overhead[key].RequestID}</div>,
                <div key={`${key}-indentId`}>{response.Overhead[key].IndentID}</div>,
                <div key={`${key}-date`}>{response.Overhead[key].RequestedDate.split('T')[0]}</div>,
                <div key={`${key}-bill`} className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response.Overhead[key].BillCopy} />)}>₹{response.Overhead[key].RequestedAmt}</div>
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