import React,{ useEffect, useState } from 'react';
import '../../css/UserProjects.css';
import { fetchDataWithParams } from '../../assets/scripts';
import { Oval } from 'react-loader-spinner';
import { ProfileContext } from '../../assets/UserProfile';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

function UserProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const {profile} = useContext(ProfileContext);
    useEffect(() => {
        async function fetchProjects() {
            let data = (await fetchDataWithParams('projects', 'post', {id: profile.id, fields: ['ProjectNo','ProjectTitle','ProjectStartDate']}));
            console.log(data);
            data = data.projects;
            let projectList = [];
            data.map((project, index) => (
                projectList.push(
                    <React.Fragment key={project.ProjectNo}>
                        <div>{index + 1}</div>
                        <div>{project.ProjectTitle}</div>
                        <div>{project.ProjectStartDate}</div>
                        <div className='hoverable' onClick={()=>navigate(`/projects/${project.id}`)}><Link to={`/projects/${project.id}`} title="View Project Details"><FaEdit size={20} /></Link></div>
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
                        <div className='tableTitle'>Action</div>
                        {projects}
                    </div>
                </>}
        </>
    )
}

export default UserProjects;