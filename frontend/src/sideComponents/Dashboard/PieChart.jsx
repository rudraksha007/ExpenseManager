import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ title, labels, numbers }) {
    let col1 = [];
    let col2 = [];
    labels.forEach(element => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        col1.push(`rgb(${r},${g},${b})`);
        col2.push(`rgba(${r-10},${g-10},${b-10})`);
    });
    const data = {
        labels: labels, /* ["Red", "Blue", "Yellow"] */
        datasets: [
            {
                label: title,
                data: numbers,/* [12, 19, 3]*/
                backgroundColor: col1,
                hoverBackgroundColor: col2,
            },
        ],
    };

    return (
        <div>
            <h2>{title}</h2>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
