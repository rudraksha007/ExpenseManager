import '../css/AllProjects.css';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { fetchData } from '../assets/scripts.js';

function AllProjects() {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function getProjects() {
            // const data = await fetchData('/api/projects');
            const data = [
                {
                    id: 1,
                    title: 'Project Alpha',
                    capital: 5000,
                    fundedBy: 'Investor A',
                    startDate: '2023-01-01',
                    endDate: '2023-12-31'
                },
                {
                    id: 2,
                    title: 'Project Beta',
                    capital: 10000,
                    fundedBy: 'Investor B',
                    startDate: '2023-02-01',
                    endDate: '2023-11-30'
                },
                {
                    id: 3,
                    title: 'Project Gamma',
                    capital: 7500,
                    fundedBy: 'Investor C',
                    startDate: '2023-03-01',
                    endDate: '2023-10-31'
                }
            ];
            if (data) {
                let l = [];
                data.map((project, index) => (
                    l.push(
                        <div className="projectTable" key={project.id}>
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
                        </div>
                    )
                ));
                setProjects(l);
            }
        }
        getProjects();
    }, []);
    return (
        <div id='allProjectContent'>
            <h1>Projects</h1>
            <div id="projectTitle">
                <div>Sl.</div>
                <div>Title</div>
                <div>Capital</div>
                <div>Funded By</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Action</div>
            </div>
            {projects}
        </div>
    )
}

export default AllProjects;