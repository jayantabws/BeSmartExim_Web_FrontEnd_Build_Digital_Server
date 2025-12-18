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







const Analysis = (props) => {

const search_id = props.location.state ? props.location.state.search_id : null ;
const importerForExport = props.location.state ? props.location.state.importerForExport : null ;
const exporterForImport = props.location.state ? props.location.state.exporterForImport : null ;
  const [active, setActive] = useState("indepth");



const fetchSearchQuery = () => {
  // console.log('fetchSearchQuery start, search_id=', search_id);
  if (search_id) {
    props.loadingStart()
    let queryBuilderSuggestionList = []
    Axios({
      method: "GET",
      url: `/search-management/search/details`,
      params: { searchId: search_id }
    })
      .then(res => {
       // console.log('fetchSearchQuery response:', res);
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

  
  const [pendingImport, setPendingImport] = useState(true);
  const [pendingExport, setPendingExport] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [importerDataList, setImporterDataList] = useState([]); //Usig for data card
  const [exporterDataList, setExporterDataList] = useState([]);
  const [pendingIndPort, setPendingIndPort] = useState(true);
  const [indianPortDataList, setIndianPortDataList] = useState([]);
  const [pendingForPort, setPendingForPort] = useState(true);
  const [forPortDataList, setForPortDataList] = useState([]);
  const [pendingHSCode, setPendingHSCode] = useState(true);
  const [hsCodeDataList, setHSCodeDataList] = useState([]); //Usig for data card
  const [pendingCountry, setPendingCountry] = useState(true);
  const [countryDataList, setCountryDataList] = useState([]);
  const [pendingCity, setPendingCity] = useState(true);
  const [cityDataList, setCityDataList] = useState([]);
  const [tradeCountryList, setTradeCountryList] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

//  const [monthWiseDataList, setMonthWiseDataList] = useState([]);
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

  /*SAMPLE DATA */

  const [showTable, setShowTable] = useState(false);

  // Loading states for each card

  const [card1ImportExport, setCard1ImportExport] = useState("exporter"); // default to exporter

  const [card1Loading, setCard1Loading] = useState(false);
  const [card2Loading, setCard2Loading] = useState(false);
  const [card3Loading, setCard3Loading] = useState(false);
  const [card4Loading, setCard4Loading] = useState(false);
  const [card5Loading, setCard5Loading] = useState(false);

  const [card1Select, setCard1Select] = useState("");
  const [card2Select, setCard2Select] = useState("");
  const [card3Select, setCard3Select] = useState("");
  const [card4Select, setCard4Select] = useState("");
  const [card5Select, setCard5Select] = useState("");

  // State for searchable dropdowns
  const [selectedImporters, setSelectedImporters] = useState([]);
  const [selectedExporters, setSelectedExporters] = useState([]);

  // Search state for Card 1 ,2 , 3 ,4 ,5 
  const [card1SearchTerm, setCard1SearchTerm] = useState("");
  const [card2SearchTerm, setCard2SearchTerm] = useState("");
  const [card3SearchTerm, setCard3SearchTerm] = useState("");
  const [card4SearchTerm, setCard4SearchTerm] = useState("");
  const [card5SearchTerm, setCard5SearchTerm] = useState("");

    // Add these state variables for Cards 2-5 selections
  const [selectedCard2Items, setSelectedCard2Items] = useState([]);
  const [selectedCard3Items, setSelectedCard3Items] = useState([]);
  const [selectedCard4Items, setSelectedCard4Items] = useState([]);
  const [selectedCard5Items, setSelectedCard5Items] = useState([]);

    // Add state to track per-card values
  const [cardValuesTotal, setCardValuesTotal] = useState(0);
  const [totalShipmentCount, setTotalShipmentCount] = useState(0);

  const [mySelectedOptions, setMySelectedOptions] = useState({
    exporter:0,
    importer:0,
    hscode:0,
    country:0,
    port:0
  });

// ...Indepth Search Table code...
const [indepthParams, setIndepthParams] = useState(null); // payload passed to IndepthSearchTable

const buildFinalParams = () => {
  const p = { ...(searchParams || {}) };
  // ✅ Add searchId from the search_id variable
  p.searchId = search_id; // Add this line
  
  // card1: exporter/importer - if items are objects map to id/name expected by API
  if (card1ImportExport === "exporter") {
    p.exporterList = Array.isArray(selectedExporters) ? selectedExporters.map(x => (x && x.id) ? x.id : x) : [];
    p.importerList = [];
  } else {
    p.importerList = Array.isArray(selectedImporters) ? selectedImporters.map(x => (x && x.id) ? x.id : x) : [];
    p.exporterList = [];
  }



  // ensure arrays exist
  p.hsCode4DigitList = p.hsCode4DigitList || [];
  p.cityOriginList = p.cityOriginList || [];
  p.cityDestinationList = p.cityDestinationList || [];

  //Ensure both ports lists exist
  p.portOriginList = p.portOriginList || [];
  p.portDestinationList = p.portDestinationList || [];

  p.shipmentModeList = p.shipmentModeList || [];
  p.stdUnitList = p.stdUnitList || [];
  p.queryBuilder = p.queryBuilder || [];
  p.countryCode = p.countryCode || []; // if used
//console.log("Final indepth params:", p);
  return p;
};



useEffect(() => {
 // console.log(" cardValuesTotal changed:", cardValuesTotal);
}, [cardValuesTotal]);

useEffect(() => {
 // console.log(" totalShipmentCount changed:", totalShipmentCount);
}, [totalShipmentCount]);


const getValueForParams = (updatedParams, cardNumber) => {
  if (!updatedParams) return 0;

  const postData = {
   
    searchType: "TRADE",
    tradeType: updatedParams.tradeType,
    fromDate: updatedParams.fromDate,
    toDate: updatedParams.toDate,
    searchBy: updatedParams.searchBy,
    searchValue: updatedParams.searchValue,
    countryCode: updatedParams.countryCode,
    pageNumber: 0,
    numberOfRecords: 20,
    matchType: updatedParams.matchType,
    
    // ✅ Use portOriginList and portDestinationList (countries are already in these)
    portOriginList: updatedParams.portOriginList || [],
    portDestinationList: updatedParams.portDestinationList || [],
    
    // Remove countryList since countries are in port lists
    hsCodeList: updatedParams.hsCodeList || [],
    hsCode4DigitList: updatedParams.hsCode4DigitList || [],
    exporterList: updatedParams.exporterList || [],
    importerList: updatedParams.importerList || [],
    cityOriginList: updatedParams.cityOriginList || [],
    cityDestinationList: updatedParams.cityDestinationList || [],
    searchId: search_id,
    queryBuilder: updatedParams.queryBuilder || [],
    shipModeList: updatedParams.shipmentModeList || [],
    stdUnitList: updatedParams.stdUnitList || [],
  };

 // console.log(`Payload getValueForParams called for card${cardNumber}`, postData);
  console.log("Payload getValueForParams called:", postData);
  return Axios({
    method: "POST",
    url: `/search-management/getvalue`,
    data: JSON.stringify(postData),
    headers: { "Content-Type": "application/json" }
  }).then(res => {  
   // console.log(`getValueForParams response for card${cardNumber}:`, res);
    var valueTotal = (res && res.data) ? res.data : 0;
    
    // ✅ FIX: Force state update with functional setState
    setCardValuesTotal(prev => {
    //  console.log(`Updating card value from ${prev} to ${valueTotal}`);
      return valueTotal;
    });
    
    //console.log(`Card ${cardNumber} value set:`, valueTotal);
    return { valueTotal };
  })
  .catch(err => {
    console.error(`getValueForParams error for card${cardNumber}:`, err);
    // ✅ FIX: Also use functional setState for error case
    setCardValuesTotal(prev => {
    //  console.log(`Setting card value to 0 due to error, previous was ${prev}`);
      return 0;
    });
    return { valueTotal: 0 };
  });
};

const getTotalShipmentCount = (updatedParams) => {
  if (!updatedParams) return 0; 
  
   const postData = {
    
    searchType: "TRADE",
    tradeType: updatedParams.tradeType,
    fromDate: updatedParams.fromDate,
    toDate: updatedParams.toDate,
    searchBy: updatedParams.searchBy,
    searchValue: updatedParams.searchValue,
    countryCode: updatedParams.countryCode,
    pageNumber: 0,
    numberOfRecords: 20,
    matchType: updatedParams.matchType,
    
    // ✅ Use portOriginList and portDestinationList (countries are already in these)
    portOriginList: updatedParams.portOriginList || [],
    portDestinationList: updatedParams.portDestinationList || [],
    
    // Remove countryList since countries are in port lists
    hsCodeList: updatedParams.hsCodeList || [],
    hsCode4DigitList: updatedParams.hsCode4DigitList || [],
    exporterList: updatedParams.exporterList || [],
    importerList: updatedParams.importerList || [],
    cityOriginList: updatedParams.cityOriginList || [],
    cityDestinationList: updatedParams.cityDestinationList || [],
    searchId: search_id,
    queryBuilder: updatedParams.queryBuilder || [],
    shipModeList: updatedParams.shipmentModeList || [],
    stdUnitList: updatedParams.stdUnitList || [],
  };
console.log("Payload getTotalShipmentCount called:", postData);
  return Axios({
    method: "POST",
    url: `/search-management/searchcount`,
    data: JSON.stringify(postData),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => {
    var valueshipmentdata = (res && res.data) ? res.data : 0;
   // console.log("Shipment Count response:", res);
    
    // ✅ FIX: Force state update with functional setState
    setTotalShipmentCount(prev => {
     // console.log(`Updating shipment count from ${prev} to ${valueshipmentdata}`);
      return valueshipmentdata;
    });
    
    return { valueshipmentdata };
  })
  .catch(err => {
    console.error("Shipment count error:", err);
    // ✅ FIX: Also use functional setState for error case
    setTotalShipmentCount(prev => {
     // console.log(`Setting shipment count to 0 due to error, previous was ${prev}`);
      return 0;
    });
    return { valueshipmentdata: 0 };
  });
};


// const resetAllRecords=()=>{
//   window.location.reload();
// }

// Update handleExporterChange to include value and shipment count updates
const handleExporterChange = async (item, isChecked, selectedItems, setSelectedItems) => {
  console.log("Exporter change triggered:", item, isChecked);
  
  let newSelected;
  if (isChecked) {
    newSelected = [...selectedItems, item.exporter_name];
  } else {
    newSelected = selectedItems.filter(exp => exp !== item.exporter_name);
  }
  
  setSelectedItems(newSelected);
  setSelectedExporters(newSelected);
  
  // Update mySelectedOptions for exporter
  const updatedOptions = {
    ...mySelectedOptions,
    exporter: newSelected.length > 0 ? 1 : 0
  };
  setMySelectedOptions(updatedOptions);
  
  // Build updated parameters for API calls
  const updatedParams = {
    ...searchParams,
    exporterList: newSelected,
    searchId: search_id
  };
  
  // Call value and shipment count APIs immediately
  // try {
  //   await Promise.all([
  //     getValueForParams(updatedParams, 1),
  //     getTotalShipmentCount(updatedParams)
  //   ]);
  // } catch (error) {
  //   console.error("Error updating values:", error);
  // }
  
  // Call APIs for ALL cards that have value 0 (backtracking allowed)
  if (newSelected.length > 0) {
    try {
      const params = {
        ...updatedParams,
        // Apply current selections with trade type logic
        ...(portOriginList.length > 0 && searchParams.tradeType === "EXPORT" && {
          portOriginList: portOriginList
        }),
        ...(portDestinationList.length > 0 && searchParams.tradeType === "IMPORT" && {
          portDestinationList: portDestinationList
        }),
        ...(cityOriginList.length > 0 && searchParams.tradeType === "IMPORT" && {
          cityOriginList: cityOriginList
        }),
        ...(cityDestinationList.length > 0 && searchParams.tradeType === "EXPORT" && {
          cityDestinationList: cityDestinationList
        })
      };
      
      // Call APIs for all cards with value 0
      const apiCalls = [];
      const loadingStates = [];
      
      if (updatedOptions.hscode === 0) {
        apiCalls.push(getHSCodeList(params), getHSCode4digitList(params));
        loadingStates.push(() => setCard2Loading(true));
      }
      
      if (updatedOptions.port === 0) {
        apiCalls.push(getIndianPortList(params), getForeignPortList(params));
        loadingStates.push(() => setCard3Loading(true));
      }
      
      if (updatedOptions.country === 0) {
        apiCalls.push(getForeignCountryList(params));
        loadingStates.push(() => setCard4Loading(true));
      }
      
      if (updatedOptions.importer === 0) {
        apiCalls.push(getImporterList(params));
        loadingStates.push(() => setCard5Loading(true));
      }
      
      // Set loading states for cards that will be updated
      loadingStates.forEach(setLoading => setLoading());
      
      // Call APIs for cards with value 0
      if (apiCalls.length > 0) {
         await Promise.allSettled(apiCalls);
          setSearchParams(params); // ✅ CRITICAL: Update main searchParams state
          getValueForParams(params, 1);
          getTotalShipmentCount(params);
      }
      
      // Reset loading states
      setTimeout(() => {
        if (updatedOptions.hscode === 0) setCard2Loading(false);
        if (updatedOptions.port === 0) setCard3Loading(false);
        if (updatedOptions.country === 0) setCard4Loading(false);
        if (updatedOptions.importer === 0) setCard5Loading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error in exporter cascading update:", error);
      // Reset all loading states on error
      setCard2Loading(false);
      setCard3Loading(false);
      setCard4Loading(false);
      setCard5Loading(false);
    }
  }
};

// Update handleHsCodeChange to include value and shipment count updates
const handleHsCodeChange = async (item, isChecked, selectedItems, setSelectedItems, digitMode) => {
  console.log("HSCode change triggered:", item, isChecked, "digitMode:", digitMode);
  
  const itemValue = item.value;
  let newSelected;
  if (isChecked) {
    newSelected = [...selectedItems, itemValue];
  } else {
    newSelected = selectedItems.filter(code => code !== itemValue);
  }
  
  setSelectedItems(newSelected);
  
  // Update appropriate global state based on digit mode
  if (digitMode === 4) {
    setHsCode4digitList(newSelected);
  } else {
    setHsCodeList(newSelected);
  }
  
  // Update mySelectedOptions for hscode
  const updatedOptions = {
    ...mySelectedOptions,
    hscode: newSelected.length > 0 ? 1 : 0
  };
  setMySelectedOptions(updatedOptions);
  
  // Build updated parameters for API calls
  const updatedParams = {
    ...searchParams,
    ...(digitMode === 4 ? { hsCode4DigitList: newSelected } : { hsCodeList: newSelected }),
    searchId: search_id
  };
  
  // Call value and shipment count APIs immediately
  // try {
  //   await Promise.all([
  //     getValueForParams(updatedParams, 2),
  //     getTotalShipmentCount(updatedParams)
  //   ]);
  // } catch (error) {
  //   console.error("Error updating values:", error);
  // }
  
  // Call APIs for ALL cards that have value 0 (backtracking allowed)
  if (newSelected.length > 0) {
    try {
      const params = {
        ...updatedParams,
        // Apply current selections with trade type logic
        ...(selectedExporters.length > 0 && {
          exporterList: selectedExporters
        }),
        ...(portOriginList.length > 0 && searchParams.tradeType === "EXPORT" && {
          portOriginList: portOriginList
        }),
        ...(portDestinationList.length > 0 && searchParams.tradeType === "IMPORT" && {
          portDestinationList: portDestinationList
        }),
        ...(cityOriginList.length > 0 && searchParams.tradeType === "IMPORT" && {
          cityOriginList: cityOriginList
        }),
        ...(cityDestinationList.length > 0 && searchParams.tradeType === "EXPORT" && {
          cityDestinationList: cityDestinationList
        }),
        // ...(countryOriginList.length > 0 && {
        //   countryList: countryOriginList
        // }),
        ...(importerList.length > 0 && {
          importerList: importerList
        })
      };
      
      // Call APIs for all cards with value 0 (including backwards)
      const apiCalls = [];
      const loadingStates = [];
      
      // Backtracking: Update exporter if no selections
      if (updatedOptions.exporter === 0) {
        apiCalls.push(getExporterList(params));
        loadingStates.push(() => setCard1Loading(true));
      }
      
      // Forward: Update subsequent cards
      if (updatedOptions.port === 0) {
        apiCalls.push(getIndianPortList(params), getForeignPortList(params));
        loadingStates.push(() => setCard3Loading(true));
      }
      
      if (updatedOptions.country === 0) {
        apiCalls.push(getForeignCountryList(params));
        loadingStates.push(() => setCard4Loading(true));
      }
      
      if (updatedOptions.importer === 0) {
        apiCalls.push(getImporterList(params));
        loadingStates.push(() => setCard5Loading(true));
      }
      
      // Set loading states for cards that will be updated
      loadingStates.forEach(setLoading => setLoading());
      
      // Call APIs for cards with value 0
      if (apiCalls.length > 0) {
           setSearchParams(params);
          await Promise.allSettled(apiCalls);
          getValueForParams(params, 2);
          getTotalShipmentCount(params);
      }
      
      // Reset loading states
      setTimeout(() => {
        if (updatedOptions.exporter === 0) setCard1Loading(false);
        if (updatedOptions.port === 0) setCard3Loading(false);
        if (updatedOptions.country === 0) setCard4Loading(false);
        if (updatedOptions.importer === 0) setCard5Loading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error in HSCode cascading update:", error);
      // Reset all loading states on error
      setCard1Loading(false);
      setCard3Loading(false);
      setCard4Loading(false);
      setCard5Loading(false);
    }
  }
};

// Update handlePortChange to include value and shipment count updates
const handlePortChange = async (item, isChecked, selectedItems, setSelectedItems) => {
  console.log("Port change triggered:", item, isChecked);
  
  let newSelected;
  if (isChecked) {
    newSelected = [...selectedItems, item.port_name];
  } else {
    newSelected = selectedItems.filter(port => port !== item.port_name);
  }
  
  setSelectedItems(newSelected);
  
  // Update global state - ports go to appropriate list based on trade type
  if (searchParams && searchParams.tradeType === "EXPORT") {
    setPortOriginList(newSelected);
  } else {
    setPortDestinationList(newSelected);
  }
  
  // Update mySelectedOptions for port
  const updatedOptions = {
    ...mySelectedOptions,
    port: newSelected.length > 0 ? 1 : 0
  };
  setMySelectedOptions(updatedOptions);
  
  // Build updated parameters for API calls
  const updatedParams = {
    ...searchParams,
    // Apply trade type logic for ports
    ...(searchParams.tradeType === "EXPORT" ? 
      { portOriginList: newSelected } : 
      { portDestinationList: newSelected }),
    searchId: search_id
  };
  
  // Call value and shipment count APIs immediately
 /* try {
    await Promise.all([
      getValueForParams(updatedParams, 3),
      getTotalShipmentCount(updatedParams)
    ]);
  } catch (error) {
    console.error("Error updating values:", error);
  } */
  
  // Call APIs for ALL cards that have value 0 (backtracking allowed)
  if (newSelected.length > 0) {
    try {
      const params = {
        ...updatedParams,
        // Apply current selections with trade type logic
        ...(selectedExporters.length > 0 && {
          exporterList: selectedExporters
        }),
        ...(hsCodeList.length > 0 && {
          hsCodeList: hsCodeList
        }),
        ...(hsCode4DigitList.length > 0 && {
          hsCode4DigitList: hsCode4DigitList
        }),
        ...(cityOriginList.length > 0 && searchParams.tradeType === "IMPORT" && {
          cityOriginList: cityOriginList
        }),
        ...(cityDestinationList.length > 0 && searchParams.tradeType === "EXPORT" && {
          cityDestinationList: cityDestinationList
        }),
        // ...(countryOriginList.length > 0 && {
        //   countryList: countryOriginList
        // }),
        ...(importerList.length > 0 && {
          importerList: importerList
        })
      };
      
      // Call APIs for all cards with value 0 (including backwards)
      const apiCalls = [];
      const loadingStates = [];
      
      // Backtracking: Update previous cards if no selections
      if (updatedOptions.exporter === 0) {
        apiCalls.push(getExporterList(params));
        loadingStates.push(() => setCard1Loading(true));
      }
      
      if (updatedOptions.hscode === 0) {
        apiCalls.push(getHSCodeList(params), getHSCode4digitList(params));
        loadingStates.push(() => setCard2Loading(true));
      }
      
      // Forward: Update subsequent cards
      if (updatedOptions.country === 0) {
        apiCalls.push(getForeignCountryList(params));
        loadingStates.push(() => setCard4Loading(true));
      }
      
      if (updatedOptions.importer === 0) {
        apiCalls.push(getImporterList(params));
        loadingStates.push(() => setCard5Loading(true));
      }
      
      // Set loading states for cards that will be updated
      loadingStates.forEach(setLoading => setLoading());
      
      // Call APIs for cards with value 0
      if (apiCalls.length > 0) {

        setSearchParams(params);  
        await Promise.allSettled(apiCalls);

         getValueForParams(params, 3);
         getTotalShipmentCount(params);
      }
      
      // Reset loading states
      setTimeout(() => {
        if (updatedOptions.exporter === 0) setCard1Loading(false);
        if (updatedOptions.hscode === 0) setCard2Loading(false);
        if (updatedOptions.country === 0) setCard4Loading(false);
        if (updatedOptions.importer === 0) setCard5Loading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error in Port cascading update:", error);
      // Reset all loading states on error
      setCard1Loading(false);
      setCard2Loading(false);
      setCard4Loading(false);
      setCard5Loading(false);
    }
  }
};

const handleCountryChange = async (item, isChecked, selectedItems, setSelectedItems) => {
  console.log("Country change triggered:", item, isChecked);
  
  let newSelected;
  if (isChecked) {
    newSelected = [...selectedItems, item.country_name];
  } else {
    newSelected = selectedItems.filter(country => country !== item.country_name);
  }
  
  setSelectedItems(newSelected);
  setSelectedCard4Items(newSelected);
  
  // Update global state for city arrays based on trade type
  if (searchParams && searchParams.tradeType === "EXPORT") {
    setCityDestinationList(newSelected);
  } else {
    setCityOriginList(newSelected);
  }
  
  // Update mySelectedOptions for country
  const updatedOptions = {
    ...mySelectedOptions,
    country: newSelected.length > 0 ? 1 : 0
  };
  setMySelectedOptions(updatedOptions);
  
  // Build updated parameters for API calls
  const updatedParams = {
    ...searchParams,
    searchId: search_id,
    // ✅ Use country selection as countryList parameter
    countryList: newSelected,
    // ✅ Also update city arrays based on trade type
    ...(searchParams.tradeType === "EXPORT" ? 
      { cityDestinationList: newSelected } : 
      { cityOriginList: newSelected })
  };
  

  
  // Call APIs for ALL cards that have value 0 (backtracking allowed)
  if (newSelected.length > 0) {
    try {
      const params = {
        ...updatedParams,
        // Apply current selections with trade type logic
        ...(selectedExporters.length > 0 && {
          exporterList: selectedExporters
        }),
        ...(hsCodeList.length > 0 && {
          hsCodeList: hsCodeList
        }),
        ...(hsCode4DigitList.length > 0 && {
          hsCode4DigitList: hsCode4DigitList
        }),
        ...(newSelected.length > 0 && searchParams.tradeType === "IMPORT" && {
          cityOriginList: newSelected
        }),
        ...(newSelected.length > 0 && searchParams.tradeType === "EXPORT" && {
          cityDestinationList: newSelected
        }),
        ...(importerList.length > 0 && {
          importerList: importerList
        })
      };
      
      // Call APIs for all cards with value 0 (including backwards)
      const apiCalls = [];
      const loadingStates = [];
      
      // Backtracking: Update previous cards if no selections
      if (updatedOptions.exporter === 0) {
        apiCalls.push(getExporterList(params));
        loadingStates.push(() => setCard1Loading(true));
      }
      
      if (updatedOptions.hscode === 0) {
        apiCalls.push(getHSCodeList(params), getHSCode4digitList(params));
        loadingStates.push(() => setCard2Loading(true));
      }
      
      // Forward: Update subsequent cards
      if (updatedOptions.importer === 0) {
        apiCalls.push(getImporterList(params));
        loadingStates.push(() => setCard5Loading(true));
      }
      
      // Set loading states for cards that will be updated
      loadingStates.forEach(setLoading => setLoading());
      
      // Call APIs for cards with value 0
      if (apiCalls.length > 0) {
          // ✅ CRITICAL: Update the main searchParams state
         setSearchParams(params);
        await Promise.allSettled(apiCalls);
      }
      
      // ✅ Now call value and shipment count APIs with UPDATED params
      await getValueForParams(params, 4);
      await getTotalShipmentCount(params);
      
      console.log("params selections:", params);
      console.log("Updated mySelectedOptions:", updatedOptions);
      
      // Reset loading states
      setTimeout(() => {
        if (updatedOptions.exporter === 0) setCard1Loading(false);
        if (updatedOptions.hscode === 0) setCard2Loading(false);
        if (updatedOptions.importer === 0) setCard5Loading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error in Country cascading update:", error);
      setCard1Loading(false);
      setCard2Loading(false);
      setCard5Loading(false);
    }
  } else {
    // ✅ If no countries selected, still update values
    await getValueForParams(updatedParams, 4);
    await getTotalShipmentCount(updatedParams);
  }
};

// Update handleImporterChange to include value and shipment count updates
const handleImporterChange = async (item, isChecked, selectedItems, setSelectedItems) => {
  console.log("Importer change triggered:", item, isChecked);
  
  let newSelected;
  if (isChecked) {
    newSelected = [...selectedItems, item.importer_name];
  } else {
    newSelected = selectedItems.filter(imp => imp !== item.importer_name);
  }
  
  setSelectedItems(newSelected);
  setSelectedImporters(newSelected);
  setImporterList(newSelected);
  
  // Update mySelectedOptions for importer
  const updatedOptions = {
    ...mySelectedOptions,
    importer: newSelected.length > 0 ? 1 : 0
  };
  setMySelectedOptions(updatedOptions);
  
  // Build updated parameters for API calls
  const updatedParams = {
    ...searchParams,
    importerList: newSelected,
    searchId: search_id
  };
  
  // Call value and shipment count APIs immediately
  /*
  try {
    await Promise.all([
      getValueForParams(updatedParams, 5),
      getTotalShipmentCount(updatedParams)
    ]);
  } catch (error) {
    console.error("Error updating values:", error);
  }  */

  // Call APIs for ALL cards that have value 0 (backtracking allowed)
  if (newSelected.length > 0) {
    try {
      const params = {
        ...updatedParams,
        // Apply current selections with trade type logic
        ...(selectedExporters.length > 0 && {
          exporterList: selectedExporters
        }),
        ...(hsCodeList.length > 0 && {
          hsCodeList: hsCodeList
        }),
        ...(hsCode4DigitList.length > 0 && {
          hsCode4DigitList: hsCode4DigitList
        }),
        ...(portOriginList.length > 0 && searchParams.tradeType === "EXPORT" && {
          portOriginList: portOriginList
        }),
        ...(portDestinationList.length > 0 && searchParams.tradeType === "IMPORT" && {
          portDestinationList: portDestinationList
        }),
        ...(cityOriginList.length > 0 && searchParams.tradeType === "IMPORT" && {
          cityOriginList: cityOriginList
        }),
        ...(cityDestinationList.length > 0 && searchParams.tradeType === "EXPORT" && {
          cityDestinationList: cityDestinationList
        }),
        // ...(countryOriginList.length > 0 && {
        //   countryList: countryOriginList
        // })
      };
      
      // Call APIs for all cards with value 0 (only backwards since this is the last card)
      const apiCalls = [];
      const loadingStates = [];
      
      // Backtracking: Update all previous cards if no selections
      if (updatedOptions.exporter === 0) {
        apiCalls.push(getExporterList(params));
        loadingStates.push(() => setCard1Loading(true));
      }
      
      if (updatedOptions.hscode === 0) {
        apiCalls.push(getHSCodeList(params), getHSCode4digitList(params));
        loadingStates.push(() => setCard2Loading(true));
      }
      
      if (updatedOptions.port === 0) {
        apiCalls.push(getIndianPortList(params), getForeignPortList(params));
        loadingStates.push(() => setCard3Loading(true));
      }
      
      if (updatedOptions.country === 0) {
        apiCalls.push(getForeignCountryList(params));
        loadingStates.push(() => setCard4Loading(true));
      }
      
      // Set loading states for cards that will be updated
      loadingStates.forEach(setLoading => setLoading());
      
      // Call APIs for cards with value 0
      if (apiCalls.length > 0) {
        await Promise.allSettled(apiCalls);

         getValueForParams(params, 5);
         getTotalShipmentCount(params);
      }
      
      // Reset loading states
      setTimeout(() => {
        if (updatedOptions.exporter === 0) setCard1Loading(false);
        if (updatedOptions.hscode === 0) setCard2Loading(false);
        if (updatedOptions.port === 0) setCard3Loading(false);
        if (updatedOptions.country === 0) setCard4Loading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error in Importer cascading update:", error);
      // Reset all loading states on error
      setCard1Loading(false);
      setCard2Loading(false);
      setCard3Loading(false);
      setCard4Loading(false);
    }
  }
  
  console.log("Importer selections updated:", newSelected);
  console.log("Updated mySelectedOptions:", updatedOptions);
};

// Also add a reset function that resets values to 0
// const resetAllRecords = () => {
//   // Reset value and shipment count displays
//   setCardValuesTotal(0);
//   setTotalShipmentCount(0);
  
//   // Reset all selections
//   setSelectedExporters([]);
//   setSelectedImporters([]);
//   setHsCodeList([]);
//   setHsCode4DigitList([]);
//   setPortOriginList([]);
//   setPortDestinationList([]);
//   setCountryOriginList([]);
//   setImporterList([]);
//   setSelectedCard4Items([]);
  
//   // Reset mySelectedOptions
//   setMySelectedOptions({
//     exporter: 0,
//     importer: 0,
//     hscode: 0,
//     country: 0,
//     port: 0
//   });
  
//   window.location.reload();
// };

// Add useEffect to monitor all selections
// useEffect(() => {
//   debugCurrentSelections();
// }, [mySelectedOptions, selectedExporters, hsCodeList, hsCode4DigitList, portOriginList, portDestinationList, countryOriginList, importerList]);

// Update the resetAllRecords function to use the new reset function
const resetAllRecords = () => {
 // resetAllSelections();
  window.location.reload();
};

// Add useEffect to monitor mySelectedOptions changes
useEffect(() => {
  console.log("mySelectedOptions changed:", mySelectedOptions);
}, [mySelectedOptions]);

// ExporterCard Component
const ExporterCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter exporters based on search term
  const filteredData = exporterDataList.exportersList ? 
    exporterDataList.exportersList.filter(item => 
      item.exporter_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  const handleSelection = async (item, isChecked) => {
    await handleExporterChange(item, isChecked, selectedItems, setSelectedItems);
  };

  const clearAll = () => {
    setSelectedItems([]);
    setSelectedExporters([]);
    setSearchTerm("");
    
    // Reset mySelectedOptions for exporter
    setMySelectedOptions(prev => ({
      ...prev,
      exporter: 0
    }));
  };

  return (
    <div className="col mb-3">
      <div className="card shadow-sm border-2">
        <div className="card-header bg-primary text-white text-center fw-bold">
          Indian Exporter
        </div>
        <div className="card-body" style={{ height: "300px", overflowY: "auto", padding: "12px" }}>
          
          {/* Search Input */}
          <div className="input-group mb-2">
            <input 
              type='text' 
              className='form-control' 
              placeholder="Search exporters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setSearchTerm("")}
                title="Clear search"
              >
                ✖
              </button>
            )}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="alert alert-info small p-2 mb-2">
              <strong>Selected:</strong> {selectedItems.length} items
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {pendingExport || card2Loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* Search Results Info */}
              {searchTerm && (
                <div className="text-muted small mb-2">
                  <i className="fas fa-info-circle me-1"></i>
                  Found {filteredData.length} result(s) for "{searchTerm}"
                </div>
              )}
              
              {/* Data List */}
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => {
                  const isSelected = selectedItems.includes(item.exporter_name);
                  
                  return (
                    <div className="form-check mb-2 border-bottom" key={i}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`exporter-${item.exporter_name}-${i}`}
                        checked={isSelected}
                        onChange={(e) => handleSelection(item, e.target.checked)}
                      />
                      <label
                        className={`form-check-label ${isSelected ? 'fw-bolder' : ''}`}
                        htmlFor={`exporter-${item.exporter_name}-${i}`}
                        style={{
                          fontSize: "16px",
                          fontWeight: isSelected ? 700 : 400
                        }}
                      >
                        {item.exporter_name} [${item.value_usd}]
                      </label>
                    </div>
                  );
                })
              ) : searchTerm ? (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-search" style={{ fontSize: "48px", opacity: 0.3 }}></i>
                  <div className="mt-2">
                    <strong>No results found</strong>
                  </div>
                  <div className="small">
                    Try adjusting your search term: "{searchTerm}"
                  </div>
                </div>
              ) : (
                <div className="text-muted text-center" style={{marginTop: "100px", fontSize: "70px", fontWeight: "bold"}}>+</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Update HsCodeCard to use handleHsCodeChange
const HsCodeCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [digitMode, setDigitMode] = useState(8); // 4 or 8 digit
  const [loading, setLoading] = useState(false);

  // Get appropriate data based on digit mode
  const currentData = digitMode === 4 ? 
    (hsCode4digitDataArray || []) : 
    (hsCodeDataArray || []);

  // Filter HS codes based on search term
  const filteredData = currentData.filter(item => {
    const code = digitMode === 4 ? item.value : item.value;
    return code && code.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelection = async (item, isChecked) => {
    await handleHsCodeChange(item, isChecked, selectedItems, setSelectedItems, digitMode);
  };

  const clearAll = () => {
    setSelectedItems([]);
    setHsCode4digitList([]);
    setHsCodeList([]);
    setSearchTerm("");
  };

  const toggleDigitMode = (mode) => {
    setDigitMode(mode);
    setSelectedItems([]);
    setSearchTerm("");
    // Clear both lists when switching
    setHsCode4digitList([]);
    setHsCodeList([]);
  };

  // Rest of HsCodeCard JSX remains the same...
  return (
    <div className="col mb-3">
      <div className="card shadow-sm border-2">
        <div className="card-header bg-primary text-white text-center fw-bold d-flex justify-content-between align-items-center">
          <span>HS Code</span>
          <div className="btn-group btn-group-sm">
            <button 
              className={`btn ${digitMode === 4 ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => toggleDigitMode(4)}
            >
              4 Digit
            </button>
            <button 
              className={`btn ${digitMode === 8 ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => toggleDigitMode(8)}
            >
              8 Digit
            </button>
          </div>
        </div>
        <div className="card-body" style={{ height: "300px", overflowY: "auto", padding: "12px" }}>
          
          {/* Search Input */}
          <div className="input-group mb-2">
            <input 
              type='text' 
              className='form-control' 
              placeholder={`Search ${digitMode} digit HS codes...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setSearchTerm("")}
              >
                ✖
              </button>
            )}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="alert alert-info small p-2 mb-2">
              <strong>Selected:</strong> {selectedItems.length} items
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {(pendingHSCode && digitMode === 8) || card4Loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* Search Results Info */}
              {searchTerm && (
                <div className="text-muted small mb-2">
                  <i className="fas fa-info-circle me-1"></i>
                  Found {filteredData.length} result(s) for "{searchTerm}"
                </div>
              )}
              
              {/* Data List */}
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => {
                  const itemValue = item.value;
                  const isSelected = selectedItems.includes(itemValue);
                  
                  return (
                    <div className="form-check mb-2 border-bottom" key={i}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`hscode-${itemValue}-${i}`}
                        checked={isSelected}
                        onChange={(e) => handleSelection(item, e.target.checked)}
                      />
                      <label
                        className={`form-check-label ${isSelected ? "fw-bolder" : ""}`}
                        htmlFor={`hscode-${itemValue}-${i}`}
                        style={{
                          fontSize: "16px",
                          fontWeight: isSelected ? 700 : 400
                        }}
                      >
                        {item.value}  [${item.value_usd}]
                      </label>
                    </div>
                  );
                })
              ) : searchTerm ? (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-search" style={{ fontSize: "48px", opacity: 0.3 }}></i>
                  <div className="mt-2">
                    <strong>No results found</strong>
                  </div>
                  <div className="small">
                    Try adjusting your search term: "{searchTerm}"
                  </div>
                </div>
              ) : (
                <div className="text-muted text-center" style={{marginTop: "100px", fontSize: "70px", fontWeight: "bold"}}>+</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Update PortCard to use handlePortChange
const PortCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter ports based on search term
  const filteredData = indianPortDataList.portsList ? 
    indianPortDataList.portsList.filter(item => 
      item.port_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  const handleSelection = async (item, isChecked) => {
    await handlePortChange(item, isChecked, selectedItems, setSelectedItems);
  };

  const clearAll = () => {
    setSelectedItems([]);
    setPortOriginList([]);
    setPortDestinationList([]);
    setSearchTerm("");
  };

  // Rest of PortCard JSX with updated loading check
  return (
    <div className="col mb-3">
      <div className="card shadow-sm border-2">
        <div className="card-header bg-primary text-white text-center fw-bold">
          Port
        </div>
        <div className="card-body" style={{ height: "300px", overflowY: "auto", padding: "12px" }}>
          
          {/* Search Input */}
          <div className="input-group mb-2">
            <input 
              type='text' 
              className='form-control' 
              placeholder="Search ports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setSearchTerm("")}
              >
                ✖
              </button>
            )}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="alert alert-info small p-2 mb-2">
              <strong>Selected:</strong> {selectedItems.length} items
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {pendingIndPort || card3Loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* Search Results Info */}
              {searchTerm && (
                <div className="text-muted small mb-2">
                  <i className="fas fa-info-circle me-1"></i>
                  Found {filteredData.length} result(s) for "{searchTerm}"
                </div>
              )}
              
              {/* Data List */}
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => {
                  const isSelected = selectedItems.includes(item.port_name);
                  
                  return (
                    <div className="form-check mb-2 border-bottom" key={i}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`port-${item.port_name}-${i}`}
                        checked={isSelected}
                        onChange={(e) => handleSelection(item, e.target.checked)}
                      />
                      <label
                        className={`form-check-label ${isSelected ? "fw-bolder" : ""}`}
                        htmlFor={`port-${item.port_name}-${i}`}
                        style={{
                          fontSize: "16px",
                          fontWeight: isSelected ? 700 : 400
                        }}
                      >
                        {item.port_name} [${item.value_usd}]
                      </label>
                    </div>
                  );
                })
              ) : searchTerm ? (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-search" style={{ fontSize: "48px", opacity: 0.3 }}></i>
                  <div className="mt-2">
                    <strong>No results found</strong>
                  </div>
                  <div className="small">
                    Try adjusting your search term: "{searchTerm}"
                  </div>
                </div>
              ) : (
                <div className="text-muted text-center" style={{marginTop: "100px", fontSize: "70px", fontWeight: "bold"}}>+</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Update CountryCard to use handleCountryChange
const CountryCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter countries based on search term
  const filteredData = countryDataList.countriesList ? 
    countryDataList.countriesList.filter(item => 
      item.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  const handleSelection = async (item, isChecked) => {
    await handleCountryChange(item, isChecked, selectedItems, setSelectedItems);
  };

  const clearAll = () => {
    setSelectedItems([]);
    setCountryOriginList([]);
    setSearchTerm("");
  };

  // Rest of CountryCard JSX with updated loading check
  return (
    <div className="col mb-3">
      <div className="card shadow-sm border-2">
        <div className="card-header bg-primary text-white text-center fw-bold">
          Country
        </div>
        <div className="card-body" style={{ height: "300px", overflowY: "auto", padding: "12px" }}>
          
          {/* Search Input */}
          <div className="input-group mb-2">
            <input 
              type='text' 
              className='form-control' 
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setSearchTerm("")}
              >
                ✖
              </button>
            )}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="alert alert-info small p-2 mb-2">
              <strong>Selected:</strong> {selectedItems.length} items
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {pendingCountry || card4Loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* Search Results Info */}
              {searchTerm && (
                <div className="text-muted small mb-2">
                  <i className="fas fa-info-circle me-1"></i>
                  Found {filteredData.length} result(s) for "{searchTerm}"
                </div>
              )}
              
              {/* Data List */}
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => {
                  const isSelected = selectedItems.includes(item.country_name);
                  
                  return (
                    <div className="form-check mb-2 border-bottom" key={i}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`country-${item.country_name}-${i}`}
                        checked={isSelected}
                        onChange={(e) => handleSelection(item, e.target.checked)}
                      />
                      <label
                        className={`form-check-label ${isSelected ? "fw-bolder" : ""}`}
                        htmlFor={`country-${item.country_name}-${i}`}
                        style={{
                          fontSize: "16px",
                          fontWeight: isSelected ? 700 : 400
                        }}
                      >
                        {/* {item.country_name} [{item.shipment_count}] */}
                         {item.country_name} [${item.value_usd}]
                      </label>
                    </div>
                  );
                })
              ) : searchTerm ? (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-search" style={{ fontSize: "48px", opacity: 0.3 }}></i>
                  <div className="mt-2">
                    <strong>No results found</strong>
                  </div>
                  <div className="small">
                    Try adjusting your search term: "{searchTerm}"
                  </div>
                </div>
              ) : (
                <div className="text-muted text-center" style={{marginTop: "100px", fontSize: "70px", fontWeight: "bold"}}>+</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Update ImportCard to use handleImporterChange
const ImportCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter importers based on search term
  const filteredData = importerDataList.importersList ? 
    importerDataList.importersList.filter(item => 
      item.importer_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  const handleSelection = async (item, isChecked) => {
    await handleImporterChange(item, isChecked, selectedItems, setSelectedItems);
  };

  const clearAll = () => {
    setSelectedItems([]);
    setSelectedImporters([]);
    setImporterList([]);
    setSearchTerm("");
  };

  // Rest of ImportCard JSX with updated loading check
  return (
    <div className="col mb-3">
      <div className="card shadow-sm border-2">
        <div className="card-header bg-primary text-white text-center fw-bold">
          Importer Name
        </div>
        <div className="card-body" style={{ height: "300px", overflowY: "auto", padding: "12px" }}>
          
          {/* Search Input */}
          <div className="input-group mb-2">
            <input 
              type='text' 
              className='form-control' 
              placeholder="Search importers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setSearchTerm("")}
              >
                ✖
              </button>
            )}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="alert alert-info small p-2 mb-2">
              <strong>Selected:</strong> {selectedItems.length} items
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {pendingImport || card5Loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* Search Results Info */}
              {searchTerm && (
                <div className="text-muted small mb-2">
                  <i className="fas fa-info-circle me-1"></i>
                  Found {filteredData.length} result(s) for "{searchTerm}"
                </div>
              )}
              
              {/* Data List */}
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => {
                  const isSelected = selectedItems.includes(item.importer_name);
                  
                  return (
                    <div className="form-check mb-2 border-bottom" key={i}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`importer-${item.importer_name}-${i}`}
                        checked={isSelected}
                        onChange={(e) => handleSelection(item, e.target.checked)}
                      />
                      <label
                        className={`form-check-label ${isSelected ? "fw-bolder" : ""}`}
                        htmlFor={`importer-${item.importer_name}-${i}`}
                        style={{
                          fontSize: "16px",
                          fontWeight: isSelected ? 700 : 400
                        }}
                      >
                        {/* {item.importer_name} [{item.shipment_count}] */}
                         {item.importer_name} [${item.value_usd}]
                      </label>
                    </div>
                  );
                })
              ) : searchTerm ? (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-search" style={{ fontSize: "48px", opacity: 0.3 }}></i>
                  <div className="mt-2">
                    <strong>No results found</strong>
                  </div>
                  <div className="small">
                    Try adjusting your search term: "{searchTerm}"
                  </div>
                </div>
              ) : (
                <div className="text-muted text-center" style={{marginTop: "100px", fontSize: "70px", fontWeight: "bold"}}>+</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/*18/09/2025 */




  const handleModal = (rowData,columns)  => {
    setShowModal(true)
    setNewModalColumn(columns)
    setNewModalData(rowData)
  }

  const handleModalClose = ()  => {
    setShowModal(false)
  }


  const handleSearch = (values) => {
   // console.log("Search Values:", values);
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
    if (values.countryList) {
      params["countryList"] = values.countryList;
    }

    setSearchParams(params);
    getImporterList(params);
    //getMonthWiseList(params)
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
        props.loadingStop();
      })
      .catch(err => {
        // console.log("Err");
        setStdUnitDataArray([]);
        props.loadingStop();
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
            let specificItem = { "value": item.hscode, "label": item.hscode+ " ["+item.shipment_count+"]", "value_usd": item.value_usd  };
            hsList.push(specificItem);
          })
        }
        setHsCode4digitDataArray(hsList);
        props.loadingStop();
      })
      .catch(err => {
        // console.log("Err", err);
        setHsCode4digitDataArray([]);
        props.loadingStop();
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
             props.loadingStop();
      })
      .catch(err => {
        // console.log("Err");
        setShipmentModeDataArray([]);
             props.loadingStop();
      });
  }

  /* IMPORTANT  16/09/2025*/
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
        //console.log("importer data list ============= ", data );
        setImporterDataList(res.data);
        setPendingImport(false);
             props.loadingStop();
      })
      .catch(err => {
        // console.log("Err");
        setPendingImport(false);
             props.loadingStop();
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
             props.loadingStop();
        
      })
      .catch(err => {
        // console.log("Err");
        setPendingExport(false);
             props.loadingStop();
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
             props.loadingStop();
      })
      .catch(err => {
        // console.log("Err");
        setPendingIndPort(false);
             props.loadingStop();
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
             props.loadingStop();
      })
      .catch(err => {
        // console.log("Err");
        setPendingForPort(false);
             props.loadingStop();
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
              let specificItem = { "value": item.hscode, "label": item.hscode+" ["+item.shipment_count+"]","value_usd": item.value_usd };
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
             props.loadingStop();
      })
      .catch(err => {
        // console.log("Err");
        setPendingHSCode(false);
             props.loadingStop();
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
             props.loadingStop();
      })
      .catch(err => {
        // console.log("Err");
        setPendingCountry(false);
             props.loadingStop();
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
      "stdUnitList": params.stdUnitList,
      "countryList": params.countryList || []
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
             props.loadingStop();
      })
      .catch(err => {
        // console.log("Err");
        setPendingCity(false);
             props.loadingStop();
      });
  }

  useEffect(() => {
    fetchSearchQuery()
    if (searchParams && searchParams.tradeType) {
     // console.log('searchParams changed - fetching lists', searchParams);
      getImporterList(searchParams);
     // getMonthWiseList(searchParams);
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
        <button
          className={`btn w-100 py-3 ${
            active === "indepth" ? "btn-warning" : "btn-primary"
          }`}
          onClick={() => setActive("indepth")}
        >
          Nexus
        </button>
      </div>

      {/* Button 2 */}
      <div className="col-lg-2 col-md-3 mb-3">
    

              <Link  className={`btn w-100 py-3 ${
            active === "exporter" ? "btn-warning" : "btn-primary"
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
            active === "indepthAnalysis" ? "btn-warning" : "btn-primary"
          }`}
          onClick={() => setActive("indepthAnalysis")}
        >
          Loream Ipsume 5
        </button>
      
      </div>


   
    </div>

<div className="d-flex justify-content-center gap-5 mb-4">

  {/* Value */}
  <div className="d-flex align-items-center gap-4">
    <h5 className="mb-0">Value </h5>&nbsp;&nbsp;&nbsp;&nbsp;
    <button className="btn btn-outline-dark fw-bold shadow-sm px-3">
     ${cardValuesTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
    </button>
  </div>
  &nbsp;&nbsp;
  &nbsp;&nbsp;
  &nbsp;&nbsp;
  &nbsp;&nbsp;
  {/* Shipment */}
  <div className="d-flex align-items-center gap-4">
    <h5 className="mb-0">Shipment </h5>&nbsp;&nbsp;&nbsp;&nbsp;
    <button className="btn btn-outline-primary fw-bold shadow-sm px-3">
      {totalShipmentCount.toLocaleString()}
    </button>
  </div>

</div>
<div className="row mb-3">
  <div className="col-12">
    <div className="d-flex justify-content-end">
      
      <button
        type="button"
        className="btn btn-outline-danger px-3 py-2"
        onClick={resetAllRecords}
      >
        Reset All
      </button>

    </div>
  </div>
</div>






<div className="row mb-4">
   {/* Card 1 - Dynamic Import/Export */}
   {ExporterCard()}
   {HsCodeCard()}
   {PortCard()}
   {CountryCard()}
   {ImportCard()}

</div>



<div className="row mb-4">
  <div className="col-12 d-flex justify-content-end">
    {/* <button
      className="btn btn-success btn-lg fw-bold shadow-sm px-4 py-2"
      onClick={() => setShowTable(!showTable)}
    >
      {showTable ? "Hide Data" : "Show Data"}
    </button>   */}

    <button
  className="btn btn-success btn-lg fw-bold shadow-sm px-4 py-2"
  onClick={() => {
    // Build final parameters from all card selections
    const payload = {
      ...searchParams,
      exporterList: selectedExporters || [],
      importerList: importerList || [],
      hsCodeList: hsCodeList || [],
      hsCode4DigitList: hsCode4DigitList || [],
      portOriginList: portOriginList || [],
      portDestinationList: portDestinationList || [],
    //  countryList: countryOriginList || [],
      searchId: search_id
    };
    
    console.log("Card system payload:", payload);
     setIndepthParams(payload);
    setShowTable(true);
    
    // Show success message
    Swal.fire({
      title: 'Data Loaded!',
      text: 'Your search parameters have been applied successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }}
>
  {showTable ? "Refresh Data" : "Show Data"}
</button>

  </div>
</div>

{showTable && indepthParams && (
  <IndepthSearchTable
    params={indepthParams}
    filteredColumn={[]} // or pass desired column keys
    initialPage={1}
    initialLimit={20}
    onRowClick={(row) => { console.log("row clicked", row); }}
  />
)}





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

export default withRouter (connect( mapStateToProps, mapDispatchToProps)(Analysis));