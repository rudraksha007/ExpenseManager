import Userinfobar from "../sideComponents/UserInfo";
import '../css/Dash.css';
import UserProjects from "../sideComponents/UserProjects";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Dash() {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Project Management System';
    },[]);
    return (
        <div id='dashBody'>
            <div className="dashSection" id='dashUserInfo'><Userinfobar /></div>
            <div className="dashSection hoverable" id="dashUserProjects" onClick={()=>navigate('/projects')}><UserProjects/></div>
        </div>
    );
}

export default Dash;