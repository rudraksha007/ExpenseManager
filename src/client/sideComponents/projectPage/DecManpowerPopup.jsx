import React, { useContext, useEffect, useState } from 'react';
import '../../css/Popup.css';
import { FaTimes } from 'react-icons/fa';
import { fetchData, fetchDataWithParams } from '../../assets/scripts';
import { Oval } from 'react-loader-spinner';
import { closePopup } from '../../assets/popup';
import { ProjectContext } from '../../assets/ProjectData';

function DecManpowerPopup({ reset }) {
    const today = new Date().toISOString().split('T')[0];
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ind, setInd] = useState('Dummy Indent');
    const {project} = useContext(ProjectContext);
    useEffect(() => {
        async function getProfiles() {
            if (project.workers) {
                let l = [];
                project.workers.map((profile, index) => (
                    l.push(
                        <React.Fragment key={profile.id}>
                            <div><input type="checkbox" value={profile.id}/></div>
                            <div>{profile.name}</div>
                            <div>{profile.id}</div>
                        </React.Fragment>
                    )
                ));
                // setInd(fetchDataWithParams('projects', {projectId: project.id, action: 'dec'}).indentId);
                setProfiles(l);
            }
            setLoading(false);
        }
        getProfiles();
    }, []);
    return (
        <div className='projectPopup'>
            <div className="projectPopupCont" id='largePopupCont'>
                <>
                    {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                        <>
                            <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => closePopup(e, reset)} />
                            <h2>Decrease Manpower</h2>
                            <form className='largePopupForm'>
                                <div className='largePopupDetails'>
                                    <label htmlFor="date">Date:</label>
                                    <input type="date" id="date" name="date" max={today} required />
                                    <label htmlFor="ProjectNo">Project No:</label>
                                    <input type="number" id="ProjectNo" name="ProjectNo" disabled value={project.ProjectNo} />

                                    <label htmlFor="ProjectTitle">Project Title:</label>
                                    <input type="text" id="ProjectTitle" name="ProjectTitle" disabled value={project.ProjectTitle} />
                                    <label htmlFor="indentId">Indent ID:</label>
                                    <input type="text" id="indentId" name="indentId" disabled value={ind} />
                                </div>
                                <div className='largePopupOptions'>
                                    <div className="tableTitle">Tick</div>
                                    <div className="tableTitle">Name</div>
                                    <div className="tableTitle">Emp ID</div>
                                    {profiles}
                                </div>
                            </form>
                            <button type="submit" form='decManpowerForm' className='hoverable'>Submit</button>
                        </>
                    }
                </>
            </div>
        </div>
    );
};

export default DecManpowerPopup;