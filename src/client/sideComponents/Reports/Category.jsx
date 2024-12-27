import { formatNumber } from "chart.js/helpers";
import React from "react";

function Category({data}) {    
    return <div className='table' style={{width: '100%', gridTemplateColumns: '1fr 4fr repeat(8,3fr)', textAlign: 'center'}}>
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
                <div>{formatNumber(proj.TotalSanctionAmount)}</div>
                <div>{formatNumber(proj.ManpowerUsed)}</div>
                <div>{formatNumber(proj.ConsumablesUsed)}</div>
                <div>{formatNumber(proj.ContingencyUsed)}</div>
                <div>{formatNumber(proj.OverheadUsed)}</div>
                <div>{formatNumber(proj.EquipmentUsed)}</div>
                <div>{formatNumber(proj.TravelUsed)}</div>
                <div>{formatNumber(proj.RemainingAmount)}</div>
            </React.Fragment>
        })}
    </div>
}

export default Category;