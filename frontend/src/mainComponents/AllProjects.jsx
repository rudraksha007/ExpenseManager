import '../css/AllProjects.css';
import { data, Link } from 'react-router-dom';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { fetchData } from '../assets/scripts.js';
import React from 'react';
import { Oval } from 'react-loader-spinner';
import PageControls from '../sideComponents/PageControls';

function AllProjects() {

    const [projects, setProjects] = useState([]);
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
    const [fromDate, setFromDate] = useState(null);
    const [page, setPage] = useState(1);
    const total = useRef(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getProjects() {
            const data = await fetchData('projects');
            if (data) {
                let l = [];
                data.projects.map((project, index) => (
                    l.push(
                        <React.Fragment key={project.id}>
                            <div>{index + 1}</div>
                            <div>{project.title}</div>
                            <div>{project.capital}</div>
                            <div>{project.fundedBy}</div>
                            <div>{project.startDate}</div>
                            <div>{project.endDate}</div>
                            <div className='allProjectsActions'>
                                <Link to={`/projects/${project.id}`} title="View Project Details"><FaInfoCircle size={20} /></Link>
                                <Link to={`/projects/edit/${project.id}`} title="Edit Project"><FaEdit size={20} /></Link>
                            </div>
                        </React.Fragment>
                    )
                ));
                setProjects(l);
                total.current = data.projects.length;
                setLoading(false);
            }
        }
        getProjects();
    }, [page]);
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='allProjectsContent'>
                    <h1>Projects </h1>
                    <PageControls page={page} setPage={setPage} total={total.current} max={25} />
                    <div id="filters">
                        <label>
                            Search:
                            <input type="text" placeholder="Search" />
                        </label>
                        <label>
                            Status:
                            <select name="status" id="status">
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>
                        <label>
                            Funded By:
                            <select name="fundedBy" id="fundedBy">
                                <option value="all">All</option>
                                <option value="Investor A">Investor A</option>
                                <option value="Investor B">Investor B</option>
                                <option value="Investor C">Investor C</option>
                            </select>
                        </label>
                        <label>
                            From Date:
                            <input type="date" id="fromDate" name="fromDate" placeholder="From Date" max={toDate} onChange={(e) => setFromDate(e.currentTarget.value)} />
                        </label>
                        <label>
                            To Date:
                            <input type="date" id="toDate" name="toDate" placeholder="To Date" min={fromDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setToDate(e.currentTarget.value)} />
                        </label>
                        <label><input type="button" value="Apply" id='applyFilter' /></label>
                    </div>
                    <div id="allProjectsTable">
                        <div className='allProjectsTableTitle'>Sl.</div>
                        <div className='allProjectsTableTitle'>Title</div>
                        <div className='allProjectsTableTitle'>Capital</div>
                        <div className='allProjectsTableTitle'>Funded By</div>
                        <div className='allProjectsTableTitle'>Start Date</div>
                        <div className='allProjectsTableTitle'>End Date</div>
                        <div className='allProjectsTableTitle'>Action</div>
                        {projects}

                    </div>
                </div>
            }
        </>
    )
}

export default AllProjects;