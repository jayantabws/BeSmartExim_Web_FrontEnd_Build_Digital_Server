import React, { useState, useEffect, Fragment } from 'react';
import Axios from '../shared/Axios';
import AxiosMaster from "../shared/AxiosMaster";
import { Field, Formik, FieldArray } from 'formik';
import { Form, FormGroup, Row, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Yup from "yup";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import moment from 'moment';
import Loader from '../components/Loader';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import GraphPI from '../components/GraphPI';
import GraphBar from '../components/GrapghBar';
import GraphLine from '../components/GraphLine';
import { TagsInput } from "react-tag-input-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css'
import { useHistory, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loaderStart, loaderStop } from "../store/actions/loader";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import AnalysisTable from '../components/IndepthTable'
import AdvanceSearch from '../components/AdvanceSearch';
import Draggable from 'react-draggable';
import BlankImg from '../assets/image/BlankImg.png'

const dateFormat = "YYYY-MM-DD";

let initialValues = {
  tradeType: "",
  searchBy: "",
  searchValue: "",
  countryCode: "",
  fromDate: "",
  toDate: "",
  matchType: ""
};

//let monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const validateForm = Yup.object().shape({
  tradeType: Yup.string().required("Please select trade type"),
  searchBy: Yup.string().required("This field is required"),
  // searchValue: Yup.string().required("This field is required"),
  countryCode: Yup.string().required("This field is required"),
  fromDate: Yup.string().required("This field is required"),
  toDate: Yup.string().required("This field is required"),
});


const conditionalRowStyles = [
  {
    when: row => (row.importer_name == "OTHERS" || row.exporter_name == "OTHERS" || row.port_name == "OTHERS" 
    || row.hscode == "OTHERS" || row.country_name == "OTHERS" || row.port_name == "OTHERS" || row.city_name == "OTHERS"),
    style: {
    			backgroundColor: 'rgba(63, 195, 128, 0.9)',
    			color: 'white',
          cursor: 'pointer',
    			'&:hover': {
    				cursor: 'pointer',
    			},
    		},
  },
  {
    when: row => (row.importer_name == "TOTAL" || row.exporter_name == "TOTAL" || row.port_name == "TOTAL" 
    || row.hscode == "TOTAL" || row.country_name == "TOTAL" || row.port_name == "TOTAL" || row.city_name == "TOTAL"),
    style: {
    			backgroundColor: 'rgba(242, 38, 19, 0.9)',
    			color: 'white',
    			'&:hover': {
    				cursor: 'pointer',
    			},
    		},
  }

]


const Analysis = (props) => {

const search_id = props.location.state ? props.location.state.search_id : null ;
const importerForExport = props.location.state ? props.location.state.importerForExport : null ;
const exporterForImport = props.location.state ? props.location.state.exporterForImport : null ;


const [tooltipContent, setTooltipContent] = useState("");
const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })


const showTooltip = (row, event ) => {

// console.log("row ================= ", row)
  // console.log("event ================= ", event.target.textContent)
  if ((row.importer_name == "OTHERS" || row.exporter_name == "OTHERS" || row.port_name == "OTHERS" 
    || row.hscode == "OTHERS" || row.country_name == "OTHERS" || row.port_name == "OTHERS" || row.city_name == "OTHERS") || 
    (row.importer_name == "TOTAL" || row.exporter_name == "TOTAL" || row.port_name == "TOTAL" 
    || row.hscode == "TOTAL" || row.country_name == "TOTAL" || row.port_name == "TOTAL" || row.city_name == "TOTAL") )
    {
      setTooltipContent("")
      setTooltipPosition({ top: 0, left: 0 });
    }
    else
    {
      setTooltipContent(event.target.textContent)
      setTooltipPosition({ top: event.clientY, left: event.clientX+30 });
    }
};


const fetchSearchQuery = () => {
  if (search_id) {
    props.loadingStart()
    let queryBuilderSuggestionList = []
    Axios({
      method: "GET",
      url: `/search-management/search/details`,
      params: { searchId: search_id }
    })
      .then(res => {
        if (res.data.queryList) {
          let sParams = res.data.queryList[0].userSearchQuery;
          initialValues = {
            ...initialValues,
            tradeType: sParams.tradeType,
            matchType: sParams.matchType,
            searchBy: sParams.searchBy,
            searchValue: sParams.searchValue,
            countryCode: sParams.countryCode,
            fromDate: sParams.fromDate ? new Date(sParams.fromDate) : "",
            toDate: sParams.toDate ? new Date(sParams.toDate) : "" ,
            portOriginList: sParams.portOriginList,
            portDestinationList: sParams.portDestinationList,
            hsCode4DigitList: sParams.hsCode4DigitList,
            importerList: sParams.importerList,
            exporterList: sParams.exporterList,
            cityOriginList: sParams.cityOriginList,
            cityDestinationList: sParams.cityDestinationList,
            queryBuilder: sParams.queryBuilder,
            hsCodeList: sParams.hsCodeList,
            shipmentModeList: sParams.shipModeList ? sParams.shipModeList : [],
            stdUnitList: sParams.stdUnitList ? sParams.stdUnitList : [],
          };
          setSearchValue(sParams.searchValue)
          if(sParams.queryBuilder && sParams.queryBuilder.length > 0) {

            sParams.queryBuilder.map((newitem,newindex)=> {
              queryBuilderSuggestionList[newindex] = newitem.searchValue
            })
          }
          setQueryBuilderSearchValue(queryBuilderSuggestionList)
          handleSearch(sParams);    
          sParams.tradeType == "IMPORT" ? getTradingCountryList("I") : getTradingCountryList("E")  

        }
      })
      .catch(err => {
        // console.log("Err", err);
      });
  }
}

  const history = useHistory();

  const [toggle, setToggle] = useState(false);
  const [pendingImport, setPendingImport] = useState(true);
  const [pendingExport, setPendingExport] = useState(true);
  const [searchParams, setSearchParams] = useState();
  const [importerDataList, setImporterDataList] = useState([]);
  const [exporterDataList, setExporterDataList] = useState([]);
  const [pendingIndPort, setPendingIndPort] = useState(true);
  const [indianPortDataList, setIndianPortDataList] = useState([]);
  const [pendingForPort, setPendingForPort] = useState(true);
  const [forPortDataList, setForPortDataList] = useState([]);
  const [pendingHSCode, setPendingHSCode] = useState(true);
  const [hsCodeDataList, setHSCodeDataList] = useState([]);
  const [pendingCountry, setPendingCountry] = useState(true);
  const [countryDataList, setCountryDataList] = useState([]);
  const [pendingCity, setPendingCity] = useState(true);
  const [cityDataList, setCityDataList] = useState([]);
  const [tradeCountryList, setTradeCountryList] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [monthWise, setMonthWiseList] = useState([]);
  const [monthWiseDataList, setMonthWiseDataList] = useState([]);
  const [queryBuilderSearchValue, setQueryBuilderSearchValue] = useState([]);
  const [importerDataLT, setImporterDataLT] = useState([]);
  const [exporterDataLT, setExportertDataLT] = useState([]);
  const [indianPortDataLT, setIndianPortDataLT] = useState([]);
  const [forPortDataLT, setForPortDataLT] = useState([]);
  const [hsCodeDataLT, setHSCodeDataLT] = useState([]);
  const [countryDataLT, setCountryDataLT] = useState([]);
  const [cityDataLT, setCityDataLT] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newModalColumn, setNewModalColumn] = useState([]);
  const [newModalData, setNewModalData] = useState([]);

  const [portOriginList, setPortOriginList] = useState([]);
  const [portOriginDataArray, setPortOriginDataArray] = useState([]);
  const [portDestinationDataArray, setPortDestinationDataArray] = useState([]);
  const [portDestinationList, setPortDestinationList] = useState([]);
  const [countryOriginList, setCountryOriginList] = useState([]);
  const [countryDestinationList, setCountryDestinationList] = useState([]);
  const [cityOriginList, setCityOriginList] = useState([]);
  const [cityDestinationList, setCityDestinationList] = useState([]);
  const [shipmentModeDataArray, setShipmentModeDataArray] = useState([]);
  const [shipmentModeList, setShipmentModeList] = useState([]);
  const [hsCode4DigitList, setHsCode4digitList] = useState([])
  const [hsCode4digitDataArray, setHsCode4digitDataArray] = useState([])
  const [stdUnitDataArray, setStdUnitDataArray] = useState([]);
  const [stdUnitList, setStdUnitList] = useState([]);
  
  const [importerList, setImporterList] = useState([]);
  const [importerDataArray, setImporterDataArray] = useState([]);
  const [exporterList, setExporterList] = useState([]);
  const [exporterDataArray, setExporterDataArray] = useState([]);
  const [hsCodeList, setHsCodeList] = useState([]);
  const [hsCodeDataArray, setHsCodeDataArray] = useState([]);


  const monthWiseColumns = [
    {
      name: "Month Name",
      selector: row => row.month_name,
      sortable: false
    },
    {
      name: "Total Quantity",
      selector: row => row.quantity,
      sortable: false,
      conditionalCellStyles: [
        {
            when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0 ,
            style: {
              color: "transparent",
              textShadow: "0 0 8px #000",
            },
        },
      ]
    },
    {
      name: "Shipment Count",
      selector: row => row.shipment_count,
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => row.value_usd,
      sortable: false
    },
  ];
  
  const importerColumns = [
    {
      name: "Importer Name",
      selector: row => row.importer_name,
      sortable: false
    },
    {
      name: "Total Quantity",
      selector: row => row.quantity,
      sortable: false,
      conditionalCellStyles: [
        {
            when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
            style: {
              color: "transparent",
              textShadow: "0 0 8px #000"
            },
        },
      ]
    },
    {
      name: "Shipment Count",
      selector: row => row.shipment_count,
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => row.value_usd,
      sortable: false
    },
    {
      name: "Value Share %",
      selector: row => row.share,
      sortable: false,
      // cell: d => <span>{d.genres.join(", ")}</span>
    }
  ];
  
  const exporterColumns = [
    {
      name: "Exporter Name",
      selector: row => row.exporter_name,
      sortable: false
    },
    {
      name: "Total Quantity",
      selector: row => row.quantity,
      sortable: false,
      conditionalCellStyles: [
        {
            when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
            style: {
              color: "transparent",
              textShadow: "0 0 8px #000"
            },
        },
      ]
    },
    {
      name: "Shipment Count",
      selector: row => row.shipment_count,
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => row.value_usd,
      sortable: false
    },
    {
      name: "Value Share %",
      selector: row => row.share,
      sortable: false,
    }
  ];
  
  const portColumns = [
    {
      name: "Port Name",
      selector: row => row.port_name,
      sortable: false
    },
    {
      name: "Total Quantity",
      selector: row => row.quantity,
      sortable: false,
      conditionalCellStyles: [
        {
            when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
            style: {
              color: "transparent",
              textShadow: "0 0 8px #000"
            },
        },
      ]
    },
    {
      name: "Shipment Count",
      selector: row => row.shipment_count,
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => row.value_usd,
      sortable: false
    },
    {
      name: "Value Share %",
      selector: row => row.share,
      sortable: false,
    }
  ];
  const hsCodeColumns = [
    {
      name: "HS Code",
      selector: row => row.hscode,
      sortable: false
    },
    {
      name: "Total Quantity",
      selector: row => row.quantity,
      sortable: false,
      conditionalCellStyles: [
        {
            when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
            style: {
              color: "transparent",
              textShadow: "0 0 8px #000"
            },
        },
      ]
    },
    {
      name: "Shipment Count",
      selector: row => row.shipment_count,
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => row.value_usd,
      sortable: false
    },
    {
      name: "Value Share %",
      selector: row => row.share,
      sortable: false,
    }
  ];
  const countryColumns = [
    {
      name: "Country Name",
      selector: row => row.country_name,
      sortable: false
    },
    {
      name: "Total Quantity",
      selector: row => row.quantity,
      sortable: false,
      conditionalCellStyles: [
        {
            when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
            style: {
              color: "transparent",
              textShadow: "0 0 8px #000"
            },
        },
      ]
    },
    {
      name: "Shipment Count",
      selector: row => row.shipment_count,
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => row.value_usd,
      sortable: false
    },
    {
      name: "Value Share %",
      selector: row => row.share,
      sortable: false,
    }
  ];
  const cityColumns = [
    {
      name: "City Name",
      selector: row => row.city_name,
      sortable: false
    },
    {
      name: "Total Quantity",
      selector: row => row.quantity,
      sortable: false,
      conditionalCellStyles: [
        {
            when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
            style: {
              color: "transparent",
              textShadow: "0 0 8px #000"
            },
        },
      ]
    },
    {
      name: "Shipment Count",
      selector: row => row.shipment_count,
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => row.value_usd,
      sortable: false
    },
    {
      name: "Value Share %",
      selector: row => row.share,
      sortable: false,
    }
  ];

  const handleModal = (rowData,columns)  => {
    setShowModal(true)
    setNewModalColumn(columns)
    setNewModalData(rowData)
  }

  const handleModalClose = ()  => {
    setShowModal(false)
  }


  const handleSearch = (values) => {
    var params = [];
    params["tradeType"] = values.tradeType;
    params["searchBy"] = values.searchBy;
    params["searchValue"] = values.searchValue;
    params["countryCode"] = values.countryCode;
    params["fromDate"] = values.fromDate;
    params["toDate"] = values.toDate;
    params["matchType"] = values.matchType;
    params["queryBuilder"]= values.queryBuilder

    if (values.portOriginList) {
      setPortOriginList(values.portOriginList);
      params["portOriginList"] = values.portOriginList;
    }
    if (values.portDestinationList) {
      setPortDestinationList(values.portDestinationList);
      params["portDestinationList"] = values.portDestinationList;
    }
    if (values.hsCodeList) {
      setHsCodeList(values.hsCodeList);
      params["hsCodeList"] = values.hsCodeList;
    }
    if (values.hsCode4DigitList) {
      setHsCode4digitList(values.hsCode4DigitList);
      params["hsCode4DigitList"] = values.hsCode4DigitList;
    }
    if (values.importerList) {
      setImporterList(values.importerList);
      params["importerList"] = values.importerList;
    }
    if (values.exporterList) {
      setExporterList(values.exporterList);
      params["exporterList"] = values.exporterList;
    }
    if (values.cityOriginList) {
      setCityOriginList(values.cityOriginList);
      params["cityOriginList"] = values.cityOriginList;
    }
    if (values.cityDestinationList) {
      setCityDestinationList(values.cityDestinationList);
      params["cityDestinationList"] = values.cityDestinationList;
    }
    if (values.shipmentModeList) {
      setShipmentModeList(values.shipmentModeList);
      params["shipmentModeList"] = values.shipmentModeList;
    }
    if (values.stdUnitList) {
      setStdUnitList(values.stdUnitList);
      params["stdUnitList"] = values.stdUnitList;
    }

    setSearchParams(params);
    getImporterList(params);
    getMonthWiseList(params)
    getExporterList(params);
    getIndianPortList(params);
    getForeignPortList(params);
    getHSCodeList(params);
    getForeignCountryList(params);
    getCityList(params);
    getShipmentModeList(params);
    getHSCode4digitList(params);
    getStdUnitList(params);
  }


  const handleBlur = (e,setFieldValue) => {
    if(e.target.value != ""){
      let newSearchValue = searchValue
      newSearchValue.push(e.target.value)
      setSearchValue(newSearchValue)    
      setFieldValue("searchValue", newSearchValue);
      
      e.target.value = ""
    }  
  }

  const getStdUnitList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/liststdunit`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        let icList = [];
        if (res.data.stdUnitList) {
          res.data.stdUnitList.forEach((item) => {
            let specificItem = { "value": item.std_unit, "label": item.std_unit };
            icList.push(specificItem);
          })
        }
        setStdUnitDataArray(icList);
        props.loadingStop()
      })
      .catch(err => {
        // console.log("Err");
        setStdUnitDataArray([]);
        props.loadingStop()
      });
  }

  const getHSCode4digitList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listhscodes4digit`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        let hsList = [];
        if (res.data.hscodesList) {
          res.data.hscodesList.forEach((item) => {
            let specificItem = { "value": item.hscode, "label": item.hscode+ " ["+item.shipment_count+"]"};
            hsList.push(specificItem);
          })
        }
        setHsCode4digitDataArray(hsList);
      })
      .catch(err => {
        // console.log("Err", err);
        setHsCode4digitDataArray([]);
      });
  }

  const getShipmentModeList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listshipmentmode`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        let icList = [];
        if (res.data.shipmentModeList) {
          res.data.shipmentModeList.forEach((item) => {
            let specificItem = { "value": item.ship_mode, "label": item.ship_mode };
            icList.push(specificItem);
          })
        }
        setShipmentModeDataArray(icList);
      })
      .catch(err => {
        // console.log("Err");
        setShipmentModeDataArray([]);
      });
  }


  const getImporterList = (params) => {

    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listimporters`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {

        let importersList = [];
        if (res.data.importersList) {
          res.data.importersList.forEach((item) => {
            let specificItem = { "value": item.importer_name, "label": item.importer_name+" ["+item.shipment_count+"]" };
            importersList.push(specificItem);
          })
          setImporterDataArray(importersList)
        }

        let data = [];
            let others = {};
            let total = {};
            let quantity = 0
            let share = 0;
            let shipment_count = 0
            let value_inr = 0;
            let value_usd = 0
            let total_quantity = 0
            let total_share = 0
            let total_shipment_count = 0
            let total_value_inr = 0
            let total_value_usd = 0

            res.data.importersList.forEach((item,index) => {
              if(index < 10){
                data.push(item);
              }
              // else{
              //     quantity = quantity + item.quantity;
              //     share = share + item.share;
              //     shipment_count = shipment_count + item.shipment_count;
              //     value_inr = value_inr + item.value_inr;
              //     value_usd = value_usd + item.value_usd;
              // }     
              // total_quantity = total_quantity + item.quantity;
              // total_share = total_share + item.share;
              // total_shipment_count = total_shipment_count + item.shipment_count;
              // total_value_inr = total_value_inr + item.value_inr;
              // total_value_usd = total_value_usd + item.value_usd;
            })
            if( res.data.importersList.length >= 10){
              others = {
                importer_name : 'OTHERS',
                quantity : res.data.totalQuantityTop10,
                share : res.data.valueShareTop10,
                shipment_count : res.data.shipmentCountTop10,
                value_inr : res.data.totalValueINRTop10,
                value_usd : res.data.totalValueUSDTop10
              }
              data.push(others)
            }
            total = {
              importer_name : 'TOTAL',
              quantity : res.data.totalQuantity,
              share : res.data.valueShare,
              shipment_count : res.data.shipmentCount,
              value_inr : res.data.totalValueINR,
              value_usd : res.data.totalValueUSD
            }
        
            data.push(total)
            setImporterDataLT(data)

        setImporterDataList(res.data);
        setPendingImport(false);
      })
      .catch(err => {
        // console.log("Err");
        setPendingImport(false);
      });
  }

  const getMonthWiseList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listmonthwise`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {

        // let data = [];
        // monthArray.map((month,index)=>{
        //   res.data.monthwiseList.forEach((item,subindex) => {
        //     let tempMnt = item.month_name.split("-")
        //       if(tempMnt[0] == month){
        //         data.push(item);
        //       }
        //   })
        // })

        setMonthWiseDataList(res.data.monthwiseList);
      })
      .catch(err => {
        // console.log("Err");
      });
  }

  const getTradingCountryList = (params) => {
    props.loadingStart()
    let searchParams = params == "IMPORT" ? "I" : "E"
    AxiosMaster({
      method: "GET",
      url: `masterdata-management/countrylistbytrade/${searchParams}`,    
    })
      .then(res => {
        let countryList = [];
        // if (res.data.countryList) {
        //   res.data.countryList.forEach((item) => {
        //     let specificItem = { "value": item.shortcode, "label": item.name };
        //     countryList.push(specificItem);
        //   })
        // }
        setTradeCountryList(res.data.countryList)
      })
      .catch(err => {
        setTradeCountryList([])
      });
  }

  const getExporterList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listexporters`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {

        let exportersList = [];
        if (res.data.exportersList) {
          res.data.exportersList.forEach((item) => {
            let specificItem = { "value": item.exporter_name, "label": item.exporter_name+" ["+item.shipment_count+"]" };
            exportersList.push(specificItem);
          })
          setExporterDataArray(exportersList)
        }

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0
        let share = 0;
        let shipment_count = 0
        let value_inr = 0;
        let value_usd = 0
        let total_quantity = 0
        let total_share = 0
        let total_shipment_count = 0
        let total_value_inr = 0
        let total_value_usd = 0

        res.data.exportersList.forEach((item,index) => {
          if(index < 10){
            data.push(item);
          }
          
          // else{
          //     quantity = quantity + item.quantity;
          //     share = share + item.share;
          //     shipment_count = shipment_count + item.shipment_count;
          //     value_inr = value_inr + item.value_inr;
          //     value_usd = value_usd + item.value_usd;
          // }     
          // total_quantity = total_quantity + item.quantity;
          // total_share = total_share + item.share;
          // total_shipment_count = total_shipment_count + item.shipment_count;
          // total_value_inr = total_value_inr + item.value_inr;
          // total_value_usd = total_value_usd + item.value_usd;
        // }
        })
        if(res.data.exportersList.length  >= 10){
          others = {
            exporter_name : 'OTHERS',
            quantity : res.data.totalQuantityTop10,
            share : res.data.valueShareTop10,
            shipment_count : res.data.shipmentCountTop10,
            value_inr : res.data.totalValueINRTop10,
            value_usd : res.data.totalValueUSDTop10
          } 

        data.push(others)
        }
        total = {
          exporter_name : 'TOTAL',
          quantity : res.data.totalQuantity,
          share : res.data.valueShare,
          shipment_count : res.data.shipmentCount,
          value_inr : res.data.totalValueINR,
          value_usd : res.data.totalValueUSD
        }

        data.push(total)
        setExportertDataLT(data)

        setExporterDataList(res.data);
        setPendingExport(false);
        
      })
      .catch(err => {
        // console.log("Err");
        setPendingExport(false);
      });
  }

  const getIndianPortList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listindianports`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        
        let portsList = [];
        if (res.data.portsList) {
          res.data.portsList.forEach((item) => {
            let specificItem = { "value": item.port_name, "label": item.port_name+" ["+item.shipment_count+"]" };
            portsList.push(specificItem);
          })
        }
        setPortOriginDataArray(portsList);

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0
        let share = 0;
        let shipment_count = 0
        let value_inr = 0;
        let value_usd = 0
        let total_quantity = 0
        let total_share = 0
        let total_shipment_count = 0
        let total_value_inr = 0
        let total_value_usd = 0

        res.data.portsList.forEach((item,index) => {
          if(index < 10){
            data.push(item);
          }
          // else{
          //     quantity = quantity + item.quantity;
          //     share = share + item.share;
          //     shipment_count = shipment_count + item.shipment_count;
          //     value_inr = value_inr + item.value_inr;
          //     value_usd = value_usd + item.value_usd;
          // }     
          // total_quantity = total_quantity + item.quantity;
          // total_share = total_share + item.share;
          // total_shipment_count = total_shipment_count + item.shipment_count;
          // total_value_inr = total_value_inr + item.value_inr;
          // total_value_usd = total_value_usd + item.value_usd;
        })
        if(res.data.portsList.length >= 10){
          others = {
            port_name : 'OTHERS',
            quantity : res.data.totalQuantityTop10,
            share : res.data.valueShareTop10,
            shipment_count : res.data.shipmentCountTop10,
            value_inr : res.data.totalValueINRTop10,
            value_usd : res.data.totalValueUSDTop10,
            country : 'India'
          }
          data.push(others)
        }
        total = {
          port_name : 'TOTAL',
          quantity : res.data.totalQuantity,
          share : res.data.valueShare,
          shipment_count : res.data.shipmentCount,
          value_inr : res.data.totalValueINR,
          value_usd : res.data.totalValueUSD
        }

        data.push(total)
        setIndianPortDataLT(data)

        setIndianPortDataList(res.data);
        setPendingIndPort(false);
      })
      .catch(err => {
        // console.log("Err");
        setPendingIndPort(false);
      });
  }

  const getForeignPortList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listforeignports`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        let portsList = [];
        if (res.data.portsList) {
          res.data.portsList.forEach((item) => {
            let specificItem = { "value": item.port_name, "label": item.port_name+"["+item.shipment_count+"]" };
            portsList.push(specificItem);
          })
        }
        setPortDestinationDataArray(portsList);

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0
        let share = 0;
        let shipment_count = 0
        let value_inr = 0;
        let value_usd = 0
        let total_quantity = 0
        let total_share = 0
        let total_shipment_count = 0
        let total_value_inr = 0
        let total_value_usd = 0

        res.data.portsList.forEach((item,index) => {
          if(index < 10){
            data.push(item);
          }
          // else{
          //     quantity = quantity + item.quantity;
          //     share = share + item.share;
          //     shipment_count = shipment_count + item.shipment_count;
          //     value_inr = value_inr + item.value_inr;
          //     value_usd = value_usd + item.value_usd;
          // }     
          // total_quantity = total_quantity + item.quantity;
          // total_share = total_share + item.share;
          // total_shipment_count = total_shipment_count + item.shipment_count;
          // total_value_inr = total_value_inr + item.value_inr;
          // total_value_usd = total_value_usd + item.value_usd;
        })
        if(res.data.portsList.length >= 10){
          others = {
            port_name : 'OTHERS',
            quantity : res.data.totalQuantityTop10,
            share : res.data.valueShareTop10,
            shipment_count : res.data.shipmentCountTop10,
            value_inr : res.data.totalValueINRTop10,
            value_usd : res.data.totalValueUSDTop10,
            country : 'Foreign'
          }
          data.push(others)
        }
        total = {
          port_name : 'TOTAL',
          quantity : res.data.totalQuantity,
          share : res.data.valueShare,
          shipment_count : res.data.shipmentCount,
          value_inr : res.data.totalValueINR,
          value_usd : res.data.totalValueUSD
        }

        data.push(total)
        setForPortDataLT(data)

        setForPortDataList(res.data);
        setPendingForPort(false);
      })
      .catch(err => {
        // console.log("Err");
        setPendingForPort(false);
      });
  }

  const getHSCodeList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listhscodes`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {

        let hscodesList = [];
          if (res.data.hscodesList) {
            res.data.hscodesList.forEach((item) => {
              let specificItem = { "value": item.hscode, "label": item.hscode+" ["+item.shipment_count+"]" };
              hscodesList.push(specificItem);
            })
            setHsCodeDataArray(hscodesList)
          }

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0
        let share = 0;
        let shipment_count = 0
        let value_inr = 0;
        let value_usd = 0
        let total_quantity = 0
        let total_share = 0
        let total_shipment_count = 0
        let total_value_inr = 0
        let total_value_usd = 0

        res.data.hscodesList.forEach((item,index) => {
          if(index < 10){
            data.push(item);
          }
          // else{
          //     quantity = quantity + item.quantity;
          //     share = share + item.share;
          //     shipment_count = shipment_count + item.shipment_count;
          //     value_inr = value_inr + item.value_inr;
          //     value_usd = value_usd + item.value_usd;
          // }     
          // total_quantity = total_quantity + item.quantity;
          // total_share = total_share + item.share;
          // total_shipment_count = total_shipment_count + item.shipment_count;
          // total_value_inr = total_value_inr + item.value_inr;
          // total_value_usd = total_value_usd + item.value_usd;
        })
        if(res.data.hscodesList.length >= 10){
          others = {
            hscode : 'OTHERS',
            quantity : res.data.totalQuantityTop10,
            share : res.data.valueShareTop10,
            shipment_count : res.data.shipmentCountTop10,
            value_inr : res.data.totalValueINRTop10,
            value_usd : res.data.totalValueUSDTop10
          }
          data.push(others)
        }
        total = {
          hscode : 'TOTAL',
          quantity : res.data.totalQuantity,
          share : res.data.valueShare,
          shipment_count : res.data.shipmentCount,
          value_inr : res.data.totalValueINR,
          value_usd : res.data.totalValueUSD
        }

        data.push(total)
        setHSCodeDataLT(data)

        setHSCodeDataList(res.data);
        setPendingHSCode(false);
      })
      .catch(err => {
        // console.log("Err");
        setPendingHSCode(false);
      });
  }

  const getForeignCountryList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listforeigncountries`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {

        let fcList = [];
        if (res.data.countriesList) {
          res.data.countriesList.forEach((item) => {
            let specificItem = { "value": item.country_name, "label": item.country_name+" ["+item.shipment_count+"]" };
            fcList.push(specificItem);
          })
        }
        setCountryOriginList(fcList);

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0
        let share = 0;
        let shipment_count = 0
        let value_inr = 0;
        let value_usd = 0
        let total_quantity = 0
        let total_share = 0
        let total_shipment_count = 0
        let total_value_inr = 0
        let total_value_usd = 0

        res.data.countriesList.forEach((item,index) => {
          if(index < 10){
            data.push(item);
          }
          // else{
          //     quantity = quantity + item.quantity;
          //     share = share + item.share;
          //     shipment_count = shipment_count + item.shipment_count;
          //     value_inr = value_inr + item.value_inr;
          //     value_usd = value_usd + item.value_usd;
          // }     
          // total_quantity = total_quantity + item.quantity;
          // total_share = total_share + item.share;
          // total_shipment_count = total_shipment_count + item.shipment_count;
          // total_value_inr = total_value_inr + item.value_inr;
          // total_value_usd = total_value_usd + item.value_usd;
        })
        if(res.data.countriesList.length >= 10){
          others = {
            country_name : 'OTHERS',
            quantity : res.data.totalQuantityTop10,
            share : res.data.valueShareTop10,
            shipment_count : res.data.shipmentCountTop10,
            value_inr : res.data.totalValueINRTop10,
            value_usd : res.data.totalValueUSDTop10
          }
          data.push(others)
        }
        total = {
          country_name : 'TOTAL',
          quantity : res.data.totalQuantity,
          share : res.data.valueShare,
          shipment_count : res.data.shipmentCount,
          value_inr : res.data.totalValueINR,
          value_usd : res.data.totalValueUSD
        }

        data.push(total)
        setCountryDataLT(data)

        setCountryDataList(res.data);
        setPendingCountry(false);
      })
      .catch(err => {
        // console.log("Err");
        setPendingCountry(false);
      });
  }

  const getCityList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList":  params.portDestinationList,
      "hsCodeList":  params.hsCodeList,
      "hsCode4DigitList":  params.hsCode4DigitList,
      "exporterList":  params.exporterList,
      "importerList":  params.importerList,
      "cityOriginList":  params.cityOriginList,
      "cityDestinationList":  params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    props.loadingStart()
    Axios({
      method: "POST",
      url: `/search-management/listindiancities`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        let icList = [];
        if (res.data.citiesList) {
          res.data.citiesList.forEach((item) => {
            let specificItem = { "value": item.city_name, "label": item.city_name+" ["+item.shipment_count+"]" };
            icList.push(specificItem);
          })
        }
        setCountryDestinationList(icList);

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0
        let share = 0;
        let shipment_count = 0
        let value_inr = 0;
        let value_usd = 0
        let total_quantity = 0
        let total_share = 0
        let total_shipment_count = 0
        let total_value_inr = 0
        let total_value_usd = 0

        res.data.citiesList.forEach((item,index) => {
          if(index < 10){
            data.push(item);
          }
          // else{
          //     quantity = quantity + item.quantity;
          //     share = share + item.share;
          //     shipment_count = shipment_count + item.shipment_count;
          //     value_inr = value_inr + item.value_inr;
          //     value_usd = value_usd + item.value_usd;
          // }     
          // total_quantity = total_quantity + item.quantity;
          // total_share = total_share + item.share;
          // total_shipment_count = total_shipment_count + item.shipment_count;
          // total_value_inr = total_value_inr + item.value_inr;
          // total_value_usd = total_value_usd + item.value_usd;
        })
        if(res.data.citiesList.length >= 10){
          others = {
            city_name : 'OTHERS',
            quantity : res.data.totalQuantityTop10,
            share : res.data.valueShareTop10,
            shipment_count : res.data.shipmentCountTop10,
            value_inr : res.data.totalValueINRTop10,
            value_usd : res.data.totalValueUSDTop10
          }
          data.push(others)
        }
        total = {
          city_name : 'TOTAL',
          quantity : res.data.totalQuantity,
          share : res.data.valueShare,
          shipment_count : res.data.shipmentCount,
          value_inr : res.data.totalValueINR,
          value_usd : res.data.totalValueUSD
        }

        data.push(total)
        setCityDataLT(data)

        setCityDataList(res.data);
        setPendingCity(false);
      })
      .catch(err => {
        // console.log("Err");
        setPendingCity(false);
      });
  }

  useEffect(() => {
    fetchSearchQuery()
    if (searchParams && searchParams.tradeType) {
      getImporterList(searchParams);
      getMonthWiseList(searchParams);
      getExporterList(searchParams);
      getIndianPortList(searchParams);
      getForeignPortList(searchParams);
      getHSCodeList(searchParams);
      getForeignCountryList(searchParams);
      getCityList(searchParams);
      getTradingCountryList(searchParams.tradeType);
      getShipmentModeList(searchParams);
      getHSCode4digitList(searchParams);
      getStdUnitList(searchParams);
    }
  }, []);

  const monthWiseLabel = () => {
    let labels = [];
    monthWiseDataList.forEach((item) => {
      labels.push(item.month_name);
    }) 
    return labels;
  }
  const MonthWiseData = () => {
    let data = [];
    let others = 0;
    monthWiseDataList.forEach((item,index) => {
      data.push(item.value_usd);    
    })
    data.push(others)
    return data;
  }

  const importerLabel = () => {
    let labels = [];
    let tempImporterList = Object.assign(importerDataList)
    tempImporterList.importersList.slice(0,10).forEach((item) => {
      labels.push(item.importer_name);
    })
    if(importerDataList.importersList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }
  const importerData = () => {
    let data = [];
    let others = 0;
    importerDataList.importersList.forEach((item,index) => {
      if(index < 10){
        data.push(item.value_usd);
      }
      // else{
      //   others = others + item.value_usd
      // }     
    })
    data.push(importerDataList.totalValueUSDTop10)
    return data;
  }

  const importerDataPie = () => {
    let data = [];
    let others = 0;
    importerDataList.importersList.forEach((item,index) => {
      if(index < 10){
        data.push(item.share);
      }
      // else{
      //   others = others + item.share
      // }     
    })
    data.push(importerDataList.valueShareTop10)
    return data;
  }


  const exporterLabel = () => {

    let labels = [];
    let tempExporterList = Object.assign(exporterDataList)
    tempExporterList.exportersList.slice(0,10).forEach((item,index) => {
      labels.push(item.exporter_name);
    })
    if(exporterDataList.exportersList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }

  const exporterData = () => {
    let data = [];
    let others = 0;
    exporterDataList.exportersList.forEach((item,index) => {
      if(index < 10){
        data.push(item.value_usd);
      }
      // else{
      //   others = others + item.value_usd
      // }     
    })
    data.push(exporterDataList.totalValueUSDTop10)
    return data;
  }

  const exporterDataPie = () => {
    let data = [];
    let others = 0;
    exporterDataList.exportersList.forEach((item,index) => {
      if(index < 10){
        data.push(item.share);
      }
      // else{
      //   others = others + item.share
      // }     
    })
    data.push(exporterDataList.valueShareTop10)
    return data;
  }


  const indPortLabel = () => {
    let labels = [];
    let tempIndianPortList = Object.assign(indianPortDataList)
    tempIndianPortList.portsList.slice(0,10).forEach((item) => {
      labels.push(item.port_name);
    })
    if(indianPortDataList.portsList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }

  const indPortData = () => {
    let data = [];
    let others = 0;
    indianPortDataList.portsList.forEach((item,index) => {
      if(index < 10){
        data.push(item.value_usd);
      }
      // else{
      //   others = others + item.value_usd
      // }     
    })
    data.push(indianPortDataList.totalValueUSDTop10)
    return data;
  }

  const indianPortPie = () => {
    let data = [];
    let others = 0;
    indianPortDataList.portsList.forEach((item,index) => {
      if(index < 10){
        data.push(item.share);
      }
      // else{
      //   others = others + item.share
      // }     
    })
    data.push(indianPortDataList.valueShareTop10)
    return data;
  }

  const forPortLabel = () => {
    let labels = [];
    let tempForPortList = Object.assign(forPortDataList)
    tempForPortList.portsList.slice(0,10).forEach((item) => {
      labels.push(item.port_name);
    })
    if(forPortDataList.portsList.length > 10){
      labels.push("Others")
    }   
    return labels;
  }

  const forPortData = () => {
    let data = [];
    let others = 0;
    forPortDataList.portsList.forEach((item,index) => {
      if(index < 10){
        data.push(item.value_usd);
      }
      // else{
      //   others = others + item.value_usd
      // }    
    })
    data.push(forPortDataList.totalValueUSDTop10)
    return data;
  }

  const foreignPortPie = () => {
    let data = [];
    let others = 0;
    forPortDataList.portsList.forEach((item,index) => {
      if(index < 10){
        data.push(item.share);
      }
      // else{
      //   others = others + item.share
      // }     
    })
    data.push(forPortDataList.valueShareTop10)
    return data;
  }


  const hsCodeLabel = () => {
    let labels = [];
    let tempHsCodeList = Object.assign(hsCodeDataList)
    tempHsCodeList.hscodesList.slice(0,10).forEach((item) => {
      labels.push(item.hscode);
    })
    if(hsCodeDataList.hscodesList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }

  const hsCodeData = () => {
    let data = [];
    let others = 0;
    hsCodeDataList.hscodesList.forEach((item,index) => {
      if(index < 10){
        data.push(item.value_usd);
      }
      // else{
      //   others = others + item.value_usd
      // }     
    })
    data.push(hsCodeDataList.totalValueUSDTop10)
    return data;
  }

  const hsCodePie = () => {
    let data = [];
    let others = 0;
    hsCodeDataList.hscodesList.forEach((item,index) => {
      if(index < 10){
        data.push(item.share);
      }
      // else{
      //   others = others + item.share
      // }     
    })
    data.push(hsCodeDataList.valueShareTop10)
    return data;
  }

  const countryLabel = () => {
    let labels = [];
    let tempCountryList = Object.assign(countryDataList)
    tempCountryList.countriesList.slice(0,10).forEach((item) => {
      labels.push(item.country_name);
    })
    if(countryDataList.countriesList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }

  const countryData = () => {
    let data = [];
    let others = 0;
    countryDataList.countriesList.forEach((item,index) => {
      if(index < 10){
        data.push(item.value_usd);
      }
      // else{
      //   others = others + item.value_usd
      // }     
    })
    data.push(countryDataList.totalValueUSDTop10)
    return data;
  }

  const countryDataPie = () => {
    let data = [];
    let others = 0;
    countryDataList.countriesList.forEach((item,index) => {
      if(index < 10){
        data.push(item.share);
      }
      // else{
      //   others = others + item.share
      // }     
    })
    data.push(countryDataList.valueShareTop10)
    return data;
  }


  const cityLabel = () => {
    let labels = [];
    let tempcityList = Object.assign(cityDataList)
    tempcityList.citiesList.slice(0,10).forEach((item) => {
      labels.push(item.city_name);
    })
    if(cityDataList.citiesList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }

  const cityData = () => {
    let data = [];
    let others = 0;
    cityDataList.citiesList.forEach((item,index) => {
      if(index < 10){
        data.push(item.value_usd);
      }
      // else{
      //   others = others + item.value_usd
      // }     
    })
    data.push(cityDataList.totalValueUSDTop10)
    return data;
  }

  const cityDataPie = () => {
    let data = [];
    let others = 0;
    cityDataList.citiesList.forEach((item,index) => {
      if(index < 10){
        data.push(item.share);
      }
      // else{
      //   others = others + item.share
      // }     
    })
    data.push(cityDataList.valueShareTop10)
    return data;
  }

  const setMaxMinDate = (text,tradeType) => {
    let tempRow = tradeCountryList.filter((item) => item.shortcode.toLowerCase().includes(text.toLowerCase()))
    let fromDate = ""
    let toDate = ""
    if(tradeType == "IMPORT") {
      fromDate = moment(tempRow[0].importFrom).format('MM-DD-YYYY')
      toDate = moment(tempRow[0].importUpto).format('MM-DD-YYYY') 
    }
    else {
      fromDate = moment(tempRow[0].exportFrom).format('MM-DD-YYYY')
      toDate = moment(tempRow[0].exportUpto).format('MM-DD-YYYY')
    }
      
      setMinDate(new Date(fromDate))
      setMaxDate(new Date(toDate))    
  }

  const swalResponse = () => {
    Swal.fire({
      title: 'Search !',
      text: "Your Search Limit Exhausted",
      icon: 'error',
      dangerMode: true,
      confirmButtonColor: '#3085d6',
    })  
  }

  const queryBuilder = (values, errors, touched, setFieldTouched, setFieldValue, Fragment) => {
    return(
    <FieldArray
    name="queryBuilder"
        render={arrayHelpers => (
          <Row>
            {values.queryBuilder && values.queryBuilder.length > 0 ? (
              values.queryBuilder.map((data, index) => (
              <Fragment key={index}>
              <div className="col-md-2 pr-0 pb-2">
                <div className="input-search">
                  <Field
                    name={`queryBuilder[${index}].relation`}
                    component="select"
                    className={`hero__form-input form-control custom-select ${touched.matchType && errors.matchType ? "is-invalid" : ""}`}
                    autoComplete="off"
                    onChange={event => {
                      if(props.queryPerDay > 0 ){       
                        setFieldValue(`queryBuilder[${index}].relation`, event.target.value);
                      }
                      else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                        swalResponse()
                      }
                    }}
                  >
                    <option>Select Relation</option>
                      <option value="AND">AND</option>
                    <option value="OR">OR</option>
                    <option value="NOT">NOT</option>
                  </Field>
                </div>
              </div>
              <div className="col-md-2 pr-0 pb-2">
    
                <div className="input-search">
                  <Field
                    name={`queryBuilder[${index}].searchBy`}
                    component="select"
                    className={`hero__form-input form-control custom-select ${touched.searchBy && errors.searchBy ? "is-invalid" : ""}`}
                    autoComplete="off"
                    onChange={event => {
                      if(props.queryPerDay > 0 ){       
                        event.target.value == "PRODUCT" ? setFieldValue(`queryBuilder[${index}].matchType`, "C") : setFieldValue(`queryBuilder[${index}].matchType`, "L");
                        setFieldValue(`queryBuilder[${index}].searchBy`, event.target.value);
                      }
                      else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                        swalResponse()
                      }
                    }}
                  >
                    <option>Select Type</option>
                    <option value="HS_CODE">HS Code</option>
                    <option value="PRODUCT">Product</option>
                    <option value="IMPORTER">Importer</option>
                    <option value="EXPORTER">Exporter</option>
                  </Field>
                </div>
              </div>
              <div className="col-md-2 pr-0 pb-3">
                <div className="input-search">
                  <Field
                    name={`queryBuilder[${index}].matchType`}
                    component="select"
                    className={`hero__form-input form-control custom-select ${touched.matchType && errors.matchType ? "is-invalid" : ""}`}
                    autoComplete="off"
                    onChange={event => {
                      if(props.queryPerDay > 0 ){       
                        setFieldValue(`queryBuilder[${index}].matchType`, event.target.value);
                      }
                      else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                        swalResponse()
                      }
                    }}
                  >
                    <option>Select</option>
                    { values.queryBuilder && values.queryBuilder.length > 0 && values.queryBuilder[index].hasOwnProperty("searchBy") && values.queryBuilder[index].searchBy == "PRODUCT" ? <option value="C">Contains</option> : null }
                    <option value="L">Like</option>
                  </Field>
                </div>
              </div>

              {data && data.searchValue.length > 0 ?
              <div className="col-md-6 pr-0 pb-3">
                <div className="input-search" >
                <FormGroup >
                  <TagsInput
                    value={data.searchValue}                           
                    name="searchValue"
                    separators = {["Enter","Tab"]}
                    classNames={{tag: "", input: ""}}
                    placeHolder="Enter search value"
                    disabled = {true}
                    onBlur = {(e) => {handleBlur(e,setFieldValue)} } 
                  />
                  
                {errors.searchValue && touched.searchValue ? (
                  <span className="errorMsg">{errors.searchValue}</span>
                  ) : null}
                </FormGroup>   
                </div>
              </div> : null      
              }
          </Fragment> 
              ))
            ) : null}
          
          </Row>
        )}
      />
    )
  }

  const onDataRowClicked = (row,index) =>{

    if(row.hasOwnProperty("importer_name") && row.importer_name == "OTHERS"){
      handleModal(importerDataList.importersList,importerColumns)
    }
    else if(row.hasOwnProperty("exporter_name") && row.exporter_name == "OTHERS"){
      handleModal(exporterDataList.exportersList,exporterColumns)
    }
    else if(row.hasOwnProperty("hscode") && row.hscode == "OTHERS"){
      handleModal(hsCodeDataList.hscodesList,hsCodeColumns)
    }
    else if(row.hasOwnProperty("country_name") && row.country_name == "OTHERS"){
      handleModal(countryDataList.countriesList,countryColumns)
    }
    else if(row.hasOwnProperty("city_name") && row.city_name == "OTHERS"){
      handleModal(cityDataList.citiesList,cityColumns)
    }
    else if(row.hasOwnProperty("port_name") && row.port_name == "OTHERS" && row.country == 'India'){
      handleModal(indianPortDataList.portsList,portColumns)
    }
    else if(row.hasOwnProperty("port_name") && row.port_name == "OTHERS" && row.country == 'Foreign'){
      handleModal(forPortDataList.portsList,portColumns)
    }
  }

  const resetFilter = (data) => {
    // setPreviousTotalRecordCount(0)
    // setIsDownloaded("N")
    updateFilter(data)
  }

  const updateFilter = (data) => {

    if (data.portOriginList) {
      setPortOriginList(data.portOriginList);
    }
    if (data.portDestinationList) {
      setPortDestinationList(data.portDestinationList);
    }
    if (data.hsCodeList) {
      setHsCodeList(data.hsCodeList);
    }
    if (data.hsCode4DigitList) {
      setHsCode4digitList(data.hsCode4DigitList);
    }
    if (data.importerList) {
      setImporterList(data.importerList);
    }
    if (data.exporterList) {
      setExporterList(data.exporterList);
    }
    if (data.cityOriginList) {
      setCityOriginList(data.cityOriginList);
    }
    if (data.cityDestinationList) {
      setCityDestinationList(data.cityDestinationList);
    }
    if(data.shipmentModeList){
      setShipmentModeList(data.shipmentModeList);
    }
    if(data.stdUnitList){
      setStdUnitList(data.stdUnitList);
    }
    

    if (searchParams && searchParams.tradeType) {
      let params = searchParams;
      params.portOriginList = data.portOriginList;
      params.portDestinationList = data.portDestinationList;
      params.hsCodeList = data.hsCodeList;
      params.importerList = data.importerList;
      params.exporterList = data.exporterList;
      params.cityOriginList = data.cityOriginList;
      params.cityDestinationList = data.cityDestinationList;
      params.hsCode4DigitList = data.hsCode4DigitList;
      params.shipmentModeList = data.shipmentModeList;
      params.stdUnitList = data.stdUnitList;
      params.searchFlag = false

      if (data.portOriginList) {
        setPortOriginList(data.portOriginList);
        params["portOriginList"] = data.portOriginList;
      }
      if (data.portDestinationList) {
        setPortDestinationList(data.portDestinationList);
        params["portDestinationList"] = data.portDestinationList;
      }
      if (data.hsCodeList) {
        setHsCodeList(data.hsCodeList);
        params["hsCodeList"] = data.hsCodeList;
      }
      if (data.hsCode4DigitList) {
        setHsCode4digitList(data.hsCode4DigitList);
        params["hsCode4DigitList"] = data.hsCode4DigitList;
      }
      if (data.importerList) {
        setImporterList(data.importerList);
        params["importerList"] = data.importerList;
      }
      if (data.exporterList) {
        setExporterList(data.exporterList);
        params["exporterList"] = data.exporterList;
      }
      if (data.cityOriginList) {
        setCityOriginList(data.cityOriginList);
        params["cityOriginList"] = data.cityOriginList;
      }
      if (data.cityDestinationList) {
        setCityDestinationList(data.cityDestinationList);
        params["cityDestinationList"] = data.cityDestinationList;
      }
      if (data.shipmentModeList) {
        setShipmentModeList(data.shipmentModeList);
        params["shipmentModeList"] = data.shipmentModeList;
      }
      if (data.stdUnitList) {
        setStdUnitList(data.stdUnitList);
        params["stdUnitList"] = data.stdUnitList;
      }
      setSearchParams(params);
     

      getImporterList(params);
      getMonthWiseList(params);
      getExporterList(params);
      getIndianPortList(params);
      getForeignPortList(params);
      getHSCodeList(params);
      getForeignCountryList(params);
      getCityList(params);
      getShipmentModeList(params);
      getHSCode4digitList(params);
      getStdUnitList(params);

      
    }
    setToggle(false);
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row mb-4 mt-4">
          <div className="col-md-12 list-page mt-3 mb-4">
            <div className="search-top">
              <h5 >
               Select Search Parameters
              </h5>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validateForm}
                onSubmit={handleSearch}
              >
                {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm, setFieldTouched }) => {
                  return (       
                    <Form>
                      <div className="row">
                        <div className="col-md-3 pr-0 pb-3">
                          <div className="input-search">
                            <Field
                              name="tradeType"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.tradeType && errors.tradeType ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.tradeType}
                              disabled = {true}
                              onChange={event => {
                                setFieldValue("tradeType", event.target.value);
                                setFieldValue("countryCode", "");
                                setFieldValue("fromDate", "") ;
                                setFieldValue("toDate", "") ;
                                getTradingCountryList(event.target.value == "IMPORT" ? 'I' : 'E')
                              }}
                            >
                              <option>Select Trade</option>
                              <option value="IMPORT">Import</option>
                              <option value="EXPORT">Export</option>
                            </Field>
                          </div>
                        </div>
                        <div className="col-md-3 pr-0 pb-3">
                          <div className="dropdown bootstrap-select hero__form-input">
                             <Field
                              name="countryCode"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.countryCode && errors.countryCode ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.countryCode}
                              disabled = {true}
                              onChange={event => {
                                setFieldValue("countryCode", event.target.value);
                                setFieldValue("fromDate", "") ;
                                setFieldValue("toDate", "") ;
                                setMaxMinDate(event.target.value, values.tradeType)
                              }}
                            >
                              <option>Select Country</option>
                              {Object.keys(tradeCountryList).map((item,index) => (                          
                                <option key = {index} value={tradeCountryList[item].shortcode}>{tradeCountryList[item].name}</option>
                              ))}
                            </Field>
                          </div>
                        </div>
                        <div className="col-md-3 pr-0 pb-3">
                          <div className="input-search">
                            <DatePicker
                              name="fromDate"
                              dateFormat="yyyy MMM dd  "
                              placeholderText="From"
                              peekPreviousMonth
                              peekPreviousYear
                              showMonthDropdown
                              showYearDropdown
                              disabled = {true}
                              minDate={new Date(minDate)}
                              maxDate={new Date(maxDate)}
                              className="form-control"
                              dropdownMode="select"
                              onChange={(value) => {
                                setFieldValue("fromDate",value) ;
                                setFieldTouched("fromDate");
                              }}
                              selected={values.fromDate}
                          />
                            {errors.fromDate && touched.fromDate ? (
                                  <span className="errorMsg">{errors.fromDate}</span>
                              ) : null}
                          </div>
                        </div>
                        <div className="col-md-3 pr-0 pb-3">
                          <div className="input-search">
                            <DatePicker
                              name="toDate"
                              dateFormat="yyyy MMM dd  "
                              placeholderText="To"
                              peekPreviousMonth
                              peekPreviousYear
                              showMonthDropdown
                              showYearDropdown
                              disabled = {true}
                              minDate={new Date(minDate)}
                              maxDate={new Date(maxDate)}
                              className="form-control"
                              dropdownMode="select"
                              onChange={(value) => {
                                setFieldValue("toDate",value) ;
                                setFieldTouched("toDate");
                              }}
                              selected={values.toDate}
                            />       
                          {errors.toDate && touched.toDate ? (
                                <span className="errorMsg">{errors.toDate}</span>
                            ) : null}               
                          </div>
                        </div>
                        
                        <div className="col-md-3 pr-0 pb-3">
                          <div className="input-search">
                            <Field
                              name="searchBy"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.searchBy && errors.searchBy ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.searchBy}
                              disabled = {true}
                              onChange={event => {
                                setFieldValue("searchBy", event.target.value);
                              }}
                            >
                              <option>Select Type</option>
                              <option value="HS_CODE">HS Code</option>
                              <option value="PRODUCT">Product</option>
                              <option value="IMPORTER">Importer</option>
                              <option value="EXPORTER">Exporter</option>
                            </Field>
                          </div>
                        </div>

                        <div className="col-md-3 pr-0 pb-3">
                          <div className="input-search">
                            <Field
                              name="matchType"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.matchType && errors.matchType ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.matchType}
                              disabled = {true}
                              onChange={event => {
                                setFieldValue("matchType", event.target.value);
                              }}
                            >
                              <option>Select</option>
                              <option value="C">Contains</option>
                              <option value="L">Like</option>
                            </Field>
                          </div>
                        </div>

                        <div className="col-md-3 pr-0 pb-3">
                          <div className="input-search">
                           <FormGroup>
                            <TagsInput
                              value={values.searchValue}                           
                              name="searchValue"
                              separators = {["Enter","Tab"]}
                              classNames={{tag: "", input: ""}}
                              placeHolder="Enter search value"
                              disabled = {true}
                              onBlur = {(e) => {handleBlur(e,setFieldValue)} } 
                              onChange={(e) => {
                                setSearchValue(e);
                                setFieldValue("searchValue", e);
                              
                              }}
                            />
                         {errors.searchValue && touched.searchValue ? (
                            <span className="errorMsg">{errors.searchValue}</span>
                            ) : null}
                          </FormGroup>
                          </div>
                        </div>
                        </div>

                        {queryBuilder(values, errors, touched, setFieldTouched, setFieldValue, Fragment)}
                       
                        
                       <div className="row">
                        <div className="col-md-3 pr-0 pb-3">
                          
                          <Link className="btn btn-primary" to={{ 
                                pathname: "/list", 
                                state: {search_id : search_id , 
                                  workspace_id : props.location.state ? props.location.state.workspace_id : "",
                                  workspace_name : props.location.state ? props.location.state.workspace_name : "",
                                  workspace_desc : props.location.state ? props.location.state.workspace_desc : "",
                                  workspaceId : props.location.state ? props.location.state.workspaceId : "",
                                  columnKeys : props.location.state ? props.location.state.columnKeys : "" 
                                }
                                }}>
                            Back to List
                          </Link>
                          
                        </div>
                      </div>
                    </Form>
                  )
                }
                }
              </Formik>
            </div>
          </div>
        </div>
        
        {searchParams && searchParams.tradeType ? (
          <>
            <div className="row mb-4">    
              <div className="col-lg-2 col-md-3 offset-md-1">
                <div className="card">
                  <div className="card-body bg-soft-success">
                    <div className="avatar">
                      <span className="avatar-title bg-soft-success rounded">
                        <i className="icon ion-md-filing text-primary font-size-24"></i>
                      </span>
                    </div>
                    <div className="list-in">
                      <p className="text-muted mt-0 mb-0">Importer</p>
                      <h4 className="mt-0 mb-0">{importerDataList.importersList && importerDataList.importersList.length}</h4>
                    </div>
                  </div>
                  {pendingImport && (
                    <div className="loaderBox">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-2 col-md-3">
                <div className="card">
                  <div className="card-body bg-soft-primary">
                    <div className="avatar">
                      <span className="avatar-title bg-soft-primary rounded">
                        <i className="icon ion-md-business text-primary font-size-24"></i>
                      </span>
                    </div>
                    <div className="list-in">
                      <p className="text-muted mt-0 mb-0">Exporter</p>
                      <h4 className="mt-0 mb-0">{exporterDataList.exportersList && exporterDataList.exportersList.length}</h4>
                    </div>
                  </div>
                  {pendingExport && (
                    <div className="loaderBox">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-2 col-md-2">
                <div className="card">
                  <div className="card-body bg-soft-primary">
                    <div className="avatar">
                      <span className="avatar-title bg-soft-primary rounded">
                        <i className="icon ion-ios-barcode text-primary font-size-24"></i>
                      </span>
                    </div>
                    <div className="list-in">
                      <p className="text-muted mt-0 mb-0">&nbsp;&nbsp;&nbsp;HSCODE&nbsp;&nbsp;&nbsp;</p>
                      <h4 className="mt-0 mb-0">{hsCodeDataList.hscodesList && hsCodeDataList.hscodesList.length}</h4>
                    </div>
                  </div>
                  {pendingHSCode && (
                    <div className="loaderBox">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-2 col-md-3">
                <div className="card">
                  <div className="card-body bg-soft-success">
                    <div className="avatar">
                      <span className="avatar-title bg-soft-success rounded">
                        <i className="icon ion-md-flag text-success font-size-24"></i>
                      </span>
                    </div>
                    <div className="list-in">
                      <p className="text-muted mt-0 mb-0">Foreign Ports</p>
                      <h4 className="mt-0 mb-0">{forPortDataList.portsList && forPortDataList.portsList.length}</h4>
                    </div>
                  </div>
                  {pendingForPort && (
                    <div className="loaderBox">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-2 col-md-3">
                <div className="card">
                  <div className="card-body bg-soft-primary">
                    <div className="avatar">
                      <span className="avatar-title bg-soft-primary rounded">
                        <i className="icon ion-ios-business text-primary font-size-24"></i>
                      </span>
                    </div>
                    <div className="list-in">
                      <p className="text-muted mt-0 mb-0">Indian Ports</p>
                      <h4 className="mt-0 mb-0">{indianPortDataList.portsList && indianPortDataList.portsList.length}</h4>
                    </div>
                  </div>
                  {pendingIndPort && (
                    <div className="loaderBox">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Draggable>
                <div class="ad-butt">
                  <button className="btn btn-primary ad-butt-button" onClick={() => setToggle(!toggle)}><i className="icon ion-md-search text-light font-size-35"></i></button>
                </div>
            </Draggable>

            {monthWiseDataList && monthWiseDataList.length > 0 ?
            <>     
              <h4>Month Wise Analysis</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  <DataTable
                    className="table table-striped table-hover"
                    columns={monthWiseColumns}
                    data={monthWiseDataList}
                    // noHeader
                    defaultSortField="id"
                    defaultSortAsc={false}
                    // pagination
                    conditionalRowStyles = {conditionalRowStyles}
                    onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                    onRowMouseEnter={(row, e) => 
                      showTooltip(row, e) 
                    }
                    onRowClicked = {onDataRowClicked}
                    dense
                    highlightOnHover
                    progressPending={pendingImport}
                    progressComponent={<Loader />}
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
                <div className="col-md-6">
                  {!pendingImport ? (
                    <Tabs defaultIndex={0}>
                      <TabList>
                        {/* <Tab>Pie</Tab> */}
                        <Tab>Bar</Tab>
                        <Tab>Line</Tab>
                      </TabList>

                      {/* <TabPanel>
                        <GraphPI barTitle={'Top 10 importers'} labels={importerLabel()} data={importerDataPie()} />
                      </TabPanel> */}
                      <TabPanel>
                        <GraphBar barTitle={'Month Wise Analysis'} labels={monthWiseLabel()} data={MonthWiseData()} dataLabel="Total value (USD)" colorCode = "245,138,16" xAxixLabel = "Month"/>
                      </TabPanel>
                      <TabPanel>
                        <GraphLine barTitle={'Month Wise Analysis'} labels={monthWiseLabel()} data={MonthWiseData()} colorCode = "245,138,16" xAxixLabel = "Month"/>
                      </TabPanel>
                    </Tabs>
                  ) : (
                    <div className="loaderBlock">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>      
              </div>
            </> : null }
            {importerDataList.importersList && importerDataList.importersList.length > 0 ?
            <>     
              <h4>Top 10 Importers</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  {!pendingImport ? (
                    <Tabs defaultIndex={0}>
                      <TabList>
                        <Tab>Pie</Tab>
                        <Tab>Bar</Tab>
                        {/* <Tab>Line</Tab> */}
                      </TabList>

                      <TabPanel>
                        <GraphPI barTitle={'Top 10 importers'} labels={importerLabel()} data={importerDataPie()} />
                      </TabPanel>
                      <TabPanel>
                        <GraphBar barTitle={'Top 10 importers'} labels={importerLabel()} data={importerData()} dataLabel="Total value (USD)" />
                      </TabPanel>
                      {/* <TabPanel>
                        <GraphLine barTitle={'Top 10 importers'} labels={importerLabel()} data={importerData()} />
                      </TabPanel> */}
                    </Tabs>
                  ) : (
                    <div className="loaderBlock">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <DataTable
                    className="table table-striped table-hover"
                    columns={importerColumns}
                    data={importerDataLT}
                    // noHeader
                    defaultSortField="id"
                    defaultSortAsc={false}
                    // pagination
                    conditionalRowStyles = {conditionalRowStyles}
                    onRowClicked = {onDataRowClicked}
                    dense
                    highlightOnHover
                    progressPending={pendingImport}
                    progressComponent={<Loader />}
                    onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                    onRowMouseEnter={(row, e) => 
                      showTooltip(row, e) 
                    }
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
            </> : null }
            {exporterDataList.exportersList && exporterDataList.exportersList.length > 0 ?
            <>     
              <h4>Top 10 Exporters</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  <DataTable
                    className="table table-striped table-hover"
                    columns={exporterColumns}
                    data={exporterDataLT}
                    // noHeader
                    defaultSortField="id"
                    defaultSortAsc={false}
                    conditionalRowStyles = {conditionalRowStyles}
                    onRowClicked = {onDataRowClicked}
                    highlightOnHover
                    dense
                    progressPending={pendingExport}
                    progressComponent={<Loader />}
                    onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                    onRowMouseEnter={(row, e) => 
                      showTooltip(row, e) 
                    }
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
                <div className="col-md-6">
                  {!pendingExport ? (
                    <Tabs defaultIndex={1}>
                      <TabList>
                        <Tab>Pie</Tab>
                        <Tab>Bar</Tab>
                        {/* <Tab>Line</Tab> */}
                      </TabList>

                      <TabPanel>
                        <GraphPI barTitle={'Top 10 exporters'} labels={exporterLabel()} data={exporterDataPie()} />
                      </TabPanel>
                      <TabPanel>
                        <GraphBar barTitle={'Top 10 exporters'} labels={exporterLabel()} data={exporterData()} dataLabel="Total value (USD)" />
                      </TabPanel>
                      {/* <TabPanel>
                        <GraphLine barTitle={'Top 10 exporters'} labels={exporterLabel()} data={exporterData()} />
                      </TabPanel> */}
                    </Tabs>
                  ) : (
                    <div className="loaderBlock">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </div>
            </> : null }

            {indianPortDataList.portsList && indianPortDataList.portsList.length > 0 ?
            <> 
              <h4>Top 10 Indian ports</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  {!pendingIndPort ? (
                    <Tabs defaultIndex={2}>
                      <TabList>
                        <Tab>Pie</Tab>
                        <Tab>Bar</Tab>
                        {/* <Tab>Line</Tab> */}
                      </TabList>

                      <TabPanel>
                        <GraphPI barTitle={'Top 10 indian ports'} labels={indPortLabel()} data={indianPortPie()} />
                      </TabPanel>
                      <TabPanel>
                        <GraphBar barTitle={'Top 10 indian ports'} labels={indPortLabel()} data={indPortData()} dataLabel="Total value (USD)"/>
                      </TabPanel>
                      {/* <TabPanel>
                        <GraphLine barTitle={'Top 10 indian ports'} labels={indPortLabel()} data={indPortData()} />
                      </TabPanel> */}
                    </Tabs>
                  ) : (
                    <div className="loaderBlock">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <DataTable
                    className="table table-striped table-hover"
                    columns={portColumns}
                    data={indianPortDataLT}
                    // noHeader
                    defaultSortField="id"
                    defaultSortAsc={false}
                    conditionalRowStyles = {conditionalRowStyles}
                    highlightOnHover
                    onRowClicked = {onDataRowClicked}
                    dense
                    progressPending={pendingIndPort}
                    progressComponent={<Loader />}
                    onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                    onRowMouseEnter={(row, e) => 
                      showTooltip(row, e) 
                    }
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
            </> : null }

            {forPortDataList.portsList && forPortDataList.portsList.length > 0 ?
            <>
              <h4>Top 10 Foreign Ports</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  <DataTable
                    className="table table-striped table-hover"
                    columns={portColumns}
                    data={forPortDataLT}
                    // noHeader
                    defaultSortField="id"
                    defaultSortAsc={false}
                    conditionalRowStyles = {conditionalRowStyles}
                    onRowClicked = {onDataRowClicked}
                    highlightOnHover
                    dense
                    progressPending={pendingForPort}
                    progressComponent={<Loader />}
                    onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                    onRowMouseEnter={(row, e) => 
                      showTooltip(row, e) 
                    }
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
                <div className="col-md-6">
                  {!pendingForPort ? (
                    <Tabs defaultIndex={0}>
                      <TabList>
                        <Tab>Pie</Tab>
                        <Tab>Bar</Tab>
                        {/* <Tab>Line</Tab> */}
                      </TabList>

                      <TabPanel>
                        <GraphPI barTitle={'Top 10 foreign ports'} labels={forPortLabel()} data={foreignPortPie()} />
                      </TabPanel>
                      <TabPanel>
                        <GraphBar barTitle={'Top 10 foreign ports'} labels={forPortLabel()} data={forPortData()} dataLabel="Total value (USD)"/>
                      </TabPanel>
                      {/* <TabPanel>
                        <GraphLine barTitle={'Top 10 foreign ports'} labels={forPortLabel()} data={forPortData()} />
                      </TabPanel> */}
                    </Tabs>
                  ) : (
                    <div className="loaderBlock">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </div>
            </> : null }

            {hsCodeDataList.hscodesList && hsCodeDataList.hscodesList.length > 0 ?
            <>
              <h4>Top 10 HS Codes</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  {!pendingHSCode ? (
                    <Tabs defaultIndex={1}>
                      <TabList>
                        <Tab>Pie</Tab>
                        <Tab>Bar</Tab>
                        {/* <Tab>Line</Tab> */}
                      </TabList>

                      <TabPanel>
                        <GraphPI barTitle={'Top 10 HS Codes'} labels={hsCodeLabel()} data={hsCodePie()} />
                      </TabPanel>
                      <TabPanel>
                        <GraphBar barTitle={'Top 10 HS Codes'} labels={hsCodeLabel()} data={hsCodeData()} dataLabel="Total value (USD)"/>
                      </TabPanel>
                      {/* <TabPanel>
                        <GraphLine barTitle={'Top 10 HS Codes'} labels={hsCodeLabel()} data={hsCodeData()} />
                      </TabPanel> */}
                    </Tabs>
                  ) : (
                    <div className="loaderBlock">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <DataTable
                    className="table table-striped table-hover"
                    columns={hsCodeColumns}
                    data={hsCodeDataLT}
                    // noHeader
                    defaultSortField="id"
                    defaultSortAsc={false}
                    conditionalRowStyles = {conditionalRowStyles}
                    onRowClicked = {onDataRowClicked}
                    highlightOnHover
                    dense
                    progressPending={pendingHSCode}
                    progressComponent={<Loader />}
                    onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                    onRowMouseEnter={(row, e) => 
                      showTooltip(row, e) 
                    }
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
            </> : null }

            {countryDataList.countriesList && countryDataList.countriesList.length > 0 ?
            <>
              <h4>Top 10 Countries</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  <DataTable
                    className="table table-striped table-hover"
                    columns={countryColumns}
                    data={countryDataLT}
                    defaultSortField="id"
                    defaultSortAsc={false}
                    conditionalRowStyles = {conditionalRowStyles}
                    onRowClicked = {onDataRowClicked}
                    highlightOnHover
                    dense
                    progressPending={pendingCountry}
                    progressComponent={<Loader />}
                    onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                    onRowMouseEnter={(row, e) => 
                      showTooltip(row, e) 
                    }
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
                <div className="col-md-6">
                  {!pendingCountry ? (
                    <Tabs defaultIndex={2}>
                      <TabList>
                        <Tab>Pie</Tab>
                        <Tab>Bar</Tab>
                        {/* <Tab>Line</Tab> */}
                      </TabList>

                      <TabPanel>
                        <GraphPI barTitle={'Top 10 countries'} labels={countryLabel()} data={countryDataPie()} />
                      </TabPanel>
                      <TabPanel>
                        <GraphBar barTitle={'Top 10 countries'} labels={countryLabel()} data={countryData()} dataLabel="Total value (USD)"/>
                      </TabPanel>
                      {/* <TabPanel>
                        <GraphLine barTitle={'Top 10 countries'} labels={countryLabel()} data={countryData()} />
                      </TabPanel> */}
                    </Tabs>
                  ) : (
                    <div className="loaderBlock">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </div>
            </> : null }

            {cityDataList.citiesList && cityDataList.citiesList.length > 0 ?
            <>
              <h4>Top 10 Cities</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  {!pendingCity ? (
                    <Tabs defaultIndex={0}>
                      <TabList>
                        <Tab>Pie</Tab>
                        <Tab>Bar</Tab>
                        {/* <Tab>Line</Tab> */}
                      </TabList>

                      <TabPanel>
                        <GraphPI barTitle={'Top 10 Cities'} labels={cityLabel()} data={cityDataPie()} />
                      </TabPanel>
                      <TabPanel>
                        <GraphBar barTitle={'Top 10 Cities'} labels={cityLabel()} data={cityData()} dataLabel="Total value (USD)"/>
                      </TabPanel>
                      {/* <TabPanel>
                        <GraphLine barTitle={'Top 10 Cities'} labels={cityLabel()} data={cityData()} />
                      </TabPanel> */}
                    </Tabs>
                  ) : (
                    <div className="loaderBlock">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <DataTable
                    className="table table-striped table-hover"
                    columns={cityColumns}
                    data={cityDataLT}
                    // noHeader
                    defaultSortField="id"
                    defaultSortAsc={false}
                    conditionalRowStyles = {conditionalRowStyles}
                    onRowClicked = {onDataRowClicked}
                    highlightOnHover
                    dense
                    progressPending={pendingCity}
                    progressComponent={<Loader />}
                    onRowMouseLeave = {(row, e)=> setTooltipContent("") }
                    onRowMouseEnter={(row, e) => 
                      showTooltip(row, e) 
                    }
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
            </> : null }
          </>
        ) : null}
        
        {toggle && <AdvanceSearch toggleFromChild={setToggle}
          importerDataList={importerDataArray}
          exporterDataList={exporterDataArray}
          portOriginDataList={portOriginDataArray}
          portDestinationDataList={portDestinationDataArray}
          countryOriginList={countryOriginList}
          countryDestinationList={countryDestinationList}
          hsCodeDataList={hsCodeDataArray}
          shipmentModeDataList={shipmentModeDataArray}
          shipmentModeList={shipmentModeList}
          type={searchParams.tradeType}
          updateFilter={updateFilter}
          portOriginList={portOriginList}
          portDestinationList={portDestinationList}
          hsCodeList={hsCodeList}
          importerList={importerList}
          exporterList={exporterList}
          cityOriginList={cityOriginList}
          cityDestinationList={cityDestinationList}
          hsCode4digitDataList={hsCode4digitDataArray}
          hsCode4DigitList={hsCode4DigitList}
          fetchSearchQuery={fetchSearchQuery}
          resetFilter = {resetFilter}
          stdUnitList = {stdUnitList}
          stdUnitDataList = {stdUnitDataArray}
          importerForExport = {importerForExport}
          exporterForImport = {exporterForImport}

        />}
      </div>
      <div>
          { showModal ? 
          <Modal 
              show={showModal}
              onHide={handleModalClose} 
              dialogClassName={"modal-xl"}
              >             
              <Modal.Header closeButton > Details </Modal.Header>
              <Modal.Title >  </Modal.Title>

                  <Modal.Body >
                  <div>
                  <AnalysisTable  
                    columnList = {newModalColumn}
                    dataList = {newModalData}
                  />
                  </div>
                  </Modal.Body>
                      
            </Modal>
          : null}
      </div>
    </>
  );
}

const mapStateToProps = state => {
  return {
    loading: state.loader.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadingStart: () => dispatch(loaderStart()),
    loadingStop: () => dispatch(loaderStop()),
  };
};

export default withRouter (connect( mapStateToProps, mapDispatchToProps)(Analysis));
