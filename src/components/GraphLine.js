import React, { useState, useEffect, useRef } from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { exportComponentAsPNG } from 'react-component-export-image';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphLine = (props) => {
    const graphRef = useRef();
    const colorCode = props.colorCode ? props.colorCode : "53,162,235"
    const barData =
    {
        labels: props.labels,
        datasets: [
            {
                label: '',
                data: props.data,
                backgroundColor: `rgba(${colorCode}, 0.5)`,
                borderColor: `rgba(${colorCode}, 0.5)`
            },
        ],
    };
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
              display: false,
            },
            title: {
                display: true,
                text: props.barTitle,
            },
        },
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: "Value in USD",
                    font: {
                        size: 15
                    }
                },
                ticks: {
                    precision: 0
                }
            },
            xAxes: {
                title: {
                    display: true,
                    text: "Month",
                    font: {
                        size: 15
                    }
                }
            }
        },
    };

    const saveGraph =()=> {
        exportComponentAsPNG(graphRef);
    }

    return(
        <>
        <a className="downloadGraph" onClick={() => { saveGraph() }}><i className='fa fa-download'></i></a>
        <div ref={graphRef}>
            <Line options={barOptions} data={barData} />
        </div>
        </>
    )
}

export default GraphLine