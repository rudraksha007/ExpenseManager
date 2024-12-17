import { Oval } from 'react-loader-spinner';
import { fetchData, fetchDataWithParams } from '../assets/scripts';
import '../css/Dash.css';
import PieChart from '../sideComponents/Dashboard/PieChart';
import UserProjects from "../sideComponents/Dashboard/UserProjects";
import { useEffect, useState } from "react";

function Dash() {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProjects() {
            setLoading(true);
            let data = (await fetchDataWithParams('projects', 'post', { fields: ['ProjectNo','ProjectTitle', 'TotalSanctionAmount', 'FundedBy', 'PIs'], filters: {} }));
            console.log(data);
            data = data.projects;
            setChartData(compile(data));
            setLoading(false);
        }
        fetchProjects();
    }, []);
    return (
        <div id='dashBody'>
            <UserProjects />
            <div className='dashSection' id='dashProjectAllocationChart' style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center'}}>
                {
                    loading ? <Oval color='#000' size={50} /> :
                        <>
                            {Object.keys(chartData.projectFund).length > 0 ? 
                                <PieChart title={'Project Fund'} 
                                labels={Object.keys(chartData.projectFund)} 
                                numbers={Object.values(chartData.projectFund)} /> 
                                : 
                                <p style={{ color: 'red', fontStyle: 'italic', border: '1px solid black', padding: '10px', textAlign: 'center' }}>No data found for Project Fund</p>}

                            {Object.keys(chartData.PIFund).length > 0 ? 
                                <PieChart title={'PI Fund'} 
                                labels={Object.keys(chartData.PIFund)} numbers={Object.values(chartData.PIFund)} /> 
                                : 
                                <p style={{ color: 'red', fontStyle: 'italic', border: '1px solid black', padding: '10px', textAlign: 'center' }}>No data found for PI Fund</p>}
                            {Object.keys(chartData.AgencyFund).length > 0 ? 
                                <PieChart title={'Agency Fund'} 
                                labels={Object.keys(chartData.AgencyFund)} 
                                numbers={Object.values(chartData.AgencyFund)} /> 
                                : 
                                <p style={{ color: 'red', fontStyle: 'italic', border: '1px solid black', padding: '10px', textAlign: 'center' }}>No data found for Agency Fund</p>}
                        </>
                }
            </div>
        </div>
    );
}

export default Dash;

function compile(data) {
    let chartData = {projectFund: {}, PIFund: {}, AgencyFund: {}};
    console.log(data);
    
    data.forEach(project => {
        chartData.projectFund[project.ProjectTitle] = project.TotalSanctionAmount;
        project.PIs.forEach(pi => {       
            pi = JSON.parse(pi); 
            if (chartData.PIFund[`${pi.name}(${pi.id})`]) {
            chartData.PIFund[`${pi.name}(${pi.id})`] += project.TotalSanctionAmount;
            } else {
            chartData.PIFund[`${pi.name}(${pi.id})`] = project.TotalSanctionAmount;
            }
        });

        const strippedFundedBy = project.FundedBy.trim();
        if (chartData.AgencyFund[strippedFundedBy]) {
            chartData.AgencyFund[strippedFundedBy] += project.TotalSanctionAmount;
        } else {
            chartData.AgencyFund[strippedFundedBy] = project.TotalSanctionAmount;
        }
    });
    console.log(Object.keys(chartData.PIFund));
    console.log(Object.values(chartData.PIFund));
    
    return chartData;
}