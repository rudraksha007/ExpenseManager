import '../css/AllProjects.css';
import { data, Link } from 'react-router-dom';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { useState, useEffect, useRef, useContext } from 'react';
import { fetchData, fetchDataWithParams } from '../assets/scripts.js';
import React from 'react';
import { Oval } from 'react-loader-spinner';
import PageControls from '../sideComponents/PageControls';
import { ProfileContext } from '../assets/UserProfile.jsx';

function AllProjects() {

    const [projects, setProjects] = useState([]);
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
    const [fromDate, setFromDate] = useState('');
    const total = useRef(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({page:1, name:'', status:'all', fundedBy:'all', fromDate:fromDate, toDate:toDate});
    const {profile} = useContext(ProfileContext);
    const filterData = (e)=>{

    }

    useEffect(() => {
        document.title = 'All Projects';
        async function getProjects() {
            // const data = await fetchDataWithParams(`projects`, { page: filter.page, count: 25 });
            let data = (await fetchDataWithParams('projects', 'post', {id: profile.id, fields: ['ProjectNo','ProjectTitle','ProjectStartDate', 'ProjectEndDate', 'TotalSanctionamount'], filters: filter}));
            console.log(data);
            
            if (data.reqStatus == 'success') {
                let l = [];
                data.projects.map((project, index) => (
                    l.push(
                        <React.Fragment key={project.ProjectNo}>
                            <div>{index + 1}</div>
                            <div>{project.ProjectTitle}</div>
                            <div>{project.TotalSanctionamount}</div>
                            <div>{project.fundedBy}</div>
                            <div>{project.ProjectStartDate.split('T')[0]}</div>
                            <div>{project.ProjectEndDate.split('T')[0]}</div>
                            <div className='allProjectsActions'>
                                <Link to={`/projects/${project.ProjectNo}`} title="View Project Details"><FaEdit size={20} /></Link>
                            </div>
                        </React.Fragment>
                    )
                ));
                setProjects(l);
                total.current = data.total;
                setLoading(false);
            }else{
                setLoading(false);
            }
        }
        getProjects();
    }, [filter]);
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='allProjectsContent'>
                    <h1>Projects </h1>
                    <PageControls page={filter.page} setPage={(page)=>setFilter({...filter, page: page})} total={total.current} max={25} />
                    <div id="filters">
                        <label>
                            Search:
                            <input type="text" placeholder="Search" value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} />
                        </label>
                        <label>
                            Status:
                            <select name="status" id="status" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>
                        <label>
                            Funded By:
                            <select name="fundedBy" id="fundedBy" value={filter.fundedBy} onChange={(e) => setFilter({ ...filter, fundedBy: e.target.value })}>
                                <option value="all">All</option>
                                <option value="Investor A">Investor A</option>
                                <option value="Investor B">Investor B</option>
                                <option value="Investor C">Investor C</option>
                            </select>
                        </label>
                        <label>
                            From Date:
                            <input type="date" id="fromDate" name="fromDate" placeholder="From Date" value={filter.fromDate} max={toDate} onChange={(e) => setFilter({ ...filter, fromDate: e.currentTarget.value })} />
                        </label>
                        <label>
                            To Date:
                            <input type="date" id="toDate" name="toDate" placeholder="To Date" value={filter.toDate} min={fromDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setFilter({ ...filter, toDate: e.currentTarget.value })} />
                        </label>
                        <label><input type="button" value="Apply" id='applyFilter' onClick={(e)=>filterData(e)} /></label>
                    </div>
                    <div id="allProjectsTable" className='table'>
                        <div className='tableTitle'>Sl.</div>
                        <div className='tableTitle'>Title</div>
                        <div className='tableTitle'>Capital</div>
                        <div className='tableTitle'>Funded By</div>
                        <div className='tableTitle'>Start Date</div>
                        <div className='tableTitle'>End Date</div>
                        <div className='tableTitle'>Action</div>
                        {projects}
                    </div>
                </div>
            }
        </>
    )
}

export default AllProjects;