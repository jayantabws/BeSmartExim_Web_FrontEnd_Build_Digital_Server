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
import AnalysisTable from '../components/AnalysisTable'
import AdvanceSearch from '../components/AdvanceSearch';
import Draggable from 'react-draggable';
import BlankImg from '../assets/image/BlankImg.png';
import { MultiSelect } from "react-multi-select-component";

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
  // console.log("Analysis props: ", props);

  
  const search_id = props.location.state ? props.location.state.search_id : null;
  const importerForExport = props.location.state ? props.location.state.importerForExport : null;
  const exporterForImport = props.location.state ? props.location.state.exporterForImport : null;
  //const searchType = props.location.state ? props.location.state.apiSerachpayload.tradeType : null;
  const searchType = props.location.state
  ? (props.location.state.apiSerachpayload && props.location.state.apiSerachpayload.tradeType)
    ? props.location.state.apiSerachpayload.tradeType
    : props.location.state.tradeType
  : null;
  //const searchType = props.location.state ? props.location.state.tradeType : null;


  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [apiSerachpayload, setApiSerachpayload] = useState({});

    /* 29/08/2025 */
    const [tradeType, setTradeType] = useState("");


  const showTooltip = (row, event) => {

    if ((row.importer_name == "OTHERS" || row.exporter_name == "OTHERS" || row.port_name == "OTHERS"
      || row.hscode == "OTHERS" || row.country_name == "OTHERS" || row.port_name == "OTHERS" || row.city_name == "OTHERS") ||
      (row.importer_name == "TOTAL" || row.exporter_name == "TOTAL" || row.port_name == "TOTAL"
        || row.hscode == "TOTAL" || row.country_name == "TOTAL" || row.port_name == "TOTAL" || row.city_name == "TOTAL")) {
      setTooltipContent("")
      setTooltipPosition({ top: 0, left: 0 });
    }
    else {
      setTooltipContent(event.target.textContent)
      setTooltipPosition({ top: event.clientY, left: event.clientX + 30 });
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
              toDate: sParams.toDate ? new Date(sParams.toDate) : "",
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
              rangeQuantityStart: sParams.rangeQuantityStart ? sParams.rangeQuantityStart : null,
              rangeQuantityEnd: sParams.rangeQuantityEnd ? sParams.rangeQuantityEnd : null,
              consumptionType: sParams.consumptionType ? sParams.consumptionType : [],
              rangeValueUsdStart: sParams.rangeValueUsdStart ? sParams.rangeValueUsdStart : null,
              rangeValueUsdEnd: sParams.rangeValueUsdEnd ? sParams.rangeValueUsdEnd : null,
              rangeUnitPriceUsdStart: sParams.rangeUnitPriceUsdStart ? sParams.rangeUnitPriceUsdStart : null,
              rangeUnitPriceUsdEnd: sParams.rangeUnitPriceUsdEnd ? sParams.rangeUnitPriceUsdEnd : null,
              incoterm: sParams.incoterm ? sParams.incoterm : [],
              notifyParty: sParams.notifyParty ? sParams.notifyParty : [],
               /*08/09/2025 */
              productDesc: sParams.productDesc ?? [],
              conditionProductDesc: sParams.conditionProductDesc ?? "",
            };
           setApiSerachpayload(initialValues); //08/09/2025 <-- update apiSerachpayload after fetch


            // setApiSerachpayload(initialValues);
            //setSearchParams(initialValues);

            

           //console.log("apiSerachpayload === ", apiSerachpayload);

           // console.log("initialValues === ", initialValues);
           // console.log("apiSerachpayload after initialValues === ", apiSerachpayload);
            let selectedCountryListData = [];
            if (sParams.countryCode.length > 0) {
              sParams.countryCode.map((item, index) => {
                let specificItem = { "value": item, "label": item };
                selectedCountryListData.push(specificItem);
              })
            }

            setSelectedTradeCountry(selectedCountryListData);
            setSearchValue(sParams.searchValue)
            if (sParams.queryBuilder && sParams.queryBuilder.length > 0) {

              sParams.queryBuilder.map((newitem, newindex) => {
                queryBuilderSuggestionList[newindex] = newitem.searchValue
              })
            }
            setQueryBuilderSearchValue(queryBuilderSuggestionList)
            handleSearch(sParams);
            sParams.tradeType == "IMPORT" ? getTradingCountryList("I") : getTradingCountryList("E")
            console.log("sparams", sParams);
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

  const [multiTradeCountryList, setMultiTradeCountryList] = useState([]);
  const [selectedTradeCountry, setSelectedTradeCountry] = useState([]);

  const [consumptionType, setConsumptionType] = useState([]);
  const [consumptionTypeDataList, setConsumptionTypeDataList] = useState([]);
  const [incoterm, setIncoterm] = useState([]);
  const [incotermListData, setIncotermListData] = useState([]);

  const [notifyPartyListData, setNotifyPartyListData] = useState([]);
const [notifyParty, setNotifyParty] = useState([]);
  /*26/08/2025 */
  // const [rangeQuantityStart, setRangeQuantityStart] = useState();
  // const [rangeQuantityEnd, setRangeQuantityEnd] = useState();
  // const [rangeValueUsdStart, setRangeValueUsdStart] = useState();
  // const [rangeValueUsdEnd, setRangeValueUsdEnd] = useState();
  // const [rangeUnitPriceUsdStart, setrangeUnitPriceUsdStart] = useState();
  // const [rangeUnitPriceUsdEnd, setRangeUnitPriceUsdEnd] = useState();
  // const [productDesc, setProductDesc] = useState([]);

  /* 27/08/2025 */
  //const [notifyParty, setNotifyParty] = useState([]);
  // const [consumptionType, setConsumptionType] = useState([]);
  // const [notifyParty, setNotifyParty] = useState([]);


  // const monthWiseColumns = [
  //   {
  //     name: "Month Name",
  //     selector: row => row.month_name,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000",
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false
  //   },
  // ];



  // --- display number style modification @sarbojitghosh22 8/7/2025 --- //
  function formatNumberWithCommas(x) {
    if (x === null || x === undefined) return '';
    return x.toLocaleString('en-IN');
  }


  const monthWiseColumns = [
    {
      name: "Month Name",
      selector: row => row.month_name,
      sortable: false
    },
    {
      name: "Total Quantity",
      selector: row => formatNumberWithCommas(row.quantity),
      sortable: false,
      conditionalCellStyles: [
        {
          when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
          style: {
            color: "transparent",
            textShadow: "0 0 8px #000",
          },
        },
      ]
    },
    {
      name: "Shipment Count",
      selector: row => formatNumberWithCommas(row.shipment_count),
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => formatNumberWithCommas(row.value_usd),
      sortable: false
    },
  ];


  // ...existing code...

  const importerColumns = [
    {
      name: "Importer Name",
      selector: row => row.importer_name,
      sortable: false,
      width: "390px",
      cell: row => (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-importer-${row.importer_name}`}>
              {row.importer_name}
            </Tooltip>
          }
        >
          <span style={{ cursor: "pointer" }}>{row.importer_name}</span>
        </OverlayTrigger>
      ),
    },
    {
      name: "Total Quantity",
      selector: row => formatNumberWithCommas(row.quantity),
      sortable: false,
      width: "120px",
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
      selector: row => formatNumberWithCommas(row.shipment_count),
      sortable: false,
      width: "120px",
    },
    {
      name: "Total Value (USD)",
      selector: row => formatNumberWithCommas(row.value_usd),
      sortable: false,
      width: "140px",
    },
    {
      name: "Value Share %",
      selector: row => formatNumberWithCommas(row.share),
      sortable: false,
      width: "120px",
    }
  ];

  const exporterColumns = [
    {
      name: "Exporter Name",
      selector: row => row.exporter_name,
      sortable: false,
      width: "390px",
      cell: row => (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-exporter-${row.exporter_name}`}>
              {row.exporter_name}
            </Tooltip>
          }
        >
          <span style={{ cursor: "pointer" }}>{row.exporter_name}</span>
        </OverlayTrigger>
      ),
    },
    {
      name: "Total Quantity",
      selector: row => formatNumberWithCommas(row.quantity),
      sortable: false,
      width: "120px",
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
      selector: row => formatNumberWithCommas(row.shipment_count),
      sortable: false,
      width: "120px",
    },
    {
      name: "Total Value (USD)",
      selector: row => formatNumberWithCommas(row.value_usd),
      sortable: false,
      width: "140px",
    },
    {
      name: "Value Share %",
      selector: row => formatNumberWithCommas(row.share),
      sortable: false,
      width: "120px",
    }
  ];

  const portColumns = [
    {
      name: "Port Name",
      selector: row => row.port_name,
      sortable: false,
      width: "390px",
      cell: row => (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-port-${row.port_name}`}>
              {row.port_name}
            </Tooltip>
          }
        >
          <span style={{ cursor: "pointer" }}>{row.port_name}</span>
        </OverlayTrigger>
      ),
    },
    {
      name: "Total Quantity",
      selector: row => formatNumberWithCommas(row.quantity),
      sortable: false,
      width: "120px",
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
      selector: row => formatNumberWithCommas(row.shipment_count),
      sortable: false,
      width: "120px",
    },
    {
      name: "Total Value (USD)",
      selector: row => formatNumberWithCommas(row.value_usd),
      sortable: false,
      width: "140px",
    },
    {
      name: "Value Share %",
      selector: row => formatNumberWithCommas(row.share),
      sortable: false,
      width: "120px",
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
      selector: row => formatNumberWithCommas(row.quantity),
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
      selector: row => formatNumberWithCommas(row.shipment_count),
      sortable: false
    },
    {
      name: "Total Value (USD)",
      selector: row => formatNumberWithCommas(row.value_usd),
      sortable: false
    },
    {
      name: "Value Share %",
      selector: row => formatNumberWithCommas(row.share),
      sortable: false,
    }
  ];

  const countryColumns = [
    {
      name: "Country Name",
      selector: row => row.country_name,
      sortable: false,
      width: "390px",
      cell: row => (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-country-${row.country_name}`}>
              {row.country_name}
            </Tooltip>
          }
        >
          <span style={{ cursor: "pointer" }}>{row.country_name}</span>
        </OverlayTrigger>
      ),
    },
    {
      name: "Total Quantity",
      selector: row => formatNumberWithCommas(row.quantity),
      sortable: false,
      width: "120px",
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
      selector: row => formatNumberWithCommas(row.shipment_count),
      sortable: false,
      width: "120px",
    },
    {
      name: "Total Value (USD)",
      selector: row => formatNumberWithCommas(row.value_usd),
      sortable: false,
      width: "140px",
    },
    {
      name: "Value Share %",
      selector: row => formatNumberWithCommas(row.share),
      sortable: false,
      width: "120px",
    }
  ];

  const cityColumns = [
    {
      name: "City Name",
      selector: row => row.city_name,
      sortable: false,
      width: "390px",
      cell: row => (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-city-${row.city_name}`}>
              {row.city_name}
            </Tooltip>
          }
        >
          <span style={{ cursor: "pointer" }}>{row.city_name}</span>
        </OverlayTrigger>
      ),
    },
    {
      name: "Total Quantity",
      selector: row => formatNumberWithCommas(row.quantity),
      sortable: false,
      width: "120px",
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
      selector: row => formatNumberWithCommas(row.shipment_count),
      sortable: false,
      width: "120px",
    },
    {
      name: "Total Value (USD)",
      selector: row => formatNumberWithCommas(row.value_usd),
      sortable: false,
      width: "140px",
    },
    {
      name: "Value Share %",
      selector: row => formatNumberWithCommas(row.share),
      sortable: false,
      width: "120px",
    }
  ];


  // --- display number style modification @sarbojitghosh22 8/7/2025 --- //


  // const importerColumns = [
  //   {
  //     name: "Importer Name",
  //     selector: row => row.importer_name,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //     // cell: d => <span>{d.genres.join(", ")}</span>
  //   }
  // ];


  // const exporterColumns = [
  //   {
  //     name: "Exporter Name",
  //     selector: row => row.exporter_name,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //   }
  // ];

  // const portColumns = [
  //   {
  //     name: "Port Name",
  //     selector: row => row.port_name,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //   }
  // ];

  // const hsCodeColumns = [
  //   {
  //     name: "HS Code",
  //     selector: row => row.hscode,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //   }
  // ];


  // const countryColumns = [
  //   {
  //     name: "Country Name",
  //     selector: row => row.country_name,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //   }
  // ];
  // const cityColumns = [
  //   {
  //     name: "City Name",
  //     selector: row => row.city_name,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //   }
  // ];






  // ---tooltip implementation for table with width adjustment of columns @sarbojitghosh22 26-6-2025 ---//

  // const importerColumns = [
  //   {
  //     name: "Importer Name",
  //     selector: row => row.importer_name,
  //     sortable: false,
  //     width: "390px", // Increased width
  //     cell: row => (
  //       <OverlayTrigger
  //         placement="top"
  //         overlay={
  //           <Tooltip id={`tooltip-importer-${row.importer_name}`}>
  //             {row.importer_name}
  //           </Tooltip>
  //         }
  //       >
  //         <span style={{ cursor: "pointer" }}>{row.importer_name}</span>
  //       </OverlayTrigger>
  //     ),
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     width: "120px", // Reduced width
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false,
  //     width: "120px", // Reduced width
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false,
  //     width: "140px", // Reduced width
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //     width: "120px", // Reduced width
  //   }
  // ];


  // const exporterColumns = [
  //   {
  //     name: "Exporter Name",
  //     selector: row => row.exporter_name,
  //     sortable: false,
  //     width: "390px",
  //     cell: row => (
  //       <OverlayTrigger
  //         placement="top"
  //         overlay={
  //           <Tooltip id={`tooltip-exporter-${row.exporter_name}`}>
  //             {row.exporter_name}
  //           </Tooltip>
  //         }
  //       >
  //         <span style={{ cursor: "pointer" }}>{row.exporter_name}</span>
  //       </OverlayTrigger>
  //     ),
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     width: "120px",
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false,
  //     width: "120px",
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false,
  //     width: "140px",
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //     width: "120px",
  //   }
  // ];

  // const portColumns = [
  //   {
  //     name: "Port Name",
  //     selector: row => row.port_name,
  //     sortable: false,
  //     width: "390px",
  //     cell: row => (
  //       <OverlayTrigger
  //         placement="top"
  //         overlay={
  //           <Tooltip id={`tooltip-port-${row.port_name}`}>
  //             {row.port_name}
  //           </Tooltip>
  //         }
  //       >
  //         <span style={{ cursor: "pointer" }}>{row.port_name}</span>
  //       </OverlayTrigger>
  //     ),
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     width: "120px",
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false,
  //     width: "120px",
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false,
  //     width: "140px",
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //     width: "120px",
  //   }
  // ];

  // const countryColumns = [
  //   {
  //     name: "Country Name",
  //     selector: row => row.country_name,
  //     sortable: false,
  //     width: "390px",
  //     cell: row => (
  //       <OverlayTrigger
  //         placement="top"
  //         overlay={
  //           <Tooltip id={`tooltip-country-${row.country_name}`}>
  //             {row.country_name}
  //           </Tooltip>
  //         }
  //       >
  //         <span style={{ cursor: "pointer" }}>{row.country_name}</span>
  //       </OverlayTrigger>
  //     ),
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     width: "120px",
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false,
  //     width: "120px",
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false,
  //     width: "140px",
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //     width: "120px",
  //   }
  // ];

  // const cityColumns = [
  //   {
  //     name: "City Name",
  //     selector: row => row.city_name,
  //     sortable: false,
  //     width: "390px",
  //     cell: row => (
  //       <OverlayTrigger
  //         placement="top"
  //         overlay={
  //           <Tooltip id={`tooltip-city-${row.city_name}`}>
  //             {row.city_name}
  //           </Tooltip>
  //         }
  //       >
  //         <span style={{ cursor: "pointer" }}>{row.city_name}</span>
  //       </OverlayTrigger>
  //     ),
  //   },
  //   {
  //     name: "Total Quantity",
  //     selector: row => row.quantity,
  //     sortable: false,
  //     width: "120px",
  //     conditionalCellStyles: [
  //       {
  //         when: row => stdUnitDataArray.length > 1 && stdUnitList.length == 0,
  //         style: {
  //           color: "transparent",
  //           textShadow: "0 0 8px #000"
  //         },
  //       },
  //     ]
  //   },
  //   {
  //     name: "Shipment Count",
  //     selector: row => row.shipment_count,
  //     sortable: false,
  //     width: "120px",
  //   },
  //   {
  //     name: "Total Value (USD)",
  //     selector: row => row.value_usd,
  //     sortable: false,
  //     width: "140px",
  //   },
  //   {
  //     name: "Value Share %",
  //     selector: row => row.share,
  //     sortable: false,
  //     width: "120px",
  //   }
  // ];

  // ---tooltip implementation for table with width adjustment of columns @sarbojitghosh22 26-6-2025 ---//




  const handleModal = (rowData, columns) => {
    setShowModal(true)
    setNewModalColumn(columns)
    setNewModalData(rowData)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }


  const handleSearch = async (values) => {

    console.log("Advance Search Values:", values);
    var params = [];
    params["tradeType"] = values.tradeType;
    params["searchBy"] = values.searchBy;
    params["searchValue"] = values.searchValue;
    params["countryCode"] = values.countryCode;
    params["fromDate"] = values.fromDate;
    params["toDate"] = values.toDate;
    params["matchType"] = values.matchType;
    params["queryBuilder"] = values.queryBuilder

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

    /* code add start on 09-05-2025 */

  if (values.rangeQuantityStart) {
      params["rangeQuantityStart"] = values.rangeQuantityStart;
    }
    if (values.rangeQuantityEnd) {
      params["rangeQuantityEnd"] = values.rangeQuantityEnd;
    }
    if (values.rangeValueUsdStart) {
      params["rangeValueUsdStart"] = values.rangeValueUsdStart;
    }
    if (values.rangeValueUsdEnd) {
      params["rangeValueUsdEnd"] = values.rangeValueUsdEnd;
    }
    if (values.rangeUnitPriceUsdStart) {
      params["rangeUnitPriceUsdStart"] = values.rangeUnitPriceUsdStart;
    }
    if (values.rangeUnitPriceUsdEnd) {
      params["rangeUnitPriceUsdEnd"] = values.rangeUnitPriceUsdEnd;
    }
     if (values.consumptionType) {
      setConsumptionType(values.consumptionType);
      params["consumptionType"] = values.consumptionType;
    }
    if (values.incoterm) {
      setIncoterm(values.incoterm);
      params["incoterm"] = values.incoterm;
    }
    if (values.notifyParty) {
      setNotifyParty(values.notifyParty);
      params["notifyParty"] = values.notifyParty;
    }
  
     if (values.productDesc) {
      params["conditionProductDesc"] = values.conditionProductDesc;
      params["productDesc"] = values.productDesc;
    }


    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      //"pageNumber": page - 1,
      "pageNumber": 0,
      "numberOfRecords": 20,
      "hsCodeList": params.hsCodeList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "orderByColumn": "",
      "orderByMode": "desc",
      "hsCode4DigitList": params.hsCode4DigitList,
      "matchType": params.matchType,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList ? params.shipmentModeList : [],
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType ? params.consumptionType : [],
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm ? params.incoterm : [],
      "notifyParty": params.notifyParty ? params.notifyParty : [],
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc ? params.conditionProductDesc : ""

    }


    /* After search set consumptionType Data array for advance search*/
    await getConsumptionTypeDataList(postData);
    /* After search set Incoterm list Data array for advance search*/
    await getIncotermListDataList(postData);
    /* After search set Notify Party list Data array for advance search*/
    await getNotifyPartyListDataList(postData);

    /* code end on 09-05-2025 */

    console.log("Handle search Post Data:", postData);
    console.log("Handle search Post Data params:", params);
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


  const handleBlur = (e, setFieldValue) => {
    if (e.target.value != "") {
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
      /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "productDesc": params.productDesc,
        "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
 "incoterm" : params.incoterm
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
        /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
 "incoterm" : params.incoterm
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
            let specificItem = { "value": item.hscode, "label": item.hscode + " [" + item.shipment_count + "]" };
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
        /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
 "incoterm" : params.incoterm
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
       /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
       "incoterm" : params.incoterm,
      // "conditionProductDesc": "C"
      "conditionProductDesc": params.conditionProductDesc
       
    }

   // console.log("getImporterList params",postData);
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
            let specificItem = { "value": item.importer_name, "label": item.importer_name + " [" + item.shipment_count + "]" };
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

        res.data.importersList.forEach((item, index) => {
          if (index < 10) {
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
        if (res.data.importersList.length >= 10) {
          others = {
            importer_name: 'OTHERS',
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10
          }
          data.push(others)
        }
        total = {
          importer_name: 'TOTAL',
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD
        }

        data.push(total)
        //console.log("importer data payload", postData);
       // console.log("importer data", data);
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
        /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
       "incoterm" : params.incoterm,
       /*04/09/2025 */
       "conditionProductDesc": params.conditionProductDesc
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

         // console.log("getMonthWiseList data payload", postData);
        //console.log("getMonthWiseList data", res.data.monthwiseList);
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
        // let countryList = [];
        setTradeCountryList(res.data.countryList)
        let countryList = [],
          multiCountryList = [];
        if (res.data.countryList) {
          res.data.countryList.forEach((item) => {
            multiCountryList.push({ "value": item.shortcode, "label": item.name });
            let specificItem = Object.assign(item, { hasChild: false })
            countryList.push(specificItem);
          })
          // }
          countryList = res.data.countryList.length > 0 && props.countryList.length > 0 && res.data.countryList.filter((item) => {
            return props.countryList.includes(item.shortcode)
          })

          // setTradeCountryList(countryList);
          setMultiTradeCountryList(multiCountryList);
        }
      })
      .catch(err => {
        setTradeCountryList([]);
        setMultiTradeCountryList([]);
        // console.log("err >>> ", err);
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "stdUnitList": params.stdUnitList,
        /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
       "incoterm" : params.incoterm,
       "conditionProductDesc": params.conditionProductDesc
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
            let specificItem = { "value": item.exporter_name, "label": item.exporter_name + " [" + item.shipment_count + "]" };
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

        res.data.exportersList.forEach((item, index) => {
          if (index < 10) {
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
        if (res.data.exportersList.length >= 10) {
          others = {
            exporter_name: 'OTHERS',
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10
          }

          data.push(others)
        }
        total = {
          exporter_name: 'TOTAL',
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD
        }

        data.push(total)
        setExportertDataLT(data)

        setExporterDataList(res.data);
        setPendingExport(false);

          //console.log("getExporterList data payload", postData);
        //console.log("getExporterList data", data);

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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
       /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
       "incoterm" : params.incoterm,
       "conditionProductDesc": params.conditionProductDesc
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
            let specificItem = { "value": item.port_name, "label": item.port_name + " [" + item.shipment_count + "]" };
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

        res.data.portsList.forEach((item, index) => {
          if (index < 10) {
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
        if (res.data.portsList.length >= 10) {
          others = {
            port_name: 'OTHERS',
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
            country: 'India'
          }
          data.push(others)
        }
        total = {
          port_name: 'TOTAL',
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD
        }

        data.push(total)
        setIndianPortDataLT(data)

        setIndianPortDataList(res.data);
        setPendingIndPort(false);

        //console.log("getIndianPortList data payload", postData);
        //console.log("getIndianPortList data", res.data);
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
      /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
        "incoterm" : params.incoterm,
        "conditionProductDesc": params.conditionProductDesc
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
            let specificItem = { "value": item.port_name, "label": item.port_name + "[" + item.shipment_count + "]" };
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

        res.data.portsList.forEach((item, index) => {
          if (index < 10) {
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
        if (res.data.portsList.length >= 10) {
          others = {
            port_name: 'OTHERS',
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
            country: 'Foreign'
          }
          data.push(others)
        }
        total = {
          port_name: 'TOTAL',
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD
        }

        data.push(total)
        setForPortDataLT(data)

        setForPortDataList(res.data);
        setPendingForPort(false);

        //console.log("getForeignPortList data payload", postData);
        //console.log("getForeignPortList data", res.data);
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
      /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
       "incoterm" : params.incoterm,
       "conditionProductDesc": params.conditionProductDesc
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
            let specificItem = { "value": item.hscode, "label": item.hscode + " [" + item.shipment_count + "]" };
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

        res.data.hscodesList.forEach((item, index) => {
          if (index < 10) {
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
        if (res.data.hscodesList.length >= 10) {
          others = {
            hscode: 'OTHERS',
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10
          }
          data.push(others)
        }
        total = {
          hscode: 'TOTAL',
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD
        }

        data.push(total)
        setHSCodeDataLT(data)

        setHSCodeDataList(res.data);
        setPendingHSCode(false);

          //console.log("getHSCodeList data payload", postData);
        //console.log("getHSCodeList data", res.data);
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
      /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
       "incoterm" : params.incoterm,
       "conditionProductDesc": params.conditionProductDesc
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
            let specificItem = { "value": item.country_name, "label": item.country_name + " [" + item.shipment_count + "]" };
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

        res.data.countriesList.forEach((item, index) => {
          if (index < 10) {
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
        if (res.data.countriesList.length >= 10) {
          others = {
            country_name: 'OTHERS',
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10
          }
          data.push(others)
        }
        total = {
          country_name: 'TOTAL',
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD
        }

        data.push(total)
        setCountryDataLT(data)

        setCountryDataList(res.data);
        setPendingCountry(false);

          //console.log("getForeignCountryList data payload", postData);
        //console.log("getForeignCountryList data", res.data);
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
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": search_id,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList,
      /*26/08/2025 */
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
       "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
       "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
       "productDesc": params.productDesc,
     "consumptionType": params.consumptionType,
      "notifyParty": params.notifyParty,
       "incoterm" : params.incoterm,
       "conditionProductDesc": params.conditionProductDesc
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
            let specificItem = { "value": item.city_name, "label": item.city_name + " [" + item.shipment_count + "]" };
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

        res.data.citiesList.forEach((item, index) => {
          if (index < 10) {
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
        if (res.data.citiesList.length >= 10) {
          others = {
            city_name: 'OTHERS',
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10
          }
          data.push(others)
        }
        total = {
          city_name: 'TOTAL',
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD
        }

        data.push(total)
        setCityDataLT(data)

        setCityDataList(res.data);
        setPendingCity(false);

        //console.log("getCityList data payload", postData);
        //console.log("getCityList data", res.data);
      })
      .catch(err => {
        // console.log("Err");
        setPendingCity(false);
      });
  }


  /*28/08/2025 */
   const fetchTradingCountryListOnInnitialize = (params, countryCode, tradeType, initialValues) => {
      setTradeType(params);
  
      AxiosMaster({
        method: "GET",
        url: `/masterdata-management/countrylistbycontinent/${params}`,
      })
        .then(res => {
          let countryList = [];
          let multiCountryList = [];
          let selectedCountryList = [];
          let modMultiCountryList = [];
  
          if (res.data && res.data.length > 0) {
  
            // Process the response to group countries by continent
            res.data.forEach(continent => {
              const continentName = continent.continentName || "Unknown";
              const continentId = continent.continentId;
  
              // Filter countries that belong to the current continent
              const filteredCountries = continent.countryList.filter(
                country => country.continentId === continentId
              );
  
              filteredCountries.forEach(country => {
                multiCountryList.push({
                  value: country.shortcode,
                  label: country.name,
                  iso2code: country.image,
                  weightagePoints: params === "E" ? country.exportPointWeightage : country.importPointWeightage,
                  continentName: continentName, // Add continent name for grouping
                  continentId: continentId, // Add continent ID for filtering
                });
  
                let specificItem = Object.assign(country, { hasChild: false });
                countryList.push(specificItem);
              });
            });
  
  
            // Filter countryList based on props.countryList
            countryList = countryList.length > 0 && props.countryList.length > 0
              ? countryList.filter(item => props.countryList.includes(item.shortcode))
              : countryList;
  
            // --- multi country list modification according to permitted country @sarbojitghosh22 4/7/2025 ---//
            modMultiCountryList = multiCountryList.length > 0 && props.countryList.length > 0
              ? multiCountryList.filter(item => props.countryList.includes(item.value))
              : multiCountryList;
  
  
            setTradeCountryList(countryList);
            // setMultiTradeCountryList(multiCountryList);
            setMultiTradeCountryList(modMultiCountryList);
  
            // --- multi country list modification according to permitted country @sarbojitghosh22 4/7/2025 ---//
  
  
            // Automatically select the first country and set related data
            const tempRow = countryList.filter((item) =>
              countryCode.some((code) => item.shortcode.toLowerCase() === code.toLowerCase())
            );
  
            tempRow.forEach((item) => {
              selectedCountryList.push({ value: item.shortcode, label: item.name });
            });
  
            setSelectedTradeCountry(selectedCountryList);
  
           // setImporterForExport(tempRow[0]?.importerForExport || "");
           // setExporterForImport(tempRow[0]?.exporterForImport || "");
  
           // setDate(countryCode, tradeType, countryList);
  
            // if (searchTypeValue !== "") {
            //   handleSearch(initialValues, countryList, searchTypeValue);
            // } else {
            //   handleSearch(initialValues, countryList);
            // }
          }
        })
        .catch(err => {
          setTradeCountryList([]);
        });
    };

//console.log(props.location.state, searchParams);
 

  useEffect(() => {
 /*28/08/2025 */


 
   if (props.location.state.page_name === 'work_space'){
       // console.log("This Page is access from workspace page call");
       // console.log("This Page is access from workspace page call with search id outside", search_id);


      if (search_id) {
      props.loadingStart()
     // let queryBuilderSuggestionList = []
      Axios({
        method: "GET",
        url: `/search-management/search/details`,
        params: { searchId: search_id }
      })
        .then(res => {
          // console.log("RRRR", res.data);
          if (res.data.queryList) {
            let sParams = res.data.queryList[0].userSearchQuery;
          //  console.log("QQQQQQQQQQ", sParams);
           /* 

           // console.log("initialValues === ", initialValues);
            let selectedCountryListData = [];
            if (sParams.countryCode.length > 0) {
              sParams.countryCode.map((item, index) => {
                let specificItem = { "value": item, "label": item };
                selectedCountryListData.push(specificItem);
              })
            }

            setSelectedTradeCountry(selectedCountryListData);
            setSearchValue(sParams.searchValue)
            if (sParams.queryBuilder && sParams.queryBuilder.length > 0) {

              sParams.queryBuilder.map((newitem, newindex) => {
                queryBuilderSuggestionList[newindex] = newitem.searchValue
              })
            }
            setQueryBuilderSearchValue(queryBuilderSuggestionList)
            handleSearch(sParams);   */
            sParams.tradeType == "IMPORT" ? getTradingCountryList("I") : getTradingCountryList("E")


            let fromDateNew = "";
            let toDateNew = "";

            if (sParams.fromDate && moment(sParams.fromDate).isValid()) {
              fromDateNew = moment(sParams.fromDate).format("YYYY-MM-DD");
            }
            if (sParams.toDate && moment(sParams.toDate).isValid()) {
              toDateNew = moment(sParams.toDate).format("YYYY-MM-DD");
            }

              // console.log("fromDateNew :",fromDateNew," ,toDateNew :",toDateNew);
              const postData = {
                    //"searchType": sParams.searchType,
                    "searchType": "TRADE",
                    "tradeType": sParams.tradeType,
                    "fromDate": fromDateNew,
                    "toDate": toDateNew,
                    // "fromDate": sParams.fromDate ? new Date(sParams.fromDate) : "",
                    // "toDate": sParams.toDate ? new Date(sParams.toDate) : "",
                    "searchBy": sParams.searchBy,
                    "searchValue": sParams.searchValue,
                    "matchType": sParams.matchType,
                    "countryCode": sParams.countryCode,
                   // "searchId": search_id,
                    "searchId": "",
                    "hsCodeList": sParams.hsCodeList? sParams.hsCodeList :[],
                    "hsCode4DigitList": sParams.hsCode4DigitList? sParams.hsCode4DigitList :[],
                    "exporterList":  sParams.exporterList? sParams.exporterList :[],
                    "importerList": sParams.importerList? sParams.importerList :[],
                    "cityOriginList": sParams.cityOriginList? sParams.cityOriginList :[],
                    "cityDestinationList":  sParams.cityDestinationList ? sParams.cityDestinationList :[],
                    "portOriginList": sParams.portOriginList? sParams.portOriginList :[],
                    "portDestinationList": sParams.portDestinationList? sParams.portDestinationList :[],
                    "columnName": sParams.columnName,
                    "orderByColumn": sParams.orderByColumn,
                    "orderByMode": sParams.orderByMode,
                    "pageNumber": 0,
                    "numberOfRecords": 20,
                    "queryBuilder": sParams.queryBuilder,
                    "shipModeList": sParams.shipModeList ? sParams.shipModeList : [],
                    "stdUnitList": sParams.stdUnitList ? sParams.stdUnitList : [],
                    "rangeQuantityStart": sParams.rangeQuantityStart ? sParams.rangeQuantityStart : null,
                    "rangeQuantityEnd": sParams.rangeQuantityEnd ? sParams.rangeQuantityEnd : null,
                    "consumptionType": sParams.consumptionType ? sParams.consumptionType : [],
                    "rangeValueUsdStart": sParams.rangeValueUsdStart ? sParams.rangeValueUsdStart : null,
                    "rangeValueUsdEnd": sParams.rangeValueUsdEnd ? sParams.rangeValueUsdEnd : null,
                    "rangeUnitPriceUsdStart": sParams.rangeUnitPriceUsdStart ? sParams.rangeUnitPriceUsdStart : null,
                    "rangeUnitPriceUsdEnd": sParams.rangeUnitPriceUsdEnd ? sParams.rangeUnitPriceUsdEnd : null,
                    "incoterm":  sParams.incoterm ? sParams.incoterm : [],
                    "notifyParty":  sParams.notifyParty ? sParams.notifyParty : [],
                    "productDesc": sParams.productDesc ? sParams.productDesc : [],
                    "conditionProductDesc": sParams.conditionProductDesc ? sParams.conditionProductDesc :"",
                  }



                     //   console.log("sParams.searchType",sParams.searchType);
                      //  console.log("Payload Load ", postData);
                      // console.log("Payload Load searchParams", searchParams);

                     /*  try {
                          Axios({
                            method: "POST",
                            url: `search-management/search`,
                            data: JSON.stringify(postData),
                            headers: {
                              "Content-Type": "application/json"
                            }
                          });

                          console.log("SEARCH API Response:", res.data);

                            //  if (searchParams && searchParams.tradeType) {

                                console.log("After search api response");
                                  getImporterList(postData);
                                  getMonthWiseList(postData);
                                  getExporterList(postData);
                                  getIndianPortList(postData);
                                  getForeignPortList(postData);
                                  getHSCodeList(postData);
                                  getForeignCountryList(postData);
                                  getCityList(postData);
                                  getTradingCountryList(postData.tradeType);
                                  getShipmentModeList(postData);
                                  getHSCode4digitList(postData);
                                  getStdUnitList(postData);
                             //   }

                          props.loadingStop();
                        } catch (err) {
                          props.loadingStop();
                          console.error("Error while calling SEARCH API:", err.message || err);
                        }  */

                    // 1. Call the search API first
            Axios({
              method: "POST",
              url: `/search-management/search`,
              data: JSON.stringify(postData),
              headers: {
                "Content-Type": "application/json"
              }
            }).then(() => {
                // 2. Only after search API succeeds, call the other APIs
                console.log("Only Execute of workspace page");
                getImporterList(postData);
                getMonthWiseList(postData);
                getExporterList(postData);
                getIndianPortList(postData);
                getForeignPortList(postData);
                getHSCodeList(postData);
                getForeignCountryList(postData);
                getCityList(postData);
                getTradingCountryList(postData.tradeType);
                getShipmentModeList(postData);
                getHSCode4digitList(postData);
                getStdUnitList(postData);
                props.loadingStop();
              })
              .catch(err => {
                props.loadingStop();
                console.error("Error while calling SEARCH API:", err.message || err);
              });


          }
        })
        .catch(err => {
          // console.log("Err", err);
        });
    }
      
   }else if (searchParams && searchParams.tradeType && props.location.state.page_name != 'work_space') {
      // console.log("This Page is not access from workspace page call",searchParams);
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

    fetchSearchQuery()
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
    monthWiseDataList.forEach((item, index) => {
      data.push(item.value_usd);
    })
    data.push(others)
    return data;
  }

  const importerLabel = () => {
    let labels = [];
    let tempImporterList = Object.assign(importerDataList)
    tempImporterList.importersList.slice(0, 10).forEach((item) => {
      labels.push(item.importer_name);
    })
    if (importerDataList.importersList.length > 10) {
      labels.push("Others")
    }
    return labels;
  }
  const importerData = () => {
    let data = [];
    let others = 0;
    importerDataList.importersList.forEach((item, index) => {
      if (index < 10) {
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
    importerDataList.importersList.forEach((item, index) => {
      if (index < 10) {
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
    tempExporterList.exportersList.slice(0, 10).forEach((item, index) => {
      labels.push(item.exporter_name);
    })
    if (exporterDataList.exportersList.length > 10) {
      labels.push("Others")
    }
    return labels;
  }

  const exporterData = () => {
    let data = [];
    let others = 0;
    exporterDataList.exportersList.forEach((item, index) => {
      if (index < 10) {
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
    exporterDataList.exportersList.forEach((item, index) => {
      if (index < 10) {
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
    tempIndianPortList.portsList.slice(0, 10).forEach((item) => {
      labels.push(item.port_name);
    })
    if (indianPortDataList.portsList.length > 10) {
      labels.push("Others")
    }
    return labels;
  }

  const indPortData = () => {
    let data = [];
    let others = 0;
    indianPortDataList.portsList.forEach((item, index) => {
      if (index < 10) {
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
    indianPortDataList.portsList.forEach((item, index) => {
      if (index < 10) {
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
    tempForPortList.portsList.slice(0, 10).forEach((item) => {
      labels.push(item.port_name);
    })
    if (forPortDataList.portsList.length > 10) {
      labels.push("Others")
    }
    return labels;
  }

  const forPortData = () => {
    let data = [];
    let others = 0;
    forPortDataList.portsList.forEach((item, index) => {
      if (index < 10) {
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
    forPortDataList.portsList.forEach((item, index) => {
      if (index < 10) {
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
    tempHsCodeList.hscodesList.slice(0, 10).forEach((item) => {
      labels.push(item.hscode);
    })
    if (hsCodeDataList.hscodesList.length > 10) {
      labels.push("Others")
    }
    return labels;
  }

  const hsCodeData = () => {
    let data = [];
    let others = 0;
    hsCodeDataList.hscodesList.forEach((item, index) => {
      if (index < 10) {
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
    hsCodeDataList.hscodesList.forEach((item, index) => {
      if (index < 10) {
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
    tempCountryList.countriesList.slice(0, 10).forEach((item) => {
      labels.push(item.country_name);
    })
    if (countryDataList.countriesList.length > 10) {
      labels.push("Others")
    }
    return labels;
  }

  const countryData = () => {
    let data = [];
    let others = 0;
    countryDataList.countriesList.forEach((item, index) => {
      if (index < 10) {
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
    countryDataList.countriesList.forEach((item, index) => {
      if (index < 10) {
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
    tempcityList.citiesList.slice(0, 10).forEach((item) => {
      labels.push(item.city_name);
    })
    if (cityDataList.citiesList.length > 10) {
      labels.push("Others")
    }
    return labels;
  }

  const cityData = () => {
    let data = [];
    let others = 0;
    cityDataList.citiesList.forEach((item, index) => {
      if (index < 10) {
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
    cityDataList.citiesList.forEach((item, index) => {
      if (index < 10) {
        data.push(item.share);
      }
      // else{
      //   others = others + item.share
      // }     
    })
    data.push(cityDataList.valueShareTop10)
    return data;
  }

  const setMaxMinDate = (text, tradeType) => {
    let tempRow = tradeCountryList.filter((item) => item.shortcode.toLowerCase().includes(text.toLowerCase()))
    let fromDate = ""
    let toDate = ""
    if (tradeType == "IMPORT") {
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
    return (
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
                          if (props.queryPerDay > 0) {
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
                          if (props.queryPerDay > 0) {
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
                          if (props.queryPerDay > 0) {
                            setFieldValue(`queryBuilder[${index}].matchType`, event.target.value);
                          }
                          else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                            swalResponse()
                          }
                        }}
                      >
                        <option>Select</option>
                        {values.queryBuilder && values.queryBuilder.length > 0 && values.queryBuilder[index].hasOwnProperty("searchBy") && values.queryBuilder[index].searchBy == "PRODUCT" ? <option value="C">Contains</option> : null}
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
                            separators={["Enter", "Tab"]}
                            classNames={{ tag: "", input: "" }}
                            placeHolder="Enter search value"
                            disabled={true}
                            onBlur={(e) => { handleBlur(e, setFieldValue) }}
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

  const onDataRowClicked = (row, index) => {

    if (row.hasOwnProperty("importer_name") && row.importer_name == "OTHERS") {
      handleModal(importerDataList.importersList, importerColumns)
    }
    else if (row.hasOwnProperty("exporter_name") && row.exporter_name == "OTHERS") {
      handleModal(exporterDataList.exportersList, exporterColumns)
    }
    else if (row.hasOwnProperty("hscode") && row.hscode == "OTHERS") {
      handleModal(hsCodeDataList.hscodesList, hsCodeColumns)
    }
    else if (row.hasOwnProperty("country_name") && row.country_name == "OTHERS") {
      handleModal(countryDataList.countriesList, countryColumns)
    }
    else if (row.hasOwnProperty("city_name") && row.city_name == "OTHERS") {
      handleModal(cityDataList.citiesList, cityColumns)
    }
    else if (row.hasOwnProperty("port_name") && row.port_name == "OTHERS" && row.country == 'India') {
      handleModal(indianPortDataList.portsList, portColumns)
    }
    else if (row.hasOwnProperty("port_name") && row.port_name == "OTHERS" && row.country == 'Foreign') {
      handleModal(forPortDataList.portsList, portColumns)
    }
  }

  const resetFilter = (data) => {
    // setPreviousTotalRecordCount(0)
    // setIsDownloaded("N")
    updateFilter(data)
  }

  const updateFilter = (data) => {
   
    console.log("updateFilter data in Analysis", data);
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
    if (data.shipmentModeList) {
      setShipmentModeList(data.shipmentModeList);
    }
    if (data.stdUnitList) {
      setStdUnitList(data.stdUnitList);
    }

    /* 26/08/2025 */ 
   /*  if (data.rangeQuantityStart) {
      setRangeQuantityStart(data.rangeQuantityStart);
    }
    if (data.rangeQuantityEnd) {
      setRangeQuantityEnd(data.rangeQuantityEnd);
    }


    if (data.rangeValueUsdStart) {
      setRangeValueUsdStart(data.rangeValueUsdStart);
    }
    if (data.rangeValueUsdEnd) {
      setRangeValueUsdEnd(data.rangeValueUsdEnd);
    }

     if (data.rangeUnitPriceUsdStart) {
      setrangeUnitPriceUsdStart(data.rangeUnitPriceUsdStart);
    }
    if (data.rangeUnitPriceUsdEnd) {
      setRangeUnitPriceUsdEnd(data.rangeUnitPriceUsdEnd);
    }
     if (data.productDesc) {
      setProductDesc(data.productDesc);
    }

     if (data.consumptionType) {
      setConsumptionType(data.consumptionType);
    }
     if (data.notifyParty) {
      setNotifyParty(data.notifyParty);
    }
 */



    setApiSerachpayload({
      ...apiSerachpayload,
      ...data
    });

   

    if (searchParams && searchParams.tradeType) {
      // let params = searchParams;
      let params = { ...searchParams, ...data };

     // console.log("Updated Filter Params",params);
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
  
    
     
 console.log("updateFilter params in Analysis", params);
      //console.log("Analysisi Params",params);
      setSearchParams(params);
      //console.log("apiSerachpayload params",params);
      setApiSerachpayload(params); // <-- Add this

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

  useEffect(() => {
    //console.log("API Search Payload Updated apiSerachpayload:", apiSerachpayload);
  }, [apiSerachpayload]);
  

  async function getConsumptionTypeDataList(searchQuery) {
    try {
      const tempTradeType = searchQuery.tradeType.toLowerCase();
      let columnKey = tempTradeType == "export" ? `export_purpose` : `import_purpose`;
      searchQuery["columnName"] = columnKey;


      Axios({
        method: "POST",
        url: `/search-management/listdistinctcolumnvalue`,
        data: JSON.stringify(searchQuery),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {

        /*  let apiResponse = res.data.distinctColumnValuesList;
          let formattedOptions = apiResponse.map(({ column_name, records_count }) => ({
            label: `${column_name} (${records_count})`,
            value: column_name
          }));

          setConsumptionTypeDataList(formattedOptions);*/

          let apiResponse = res.data?.distinctColumnValuesList || [];

        /* 26/08/2025 */
          let formattedOptions = Array.isArray(apiResponse)
            ? apiResponse.map(({ column_name, records_count }) => ({
                label: `${column_name} (${records_count})`,
                value: column_name
              }))
            : [];

          setConsumptionTypeDataList(formattedOptions);
        })
    } catch (e) {
      // console.log(e);
      setConsumptionTypeDataList([]);
    }
  }

  async function getIncotermListDataList(searchQuery) {
    try {
      searchQuery["columnName"] = 'incoterm';

      Axios({
        method: "POST",
        url: `/search-management/listdistinctcolumnvalue`,
        data: JSON.stringify(searchQuery),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {

          let apiResponse = res.data.distinctColumnValuesList;
          if (apiResponse && apiResponse.length > 0) {
            let formattedOptions = apiResponse.map(({ column_name, records_count }) => ({
              label: `${column_name} (${records_count})`,
              value: column_name
            }));

            setIncotermListData(formattedOptions);
          } else {
            setIncotermListData([]);
          }
        })
    } catch (e) {
      // console.log(e);
      setIncotermListData([]);
    }
  }

  async function getNotifyPartyListDataList(searchQuery) {
    try {
      searchQuery["columnName"] = 'notify_party_name';

      Axios({
        method: "POST",
        url: `/search-management/listdistinctcolumnvalue`,
        data: JSON.stringify(searchQuery),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          //let apiResponse = res.data.distinctColumnValuesList;
          let apiResponse = res.data?.distinctColumnValuesList ?? [];
          let formattedOptions = apiResponse.map(({ column_name, records_count }) => ({
            label: `${column_name} (${records_count})`,
            value: column_name
          }));

          setNotifyPartyListData(formattedOptions);
        })
    } catch (e) {
      // console.log(e);
      setNotifyPartyListData([]);
    }
  }

  const getIndianPortHeader = () => {
    if (searchParams && searchParams.tradeType === "EXPORT") {
      return "Top 10 Origin ports";
    } else if (searchParams && searchParams.tradeType === "IMPORT") {
      return "Top 10 Destination ports";
    }
  };

  const getForeignPortHeader = () => {
    if (searchParams && searchParams.tradeType === "EXPORT") {
      return "Top 10 Destination Ports";
    } else if (searchParams && searchParams.tradeType === "IMPORT") {
      return "Top 10 Origin Ports";
    }
  };


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
                              disabled={true}
                              onChange={event => {
                                setFieldValue("tradeType", event.target.value);
                                setFieldValue("countryCode", "");
                                setFieldValue("fromDate", "");
                                setFieldValue("toDate", "");
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
                          {/* <div className="dropdown bootstrap-select hero__form-input">
                            <Field
                              name="countryCode"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.countryCode && errors.countryCode ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.countryCode}
                              disabled={true}
                              onChange={event => {
                                setFieldValue("countryCode", event.target.value);
                                setFieldValue("fromDate", "");
                                setFieldValue("toDate", "");
                                setMaxMinDate(event.target.value, values.tradeType)
                              }}
                            >
                              <option>Select Country</option>
                              {Object.keys(tradeCountryList).map((item, index) => (
                                <option key={index} value={tradeCountryList[item].shortcode}>{tradeCountryList[item].name}</option>
                              ))}
                            </Field>
                          </div> */}
                          <MultiSelect
                            options={multiTradeCountryList}
                            value={selectedTradeCountry}
                            onChange={(selectedOption) => {
                              setSelectedTradeCountry(selectedOption);
                              const selectedValues = selectedOption.map(option => option.value);
                              setFieldValue("countryCode", selectedValues);
                              setFieldValue("fromDate", "");
                              setFieldValue("toDate", "");
                              setFieldValue("dateRange", "");
                              setMaxMinDate(selectedOption, values.tradeType);
                            }}
                            labelledBy="Select"
                            disabled={true}
                          />

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
                              disabled={true}
                              minDate={new Date(minDate)}
                              maxDate={new Date(maxDate)}
                              className="form-control"
                              dropdownMode="select"
                              onChange={(value) => {
                                setFieldValue("fromDate", value);
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
                              disabled={true}
                              minDate={new Date(minDate)}
                              maxDate={new Date(maxDate)}
                              className="form-control"
                              dropdownMode="select"
                              onChange={(value) => {
                                setFieldValue("toDate", value);
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
                              disabled={true}
                              onChange={event => {
                                setFieldValue("searchBy", event.target.value);
                              }}
                            >
                              <option value="">Select Type</option>
                              <option value="HS_CODE_2">HS Code 2 digit</option>
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
                              disabled={true}
                              onChange={event => {
                                setFieldValue("matchType", event.target.value);
                              }}
                            >
                              <option value="">Select</option>
                              <option value="C">Contains</option>
                              <option value="D">Does Not Contains</option>
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
                                separators={["Enter", "Tab"]}
                                classNames={{ tag: "", input: "" }}
                                placeHolder="Enter search value"
                                disabled={true}
                                onBlur={(e) => { handleBlur(e, setFieldValue) }}
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
                            state: {
                              search_id: search_id,
                              workspace_id: props.location.state ? props.location.state.workspace_id : "",
                              workspace_name: props.location.state ? props.location.state.workspace_name : "",
                              workspace_desc: props.location.state ? props.location.state.workspace_desc : "",
                              workspaceId: props.location.state ? props.location.state.workspaceId : "",
                              columnKeys: props.location.state ? props.location.state.columnKeys : ""
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
                      conditionalRowStyles={conditionalRowStyles}
                      onRowMouseLeave={(row, e) => setTooltipContent("")}
                      onRowMouseEnter={(row, e) =>
                        showTooltip(row, e)
                      }
                      onRowClicked={onDataRowClicked}
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
                          <GraphBar barTitle={'Month Wise Analysis'} labels={monthWiseLabel()} data={MonthWiseData()} dataLabel="Total value (USD)" colorCode="245,138,16" xAxixLabel="Month" />
                        </TabPanel>
                        <TabPanel>
                          <GraphLine barTitle={'Month Wise Analysis'} labels={monthWiseLabel()} data={MonthWiseData()} colorCode="245,138,16" xAxixLabel="Month" />
                        </TabPanel>
                      </Tabs>
                    ) : (
                      <div className="loaderBlock">
                        <div className="loader"></div>
                      </div>
                    )}
                  </div>
                </div>
              </> : null}
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
                      conditionalRowStyles={conditionalRowStyles}
                      onRowClicked={onDataRowClicked}
                      dense
                      highlightOnHover
                      progressPending={pendingImport}
                      progressComponent={<Loader />}
                      onRowMouseLeave={(row, e) => setTooltipContent("")}
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
              </> : null}
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
                      conditionalRowStyles={conditionalRowStyles}
                      onRowClicked={onDataRowClicked}
                      highlightOnHover
                      dense
                      progressPending={pendingExport}
                      progressComponent={<Loader />}
                      onRowMouseLeave={(row, e) => setTooltipContent("")}
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
              </> : null}

            {indianPortDataList.portsList && indianPortDataList.portsList.length > 0 ?
              <>
                {/* <h4>Top 10 Indian ports</h4> */}
                <h4>{getIndianPortHeader()}</h4>

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
                          <GraphBar barTitle={'Top 10 indian ports'} labels={indPortLabel()} data={indPortData()} dataLabel="Total value (USD)" />
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
                      conditionalRowStyles={conditionalRowStyles}
                      highlightOnHover
                      onRowClicked={onDataRowClicked}
                      dense
                      progressPending={pendingIndPort}
                      progressComponent={<Loader />}
                      onRowMouseLeave={(row, e) => setTooltipContent("")}
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
              </> : null}

            {forPortDataList.portsList && forPortDataList.portsList.length > 0 ?
              <>
                {/* <h4>Top 10 Foreign Ports</h4> */}
                <h4>{getForeignPortHeader()}</h4>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <DataTable
                      className="table table-striped table-hover"
                      columns={portColumns}
                      data={forPortDataLT}
                      // noHeader
                      defaultSortField="id"
                      defaultSortAsc={false}
                      conditionalRowStyles={conditionalRowStyles}
                      onRowClicked={onDataRowClicked}
                      highlightOnHover
                      dense
                      progressPending={pendingForPort}
                      progressComponent={<Loader />}
                      onRowMouseLeave={(row, e) => setTooltipContent("")}
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
                          <GraphBar barTitle={'Top 10 foreign ports'} labels={forPortLabel()} data={forPortData()} dataLabel="Total value (USD)" />
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
              </> : null}

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
                          <GraphBar barTitle={'Top 10 HS Codes'} labels={hsCodeLabel()} data={hsCodeData()} dataLabel="Total value (USD)" />
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
                      conditionalRowStyles={conditionalRowStyles}
                      onRowClicked={onDataRowClicked}
                      highlightOnHover
                      dense
                      progressPending={pendingHSCode}
                      progressComponent={<Loader />}
                      onRowMouseLeave={(row, e) => setTooltipContent("")}
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
              </> : null}

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
                      conditionalRowStyles={conditionalRowStyles}
                      onRowClicked={onDataRowClicked}
                      highlightOnHover
                      dense
                      progressPending={pendingCountry}
                      progressComponent={<Loader />}
                      onRowMouseLeave={(row, e) => setTooltipContent("")}
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
                          <GraphBar barTitle={'Top 10 countries'} labels={countryLabel()} data={countryData()} dataLabel="Total value (USD)" />
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
              </> : null}

            {/* {cityDataList.citiesList && cityDataList.citiesList.length > 0 ?
              <>
                <h4>Top 10 Cities</h4>
                <div className="row mb-4">
                  <div className="col-md-6">
                    {!pendingCity ? (
                      <Tabs defaultIndex={0}>
                        <TabList>
                          <Tab>Pie</Tab>
                          <Tab>Bar</Tab>
                          <Tab>Line</Tab>
                        </TabList>

                        <TabPanel>
                          <GraphPI barTitle={'Top 10 Cities'} labels={cityLabel()} data={cityDataPie()} />
                        </TabPanel>
                        <TabPanel>
                          <GraphBar barTitle={'Top 10 Cities'} labels={cityLabel()} data={cityData()} dataLabel="Total value (USD)" />
                        </TabPanel>
                        <TabPanel>
                        <GraphLine barTitle={'Top 10 Cities'} labels={cityLabel()} data={cityData()} />
                      </TabPanel>
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
                      conditionalRowStyles={conditionalRowStyles}
                      onRowClicked={onDataRowClicked}
                      highlightOnHover
                      dense
                      progressPending={pendingCity}
                      progressComponent={<Loader />}
                      onRowMouseLeave={(row, e) => setTooltipContent("")}
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
              </> : null} */}
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
          resetFilter={resetFilter}
          stdUnitList={stdUnitList}
          stdUnitDataList={stdUnitDataArray}
          importerForExport={importerForExport}
          exporterForImport={exporterForImport}
          consumptionType={consumptionType}
          consumptionTypeDataList={consumptionTypeDataList}
          incoterm={incoterm}
          incotermDataList={incotermListData}
          notifyParty={notifyParty}
          notifyPartyDataList={notifyPartyListData}
          apiSerachpayload={apiSerachpayload} // <-- Pass it here
          show={toggle}

        />}
      </div>
      <div>
        {showModal ?
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
                  columnList={newModalColumn}
                  dataList={newModalData}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Analysis));
