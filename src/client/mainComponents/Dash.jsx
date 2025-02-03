import { fetchDataWithParams } from '../assets/scripts';
import '../css/Dash.css';
import PieChart from '../sideComponents/Dashboard/PieChart';
import UserProjects from "../sideComponents/Dashboard/UserProjects";
import { useEffect, useState } from "react";
import Loading from '../assets/Loading';

function Dash() {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProjects() {
            setLoading(true);
            let data = (await fetchDataWithParams('projects', 'post', { fields: ['ProjectNo', 'ProjectTitle', 'TotalSanctionAmount', 'FundedBy', 'PIs'], filters: {} }));
            data = data.projects;
            setChartData(compile(data));
            setLoading(false);
        }
        fetchProjects();
    }, []);
    return (
        <>{
            loading ? <Loading position={'absolute'} /> :
                <div id='dashBody'>
                    <UserProjects />
                    <div className='dashSection'>
                        {Object.keys(chartData.projectFund).length > 0 ?
                            <PieChart title={'Project Fund'}
                                labels={Object.keys(chartData.projectFund)}
                                numbers={Object.values(chartData.projectFund)} />
                            :
                            <p style={{ color: 'red', fontStyle: 'italic', border: '1px solid black', padding: '10px', textAlign: 'center' }}>No data found for Project Fund</p>}
                    </div>
                    <div className="dashSection">
                        {Object.keys(chartData.PIFund).length > 0 ?
                            <PieChart title={'PI Fund'}
                                labels={Object.keys(chartData.PIFund)} numbers={Object.values(chartData.PIFund)} />
                            :
                            <p style={{ color: 'red', fontStyle: 'italic', border: '1px solid black', padding: '10px', textAlign: 'center' }}>No data found for PI Fund</p>}
                    </div>
                    <div></div>
                    <div className="dashSection" >
                        {Object.keys(chartData.AgencyFund).length > 0 ?
                            <PieChart title={'Agency Fund'}
                                labels={Object.keys(chartData.AgencyFund)}
                                numbers={Object.values(chartData.AgencyFund)} />
                            :
                            <p style={{ color: 'red', fontStyle: 'italic', border: '1px solid black', padding: '10px', textAlign: 'center' }}>No data found for Agency Fund</p>}
                    </div>
                </div>
        }</>
    );
}

export default Dash;

function compile(data) {
    let chartData = { projectFund: {}, PIFund: {}, AgencyFund: {} };
    data.forEach(project => {
        chartData.projectFund[project.ProjectTitle] = project.TotalSanctionAmount;
        let pis = [];
        try {
            pis = JSON.parse(project.PIs);
            if (!Array.isArray(pis)) {
                pis = [pis];
            }
        } catch (e) {
            console.error('Error parsing PIs:', e);
        }

        pis.forEach(Pi => {
            let pi = Pi;
            try {
                pi = JSON.parse(Pi);
            } catch (e) {
                // console.error('Error parsing individual PI:', e);
            }
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

    return chartData;
}