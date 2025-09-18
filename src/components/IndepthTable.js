import React, { useState, useEffect, Fragment } from 'react';
import * as Yup from "yup";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import moment from 'moment';
import Loader from '../components/Loader';
import 'react-tabs/style/react-tabs.css';
import "react-datepicker/dist/react-datepicker.css"
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css'


const AnalysisTable = (props) => {

const [tooltipContent, setTooltipContent] = useState("");
const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  let columns = []
  props.columnList.map((item,index)=>{
    item.sortable = true
    columns.push(item)
  })

  const showTooltip = (row, event ) => {

      setTooltipContent(event.target.textContent)
      setTooltipPosition({ top: event.clientY, left: event.clientX+30 });

   };

  return (
    <>
      <div className="container-fluid">

            <div >
                <DataTable
                className="table table-striped table-hover"
                columns={columns}
                data={props.dataList}
                // noHeader
                defaultSortField="id"
                defaultSortAsc={false}
                pagination
                dense
                onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                onRowMouseEnter={(row, e) => 
                  showTooltip(row, e) 
                }
                // progressPending={pendingIndPort}
                // progressComponent={<Loader />}
                />
                {tooltipContent && (                  
                    <span
                     style={{
                      position: "fixed",
                      background: "#000000",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      padding:{
                        top: "5px",
                        left: "5px",
                        right: "5px",
                        bottom: "5px",
                      },
                      top: tooltipPosition.top,
                      left: tooltipPosition.left,
                     }}
                    >
                       {tooltipContent}
                    </span>

                  )}
            </div>
      </div>


    </>
  );
}


export default AnalysisTable;
