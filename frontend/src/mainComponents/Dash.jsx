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
            let data = (await fetchDataWithParams('projects', 'post', { fields: ['ProjectTitle', 'TotalSanctionAmount', 'FundedBy', 'PIName'], filters: {} }));
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
            <div className='dashSection' id='dashProjectAllocationChart' style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                {
                    loading ? <Oval color='#000' size={50} /> :
                        <>
                            <PieChart title={'Pie Chart'} labels={Object.keys(chartData.projectFund)} numbers={Object.values(chartData.projectFund)} />
                            <PieChart title={'Pie Chart'} labels={Object.keys(chartData.PIFund)} numbers={Object.values(chartData.PIFund)} />
                            <PieChart title={'Pie Chart'} labels={Object.keys(chartData.AgencyFund)} numbers={Object.values(chartData.AgencyFund)} />
                            
                        </>
                }
            </div>
        </div>
    );
}

export default Dash;

function compile(data) {
    let chartData = {projectFund: {}, PIFund: {}, AgencyFund: {}};
    data.forEach(project => {
        chartData.projectFund[project.ProjectTitle] = project.TotalSanctionAmount;
        project.PIName.split(',').forEach(pi => {
            const strippedPI = pi.trim();
            if (chartData.PIFund[strippedPI]) {
            chartData.PIFund[strippedPI] += project.TotalSanctionAmount;
            } else {
            chartData.PIFund[strippedPI] = project.TotalSanctionAmount;
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