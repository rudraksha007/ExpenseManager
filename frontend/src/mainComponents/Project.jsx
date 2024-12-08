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

function Project() {
    let { id } = useParams();
    const [activeTab, setActiveTab] = useState('Manpower');
    const [table, setTable] = useState([]);
    const [data, setData] = useState({});
    const [popup, setPopup] = useState(<></>);
    const [loading, setLoading] = useState(true);
    const tabNames = ['Manpower', 'Travels', 'Consumables', 'Equipments', 'Contingency'];
    useEffect(() => {
        async function fillData() {
            let response = await fetchData(`projects/${id}`);
            // let response = 
            setTable(compileDate(response, setPopup));
            let { manpower, travels, consumables, equipments, contingency, overhead, ...filtered } = response;
            setData(filtered);
            document.title = `Project: ${filtered.title}`;
            setLoading(false);
        }
        fillData();
    }, [id]);

    useEffect(() => {
        const tabContentElements = document.querySelectorAll('.projectTabContentData');
        // document.getElementById('projectTabs').children[tabNames.indexOf(activeTab)].style.brightness = 0.8;
        if (document.querySelector('#projectTabsActive')) {
            document.querySelector('#projectTabsActive').id = '';
            document.querySelector('#projectTabs').children[tabNames.indexOf(activeTab)].id = 'projectTabsActive';
        }
        console.log(document.getElementById('projectTabs'));

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
                        <div>Funded By: {data.fundedBy}</div>
                        <div>Project Id: {id}</div>
                        <div>Title: {data.title}</div>
                        <div>Indentation Amt: ${data.totalIndent}</div>
                        {/* <div>Manpower Allocation Amt: ${data[0].reduce((acc, item) => acc + item.bill, 0)}</div> */}
                        {/* <div>Consumables Allocation Amt: ${data[2].reduce((acc, item) => acc + item.bill, 0)}</div> */}
                        {/* <div>Contingency Allocation Amt: ${data[4].reduce((acc, item) => acc + item.bill, 0)}</div> */}
                        {/* <div>Overhead Allocation Amt: ${data[0].reduce((acc, item) => acc + item.bill, 0)}</div> */}
                        {/* <div>Equipment Allocation Amt: ${data[3].reduce((acc, item) => acc + item.bill, 0)}</div> */}
                        {/* <div>Travel Allocation Amt: ${data[1].reduce((acc, item) => acc + item.bill, 0)}</div> */}
                    </div>
                    <div id="projectTabs" style={{ color: 'white' }}>
                        <div className="hoverable" id='projectTabsActive' onClick={() => setActiveTab('Manpower')}> Manpower</div>
                        <div className="hoverable" onClick={() => setActiveTab('Travels')}>Travels</div>
                        <div className="hoverable" onClick={() => setActiveTab('Consumables')}>Consumables</div>
                        <div className="hoverable" onClick={() => setActiveTab('Equipments')}>Equipments</div>
                        <div className="hoverable" onClick={() => setActiveTab('Contingency')}>Contingency</div>
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
                                <div className='hoverable inherit'><FaEdit size={20} onClick={() => setPopup(<DecManpowerPopup reset={() => setPopup(<></>)} proj={data} />)} /></div>
                                <div className='hoverable inherit'><FaPlus size={20} onClick={() => setPopup(<AddManpowerPopup reset={() => setPopup(<></>)} />)} proj={data} /></div>
                            </div>
                        </div>
                        <div className="projectTabContentData">
                            <span className="projectTabDataHeading">Sl.</span>
                            <span className="projectTabDataHeading">Request Id</span>
                            <span className="projectTabDataHeading">Indent Id</span>
                            <span className="projectTabDataHeading">Date</span>
                            <span className="projectTabDataHeading">Bill</span>
                            {table[1]}
                            <div className="add hoverable" onClick={() => setPopup(<TravelsPopup reset={() => setPopup(<></>)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData">
                            <span className="projectTabDataHeading">Sl.</span>
                            <span className="projectTabDataHeading">Request Id</span>
                            <span className="projectTabDataHeading">Indent Id</span>
                            <span className="projectTabDataHeading">Date</span>
                            <span className="projectTabDataHeading">Bill</span>
                            {table[2]}
                            <div className="add hoverable" onClick={() => setPopup(<ConsumablesPopup reset={() => setPopup(<></>)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData">
                            <span className="projectTabDataHeading">Sl.</span>
                            <span className="projectTabDataHeading">Request Id</span>
                            <span className="projectTabDataHeading">Indent Id</span>
                            <span className="projectTabDataHeading">Date</span>
                            <span className="projectTabDataHeading">Bill</span>
                            {table[3]}
                            <div className="add hoverable" onClick={() => setPopup(<EquipmentsPopup reset={() => setPopup(<></>)} />)}><FaPlus /></div>
                        </div>
                        <div className="projectTabContentData">
                            <span className="projectTabDataHeading">Sl.</span>
                            <span className="projectTabDataHeading">Request Id</span>
                            <span className="projectTabDataHeading">Indent Id</span>
                            <span className="projectTabDataHeading">Date</span>
                            <span className="projectTabDataHeading">Bill</span>
                            {table[4]}
                            <div className="add hoverable" onClick={() => setPopup(<ContingencyPopup reset={() => setPopup(<></>)} />)}><FaPlus /></div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Project;

function compileDate(response, setPopup) {
    let manpowerContent = [];
    console.log(response);
    
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
            <div key={`${item.id}-bill`} style={style} className='hoverable' onClick={() => setPopup(<ManpowerEditDetailsPopup reset={() => setPopup(<></>)} entry={item} />)}> <b><u>{item.action=='added'? "Added":"Removed"}</u></b> </div>
        ])
    });
    let travelsContent = [];
    response.travels.map((item, index) => (
        travelsContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}><Link to={item.billLink}>${item.bill}</Link></div>
        ])
    ));
    let consumablesContent = [];
    response.consumables.map((item, index) => (
        consumablesContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}><Link to={item.billLink}>${item.bill}</Link></div>
        ])
    ));

    let equipmentsContent = [];
    response.equipments.map((item, index) => (
        equipmentsContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}><Link to={item.billLink}>${item.bill}</Link></div>
        ])
    ));

    let contingencyContent = [];
    response.contingency.map((item, index) => (
        contingencyContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}><Link to={item.billLink}>${item.bill}</Link></div>
        ])
    ));
    return [manpowerContent, travelsContent, consumablesContent, equipmentsContent, contingencyContent];
}