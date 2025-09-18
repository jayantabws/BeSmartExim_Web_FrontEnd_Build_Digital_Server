import React, { useState, useEffect, useRef } from 'react';
// import { saveAs } from 'file-saver'; 
import { exportComponentAsPNG } from 'react-component-export-image';
import { Chart as ChartJS, ArcElement, Tooltip, Legend,CategoryScale, LinearScale, BarElement,Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale,  BarElement, Title);

const GraphBar = (props) => {
    const graphRef = useRef();
    const colorCode = props.colorCode ? props.colorCode : "53,162,235"
    const XaxixLabel = props.xAxixLabel ? props.xAxixLabel : ""

    const barData =
    {
        labels: props.labels,
        datasets: [
            {
                label: props.dataLabel,
                data: props.data,
                backgroundColor: `rgba(${colorCode}, 0.5)`,
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
                    text: XaxixLabel,
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

    // console.log("barData", barData);
    return (
        <>
            <a className="downloadGraph" onClick={() => { saveGraph() }}><i className='fa fa-download'></i></a>
            <div ref={graphRef}>
            <Bar options={barOptions} data={barData} />
            </div>
        </>
    )

}
export default GraphBar;