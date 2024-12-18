import React, { useEffect, useState } from "react";
import { fetchDataWithParams } from "../assets/scripts";
import Loading from '../assets/Loading';

function Report() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [type, setType] = useState('');
    useEffect(()=>{
        if(!type)return;
        load();
    }, [type])
    async function load() {
        setLoading(true);
        const data = await fetchDataWithParams('report', 'post', { reportType: type });
        if (data.reqStatus == 'success') {            
            setData(data.data);            
        } else {
            alert('Unable to generate report');
        }
        setLoading(false);
    }
    return (
        <>
            {loading ? <Loading position={'absolute'}/> :
                <div>
                    <form id="head" style={{width:'100%', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:5, boxSizing: 'border-box', padding: 10}} 
                    onSubmit={(e)=>load(e)}>
                        <div></div>
                        <label htmlFor="type">Select Category</label>
                        <select name="type" id="type" onChange={(e)=>setType(e.target.value)} value={type}>
                            <option value="" disabled>Select</option>
                            <option value="general">General</option>
                            <option value="category">Category</option>
                        </select>
                    </form>
                    {!type?<></>:
                    type=='category'?
                    <div className='table' style={{width: '100%', gridTemplateColumns: '1fr 4fr repeat(8,3fr)', textAlign: 'center'}}>
                        <label className="tableTitle">Sl.</label>
                        <label className="tableTitle">Project Title</label>
                        <label className="tableTitle">Total Sanction</label>
                        <label className="tableTitle">Manpower Used</label>
                        <label className="tableTitle">Consumable Used</label>
                        <label className="tableTitle">Contingency Used</label>
                        <label className="tableTitle">Overhead Used</label>
                        <label className="tableTitle">Equipment Used</label>
                        <label className="tableTitle">Travel Used</label>
                        <label className="tableTitle">Remaining Amount</label>
                        {data.map((proj, i)=>{
                            return <React.Fragment key={i}>
                                <div>{i+1}</div>
                                <div>{proj.ProjectTitle}</div>
                                <div>{proj.TotalSanctionAmount}</div>
                                <div>{proj.ManpowerUsed}</div>
                                <div>{proj.ConsumablesUsed}</div>
                                <div>{proj.ContingencyUsed}</div>
                                <div>{proj.OverheadUsed}</div>
                                <div>{proj.EquipmentUsed}</div>
                                <div>{proj.TravelUsed}</div>
                                <div>{proj.RemainingAmount}</div>
                            </React.Fragment>
                        })}
                    </div>
                    :
                    <div className='table' style={{width: '100%', gridTemplateColumns: '1fr 4fr repeat(3,3fr)', textAlign: 'center'}}>
                        <label className="tableTitle">Sl.</label>
                        <label className="tableTitle">Project Title</label>
                        <label className="tableTitle">Total Sanction</label>
                        <label className="tableTitle">Total Indent</label>
                        <label className="tableTitle">Remaining Amount</label>
                        {data.map((proj, i)=>{
                            return <React.Fragment key={i}>
                                <div>{i+1}</div>
                                <div>{proj.ProjectTitle}</div>
                                <div>{proj.TotalSanctionAmount}</div>
                                <div>{proj.TotalIndentAmount}</div>
                                <div>{proj.RemainingAmount}</div>
                            </React.Fragment>
                        })}
                    </div>
                    }
                </div>
            }
        </>
    )
}

export default Report;
