import React,{ useEffect, useState } from 'react';
import '../css/UserProjects.css';
import { fetchData } from '../assets/scripts';
import { Oval } from 'react-loader-spinner';

function UserProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProjects() {
            const data = (await fetchData('projects~1')).projects;
            let projectList = [];
            data.map((project, index) => (
                projectList.push(
                    <React.Fragment key={project.id}>
                        <div>{index + 1}</div>
                        <div>{project.title}</div>
                        <div>{project.startDate}</div>
                    </React.Fragment>
                )
            ));
            setProjects(projectList);
            setLoading(false);
        }
        fetchProjects();
    }, []);
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <>
                    <h2>Ongoing Projects</h2>
                    <div id="userProjectsTable">
                        <div className='tableTitle'>Sl.</div>
                        <div className='tableTitle'>Title</div>
                        <div className='tableTitle'>Since</div>

                        {projects}
                    </div>
                </>}
        </>
    )
}

export default UserProjects;