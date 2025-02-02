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
import PDFPopup from '../sideComponents/PDFPopup';
import { ProjectContext, ProjectProvider } from '../assets/ProjectData';
import PIPop from '../sideComponents/projectPage/PIPop';
import Loading from '../assets/Loading';
import { formatNumber } from 'chart.js/helpers';

function ProjectContent() {
    let { id } = useParams();
    id = decodeURIComponent(id);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Consumables');
    const [table, setTable] = useState({Consumables: [], Contingency: [], Travel: [], Equipment: [], Manpower: []});
    const { project, setProject } = useContext(ProjectContext);
    const [popup, setPopup] = useState(null);
    const [loading, setLoading] = useState(true);
    const tabNames = ['Consumables', 'Contingency', 'Travels', 'Equipments', 'Manpower'];
    const fillData = async () => {
        setLoading(true);
        let response = await fetchData(`projects/${id}`, 'post');
        if (response.reqStatus != 'success') { alert('Error: ' + response.message); setLoading(false); return; }
        setTable(compileData(response.data, setPopup));        
        setProject({...response.data, PIs: JSON.parse(response.data.PIs), 
            CoPIs: JSON.parse(response.data.CoPIs),
            Workers: JSON.parse(response.data.Workers)});
        document.title = `Project: ${response.data.ProjectTitle}`;
        setLoading(false);
    }
    useEffect(() => {
        if (popup) return;
        fillData();
    }, [popup]);
    return (
        <>
            {loading ? <Loading position={'absolute'}/> :
                <div id='projectMainDiv'>
                    {popup}
                    <h1>Project Details <FaEdit size={40} className='hoverable' title='Edit' style={{ position: 'absolute', right: 20 }} onClick={() => navigate('/newproject', {
                        state: {
                            EditFormData: project
                        }
                    })} /></h1>

                    <div id="projectDetails" style={{display: 'grid', gridTemplateColumns: '2fr 3fr 2fr 3fr', textAlign: 'left', columnGap:'20px' }}>
                        <b>Funded By:</b>
                        <span>{project.FundedBy}</span>
                        <b>Project Id:</b>
                        <span>{id}</span>
                        <b>Title:</b>
                        <span>{project.ProjectTitle}</span>
                        <b>Sanction Order No:</b>
                        <span>{project.SanctionOrderNo}</span>
                        <b>Total Sanction Amount:</b>
                        <span>₹{formatNumber(project.TotalSanctionAmount)}</span>
                        <b>Project Start Date:</b>
                        <span>{new Date(project.ProjectStartDate).toLocaleDateString()}</span>
                        <b>Project End Date:</b>
                        <span>{new Date(project.ProjectEndDate).toLocaleDateString()}</span>
                        <b>PI Name:</b>
                        <span style={{backgroundColor: 'white', textAlign: 'right'}} className='hoverable' onClick={() => setPopup(<PIPop reset={() => setPopup(null)} data={project.PIs} type='PIs' />)}>Click to See list</span>
                        <b>Co-PIs:</b>
                        <span style={{backgroundColor: 'white', textAlign: 'right'}} className='hoverable' onClick={() => setPopup(<PIPop reset={() => setPopup(null)} data={project.CoPIs} type='Co-PIs' />)}>Click to See list</span>
                        <b>Manpower Allocation Amt:</b>
                        <span>₹{formatNumber(project.ManpowerAllocationAmt)}</span>
                        <b>Consumables Allocation Amt:</b>
                        <span>₹{formatNumber(project.ConsumablesAllocationAmt)}</span>
                        <b>Contingency Allocation Amt:</b>
                        <span>₹{formatNumber(project.ContingencyAllocationAmt)}</span>
                        <b>Overhead Allocation Amt:</b>
                        <span>₹{formatNumber(project.OverheadAllocationAmt)}</span>
                        <b>Equipment Allocation Amt:</b>
                        <span>₹{formatNumber(project.EquipmentAllocationAmt)}</span>
                        <b>Travel Allocation Amt:</b>
                        <span>₹{formatNumber(project.TravelAllocationAmt)}</span>
                    </div>
                    <div id="projectTabs" style={{ color: 'white' }}>
                        <div className="hoverable" id={activeTab=='Consumables'?'projectTabsActive':''} onClick={() => setActiveTab('Consumables')}><b>Consumables</b></div>
                        <div className="hoverable" id={activeTab=='Contingency'?'projectTabsActive':''} onClick={() => setActiveTab('Contingency')}><b>Contingency</b></div>
                        <div className="hoverable" id={activeTab=='Travels'?'projectTabsActive':''} onClick={() => setActiveTab('Travels')} ><b>Travels</b></div>
                        <div className="hoverable" id={activeTab=='Equipments'?'projectTabsActive':''} onClick={() => setActiveTab('Equipments')} ><b>Equipments</b></div>
                        <div className="hoverable" id={activeTab=='Manpower'?'projectTabsActive':''} onClick={() => setActiveTab('Manpower')}><b>Manpower</b></div>
                    </div>
                    <div id="projectTabContent" >
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 4fr 3fr 2fr 4fr 2fr", transform: `translateX(-${100*tabNames.indexOf(activeTab)}%)` }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Date</span>
                            <span className="tableTitle">Purpose</span>
                            <span className="tableTitle">Bill</span>
                            {table.Consumables}
                            <div className="add hoverable" onClick={() => setPopup(<ConsumablesPopup reset={() => setPopup(null)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 4fr 3fr 2fr 4fr 2fr", transform: `translateX(-${100*tabNames.indexOf(activeTab)}%)` }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Date</span>
                            <span className="tableTitle">Purpose</span>
                            <span className="tableTitle">Bill</span>
                            {table.Contingency}
                            <div className="add hoverable" onClick={() => setPopup(<ContingencyPopup reset={() => setPopup(null)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 3fr 3fr 4fr 4fr 3fr 2fr", transform: `translateX(-${100*tabNames.indexOf(activeTab)}%)` }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Source (Date)</span>
                            <span className="tableTitle">Destination (Date)</span>
                            <span className="tableTitle">Purpose</span>
                            <span className="tableTitle">Bill</span>
                            {table.Travel}
                            <div className="add hoverable" onClick={() => setPopup(<TravelsPopup reset={() => setPopup(null)} />)} ><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 4fr 3fr 2fr 3fr 1fr", transform: `translateX(-${100*tabNames.indexOf(activeTab)}%)` }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Date</span>
                            <span className="tableTitle">Purpose</span>
                            <span className="tableTitle">Bill</span>
                            {table.Equipment}
                            <div className="add hoverable" onClick={() => setPopup(<EquipmentsPopup reset={() => setPopup(null)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData" style={{ gridTemplateColumns: "1fr 4fr 3fr 2fr 2fr 2fr", transform: `translateX(-${100*tabNames.indexOf(activeTab)}%)` }}>
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Employee (ID)</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">From Date</span>
                            <span className="tableTitle">To Date</span>
                            <span className="tableTitle">Total</span>
                            {table.Manpower}
                            <div className='hoverable inherit' onClick={() => setPopup(<AddManpowerPopup 
                                reset={() => setPopup(null)} workers={project.Workers} />)}>
                                    <FaPlus size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}


function compileData(data, setPopup) {    
    let compiled = {Consumables: [], Contingency: [], Travel: [], Equipment: [], Manpower: [], Overhead: []};
    data.indents.map((item) => {
        if(item.IndentStatus == 'Rejected') return;        
        switch (item.IndentType) {
            case 'Consumables':
                compiled.Consumables.push(
                    <React.Fragment key={compiled.Consumables.length}>
                        <div>{compiled.Consumables.length+1}</div>
                        <div>{item.EmployeeID}</div>
                        <div>{item.IndentID}</div>
                        <div>{new Date(item.RequestedDate).toLocaleDateString()}</div>
                        <div>{item.Reason}</div>
                        <div className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={`pdf/Consumables/${item.IndentID}`} />)}>{item.RequestedAmt}</div>
                    </React.Fragment>
                );
                break;
            case 'Contingency':
                compiled.Contingency.push(
                    <React.Fragment key={compiled.Contingency.length}>
                        <div>{compiled.Contingency.length + 1}</div>
                        <div>{item.EmployeeID}</div>
                        <div>{item.IndentID}</div>
                        <div>{new Date(item.RequestedDate).toLocaleDateString()}</div>
                        <div>{item.Reason}</div>
                        <div className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={`pdf/Contingency/${item.IndentID}`} />)}>{item.RequestedAmt}</div>
                    </React.Fragment>
                );
                break;
            case 'Travel':
                compiled.Travel.push(
                    <React.Fragment key={compiled.Travel.length}>
                        <div>{compiled.Travel.length + 1}</div>
                        <div>{item.EmployeeID}</div>
                        <div>{item.IndentID}</div>
                        <div>{item.Source} ({new Date(item.FromDate).toLocaleDateString()})</div>
                        <div>{item.Destination} ({new Date(item.DestinationDate).toLocaleDateString()})</div>
                        <div>{item.Reason}</div>
                        <div className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={`pdf/Travel/${item.IndentID}`} />)}>{item.RequestedAmt}</div>
                    </React.Fragment>
                );
                break;
            case 'Equipment':
                compiled.Equipment.push(
                    <React.Fragment key={compiled.Equipment.length}>
                        <div>{compiled.Equipment.length + 1}</div>
                        <div>{item.EmployeeID}</div>
                        <div>{item.IndentID}</div>
                        <div>{new Date(item.RequestedDate).toLocaleDateString()}</div>
                        <div>{item.Reason}</div>
                        <div className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={`pdf/Equipment/${item.IndentID}`} />)}>{item.RequestedAmt}</div>
                    </React.Fragment>
                );
                break;
            case 'Manpower':
                compiled.Manpower.push(
                    <React.Fragment key={compiled.Manpower.length}>
                        <div>{compiled.Manpower.length + 1}</div>
                        <div>{item.EmployeeID}</div>
                        <div>{item.IndentID}</div>
                        <div>{new Date(item.FromDate).toLocaleDateString()}</div>
                        <div>{new Date(item.DestinationDate).toLocaleDateString()}</div> {/* To Date*/}
                        <div>{item.RequestedAmt}</div>
                    </React.Fragment>
                );
                break;
            case 'Overhead':
                compiled.Overhead.push(
                    <React.Fragment key={compiled.Overhead.length}>
                        <div>{item.Sl}</div>
                        <div>{item.EmployeeName} ({item.EmployeeId})</div>
                        <div>{item.IndentId}</div>
                        <div>{new Date(item.Date).toLocaleDateString()}</div>
                        <div>{item.Purpose}</div>
                        <div className='hoverable' onClick={() => setPopup(<PDFPopup reset={() => setPopup(null)} pdf={`pdf/Overhead${item.IndentID}`} />)}>{item.RequestedAmt}</div>
                    </React.Fragment>
                );
                break;
        }
    });
    setPopup(null);
    return compiled;
}

function Project() {
    return (
        <ProjectProvider>
            <ProjectContent />
        </ProjectProvider>
    );
}
export default Project;