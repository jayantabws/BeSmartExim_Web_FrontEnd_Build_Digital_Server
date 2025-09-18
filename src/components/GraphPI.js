import React, { useState, useEffect, useRef } from 'react';
// import { saveAs } from 'file-saver'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { exportComponentAsPNG } from 'react-component-export-image';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const GraphPI = (props) => {
    const graphRef = useRef();
    const saveGraph = () => {
        //save to png
        // const canvasSave = document.getElementById('pieChart');
        // canvasSave.toBlob(function (blob) {
        //     saveAs(blob, "chart.png")
        // })
        exportComponentAsPNG(graphRef);
    }

    const dataPI = {
        labels: props.labels,
        datasets: [
            {
                label: '# of Votes',
                data: props.data,
                backgroundColor: [
                    '#ece0b4',
                    '#32607e',
                    '#eba86f',
                    '#009fbf',
                    '#00a0c0',
                    '#c4cfd9',
                    '#df6552',
                    '#00e5f2',
                    '#73af83',
                    '#0089ac',
                    '#42f575'
                ],
                borderColor: [
                    '#ece0b4',
                    '#32607e',
                    '#eba86f',
                    '#009fbf',
                    '#00a0c0',
                    '#c4cfd9',
                    '#df6552',
                    '#00e5f2',
                    '#73af83',
                    '#0089ac',
                    '#42f575'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins:{
        maintainAspectRatio: true,
        showDatasetLabels : true,
        responsive: true,       
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontFamily: "myriadpro-regular",
                    boxWidth: 15,
                    boxHeight: 3,
                    padding: 10
                  },
            },
            title: {
                display: true,
                text: props.barTitle,
            },
            datalabels: {
                display: true,
                align: 'bottom',
                backgroundColor: '#ccc',
                borderRadius: 3,
                font: {
                  size: 18,
                },
            },
        }
    }       


    return (
        <>
            <a className="downloadGraph" onClick={() => { saveGraph() }}><i className='fa fa-download'></i></a>
            <div ref={graphRef} style={{width:'450px'}}>
                <Pie id="pieChart" data={dataPI} options={options} />
            </div>
        </>
    )

}
export default GraphPI;