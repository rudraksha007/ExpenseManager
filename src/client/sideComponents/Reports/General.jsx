import { formatNumber } from "chart.js/helpers";
import React from "react";

function General({ data }) {
    return (
        <div className='table' style={{ width: '100%', gridTemplateColumns: '1fr 4fr repeat(3,3fr)', textAlign: 'center' }}>
            <label className="tableTitle">Sl.</label>
            <label className="tableTitle">Project Title</label>
            <label className="tableTitle">Total Sanction</label>
            <label className="tableTitle">Total Indent</label>
            <label className="tableTitle">Remaining Amount</label>
            {data?.map((proj, i) => {
                return <React.Fragment key={i}>
                    <div>{i + 1}</div>
                    <div>{proj.ProjectTitle}</div>
                    <div>{formatNumber(proj.TotalSanctionAmount)}</div>
                    <div>{formatNumber(proj.TotalIndentAmount)}</div>
                    <div>{formatNumber(proj.RemainingAmount)}</div>
                </React.Fragment>
            })}
        </div>
    )
}

export default General;