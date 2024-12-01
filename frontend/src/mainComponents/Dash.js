import Userinfobar from "../sideComponents/UserInfo";
import '../css/Dash.css'
import UserProjects from "../sideComponents/UserProjects";
import { useNavigate } from "react-router-dom";

function Dash() {
    const navigate = useNavigate();
    return (
        <div id='dashBody'>
            <div className="dashSection" id='dashUserInfo'><Userinfobar /></div>
            <div className="dashSection hoverable" id="dashUserProjects" onClick={()=>navigate('/projects')}><UserProjects/></div>
        </div>
    );
}

export default Dash;