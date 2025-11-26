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
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
//import GraphPI from '../components/GraphPI';
//import GraphBar from '../components/GrapghBar';
//import GraphLine from '../components/GraphLine';
import { TagsInput } from "react-tag-input-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css'
import { useHistory, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loaderStart, loaderStop } from "../store/actions/loader";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
//import AnalysisTable from '../components/IndepthTable'
//import AdvanceSearch from '../components/AdvanceSearch';
//import Draggable from 'react-draggable';
//import BlankImg from '../assets/image/BlankImg.png'
import IndepthSearchTable from './IndepthSearchTable';
import { setSearchQuery } from "../store/actions/data"
import RelativePerformanceGraph from './RelativePerformanceGraph';  
//const dateFormat = "YYYY-MM-DD";

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









const RelativePerformance = (props) => {

const search_id = props.location.state ? props.location.state.search_id : null ;
const importerForExport = props.location.state ? props.location.state.importerForExport : null ;
const exporterForImport = props.location.state ? props.location.state.exporterForImport : null ;
const [active, setActive] = useState("relativePerformance");

const [selectedCountry, setSelectedCountry] = useState("");
const [hsCodeDropdownList, setHsCodeDropdownList] = useState([]); 
const [hsCodeDropdownListType, setHsCodeDropdownListType] = useState("4digits"); 
// Add this with your existing states
const [selectedHsCode, setSelectedHsCode] = useState("");

const fetchSearchQuery = () => {
   console.log('fetchSearchQuery start, search_id=', search_id);
  if (search_id) {
    props.loadingStart()
    let queryBuilderSuggestionList = []
    Axios({
      method: "GET",
      url: `/search-management/search/details`,
      params: { searchId: search_id }
    })
      .then(res => {
        console.log('fetchSearchQuery response:', res);
        if (res.data.queryList) {
          let sParams = res.data.queryList[0].userSearchQuery;
          setSelectedCountry(sParams.countryCode || '');

         // ✅ NEW: Determine HS Code dropdown type based on search
            determineHsCodeDropdown(sParams);

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
          console.log("Search Params set in Relative Performance page: ", sParams); 
        }
      })
      .catch(err => {
        // console.log("Err", err);
      });
  }
}

// ✅ FIXED: Complete determineHsCodeDropdown function
const determineHsCodeDropdown = (sParams) => {
   console.log('determineHsCodeDropdown called with sParams:', sParams);
   
   // Check if we have search values to work with
   if (!sParams.searchValue || sParams.searchValue.length === 0) {
     console.log('No search values found, checking other fields...');
     
     // Check hsCodeList as fallback
     if (sParams.hsCodeList && sParams.hsCodeList.length > 0) {
       const firstHsCode = sParams.hsCodeList[0];
       if (firstHsCode.length === 8) {
         setHsCodeDropdownListType("4 Digits");
         getHSCode4digitList(sParams);
         return;
       } else if (firstHsCode.length === 4 || firstHsCode.length === 2) {
         setHsCodeDropdownListType("2 Digits");
        // getHSCode2digitList(sParams);
         return;
       }
     }
     
     // Check hsCode4DigitList as fallback
     if (sParams.hsCode4DigitList && sParams.hsCode4DigitList.length > 0) {
       setHsCodeDropdownListType("2 Digits");
       //getHSCode2digitList(sParams);
       return;
     }
     
     // Default case
     setHsCodeDropdownListType("4 Digits");
     getHSCode4digitList(sParams);
     return;
   }
   
   // Main logic for searchValue
   if ((sParams.searchBy === 'HS_CODE' || sParams.searchBy === 'PRODUCT') && 
       sParams.searchValue && sParams.searchValue.length > 0) {
     
     const firstHsCode = sParams.searchValue[0];
     console.log('First HS Code:', firstHsCode, 'Length:', firstHsCode.length);
     
     if (firstHsCode.length === 8) {
       console.log('8-digit HS code detected, showing 4-digit list');
       setHsCodeDropdownListType("4 Digits");
       getHSCode4digitList(sParams);
       return;
     } else if (firstHsCode.length === 4 || firstHsCode.length === 2) {
       console.log('4/2-digit HS code detected, showing 2-digit list');
       setHsCodeDropdownListType("2 Digits");
      // getHSCode2digitList(sParams);
       return;
     }
   }
   
   // Default case - show 4-digit HS codes
   console.log('Default case, showing 4-digit HS codes');
   setHsCodeDropdownListType("4 Digits");
   getHSCode4digitList(sParams);
};


const handleHsCodeChange = (newHsCode) => {
  if(newHsCode){
    console.log("HS Code changed to: ", newHsCode);
  }
}

  const history = useHistory();

  const [toggle, setToggle] = useState(false);
 // const [pendingImport, setPendingImport] = useState(true);
 // const [pendingExport, setPendingExport] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  //const [importerDataList, setImporterDataList] = useState([]); //Usig for data card
  //const [exporterDataList, setExporterDataList] = useState([]);
  //const [pendingIndPort, setPendingIndPort] = useState(true);
  //const [indianPortDataList, setIndianPortDataList] = useState([]);
 // const [pendingForPort, setPendingForPort] = useState(true);
 // const [forPortDataList, setForPortDataList] = useState([]);
  const [pendingHSCode, setPendingHSCode] = useState(true);
  const [hsCodeDataList, setHSCodeDataList] = useState([]); //Usig for data card
 // const [pendingCountry, setPendingCountry] = useState(true);
 // const [countryDataList, setCountryDataList] = useState([]);
  //const [pendingCity, setPendingCity] = useState(true);
 // const [cityDataList, setCityDataList] = useState([]);
  const [tradeCountryList, setTradeCountryList] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
 // const [monthWise, setMonthWiseList] = useState([]);
//  const [monthWiseDataList, setMonthWiseDataList] = useState([]);
  const [queryBuilderSearchValue, setQueryBuilderSearchValue] = useState([]);
 // const [importerDataLT, setImporterDataLT] = useState([]);
 // const [exporterDataLT, setExportertDataLT] = useState([]);
  //const [indianPortDataLT, setIndianPortDataLT] = useState([]);
 // const [forPortDataLT, setForPortDataLT] = useState([]);
  const [hsCodeDataLT, setHSCodeDataLT] = useState([]);
 // const [countryDataLT, setCountryDataLT] = useState([]);
 // const [cityDataLT, setCityDataLT] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newModalColumn, setNewModalColumn] = useState([]);
  const [newModalData, setNewModalData] = useState([]);

  const [portOriginList, setPortOriginList] = useState([]);
 // const [portOriginDataArray, setPortOriginDataArray] = useState([]);
  //const [portDestinationDataArray, setPortDestinationDataArray] = useState([]);
  const [portDestinationList, setPortDestinationList] = useState([]);
 // const [countryOriginList, setCountryOriginList] = useState([]);
  const [countryDestinationList, setCountryDestinationList] = useState([]);
  const [cityOriginList, setCityOriginList] = useState([]);
  const [cityDestinationList, setCityDestinationList] = useState([]);
 // const [shipmentModeDataArray, setShipmentModeDataArray] = useState([]);
  const [shipmentModeList, setShipmentModeList] = useState([]);
  const [hsCode4DigitList, setHsCode4digitList] = useState([])
  const [hsCode4digitDataArray, setHsCode4digitDataArray] = useState([])
  const [stdUnitDataArray, setStdUnitDataArray] = useState([]);
  const [stdUnitList, setStdUnitList] = useState([]);
  
  const [importerList, setImporterList] = useState([]);
 // const [importerDataArray, setImporterDataArray] = useState([]);
  const [exporterList, setExporterList] = useState([]);
  //const [exporterDataArray, setExporterDataArray] = useState([]);
  const [hsCodeList, setHsCodeList] = useState([]);
  const [hsCodeDataArray, setHsCodeDataArray] = useState([]);

  /*11/1/2025 */

  const [filterType, setFilterType] = useState("Value");


const data = [
    { month: "Jan", hsExport: 120, industryExport: 1000 },
    { month: "Feb", hsExport: 150, industryExport: 1100 },
    { month: "Mar", hsExport: 170, industryExport: 1150 },
    { month: "Apr", hsExport: 160, industryExport: 1120 },
    { month: "May", hsExport: 200, industryExport: 1250 },
    { month: "Jun", hsExport: 220, industryExport: 1300 },
    { month: "Jul", hsExport: 210, industryExport: 1280 },
    { month: "Aug", hsExport: 250, industryExport: 1400 },
    { month: "Sep", hsExport: 240, industryExport: 1380 },
    { month: "Oct", hsExport: 260, industryExport: 1450 },
    { month: "Nov", hsExport: 280, industryExport: 1500 },
    { month: "Dec", hsExport: 300, industryExport: 1550 },
  ];

    const calculateMarketShare = (hs, industry) =>
    ((hs / industry) * 100).toFixed(1) + "%";

  const handleModal = (rowData,columns)  => {
    setShowModal(true)
    setNewModalColumn(columns)
    setNewModalData(rowData)
  }

  const handleModalClose = ()  => {
    setShowModal(false)
  }


  const handleSearch = (values) => {
    console.log("Search Values:", values);
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
    //getImporterList(params);
   
    //getExporterList(params);
   // getIndianPortList(params);
  //  getForeignPortList(params);
    getHSCodeList(params);
   // getForeignCountryList(params);
   // getCityList(params);
   // getShipmentModeList(params);
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
  /* IMPORTANT  16/09/2025*/
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
        console.log("HS Code 4 digit List: ", hsList);
        setHsCodeDropdownList(hsList);
        setHsCode4digitDataArray(hsList);
      })
      .catch(err => {
        // console.log("Err", err);
        setHsCode4digitDataArray([]);
      });
  }
/*
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
  */
  /* IMPORTANT  16/09/2025*/
  /*
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
      //  console.log("importer data ============= ", res.data.importersList);
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
        //console.log("importer data list ============= ", data );
        setImporterDataList(res.data);
        setPendingImport(false);
      })
      .catch(err => {
        // console.log("Err");
        setPendingImport(false);
      });
  }
  */

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
/*
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
*/

/*
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
*/
/*
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
*/
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

  /*
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
  */
 /*
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
        fsetPendingCity(false);
      });
  }
      */

  useEffect(() => {
    fetchSearchQuery()
    if (searchParams && searchParams.tradeType) {
      console.log('searchParams changed - fetching lists', searchParams);
     // getImporterList(searchParams);
    
     // getExporterList(searchParams);
     // getIndianPortList(searchParams);
    //  getForeignPortList(searchParams);
      getHSCodeList(searchParams);
    //  getForeignCountryList(searchParams);
     // getCityList(searchParams);
      getTradingCountryList(searchParams.tradeType);
    //  getShipmentModeList(searchParams);
      getHSCode4digitList(searchParams);
      getStdUnitList(searchParams);
    }
  }, []);




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
                                pathname: "/list1", 
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
        
    
 
  <div className="row mb-4">
 
      {/* Button 1 */}
      <div className="col-lg-2 col-md-3 mb-3">
        {/* <button
          className={`btn w-100 py-3 ${
            active === "importer" ? "btn-warning" : "btn-primary"
          }`}
          onClick={() => setActive("importer")}
        >
          Nexus
        </button> */}

          <Link  className={`btn w-100 py-3 ${
            active === "indepth" ? "btn-warning" : "btn-primary"
          }`} to={{
                  pathname: "/indepthAnalysis",
                  state: {
                  search_id: search_id,
                  importerForExport: props.location.state ? props.location.state.importerForExport : null,
                  exporterForImport: props.location.state ? props.location.state.exporterForImport : null
                  },
              }}> Nexus </Link>
      </div>

      {/* Button 2 */}
      <div className="col-lg-2 col-md-3 mb-3">
      

              <Link  className={`btn w-100 py-3 ${
            active === "relativePerformance" ? "btn-warning" : "btn-primary"
          }`} to={{
                  pathname: "/relativePerformance",
                  state: {
                  search_id: search_id,
                  importerForExport: props.location.state ? props.location.state.importerForExport : null,
                  exporterForImport: props.location.state ? props.location.state.exporterForImport : null
                  },
              }}> Relative Performance </Link>
      </div>

      {/* Button 3 */}
      <div className="col-lg-2 col-md-3 mb-3">
        <button
          className={`btn w-100 py-3 ${
            active === "hscode" ? "btn-warning" : "btn-primary"
          }`}
          onClick={() => setActive("hscode")}
        >
          Loream Ipsume 2
        </button>
      </div>

      {/* Button 4 */}
      <div className="col-lg-2 col-md-3 mb-3">
        <button
          className={`btn w-100 py-3 ${
            active === "country" ? "btn-warning" : "btn-primary"
          }`}
          onClick={() => setActive("country")}
        >
          Loream Ipsume 3
        </button>
      </div>

      {/* Button 5 */}
      <div className="col-lg-2 col-md-3 mb-3">
        <button
          className={`btn w-100 py-3 ${
            active === "indepthAnalysis" ? "btn-warning" : "btn-primary"
          }`}
          onClick={() => setActive("indepthAnalysis")}
        >
          Loream Ipsume 4
        </button>
      </div>

           {/* Button 5 */}
      <div className="col-lg-2 col-md-3 mb-3">
        <button
          className={`btn w-100 py-3 ${
            active === "indepthAnalysis2" ? "btn-warning" : "btn-primary"
          }`}
          onClick={() => setActive("indepthAnalysis2")}
        >
          Loream Ipsume 5
        </button>
      </div>


   
    </div>

      <div className="container my-4">
      <h4 className="fw-bold mb-3">Relative Performance of HS Code 8708</h4>

      {/* Filters */}
      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Source Country</label>
          <select className="form-select form-control"
          value={selectedCountry} disabled={true}>
             {tradeCountryList && tradeCountryList.length > 0 ? 
      tradeCountryList.map((country, index) => (
        <option key={index} value={country.shortcode}>
          {country.name}
        </option>
      )) : null
    }
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">HS Code  {hsCodeDropdownListType ==='2digit' ? '2-digit' : '4-digit'}</label>
          <select className="form-select form-control" value={selectedHsCode}
          onChange={(e)=>{
                const newHsCode=e.target.value;
                setSelectedHsCode(newHsCode);
                if(newHsCode){
                  handleHsCodeChange(newHsCode);
                }
              }
            }>
               {hsCodeDropdownList && hsCodeDropdownList.length > 0 ? 
                  hsCodeDropdownList.map((hsCode, index) => (
                    <option key={index} value={hsCode.value}>
                      {hsCode.label}
                    </option>
                  )) : 
                  null
                }
          </select>
        </div>
      
      </div>

      {/* Table */}
       <RelativePerformanceGraph />
    </div>











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
    setSearchQuery: (data) => dispatch(setSearchQuery(data)),
  };
};

export default withRouter (connect( mapStateToProps, mapDispatchToProps)(RelativePerformance));