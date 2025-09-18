import React, { useState, useRef, useCallback, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
// import { DatePicker, Space } from 'antd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css'
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
// import beData from "../assets/data/IMP-BE2.json";
import moment from 'moment';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Axios from '../shared/Axios';
import { Field, Formik, Form, FieldArray } from 'formik';
import { Button, Modal, FormGroup } from 'react-bootstrap';
import * as Yup from "yup";
import DataTableImport from '../components/DataTableImport';
import DataTableExport from '../components/DataTableExport';
import AdvanceSearch from '../components/AdvanceSearch';
import Swal from 'sweetalert2';
import AxiosACT from "../shared/AxiosACT";
import AxiosMaster from "../shared/AxiosMaster";
import AxiosUser from "../shared/AxiosUser";
import Select, { components } from 'react-select';
import Creatable from 'react-select/creatable';
// import { TagsInput } from "react-tag-input-component";
// import ReactTags from "react-tag-autocomplete";
import {
  checkGreaterTimes,
  checkGreaterStartEndTimes
} from "../shared/validationFunctions";
import Draggable from 'react-draggable';
import { loaderStart, loaderStop } from "../store/actions/loader";
import { updateSubscriptionCount, updateDownloadArrayCount, setDloadCountSubuser } from "../store/actions/data"
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import DloadTemplateXLS from '../components/DloadTemplateXLS'
import { testJson } from '../shared/JSONString'
import LoginCheck from '../shared/LoginCheck';

let initialValues = {
  tradeType: "",
  searchBy: "",
  searchValue: "",
  countryCode: "",
  fromDate: "",
  toDate: "",
  matchType: "",
  dateRange: "",
  searchFlag: false,
  queryBuilder: [],
  SearchQueryCount: 0,
  isMainSearch: false
};

const dateFormat = "YYYY-MM-DD";
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)
// const columnOptions = ['Date', 'HSCODE', 'Product Description', 'Value', 'Quantity', 'Unit', 'Port Of Destination', 'Foreign Country', 'Indian Company Name', 'Foreign Company Name']



let defaultCountry = []

const validateForm = Yup.object().shape({
  tradeType: Yup.string().required("Please select trade type"),
  searchBy: Yup.string().required("This field is required"),
  matchType: Yup.string().required("This field is required"),
  dateRange: Yup.string().required("This field is required"),

  //   searchValue: Yup.mixed().when(['searchBy'], {
  //     is: (searchBy) => (searchBy == 'HS_CODE'),
  //     then: Yup.array().of(Yup.string()
  //     .matches(/^[0-9]*$/, function() {
  //       return "Enter valid number"
  //     }))
  //     .required('Required'),
  //     otherwise: Yup.array().of(Yup.string().matches(/^[A-Za-z0-9-_\s]*$/, function() {
  //       return "Enter valid input"
  //     })).required('Required')
  // }),
  countryCode: Yup.string().required("This field is required"),
  fromDate: Yup.date().required("This field is required")
    .test(
      "checkGreaterStartEndTimes",
      "From date should be less than To date",
      function (value) {
        if (value) {
          return checkGreaterStartEndTimes(value, this.parent.toDate);
        }
        return true;
      }
    ),
  toDate: Yup.date().required("This field is required")
    .test(
      "checkGreaterStartEndTimes",
      "To date should be greater than From date",
      function (value) {
        if (value) {
          return checkGreaterStartEndTimes(this.parent.fromDate, value);
        }
        return true;
      }
    )
    .test(
      "checkGreaterTimes",
      "To date should be less than 3 years",
      function (value) {
        if (value) {
          return checkGreaterTimes(this.parent.fromDate, value);
        }
        return true;
      }
    ),
});



const List = (props) => {

  const userId = localStorage.getItem("userToken");
  const user = localStorage.getItem("user");
  const loggedUser = user ? JSON.parse(user) : {};
  const userName = `${loggedUser.firstname} ${loggedUser.lastname}`;
  const userEmail = loggedUser.email;
  const userId_new = loggedUser.uplineId > 0 ? loggedUser.uplineId : loggedUser.userid

  const history = useHistory();
  const search_id = props.location.state ? props.location.state.search_id : null;

  // console.log("props ==== ", props)
  const workspace_id = props.location.state && props.location.state.workspace_id ? props.location.state.workspace_id : "";
  const workspace_name = props.location.state ? props.location.state.workspace_name : "";
  const workspace_desc = props.location.state ? props.location.state.workspace_desc : "";
  const workspaceId = props.location.state ? props.location.state.workspaceId : "";
  const newSearch = [{ "value": props && props.location.state && props.location.state.searchValue, "label": props && props.location.state && props.location.state.searchValue }];


  const gridRef = useRef();

  const [toggle, setToggle] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(initialValues.searchValue);
  const [importerList, setImporterList] = useState([]);
  const [importerDataList, setImporterDataList] = useState([]);
  const [exporterList, setExporterList] = useState([]);
  const [exporterDataList, setExporterDataList] = useState([]);
  const [portOriginList, setPortOriginList] = useState([]);
  const [portOriginDataList, setPortOriginDataList] = useState([]);
  const [portDestinationDataList, setPortDestinationDataList] = useState([]);
  const [portDestinationList, setPortDestinationList] = useState([]);
  const [countryOriginList, setCountryOriginList] = useState([]);
  const [countryDestinationList, setCountryDestinationList] = useState([]);
  const [hsCodeList, setHsCodeList] = useState([]);
  const [hsCodeDataList, setHsCodeDataList] = useState([]);
  const [cityOriginList, setCityOriginList] = useState([]);
  const [cityDestinationList, setCityDestinationList] = useState([]);
  const [searchId, setSearchId] = useState();
  const [orderByColumn, setOrderByColumn] = useState("");
  const [orderByMode, setOrderByMode] = useState("desc");
  const [hscodeLoading, isHscodeLoading] = useState(false);
  const [portDestLoading, isPortDestLoading] = useState(false);
  const [coLoading, isCoLoading] = useState(false);
  const [importerLoading, isImporterLoading] = useState(false);
  const [exporterLoading, isExporterLoading] = useState(false);
  const [totalRecordLoading, isTotalRecordLoading] = useState(false);

  const [shipmentModeDataList, setShipmentModeDataList] = useState([]);
  const [shipmentModeList, setShipmentModeList] = useState([]);
  const [hsCode4DigitList, setHsCode4digitList] = useState([])
  const [hsCode4digitDataList, setHsCode4digitDataList] = useState([])
  const [filteredColumn, setFilteredColumn] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [queryBuilderSuggestions, setQueryBuilderSuggestions] = useState([])
  const [isDownloaded, setIsDownloaded] = useState("");
  const [noDataErrorMsg, setNoDataErrorMsg] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(true);
  const [previousTotalRecordCount, setPreviousTotalRecordCount] = useState(0);
  const [stdUnitDataList, setStdUnitDataList] = useState([]);
  const [stdUnitList, setStdUnitList] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [importerForExport, setImporterForExport] = useState("");
  const [exporterForImport, setExporterForImport] = useState("");
  const [returnSearchId, setReturnSearchId] = useState([]);

  // const [fieldArray , setFieldArray] = useState([])



  const sTitleRef = useRef();
  const sDescRef = useRef();
  const workspaceRef = useRef();
  const sWorkspaceRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [tradeType, setTradeType] = useState("");
  const [sTitleError, isSTitleError] = useState("");
  const [sDescError, isSDescError] = useState("");
  const [sNewWsError, isNewWsError] = useState("");
  const [wsError, isWsError] = useState("");
  const [workspaceList, setWorkspaceList] = useState([]);
  const [tradeCountryList, setTradeCountryList] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [queryBuilderSearchValue, setQueryBuilderSearchValue] = useState([]);
  const [showNewWorkspaceInput, setshowNewWorkspaceInput] = useState(false);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [filteredArray, setFilteredArray] = useState([]);
  const [countryWeightage, setCountryWeightage] = useState(1);


  const toggleModal = () => {
    setShowModal(!showModal);
    isSTitleError("");
    isSDescError("");
    isNewWsError("");
    isWsError("")
  }



  const UpdateSubscription = (params) => {

    AxiosUser({
      method: "PUT",
      url: `user-management/user-subscription/update/${props.subscriptionId}`,
      data: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log("user", res.data);
      })
      .catch(err => {
        // console.log("Err", err);
        let errorMsg = "Somethhing went wrong, please try again."
      });

  }

  useEffect(() => {
    LoginCheck(history)
  }, [props.loading, searchValue, workspaceList, searchLoading])

  const UpdateUser = (params) => {

    AxiosUser({
      method: "PUT",
      url: `user-management/user/${userId}`,
      data: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log("user", res.data);
      })
      .catch(err => {
        // console.log("Err", err);
        let errorMsg = "Somethhing went wrong, please try again."
      });

  }

  const UpdateDownloadTracher = (prevDownloadArray) => {

    let DownloadArray = props.downloadArray

    const params = {
      "userId": userId_new,
      "downloadedRecords": prevDownloadArray
    }

    AxiosACT({
      method: "POST",
      url: "/activity-management/download-tracker/update",
      data: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log("user", res.data);
      })
      .catch(err => {
        // console.log("Err", err);
        let errorMsg = "Somethhing went wrong, please try again."
      });

  }

  const setWorkspace = (val) => {
    if (props.totalWorkspace > 0) {
      Swal.fire({
        title: 'Create Workspace !',
        text: `Available Limit ${props.totalWorkspace}. \n Are you sure you want to Create New Workspace ?`,
        icon: 'warning',
        dangerMode: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((isConfirm) => {
        if (isConfirm.value) {
          setShowModal(val)
        }
      })
    }
    else {
      Swal.fire({
        title: 'Create Workspace !',
        text: "Your Workspace Limit Exhausted",
        icon: 'error',
        dangerMode: true,
        confirmButtonColor: '#3085d6',
      }).then((isConfirm) => { })
    }
  }


  const saveQuery = () => {
    const postData = {
      "workspace_id": workspace_id,
      "search_id": searchId,
      "name": workspace_name,
      "description": workspace_desc,
      "is_active": "Y",
      "id": workspaceId
    }
    AxiosACT({
      method: "POST",
      url: `/activity-management/workspace/savesearch`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        Swal.fire({
          title: 'Success',
          text: "Search query saved successfully",
          icon: 'success',
        })
      })
      .catch(err => {
        let errorMsg = "Somethhing went wrong, please try again."
        if (err.data.errorMsg) {
          errorMsg = err.data.errorMsg;
        }
        Swal.fire({
          title: 'Oops!',
          text: errorMsg,
          icon: 'error',
        })
      });
  }

  const handleWorkspaceChange = (e) => {
    if (e.target.value == "newWorkspace") {
      setshowNewWorkspaceInput(true)
    }
    else setshowNewWorkspaceInput(false)
  }

  useEffect(() => {
    return () => {
      initialValues = {}
    }
  }, [])

  useEffect(() => {

    if (searchParams && searchParams.tradeType) {
      getPaginationSearchData(searchParams);
    }
    if (props && props.location.state && props.location.state.searchValue) {
      setSearchValue(newSearch)
    };

    initialValues = {
      ...initialValues,
      tradeType: props && props.location.state && props.location.state.tradeType ? props.location.state.tradeType : "",
      matchType: "",
      searchBy: props && props.location.state && props.location.state.searchType ? props.location.state.searchType : "",
      searchValue: props && props.location.state && props.location.state.searchType,
      countryCode: props && props.location.state && props.location.state.countryCode,
      fromDate: "",
      toDate: "",
      dateRange: "",
      queryBuilder: []
    };
    if (props && props.location.state && props.location.state.tradeType) {
      getTradingCountryList(props && props.location.state && props.location.state.tradeType == "IMPORT" ? "I" : "E")
    }

  }, [page, limit, orderByColumn, orderByMode])


  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };



  const mainSearch = (values) => {

    if (values.searchValue && values.searchValue.length > 0) {
      setIsSearchClicked(true)
      setPortOriginList([])
      setPortDestinationList([])
      setHsCodeList([])
      setHsCode4digitList([])
      setImporterList([])
      setExporterList([])
      setCityOriginList([])
      setCityDestinationList([])
      setShipmentModeList([])
      setStdUnitList([])
      values.isMainSearch = true
      // console.log("Submit values ==== ", values)
      let checkValidErr = false
      let errMsg = ""
      if (values.searchBy == "HS_CODE") {
        values.searchValue.map((item, index) => {
          if (item.length < 4) {
            checkValidErr = true
            errMsg = "Search Values should be greater than or equal to 4 digits"
          }
        })
      }
      else {
        values.searchValue.map((item, index) => {
          if (item.length < 2) {
            checkValidErr = true
            errMsg = "Search Values should be greater than or equal to 2 digits"
          }
        })
      }

      if (values.queryBuilder.length > 0) {
        values.queryBuilder.map((item, index) => {
          if (item.searchBy == "HS_CODE") {
            item.searchValue.length > 0 && item.searchValue.map((subitem, index) => {
              if (subitem.length < 4) {
                checkValidErr = true
                errMsg = "Search Values should be greater than or equal to 4 digits"
              }
            })
          }
          else {
            item.searchValue.length > 0 && item.searchValue.map((subitem, index) => {
              if (subitem.length < 2) {
                checkValidErr = true
                errMsg = "Search Values should be greater than or equal to 2 digits"
              }
            })
          }
        })
      }

      if (checkValidErr == true) {
        Swal.fire({
          title: 'Alert !',
          text: errMsg,
          icon: 'error',
          dangerMode: true,
          confirmButtonColor: '#3085d6',
        })
      }
      else {
        props.loadingStart()
        handleSearch(values)
      }

    }
    else {
      Swal.fire({
        title: 'Alert !',
        text: "Enter Search Values",
        icon: 'error',
        dangerMode: true,
        confirmButtonColor: '#3085d6',
      })
    }

  }

  const handleSearch = (values, countryList = []) => {

    setIsDownloaded("N")

    props.loadingStart()
    var params = [];
    params["tradeType"] = values.tradeType;
    params["searchBy"] = values.searchBy;
    params["searchValue"] = values.searchValue;
    params["countryCode"] = values.countryCode;;
    params["fromDate"] = moment(values.fromDate).format("YYYY-MM-DD");
    params["toDate"] = moment(values.toDate).format("YYYY-MM-DD");
    params["matchType"] = values.matchType;
    params["searchFlag"] = values.searchFlag;
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
    params["isMainSearch"] = values.isMainSearch;

    setSearchParams(params);
    let lp = {
      "tradeType": values.tradeType, "searchBy": values.searchBy, "searchValue": values.searchValue, "countryCode": values.countryCode,
      "fromDate": moment(values.fromDate).format("YYYY-MM-DD"), "toDate": moment(values.toDate).format("YYYY-MM-DD"), "matchType": values.matchType
    }
    localStorage.setItem("searchParam", JSON.stringify(lp));

    if (searchId != "") {
      setFilteredColumn([])
      getSearchData(params, countryList);

      // commented 05.04.2024

      // getImporterList(params);
      // getExporterList(params);
      // getPortOriginList(params);
      // getPortDestinationList(params);
      // getHSCodeList(params);
      // getIndianCityList(params);
      // getForeignCountryList(params);
      // getHSCode4digitList(params);
      // getShipmentModeList(params);
      // getStdUnitList(params);
    }
    else {
      if (props.queryPerDay > 0) {
        getSearchData(params);

        // commented 05.04.2024

        // getImporterList(params);
        // getExporterList(params);
        // getPortOriginList(params);
        // getPortDestinationList(params);
        // getHSCodeList(params);
        // getIndianCityList(params);
        // getForeignCountryList(params);
        // getHSCode4digitList(params);
        // getShipmentModeList(params);
        // getStdUnitList(params);
      }
      else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
        props.loadingStop()
        Swal.fire({
          title: 'Search !',
          text: "Your Search Limit Exhausted",
          icon: 'error',
          dangerMode: true,
          confirmButtonColor: '#3085d6',
        }).then((isConfirm) => {
          // getImporterList(params);
          // getExporterList(params);
          // getPortOriginList(params);
          // getPortDestinationList(params);
          // getHSCodeList(params);
          // getIndianCityList(params);
          // getForeignCountryList(params);
          // getHSCode4digitList(params);
          // getShipmentModeList(params);
        })
      }
    }

  }


  const resetSearch = (setFieldValue, values) => {
    setSearchParams([]);
    setSearchResult([]);
    setSearchValue([]);
    setQueryBuilderSearchValue([])
    setFieldValue("fromDate", "")
    setFieldValue("toDate", "")
    setFieldValue("searchValue", []);
    setFieldValue("countryCode", "");
    setFieldValue("matchType", "");
    setFieldValue("searchBy", "");
    setFieldValue("tradeType", "");
    setFieldValue("dateRange", "");
    setFilteredColumn([]);
    setTotalRecord(0);
    values.tradeType = ""
    values.searchBy = ""
    values.matchType = ""
    values.countryCode = ""
    values.searchValue = ""
    values.toDate = ""
    values.fromDate = ""
    values.dateRange = ""

    setImporterDataList([]);
    setExporterDataList([]);
    setPortOriginDataList([]);
    setPortDestinationDataList([]);
    setHsCodeDataList([]);
    setHsCode4digitDataList([]);
    setCountryOriginList([]);
    setCountryDestinationList([]);
    setShipmentModeDataList([]);
    setStdUnitDataList([]);

    localStorage.removeItem("searchParam");
    setSearchId("");
    setCountryCode("")
    console.log("values === ", values)
    //  window.resetFilter()
  }


  const exportToCSV = () => {
    if (totalRecord * countryWeightage <= props.maxDownload) {
      if (searchParams && searchParams.tradeType) {
        const postData = {
          "searchType": "TRADE",
          "tradeType": searchParams.tradeType,
          "fromDate": searchParams.fromDate,
          "toDate": searchParams.toDate,
          "searchBy": searchParams.searchBy,
          "searchValue": searchParams.searchValue,
          "countryCode": searchParams.countryCode,
          "pageNumber": 0,
          "numberOfRecords": Math.round(props.maxDownload / countryWeightage),
          "searchId": "",
          "hsCodeList": hsCodeList,
          "exporterList": exporterList,
          "importerList": importerList,
          "cityOriginList": cityOriginList,
          "cityDestinationList": cityDestinationList,
          "portOriginList": portOriginList,
          "portDestinationList": portDestinationList,
          "orderByColumn": orderByColumn,
          "orderByMode": orderByMode,
          "matchType": searchParams.matchType,
          "hsCode4DigitList": hsCode4DigitList,
          "queryBuilder": searchParams.queryBuilder,
          "shipModeList": shipmentModeList,
          "stdUnitList": stdUnitList

        }
        Axios({
          method: "POST",
          url: `search-management/search`,
          data: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            let exportDataSet = [];
            if (searchParams.tradeType.toLowerCase() === "export" && searchParams.countryCode.toUpperCase() != "IND" && searchParams.countryCode.toUpperCase() != "SEZ") {
              exportDataSet = res.data.expForeignList
            }
            else if (searchParams.tradeType.toLowerCase() === "export" && searchParams.countryCode.toUpperCase() === "IND") {
              exportDataSet = res.data.expIndList
            }
            else if (searchParams.tradeType.toLowerCase() === "import" && searchParams.countryCode.toUpperCase() != "IND" && searchParams.countryCode.toUpperCase() != "SEZ") {
              exportDataSet = res.data.impForeignList
            }
            else if (searchParams.tradeType.toLowerCase() === "import" && searchParams.countryCode.toUpperCase() === "IND") {
              exportDataSet = res.data.impIndList
            }
            else if (searchParams.tradeType.toLowerCase() === "import" && searchParams.countryCode.toUpperCase() === "SEZ") {
              exportDataSet = res.data.impIndList
            }
            else if (searchParams.tradeType.toLowerCase() === "export" && searchParams.countryCode.toUpperCase() === "SEZ") {
              exportDataSet = res.data.expIndList
            }
            else {
              exportDataSet = []
            }

            let filteredArray = []
            const d = new Date();
            for (let i = 0; i < exportDataSet.length; i++) {
              let filtered = {};
              let obj = exportDataSet[i];
              // if(testJson.includes(obj["id"])){
              for (let key in obj) {
                if (typeof (obj[key] == "object")) {
                  let item = obj[key];
                  if (item != null) {
                    filtered[key] = obj[key];
                  }
                }
              }
              // }
              // else{ console.log("Download values Not found ========= ", obj["id"])}

              filteredArray.push(filtered);
            }
            setFilteredArray(filteredArray)
            // setTimeout(downloadXLS(searchParams,totalRecord,1), 5000)
            downloadXLS(searchParams, 1, filteredArray)


          })
          .catch(err => {
            // console.log("Err == ", err);
            setSearchLoading(false);
          });
      } else {
        Swal.fire({
          title: 'Alert!',
          text: 'Please Search data first, then export',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }
    else {
      Swal.fire({
        title: 'Alert!',
        text: `You cannot download more than ${Math.round(props.maxDownload / countryWeightage)} records in a single search. Please refine your search criteria.`,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  };

  const exportSelectedToCSV = (checkedRowID) => {
    let remainingDload = props.download_count - checkedRowID.length
    let exportDataSet = [];
    let filteredArray = []

    searchResult.map((item, index) => {
      checkedRowID.map((subItem, subIndex) => {
        if (item.id == subItem) {
          exportDataSet.push(item)
        }
      })
    })

    for (let i = 0; i < exportDataSet.length; i++) {
      let filtered = {};
      let obj = exportDataSet[i];
      for (let key in obj) {
        if (typeof (obj[key] == "object")) {
          let item = obj[key];
          if (item != null) {
            filtered[key] = obj[key];
          }
        }
      }
      filteredArray.push(filtered);
    }
    setFilteredArray(filteredArray)
    downloadXLS(searchParams, 2, filteredArray)

  };

  const downloadXLS = (searchParams, dloadType, filteredArray) => {

    let prevDownloadArray = []
    let newIDArray = []
    prevDownloadArray = JSON.parse(JSON.stringify(props.downloadArray))


    for (let i = 0; i < filteredArray.length; i++) {

      let obj = filteredArray[i];
      if (!prevDownloadArray.includes(obj["id"])) {
        newIDArray.push(obj["id"]);
        prevDownloadArray.push(obj["id"])
      }
      else { console.log("Download values found ========= ", obj["id"]) }
    }

    let remainingDload = props.download_count - newIDArray.length * countryWeightage
    let remainingDload_subUser = props.download_count_subUser - filteredArray.length * countryWeightage
    console.log("remainingDload ======= ", remainingDload)
    if (remainingDload > 0) {
      if ((loggedUser.uplineId > 0 && remainingDload_subUser > 0) || (loggedUser.uplineId == 0)) {
        Swal.fire({
          title: 'Download!',
          html: `One row is equal to <b>${countryWeightage}</b> points. <br>Available Download <b>${loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count}</b>. <br> Total Record to Download <b>${loggedUser.uplineId > 0 ? filteredArray.length : newIDArray.length}</b>. 
        <br> Total Points to deduct <b>${loggedUser.uplineId > 0 ? filteredArray.length * countryWeightage : newIDArray.length * countryWeightage}</b>.<br> Remaining Download <b>${loggedUser.uplineId > 0 ? remainingDload_subUser : remainingDload}</b>. <br> Are you sure you want to Download ?`,
          icon: 'warning',
          dangerMode: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((isConfirm) => {
          if (isConfirm.value) {

            const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";
            const fileName = searchParams.tradeType + "_" + searchParams.countryCode + "_" + searchParams.fromDate + "_" + searchParams.toDate;
            // const ws = XLSX.utils.json_to_sheet(filteredArray);

            const ws = XLSX.utils.table_to_sheet(document.getElementById("reportXLS"), { header: 1 });

            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
            setSearchLoading(false);

            loggedUser.uplineId > 0 ?
              props.setDloadCountSubuser({ download_count_subUser: remainingDload_subUser }) :
              props.updateSubscriptionCount({
                download_count: remainingDload,
                subscriptionId: props.subscriptionId,
                dataAccess_count: props.dataAccess_count,
                subUserCount: props.subUserCount,
                totalWorkspace: props.totalWorkspace,
                queryPerDay: props.queryPerDay
              })

            if (newIDArray.length > 0) {
              props.updateDownloadArrayCount(
                {
                  downloadArray: prevDownloadArray
                })
            }

            UpdateSubscription({ "downloadLimit": remainingDload })
            if (loggedUser.uplineId > 0) {
              UpdateUser({ "downloadLimit": remainingDload_subUser })
            }
            UpdateDownloadTracher(prevDownloadArray)
            downloadSearch(searchId, filteredArray.length)
          }

        })
      }
      else {
        Swal.fire({
          title: 'Download!',
          text: "Your Download Limit Exhausted",
          icon: 'error',
          dangerMode: true,
          confirmButtonColor: '#3085d6',
        }).then((isConfirm) => { })
      }
    }
    else {
      Swal.fire({
        title: 'Download!',
        text: "Your Download Limit Exhausted",
        icon: 'error',
        dangerMode: true,
        confirmButtonColor: '#3085d6',
      }).then((isConfirm) => { })
    }


  }

  const getSearchData = (params, countryList = []) => {
    // console.log("params ---------- ", params)
    scrollToRef(gridRef);
    setSearchLoading(true);
    isTotalRecordLoading(true)
    let updatedCountryList = tradeCountryList && tradeCountryList.length == 0 ? countryList : tradeCountryList
    let selectedCountry = updatedCountryList.filter((item) => item.shortcode == (countryCode ? countryCode : params.countryCode))
    //  console.log("params ======= ", countryCode)

    params["tradeType"] == "E" || params["tradeType"] == "EXPORT" ? setCountryWeightage(selectedCountry[0].exportPointWeightage) : setCountryWeightage(selectedCountry[0].importPointWeightage)

    console.log("selectedCountry.exportPointWeightage ========= ", selectedCountry[0].exportPointWeightage)
    let tempSearchResult = []
    // "searchId": searchId,
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
      "numberOfRecords": limit,
      "hsCodeList": params.hsCodeList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "orderByColumn": orderByColumn,
      "orderByMode": orderByMode,
      "hsCode4DigitList": params.hsCode4DigitList,
      "matchType": params.matchType,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList

    }
    console.log("params.returnSearchId === ", workspace_id)
    if (params.returnSearchId) {
      postData["searchId"] = params.returnSearchId
    }
    if (search_id && (workspace_id == undefined || workspace_id == "")) {
      if (!params.isMainSearch) {
        postData["searchId"] = search_id
      }
    }

    Axios({
      method: "POST",
      url: `search-management/search`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() != "IND" && params.countryCode.toUpperCase() != "SEZ") {
          tempSearchResult = res.data.expForeignList
        }
        else if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() === "IND") {
          tempSearchResult = res.data.expIndList
        }
        else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() != "IND" && params.countryCode.toUpperCase() != "SEZ") {
          tempSearchResult = res.data.impForeignList
        }
        else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() === "IND") {
          tempSearchResult = res.data.impIndList
        }
        else if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() === "SEZ") {
          tempSearchResult = res.data.expIndList
        }
        else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() === "SEZ") {
          tempSearchResult = res.data.impIndList
        }
        else {
          tempSearchResult = []
        }

        if (tempSearchResult && tempSearchResult.length > 0) {

          setSearchResult(tempSearchResult);
          setNoDataErrorMsg(false)
          getTotalCount(params, res.data.searchId);
          // console.log("props.location.state.columnKeys", props.location.state)
          let filteredColumn = []
          let objColumns = Object.keys(tempSearchResult[0]);
          for (var x in objColumns) {
            //  console.log("objColumns ==== ", objColumns)
            if (tempSearchResult[0][objColumns[x]] != null) {
              filteredColumn.push(objColumns[x]);
            }
          }
          setFilteredColumn(filteredColumn)

          setSearchId(res.data.searchId)
          if (params.searchFlag == true && orderByColumn == "") {
            props.updateSubscriptionCount({
              download_count: props.download_count,
              subscriptionId: props.subscriptionId,
              dataAccess_count: props.dataAccess_count,
              totalWorkspace: props.totalWorkspace,
              subUserCount: props.subUserCount,
              queryPerDay: props.queryPerDay - 1
            })
            UpdateSubscription({ "queryPerDay": props.queryPerDay - 1 })
          }


          //Added here on 18.04.2024

          getImporterList(params);
          getExporterList(params);
          getPortOriginList(params);
          getPortDestinationList(params);
          getHSCodeList(params);
          getIndianCityList(params);
          getForeignCountryList(params);
          getHSCode4digitList(params);
          getShipmentModeList(params);
          getStdUnitList(params);



          setSearchLoading(false);
        }
        else {
          setSearchResult([]);
          setSearchLoading(false);
          setTotalRecord(0)
          setFilteredColumn([])
          setNoDataErrorMsg(true)
        }
        props.loadingStop()
      })
      .catch(err => {
        // console.log("Err", err);
        setSearchId("")
        setSearchResult([]);
        setSearchLoading(false);
        setFilteredColumn([])
        props.loadingStop()
      });
  }

  const getPaginationSearchData = (params) => {
    // console.log("params ---------- ", params)
    scrollToRef(gridRef);
    setSearchLoading(true);
    isTotalRecordLoading(true)
    let tempSearchResult = []
    // "searchId": searchId,
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "searchId": searchId,
      "hsCodeList": params.hsCodeList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "orderByColumn": orderByColumn,
      "orderByMode": orderByMode,
      "hsCode4DigitList": params.hsCode4DigitList,
      "matchType": params.matchType,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList

    }

    Axios({
      method: "POST",
      url: `search-management/search`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() != "IND" && params.countryCode.toUpperCase() != "SEZ") {
          tempSearchResult = res.data.expForeignList
        }
        else if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() === "IND") {
          tempSearchResult = res.data.expIndList
        }
        else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() != "IND" && params.countryCode.toUpperCase() != "SEZ") {
          tempSearchResult = res.data.impForeignList
        }
        else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() === "IND") {
          tempSearchResult = res.data.impIndList
        }
        else if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() === "SEZ") {
          tempSearchResult = res.data.expIndList
        }
        else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() === "SEZ") {
          tempSearchResult = res.data.impIndList
        }
        else {
          tempSearchResult = []
        }

        if (tempSearchResult && tempSearchResult.length > 0) {

          setSearchResult(tempSearchResult);
          setNoDataErrorMsg(false)
          getTotalCount(params, res.data.searchId);
          let filteredColumn = []
          let objColumns = Object.keys(tempSearchResult[0]);
          for (var x in objColumns) {
            if (tempSearchResult[0][objColumns[x]] != null) {
              filteredColumn.push(objColumns[x]);
            }
          }
          setFilteredColumn(filteredColumn)
          setSearchId(res.data.searchId)
          // if(params.searchFlag == true && orderByColumn == ""){
          //   props.updateSubscriptionCount({
          //     download_count: props.download_count,
          //     subscriptionId: props.subscriptionId,
          //     dataAccess_count: props.dataAccess_count,
          //     totalWorkspace: props.totalWorkspace,
          //     subUserCount: props.subUserCount,
          //     queryPerDay: props.queryPerDay - 1
          //   })
          //   UpdateSubscription({"queryPerDay": props.queryPerDay - 1})
          // }
          setSearchLoading(false);
        }
        else {
          setSearchResult([]);
          setSearchLoading(false);
          setTotalRecord(0)
          setFilteredColumn([])
          setNoDataErrorMsg(true)
        }
        props.loadingStop()
      })
      .catch(err => {
        // console.log("Err", err);
        setSearchId("")
        setSearchResult([]);
        setSearchLoading(false);
        setFilteredColumn([])
        props.loadingStop()
      });
  }


  const getTotalCount = (params, searchID) => {
    // console.log("params 2---------- ", params)
    isTotalRecordLoading(true)
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "searchId": searchID,
      "hsCodeList": params.hsCodeList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "matchType": params.matchType,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    Axios({
      method: "POST",
      url: `/search-management/searchcount`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        setTotalRecord(res.data);
        updateSearchCount(res.data, searchID)
        setTimeout(isTotalRecordLoading(false), 1000)

      })
      .catch(err => {
        // console.log("Err", err);
        setTotalRecord(0);
        setNoDataErrorMsg(true)
      });
  }

  const updateSearchCount = (totalRecords, searchID) => {
    // console.log("params 2---------- ", params)
    const postData = {
      "totalRecords": totalRecords,
    }
    Axios({
      method: "PUT",
      url: `/search-management/updatesearchcount/${searchID}`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log("Res", res.data)
      })
      .catch(err => {
        // console.log("Err", err);
        setTotalRecord(0);
      });
  }

  const downloadSearch = (searchID, totalDownloadRecords) => {
    // if(isDownloaded != "Y") {
    Axios({
      method: "PUT",
      url: `/search-management/downloadsearch?searchId=${searchID}&recordsDownloaded=${totalDownloadRecords}`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log("Res", res.data)
      })
      .catch(err => {
        // console.log("Err", err);
      });

    // if(search_id){
    //   Axios({
    //     method: "PUT",
    //     url: `/search-management/downloadsearch?searchId=${search_id}`,
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   })
    //     .then(res => {
    //       console.log("Res", res.data)
    //     })
    //     .catch(err => {
    //       console.log("Err", err);
    //     });
    // }
    // } 

  }


  const getImporterList = (params) => {
    isImporterLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    Axios({
      method: "POST",
      url: `/search-management/listimporters`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        let importList = [];
        if (res.data.importersList) {
          res.data.importersList.forEach((item) => {
            let specificItem = { "value": item.importer_name, "label": item.importer_name + " [" + item.shipment_count + "]" };
            importList.push(specificItem);
          })
        }
        setImporterDataList(importList);
        isImporterLoading(false);
      })
      .catch(err => {
        // console.log("Err");
        setImporterDataList([]);
        isImporterLoading(false);
      });
  }

  const getExporterList = (params) => {
    isExporterLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    Axios({
      method: "POST",
      url: `/search-management/listexporters`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        let exportList = [];
        if (res.data.exportersList) {
          res.data.exportersList.forEach((item) => {
            let specificItem = { "value": item.exporter_name, "label": item.exporter_name + " [" + item.shipment_count + "]" };
            exportList.push(specificItem);
          })
        }
        setExporterDataList(exportList);
        isExporterLoading(false);
      })
      .catch(err => {
        // console.log("Err", err);
        setExporterDataList([]);
        isExporterLoading(false);
      });
  }

  const getPortOriginList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList


    }
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
        setPortOriginDataList(portsList);
      })
      .catch(err => {
        // console.log("Err", err);
        setPortOriginDataList([]);
      });
  }

  const getPortDestinationList = (params) => {
    isPortDestLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
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
        setPortDestinationDataList(portsList);
        isPortDestLoading(false);
      })
      .catch(err => {
        // console.log("Err", err);
        setPortDestinationDataList([]);
        isPortDestLoading(false);
      });
  }

  const getHSCodeList = (params) => {
    isHscodeLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": moment(params.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(params.toDate).format("YYYY-MM-DD"),
      "searchBy": params.searchBy ? params.searchBy : "HS_CODE",
      "searchValue": params.searchValue ? params.searchValue : ["2"],
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType ? params.matchType : "L",
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
    Axios({
      method: "POST",
      url: `/search-management/listhscodes`,
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
        setHsCodeDataList(hsList);
        isHscodeLoading(false);
      })
      .catch(err => {
        // console.log("Err", err);
        setHsCodeDataList([]);
        isHscodeLoading(false);
      });
  }

  const getHSCode4digitList = (params) => {
    isHscodeLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
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
        setHsCode4digitDataList(hsList);
        isHscodeLoading(false);
      })
      .catch(err => {
        // console.log("Err", err);
        setHsCode4digitDataList([]);
        isHscodeLoading(false);
      });
  }


  const getForeignCountryList = (params) => {
    isCoLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
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
        setTimeout(isCoLoading(false), 1000)
          ;
      })
      .catch(err => {
        // console.log("Err");
        setCountryOriginList([]);
        isCoLoading(false);
      });
  }

  const getIndianCityList = (params) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      "countryCode": params.countryCode,
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
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
      })
      .catch(err => {
        // console.log("Err");
        setCountryDestinationList([]);
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
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
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
        setShipmentModeDataList(icList);
      })
      .catch(err => {
        // console.log("Err");
        setShipmentModeDataList([]);
      });
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
      "pageNumber": page - 1,
      "numberOfRecords": limit,
      "matchType": params.matchType,
      "portOriginList": params.portOriginList,
      "portDestinationList": params.portDestinationList,
      "hsCodeList": params.hsCodeList,
      "hsCode4DigitList": params.hsCode4DigitList,
      "exporterList": params.exporterList,
      "importerList": params.importerList,
      "cityOriginList": params.cityOriginList,
      "cityDestinationList": params.cityDestinationList,
      "searchId": searchId,
      "queryBuilder": params.queryBuilder,
      "shipModeList": params.shipmentModeList,
      "stdUnitList": params.stdUnitList
    }
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
        setStdUnitDataList(icList);
      })
      .catch(err => {
        // console.log("Err");
        setStdUnitDataList([]);
      });
  }

  const resetFilter = (data) => {
    setPreviousTotalRecordCount(0)
    setIsDownloaded("N")
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
    if (data.shipmentModeList) {
      setShipmentModeList(data.shipmentModeList);
    }
    if (data.stdUnitList) {
      setStdUnitList(data.stdUnitList);
    }
    if (data.returnSearchId) {
      setReturnSearchId(data.returnSearchId);
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

      // getIndividualRecordCount(params)

      if (data.portOriginList) {
        // setPortOriginList(data.portOriginList);
        params["portOriginList"] = data.portOriginList;
      }
      if (data.portDestinationList) {
        // setPortDestinationList(data.portDestinationList);
        params["portDestinationList"] = data.portDestinationList;
      }
      if (data.hsCodeList) {
        // setHsCodeList(data.hsCodeList);
        params["hsCodeList"] = data.hsCodeList;
      }
      if (data.hsCode4DigitList) {
        // setHsCode4digitList(data.hsCode4DigitList);
        params["hsCode4DigitList"] = data.hsCode4DigitList;
      }
      if (data.importerList) {
        // setImporterList(data.importerList);
        params["importerList"] = data.importerList;
      }
      if (data.exporterList) {
        // setExporterList(data.exporterList);
        params["exporterList"] = data.exporterList;
      }
      if (data.cityOriginList) {
        // setCityOriginList(data.cityOriginList);
        params["cityOriginList"] = data.cityOriginList;
      }
      if (data.cityDestinationList) {
        // setCityDestinationList(data.cityDestinationList);
        params["cityDestinationList"] = data.cityDestinationList;
      }
      if (data.shipmentModeList) {
        // setShipmentModeList(data.shipmentModeList);
        params["shipmentModeList"] = data.shipmentModeList;
      }
      if (data.stdUnitList) {
        // setStdUnitList(data.stdUnitList);
        params["stdUnitList"] = data.stdUnitList;
      }
      if (data.returnSearchId) {
        params["returnSearchId"] = data.returnSearchId;
      }
      if (data.minQuantity) {
        params["minQuantity"] = data.minQuantity;
      }
      if (data.maxQuantity) {
        params["maxQuantity"] = data.maxQuantity;
      }
      setSearchParams(params);
      getSearchData(params);

      // commented 05.04.2024

      //  getImporterList(params);
      //  getExporterList(params);
      //  getPortOriginList(params);
      //  getPortDestinationList(params);
      //  getHSCodeList(params);
      //  getIndianCityList(params);
      //  getForeignCountryList(params);
      //  getHSCode4digitList(params);
      // //  getIndividualRecordCount(params)
      //  getShipmentModeList(params);
      //  getStdUnitList(params);


    }
    setToggle(false);
  }

  const getNewWorkspaceId = () => {
    if (workspaceRef.current.value && workspaceRef.current.value == "newWorkspace") {
      if (!workspaceRef.current.value || !sWorkspaceRef.current.value || !sTitleRef.current.value || !sDescRef.current.value) {
        if (!workspaceRef.current.value) {
          isWsError("Please select workspace name");
        } else isWsError("")

        if (!sWorkspaceRef.current.value) {
          isNewWsError("Please enter workspace name");
        } else isNewWsError("")

        if (!sTitleRef.current.value) {
          isSTitleError("Please enter title");
        } else isSTitleError("")

        if (!sDescRef.current.value) {
          isSDescError("Please enter description");
        } else isSDescError("");
      }
      else {
        const postData = {
          "name": sWorkspaceRef.current.value,
          "is_active": "Y",
        }
        AxiosACT({
          method: "POST",
          url: `/activity-management/workspace`,
          data: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            handleSaveSearch(res.data)
          })
          .catch(err => {
            // console.log("Err", err);
          });
      }
    }
    else {
      if (!workspaceRef.current.value || !sTitleRef.current.value || !sDescRef.current.value) {
        if (!workspaceRef.current.value || workspaceRef.current.value == "--select--") {
          isWsError("Please enter workspace name");
        } else isWsError("")

        if (!sTitleRef.current.value) {
          isSTitleError("Please enter title");
        } else isSTitleError("")

        if (!sDescRef.current.value) {
          isSDescError("Please enter description");
        } else isSDescError("");
      }
      else {
        handleSaveSearch()
      }
    }
  }

  const handleSaveSearch = (id) => {
    const postData = {
      "workspace_id": workspaceRef.current.value == "newWorkspace" ? id : parseInt(workspaceRef.current.value),
      "search_id": searchId,
      "name": sTitleRef.current.value,
      "description": sDescRef.current.value,
      "is_active": "Y",
    }
    AxiosACT({
      method: "POST",
      url: `/activity-management/workspace/savesearch`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        props.updateSubscriptionCount({
          download_count: props.download_count,
          subscriptionId: props.subscriptionId,
          dataAccess_count: props.dataAccess_count,
          totalWorkspace: props.totalWorkspace - 1,
          subUserCount: props.subUserCount,
          queryPerDay: props.queryPerDay
        })
        UpdateSubscription({ "totalWorkspace": props.totalWorkspace - 1 })
        Swal.fire({
          title: 'Success',
          text: "Search query saved successfully",
          icon: 'success',
        })
      })
      .catch(err => {
        // console.log("Err", err);
        let errorMsg = "Somethhing went wrong, please try again."
        if (err.data.errorMsg) {
          errorMsg = err.data.errorMsg;
        }
        Swal.fire({
          title: 'Oops!',
          text: errorMsg,
          icon: 'error',
        })
      });
    toggleModal();

  }

  const getWorkspaceList = () => {

    AxiosACT({
      method: "GET",
      url: `/activity-management/workspace/list?userId=${userId}`
    })
      .then(res => {
        setWorkspaceList(res.data.workspaceList);
      })
      .catch(err => {
        // console.log("Err", err);
      });
  }

  useEffect(() => {
    getWorkspaceList();
    fetchSearchQuery();
  }, [])


  const getSuggestionList = (value, innitialParams, index) => {

    if (value && value.length >= 2) {
      let newSuggestionList = []
      let QueryBuilderNewSuggestionList = [[], [], []]
      const postData = {
        "tradeType": innitialParams.tradeType,
        "fromDate": innitialParams.fromDate,
        "toDate": innitialParams.toDate,
        "searchBy": index == "" ? innitialParams.searchBy : innitialParams.queryBuilder[index - 1].searchBy,
        "searchValue": value,
        "countryCode": innitialParams.countryCode,
        "matchType": index == "" ? innitialParams.matchType : innitialParams.queryBuilder[index - 1].matchType,
      }
      Axios({
        method: "POST",
        url: `/search-management/suggestionlist`,
        data: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data.suggestionList) {
            res.data.suggestionList.map((item) => {
              let specificItem = { "value": item.listSuggestion, "label": item.listSuggestion };
              newSuggestionList.push(specificItem);
            })
            if (index == "") {
              setSuggestions(newSuggestionList)
            }
            else {
              QueryBuilderNewSuggestionList[index - 1] = newSuggestionList
              console.log("query builder ========== ", QueryBuilderNewSuggestionList)
              setQueryBuilderSuggestions(QueryBuilderNewSuggestionList)
            }

          }
        })
        .catch(err => {
          // let newValue =  { "listSuggestion": newVal, "shipmentCount": 0}    
          // setSuggestions(newValue)
        });
    }

  }


  const addnewOption = () => { }
  const SelectMenuButton = (props) => {
    return (
      <components.MenuList  {...props}>
        {props.children}
        {/* <button onClick={()=> addnewOption()}>Add new element</button> */}
      </components.MenuList >
    )
  }


  const getTradingCountryList = (params) => {
    setTradeType(params)

    AxiosMaster({
      method: "GET",
      url: `masterdata-management/countrylistbytrade/${params}`,
    })
      .then(res => {
        let countryList = [];
        if (res.data.countryList) {
          //   res.data.countryList.forEach((item) => {
          //     let specificItem = { "value": item.shortcode, "label": item.name };
          //     countryList.push(specificItem);
          //   })
          // }
          countryList = res.data.countryList.length > 0 && props.countryList.length > 0 && res.data.countryList.filter((item) => {
            return props.countryList.includes(item.shortcode)
          })

          setTradeCountryList(countryList)

        }
      })
      .catch(err => {
        setTradeCountryList([])
      });
  }

  const fetchSearchQuery = () => {
    if (search_id) {
      let newSuggestionList = []
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
              dateRange: search_id ? "6" : "",
              queryBuilder: sParams.queryBuilder ? sParams.queryBuilder : [],
              cityDestinationList: sParams.cityDestinationList,
              cityOriginList: sParams.cityOriginList,
              exporterList: sParams.exporterList,
              hsCode4DigitList: sParams.hsCode4DigitList,
              hsCodeList: sParams.hsCodeList,
              importerList: sParams.importerList,
              portDestinationList: sParams.portDestinationList,
              portOriginList: sParams.portOriginList,
              shipmentModeList: sParams.shipModeList ? sParams.shipModeList : [],
              stdUnitList: sParams.stdUnitList ? sParams.stdUnitList : [],


            };
            setCountryCode(sParams.countryCode)

            sParams.searchValue.map((item, index) => {
              let specificItem = { "value": item, "label": item };
              newSuggestionList.push(specificItem);
            })
            setSearchValue(newSuggestionList)
            if (sParams.queryBuilder && sParams.queryBuilder.length > 0) {

              sParams.queryBuilder.map((newitem, newindex) => {
                let tempArray = []
                newitem.searchValue.map((item, index) => {
                  let specificItem = { "value": item, "label": item };
                  tempArray.push(specificItem);
                })
                queryBuilderSuggestionList[newindex] = tempArray
              })
            }
            setQueryBuilderSearchValue(queryBuilderSuggestionList)
            //   console.log("initialValues Start ======= ", initialValues)

            setIsDownloaded(res.data.queryList[0].isDownloaded)
            setPreviousTotalRecordCount(res.data.queryList[0].totalRecords)
            sParams.tradeType == "IMPORT" ? fetchTradingCountryListOnInnitialize("I", sParams.countryCode, sParams.tradeType, initialValues) : fetchTradingCountryListOnInnitialize("E", sParams.countryCode, sParams.tradeType, initialValues)
          }
        })
        .catch(err => {
          // console.log("Err", err);
        });
    }
  }

  const fetchTradingCountryListOnInnitialize = (params, countryCode, tradeType, initialValues) => {
    setTradeType(params)
    AxiosMaster({
      method: "GET",
      url: `masterdata-management/countrylistbytrade/${params}`,
    })
      .then(res => {
        let countryList = [];
        if (res.data.countryList) {
          countryList = res.data.countryList.length > 0 && props.countryList.length > 0 && res.data.countryList.filter((item) => {
            return props.countryList.includes(item.shortcode)
          })

          setTradeCountryList(countryList)

          let tempRow = countryList && countryList.filter((item) => item.shortcode.toLowerCase().includes(countryCode.toLowerCase()))

          setImporterForExport(tempRow[0].importerForExport)
          setExporterForImport(tempRow[0].exporterForImport)

          setDate(countryCode, tradeType, res.data.countryList)
          handleSearch(initialValues, countryList);

        }
      }
      )
      .catch(err => {
        setTradeCountryList([])
      });
  }

  function setDate(text, tradeType, tradeCountryList) {
    // isLoading(true)
    let tempRow = tradeCountryList && tradeCountryList.filter((item) => item.shortcode.toLowerCase().includes(text.toLowerCase()))
    let fromDate = ""
    let toDate = ""

    if (tradeType == "I") {
      fromDate = moment(tempRow[0].importFrom).format('MM-DD-YYYY')
      toDate = moment(tempRow[0].importUpto).format('MM-DD-YYYY')
    }
    else {
      fromDate = moment(tempRow[0].exportFrom).format('MM-DD-YYYY')
      toDate = moment(tempRow[0].exportUpto).format('MM-DD-YYYY')
    }

    setMinDate(new Date(fromDate))
    setMaxDate(new Date(toDate))

    return new Date(toDate)
  }


  function setMaxMinDate(text) {
    // isLoading(true)
    let tempRow = tradeCountryList && tradeCountryList.filter((item) => item.shortcode.toLowerCase().includes(text.toLowerCase()))
    let fromDate = ""
    let toDate = ""
    let countrywiseFromDate = ""
    console.log("tradeType === ", tradeType)
    try {
      if (tradeType == "I") {
        countrywiseFromDate = moment(tempRow[0].importFrom).format('MM-DD-YYYY')
        fromDate = moment(tempRow[0].importFrom).format('MM-DD-YYYY')
        toDate = moment(tempRow[0].importUpto).format('MM-DD-YYYY')
      }
      else {
        countrywiseFromDate = moment(tempRow[0].exportFrom).format('MM-DD-YYYY')
        fromDate = moment(tempRow[0].exportFrom).format('MM-DD-YYYY')
        toDate = moment(tempRow[0].exportUpto).format('MM-DD-YYYY')
      }

      setMinDate(new Date(fromDate))
      setMaxDate(new Date(toDate))

      return new Date(toDate)
    }
    catch {
      props.loadingStop()
      Swal.fire({
        title: 'Error !',
        text: "Please select country",
        icon: 'error',
        dangerMode: true,
        confirmButtonColor: '#3085d6',
      })
      return ""
    }

  }

  function setExporterImporter(text, setFieldValue) {

    let tempRow = tradeCountryList && tradeCountryList.filter((item) => item.shortcode.toLowerCase().includes(text.toLowerCase()))

    setFieldValue("importerForExport", tempRow[0].importerForExport)
    setFieldValue("exporterForImport", tempRow[0].exporterForImport)
    setImporterForExport(tempRow[0].importerForExport)
    setExporterForImport(tempRow[0].exporterForImport)
  }

  useEffect(() => {
    return () => {
      localStorage.removeItem("searchParam")
    }
  }, []);


  const queryBuilder = (values, errors, touched, setFieldTouched, setFieldValue, Fragment) => {
    return (
      <FieldArray
        name="queryBuilder"
        render={arrayHelpers => (
          <>
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
                            setIsSearchClicked(false)
                          }
                          else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                            swalResponse()
                          }
                        }}
                      >
                        <option value="">Select Relation</option>
                        <option value="AND">AND</option>
                        {/* <option value="OR">OR</option>
                   <option value="NOT">NOT</option> */}
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
                            setIsSearchClicked(false)
                            queryBuilderSearchValue.length = 1
                          }
                          else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                            swalResponse()
                          }
                        }}
                      >
                        <option value="">Select Type</option>
                        <option value="HS_CODE">HS Code</option>
                        <option value="PRODUCT">Product</option>
                        {(values.tradeType == "EXPORT" && importerForExport == "Y") || values.tradeType == "IMPORT" ? <option value="IMPORTER">Importer</option> : null}
                        {(values.tradeType == "IMPORT" && exporterForImport == "Y" || values.tradeType == "EXPORT") ? <option value="EXPORTER">Exporter</option> : null}
                      </Field>
                    </div>
                  </div>
                  <div className="col-md-2 pr-0 pb-2">
                    <div className="input-search">
                      <Field
                        name={`queryBuilder[${index}].matchType`}
                        component="select"
                        className={`hero__form-input form-control custom-select ${touched.matchType && errors.matchType ? "is-invalid" : ""}`}
                        autoComplete="off"
                        onChange={event => {
                          if (props.queryPerDay > 0) {
                            setFieldValue(`queryBuilder[${index}].matchType`, event.target.value);
                            queryBuilderSearchValue.length = 1
                            setIsSearchClicked(false)
                          }
                          else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                            swalResponse()
                          }
                        }}
                      >
                        <option value="">Select</option>
                        {values.queryBuilder && values.queryBuilder.length > 0 && values.queryBuilder[index].hasOwnProperty("searchBy") && values.queryBuilder[index].searchBy == "PRODUCT" ? <><option value="C">Contains</option><option value="D">Does Not Contains</option> </> : null}
                        <option value="L">Like</option>
                      </Field>
                    </div>
                  </div>
                  {queryBuilderSearchValue && queryBuilderSearchValue.length > 0 ?
                    <div className="col-md-4 pr-0 pb-3">
                      <div className="input-search" >
                        <FormGroup >
                          <Creatable
                            placeholder="Select an individual"
                            name={`queryBuilder[${index}].searchValue`}
                            options={queryBuilderSuggestions[index]}
                            isMulti
                            isOptionDisabled={() => values.queryBuilder[index].searchValue && values.queryBuilder[index].searchValue.length >= 10}
                            noOptionsMessage={() => "name not found"}
                            components={{ MenuList: SelectMenuButton }}
                            onInputChange={(newValue) => props.queryPerDay > 0 ? getSuggestionList(newValue, values, index + 1) : null}
                            onChange={(selectedOption) => {
                              if (props.queryPerDay > 0) {
                                let itemList = [];
                                setIsSearchClicked(false)
                                selectedOption.forEach((item) => {
                                  itemList.push(item.value);
                                });
                                setFieldValue(`queryBuilder[${index}].searchValue`, itemList);
                              }
                              else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                swalResponse()
                              }
                            }}
                            defaultValue={queryBuilderSearchValue[index]}
                          />

                          {errors.searchValue && touched.searchValue ? (
                            <span className="errorMsg">{errors.searchValue}</span>
                          ) : null}
                        </FormGroup>
                      </div>
                    </div> : null
                  }
                  <div className="col-md-2 pr-0 pb-2">
                    <button
                      type="button" className="btn btn-warning"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      -
                    </button>
                    &nbsp;&nbsp;
                    {values.queryBuilder.length < 3 ?
                      <button
                        type="button" className="btn btn-warning"
                        onClick={() => arrayHelpers.push({ relation: "", searchBy: "", matchType: "", searchValue: "" })}
                      >
                        +
                      </button> : null}
                  </div>
                </Fragment>
              ))
            ) : (
              <div className="col-md-2 pr-0 pb-3">
                {workspace_id ? null :
                  <button type="reset" className="btn btn-warning"
                    onClick={() => arrayHelpers.push({ relation: "", searchBy: "", matchType: "", searchValue: "" })}>ADD</button>
                }
              </div>
            )}

          </>
        )}
      />
    )
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

  return (
    <>
      <div className="container-fluid" >
        <div className="row">
          <div className="col-md-12 list-page mt-3">
            <div className="search-top">
              <h5>
                Select Search Parameters
              </h5>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validateForm}
                onSubmit={mainSearch}
                resetForm
              >
                {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm, setFieldTouched, resetForm }) => {
                  //  console.log("values ======= ", values)
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
                              onChange={event => {
                                if (props.queryPerDay > 0) {
                                  setFieldValue("tradeType", event.target.value);
                                  setFieldValue("countryCode", "");
                                  setFieldValue("fromDate", "");
                                  setFieldValue("toDate", "");
                                  setFieldValue("dateRange", "");
                                  setIsSearchClicked(false)
                                  setSearchResult([])
                                  setFilteredColumn([])
                                  setOrderByColumn("")
                                  setOrderByMode("desc")
                                  getTradingCountryList(event.target.value == "IMPORT" ? 'I' : 'E')
                                }
                                else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse()
                                }
                              }}
                            >
                              <option value="">Select Trade</option>
                              <option value="IMPORT">Import</option>
                              <option value="EXPORT">Export</option>
                            </Field>
                            {errors.tradeType && touched.tradeType ? (
                              <span className="errorMsg">{errors.tradeType}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-3 pr-0 pb-3" >
                          <div className="dropdown bootstrap-select hero__form-input country_ls" >
                            <Field
                              name="countryCode"
                              component="select"
                              className={`hero__form-input form-control custom-select custom-select_list ${touched.countryCode && errors.countryCode ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.countryCode}
                              isMulti

                              onChange={event => {
                                if (props.queryPerDay > 0) {
                                  setFieldValue("countryCode", event.target.value);
                                  setFieldValue("fromDate", "");
                                  setFieldValue("toDate", "");
                                  setFieldValue("dateRange", "");
                                  setMaxMinDate(event.target.value, values.tradeType)
                                  setIsSearchClicked(false)
                                  setSearchResult([])
                                  setFilteredColumn([])
                                  setOrderByColumn("")
                                  setOrderByMode("desc")
                                  setCountryCode(event.target.value)
                                  setExporterImporter(event.target.value, setFieldValue)
                                }
                                else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse()
                                }
                              }}
                            >
                              <option value="" >Select Country</option>
                              {Object.keys(tradeCountryList).map((item, index) => (
                                <option key={index} value={tradeCountryList[item].shortcode}>{tradeCountryList[item].name}</option>
                              ))}
                            </Field>
                            {errors.countryCode && touched.countryCode ? (
                              <span className="errorMsg">{errors.countryCode}</span>
                            ) : null}
                            {/* <Select
                              defaultValue={defaultCountry}
                              isMulti
                              placeholder = 'Select Country'
                              name="countryCode"
                              options={  Object.keys(tradeCountryList).map((item,index) => (      
                                 { label: tradeCountryList[item].name, value: tradeCountryList[item].shortcode }                                                 
                              ))}
                              className={`dropdown bootstrap-select hero__form-input ${touched.countryCode && errors.countryCode ? "is-invalid" : ""}`}
                              classNamePrefix="select"
                              onChange={(selectedOption) => {
                                let itemList = [];
                                selectedOption.forEach((item)=>{
                                  itemList.push(item.value);
                                });
                                setFieldValue("countryCode", itemList);
                              }}
                            />
                            {errors.countryCode && touched.countryCode ? (
                                  <span className="errorMsg">{errors.countryCode}</span>
                            ) : null} */}
                          </div>
                        </div>
                        <div className="col-md-2 pr-0 pb-3">
                          <div className="dropdown bootstrap-select hero__form-input">
                            <Field
                              name="dateRange"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.dateRange && errors.dateRange ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.dateRange}
                              onChange={event => {

                                if (props.queryPerDay > 0) {
                                  props.loadingStart()
                                  setIsSearchClicked(false)
                                  setFieldValue("dateRange", event.target.value);
                                  let tempmaxMin = setMaxMinDate(values.countryCode, values.tradeType)
                                  let tempMaxDate = moment(tempmaxMin).diff(moment(props.dataAccessUpto), 'days') > 0 ? props.dataAccessUpto : tempmaxMin
                                  let newMaxDate = ""

                                  if (values.countryCode == "IND" || values.countryCode == "SEZ") {
                                    const newDate = moment().diff(moment(tempMaxDate), 'days') > 0 ? tempMaxDate : new Date()
                                    const d = new Date(newDate);
                                    d.setDate(1)
                                    newMaxDate = moment(d).subtract(1, 'days')
                                  }
                                  else {
                                    newMaxDate = moment().diff(moment(tempMaxDate), 'days') > 0 ? tempMaxDate : new Date()
                                  }



                                  let fromdate = ""
                                  let dateDiff = ""
                                  let tempFromdate = ""

                                  if (newMaxDate != "") {
                                    switch (event.target.value) {
                                      case "1":

                                        fromdate = new Date(newMaxDate);
                                        fromdate.setDate(1)



                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days')
                                        if (dateDiff >= 0) {
                                          setFieldValue("fromDate", new Date(fromdate))
                                        }
                                        else {
                                          setFieldValue("fromDate", new Date(props.dataAccessInMonth))
                                        }
                                        setFieldValue("toDate", new Date(newMaxDate))
                                        props.loadingStop()
                                        break;
                                      case "2":

                                        tempFromdate = moment(newMaxDate).subtract(3, 'months').add(5, "days").format("YYYY-MM-DD")
                                        fromdate = new Date(tempFromdate);
                                        fromdate.setDate(1)



                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days')
                                        if (dateDiff >= 0) {
                                          setFieldValue("fromDate", new Date(fromdate))
                                        }
                                        else {
                                          setFieldValue("fromDate", new Date(props.dataAccessInMonth))
                                        }
                                        setFieldValue("toDate", new Date(newMaxDate))
                                        props.loadingStop()
                                        break;

                                      case "3":

                                        tempFromdate = moment(newMaxDate).subtract(6, 'months').add(5, "days").format("YYYY-MM-DD")
                                        fromdate = new Date(tempFromdate);
                                        fromdate.setDate(1)



                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days')
                                        if (dateDiff >= 0) {
                                          setFieldValue("fromDate", new Date(fromdate))
                                        }
                                        else {
                                          setFieldValue("fromDate", new Date(props.dataAccessInMonth))
                                        }
                                        setFieldValue("toDate", new Date(newMaxDate))
                                        props.loadingStop()
                                        break;
                                      case "4":
                                        tempFromdate = moment(newMaxDate).subtract(12, 'months').add(5, "days").format("YYYY-MM-DD")
                                        fromdate = new Date(tempFromdate);
                                        fromdate.setDate(1)
                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days')
                                        if (dateDiff >= 0) {
                                          setFieldValue("fromDate", new Date(fromdate))
                                        }
                                        else {
                                          setFieldValue("fromDate", new Date(props.dataAccessInMonth))
                                        }
                                        setFieldValue("toDate", new Date(newMaxDate))
                                        props.loadingStop()
                                        break;
                                      default:
                                        setFieldValue("toDate", "")
                                        setFieldValue("fromDate", "")
                                        props.loadingStop()
                                    }
                                  }
                                }
                                else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse()
                                }
                              }}
                            >
                              <option value=""> Chose Month Range</option>
                              <option value="1">LAST 1 MONTH</option>
                              <option value="2">LAST 3 MONTHS</option>
                              <option value="3">LAST 6 MONTHS</option>
                              <option value="4">LAST 1 YEAR</option>
                              <option value="6">CUSTOM</option>
                            </Field>
                            {errors.dateRange && touched.dateRange ? (
                              <span className="errorMsg">{errors.dateRange}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-2 pr-0 pb-3">
                          <div className="input-search">
                            <DatePicker
                              name="fromDate"
                              dateFormat="yyyy MMM dd  "
                              placeholderText="From"
                              peekPreviousMonth
                              peekPreviousYear
                              showMonthDropdown
                              showYearDropdown
                              minDate={moment(minDate).diff(moment(props.dataAccessInMonth), 'days') > 0 ? new Date(minDate) : new Date(props.dataAccessInMonth)}
                              // maxDate={new Date(maxDate)}
                              maxDate={(props.dataAccessUpto == null || props.dataAccessUpto == "") ? new Date(maxDate) : moment(props.dataAccessUpto).diff(moment(maxDate), 'days') > 0 ? new Date(maxDate) : new Date(props.dataAccessUpto)}
                              className="form-control"
                              dropdownMode="select"
                              onChange={(value) => {
                                console.log("Mindate === ", minDate)
                                console.log("date === ", moment(minDate).diff(moment(props.dataAccessInMonth), 'days'))
                                if (props.queryPerDay > 0) {
                                  setFieldValue("fromDate", value);
                                  setFieldTouched("fromDate");
                                  setFieldValue("dateRange", 6)
                                  setIsSearchClicked(false)
                                }
                                else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse()
                                }
                              }}
                              selected={values.fromDate}
                            />
                            {errors.fromDate && touched.fromDate ? (
                              <span className="errorMsg">{errors.fromDate}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-2 pr-0 pb-3">
                          <div className="input-search">
                            <DatePicker
                              name="toDate"
                              dateFormat="yyyy MMM dd  "
                              placeholderText="To"
                              peekPreviousMonth
                              peekPreviousYear
                              showMonthDropdown
                              showYearDropdown
                              //  minDate= {moment(minDate)} 
                              minDate={moment(minDate).diff(moment(props.dataAccessInMonth), 'days') > 0 ? new Date(minDate) : new Date(props.dataAccessInMonth)}
                              maxDate={(props.dataAccessUpto == null || props.dataAccessUpto == "") ? new Date(maxDate) : moment(props.dataAccessUpto).diff(moment(maxDate), 'days') > 0 ? new Date(maxDate) : new Date(props.dataAccessUpto)}
                              className="form-control"
                              dropdownMode="select"
                              onChange={(value) => {
                                console.log("maxDate === ", moment(minDate).diff(moment(props.dataAccessInMonth), 'days'))
                                console.log("date === ", moment(props.dataAccessUptoDate).diff(moment(maxDate), 'days'))
                                if (props.queryPerDay > 0) {
                                  setFieldValue("toDate", value);
                                  setFieldTouched("toDate");
                                  setFieldValue("dateRange", 6)
                                  setIsSearchClicked(false)
                                }
                                else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse()
                                }
                              }}
                              selected={values.toDate}
                            />
                            {errors.toDate && touched.toDate ? (
                              <span className="errorMsg">{errors.toDate}</span>
                            ) : null}
                          </div>
                        </div>

                      </div>
                      <div className="row">
                        <div className="col-md-3 pr-0 pb-3">
                          <div className="input-search">
                            <Field
                              name="searchBy"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.searchBy && errors.searchBy ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.searchBy}
                              onChange={event => {
                                if (props.queryPerDay > 0) {
                                  event.target.value == "PRODUCT" ? setFieldValue("matchType", "C") : setFieldValue("matchType", "L");
                                  searchValue.length = 1
                                  setFieldValue("searchBy", event.target.value);
                                  setIsSearchClicked(false)
                                }
                                else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse()
                                }
                              }}
                            >
                              <option value="">Select Type</option>
                              <option value="HS_CODE">HS Code</option>
                              <option value="PRODUCT">Product</option>
                              {(values.tradeType == "EXPORT" && importerForExport == "Y") || values.tradeType == "IMPORT" ? <option value="IMPORTER">Importer</option> : null}
                              {(values.tradeType == "IMPORT" && exporterForImport == "Y" || values.tradeType == "EXPORT") ? <option value="EXPORTER">Exporter</option> : null}
                            </Field>
                            {errors.searchBy && touched.searchBy ? (
                              <span className="errorMsg">{errors.searchBy}</span>
                            ) : null}
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
                              onChange={event => {
                                if (props.queryPerDay > 0) {
                                  setFieldValue("matchType", event.target.value);
                                  searchValue.length = 1
                                  setIsSearchClicked(false)
                                }
                                else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse()
                                }
                              }}
                            >
                              <option value="">Select</option>
                              {values.searchBy == "PRODUCT" ? <><option value="C">Contains</option><option value="D">Does Not Contains</option> </> : null}
                              <option value="L">Like</option>
                            </Field>
                            {errors.matchType && touched.matchType ? (
                              <span className="errorMsg">{errors.matchType}</span>
                            ) : null}
                          </div>
                        </div>
                        {searchValue && searchValue.length > 0 ?
                          <div className="col-md-4 pr-0 pb-3">
                            <div className="input-search" >
                              <FormGroup >
                                <Creatable
                                  placeholder={values.searchBy == "HS_CODE" ? "Enter min 4 digit" : "Enter min 2 chars"}
                                  name="searchValue"
                                  options={suggestions}
                                  isMulti
                                  isOptionDisabled={() => values.searchValue && values.searchValue.length >= 10}
                                  noOptionsMessage={() => "name not found"}
                                  components={{ MenuList: SelectMenuButton }}
                                  onInputChange={(newValue) => props.queryPerDay > 0 ? getSuggestionList(newValue, values, "") : null}
                                  onChange={(selectedOption) => {
                                    if (props.queryPerDay > 0) {
                                      let itemList = [];
                                      setIsSearchClicked(false)
                                      selectedOption.forEach((item) => {
                                        itemList.push(item.value);
                                      });
                                      setFieldValue("searchValue", itemList);
                                    }
                                    else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                      swalResponse()
                                    }
                                  }}
                                  defaultValue={searchValue}
                                />

                                {errors.searchValue && touched.searchValue ? (
                                  <span className="errorMsg">{errors.searchValue}</span>
                                ) : null}
                              </FormGroup>
                            </div>
                          </div> : null
                        }

                      </div>

                      <div className="row">
                        {queryBuilder(values, errors, touched, setFieldTouched, setFieldValue, Fragment)}
                      </div>

                      {workspace_id ? null :
                        <div className="row">
                          <div className="col-md-2 pr-0 pb-3">
                            <button type="reset" className="btn btn-warning"
                              onClick={(event) => {
                                resetSearch(setFieldValue, values);
                              }}>Reset</button> &nbsp;
                            <button type="submit"
                              disabled={isSearchClicked}
                              onClick={(event) => {
                                event.preventDefault();
                                setSearchId("");
                                setFieldValue("searchFlag", true);
                                handleSubmit();
                              }} className="btn btn-primary">Search</button>
                          </div>
                        </div>
                      }
                    </Form>
                  )
                }
                }
              </Formik>
            </div>

            {searchParams && searchParams.tradeType && searchResult.length > 0 ? (
              <div className="row searchCountBlk">
                <div className="col-md-12 text-center">

                  <h3>Search Result of {searchParams.tradeType.toLowerCase()} data from&nbsp;
                    {moment(searchParams.fromDate).format("DD-MMM-YYYY")} to {moment(searchParams.toDate).format('DD-MMM-YYYY')}</h3>

                </div>
                {noDataErrorMsg == false ?
                  <>
                    <div className="col-lg-2 col-md-2 offset-md-1">
                      <div className="card">
                        <div className="card-body bg-soft-primary">
                          <div className="avatar">
                            <span className="avatar-title bg-soft-primary rounded">
                              <i className="icon ion-ios-barcode text-primary font-size-24"></i>
                            </span>
                          </div>
                          <div className="list-in">
                            <p className="text-muted mt-0 mb-0">HSCODE</p>
                            <h4 className="mt-0 mb-0">{hsCodeDataList.length}</h4>
                          </div>
                        </div>
                        {hscodeLoading && (
                          <div className="loaderBox">
                            <div className="loader"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="card">
                        <div className="card-body bg-soft-success">
                          <div className="avatar">
                            <span className="avatar-title bg-soft-success rounded">
                              <i className="icon ion-md-filing text-primary font-size-24"></i>
                            </span>
                          </div>
                          <div className="list-in">
                            <p className="text-muted mt-0 mb-0">Total Shipment</p>
                            <h4 className="mt-0 mb-0">{totalRecord}</h4>
                          </div>
                        </div>
                        {totalRecordLoading && (
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
                              <i className="icon ion-md-business text-primary font-size-24"></i>
                            </span>
                          </div>
                          <div className="list-in">
                            <p className="text-muted mt-0 mb-0"> {tradeType == "E" ? "Country Of Destination" : "Country Of Origin"}</p>
                            <h4 className="mt-0 mb-0">{countryOriginList.length}</h4>
                          </div>
                        </div>
                        {portDestLoading && (
                          <div className="loaderBox">
                            <div className="loader"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    {(searchParams.tradeType == "IMPORT" && exporterForImport == "Y" || searchParams.tradeType == "EXPORT") ?
                      <div className="col-lg-2 col-md-2">
                        <div className="card">
                          <div className="card-body bg-soft-success">
                            <div className="avatar">
                              <span className="avatar-title bg-soft-success rounded">
                                <i className="icon ion-md-filing text-primary font-size-24"></i>
                              </span>
                            </div>
                            <div className="list-in">
                              <p className="text-muted mt-0 mb-0">Exporter</p>
                              <h4 className="mt-0 mb-0">{exporterDataList && exporterDataList.length}</h4>
                            </div>
                          </div>
                          {exporterLoading && (
                            <div className="loaderBox">
                              <div className="loader"></div>
                            </div>
                          )}
                        </div>
                      </div> : null}
                    {(searchParams.tradeType == "EXPORT" && importerForExport == "Y") || searchParams.tradeType == "IMPORT" ?
                      <div className="col-lg-2 col-md-2">
                        <div className="card">
                          <div className="card-body bg-soft-primary">
                            <div className="avatar">
                              <span className="avatar-title bg-soft-primary rounded">
                                <i className="icon ion-ios-business text-primary font-size-24"></i>
                              </span>
                            </div>
                            <div className="list-in">
                              <p className="text-muted mt-0 mb-0">Importer</p>
                              <h4 className="mt-0 mb-0">{importerDataList && importerDataList.length}</h4>
                              {/* <h4 className="mt-0 mb-0">{searchParams.tradeType = "IMPORT" ? importerDataList.length : exporterDataList.length}</h4> */}
                            </div>
                          </div>
                          {importerLoading && (
                            <div className="loaderBox">
                              <div className="loader"></div>
                            </div>
                          )}
                        </div>
                      </div> : null}
                  </>
                  :
                  <div className="col-lg-12 col-md-12 text-center">
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <img src={require('../assets/image/Error.png').default}></img>
                    <h4><p>Sorry we couldn't find any matches.</p></h4>
                    <h2>Please Try Again</h2>
                  </div>
                }
              </div>
            ) : null}

            <Draggable>
              <div class="ad-butt">
                <button className="btn btn-primary ad-butt-button" onClick={() => setToggle(!toggle)}><i className="icon ion-md-search text-light font-size-35"></i></button>
              </div>
            </Draggable>


            <div ref={gridRef}></div>
            {filteredColumn.length > 0 ? (
              tradeType === 'E' ? (
                <DataTableExport
                  exportToCSV={exportToCSV}
                  searchResult={searchResult}
                  limit={limit}
                  page={page}
                  setPage={setPage}
                  handleChangeLimit={handleChangeLimit}
                  totalRecord={totalRecord}
                  searchLoading={searchLoading}
                  setOrderByColumn={setOrderByColumn}
                  setOrderByMode={setOrderByMode}
                  orderByColumn={orderByColumn}
                  orderByMode={orderByMode}
                  setWorkspace={setWorkspace}
                  showModal={showModal}
                  filteredColumn={filteredColumn}
                  saveQuery={saveQuery}
                  search_id={searchId ? searchId : search_id}
                  state={props.location.state}
                  exportSelectedToCSV={exportSelectedToCSV}
                  importerDataList={importerDataList}
                  countryCode={countryCode}
                  newColumnsKeys={props.location.state && props.location.state.columnKeys ? props.location.state.columnKeys : []}
                  importerForExport={importerForExport}
                  exporterForImport={exporterForImport}
                  filterCountryList={[]}
                />
              ) : (
                <DataTableImport
                  exportToCSV={exportToCSV}
                  searchResult={searchResult}
                  limit={limit}
                  page={page}
                  setPage={setPage}
                  handleChangeLimit={handleChangeLimit}
                  totalRecord={totalRecord}
                  searchLoading={searchLoading}
                  setOrderByColumn={setOrderByColumn}
                  setOrderByMode={setOrderByMode}
                  orderByColumn={orderByColumn}
                  orderByMode={orderByMode}
                  setWorkspace={setWorkspace}
                  showModal={showModal}
                  filteredColumn={filteredColumn}
                  saveQuery={saveQuery}
                  search_id={searchId ? searchId : search_id}
                  state={props.location.state}
                  exportSelectedToCSV={exportSelectedToCSV}
                  importerDataList={importerDataList}
                  countryCode={countryCode}
                  newColumnsKeys={props.location.state && props.location.state.columnKeys ? props.location.state.columnKeys : []}
                  importerForExport={importerForExport}
                  exporterForImport={exporterForImport}
                  filterCountryList={[]}
                />
              )) : noDataErrorMsg ? <div><h2>No records found</h2></div> : null}
          </div>
        </div>

        {toggle && <AdvanceSearch toggleFromChild={setToggle}
          importerDataList={importerDataList}
          exporterDataList={exporterDataList}
          portOriginDataList={portOriginDataList}
          portDestinationDataList={portDestinationDataList}
          countryOriginList={countryOriginList}
          countryDestinationList={countryDestinationList}
          hsCodeDataList={hsCodeDataList}
          shipmentModeDataList={shipmentModeDataList}
          shipmentModeList={shipmentModeList}
          type={searchParams.tradeType}
          countryCode={searchParams.countryCode}
          updateFilter={updateFilter}
          portOriginList={portOriginList}
          portDestinationList={portDestinationList}
          hsCodeList={hsCodeList}
          importerList={importerList}
          exporterList={exporterList}
          cityOriginList={cityOriginList}
          cityDestinationList={cityDestinationList}
          hsCode4digitDataList={hsCode4digitDataList}
          hsCode4DigitList={hsCode4DigitList}
          fetchSearchQuery={fetchSearchQuery}
          resetFilter={resetFilter}
          stdUnitList={stdUnitList}
          stdUnitDataList={stdUnitDataList}
          searchId={searchId}
          importerForExport={importerForExport}
          exporterForImport={exporterForImport}

        />
        }
      </div>
      <div id="reportXLS" hidden={true}>
        {filteredArray && filteredArray.length > 0 ? <DloadTemplateXLS filteredArray={filteredArray} tradeType={tradeType} countryCode={countryCode} /> : null}
      </div>

      <Modal
        show={showModal}
        onHide={toggleModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Save search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <label>Workspace:</label>
              <select className="form-control" ref={workspaceRef}
                onChange={(e) => { handleWorkspaceChange(e) }}>
                <option >--select--</option>
                <option value="newWorkspace">Create New Workspace</option>
                {workspaceList.map((ws, index) => {
                  return (
                    <option key={index} value={ws.id}>{ws.name}</option>
                  )
                })}
              </select>
              {wsError && (<p className='error'>{wsError}</p>)}
            </div>
            {showNewWorkspaceInput ?
              <div className="col-md-12">
                <label>New workspace name:</label>
                <input type="text" name="title" ref={sWorkspaceRef} className="form-control" />
                {sNewWsError && (<p className='error'>{sNewWsError}</p>)}
              </div> : null
            }
            <div className="col-md-12">
              <label>Title:</label>
              <input type="text" name="title" ref={sTitleRef} className="form-control" />
              {sTitleError && (<p className='error'>{sTitleError}</p>)}
            </div>
            <div className="col-md-12">
              <label>Description:</label>
              <input type="text" name="title" ref={sDescRef} className="form-control" />
              {sDescError && (<p className='error'>{sDescError}</p>)}
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            getNewWorkspaceId()
          }}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}



const mapStateToProps = state => {
  return {
    loading: state.loader.loading,
    download_count: state.data.download_count,
    subscriptionId: state.data.subscriptionId,
    dataAccess_count: state.data.dataAccess_count,
    totalWorkspace: state.data.totalWorkspace,
    subUserCount: state.data.subUserCount,
    queryPerDay: state.data.queryPerDay,
    downloadArray: state.data.downloadArray,
    countryList: state.data.countryList,
    dataAccessInMonth: state.data.dataAccessInMonth,
    download_count_subUser: state.data.download_count_subUser,
    dataAccessUpto: state.data.dataAccessUpto,
    maxDownload: state.data.maxDownload,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadingStart: () => dispatch(loaderStart()),
    loadingStop: () => dispatch(loaderStop()),
    updateSubscriptionCount: (data) => dispatch(updateSubscriptionCount(data)),
    updateDownloadArrayCount: (data) => dispatch(updateDownloadArrayCount(data)),
    setDloadCountSubuser: (data) => dispatch(setDloadCountSubuser(data))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
