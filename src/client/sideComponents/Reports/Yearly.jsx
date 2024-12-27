import { formatNumber } from "chart.js/helpers";
import React from "react";

function Yearly({data}){
    return (
        <div className='table' style={{ width: '100%', gridTemplateColumns: 'repeat(6,1fr)', textAlign: 'center' }}>
            <label className="tableTitle">Category</label>
            <label className="tableTitle">Allocation</label>
            <label className="tableTitle">Indented/proposed</label>
            <label className="tableTitle">Paid</label>
            <label className="tableTitle">Committed</label>
            <label className="tableTitle">Available</label>
            {data?.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        <div>{item.Category}</div>
                        <div>{formatNumber(item.Allocation)}</div>
                        <div>{formatNumber(item.IndentedProposed)}</div>
                        <div>{formatNumber(item.Paid)}</div>
                        <div>{formatNumber(item.Committed)}</div>
                        <div>{formatNumber(item.Available)}</div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default Yearly;