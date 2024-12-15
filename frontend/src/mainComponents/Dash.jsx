import '../css/Dash.css';
import PieChart from '../sideComponents/Dashboard/PieChart';
import UserProjects from "../sideComponents/Dashboard/UserProjects";
import { useEffect } from "react";

function Dash() {
    useEffect(() => {
        document.title = 'Project Management System';
    },[]);
    return (
        <div id='dashBody'>
            <div className="dashSection" id="dashUserProjects" ><UserProjects/></div>
            <div className='dashSection' id='dashProjectAllocationChart'>
                <PieChart title={'Pie Chart'} labels={['l1', 'l2', 'l3']} numbers={[10,20,30]}/>
                <PieChart title={'Pie Chart 2'} labels={['l4', 'l5', 'l6']} numbers={[40,50,60]}/>
                <PieChart title={'Pie Chart 3'} labels={['l7', 'l8', 'l9']} numbers={[70,80,90]}/>
                <PieChart title={'Pie Chart 4'} labels={['l10', 'l11', 'l12']} numbers={[100,110,120]}/>
            </div>
        </div>
    );
}

export default Dash;