import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Project.css';
import { FaPlus,FaEdit } from 'react-icons/fa';
import ManpowerPopup from '../sideComponents/ManpowerPopup';
import TravelsPopup from '../sideComponents/TravelsPopup';
import ConsumablesPopup from '../sideComponents/ConsumablesPopup';
import EquipmentsPopup from '../sideComponents/EquipmentsPopup';
import ContingencyPopup from '../sideComponents/Contingency';
import { fetchData } from '../assets/scripts';

function Project() {
    let { id } = useParams();
    const [activeTab, setActiveTab] = useState('Manpower');
    const [table, setTable] = useState([]);
    const [data, setData] = useState({});
    const [popup, setPopup] = useState(<></>);
    useEffect(() => {
        async function fillData() {
            // let response = await fetchData(`http://localhost:5000/api/projects/${id}`);
            let response = {
                id: "abc",
                title: "Project Title",
                totalIndent: 1000,
                fundedBy: "The fuuu",
                startDate: "Anytime",
                endDate: "Sometime",
                manpower: [
                    {
                        id: "REQ001",
                        indentId: "IND001",
                        date: "2023-10-01",
                        bill: 1000
                    },
                    {
                        id: "REQ002",
                        indentId: "IND002",
                        date: "2023-10-02",
                        bill: 2000
                    },
                    {
                        id: "REQ003",
                        indentId: "IND003",
                        date: "2023-10-03",
                        bill: 3000
                    }
                ],
                travels: [
                    {
                        id: "REQ101",
                        indentId: "IND101",
                        date: "2023-10-11",
                        bill: 1100
                    },
                    {
                        id: "REQ102",
                        indentId: "IND102",
                        date: "2023-10-12",
                        bill: 2200
                    },
                    {
                        id: "REQ103",
                        indentId: "IND103",
                        date: "2023-10-13",
                        bill: 3300
                    }
                ],
                consumables: [
                    {
                        id: "REQ201",
                        indentId: "IND201",
                        date: "2023-10-21",
                        bill: 2100
                    },
                    {
                        id: "REQ202",
                        indentId: "IND202",
                        date: "2023-10-22",
                        bill: 2200
                    },
                    {
                        id: "REQ203",
                        indentId: "IND203",
                        date: "2023-10-23",
                        bill: 2300
                    }
                ],
                equipments: [
                    {
                        id: "REQ301",
                        indentId: "IND301",
                        date: "2023-10-31",
                        bill: 3100
                    },
                    {
                        id: "REQ302",
                        indentId: "IND302",
                        date: "2023-11-01",
                        bill: 3200
                    },
                    {
                        id: "REQ303",
                        indentId: "IND303",
                        date: "2023-11-02",
                        bill: 3300
                    }
                ],
                contingency: [
                    {
                        id: "REQ401",
                        indentId: "IND401",
                        date: "2023-11-11",
                        bill: 4100
                    },
                    {
                        id: "REQ402",
                        indentId: "IND402",
                        date: "2023-11-12",
                        bill: 4200
                    },
                    {
                        id: "REQ403",
                        indentId: "IND403",
                        date: "2023-11-13",
                        bill: 4300
                    }
                ],
                overhead: [
                    {
                        id: "REQ501",
                        indentId: "IND501",
                        date: "2023-11-21",
                        bill: 5100
                    },
                    {
                        id: "REQ502",
                        indentId: "IND502",
                        date: "2023-11-22",
                        bill: 5200
                    },
                    {
                        id: "REQ503",
                        indentId: "IND503",
                        date: "2023-11-23",
                        bill: 5300
                    }
                ],
                projectManager: "Mr. X"
            }
            setTable(compileDate(response));
            let {manpower, travels, consumables, equipments, contingency, overhead, ...filtered} = response;
            setData(filtered);
        }
        fillData();
    }, [id]);

    useEffect(() => {
        const tabContentElements = document.querySelectorAll('.projectTabContentData');
        const tabNames = ['Manpower', 'Travels', 'Consumables', 'Equipments', 'Contingency'];

        tabContentElements.forEach((element) => {
            element.style.transform = `translateX(${-tabNames.indexOf(activeTab) * 100}%)`;
        });
    }, [activeTab]);// transition to different tabs
    return (
        <div id='projectMainDiv'>
            {popup}
            <h1>Project Details <FaEdit size={40} className='hoverable' style={{position:'absolute', right:20}}/></h1>
            
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
                <div className="hoverable" onClick={() => setActiveTab('Manpower')}> Manpower</div>
                <div className="hoverable" onClick={() => setActiveTab('Travels')}>Travels</div>
                <div className="hoverable" onClick={() => setActiveTab('Consumables')}>Consumables</div>
                <div className="hoverable" onClick={() => setActiveTab('Equipments')}>Equipments</div>
                <div className="hoverable" onClick={() => setActiveTab('Contingency')}>Contingency</div>
            </div>
            <div id="projectTabContent">
                <div className="projectTabContentData">
                    <span className="projectTabDataHeading">Sl.</span>
                    <span className="projectTabDataHeading">Request Id</span>
                    <span className="projectTabDataHeading">Indent Id</span>
                    <span className="projectTabDataHeading">Date</span>
                    <span className="projectTabDataHeading">Bill</span>
                    {table[0]}
                    <div className="add hoverable" onClick={() => setPopup(<ManpowerPopup reset={() => setPopup(<></>)} />)}><FaPlus /></div>
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
    );
}

export default Project;

function compileDate(response) {
    let manpowerContent = [];
    response.manpower.map((item, index) => (
        manpowerContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}>${item.bill}</div>
        ])
    ));
    let travelsContent = [];
    response.travels.map((item, index) => (
        travelsContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}>${item.bill}</div>
        ])
    ));
    let consumablesContent = [];
    response.consumables.map((item, index) => (
        consumablesContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}>${item.bill}</div>
        ])
    ));

    let equipmentsContent = [];
    response.equipments.map((item, index) => (
        equipmentsContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}>${item.bill}</div>
        ])
    ));

    let contingencyContent = [];
    response.contingency.map((item, index) => (
        contingencyContent.push([
            <div key={`${item.id}-sl`}>{index + 1}</div>,
            <div key={`${item.id}-requestId`}>{item.id}</div>,
            <div key={`${item.id}-indentId`}>{item.indentId}</div>,
            <div key={`${item.id}-date`}>{item.date}</div>,
            <div key={`${item.id}-bill`}>${item.bill}</div>
        ])
    ));
    return [manpowerContent, travelsContent, consumablesContent, equipmentsContent, contingencyContent];
}