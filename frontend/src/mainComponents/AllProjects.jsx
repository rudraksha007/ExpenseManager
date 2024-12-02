import '../css/AllProjects.css';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';

function AllProjects() {
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
            <div id="projectTable">
                <div>1</div>
                <div>Title1</div>
                <div>1000</div>
                <div>The fuuu</div>
                <div>Anytime</div>
                <div>Sometime</div>
                <div className='allProjectsActions'>
                    <Link to='/projects/abc' title="View Project Details"><FaInfoCircle size={20} /></Link>
                    <Link to='/projects/edit/abc' title="Edit Project"><FaEdit size={20} /></Link>
                </div>
            </div>
        </div>
    )
}

export default AllProjects;