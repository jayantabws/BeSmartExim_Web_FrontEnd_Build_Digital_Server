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



  const columnSelectorMap = {
    "HS Code": "hscode", 
    "Importer Name": "importer_name",
    "Total Quantity": "quantity",
    "Shipment Count": "shipment_count",
    "Total Value (USD)": "value_usd",
    "Value Share %": "share"
  };

  let columns = props.columnList.map((item, index) => {
    const col = { ...item };
    col.sortable = true;
    // Set selector explicitly based on mapping
    col.selector = columnSelectorMap[col.name] || col.name
      .replace(/\s*\(.*?\)\s*/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

    if (index !== 0 && col.width) {
      delete col.width;
    }

    // Add custom sort for numeric columns
    if (
      ["Total Quantity", "Total Value (USD)", "Value Share %", "Shipment Count"].includes(col.name)
    ) {
      col.sortField = col.selector;
      col.sortFunction = (rowA, rowB) => {
        const a = parseFloat((rowA[col.selector] || "0").toString().replace(/,/g, ""));
        const b = parseFloat((rowB[col.selector] || "0").toString().replace(/,/g, ""));
        return a - b;
      };
    }

    return col;
  });

  // --- modify column width for the first column only @sarbojitghosh22 26-6-2025 ---//


  const showTooltip = (row, event) => {

    setTooltipContent(event.target.textContent)
    setTooltipPosition({ top: event.clientY, left: event.clientX + 30 });

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
            // defaultSortField="id"
            // defaultSortField={columns[0]?.selector || "id"} // Use the first column's selector if available

            // defaultSortAsc={false}
            pagination
            dense
            onRowMouseLeave={(row, e) => setTooltipContent("")}
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
                padding: {
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
