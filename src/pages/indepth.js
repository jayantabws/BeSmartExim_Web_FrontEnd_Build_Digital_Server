import React, { useState, useEffect, Fragment } from "react";
import Axios from "../shared/Axios";
import AxiosMaster from "../shared/AxiosMaster";
import { Field, Formik, FieldArray } from "formik";
import {
  Form,
  FormGroup,
  Row,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import * as Yup from "yup";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import moment from "moment";
import Loader from "../components/Loader";
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
//import GraphPI from '../components/GraphPI';
//import GraphBar from '../components/GrapghBar';
//import GraphLine from '../components/GraphLine';
import { TagsInput } from "react-tag-input-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker-cssmodules.min.css";
import { useHistory, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { loaderStart, loaderStop } from "../store/actions/loader";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//import AnalysisTable from '../components/IndepthTable'
//import AdvanceSearch from '../components/AdvanceSearch';
//import Draggable from 'react-draggable';
//import BlankImg from '../assets/image/BlankImg.png'
import IndepthSearchTable from "./IndepthSearchTable";
import { setSearchQuery } from "../store/actions/data";

const dateFormat = "YYYY-MM-DD";

let initialValues = {
  tradeType: "",
  searchBy: "",
  searchValue: "",
  countryCode: "",
  fromDate: "",
  toDate: "",
  matchType: "",
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

/* 11/11/2025 */
/*
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

]  */

const Analysis = (props) => {
  const search_id = props.location.state
    ? props.location.state.search_id
    : null;
  const importerForExport = props.location.state
    ? props.location.state.importerForExport
    : null;
  const exporterForImport = props.location.state
    ? props.location.state.exporterForImport
    : null;
  const [active, setActive] = useState("indepth");

  /* 11/11/2025 */
  // const [tooltipContent, setTooltipContent] = useState("");
  // const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  /* 11/11/2025 */
  /*
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
 */

  const fetchSearchQuery = () => {
    // console.log('fetchSearchQuery start, search_id=', search_id);
    if (search_id) {
      props.loadingStart();
      let queryBuilderSuggestionList = [];
      Axios({
        method: "GET",
        url: `/search-management/search/details`,
        params: { searchId: search_id },
      })
        .then((res) => {
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
              shipmentModeList: sParams.shipModeList
                ? sParams.shipModeList
                : [],
              stdUnitList: sParams.stdUnitList ? sParams.stdUnitList : [],
            };
            setSearchValue(sParams.searchValue);
            if (sParams.queryBuilder && sParams.queryBuilder.length > 0) {
              sParams.queryBuilder.map((newitem, newindex) => {
                queryBuilderSuggestionList[newindex] = newitem.searchValue;
              });
            }
            setQueryBuilderSearchValue(queryBuilderSuggestionList);
            handleSearch(sParams);
            sParams.tradeType == "IMPORT"
              ? getTradingCountryList("I")
              : getTradingCountryList("E");
          }
        })
        .catch((err) => {
          // console.log("Err", err);
        });
    }
  };

  const history = useHistory();

  const [toggle, setToggle] = useState(false);
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
  const [monthWise, setMonthWiseList] = useState([]);
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
  const [hsCode4DigitList, setHsCode4digitList] = useState([]);
  const [hsCode4digitDataArray, setHsCode4digitDataArray] = useState([]);
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
    exporter: 1,
    importer: 0,
    hscode: 0,
    country: 0,
    port: 0,
  });

  useEffect(() => {
    console.log("🔄 cardValuesTotal changed:", cardValuesTotal);
  }, [cardValuesTotal]);

  useEffect(() => {
    console.log("🔄 totalShipmentCount changed:", totalShipmentCount);
  }, [totalShipmentCount]);

  // ...Indepth Search Table code...
  const [indepthParams, setIndepthParams] = useState(null); // payload passed to IndepthSearchTable

  const buildFinalParams = () => {
    const p = { ...(searchParams || {}) };
    // ✅ Add searchId from the search_id variable
    p.searchId = search_id; // Add this line

    // card1: exporter/importer - if items are objects map to id/name expected by API
    if (card1ImportExport === "exporter") {
      p.exporterList = Array.isArray(selectedExporters)
        ? selectedExporters.map((x) => (x && x.id ? x.id : x))
        : [];
      p.importerList = [];
    } else {
      p.importerList = Array.isArray(selectedImporters)
        ? selectedImporters.map((x) => (x && x.id ? x.id : x))
        : [];
      p.exporterList = [];
    }

    const applyCard = (selectValue, items) => {
      // console.log("Applying card", selectValue, items);
      const list = Array.isArray(items)
        ? items.map((x) => (x && x.id ? x.id : x))
        : [];
      //console.log("Mapped list for", selectValue, list);
      switch (selectValue) {
        case "hscode":
          p.hsCodeList = list;
          break;
        case "country":
          p.countryList = list;
          break;
        case "port":
          //Port assign based on trade type
          if (p.tradeType === "EXPORT") {
            p.portOriginList = list; //Export :foreign ports are origin
            p.portDestinationList = p.portDestinationList || []; //Keep existing destination ports
          } else {
            p.portDestinationList = list; //Import :indian ports are destination
            p.portOriginList = p.portOriginList || []; //Keep existing origin ports
          }
          break;
        case "importer":
          p.importerList = list;
          break;
        case "exporter":
          p.exporterList = list;
          break;
        default:
          break;
      }
    };

    applyCard(card2Select, selectedCard2Items);
    applyCard(card3Select, selectedCard3Items);
    applyCard(card4Select, selectedCard4Items);
    applyCard(card5Select, selectedCard5Items);

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
  // ...Indepth Search Table code end...

  // Helper: get API data for each card type
  const getCardApiData = (type) => {
    switch (type) {
      case "hscode":
        return hsCodeDataList.hscodesList || [];
      case "importer":
        return importerDataList.importersList || [];
      case "exporter":
        return exporterDataList.exportersList || [];
      case "country":
        return countryDataList.countriesList || [];
      case "port":
        return indianPortDataList.portsList || [];
      default:
        return [];
    }
  };

  // Helper: get label for each card type
  const getCardLabel = (type, item) => {
    switch (type) {
      case "hscode":
        return `${item.hscode} [$${item.value_usd}]`;
      case "importer":
        return `${item.importer_name} [$${item.value_usd}]`;
      case "exporter":
        return `${item.exporter_name} [$${item.value_usd}]`;
      case "country":
        return `${item.country_name} [$${item.value_usd}]`;
      case "port":
        return `${item.port_name} [$${item.value_usd}]`;
      default:
        return "";
    }
  };

  // Helper: filter data based on search term
  const getFilteredCardData = (type, searchTerm = "") => {
    const data = getCardApiData(type);

    if (!searchTerm.trim()) {
      return data; // Return all data if no search term
    }
    return data.filter((item) => {
      const label = getCardLabel(type, item);
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const isOptionSelectedElsewhere = (option, currentCardIndex) => {
    const allSelected = [card2Select, card3Select, card4Select, card5Select];
    return allSelected.some(
      (val, idx) => val === option && idx !== currentCardIndex - 2
    );
  };

  // ✅ UPDATED: handleSelectionChange to call both value and shipment count
  const handleSelectionChange = (selectedItems, type) => {
    console.log(`${type} selection changed:`, selectedItems);

    if (searchParams) {
      const updatedParams = {
        ...searchParams,
        ...(type === "exporter" && { exporterList: selectedItems }),
        ...(type === "importer" && { importerList: selectedItems }),
        ...(type === "hscode" && { hsCodeList: selectedItems }),
        ...(type === "country" && {
          ...(searchParams.tradeType === "EXPORT"
            ? { cityDestinationList: selectedItems }
            : { cityOriginList: selectedItems }),
        }),
        ...(type === "port" && {
          ...(searchParams.tradeType === "EXPORT"
            ? { portOriginList: selectedItems }
            : { portDestinationList: selectedItems }),
        }),
      };

      setSearchParams(updatedParams);

      // ✅ FIX: Always call API, don't set to zero
      Promise.all([
        getValueForParams(updatedParams, 1),
        getTotalShipmentCount(updatedParams),
      ])
        .then((results) => {
          console.log("Card 1 value and shipment updated:", results);
        })
        .catch((err) => {
          console.error("Error fetching Card 1 data:", err);
        });

      // Rest of your existing code for loading states...
      if (selectedItems.length > 0) {
        setCard2Loading(true);
        setCard3Loading(true);
        setCard4Loading(true);
        setCard5Loading(true);
        props.loadingStart();

        let updatePromises = [
          getIndianPortList(updatedParams),
          getHSCodeList(updatedParams),
          getForeignCountryList(updatedParams),
          getHSCode4digitList(updatedParams),
          getIndianPortList(updatedParams),
        ];

        if (type !== "importer") {
          updatePromises.push(getImporterList(updatedParams));
        }
        if (type !== "exporter") {
          updatePromises.push(getExporterList(updatedParams));
        }

        Promise.all(updatePromises).finally(() => {
          setTimeout(() => {
            setCard2Loading(false);
            setCard3Loading(false);
            setCard4Loading(false);
            setCard5Loading(false);
            props.loadingStop();
          }, 1500);
        });
      } else {
        // ✅ When all items are deselected, just clear dependent cards
        setSelectedCard2Items([]);
        setSelectedCard3Items([]);
        setSelectedCard4Items([]);
        setSelectedCard5Items([]);
      }
    }
  };
  // ✅ UPDATED: handleCard2Change with proper loading states
  const handleCard2Change = async (selectedItems, type) => {
    console.log("card 2 change called", type, selectedItems);

    const updatedParams = {
      ...searchParams,
      ...(type === "hscode" && { hsCodeList: selectedItems }),
      ...(type === "country" && {
        ...(searchParams.tradeType === "EXPORT"
          ? { cityDestinationList: selectedItems }
          : { cityOriginList: selectedItems }),
      }),
      ...(type === "port" && {
        ...(searchParams.tradeType === "EXPORT"
          ? { portOriginList: selectedItems }
          : { portDestinationList: selectedItems }),
      }),
      ...(type === "importer" && { importerList: selectedItems }),
      ...(type === "exporter" && { exporterList: selectedItems }),
    };

    setSearchParams(updatedParams);

    // ✅ Use the independent function
  updateMySelectedOptions(2, type);

    // ✅ FIX: Always call API, don't set to zero
    await Promise.all([
      getValueForParams(updatedParams, 2),
      getTotalShipmentCount(updatedParams),
    ]);

    // ✅ FIX: Set loading states based on whether we have selections or not
    if (selectedItems.length === 0) {
      // If clearing card 2, clear all forward cards and set loading
      setSelectedCard3Items([]);
      setSelectedCard4Items([]);
      setSelectedCard5Items([]);

      // Set loading for cards 3,4,5 when clearing card 2
      setCard3Loading(true);
      setCard4Loading(true);
      setCard5Loading(true);

      // Refresh forward cards
      forwardRefreshFromCard(2);
    } else {
      // If selecting items in card 2, set loading for forward cards
      console.log("Second card mySelectedOptions", mySelectedOptions);
      setCard3Loading(true);
      setCard4Loading(true);
      setCard5Loading(true);
      props.loadingStart();

      try {
        const effectiveForward = Object.keys(mySelectedOptions).filter(
          (key) => mySelectedOptions[key] === 0
        );
        console.log("Effective forward targets from Card 2:", effectiveForward);
        console.log("Type", type);

        const promises = [];

        if (effectiveForward.includes("hscode") && type !== "hscode")
          promises.push(getHSCodeList(updatedParams));
        if (effectiveForward.includes("country") && type !== "country")
          promises.push(getForeignCountryList(updatedParams));
        if (effectiveForward.includes("port") && type !== "port")
          promises.push(getIndianPortList(updatedParams));
        if (effectiveForward.includes("importer") && type !== "importer")
          promises.push(getImporterList(updatedParams));
        if (effectiveForward.includes("exporter") && type !== "exporter")
          promises.push(getExporterList(updatedParams));

        await Promise.all(promises);
        console.log("Card 2 -> forward cards updated");
      } catch (err) {
        console.error("Error updating from Card 2:", err);
      } finally {
        setTimeout(() => {
          setCard3Loading(false);
          setCard4Loading(false);
          setCard5Loading(false);
          props.loadingStop();
        }, 1500);
      }
    }
  };

  // ✅ UPDATED: handleCard3Change with proper loading states
  const handleCard3Change = async (selectedItems, type) => {
    console.log("card 3 change called", type, selectedItems);

    const updatedParams = {
      ...searchParams,
      ...(type === "hscode" && { hsCodeList: selectedItems }),
      ...(type === "country" && {
        ...(searchParams.tradeType === "EXPORT"
          ? { cityDestinationList: selectedItems }
          : { cityOriginList: selectedItems }),
      }),
      ...(type === "port" && {
        ...(searchParams.tradeType === "EXPORT"
          ? { portOriginList: selectedItems }
          : { portDestinationList: selectedItems }),
      }),
      ...(type === "importer" && { importerList: selectedItems }),
      ...(type === "exporter" && { exporterList: selectedItems }),
    };

    setSearchParams(updatedParams);
     // ✅ Use the independent function
  updateMySelectedOptions(3, type);

    // ✅ FIX: Always call API, don't set to zero
    await Promise.all([
      getValueForParams(updatedParams, 3),
      getTotalShipmentCount(updatedParams),
    ]);

    // ✅ FIX: Set loading states based on whether we have selections or not
    if (selectedItems.length === 0) {
      // If clearing card 3, clear forward cards and set loading
      setSelectedCard4Items([]);
      setSelectedCard5Items([]);

      // Set loading for cards 4,5 when clearing card 3
      setCard4Loading(true);
      setCard5Loading(true);

      // Refresh forward cards
      forwardRefreshFromCard(3);
    } else {
      // If selecting items in card 3, set loading for forward cards
      console.log("Third card mySelectedOptions", mySelectedOptions);
      setCard4Loading(true);
      setCard5Loading(true);
      props.loadingStart();

      try {
        const effectiveForward = Object.keys(mySelectedOptions).filter(
          (key) => mySelectedOptions[key] === 0
        );

        console.log("Effective forward targets from Card 3:", effectiveForward);
        console.log("Type", type);

        const promises = [];
        if (effectiveForward.includes("hscode") && type !== "hscode")
          promises.push(getHSCodeList(updatedParams));
        if (effectiveForward.includes("country") && type !== "country")
          promises.push(getForeignCountryList(updatedParams));
        if (effectiveForward.includes("port") && type !== "port")
          promises.push(getIndianPortList(updatedParams));
        if (effectiveForward.includes("importer") && type !== "importer")
          promises.push(getImporterList(updatedParams));
        if (effectiveForward.includes("exporter") && type !== "exporter")
          promises.push(getExporterList(updatedParams));

        await Promise.all(promises);
        console.log("Card 3 -> forward cards updated");
      } catch (err) {
        console.error("Error updating from Card 3:", err);
      } finally {
        setTimeout(() => {
          setCard4Loading(false);
          setCard5Loading(false);
          props.loadingStop();
        }, 1500);
      }
    }
  };

  // ✅ UPDATED: handleCard4Change with proper loading states
  const handleCard4Change = async (selectedItems, type) => {
    console.log("card 4 change called", type, selectedItems);

    const updatedParams = {
      ...searchParams,
      ...(type === "hscode" && { hsCodeList: selectedItems }),
      ...(type === "country" && {
        ...(searchParams.tradeType === "EXPORT"
          ? { cityDestinationList: selectedItems }
          : { cityOriginList: selectedItems }),
      }),
      ...(type === "port" && {
        ...(searchParams.tradeType === "EXPORT"
          ? { portOriginList: selectedItems }
          : { portDestinationList: selectedItems }),
      }),
      ...(type === "importer" && { importerList: selectedItems }),
      ...(type === "exporter" && { exporterList: selectedItems }),
    };

    setSearchParams(updatedParams);
     // ✅ Use the independent function
  updateMySelectedOptions(4, type);

    // ✅ FIX: Always call API, don't set to zero
    await Promise.all([
      getValueForParams(updatedParams, 4),
      getTotalShipmentCount(updatedParams),
    ]);

    // ✅ FIX: Set loading states based on whether we have selections or not
    if (selectedItems.length === 0) {
      // If clearing card 4, clear forward cards and set loading
      setSelectedCard5Items([]);

      // Set loading for card 5 when clearing card 4
      setCard5Loading(true);

      // Refresh forward cards
      forwardRefreshFromCard(4);
    } else {
      // If selecting items in card 4, set loading for forward cards
      console.log("Fourth card mySelectedOptions", mySelectedOptions);
      setCard5Loading(true);
      props.loadingStart();

      try {
        const effectiveForward = Object.keys(mySelectedOptions).filter(
          (key) => mySelectedOptions[key] === 0
        );
        console.log("Effective forward targets from Card 4:", effectiveForward);

        const promises = [];
        if (effectiveForward.includes("hscode") && type !== "hscode")
          promises.push(getHSCodeList(updatedParams));
        if (effectiveForward.includes("country") && type !== "country")
          promises.push(getForeignCountryList(updatedParams));
        if (effectiveForward.includes("port") && type !== "port")
          promises.push(getIndianPortList(updatedParams));
        if (effectiveForward.includes("importer") && type !== "importer")
          promises.push(getImporterList(updatedParams));
        if (effectiveForward.includes("exporter") && type !== "exporter")
          promises.push(getExporterList(updatedParams));

        await Promise.all(promises);
        console.log("Card 4 -> forward card updated");
      } catch (err) {
        console.error("Error updating from Card 4:", err);
      } finally {
        setTimeout(() => {
          setCard5Loading(false);
          props.loadingStop();
        }, 1500);
      }
    }
  };
  // UPDATED: handleCard5Change with shipment count
  const handleCard5Change = async (selectedItems, type) => {
    console.log("card 5 change called", type, selectedItems);
    if (!searchParams) return;

    const updatedParams = {
      ...searchParams,
      ...(type === "hscode" && { hsCodeList: selectedItems }),
      ...(type === "country" && {
        ...(searchParams.tradeType === "EXPORT"
          ? { cityDestinationList: selectedItems }
          : { cityOriginList: selectedItems }),
      }),
      ...(type === "port" && {
        ...(searchParams.tradeType === "EXPORT"
          ? { portOriginList: selectedItems }
          : { portDestinationList: selectedItems }),
      }),
      ...(type === "importer" && { importerList: selectedItems }),
      ...(type === "exporter" && { exporterList: selectedItems }),
    };

    setSearchParams(updatedParams);
     // ✅ Use the independent function
  updateMySelectedOptions(5, type);

    // ✅ FIX: Always call API, don't set to zero
    await Promise.all([
      getValueForParams(updatedParams, 5),
      getTotalShipmentCount(updatedParams),
    ]);

    console.log("Fifth card mySelectedOptions", mySelectedOptions);
  };

  //  UPDATED: Reset Card 1 and all dependent cards to original state
  const resetToOriginalData = () => {
    // console.log("Resetting all cards");

    // ✅ SIMPLE FIX: Set to zero immediately
    setCardValuesTotal(0);
    setTotalShipmentCount(0);

    // Clear all selections
    setCard2Select("");
    setCard3Select("");
    setCard4Select("");
    setCard5Select("");

    setSelectedCard2Items([]);
    setSelectedCard3Items([]);
    setSelectedCard4Items([]);
    setSelectedCard5Items([]);

    if (card1ImportExport === "exporter") {
      setSelectedExporters([]);
    } else {
      setSelectedImporters([]);
    }

    // Reset loading states
    setCard1Loading(false);
    setCard2Loading(false);
    setCard3Loading(false);
    setCard4Loading(false);
    setCard5Loading(false);
  };

  // New helper: call /search-management/getvalue with updatedParams and assign to specific card
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
      portOriginList: updatedParams.portOriginList || [],
      portDestinationList: updatedParams.portDestinationList || [],
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

    return Axios({
      method: "POST",
      url: `/search-management/getvalue`,
      data: JSON.stringify(postData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        // console.log(`getValueForParams response for card${cardNumber}:`, res);
        var valueTotal = res && res.data ? res.data : 0;

        // ✅ FIX: Force state update with functional setState
        setCardValuesTotal((prev) => {
          //  console.log(`Updating card value from ${prev} to ${valueTotal}`);
          return valueTotal;
        });

        //console.log(`Card ${cardNumber} value set:`, valueTotal);
        return { valueTotal };
      })
      .catch((err) => {
        console.error(`getValueForParams error for card${cardNumber}:`, err);
        // ✅ FIX: Also use functional setState for error case
        setCardValuesTotal((prev) => {
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
      portOriginList: updatedParams.portOriginList || [],
      portDestinationList: updatedParams.portDestinationList || [],
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
      countryList: updatedParams.countryList || [],
    };

    return Axios({
      method: "POST",
      url: `/search-management/searchcount`,
      data: JSON.stringify(postData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        var valueshipmentdata = res && res.data ? res.data : 0;
        // console.log("Shipment Count response:", res);

        // ✅ FIX: Force state update with functional setState
        setTotalShipmentCount((prev) => {
          // console.log(`Updating shipment count from ${prev} to ${valueshipmentdata}`);
          return valueshipmentdata;
        });

        return { valueshipmentdata };
      })
      .catch((err) => {
        console.error("Shipment count error:", err);
        // ✅ FIX: Also use functional setState for error case
        setTotalShipmentCount((prev) => {
          // console.log(`Setting shipment count to 0 due to error, previous was ${prev}`);
          return 0;
        });
        return { valueshipmentdata: 0 };
      });
  };

  // Card rendering function
  // Special render function for Card 1 with import/export dropdown
  const RenderFirstCard = () => (
    <div className="col mb-3">
      {/* Import/Export Selection Dropdown */}
      <select
        className="form-select mb-2 form-control"
        value={card1ImportExport}
        onChange={(e) => {
          const newValue = e.target.value;
          setCard1ImportExport(newValue);
          setCard1SearchTerm(""); // Clear search when switching type

          // Clear selections when switching type
          setSelectedExporters([]);
          setSelectedImporters([]);

          // ✅ NEW: Use the independent function for Card 1
        updateMySelectedOptions(1, newValue);

          setCard1Loading(true);
          setCard2Loading(true);
          setCard3Loading(true);
          setCard4Loading(true);
          setCard5Loading(true);

          // Reset all other card selections when changing import/export
          setCard2Select("");
          setCard3Select("");
          setCard4Select("");
          setCard5Select("");

        /*  if (newValue === "exporter") {
            setMySelectedOptions({ ...mySelectedOptions, exporterSelect: 1 });
          } else if (newValue === "importer") {
            setMySelectedOptions({ ...mySelectedOptions, importerSelect: 1 });
          }  */

          // Simulate API call
          setTimeout(() => {
            setCard1Loading(false);
            setCard2Loading(false);
            setCard3Loading(false);
            setCard4Loading(false);
            setCard5Loading(false);
          }, 1500);
        }}
      >
        <option value="importer">Importer</option>
        <option value="exporter">Exporter</option>
      </select>

      <div className="card shadow-sm border-2">
        <div className="card-header bg-primary text-white text-center fw-bold">
          {card1ImportExport === "importer" ? "Importer" : "Exporter"}
        </div>
        <div
          className="card-body"
          style={{ height: "300px", overflowY: "auto", padding: "12px" }}
        >
          {/* Enhanced Search Input */}
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder={`Search ${card1ImportExport}s...`}
              value={card1SearchTerm}
              onChange={(e) => setCard1SearchTerm(e.target.value)}
            />
            {card1SearchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setCard1SearchTerm("")}
                title="Clear search"
              >
                ✖
              </button>
            )}
          </div>

          {/* Show Selected Items Summary */}
          {((card1ImportExport === "exporter" &&
            selectedExporters.length > 0) ||
            (card1ImportExport === "importer" &&
              selectedImporters.length > 0)) && (
            <div className="alert alert-info small p-2 mb-2">
              <strong>Selected:</strong>{" "}
              {card1ImportExport === "exporter"
                ? selectedExporters.length
                : selectedImporters.length}{" "}
              items
              <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => {
                  // console.log("Card 1 Clear All clicked");

                  //  Clear Card 1 selections immediately for UI feedback
                  if (card1ImportExport === "exporter") {
                    setSelectedExporters([]);
                  } else {
                    setSelectedImporters([]);
                  }

                  //  Call resetToOriginalData to handle everything else
                  resetToOriginalData();
                }}
              >
                Clear All
              </button>
            </div>
          )}

          {card1Loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <div className="loader"></div>
            </div>
          ) : (
            (() => {
              const filteredData = getFilteredCardData(
                card1ImportExport,
                card1SearchTerm
              );

              return filteredData.length > 0 ? (
                <>
                  {/* Search Results Info */}
                  {card1SearchTerm && (
                    <div className="text-muted small mb-2">
                      <i className="fas fa-info-circle me-1"></i>
                      Found {filteredData.length} result(s) for "
                      {card1SearchTerm}"
                    </div>
                  )}

                  {/* Filtered Results with Checkboxes */}
                  {filteredData.map((item, i) => {
                    const itemValue =
                      card1ImportExport === "exporter"
                        ? item.exporter_name
                        : item.importer_name;
                    const isSelected =
                      card1ImportExport === "exporter"
                        ? selectedExporters.includes(itemValue)
                        : selectedImporters.includes(itemValue);

                    return (
                      <div className="form-check mb-2 border-bottom" key={i}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`card1-${itemValue}-${i}`}
                          checked={isSelected}
                          onChange={(e) => {
                            if (card1ImportExport === "exporter") {
                              let newSelected;
                              if (e.target.checked) {
                                newSelected = [...selectedExporters, itemValue];
                              } else {
                                newSelected = selectedExporters.filter(
                                  (exp) => exp !== itemValue
                                );
                              }
                              setSelectedExporters(newSelected);
                              // Set loading for all dependent cards when Card 1 changes
                              if (newSelected.length > 0) {
                                setCard2Loading(true);
                                setCard3Loading(true);
                                setCard4Loading(true);
                                setCard5Loading(true);
                              }

                              // ✅ Call API to update dependent data when exporters change
                              // This now handles both selection AND deselection
                              handleSelectionChange(newSelected, "exporter");
                            } else {
                              let newSelected;
                              if (e.target.checked) {
                                newSelected = [...selectedImporters, itemValue];
                              } else {
                                newSelected = selectedImporters.filter(
                                  (imp) => imp !== itemValue
                                );
                              }
                              setSelectedImporters(newSelected);
                              // Set loading for all dependent cards when Card 1 changes
                              if (newSelected.length > 0) {
                                setCard2Loading(true);
                                setCard3Loading(true);
                                setCard4Loading(true);
                                setCard5Loading(true);
                              }

                              // ✅ Call API to update dependent data when importers change
                              // This now handles both selection AND deselection
                              handleSelectionChange(newSelected, "importer");
                            }
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`card1-${itemValue}-${i}`}
                          style={{ fontSize: "16px" }}
                        >
                          {getCardLabel(card1ImportExport, item)}
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : card1SearchTerm ? (
                // No search results
                <div className="text-center text-muted py-4">
                  <i
                    className="fas fa-search"
                    style={{ fontSize: "48px", opacity: 0.3 }}
                  ></i>
                  <div className="mt-2">
                    <strong>No results found</strong>
                  </div>
                  <div className="small">
                    Try adjusting your search term: "{card1SearchTerm}"
                  </div>
                </div>
              ) : (
                // No data available
                <div
                  className="text-muted text-center"
                  style={{
                    marginTop: "100px",
                    fontSize: "70px",
                    fontWeight: "bold",
                  }}
                >
                  +
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );

  //  NEW FUNCTION: Forward-only refresh from specific card
  const forwardRefreshFromCard = async (fromCardIndex) => {
    if (!searchParams) return;

    // Build current params up to the card before the cleared one
    let updatedParams = { ...searchParams };

    // Apply Card 1 (always preserved)
    if (card1ImportExport === "exporter") {
      updatedParams.exporterList = selectedExporters || [];
      updatedParams.importerList = [];
    } else {
      updatedParams.importerList = selectedImporters || [];
      updatedParams.exporterList = [];
    }

    // Apply cards 2-5 only up to the card before the cleared one
    const applyCard = (selectValue, items) => {
      if (!selectValue || !items || items.length === 0) return;
      switch (selectValue) {
        case "hscode":
          updatedParams.hsCodeList = items;
          break;
        case "country":
          updatedParams.countryList = items;
          break;
        case "port":
          updatedParams.portDestinationList = items;
          break;
        case "importer":
          updatedParams.importerList = items;
          break;
        case "exporter":
          updatedParams.exporterList = items;
          break;
      }
    };

    // Apply cards that should remain (before the cleared card)
    if (fromCardIndex >= 3) applyCard(card2Select, selectedCard2Items);
    if (fromCardIndex >= 4) applyCard(card3Select, selectedCard3Items);
    if (fromCardIndex >= 5) applyCard(card4Select, selectedCard4Items);

    setSearchParams(updatedParams);

    // ✅ FIX: Set loading states for all forward cards
    if (fromCardIndex <= 2) setCard2Loading(true);
    if (fromCardIndex <= 3) setCard3Loading(true);
    if (fromCardIndex <= 4) setCard4Loading(true);
    if (fromCardIndex <= 5) setCard5Loading(true);

    props.loadingStart();

    try {
      // Get available options based on current selection state
      const effectiveForward = Object.keys(mySelectedOptions).filter(
        (key) => mySelectedOptions[key] === 0
      );
      const promises = [];

      if (effectiveForward.includes("hscode"))
        promises.push(getHSCodeList(updatedParams));
      if (effectiveForward.includes("country"))
        promises.push(getForeignCountryList(updatedParams));
      if (effectiveForward.includes("port"))
        promises.push(getForeignPortList(updatedParams));
      if (effectiveForward.includes("importer"))
        promises.push(getImporterList(updatedParams));
      if (effectiveForward.includes("exporter"))
        promises.push(getExporterList(updatedParams));

      await Promise.all(promises);
      console.log(`Forward refresh completed from card ${fromCardIndex}`);
    } catch (err) {
      console.error("Error in forward refresh:", err);
    } finally {
      // ✅ FIX: Stop loading for all forward cards after a delay
      setTimeout(() => {
        if (fromCardIndex <= 2) setCard2Loading(false);
        if (fromCardIndex <= 3) setCard3Loading(false);
        if (fromCardIndex <= 4) setCard4Loading(false);
        if (fromCardIndex <= 5) setCard5Loading(false);
        props.loadingStop();
      }, 1500);
    }
  };

  // ✅ Independent function for updating mySelectedOptions state
const updateMySelectedOptions = (cardNumber, type) => {
  setMySelectedOptions(prev => {
    const newOptions = { ...prev };
    
    // Handle Card 1 logic specially - reset everything when Card 1 changes
    if (cardNumber === 1) {
      // Reset all options to 0 first
      Object.keys(newOptions).forEach(key => {
        newOptions[key] = 0;
      });
      
      // Set only the current Card 1 selection to 1
      newOptions[type] = 1;
      
      console.log(`Card 1 changed to ${type} - all other options reset`);
    } else {
      // Cards 2-5: Set current selection and preserve Card 1
      newOptions[type] = 1;
      
      // Reset forward options based on card number (but preserve Card 1)
      const preserveCard1 = ['exporter', 'importer'];
      
      switch (cardNumber) {
        case 2:
          // Card 2: Reset Cards 3, 4, 5 options (but preserve Card 1)
          Object.keys(newOptions).forEach(key => {
            if (key !== type && !preserveCard1.includes(key)) {
              newOptions[key] = 0;
            }
          });
          break;
          
        case 3:
          // Card 3: Keep Card 2 selection, reset Cards 4, 5 options
          Object.keys(newOptions).forEach(key => {
            if (key !== type && !preserveCard1.includes(key)) {
              // Keep Card 2 selection if it exists
              if (key !== card2Select) {
                newOptions[key] = 0;
              }
            }
          });
          break;
          
        case 4:
          // Card 4: Keep Card 2, 3 selections, reset Card 5 options
          Object.keys(newOptions).forEach(key => {
            if (key !== type && !preserveCard1.includes(key)) {
              // Keep Card 2, 3 selections if they exist
              if (key !== card2Select && key !== card3Select) {
                newOptions[key] = 0;
              }
            }
          });
          break;
          
        case 5:
          // Card 5: No forward cards to reset (it's the last card)
          break;
      }
    }
    
    console.log(`Card ${cardNumber} mySelectedOptions updated:`, newOptions);
    console.log('mySelectedOptions',mySelectedOptions)
    return newOptions;
  });
};

  const RenderCard = (
    cardSelect,
    setCardSelect,
    cardIndex,
    cardTitle,
    selectId,
    bodyId,
    loading,
    searchTerm,
    setSearchTerm
  ) => (
    <div className="col mb-3">
      <select
        className="form-select mb-2 form-control"
        value={cardSelect}
        onChange={(e) => {
          const value = e.target.value;
          setCardSelect(value);
          setSearchTerm(""); // Clear search when changing selection
          if (value) {
          // ✅ Use the independent function for dropdown changes
          updateMySelectedOptions(cardIndex, value);
        }

        /*  if (value === "exporter") {
            setMySelectedOptions({ ...mySelectedOptions, exporter: 1 });
          } else if (value === "importer") {
            setMySelectedOptions({ ...mySelectedOptions, importer: 1 });
          } else if (value === "hscode") {
            setMySelectedOptions({ ...mySelectedOptions, hscode: 1 });
          } else if (value === "country") {
            setMySelectedOptions({ ...mySelectedOptions, country: 1 });
          } else if (value === "port") {
            setMySelectedOptions({ ...mySelectedOptions, port: 1 });
          } */
          // Clear selections when changing card type
          if (cardIndex === 2) setSelectedCard2Items([]);
          if (cardIndex === 3) setSelectedCard3Items([]);
          if (cardIndex === 4) setSelectedCard4Items([]);
          if (cardIndex === 5) setSelectedCard5Items([]);

          // Set loading true and fetch data for this card type
          if (cardIndex === 2) setCard2Loading(true);
          if (cardIndex === 3) setCard3Loading(true);
          if (cardIndex === 4) setCard4Loading(true);
          if (cardIndex === 5) setCard5Loading(true);

          // Simulate API call
          setTimeout(() => {
            if (cardIndex === 2) setCard2Loading(false);
            if (cardIndex === 3) setCard3Loading(false);
            if (cardIndex === 4) setCard4Loading(false);
            if (cardIndex === 5) setCard5Loading(false);
          }, 1000);
        }}
        id={selectId}
      >
        <option value="">Select Variable</option>
        <option
          value="hscode"
          disabled={isOptionSelectedElsewhere("hscode", cardIndex)}
        >
          HS Code
        </option>
        <option
          value="port"
          disabled={isOptionSelectedElsewhere("port", cardIndex)}
        >
          Port
        </option>
        <option
          value="country"
          disabled={isOptionSelectedElsewhere("country", cardIndex)}
        >
          Country
        </option>
        <option
          value={card1ImportExport === "importer" ? "exporter" : "importer"}
          disabled={isOptionSelectedElsewhere(
            card1ImportExport === "importer" ? "exporter" : "importer",
            cardIndex
          )}
        >
          {card1ImportExport === "importer" ? "Exporter" : "Importer"}
        </option>
      </select>

      <div className="card shadow-sm border-2">
        <div
          className="card-header bg-primary text-white text-center fw-bold"
          id={`div_title${cardIndex}`}
        >
          {cardSelect
            ? cardSelect.charAt(0).toUpperCase() + cardSelect.slice(1)
            : cardTitle}
        </div>
        <div
          className="card-body"
          style={{ height: "300px", overflowY: "auto", padding: "12px" }}
          id={bodyId}
        >
          {/* Search Input for Cards 2-5 */}
          {cardSelect && (
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${cardSelect}s...`}
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
          )}

          {(() => {
            let selectedItems = [];
            if (cardIndex === 2) selectedItems = selectedCard2Items;
            if (cardIndex === 3) selectedItems = selectedCard3Items;
            if (cardIndex === 4) selectedItems = selectedCard4Items;
            if (cardIndex === 5) selectedItems = selectedCard5Items;

            return (
              selectedItems.length > 0 && (
                <div className="alert alert-info small p-2 mb-2">
                  <strong>Selected:</strong> {selectedItems.length} items
                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => {
                      // ✅ Clear current card and all forward cards (not backward)
                      if (cardIndex === 2) {
                        setSelectedCard2Items([]);
                        setSelectedCard3Items([]);
                        setSelectedCard4Items([]);
                        setSelectedCard5Items([]);
                      } else if (cardIndex === 3) {
                        setSelectedCard3Items([]);
                        setSelectedCard4Items([]);
                        setSelectedCard5Items([]);
                      } else if (cardIndex === 4) {
                        setSelectedCard4Items([]);
                        setSelectedCard5Items([]);
                      } else if (cardIndex === 5) {
                        setSelectedCard5Items([]);
                      }

                      // ✅ Call forward refresh without affecting previous cards
                      forwardRefreshFromCard(cardIndex);
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )
            );
          })()}

          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <div className="loader"></div>
            </div>
          ) : cardSelect ? (
            (() => {
              const filteredData = getFilteredCardData(cardSelect, searchTerm);

              return filteredData.length > 0 ? (
                <>
                  {/* Search Results Info */}
                  {searchTerm && (
                    <div className="text-muted small mb-2">
                      <i className="fas fa-info-circle me-1"></i>
                      Found {filteredData.length} result(s) for "{searchTerm}"
                    </div>
                  )}

                  {/* Filtered Results with Working Checkboxes */}
                  {filteredData.map((item, i) => {
                    // Get current selection state for this card
                    let selectedItems = [];
                    let setSelectedItems = null;

                    if (cardIndex === 2) {
                      selectedItems = selectedCard2Items;
                      setSelectedItems = setSelectedCard2Items;
                    } else if (cardIndex === 3) {
                      selectedItems = selectedCard3Items;
                      setSelectedItems = setSelectedCard3Items;
                    } else if (cardIndex === 4) {
                      selectedItems = selectedCard4Items;
                      setSelectedItems = setSelectedCard4Items;
                    } else if (cardIndex === 5) {
                      selectedItems = selectedCard5Items;
                      setSelectedItems = setSelectedCard5Items;
                    }

                    // Get item value based on card type
                    const getItemValue = (type, item) => {
                      switch (type) {
                        case "hscode":
                          return item.hscode;
                        case "importer":
                          return item.importer_name;
                        case "exporter":
                          return item.exporter_name;
                        case "country":
                          return item.country_name;
                        case "port":
                          return item.port_name;
                        default:
                          return "";
                      }
                    };

                    const itemValue = getItemValue(cardSelect, item);
                    const isSelected = selectedItems
                      ? selectedItems.includes(itemValue)
                      : false;

                    return (
                      <div className="form-check mb-2 border-bottom" key={i}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`card${cardIndex}-item-${i}`}
                          checked={isSelected}
                          onChange={(e) => {
                            //  console.log(`Checkbox clicked for card ${cardIndex}, item: ${itemValue}`);

                            if (!setSelectedItems) return;

                            let newSelected;
                            if (e.target.checked) {
                              newSelected = [...selectedItems, itemValue];
                            } else {
                              newSelected = selectedItems.filter(
                                (sel) => sel !== itemValue
                              );
                            }
                            setSelectedItems(newSelected);

                            // console.log(`Card ${cardIndex} new selection:`, newSelected);

                            // ✅ Call appropriate card function based on cardIndex
                            if (cardIndex === 2) {
                              console.log("Calling handleCard2Change");
                              handleCard2Change(newSelected, cardSelect);
                            } else if (cardIndex === 3) {
                              console.log("Calling handleCard3Change");
                              handleCard3Change(newSelected, cardSelect);
                            } else if (cardIndex === 4) {
                              console.log("Calling handleCard4Change");
                              handleCard4Change(newSelected, cardSelect);
                            } else if (cardIndex === 5) {
                              console.log("Calling handleCard5Change");
                              handleCard5Change(newSelected, cardSelect);
                            }
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`card${cardIndex}-item-${i}`}
                          style={{ fontSize: "16px" }}
                        >
                          {getCardLabel(cardSelect, item)}
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : searchTerm ? (
                // No search results
                <div className="text-center text-muted py-4">
                  <i
                    className="fas fa-search"
                    style={{ fontSize: "48px", opacity: 0.3 }}
                  ></i>
                  <div className="mt-2">
                    <strong>No results found</strong>
                  </div>
                  <div className="small">
                    Try adjusting your search term: "{searchTerm}"
                  </div>
                </div>
              ) : (
                // Show all data when no search term - with same checkbox logic
                getCardApiData(cardSelect).map((item, i) => {
                  let selectedItems = [];
                  let setSelectedItems = null;

                  if (cardIndex === 2) {
                    selectedItems = selectedCard2Items;
                    setSelectedItems = setSelectedCard2Items;
                  } else if (cardIndex === 3) {
                    selectedItems = selectedCard3Items;
                    setSelectedItems = setSelectedCard3Items;
                  } else if (cardIndex === 4) {
                    selectedItems = selectedCard4Items;
                    setSelectedItems = setSelectedCard4Items;
                  } else if (cardIndex === 5) {
                    selectedItems = selectedCard5Items;
                    setSelectedItems = setSelectedCard5Items;
                  }

                  const getItemValue = (type, item) => {
                    switch (type) {
                      case "hscode":
                        return item.hscode;
                      case "importer":
                        return item.importer_name;
                      case "exporter":
                        return item.exporter_name;
                      case "country":
                        return item.country_name;
                      case "port":
                        return item.port_name;
                      default:
                        return "";
                    }
                  };

                  const itemValue = getItemValue(cardSelect, item);
                  const isSelected = selectedItems
                    ? selectedItems.includes(itemValue)
                    : false;

                  return (
                    <div className="form-check mb-2 border-bottom" key={i}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`card${cardIndex}-item-${i}`}
                        checked={isSelected}
                        onChange={(e) => {
                          //  console.log(`Checkbox clicked for card ${cardIndex}, item: ${itemValue}`);

                          if (!setSelectedItems) return;

                          let newSelected;
                          if (e.target.checked) {
                            newSelected = [...selectedItems, itemValue];
                          } else {
                            newSelected = selectedItems.filter(
                              (sel) => sel !== itemValue
                            );
                          }
                          setSelectedItems(newSelected);

                          //  console.log(`Card ${cardIndex} new selection:`, newSelected);

                          // ✅ Call appropriate card function
                          if (cardIndex === 2) {
                            console.log("Calling handleCard2Change");
                            handleCard2Change(newSelected, cardSelect);
                          } else if (cardIndex === 3) {
                            console.log("Calling handleCard3Change");
                            handleCard3Change(newSelected, cardSelect);
                          } else if (cardIndex === 4) {
                            console.log("Calling handleCard4Change");
                            handleCard4Change(newSelected, cardSelect);
                          } else if (cardIndex === 5) {
                            console.log("Calling handleCard5Change");
                            handleCard5Change(newSelected, cardSelect);
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`card${cardIndex}-item-${i}`}
                        style={{ fontSize: "16px" }}
                      >
                        {getCardLabel(cardSelect, item)}
                      </label>
                    </div>
                  );
                })
              );
            })()
          ) : (
            <div
              className="text-muted text-center"
              style={{
                marginTop: "100px",
                fontSize: "70px",
                fontWeight: "bold",
              }}
            >
              +
            </div>
          )}
        </div>
      </div>
    </div>
  );
  /*18/09/2025 */

  /*
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
    */
  /*Checking Working 17/09/2025 */
  /*
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
  ];  */
  /*Checking Working 17/09/2025 */
  /*
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
  */
  /*Checking Working 17/09/2025 */
  /*
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
  */
  /*Checking Working 17/09/2025 */
  /*
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
  */
  /*Checking Working 17/09/2025 */
  /*
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
  */
  /*Checking Working 17/09/2025 */
  /*
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
  ];*/

  const handleModal = (rowData, columns) => {
    setShowModal(true);
    setNewModalColumn(columns);
    setNewModalData(rowData);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

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
    params["queryBuilder"] = values.queryBuilder;

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
  };

  const handleBlur = (e, setFieldValue) => {
    if (e.target.value != "") {
      let newSearchValue = searchValue;
      newSearchValue.push(e.target.value);
      setSearchValue(newSearchValue);
      setFieldValue("searchValue", newSearchValue);

      e.target.value = "";
    }
  };

  const getStdUnitList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/liststdunit`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let icList = [];
        if (res.data.stdUnitList) {
          res.data.stdUnitList.forEach((item) => {
            let specificItem = { value: item.std_unit, label: item.std_unit };
            icList.push(specificItem);
          });
        }
        setStdUnitDataArray(icList);
        props.loadingStop();
      })
      .catch((err) => {
        // console.log("Err");
        setStdUnitDataArray([]);
        props.loadingStop();
      });
  };
  /* IMPORTANT  16/09/2025*/
  const getHSCode4digitList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listhscodes4digit`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let hsList = [];
        if (res.data.hscodesList) {
          res.data.hscodesList.forEach((item) => {
            let specificItem = {
              value: item.hscode,
              label: item.hscode + " [" + item.shipment_count + "]",
            };
            hsList.push(specificItem);
          });
        }
        setHsCode4digitDataArray(hsList);
      })
      .catch((err) => {
        // console.log("Err", err);
        setHsCode4digitDataArray([]);
      });
  };

  const getShipmentModeList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listshipmentmode`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let icList = [];
        if (res.data.shipmentModeList) {
          res.data.shipmentModeList.forEach((item) => {
            let specificItem = { value: item.ship_mode, label: item.ship_mode };
            icList.push(specificItem);
          });
        }
        setShipmentModeDataArray(icList);
      })
      .catch((err) => {
        // console.log("Err");
        setShipmentModeDataArray([]);
      });
  };

  /* IMPORTANT  16/09/2025*/
  const getImporterList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listimporters`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        //  console.log("importer data ============= ", res.data.importersList);
        let importersList = [];
        if (res.data.importersList) {
          res.data.importersList.forEach((item) => {
            let specificItem = {
              value: item.importer_name,
              label: item.importer_name + " [" + item.shipment_count + "]",
            };
            importersList.push(specificItem);
          });
          setImporterDataArray(importersList);
        }

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0;
        let share = 0;
        let shipment_count = 0;
        let value_inr = 0;
        let value_usd = 0;
        let total_quantity = 0;
        let total_share = 0;
        let total_shipment_count = 0;
        let total_value_inr = 0;
        let total_value_usd = 0;

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
        });
        if (res.data.importersList.length >= 10) {
          others = {
            importer_name: "OTHERS",
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
          };
          data.push(others);
        }
        total = {
          importer_name: "TOTAL",
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD,
        };

        data.push(total);
        setImporterDataLT(data);
        //console.log("importer data list ============= ", data );
        setImporterDataList(res.data);
        setPendingImport(false);
      })
      .catch((err) => {
        // console.log("Err");
        setPendingImport(false);
      });
  };
  /*
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
  }  */

  const getTradingCountryList = (params) => {
    props.loadingStart();
    let searchParams = params == "IMPORT" ? "I" : "E";
    AxiosMaster({
      method: "GET",
      url: `masterdata-management/countrylistbytrade/${searchParams}`,
    })
      .then((res) => {
        let countryList = [];
        // if (res.data.countryList) {
        //   res.data.countryList.forEach((item) => {
        //     let specificItem = { "value": item.shortcode, "label": item.name };
        //     countryList.push(specificItem);
        //   })
        // }
        setTradeCountryList(res.data.countryList);
      })
      .catch((err) => {
        setTradeCountryList([]);
      });
  };

  const getExporterList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listexporters`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let exportersList = [];
        if (res.data.exportersList) {
          res.data.exportersList.forEach((item) => {
            let specificItem = {
              value: item.exporter_name,
              label: item.exporter_name + " [" + item.shipment_count + "]",
            };
            exportersList.push(specificItem);
          });
          setExporterDataArray(exportersList);
        }

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0;
        let share = 0;
        let shipment_count = 0;
        let value_inr = 0;
        let value_usd = 0;
        let total_quantity = 0;
        let total_share = 0;
        let total_shipment_count = 0;
        let total_value_inr = 0;
        let total_value_usd = 0;

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
        });
        if (res.data.exportersList.length >= 10) {
          others = {
            exporter_name: "OTHERS",
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
          };

          data.push(others);
        }
        total = {
          exporter_name: "TOTAL",
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD,
        };

        data.push(total);
        setExportertDataLT(data);

        setExporterDataList(res.data);
        setPendingExport(false);
      })
      .catch((err) => {
        // console.log("Err");
        setPendingExport(false);
      });
  };

  const getIndianPortList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listindianports`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let portsList = [];
        if (res.data.portsList) {
          res.data.portsList.forEach((item) => {
            let specificItem = {
              value: item.port_name,
              label: item.port_name + " [" + item.shipment_count + "]",
            };
            portsList.push(specificItem);
          });
        }
        setPortOriginDataArray(portsList);

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0;
        let share = 0;
        let shipment_count = 0;
        let value_inr = 0;
        let value_usd = 0;
        let total_quantity = 0;
        let total_share = 0;
        let total_shipment_count = 0;
        let total_value_inr = 0;
        let total_value_usd = 0;

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
        });
        if (res.data.portsList.length >= 10) {
          others = {
            port_name: "OTHERS",
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
            country: "India",
          };
          data.push(others);
        }
        total = {
          port_name: "TOTAL",
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD,
        };

        data.push(total);
        setIndianPortDataLT(data);

        setIndianPortDataList(res.data);
        setPendingIndPort(false);
      })
      .catch((err) => {
        // console.log("Err");
        setPendingIndPort(false);
      });
  };

  const getForeignPortList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listforeignports`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let portsList = [];
        if (res.data.portsList) {
          res.data.portsList.forEach((item) => {
            let specificItem = {
              value: item.port_name,
              label: item.port_name + "[" + item.shipment_count + "]",
            };
            portsList.push(specificItem);
          });
        }
        setPortDestinationDataArray(portsList);

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0;
        let share = 0;
        let shipment_count = 0;
        let value_inr = 0;
        let value_usd = 0;
        let total_quantity = 0;
        let total_share = 0;
        let total_shipment_count = 0;
        let total_value_inr = 0;
        let total_value_usd = 0;

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
        });
        if (res.data.portsList.length >= 10) {
          others = {
            port_name: "OTHERS",
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
            country: "Foreign",
          };
          data.push(others);
        }
        total = {
          port_name: "TOTAL",
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD,
        };

        data.push(total);
        setForPortDataLT(data);

        setForPortDataList(res.data);
        setPendingForPort(false);
      })
      .catch((err) => {
        // console.log("Err");
        setPendingForPort(false);
      });
  };

  const getHSCodeList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listhscodes`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let hscodesList = [];
        if (res.data.hscodesList) {
          res.data.hscodesList.forEach((item) => {
            let specificItem = {
              value: item.hscode,
              label: item.hscode + " [" + item.shipment_count + "]",
            };
            hscodesList.push(specificItem);
          });
          setHsCodeDataArray(hscodesList);
        }

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0;
        let share = 0;
        let shipment_count = 0;
        let value_inr = 0;
        let value_usd = 0;
        let total_quantity = 0;
        let total_share = 0;
        let total_shipment_count = 0;
        let total_value_inr = 0;
        let total_value_usd = 0;

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
        });
        if (res.data.hscodesList.length >= 10) {
          others = {
            hscode: "OTHERS",
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
          };
          data.push(others);
        }
        total = {
          hscode: "TOTAL",
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD,
        };

        data.push(total);
        setHSCodeDataLT(data);

        setHSCodeDataList(res.data);
        setPendingHSCode(false);
      })
      .catch((err) => {
        // console.log("Err");
        setPendingHSCode(false);
      });
  };

  const getForeignCountryList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listforeigncountries`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let fcList = [];
        if (res.data.countriesList) {
          res.data.countriesList.forEach((item) => {
            let specificItem = {
              value: item.country_name,
              label: item.country_name + " [" + item.shipment_count + "]",
            };
            fcList.push(specificItem);
          });
        }
        setCountryOriginList(fcList);

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0;
        let share = 0;
        let shipment_count = 0;
        let value_inr = 0;
        let value_usd = 0;
        let total_quantity = 0;
        let total_share = 0;
        let total_shipment_count = 0;
        let total_value_inr = 0;
        let total_value_usd = 0;

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
        });
        if (res.data.countriesList.length >= 10) {
          others = {
            country_name: "OTHERS",
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
          };
          data.push(others);
        }
        total = {
          country_name: "TOTAL",
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD,
        };

        data.push(total);
        setCountryDataLT(data);

        setCountryDataList(res.data);
        setPendingCountry(false);
      })
      .catch((err) => {
        // console.log("Err");
        setPendingCountry(false);
      });
  };

  const getCityList = (params) => {
    const postData = {
      searchType: "TRADE",
      tradeType: params.tradeType,
      fromDate: params.fromDate,
      toDate: params.toDate,
      searchBy: params.searchBy,
      searchValue: params.searchValue,
      countryCode: params.countryCode,
      pageNumber: 0,
      numberOfRecords: 20,
      matchType: params.matchType,
      portOriginList: params.portOriginList,
      portDestinationList: params.portDestinationList,
      hsCodeList: params.hsCodeList,
      hsCode4DigitList: params.hsCode4DigitList,
      exporterList: params.exporterList,
      importerList: params.importerList,
      cityOriginList: params.cityOriginList,
      cityDestinationList: params.cityDestinationList,
      searchId: search_id,
      queryBuilder: params.queryBuilder,
      shipModeList: params.shipmentModeList,
      stdUnitList: params.stdUnitList,
    };
    props.loadingStart();
    Axios({
      method: "POST",
      url: `/search-management/listindiancities`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let icList = [];
        if (res.data.citiesList) {
          res.data.citiesList.forEach((item) => {
            let specificItem = {
              value: item.city_name,
              label: item.city_name + " [" + item.shipment_count + "]",
            };
            icList.push(specificItem);
          });
        }
        setCountryDestinationList(icList);

        let data = [];
        let others = {};
        let total = {};
        let quantity = 0;
        let share = 0;
        let shipment_count = 0;
        let value_inr = 0;
        let value_usd = 0;
        let total_quantity = 0;
        let total_share = 0;
        let total_shipment_count = 0;
        let total_value_inr = 0;
        let total_value_usd = 0;

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
        });
        if (res.data.citiesList.length >= 10) {
          others = {
            city_name: "OTHERS",
            quantity: res.data.totalQuantityTop10,
            share: res.data.valueShareTop10,
            shipment_count: res.data.shipmentCountTop10,
            value_inr: res.data.totalValueINRTop10,
            value_usd: res.data.totalValueUSDTop10,
          };
          data.push(others);
        }
        total = {
          city_name: "TOTAL",
          quantity: res.data.totalQuantity,
          share: res.data.valueShare,
          shipment_count: res.data.shipmentCount,
          value_inr: res.data.totalValueINR,
          value_usd: res.data.totalValueUSD,
        };

        data.push(total);
        setCityDataLT(data);

        setCityDataList(res.data);
        setPendingCity(false);
      })
      .catch((err) => {
        // console.log("Err");
        setPendingCity(false);
      });
  };

  useEffect(() => {
    fetchSearchQuery();
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

  /*  const monthWiseLabel = () => {
    let labels = [];
    monthWiseDataList.forEach((item) => {
      labels.push(item.month_name);
    }) 
    return labels;
  }  */
  /*const MonthWiseData = () => {
    let data = [];
    let others = 0;
    monthWiseDataList.forEach((item,index) => {
      data.push(item.value_usd);    
    })
    data.push(others)
    return data;
  }  */

  /*  const importerLabel = () => {
    let labels = [];
    let tempImporterList = Object.assign(importerDataList)
    tempImporterList.importersList.slice(0,10).forEach((item) => {
      labels.push(item.importer_name);
    })
    if(importerDataList.importersList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }  */
  /*  const importerData = () => {
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
  }  */

  /*  const importerDataPie = () => {
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
  }  */

  /*const exporterLabel = () => {

    let labels = [];
    let tempExporterList = Object.assign(exporterDataList)
    tempExporterList.exportersList.slice(0,10).forEach((item,index) => {
      labels.push(item.exporter_name);
    })
    if(exporterDataList.exportersList.length > 10){
      labels.push("Others")
    }  
    return labels;
  } */

  /*const exporterData = () => {
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
  }   */

  /*  const exporterDataPie = () => {
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
  }  */

  /*  const indPortLabel = () => {
    let labels = [];
    let tempIndianPortList = Object.assign(indianPortDataList)
    tempIndianPortList.portsList.slice(0,10).forEach((item) => {
      labels.push(item.port_name);
    })
    if(indianPortDataList.portsList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }  */

  /*  const indPortData = () => {
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
  } */

  /*  const indianPortPie = () => {
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
  }  */

  /*  const forPortLabel = () => {
    let labels = [];
    let tempForPortList = Object.assign(forPortDataList)
    tempForPortList.portsList.slice(0,10).forEach((item) => {
      labels.push(item.port_name);
    })
    if(forPortDataList.portsList.length > 10){
      labels.push("Others")
    }   
    return labels;
  }  */

  /*  const forPortData = () => {
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
  }  */

  /*  const foreignPortPie = () => {
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
  }  */

  /*  const hsCodeLabel = () => {
    let labels = [];
    let tempHsCodeList = Object.assign(hsCodeDataList)
    tempHsCodeList.hscodesList.slice(0,10).forEach((item) => {
      labels.push(item.hscode);
    })
    if(hsCodeDataList.hscodesList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }  */

  /*  const hsCodeData = () => {
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
  }  */
  /*
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
  }  */

  /*  const countryLabel = () => {
    let labels = [];
    let tempCountryList = Object.assign(countryDataList)
    tempCountryList.countriesList.slice(0,10).forEach((item) => {
      labels.push(item.country_name);
    })
    if(countryDataList.countriesList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }  */

  /*  const countryData = () => {
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
  }   */

  /*  const countryDataPie = () => {
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
  }  */

  /*  const cityLabel = () => {
    let labels = [];
    let tempcityList = Object.assign(cityDataList)
    tempcityList.citiesList.slice(0,10).forEach((item) => {
      labels.push(item.city_name);
    })
    if(cityDataList.citiesList.length > 10){
      labels.push("Others")
    }  
    return labels;
  }  */

  /*  const cityData = () => {
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
  }  */
  /*
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
  }  */

  const setMaxMinDate = (text, tradeType) => {
    let tempRow = tradeCountryList.filter((item) =>
      item.shortcode.toLowerCase().includes(text.toLowerCase())
    );
    let fromDate = "";
    let toDate = "";
    if (tradeType == "IMPORT") {
      fromDate = moment(tempRow[0].importFrom).format("MM-DD-YYYY");
      toDate = moment(tempRow[0].importUpto).format("MM-DD-YYYY");
    } else {
      fromDate = moment(tempRow[0].exportFrom).format("MM-DD-YYYY");
      toDate = moment(tempRow[0].exportUpto).format("MM-DD-YYYY");
    }

    setMinDate(new Date(fromDate));
    setMaxDate(new Date(toDate));
  };

  const swalResponse = () => {
    Swal.fire({
      title: "Search !",
      text: "Your Search Limit Exhausted",
      icon: "error",
      dangerMode: true,
      confirmButtonColor: "#3085d6",
    });
  };

  const queryBuilder = (
    values,
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
    Fragment
  ) => {
    return (
      <FieldArray
        name="queryBuilder"
        render={(arrayHelpers) => (
          <Row>
            {values.queryBuilder && values.queryBuilder.length > 0
              ? values.queryBuilder.map((data, index) => (
                  <Fragment key={index}>
                    <div className="col-md-2 pr-0 pb-2">
                      <div className="input-search">
                        <Field
                          name={`queryBuilder[${index}].relation`}
                          component="select"
                          className={`hero__form-input form-control custom-select ${
                            touched.matchType && errors.matchType
                              ? "is-invalid"
                              : ""
                          }`}
                          autoComplete="off"
                          onChange={(event) => {
                            if (props.queryPerDay > 0) {
                              setFieldValue(
                                `queryBuilder[${index}].relation`,
                                event.target.value
                              );
                            } else if (
                              props.queryPerDay <= 0 &&
                              props.queryPerDay != null
                            ) {
                              swalResponse();
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
                          className={`hero__form-input form-control custom-select ${
                            touched.searchBy && errors.searchBy
                              ? "is-invalid"
                              : ""
                          }`}
                          autoComplete="off"
                          onChange={(event) => {
                            if (props.queryPerDay > 0) {
                              event.target.value == "PRODUCT"
                                ? setFieldValue(
                                    `queryBuilder[${index}].matchType`,
                                    "C"
                                  )
                                : setFieldValue(
                                    `queryBuilder[${index}].matchType`,
                                    "L"
                                  );
                              setFieldValue(
                                `queryBuilder[${index}].searchBy`,
                                event.target.value
                              );
                            } else if (
                              props.queryPerDay <= 0 &&
                              props.queryPerDay != null
                            ) {
                              swalResponse();
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
                          className={`hero__form-input form-control custom-select ${
                            touched.matchType && errors.matchType
                              ? "is-invalid"
                              : ""
                          }`}
                          autoComplete="off"
                          onChange={(event) => {
                            if (props.queryPerDay > 0) {
                              setFieldValue(
                                `queryBuilder[${index}].matchType`,
                                event.target.value
                              );
                            } else if (
                              props.queryPerDay <= 0 &&
                              props.queryPerDay != null
                            ) {
                              swalResponse();
                            }
                          }}
                        >
                          <option>Select</option>
                          {values.queryBuilder &&
                          values.queryBuilder.length > 0 &&
                          values.queryBuilder[index].hasOwnProperty(
                            "searchBy"
                          ) &&
                          values.queryBuilder[index].searchBy == "PRODUCT" ? (
                            <option value="C">Contains</option>
                          ) : null}
                          <option value="L">Like</option>
                        </Field>
                      </div>
                    </div>

                    {data && data.searchValue.length > 0 ? (
                      <div className="col-md-6 pr-0 pb-3">
                        <div className="input-search">
                          <FormGroup>
                            <TagsInput
                              value={data.searchValue}
                              name="searchValue"
                              separators={["Enter", "Tab"]}
                              classNames={{ tag: "", input: "" }}
                              placeHolder="Enter search value"
                              disabled={true}
                              onBlur={(e) => {
                                handleBlur(e, setFieldValue);
                              }}
                            />

                            {errors.searchValue && touched.searchValue ? (
                              <span className="errorMsg">
                                {errors.searchValue}
                              </span>
                            ) : null}
                          </FormGroup>
                        </div>
                      </div>
                    ) : null}
                  </Fragment>
                ))
              : null}
          </Row>
        )}
      />
    );
  };
  /*
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
  }    */

  return (
    <>
      <div className="container-fluid">
        <div className="row mb-4 mt-4">
          <div className="col-md-12 list-page mt-3 mb-4">
            <div className="search-top">
              <h5>Select Search Parameters</h5>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validateForm}
                onSubmit={handleSearch}
              >
                {({
                  values,
                  errors,
                  setFieldValue,
                  setFieldError,
                  touched,
                  isValid,
                  handleSubmit,
                  submitForm,
                  setFieldTouched,
                }) => {
                  return (
                    <Form>
                      <div className="row">
                        <div className="col-md-3 pr-0 pb-3">
                          <div className="input-search">
                            <Field
                              name="tradeType"
                              component="select"
                              className={`hero__form-input form-control custom-select ${
                                touched.tradeType && errors.tradeType
                                  ? "is-invalid"
                                  : ""
                              }`}
                              autoComplete="off"
                              value={values.tradeType}
                              disabled={true}
                              onChange={(event) => {
                                setFieldValue("tradeType", event.target.value);
                                setFieldValue("countryCode", "");
                                setFieldValue("fromDate", "");
                                setFieldValue("toDate", "");
                                getTradingCountryList(
                                  event.target.value == "IMPORT" ? "I" : "E"
                                );
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
                              className={`hero__form-input form-control custom-select ${
                                touched.countryCode && errors.countryCode
                                  ? "is-invalid"
                                  : ""
                              }`}
                              autoComplete="off"
                              value={values.countryCode}
                              disabled={true}
                              onChange={(event) => {
                                setFieldValue(
                                  "countryCode",
                                  event.target.value
                                );
                                setFieldValue("fromDate", "");
                                setFieldValue("toDate", "");
                                setMaxMinDate(
                                  event.target.value,
                                  values.tradeType
                                );
                              }}
                            >
                              <option>Select Country</option>
                              {Object.keys(tradeCountryList).map(
                                (item, index) => (
                                  <option
                                    key={index}
                                    value={tradeCountryList[item].shortcode}
                                  >
                                    {tradeCountryList[item].name}
                                  </option>
                                )
                              )}
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
                              <span className="errorMsg">
                                {errors.fromDate}
                              </span>
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
                              className={`hero__form-input form-control custom-select ${
                                touched.searchBy && errors.searchBy
                                  ? "is-invalid"
                                  : ""
                              }`}
                              autoComplete="off"
                              value={values.searchBy}
                              disabled={true}
                              onChange={(event) => {
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
                              className={`hero__form-input form-control custom-select ${
                                touched.matchType && errors.matchType
                                  ? "is-invalid"
                                  : ""
                              }`}
                              autoComplete="off"
                              value={values.matchType}
                              disabled={true}
                              onChange={(event) => {
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
                                separators={["Enter", "Tab"]}
                                classNames={{ tag: "", input: "" }}
                                placeHolder="Enter search value"
                                disabled={true}
                                onBlur={(e) => {
                                  handleBlur(e, setFieldValue);
                                }}
                                onChange={(e) => {
                                  setSearchValue(e);
                                  setFieldValue("searchValue", e);
                                }}
                              />
                              {errors.searchValue && touched.searchValue ? (
                                <span className="errorMsg">
                                  {errors.searchValue}
                                </span>
                              ) : null}
                            </FormGroup>
                          </div>
                        </div>
                      </div>

                      {queryBuilder(
                        values,
                        errors,
                        touched,
                        setFieldTouched,
                        setFieldValue,
                        Fragment
                      )}

                      <div className="row">
                        <div className="col-md-3 pr-0 pb-3">
                          <Link
                            className="btn btn-primary"
                            to={{
                              pathname: "/list1",
                              state: {
                                search_id: search_id,
                                workspace_id: props.location.state
                                  ? props.location.state.workspace_id
                                  : "",
                                workspace_name: props.location.state
                                  ? props.location.state.workspace_name
                                  : "",
                                workspace_desc: props.location.state
                                  ? props.location.state.workspace_desc
                                  : "",
                                workspaceId: props.location.state
                                  ? props.location.state.workspaceId
                                  : "",
                                columnKeys: props.location.state
                                  ? props.location.state.columnKeys
                                  : "",
                              },
                            }}
                          >
                            Back to List
                          </Link>
                        </div>
                      </div>
                    </Form>
                  );
                }}
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
            {/* <button
          className={`btn w-100 py-3 ${
            active === "exporter" ? "btn-warning" : "btn-primary"
          }`}
          onClick={() => setActive("exporter")}
        >
          Loream Ipsume 1
        </button> */}

            <Link
              className={`btn w-100 py-3 ${
                active === "exporter" ? "btn-warning" : "btn-primary"
              }`}
              to={{
                pathname: "/relativePerformance",
                state: {
                  search_id: search_id,
                  importerForExport: props.location.state
                    ? props.location.state.importerForExport
                    : null,
                  exporterForImport: props.location.state
                    ? props.location.state.exporterForImport
                    : null,
                },
              }}
            >
              {" "}
              Relative Performance{" "}
            </Link>
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

            {/* <Link  className={`btn w-100 py-3 ${
            active === "exporter" ? "btn-warning" : "btn-primary"
          }`} to={{
                  pathname: "/indepthTest",
                  state: {
                  search_id: search_id,
                  importerForExport: props.location.state ? props.location.state.importerForExport : null,
                  exporterForImport: props.location.state ? props.location.state.exporterForImport : null
                  },
              }}> Loream Performance </Link> */}
          </div>
        </div>

        <div className="d-flex justify-content-center gap-5 mb-4">
          {/* Value */}
          <div className="d-flex align-items-center gap-4">
            <h5 className="mb-0">Value </h5>&nbsp;&nbsp;&nbsp;&nbsp;
            <button className="btn btn-outline-dark fw-bold shadow-sm px-3">
              $
              {cardValuesTotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </button>
          </div>
          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
          {/* Shipment */}
          <div className="d-flex align-items-center gap-4">
            <h5 className="mb-0">Shipment </h5>&nbsp;&nbsp;&nbsp;&nbsp;
            <button className="btn btn-outline-primary fw-bold shadow-sm px-3">
              {totalShipmentCount.toLocaleString()}
            </button>
          </div>
        </div>

        <div className="row mb-4">
          {/* Card 1 - Dynamic Import/Export */}
          {RenderFirstCard()}

          {/* Card 2 */}
          {RenderCard(
            card2Select,
            setCard2Select,
            2,
            "Select Variable",
            "select2",
            "div_body2",
            card2Loading,
            card2SearchTerm,
            setCard2SearchTerm
          )}

          {/* Card 3 */}
          {RenderCard(
            card3Select,
            setCard3Select,
            3,
            "Select Variable",
            "select3",
            "div_body3",
            card3Loading,
            card3SearchTerm,
            setCard3SearchTerm
          )}

          {/* Card 4 */}
          {RenderCard(
            card4Select,
            setCard4Select,
            4,
            "Select Variable",
            "select4",
            "div_body4",
            card4Loading,
            card4SearchTerm,
            setCard4SearchTerm
          )}

          {/* Card 5 */}
          {RenderCard(
            card5Select,
            setCard5Select,
            5,
            "Select Variable",
            "select5",
            "div_body5",
            card5Loading,
            card5SearchTerm,
            setCard5SearchTerm
          )}
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
                const payload = buildFinalParams();
                console.log("Indepth payload:", payload); // useful while debugging
                setIndepthParams(payload);
                setShowTable(true);
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
            onRowClick={(row) => {
              console.log("row clicked", row);
            }}
          />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loader.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadingStart: () => dispatch(loaderStart()),
    loadingStop: () => dispatch(loaderStop()),
    setSearchQuery: (data) => dispatch(setSearchQuery(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Analysis)
);
