import Userinfobar from "../sideComponents/Dashboard/UserInfo";
import '../css/Dash.css';
import UserProjects from "../sideComponents/Dashboard/UserProjects";
import { useEffect } from "react";

function Dash() {
    useEffect(() => {
        document.title = 'Project Management System';
    },[]);
    return (
        <div id='dashBody'>
            <div className="dashSection" id="dashUserProjects"  style={{height:'90%', width:'50%'}}><UserProjects/></div>
            {/* <div className="dashSection" id='dashUserInfo' style={{height:'fit-content'}}><Userinfobar /></div> */}
        </div>
    );
}

export default Dash;