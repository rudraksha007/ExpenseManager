import React, { useEffect, useState } from "react";
import { fetchDataWithParams } from "../assets/scripts";
import Loading from '../assets/Loading';
import Category from "../sideComponents/Reports/Category";
import General from "../sideComponents/Reports/General";
import Save from "../sideComponents/Reports/Save";
import Yearly from "../sideComponents/Reports/Yearly";

function Report() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [type, setType] = useState('');
    const [projects, setProjects] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [projectNo, setProjectNo] = useState('');
    const [timer, setTimer] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        let projects = (await fetchDataWithParams('projects', 'post', { fields: ['ProjectNo', 'ProjectTitle', 'TotalSanctionAmount', 'FundedBy', 'PIs'], filters: {} }));
        if (projects.reqStatus != 'success') {
            alert('Unable to fetch projects');
        } else {
            setProjects(projects.projects.map(proj => {
                return { ProjectNo: proj.ProjectNo, ProjectTitle: proj.ProjectTitle }
            }
            ));
        }
        setLoading(false);
    }
    useEffect(() => {
        fetchProjects();
    }, [])

    useEffect(() => {
        if (!type) return;
        if (timer) clearTimeout(timer);
        setTimer(setTimeout(() => {
            load();
            setTimer(null);
        }, 500));
    }, [type, year, projectNo]);

    async function load() {
        if (type == 'yearly' && (!year || !projectNo)) { return; }
        setLoading(true);
        const data = await fetchDataWithParams('report', 'post', { reportType: type, year: year, ProjectNo: projectNo });
        console.log(data);
        if (data.reqStatus == 'success') {
            setData(data.data);
        } else {
            alert('Unable to generate report');
        }
        setLoading(false);
    }
    return (
        <>
            {loading ? <Loading position={'absolute'} /> :
                <div>
                    <form id="head" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, boxSizing: 'border-box', padding: 10 }}
                        onSubmit={(e) => load(e)}>
                        <label htmlFor="type">Select Category</label>
                        <select name="type" id="type" onChange={(e) => setType(e.target.value)} value={type}>
                            <option value="" disabled>Select</option>
                            <option value="general">General</option>
                            <option value="category">Category</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {type == 'yearly' ?
                            <>
                                <label htmlFor="projectNo">Select Project No</label>
                                <select name="projectNo" id="projectNo" value={projectNo} onChange={(e) => setProjectNo(e.target.value)}>
                                    <option value="" disabled>Select</option>
                                    {
                                        projects.map(proj => {
                                            return <option key={proj.ProjectNo} value={proj.ProjectNo}>{`(${proj.ProjectNo}) ${proj.ProjectTitle}`}</option>
                                        })
                                    }
                                </select>
                                <label htmlFor="year">Select Year</label>
                                <input type="number" id="year" name="year" min="2000" value={year} onChange={(e) => setYear(e.target.value)} />
                            </> : <></>}
                        {data ? <Save data={data} type={type} /> : <></>}
                    </form>
                    {!type || !data ? <></> :
                        type == 'category' ? <Category data={data} /> :
                            type == 'general' ? <General data={data} /> :
                                <Yearly data={data} />
                    }
                </div>
            }
        </>
    )
}

export default Report;
