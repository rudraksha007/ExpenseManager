import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import ManpowerEditDetailsPopup from '../sideComponents/projectPage/ManpowerDetailsPopup';
import PDFPopup from '../sideComponents/PDFPopup';

function Project() {
    let { id } = useParams();
    const [activeTab, setActiveTab] = useState('Manpower');
    const [table, setTable] = useState([]);
    const [data, setData] = useState({});
    const [popup, setPopup] = useState(null);
    const [loading, setLoading] = useState(true);
    const tabNames = ['Manpower', 'Travels', 'Consumables', 'Equipments', 'Contingency'];
    const fillData = async () => {
        setLoading(true);
        let response = await fetchData(`projects/${id}`, 'post');
        if(response.reqStatus != 'success'){alert('Error: '+response.message); setLoading(false);return;}
        console.log(response.data);
        
        setTable(compileDate(response.data, setPopup));
        let { manpower, travels, consumables, equipments, contingency, overhead, ...filtered } = response.data;
        setData(filtered);
        document.title = `Project: ${filtered.ProjectTitle}`;
        setLoading(false);
    }
    useEffect(() => {
        if(popup)return;
        fillData();
        setActiveTab('Manpower');
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
    }, [activeTab]);// transition to different tabs
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='projectMainDiv'>
                    {popup}
                    <h1>Project Details <FaEdit size={40} className='hoverable' title='Edit' style={{ position: 'absolute', right: 20 }} /></h1>

                    <div id="projectDetails">
                        <div><b>Funded By:</b> <span>{data.FundedBy}</span></div>
                        <div><b>Project Id:</b> <span>{id}</span></div>
                        <div><b>Title:</b> <span>{data.ProjectTitle}</span></div>
                        <div><b>Sanction Order No:</b> <span>{data.SanctionOrderNo}</span></div>
                        <div><b>Total Sanction Amount:</b> <span>${data.TotalSanctionAmount}</span></div>
                        <div><b>Project Start Date:</b> <span>{new Date(data.ProjectStartDate).toLocaleDateString()}</span></div>
                        <div><b>Project End Date:</b> <span>{new Date(data.ProjectEndDate).toLocaleDateString()}</span></div>
                        <div><b>PI Name:</b> <span>{data.PIName}</span></div>
                        <div><b>Co-PIs:</b> <span>{data.CoPIs}</span></div>
                        <div><b>Manpower Allocation Amt:</b> <span>${data.ManpowerAllocationAmt}</span></div>
                        <div><b>Consumables Allocation Amt:</b> <span>${data.ConsumablesAllocationAmt}</span></div>
                        <div><b>Contingency Allocation Amt:</b> <span>${data.ContingencyAllocationAmt}</span></div>
                        <div><b>Overhead Allocation Amt:</b> <span>${data.OverheadAllocationAmt}</span></div>
                        <div><b>Equipment Allocation Amt:</b> <span>${data.EquipmentAllocationAmt}</span></div>
                        <div><b>Travel Allocation Amt:</b> <span>${data.TravelAllocationAmt}</span></div>
                    </div>
                    <div id="projectTabs" style={{ color: 'white' }}>
                        <div className="hoverable" id='projectTabsActive' onClick={() => setActiveTab('Manpower')}><b>Manpower</b></div>
                        <div className="hoverable" onClick={() => setActiveTab('Travels')}><b>Travels</b></div>
                        <div className="hoverable" onClick={() => setActiveTab('Consumables')}><b>Consumables</b></div>
                        <div className="hoverable" onClick={() => setActiveTab('Equipments')}><b>Equipments</b></div>
                        <div className="hoverable" onClick={() => setActiveTab('Contingency')}><b>Contingency</b></div>
                    </div>
                    <div id="projectTabContent">
                        <div className="projectTabContentData">
                            <span className="tableTitle">Sl.</span>
                            <span className="tableTitle">Request Id</span>
                            <span className="tableTitle">Indent Id</span>
                            <span className="tableTitle">Date</span>
                            <span className="tableTitle">Details</span>
                            {table[0]}
                            <div className="add">
                                <div className='hoverable inherit'><FaEdit size={20} onClick={() => setPopup(<DecManpowerPopup reset={() => setPopup(null)} proj={data} projectNo={id} />)} /></div>
                                <div className='hoverable inherit'><FaPlus size={20} onClick={() => setPopup(<AddManpowerPopup reset={() => setPopup(null)} proj={data} projectNo={id}/>)} /></div>
                            </div>
                        </div>
                        <div className="projectTabContentData">
                            <span className="projectTabDataHeading">Sl.</span>
                            <span className="projectTabDataHeading">Request Id</span>
                            <span className="projectTabDataHeading">Indent Id</span>
                            <span className="projectTabDataHeading">Date</span>
                            <span className="projectTabDataHeading">Bill</span>
                            {table[1]}
                            <div className="add hoverable" onClick={() => setPopup(<TravelsPopup reset={() => setPopup(null)} projectNo={id} projectTitle={data.ProjectTitle} />)} ><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData">
                            <span className="projectTabDataHeading">Sl.</span>
                            <span className="projectTabDataHeading">Request Id</span>
                            <span className="projectTabDataHeading">Indent Id</span>
                            <span className="projectTabDataHeading">Date</span>
                            <span className="projectTabDataHeading">Bill</span>
                            {table[2]}
                            <div className="add hoverable" onClick={() => setPopup(<ConsumablesPopup reset={() => setPopup(null)} projectNo={id} projectTitle={data.ProjectTitle} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData">
                            <span className="projectTabDataHeading">Sl.</span>
                            <span className="projectTabDataHeading">Request Id</span>
                            <span className="projectTabDataHeading">Indent Id</span>
                            <span className="projectTabDataHeading">Date</span>
                            <span className="projectTabDataHeading">Bill</span>
                            {table[3]}
                            <div className="add hoverable" onClick={() => setPopup(<EquipmentsPopup reset={() => setPopup(null)} projectNo={id} projectTitle={data.ProjectTitle} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData">
                            <span className="projectTabDataHeading">Sl.</span>
                            <span className="projectTabDataHeading">Request Id</span>
                            <span className="projectTabDataHeading">Indent Id</span>
                            <span className="projectTabDataHeading">Date</span>
                            <span className="projectTabDataHeading">Bill</span>
                            {table[4]}
                            <div className="add hoverable" onClick={() => setPopup(<ContingencyPopup reset={() => setPopup(null)} projectNo={id} projectTitle={data.ProjectTitle} />)}><FaPlus /></div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Project;

function compileDate(response, setPopup) {
    let arr = [];
    let manpowerContent = [];
    response.manpower.map((item, index) => {
        let style = {};
        if (item.action === 'added'){
            style = {backgroundColor: 'rgb(200, 250, 200)'};
        }else{ style = {backgroundColor: 'rgb(250, 200, 200)'}; }
        manpowerContent.push([
            <div key={`${item.id}-sl`} style={style}>{index + 1}</div>,
            <div key={`${item.id}-requestId`} style={style}>{item.id}</div>,
            <div key={`${item.id}-indentId`} style={style}>{item.indentId}</div>,
            <div key={`${item.id}-date`} style={style}>{item.date}</div>,
            <div key={`${item.id}-bill`} style={style} className='hoverable' onClick={() => setPopup(<ManpowerEditDetailsPopup reset={() => setPopup(null)} entry={item} />)}> <b><u>{item.action=='added'? "Added":"Removed"}</u></b> </div>
        ])
    });
    arr.push(manpowerContent);
    let tables = ['travel', 'consumables', 'equipment', 'contingency', 'overhead', ];
    tables.forEach((table) => {
        let temp = [];
        if (response[table]) {
            console.log(response[table][0]);
            Object.keys(response[table]).forEach((key) => (
                temp.push([
                    <div key={`${key}-sl`}>{key + 1}</div>,
                    <div key={`${key}-requestId`}>{response[table][key].RequestID}</div>,
                    <div key={`${key}-indentId`}>{response[table][key].IndentID}</div>,
                    <div key={`${key}-date`}>{response[table][key].RequestedDate.split('T')[0]}</div>,
                    <div key={`${key}-bill`} className='hoverable' onClick={()=>setPopup(<PDFPopup reset={() => setPopup(null)} pdf={response[table][key].BillCopy}/>)}>${response[table][key].RequestedAmt}</div>
                ])
            ));
        }
        arr.push(temp);
    });    
    return arr;
}