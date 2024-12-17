import React, { useEffect, useState } from 'react';
import '../../css/UserProjects.css';
import { fetchDataWithParams } from '../../assets/scripts';
import { Oval } from 'react-loader-spinner';
import { ProfileContext } from '../../assets/UserProfile';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import Loading from '../../assets/Loading';

function UserProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { profile } = useContext(ProfileContext);
    useEffect(() => {
        async function fetchProjects() {
            let data = (await fetchDataWithParams('projects', 'post', { id: profile.id, fields: ['ProjectNo', 'ProjectTitle', 'ProjectStartDate', 'ProjectEndDate', 'PIs'], filters: {} }));
            data = data.projects;
            let projectList = data.map((project, index) => (
                <React.Fragment key={project.ProjectNo}>
                    <div>{index + 1}</div>
                    <div>{project.ProjectTitle}</div>
                    <div>{new Date(project.ProjectEndDate) >= new Date() ? 'Active' : 'Inactive'}</div>
                    <div>{profile.role!=='Pi'?profile.role:project.PIs.includes(JSON.stringify({id:profile.id, name: profile.name}))?'PI':'CoPI'}</div>
                    <div className='hoverable'><Link to={`/projects/${project.ProjectNo}`} title="View Project Details"><FaEdit size={20} /></Link></div>
                </React.Fragment>

            ));
            setProjects(projectList);
            setLoading(false);
        }
        fetchProjects();
    }, []);
    return (
        <>

            {loading ? <Loading/>:
                <div className="dashSection" id="dashUserProjects">
                    <h2>Projects</h2>
                    <div className='table' style={{ gridTemplateColumns: '1fr 5fr 3fr 3fr 3fr', maxHeight:'60dvh', overflowY:'auto' }}>
                        <div className='tableTitle'>Sl.</div>
                        <div className='tableTitle'>Title</div>
                        <div className='tableTitle'>Role</div>
                        <div className='tableTitle'>Status</div>
                        <div className='tableTitle'>Action</div>
                        {projects}
                    </div>
                </div>}
        </>
    )
}

export default UserProjects;