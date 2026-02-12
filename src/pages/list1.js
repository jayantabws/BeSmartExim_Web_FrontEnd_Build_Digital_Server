import React, { useState, useRef, useCallback, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
// import { DatePicker, Space } from 'antd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css'
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import { MultiSelect } from "react-multi-select-component";
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
import { DropDownTreeComponent, ColumnsDirective, ColumnDirective, Filter, Sort, Reorder, Inject, ITreeData } from '@syncfusion/ej2-react-dropdowns';
import Creatable from 'react-select/creatable';
import * as ReactDOM from 'react-dom';
// import { TagsInput } from "react-tag-input-component";
// import ReactTags from "react-tag-autocomplete";
import {
  checkGreaterTimes,
  checkGreaterStartEndTimes
} from "../shared/validationFunctions";
import Draggable from 'react-draggable';
import { loaderStart, loaderStop } from "../store/actions/loader";
import { updateSubscriptionCount, updateDownloadArrayCount, setDloadCountSubuser, setSearchQuery } from "../store/actions/data"
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import DloadTemplateXLS from '../components/DloadTemplateXLS'
import { testJson } from '../shared/JSONString'
import LoginCheck from '../shared/LoginCheck';
import ReactCountryFlag from "react-country-flag"
import Flag from 'react-world-flags';
/*08/09/2025 */
import DownloadLoader from '../components/DownloadLoader';


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

let treeSettings = { autoCheck: true };

const dateFormat = "YYYY-MM-DD";
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)
// const columnOptions = ['Date', 'HSCODE', 'Product Description', 'Value', 'Quantity', 'Unit', 'Port Of Destination', 'Foreign Country', 'Indian Company Name', 'Foreign Company Name']



let defaultCountry = []

// -------country list show in modal 26.05.2025----------//




// const CountrySelector = ({ multiTradeCountryList, selectedTradeCountry, setFieldValue, values, setSelectedTradeCountry, setMaxMinDate }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [tempSelectedCountries, setTempSelectedCountries] = useState([]);
//   const [selectAll, setSelectAll] = useState(false); // State to track "Select All" checkbox

//   // Synchronize tempSelectedCountries with selectedTradeCountry when it changes
//   useEffect(() => {
//     const selectedValues = selectedTradeCountry.map((country) => country.value);
//     setTempSelectedCountries(selectedValues);
//     setSelectAll(selectedValues.length === multiTradeCountryList.length); // Update "Select All" checkbox state
//   }, [selectedTradeCountry, multiTradeCountryList]);

//   const handleCheckboxChange = (shortcode) => {
//     let updatedTempSelectedCountries;

//     if (tempSelectedCountries.includes(shortcode)) {
//       // Remove the country if it's already selected
//       updatedTempSelectedCountries = tempSelectedCountries.filter((code) => code !== shortcode);
//     } else {
//       // Add the country if it's not selected
//       updatedTempSelectedCountries = [...tempSelectedCountries, shortcode];
//     }

//     // Update the state and form values
//     setTempSelectedCountries(updatedTempSelectedCountries);

//     const updatedSelectedCountries = multiTradeCountryList.filter((country) =>
//       updatedTempSelectedCountries.includes(country.value)
//     );

//     setSelectedTradeCountry(updatedSelectedCountries);
//     setFieldValue("countryCode", updatedTempSelectedCountries);
//     setFieldValue("fromDate", "");
//     setFieldValue("toDate", "");
//     setFieldValue("dateRange", "");
//     setMaxMinDate(updatedSelectedCountries, values.tradeType);

//     // Update "Select All" checkbox state
//     setSelectAll(updatedTempSelectedCountries.length === multiTradeCountryList.length);
//   };

//   const handleSelectAllChange = () => {
//     if (selectAll) {
//       // Deselect all
//       setTempSelectedCountries([]);
//       setSelectedTradeCountry([]);
//       setFieldValue("countryCode", []);
//       setFieldValue("fromDate", "");
//       setFieldValue("toDate", "");
//       setFieldValue("dateRange", "");
//       setMaxMinDate([], values.tradeType);
//     } else {
//       // Select all
//       const allCountryValues = multiTradeCountryList.map((country) => country.value);
//       setTempSelectedCountries(allCountryValues);

//       const updatedSelectedCountries = multiTradeCountryList;
//       setSelectedTradeCountry(updatedSelectedCountries);
//       setFieldValue("countryCode", allCountryValues);
//       setFieldValue("fromDate", "");
//       setFieldValue("toDate", "");
//       setFieldValue("dateRange", "");
//       setMaxMinDate(updatedSelectedCountries, values.tradeType);
//     }

//     setSelectAll(!selectAll); // Toggle "Select All" checkbox state
//   };

//   const getDisplayText = () => {
//     if (selectedTradeCountry.length <= 2) {
//       return selectedTradeCountry.map((country) => country.label).join(", ");
//     }
//     return `${selectedTradeCountry[0].label}, ${selectedTradeCountry[1].label}, ...`;
//   };

//   return (
//     <>
//       {/* Box displaying selected countries */}
//       <div
//         className="country-box countryModal"
//         onClick={() => setShowModal(true)}
//       >
//         {selectedTradeCountry.length > 0 ? getDisplayText() : "Select Countries"}
//       </div>

//       {/* Modal for country selection */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Select Countries</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="row mb-3">
//             <div className="col-md-12">
//               <div className="d-flex align-items-center countryModal_data_div">
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={handleSelectAllChange}
//                 // style={{ width: "20px", height: "20px", marginRight: "10px" }}
//                 />
//                 <label>Select All</label>
//               </div>
//             </div>
//           </div>
//           <div
//             className="row countryModal_row"
//           >
//             {multiTradeCountryList.map((country) => (
//               <div key={country.value} className="col-md-4 mb-3">
//                 <div
//                   className="d-flex align-items-center countryModal_data_div"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={tempSelectedCountries.includes(country.value)}
//                     onChange={() => handleCheckboxChange(country.value)}
//                   />
//                   <label>
//                     <ReactCountryFlag
//                       className="emojiFlag"
//                       countryCode={country.iso2code}
//                       style={{
//                         fontSize: '1.5em',
//                         lineHeight: '2em',
//                         paddingRight: '5px'
//                       }}
//                       aria-label="United States"
//                     />
//                     {country.label}</label>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Modal.Body>

//       </Modal>
//     </>
//   );
// };

// -------country list show in modal 26.05.2025----------//

//---- country list show by continent @ 30.05.2025 ----//

// const CountrySelector = ({ multiTradeCountryList, selectedTradeCountry, setFieldValue, values, setSelectedTradeCountry, setMaxMinDate }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [tempSelectedCountries, setTempSelectedCountries] = useState([]);
//   const [selectAll, setSelectAll] = useState(false); // State to track "Select All" checkbox



//   // Group countries by continent
//   const groupedCountries = multiTradeCountryList.reduce((acc, country) => {
//     const continent = country.continentName || "Unknown";
//     if (!acc[continent]) {
//       acc[continent] = [];
//     }
//     acc[continent].push(country);
//     return acc;
//   }, {});

//   // Synchronize tempSelectedCountries with selectedTradeCountry when it changes
//   useEffect(() => {
//     const selectedValues = selectedTradeCountry.map((country) => country.value);
//     setTempSelectedCountries(selectedValues);
//     setSelectAll(selectedValues.length === multiTradeCountryList.length); // Update "Select All" checkbox state
//   }, [selectedTradeCountry, multiTradeCountryList]);

//   const handleCheckboxChange = (shortcode) => {
//     let updatedTempSelectedCountries;

//     if (tempSelectedCountries.includes(shortcode)) {
//       // Remove the country if it's already selected
//       updatedTempSelectedCountries = tempSelectedCountries.filter((code) => code !== shortcode);
//     } else {
//       // Add the country if it's not selected
//       updatedTempSelectedCountries = [...tempSelectedCountries, shortcode];
//     }

//     // Update the state and form values
//     setTempSelectedCountries(updatedTempSelectedCountries);

//     const updatedSelectedCountries = multiTradeCountryList.filter((country) =>
//       updatedTempSelectedCountries.includes(country.value)
//     );

//     setSelectedTradeCountry(updatedSelectedCountries);
//     setFieldValue("countryCode", updatedTempSelectedCountries);
//     setFieldValue("fromDate", "");
//     setFieldValue("toDate", "");
//     setFieldValue("dateRange", "");
//     setMaxMinDate(updatedSelectedCountries, values.tradeType);

//     // Update "Select All" checkbox state
//     setSelectAll(updatedTempSelectedCountries.length === multiTradeCountryList.length);
//   };

//   const handleSelectAllChange = () => {
//     if (selectAll) {
//       // Deselect all
//       setTempSelectedCountries([]);
//       setSelectedTradeCountry([]);
//       setFieldValue("countryCode", []);
//       setFieldValue("fromDate", "");
//       setFieldValue("toDate", "");
//       setFieldValue("dateRange", "");
//       setMaxMinDate([], values.tradeType);
//     } else {
//       // Select all
//       const allCountryValues = multiTradeCountryList.map((country) => country.value);
//       setTempSelectedCountries(allCountryValues);

//       const updatedSelectedCountries = multiTradeCountryList;
//       setSelectedTradeCountry(updatedSelectedCountries);
//       setFieldValue("countryCode", allCountryValues);
//       setFieldValue("fromDate", "");
//       setFieldValue("toDate", "");
//       setFieldValue("dateRange", "");
//       setMaxMinDate(updatedSelectedCountries, values.tradeType);
//     }

//     setSelectAll(!selectAll); // Toggle "Select All" checkbox state
//   };

//   const getDisplayText = () => {
//     if (selectedTradeCountry.length <= 2) {
//       return selectedTradeCountry.map((country) => country.label).join(", ");
//     }
//     return `${selectedTradeCountry[0].label}, ${selectedTradeCountry[1].label}, ...`;
//   };



//   return (
//     <>
//       {/* Box displaying selected countries */}
//       <div
//         className="country-box countryModal"
//         onClick={() => setShowModal(true)}
//       >
//         {selectedTradeCountry.length > 0 ? getDisplayText() : "Select Countries"}
//       </div>

//       {/* Modal for country selection */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Select Countries</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="row mb-3">
//             <div className="col-md-12">
//               <div className="d-flex align-items-center countryModal_data_div">
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={handleSelectAllChange}
//                 />
//                 <label>Select All</label>
//               </div>
//             </div>
//           </div>
//           {/* Grouped countries by continent */}
//           <div className='countryModalData'>
//             {Object.keys(groupedCountries).map((continent, index) => (
//               <div key={index} className="continent-section countryModal_contentSection" >
//                 <h5>{continent}</h5>
//                 <div className="row countryModal_row">
//                   {groupedCountries[continent].map((country) => (
//                     <div key={country.value} className="col-md-4">
//                       <div className="d-flex align-items-center countryModal_data_div">
//                         <input
//                           type="checkbox"
//                           checked={tempSelectedCountries.includes(country.value)}
//                           onChange={() => handleCheckboxChange(country.value)}
//                         />
//                         <label>
//                           {/* <ReactCountryFlag
//                             className="emojiFlag"
//                             countryCode={country.iso2code}
//                             style={{
//                               fontSize: '1.5em',
//                               lineHeight: '2em',
//                               paddingRight: '5px'
//                             }}
//                             aria-label={country.label}
//                           /> */}

//                           <Flag
//                             code={country.iso2code}
//                             style={{ width: '2em', height: '1.5em', marginRight: '5px' }}
//                             alt={country.label}
//                           />

//                           {country.label}
//                         </label>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

//---- country list show by continent @ 30.05.2025 ----//


// --- country modal modification with count @sarbojitghosh22 3-5-2025 --- //
const CountrySelector = ({ multiTradeCountryList, selectedTradeCountry, setFieldValue, values, setSelectedTradeCountry, setMaxMinDate,
    searchResult,
    setIsSearchClicked // Add this prop 09/02/2026

 }) => {

  const [showModal, setShowModal] = useState(false);
  const [tempSelectedCountries, setTempSelectedCountries] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // State to track "Select All" checkbox
  const [checkedCountryCount, setCheckedCountryCount] = useState(null); // State to store the count of checked countries
  const [countryRecords, setCountryRecords] = useState([]); // State to store records_count data
  const [countryPayload, setCountryPayload] = useState({})


  // Group countries by continent
  const groupedCountries = multiTradeCountryList.reduce((acc, country) => {
    const continent = country.continentName || "Unknown";
    if (!acc[continent]) {
      acc[continent] = [];
    }
    acc[continent].push(country);
    return acc;
  }, {});

/*09/02/2026 */
  // Add this useEffect in your List component
useEffect(() => {
  // Enable search button whenever selectedTradeCountry changes
  setIsSearchClicked(false);
}, [selectedTradeCountry]);

  // Synchronize tempSelectedCountries with selectedTradeCountry when it changes
  useEffect(() => {
    const selectedValues = selectedTradeCountry.map((country) => country.value);
    setTempSelectedCountries(selectedValues);
    setSelectAll(selectedValues.length === multiTradeCountryList.length); // Update "Select All" checkbox state
  }, [selectedTradeCountry, multiTradeCountryList]);

  const handleCheckboxChange = (shortcode) => {
    let updatedTempSelectedCountries;

    if (tempSelectedCountries.includes(shortcode)) {
      // Remove the country if it's already selected
      updatedTempSelectedCountries = tempSelectedCountries.filter((code) => code !== shortcode);
    } else {
      // Add the country if it's not selected
      updatedTempSelectedCountries = [...tempSelectedCountries, shortcode];
    }

// Check if this is a country change after first response
 /* if (searchResult.length > 0) {
    // Show confirmation dialog before reloading
    const shouldReload = window.confirm(
      "Changing countries will reset your search results and reload the page. Do you want to continue?"
    );
    
    if (shouldReload) {
      // If user confirms, reload the page
      window.location.reload();
      return; // Exit early since page will reload
    } else {
      // If user cancels, don't change the selection
      return;
    }
  }  */

    // Update the state and form values
    setTempSelectedCountries(updatedTempSelectedCountries);

    const updatedSelectedCountries = multiTradeCountryList.filter((country) =>
      updatedTempSelectedCountries.includes(country.value)
    );

    setSelectedTradeCountry(updatedSelectedCountries);
    setFieldValue("countryCode", updatedTempSelectedCountries);
    // setFieldValue("fromDate", "");
    // setFieldValue("toDate", "");
    // setFieldValue("dateRange", "");
    setMaxMinDate(updatedSelectedCountries, values.tradeType);

    // Update "Select All" checkbox state
    setSelectAll(updatedTempSelectedCountries.length === multiTradeCountryList.length);

    // Reset the count if manually checked/unchecked
    setCheckedCountryCount(null);

    setIsSearchClicked(false); // Add this line 09/02/2026
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      // Deselect all
      setTempSelectedCountries([]);
      setSelectedTradeCountry([]);
      setFieldValue("countryCode", []);
      setFieldValue("fromDate", "");
      setFieldValue("toDate", "");
      setFieldValue("dateRange", "");
      setMaxMinDate([], values.tradeType);
    } else {
      // Select all
      const allCountryValues = multiTradeCountryList.map((country) => country.value);
      setTempSelectedCountries(allCountryValues);

      const updatedSelectedCountries = multiTradeCountryList;
      setSelectedTradeCountry(updatedSelectedCountries);
      setFieldValue("countryCode", allCountryValues);
      // setFieldValue("fromDate", "");
      // setFieldValue("toDate", "");
      // setFieldValue("dateRange", "");
      setMaxMinDate(updatedSelectedCountries, values.tradeType);
    }

    setSelectAll(!selectAll); // Toggle "Select All" checkbox state

    // Reset the count if manually checked/unchecked
    setCheckedCountryCount(null);

    // ENABLE THE SEARCH BUTTON WHEN COUNTRY CHANGES
  setIsSearchClicked(false); // Add this line 09/02/2026
  };

  const handleOpenModal = async () => {
    setShowModal(true);

    // Make the API call only if there are selected countries
    if (selectedTradeCountry.length > 0) {
      const payload = {
        tradeType: values.tradeType,
        searchBy: values.searchBy,
        searchValue: values.searchValue,
        countryCode: values.countryCode,
        fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values.toDate).format("YYYY-MM-DD"),
        matchType: values.matchType,
        queryBuilder: values.queryBuilder,
        columnName: "ctry_name",
        consumptionType: [],
        incoterm: [],
        notifyParty: [],
        numberOfRecords: 20,
        orderByColumn: "",
        orderByMode: "desc",
        pageNumber: 0,
        searchType: "HISTORY",
        shipModeList: [],
        stdUnitList: [],
      };

      try {
        const response = await Axios({
          method: "POST",
          url: `/search-management/listdistinctcolumnvalue`,
          data: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Update the country records based on the API response
        if (response.data && response.data.distinctColumnValuesList) {
          setCountryRecords(response.data.distinctColumnValuesList);
        }
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    }
  };

  const getDisplayText = () => {
    if (selectedTradeCountry.length <= 2) {
      return selectedTradeCountry.map((country) => country.label).join(", ");
    }
    return `${selectedTradeCountry[0].label}, ${selectedTradeCountry[1].label}, ...`;
  };

  const getCountryLabelWithCount = (countryLabel) => {
    const record = countryRecords.find((item) => item.column_name === countryLabel);
    return record ? `${countryLabel} (${record.records_count})` : `${countryLabel} (0)`;
  };

  return (
    <>
      {/* Box displaying selected countries */}
      <div
        className="country-box countryModal"
        onClick={handleOpenModal}
      >
        {selectedTradeCountry.length > 0 ? getDisplayText() : "Select Countries"}
      </div>

      {/* Modal for country selection */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Countries</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex align-items-center countryModal_data_div">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <label>Select All</label>
              </div>
            </div>
          </div>
          {/* Display count of checked countries */}
          {checkedCountryCount !== null && (
            <div className="row mb-3">
              <div className="col-md-12">
                <p>Checked Countries: {checkedCountryCount}</p>
              </div>
            </div>
          )}
          {/* Grouped countries by continent */}
          <div className="countryModalData">
            {Object.keys(groupedCountries).map((continent, index) => (
              <div key={index} className="continent-section countryModal_contentSection">
                <h5>{continent}</h5>
                <div className="row countryModal_row">
                  {groupedCountries[continent].map((country) => (
                    <div key={country.value} className="col-md-4">
                      <div className="d-flex align-items-center countryModal_data_div">
                        <input
                          type="checkbox"
                          checked={tempSelectedCountries.includes(country.value)}
                          onChange={() => handleCheckboxChange(country.value)}
                        />
                        <label>
                          <Flag
                            code={country.iso2code}
                            style={{ width: "2em", height: "1.5em", marginRight: "5px" }}
                            alt={country.label}
                          />
                          {/* {getCountryLabelWithCount(country.label)} */}
                          {country.label} {/* Display country label */}

                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};



// --- country modal modification with count @sarbojitghosh22 3-5-2025 --- //


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
  // countryCode: Yup.array().of(Yup.string().required("This field is required")),    
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

const tempOptions = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];


const List = (props) => {

  const userId = localStorage.getItem("userToken");
  const user = localStorage.getItem("user");
  const loggedUser = user ? JSON.parse(user) : {};
  const userName = `${loggedUser.firstname} ${loggedUser.lastname}`;
  const userEmail = loggedUser.email;
  const userId_new = loggedUser.uplineId > 0 ? loggedUser.uplineId : loggedUser.userid

  const history = useHistory();
  const search_id = props.location.state ? props.location.state.search_id : null;


  const searchTypeValue = props.location.state && props.location.state.search_type ? props.location.state.search_type : "";
  const workspace_id = props.location.state && props.location.state.workspace_id ? props.location.state.workspace_id : "";
  const workspace_name = props.location.state ? props.location.state.workspace_name : "";
  const workspace_desc = props.location.state ? props.location.state.workspace_desc : "";
  const workspaceId = props.location.state ? props.location.state.workspaceId : "";
  const newSearch = [{ "value": props && props.location.state && props.location.state.searchValue, "label": props && props.location.state && props.location.state.searchValue }];

//console.log('list1 props.location.state:', props.location.state);
//console.log(newSearch);
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

  const [consumptionType, setConsumptionType] = useState([]);
  const [consumptionTypeDataList, setConsumptionTypeDataList] = useState([]);
  const [incoterm, setIncoterm] = useState([]);
  const [incotermListData, setIncotermListData] = useState([]);
  const [notifyParty, setNotifyParty] = useState([]);
  const [notifyPartyListData, setNotifyPartyListData] = useState([]);
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
  const [multiTradeCountryList, setMultiTradeCountryList] = useState([]);
  const [selectedTradeCountry, setSelectedTradeCountry] = useState([])
  const [searchValue, setSearchValue] = useState([]);
  const [queryBuilderSearchValue, setQueryBuilderSearchValue] = useState([]);
  const [showNewWorkspaceInput, setshowNewWorkspaceInput] = useState(false);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [filteredArray, setFilteredArray] = useState([]);
  const [countryWeightage, setCountryWeightage] = useState(1);

  /* For country filter array after search */
  const [filterCountryList, setFilterCountryList] = useState([]);
  const [selectedFilterCountryList, setSelectedFilterCountryList] = useState([]);
  /* 21/11/2025 */
  const [hasSearchResults, setHasSearchResults] = useState(false);

  /*04/02/2026 */
  const [indepthAccessCondition ,setIndepthAccessCondition]=useState();

  /*08/09/2025 New Download Loader */
  const [showDownloadLoader, setShowDownloadLoader] = useState(false);

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
      })
      .catch(err => {
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
      })
      .catch(err => {
        let errorMsg = "Somethhing went wrong, please try again."
      });

  }

  const UpdateDownloadTracher = (prevDownloadArray) => {

    let DownloadArray = props.downloadArray
    //console.log("Inside UpdateDownloadTracher DownloadArray",DownloadArray);
    //console.log("Inside UpdateDownloadTracher prevDownloadArray",prevDownloadArray);
     
    const params = {
      "userId": userId_new,
      "downloadedRecords": prevDownloadArray
    }
       // console.log("Inside UpdateDownloadTracher params",params);
    AxiosACT({
      method: "POST",
      url: "/activity-management/download-tracker/update",
      data: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        //console.log("Inside UpdateDownloadTracher Response ",res)
      })
      .catch(err => {

        let errorMsg = "Somethhing went wrong, please try again."
      });

  }

/*04/02/2026 Indepth Condition access for who have permission start */
  const getIndepthDisplayConditions = () => {
    // const userId = localStorage.getItem("userToken");
    // const user = localStorage.getItem("user");
    // const loggedUser = user ? JSON.parse(user) : {};

    let userId_new = loggedUser.uplineId > 0 ? loggedUser.uplineId : loggedUser.userid  

    AxiosUser({
      method: "GET",
      url: `/user-management/user-subscription/activelist?userId=${userId_new}`
    })
      .then(res => {
       setIndepthAccessCondition(res.data.userSubscriptionList[0].indepthAccess)
       // setSubscriptionDetails(res.data.userSubscriptionList[0]);
       console.log("indepthAccessCondition",indepthAccessCondition)
      })
      .catch(err => {
        // console.log("Err", err);
       // isLoading(true);
      });
  }

  useEffect(()=>{
    console.log("indepthAccessCondition",indepthAccessCondition);
  getIndepthDisplayConditions();
  },[indepthAccessCondition])

/*04/02/2026 Indepth Condition access for who have permission end */
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

      // --- code modification for countrycode value undefined while cliking sorting in table @sarbojitghosh22 29-7-2025 --- //

      if (typeof searchParams.countryCode === "undefined" && typeof apiSerachpayload.countryCode !== "undefined") {
        searchParams.countryCode = apiSerachpayload.countryCode;
      }

      // --- code modification for countrycode value undefined while cliking sorting in table @sarbojitghosh22 29-7-2025 --- //

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

      let checkValidErr = false
      let errMsg = ""
      if (values.searchBy == "HS_CODE") {
        values.searchValue.map((item, index) => {
          if (item.length < 2) {
            checkValidErr = true
            errMsg = "Search Values should be greater than or equal to 2 digits"
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

  const handleSearch = (values, countryList = [], searchType = "TRADE") => {
    setIsDownloaded("N")

    props.loadingStart()
    var params = [];
    params["searchType"] = searchType;
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

    /* code add start on 23-04-2025 */

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

    /* code end on 23-04-2025 */

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
    setHasSearchResults(false); // ADD THIS LINE
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

    //  window.resetFilter()
  }


const exportToCSV = async () => {
  console.log("Export All Call");


  /*22/12/2025 */

    // Calculate total weightage for all records
  const totalWeightage = totalRecord * countryWeightage;
  
  // Check against user's remaining download count
  const userDownloadCount = loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count;
  
  if (totalWeightage > userDownloadCount) {
    Swal.fire({
      title: 'Alert!',
      text: `You don't have enough download count. Available: ${userDownloadCount}, Required: ${totalWeightage}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
    });
    return;
  }

  // console.log("=== DOWNLOAD DEBUG ===");
  // console.log("Total records available:", totalRecord);
    
  if (totalRecord * countryWeightage <= props.maxDownload) {
    setShowDownloadLoader(true);
    
    if (searchParams && searchParams.tradeType) {
      if (typeof searchParams.countryCode === "undefined" && typeof apiSerachpayload.countryCode !== "undefined") {
        searchParams.countryCode = apiSerachpayload.countryCode;
      }

      try {
        // SIMPLE APPROACH: Request ALL records in ONE API call
        console.log(`Requesting all ${totalRecord} records in single API call...`);
        
        const postData = {
          "searchType": "TRADE",
          "tradeType": searchParams.tradeType,
          "fromDate": searchParams.fromDate,
          "toDate": searchParams.toDate,
          "searchBy": searchParams.searchBy,
          "searchValue": searchParams.searchValue,
          "countryCode": searchParams.countryCode,
          "pageNumber": 0,
          "numberOfRecords": totalRecord, //  Request ALL records
          "searchId": searchId, //  Use existing searchId
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
        };

        console.log("API Request payload:", postData);

        const response = await Axios({
          method: "POST",
          url: `search-management/search`,
          data: JSON.stringify(postData),
          headers: { "Content-Type": "application/json" }
        });

        console.log("API Response received:", response.data);

        // Extract data based on trade type
        const tempTradeType = searchParams.tradeType.toLowerCase();
        let allData = [];
        
        if (tempTradeType === "export") {
          allData = response.data.expForeignList || [];
        } else if (tempTradeType === "import") {
          allData = response.data.impForeignList || [];
        }

        console.log(`Extracted ${allData.length} records from API response`);

        // Process the collected data
        let filteredArray = [];
        
        for (let i = 0; i < allData.length; i++) {
          let filtered = {};
          let obj = allData[i];
          
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

         /*     let filteredArray = [];

      for (let i = 0; i < allData.length; i++) {
        let filtered = {};
        let obj = allData[i];
        
        for (let key in obj) {
          // Copy all properties that are not null or undefined
          if (obj[key] != null && obj[key] !== undefined) {
            filtered[key] = obj[key];
          }
        }
        filteredArray.push(filtered);
      } */

        console.log(`Final processed array length: ${filteredArray.length}`);
        
        setFilteredArray(filteredArray);
        downloadXLS(searchParams, 1, filteredArray);
        setShowDownloadLoader(false);

      } catch (error) {
        console.error("Error during download:", error);
        setShowDownloadLoader(false);
        Swal.fire({
          title: 'Download Error',
          text: `An error occurred during download: ${error.message}. Please try again.`,
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      }
      
    } else {
      setShowDownloadLoader(false);
      Swal.fire({
        title: 'Alert!',
        text: 'Please Search data first, then export',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  } else {
    setShowDownloadLoader(false);
    Swal.fire({
      title: 'Alert!',
      text: `You cannot download more than ${Math.round(props.maxDownload / countryWeightage)} records in a single search. Please refine your search criteria.`,
      icon: 'error',
      confirmButtonText: 'OK'
    });
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


    // --- code modification for countrycode value undefined while clicking sorting in table @sarbojitghosh22 29-7-2025 --- //
    if (typeof searchParams.countryCode === "undefined" && typeof apiSerachpayload.countryCode !== "undefined") {
      searchParams.countryCode = apiSerachpayload.countryCode;
    }
    // --- code modification for countrycode value undefined while clicking sorting in table @sarbojitghosh22 29-7-2025 --- //



    setFilteredArray(filteredArray)
    downloadXLS(searchParams, 2, filteredArray)

  };

  // const downloadXLS = (searchParams, dloadType, filteredArray) => {

  //   // console.log("searchParams >>>>>>>>>>>", searchParams)
  //   // console.log("filteredArray >>>>>>>>>>>", filteredArray)

  //   let prevDownloadArray = []
  //   let newIDArray = []
  //   let newValueArray = []; /* add on 12-05-2025 */
  //   prevDownloadArray = JSON.parse(JSON.stringify(props.downloadArray));
  //   // console.log("prevDownloadArray >>>>>>>>>>>", prevDownloadArray)

  //   for (let i = 0; i < filteredArray.length; i++) {

  //     let obj = filteredArray[i];
  //     if (!prevDownloadArray.includes(obj["id"])) {
  //       newIDArray.push(obj["id"]);
  //       prevDownloadArray.push(obj["id"]);
  //       newValueArray.push(obj); /* add on 12-05-2025 */
  //     }

  //   }

  //   // console.log("newIDArray >>>>>>>>>>>", newIDArray)
  //   console.log("newValueArray >>>>>>>>>>>", newValueArray)

  //   const totalNewWeightage = newValueArray.reduce((total, item) => {
  //     const match1 = multiTradeCountryList.find(country => country.value === item.ctry_code);
  //     return match1 ? total + match1.weightagePoints : total;
  //   }, 0);

  //   console.log("totalNewWeightage >>>>>>>>>>>", totalNewWeightage)

  //   const totalFilteredWeightage = filteredArray.reduce((total, item) => {
  //     const match = multiTradeCountryList.find(country => country.value === item.ctry_code);
  //     return match ? total + match.weightagePoints : total;
  //   }, 0);



  //   // let remainingDload = props.download_count - newIDArray.length * countryWeightage
  //   // let remainingDload_subUser = props.download_count_subUser - filteredArray.length * countryWeightage
  //   let remainingDload = props.download_count - totalNewWeightage;
  //   let remainingDload_subUser = props.download_count_subUser - totalFilteredWeightage;

  //   /* Save Download log into database (19-05-2025) --start*/
  //   const countryWeightageSummary = [];

  //   multiTradeCountryList.forEach((country) => {
  //     const countryCode = country.value;
  //     const countryName = country.label;
  //     const weightagePoints = country.weightagePoints;

  //     const countryData = filteredArray.filter(item => item.ctry_code === countryCode);
  //     const totalCount = countryData.length;
  //     const totalWeightage = totalCount * weightagePoints;

  //     if (totalCount > 0) {
  //       countryWeightageSummary.push({
  //         countryName,
  //         weightagePoints,
  //         totalCount,
  //         totalWeightage
  //       });
  //     }
  //   });

  //   /* Save Download log into database (19-05-2025) --End*/

  //   if (remainingDload > 0) {

  //     console.log("remainingDload_subUser >>>>>>>>>>>", remainingDload)

  //     if ((loggedUser.uplineId > 0 && remainingDload_subUser > 0) || (loggedUser.uplineId == 0)) {
  //       Swal.fire({
  //         title: 'Download!',
  //         html: `Available Download <b>${loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count}</b>. <br> Total Record to Download <b>${loggedUser.uplineId > 0 ? filteredArray.length : newIDArray.length}</b>. 
  //       <br> Total Points to deduct <b>${loggedUser.uplineId > 0 ? totalFilteredWeightage : totalNewWeightage}</b>.<br> Remaining Download <b>${loggedUser.uplineId > 0 ? remainingDload_subUser : remainingDload}</b>. <br> Are you sure you want to Download ?`,
  //         icon: 'warning',
  //         dangerMode: true,
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //       }).then((isConfirm) => {
  //         if (isConfirm.value) {

  //           const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  //           const fileExtension = ".xlsx";
  //           // const fileName = searchParams.tradeType + "_" + searchParams.countryCode + "_" + searchParams.fromDate + "_" + searchParams.toDate;
  //           const fileName = searchParams.tradeType + "_" + 'global' + "_" + searchParams.fromDate + "_" + searchParams.toDate;

  //           // const ws = XLSX.utils.json_to_sheet(filteredArray);

  //           const ws = XLSX.utils.table_to_sheet(document.getElementById("reportXLS"), { header: 1 });

  //           const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //           const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //           const data = new Blob([excelBuffer], { type: fileType });
  //           FileSaver.saveAs(data, fileName + fileExtension);
  //           setSearchLoading(false);

  //           /* Save API Download log into database (19-05-2025) --Start*/
  //           let saveLogPayload = {
  //             "searchId": searchId,
  //             "downloadJson": JSON.stringify(countryWeightageSummary),
  //             "recordsDownloaded": loggedUser.uplineId > 0 ? filteredArray.length : newIDArray.length,
  //             "initialCredit": loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count,
  //             "remainingCredit": loggedUser.uplineId > 0 ? remainingDload_subUser : remainingDload
  //           }
  //           saveDownloadLog(saveLogPayload);
  //           /* Save API Download log into database (19-05-2025) --End*/

  //           loggedUser.uplineId > 0 ?
  //             props.setDloadCountSubuser({ download_count_subUser: remainingDload_subUser }) :
  //             props.updateSubscriptionCount({
  //               download_count: remainingDload,
  //               subscriptionId: props.subscriptionId,
  //               dataAccess_count: props.dataAccess_count,
  //               subUserCount: props.subUserCount,
  //               totalWorkspace: props.totalWorkspace,
  //               queryPerDay: props.queryPerDay
  //             })

  //           if (newIDArray.length > 0) {
  //             props.updateDownloadArrayCount(
  //               {
  //                 downloadArray: prevDownloadArray
  //               })
  //           }

  //           UpdateSubscription({ "downloadLimit": remainingDload })
  //           if (loggedUser.uplineId > 0) {
  //             UpdateUser({ "downloadLimit": remainingDload_subUser })
  //           }
  //           UpdateDownloadTracher(prevDownloadArray)
  //           downloadSearch(searchId, filteredArray.length)
  //         }

  //       })
  //     }
  //     else {
  //       Swal.fire({
  //         title: 'Download!',
  //         text: "Your Download Limit Exhausted",
  //         icon: 'error',
  //         dangerMode: true,
  //         confirmButtonColor: '#3085d6',
  //       }).then((isConfirm) => { })
  //     }
  //   }
  //   else {
  //     Swal.fire({
  //       title: 'Download!',
  //       text: "Your Download Limit Exhausted",
  //       icon: 'error',
  //       dangerMode: true,
  //       confirmButtonColor: '#3085d6',
  //     }).then((isConfirm) => { })
  //   }


  // }

  // --- user can not download same file multiple times code start @sarbojitghosh22 12-08-2025 --- //

  const downloadXLS_old = (searchParams, dloadType, filteredArray) => {
    // console.log("downloadXLS_old");
    let prevDownloadArray = []
    let newIDArray = []
    let newValueArray = []; /* add on 12-05-2025 */
    prevDownloadArray = JSON.parse(JSON.stringify(props.downloadArray));

    for (let i = 0; i < filteredArray.length; i++) {
      let obj = filteredArray[i];
      if (!prevDownloadArray.includes(obj["id"])) {
        newIDArray.push(obj["id"]);
        prevDownloadArray.push(obj["id"]);
        newValueArray.push(obj); /* add on 12-05-2025 */
      }
    }

    // Add SI column as the value of id for each row
    const newValueArrayWithSI = newValueArray.map(item => ({
      // SI: item.id,
      ...item
    }));

    const totalNewWeightage = newValueArray.reduce((total, item) => {
      const match1 = multiTradeCountryList.find(country => country.value === item.ctry_code);
      return match1 ? total + match1.weightagePoints : total;
    }, 0);

    const totalFilteredWeightage = filteredArray.reduce((total, item) => {
      const match = multiTradeCountryList.find(country => country.value === item.ctry_code);
      return match ? total + match.weightagePoints : total;
    }, 0);

    let remainingDload = props.download_count - totalNewWeightage;
    let remainingDload_subUser = props.download_count_subUser - totalFilteredWeightage;

    /* Save Download log into database (19-05-2025) --start*/
    const countryWeightageSummary = [];

    multiTradeCountryList.forEach((country) => {
      const countryCode = country.value;
      const countryName = country.label;
      const weightagePoints = country.weightagePoints;

      const countryData = filteredArray.filter(item => item.ctry_code === countryCode);
      const totalCount = countryData.length;
      const totalWeightage = totalCount * weightagePoints;

      if (totalCount > 0) {
        countryWeightageSummary.push({
          countryName,
          weightagePoints,
          totalCount,
          totalWeightage
        });
      }
    });

    /* Save Download log into database (19-05-2025) --End*/

    if (remainingDload > 0) {

      if ((loggedUser.uplineId > 0 && remainingDload_subUser > 0) || (loggedUser.uplineId == 0)) {
        Swal.fire({
          title: 'Download!',
          html: `Available Download <b>${loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count}</b>. <br> Total Record to Download <b>${loggedUser.uplineId > 0 ? filteredArray.length : newIDArray.length}</b>. 
        <br> Total Points to deduct <b>${loggedUser.uplineId > 0 ? totalFilteredWeightage : totalNewWeightage}</b>.<br> Remaining Download <b>${loggedUser.uplineId > 0 ? remainingDload_subUser : remainingDload}</b>. <br> Are you sure you want to Download ?`,
          icon: 'warning',
          dangerMode: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((isConfirm) => {
          if (isConfirm.value) {

            const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";
            const fileName = searchParams.tradeType + "_" + 'global' + "_" + searchParams.fromDate + "_" + searchParams.toDate;

            // Use newValueArrayWithSI for export
            const ws = XLSX.utils.json_to_sheet(newValueArrayWithSI);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
            setSearchLoading(false);

            /* Save API Download log into database (19-05-2025) --Start*/
            let saveLogPayload = {
              "searchId": searchId,
              "downloadJson": JSON.stringify(countryWeightageSummary),
              "recordsDownloaded": loggedUser.uplineId > 0 ? filteredArray.length : newIDArray.length,
              "initialCredit": loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count,
              "remainingCredit": loggedUser.uplineId > 0 ? remainingDload_subUser : remainingDload
            }
            saveDownloadLog(saveLogPayload);
            /* Save API Download log into database (19-05-2025) --End*/

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

  // --- user can not download same file multiple times code end  @sarbojitghosh22 12-08-2025 --- //


  // --- user can not download same file multiple times code start @sarbojitghosh22 12-08-2025 --- //


  // const downloadXLS = (searchParams, dloadType, filteredArray) => {
  //    console.log("download xls >>>>>>>>>>>");
    
  //    const newIDArray=[];
  //    const prevDownloadArray=[];
  //   const newValueArray = [...filteredArray];
  //   const newValueArrayWithSI = newValueArray.map(item => ({
  //     // SI: item.id,
  //     ...item
  //   }));

  //   const totalNewWeightage = newValueArray.reduce((total, item) => {
  //     const match1 = multiTradeCountryList.find(country => country.value === item.ctry_code);
  //     return match1 ? total + match1.weightagePoints : total;
  //   }, 0);

  //   const totalFilteredWeightage = filteredArray.reduce((total, item) => {
  //     const match = multiTradeCountryList.find(country => country.value === item.ctry_code);
  //     return match ? total + match.weightagePoints : total;
  //   }, 0);

  //   let remainingDload = props.download_count - totalNewWeightage;
  //   let remainingDload_subUser = props.download_count_subUser - totalFilteredWeightage;

  //   /* Save Download log into database (19-05-2025) --start*/
  //   const countryWeightageSummary = [];

  //   multiTradeCountryList.forEach((country) => {
  //     const countryCode = country.value;
  //     const countryName = country.label;
  //     const weightagePoints = country.weightagePoints;

  //     const countryData = filteredArray.filter(item => item.ctry_code === countryCode);
  //     const totalCount = countryData.length;
  //     const totalWeightage = totalCount * weightagePoints;

  //     if (totalCount > 0) {
  //       countryWeightageSummary.push({
  //         countryName,
  //         weightagePoints,
  //         totalCount,
  //         totalWeightage
  //       });
  //     }
  //   });
  //   /* Save Download log into database (19-05-2025) --End*/


  //   if (remainingDload > 0) {

  //     if ((loggedUser.uplineId > 0 && remainingDload_subUser > 0) || (loggedUser.uplineId == 0)) {
  //       Swal.fire({
  //         title: 'Download!',
  //         html: `Available Download <b>${loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count}</b>. <br> Total Record to Download <b>${filteredArray.length}</b>. 
  //       <br> Total Points to deduct <b>${loggedUser.uplineId > 0 ? totalFilteredWeightage : totalNewWeightage}</b>.<br> Remaining Download <b>${loggedUser.uplineId > 0 ? remainingDload_subUser : remainingDload}</b>. <br> Are you sure you want to Download ?`,
  //         icon: 'warning',
  //         dangerMode: true,
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //       }).then((isConfirm) => {
  //         if (isConfirm.value) {

  //           const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  //           const fileExtension = ".xlsx";
  //           const fileName = searchParams.tradeType + "_" + 'global' + "_" + searchParams.fromDate + "_" + searchParams.toDate;

  //           // Use newValueArrayWithSI for export
  //           const ws = XLSX.utils.json_to_sheet(newValueArrayWithSI);
  //           const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //           const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //           const data = new Blob([excelBuffer], { type: fileType });
  //           FileSaver.saveAs(data, fileName + fileExtension);
  //           setSearchLoading(false);

  //           /* Save API Download log into database (19-05-2025) --Start*/
  //           let saveLogPayload = {
  //             "searchId": searchId,
  //             "downloadJson": JSON.stringify(countryWeightageSummary),
  //             "recordsDownloaded": filteredArray.length,
  //             "initialCredit": loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count,
  //             "remainingCredit": loggedUser.uplineId > 0 ? remainingDload_subUser : remainingDload
  //           }
  //         //  saveDownloadLog(saveLogPayload);
  //           /* Save API Download log into database (19-05-2025) --End*/

  //           loggedUser.uplineId > 0 ?
  //             props.setDloadCountSubuser({ download_count_subUser: remainingDload_subUser }) :
  //             props.updateSubscriptionCount({
  //               download_count: remainingDload,
  //               subscriptionId: props.subscriptionId,
  //               dataAccess_count: props.dataAccess_count,
  //               subUserCount: props.subUserCount,
  //               totalWorkspace: props.totalWorkspace,
  //               queryPerDay: props.queryPerDay
  //             })

  //           // --- MODIFICATION START ---
  //           // The following calls that update the download history array have been removed
  //           // as they are no longer needed.
            
  //           if (newIDArray.length > 0) {
  //             props.updateDownloadArrayCount(
  //               {
  //                 downloadArray: prevDownloadArray
  //               })
  //           }
  //           UpdateDownloadTracher(prevDownloadArray)
            
  //           // --- MODIFICATION END ---


  //           UpdateSubscription({ "downloadLimit": remainingDload })
  //           if (loggedUser.uplineId > 0) {
  //             UpdateUser({ "downloadLimit": remainingDload_subUser })
  //           }
  //           downloadSearch(searchId, filteredArray.length)
  //         }

  //       })
  //     }
  //     else {
  //       Swal.fire({
  //         title: 'Download!',
  //         text: "Your Download Limit Exhausted",
  //         icon: 'error',
  //         dangerMode: true,
  //         confirmButtonColor: '#3085d6',
  //       }).then((isConfirm) => { })
  //     }
  //   }
  //   else {
  //     Swal.fire({
  //       title: 'Download!',
  //       text: "Your Download Limit Exhausted",
  //       icon: 'error',
  //       dangerMode: true,
  //       confirmButtonColor: '#3085d6',
  //     }).then((isConfirm) => { })
  //   }
  // }

  /* new 05/09/2025 if i download same file again then point is not deduct */
const downloadXLS = (searchParams, dloadType, filteredArray) => {
   console.log("new download xls >>>>>>>>>>>");
  // console.log("filteredArray length >>>>>>>>>>>", filteredArray.length);
  // console.log("props.downloadArray length >>>>>>>>>>>", (props.downloadArray || []).length);
  // console.log("props.downloadArray >>>>>>>>>>>", props.downloadArray);
  // console.log("searchParams >>>>>>>>>>>", searchParams);
  // console.log("multiTradeCountryList >>>>>>>>>>>", multiTradeCountryList);
  // console.log("dloadType >>>>>>>>>>>", dloadType);
  // Add file size check
  // ✅ UPDATED: Use dynamic MAX_RECORDS based on user limits
  const DEFAULT_MAX_RECORDS = 10000;
  const MAX_RECORDS = props.maxDownload || DEFAULT_MAX_RECORDS;
  console.log(`Using MAX_RECORDS: ${MAX_RECORDS} (props.maxDownload: ${props.maxDownload})`);
  //totalRecord > MAX_RECORDS
 if (filteredArray.length > MAX_RECORDS) {
    Swal.fire({
      title: 'File Too Large',
      text: `Cannot download more than ${MAX_RECORDS.toLocaleString()} records at once. You are trying to download ${filteredArray.length.toLocaleString()} records. Please refine your search.`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
    });
    return;
  }

  //  ADD TEXT TRUNCATION FUNCTION
  const truncateLongText = (data) => {
    const MAX_CELL_LENGTH = 32767;
    return data.map(row => {
      const cleanedRow = {};
      for (let key in row) {
        if (row.hasOwnProperty(key)) {
          let value = row[key];
          if (value !== null && value !== undefined) {
            const stringValue = String(value);
            if (stringValue.length > MAX_CELL_LENGTH) {
              cleanedRow[key] = stringValue.substring(0, MAX_CELL_LENGTH - 20) + "... [TRUNCATED]";
              console.warn(`Truncated field '${key}' from ${stringValue.length} to ${MAX_CELL_LENGTH} characters`);
            } else {
              cleanedRow[key] = value;
            }
          } else {
            cleanedRow[key] = value;
          }
        }
      }
      return cleanedRow;
    });
  };

  // Get previously downloaded IDs from Redux
  let prevDownloadArray = JSON.parse(JSON.stringify(props.downloadArray || []));
  let newIDArray = [];
  let newValueArray = [];

  // Only add records that have NOT been downloaded before
  for (let i = 0; i < filteredArray.length; i++) {
    let obj = filteredArray[i];
    if (!prevDownloadArray.includes(obj["id"])) {
      newIDArray.push(obj["id"]);
      prevDownloadArray.push(obj["id"]);
      newValueArray.push(obj);
    }
  }

  // APPLY TRUNCATION TO FILTERED ARRAY 
  const filteredArrayWithSI = truncateLongText(filteredArray);

  // Rest of your existing code for weightage calculations...
  const totalNewWeightage = newValueArray.reduce((total, item) => {
    const match1 = multiTradeCountryList.find(country => country.value === item.ctry_code);
    return match1 ? total + match1.weightagePoints : total;
  }, 0);

  const totalFilteredWeightage = filteredArray.reduce((total, item) => {
    const match = multiTradeCountryList.find(country => country.value === item.ctry_code);
    return match ? total + match.weightagePoints : total;
  }, 0);

  let remainingDload = props.download_count - totalNewWeightage;
  let remainingDload_subUser = props.download_count_subUser - totalFilteredWeightage;

  // Country weightage summary
  const countryWeightageSummary = [];
  multiTradeCountryList.forEach((country) => {
    const countryCode = country.value;
    const countryName = country.label;
    const weightagePoints = country.weightagePoints;
    const countryData = filteredArray.filter(item => item.ctry_code === countryCode);
    const totalCount = countryData.length;
    const totalWeightage = totalCount * weightagePoints;
    if (totalCount > 0) {
      countryWeightageSummary.push({
        countryName,
        weightagePoints,
        totalCount,
        totalWeightage
      });
    }
  });

  let infoMsg = "";
  if (newValueArray.length === 0) {
    infoMsg = "All selected records have already been downloaded. No points will be deducted.";
  }

  if (remainingDload > 0 || newValueArray.length === 0) {
    if ((loggedUser.uplineId > 0 && remainingDload_subUser > 0) || (loggedUser.uplineId == 0) || newValueArray.length === 0) {
      setShowDownloadLoader(false);
      
      Swal.fire({
        title: 'Download!',
        html: `
          Available Download <b>${loggedUser.uplineId > 0 ? props.download_count_subUser : props.download_count}</b>.<br>
          Total Records to Download <b>${filteredArray.length}</b>.<br>
          Total Points to deduct <b>${loggedUser.uplineId > 0 ? totalFilteredWeightage : totalNewWeightage}</b>.<br>
          Remaining Download <b>${loggedUser.uplineId > 0 ? remainingDload_subUser : remainingDload}</b>.<br>
          ${infoMsg ? `<span style='color:red;'>${infoMsg}</span>` : "Are you sure you want to Download?"}
        `,
        icon: newValueArray.length === 0 ? 'info' : 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((isConfirm) => {
        if (isConfirm.value) {
          //  ADD ERROR HANDLING FOR FILE GENERATION 
          try {
            const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";
            const fileName = searchParams.tradeType + "_" + 'global' + "_" + searchParams.fromDate + "_" + searchParams.toDate;

            //  USE TRUNCATED DATA FOR EXCEL GENERATION 
            const ws = XLSX.utils.json_to_sheet(filteredArrayWithSI);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            
            // Add compression for large files
            const writeOptions = filteredArray.length > 2000 
              ? { bookType: "xlsx", type: "array", compression: true }
              : { bookType: "xlsx", type: "array" };
              
            const excelBuffer = XLSX.write(wb, writeOptions);
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
            
            setSearchLoading(false);
            setShowDownloadLoader(false);

            // Only deduct points and update download array if there are new records
            if (newIDArray.length > 0) {
              loggedUser.uplineId > 0 ?
                props.setDloadCountSubuser({ download_count_subUser: remainingDload_subUser }) :
                props.updateSubscriptionCount({
                  download_count: remainingDload,
                  subscriptionId: props.subscriptionId,
                  dataAccess_count: props.dataAccess_count,
                  subUserCount: props.subUserCount,
                  totalWorkspace: props.totalWorkspace,
                  queryPerDay: props.queryPerDay
                });

              props.updateDownloadArrayCount({ downloadArray: prevDownloadArray });
              UpdateDownloadTracher(prevDownloadArray);
              UpdateSubscription({ "downloadLimit": remainingDload });
              if (loggedUser.uplineId > 0) {
                UpdateUser({ "downloadLimit": remainingDload_subUser });
              }
            }
            downloadSearch(searchId, filteredArray.length);
            
          } catch (fileError) {
            console.error("File generation error:", fileError);
            setShowDownloadLoader(false);
            
            // Specific error handling for text length issues
            if (fileError.message.includes("Text length must not exceed")) {
              Swal.fire({
                title: 'Data Contains Large Text',
                text: 'Some records have very long text fields that exceed Excel limits. The system has automatically truncated them to allow download.',
                icon: 'info',
                confirmButtonColor: '#3085d6',
              });
            } else {
              Swal.fire({
                title: 'File Generation Error',
                text: `Error: ${fileError.message}. Please try with fewer records.`,
                icon: 'error',
                confirmButtonColor: '#3085d6',
              });
            }
          }
        }
      });
    } else {
      // Handle exhausted limits...
    }
  } else {
    // Handle exhausted limits...
  }
};
  // --- user can not download same file multiple times code end @sarbojitghosh22 12-08-2025 --- //


  const saveDownloadLog = (params) => {
  // console.log("saveDownloadLog -> params");
    AxiosUser({
      method: "PUT",
      url: `download-log/save`,
      data: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {

      })
      .catch(err => {

        let errorMsg = "Somethhing went wrong, please try again."
      });
  }    

  const [apiSerachpayload, setApiSearchPayload] = useState({})

  // --- box counts update for all country filter in table @sarbojitghosh22 9/7/2025 --- //

  useEffect(() => {
    if (apiSerachpayload && Object.keys(apiSerachpayload).length > 0) {
      // getSearchData(apiSerachpayload);

      console.log("apiSerachpayload after any modfication",apiSerachpayload);
      getHSCodeList({ ...apiSerachpayload });
      getTotalCount({ ...apiSerachpayload }, searchId);
      getForeignCountryList({ ...apiSerachpayload });
      getExporterList({ ...apiSerachpayload });
      getImporterList({ ...apiSerachpayload });
    }
  }, [apiSerachpayload]);

    /*12/02/2026 Start this is use because after country change second time then country not updated*/
    const payloadRef = useRef(apiSerachpayload);
    useEffect(() => {
      payloadRef.current = apiSerachpayload;
    }, [apiSerachpayload]);
  /*12/02/2026 End */

  // --- box counts update for all country filter in table @sarbojitghosh22 9/7/2025 --- //


  const getSearchData = (params, countryList = []) => {
  //console.log("getSearchData -> params", params);
    // console.log("getSearchData From Workspace download to list1-> params", params);
    scrollToRef(gridRef);
    setSearchLoading(true);
    isTotalRecordLoading(true)
    // let updatedCountryList = tradeCountryList && tradeCountryList.length == 0 ? countryList : tradeCountryList
    // let selectedCountry = updatedCountryList.filter((item) => item.shortcode ==  (countryCode ? countryCode : params.countryCode))


    params["tradeType"] == "E" || params["tradeType"] == "EXPORT" ? setCountryWeightage(1) : setCountryWeightage(1)

    let tempSearchResult = []
    // "searchId": searchId,
    const postData = {
      "searchType": params.searchType,
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc,
      "searchId": params.searchId ? params.searchId : '',

    }

    if (params.returnSearchId) {
      postData["searchId"] = params.returnSearchId
    }
    if (search_id && (workspace_id == undefined || workspace_id == "")) {
      if (!params.isMainSearch) {
        postData["searchId"] = search_id
      }
    }

    setApiSearchPayload(postData)

    Axios({
      method: "POST",
      url: `search-management/search`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        console.log("search res", res);
        props.setSearchQuery(postData);
        // if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() != "IND" && params.countryCode.toUpperCase() != "SEZ") {
        //   tempSearchResult = res.data.expForeignList
        // }
        // else if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() === "IND") {
        //   tempSearchResult = res.data.expIndList
        // }
        // else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() != "IND" && params.countryCode.toUpperCase() != "SEZ") {
        //   tempSearchResult = res.data.impForeignList
        // }
        // else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() === "IND") {
        //   tempSearchResult = res.data.impIndList
        // }
        // else if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() === "SEZ") {
        //   tempSearchResult = res.data.expIndList
        // }
        // else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() === "SEZ") {
        //   tempSearchResult = res.data.impIndList
        // }
        const countryCodes = params.countryCode.map(code => code.toUpperCase());
        const isIND = countryCodes.includes("IND");
        const isSEZ = countryCodes.includes("SEZ");
        const isForeign = !isIND && !isSEZ;

        const tempTradeType = params.tradeType.toLowerCase();

        // if (tempTradeType === "export" && isForeign) {
        //   tempSearchResult = res.data.expForeignList;
        // } else if (tempTradeType === "export" && isIND) {
        //   tempSearchResult = res.data.expIndList;
        // } else if (tempTradeType === "export" && isSEZ) {
        //   tempSearchResult = res.data.expIndList;
        // } else if (tempTradeType === "import" && isForeign) {
        //   tempSearchResult = res.data.impForeignList;
        // } else if (tempTradeType === "import" && isIND) {
        //   tempSearchResult = res.data.impIndList;
        // } else if (tempTradeType === "import" && isSEZ) {
        //   tempSearchResult = res.data.impIndList;
        // } else {
        //   tempSearchResult = []
        // }

        /* change on 24-04-2025 */
        if (tempTradeType === "export") {
          tempSearchResult = res.data.expForeignList;
        } else if (tempTradeType === "import") {
          tempSearchResult = res.data.impForeignList;
        } else {
          tempSearchResult = []
        }
        /* change on 24-04-2025 */

        if (tempSearchResult && tempSearchResult.length > 0) {


          setSearchResult(tempSearchResult);
          setHasSearchResults(true); // Make sure this line is present
          setNoDataErrorMsg(false)
          getTotalCount(params, res.data.searchId);

          let filteredColumn = []
          let objColumns = Object.keys(tempSearchResult[0]);
          for (var x in objColumns) {

            if (tempSearchResult[0][objColumns[x]] != null) {
              filteredColumn.push(objColumns[x]);
            }
          }

          // ✅ ADD: Force include essential columns even if null in first record for also display null columns
          // for key: 'std_unit_rate_usd', label: 'Std. Unit Price $' , 'unit_rate_usd', 'value_usd'
          /*const essentialColumns = ['std_unit_rate_usd'];
          essentialColumns.forEach(col => {
            if (!filteredColumn.includes(col) && objColumns.includes(col)) {
              filteredColumn.push(col);
            }
          });  */

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


          /* After search set country Filter array */
          Axios({
            method: "POST",
            url: `search-management/countrywisecount`,
            data: JSON.stringify(postData),
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(countryRes => {

             /* 
              let tempdata = countryRes.data;
              let tempOptions = tempdata.countryWiseCount.map(({ ctry_code, ctry_name, shipment_count }) => ({
                label: `${ctry_name} (${shipment_count})`,
                value: ctry_code
              }));*/
              // console.log("Country LIST PAGE", countryRes);

              let tempdata = countryRes.data || {};  // ensure it's an object
              let tempOptions = [];

              // Check if countryWiseCount exists and is an array
              if (Array.isArray(tempdata.countryWiseCount)) {
                tempOptions = tempdata.countryWiseCount.map(({ ctry_code, ctry_name, shipment_count }) => ({
                  label: `${ctry_name} (${shipment_count})`,
                  value: ctry_code
                }));
              }


              setFilterCountryList(tempOptions);
            })


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

          /* After search set consumptionType Data array for advance search*/
          await getConsumptionTypeDataList(postData);
          /* After search set Incoterm list Data array for advance search*/
          await getIncotermListDataList(postData);
          /* After search set Notify Party list Data array for advance search*/
          await getNotifyPartyListDataList(postData);
        }
        else {
          setSearchResult([]);
          setHasSearchResults(false); // Make sure this line is present
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
         setHasSearchResults(false); // ADD THIS LINE
        setSearchLoading(false);
        setFilteredColumn([])
        props.loadingStop()
      });
  }

  const getPaginationSearchData = (params) => {

    // console.log("pagination search params ::", params)

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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc

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
        console.log("search res pagination ", res);
        // if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() != "IND" && params.countryCode.toUpperCase() != "SEZ") {
        //   tempSearchResult = res.data.expForeignList
        // }
        // else if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() === "IND") {
        //   tempSearchResult = res.data.expIndList
        // }
        // else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() != "IND" && params.countryCode.toUpperCase() != "SEZ") {
        //   tempSearchResult = res.data.impForeignList
        // }
        // else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() === "IND") {
        //   tempSearchResult = res.data.impIndList
        // }
        // else if (params.tradeType.toLowerCase() === "export" && params.countryCode.toUpperCase() === "SEZ") {
        //   tempSearchResult = res.data.expIndList
        // }
        // else if (params.tradeType.toLowerCase() === "import" && params.countryCode.toUpperCase() === "SEZ") {
        //   tempSearchResult = res.data.impIndList
        // }
        const countryCodes = params.countryCode.map(code => code.toUpperCase());
        const isIND = countryCodes.includes("IND");
        const isSEZ = countryCodes.includes("SEZ");
        const isForeign = !isIND && !isSEZ;

        const tempTradeType = params.tradeType.toLowerCase();

        // if (tempTradeType === "export" && isForeign) {
        //   tempSearchResult = res.data.expForeignList;
        // } else if (tempTradeType === "export" && isIND) {
        //   tempSearchResult = res.data.expIndList;
        // } else if (tempTradeType === "export" && isSEZ) {
        //   tempSearchResult = res.data.expIndList;
        // } else if (tempTradeType === "import" && isForeign) {
        //   tempSearchResult = res.data.impForeignList;
        // } else if (tempTradeType === "import" && isIND) {
        //   tempSearchResult = res.data.impIndList;
        // } else if (tempTradeType === "import" && isSEZ) {
        //   tempSearchResult = res.data.impIndList;
        // }
        // else {
        //   tempSearchResult = []
        // }

        /* change on 24-04-2025 */
        if (tempTradeType === "export") {
          tempSearchResult = res.data.expForeignList;
        } else if (tempTradeType === "import") {
          tempSearchResult = res.data.impForeignList;
        } else {
          tempSearchResult = []
        }
        /* change on 24-04-2025 */

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
  // params.countryCode = apiSerachpayload.countryCode;
     const latestCountry = payloadRef.current.countryCode; // 🔥 REAL LATEST 12/02/2026+
    isTotalRecordLoading(true)
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
     // "countryCode": params.countryCode,
     "countryCode": latestCountry,
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
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
       // updateSearchCount(res.data, searchID)
        //20/08/2025 Tanwir , searchID place inside if.
        if(searchID){
            updateSearchCount(res.data, searchID)
        }
        setTimeout(isTotalRecordLoading(false), 1000)

      })
      .catch(err => {
        // console.log("Err", err);
        setTotalRecord(0);
        setNoDataErrorMsg(true)
      });
  }

  const updateSearchCount = (totalRecords, searchID) => {
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

      })
      .catch(err => {

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
    //     })
    //     .catch(err => {
    //     });
    // }
    // } 

  }


  const getImporterList = (params) => {

   // console.log("getImporterList -> params", params);
    //params.countryCode = apiSerachpayload.countryCode;
const latestCountry = payloadRef.current.countryCode; // 🔥 REAL LATEST 12/02/2026
    isImporterLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
      //"countryCode": params.countryCode,
      "countryCode": latestCountry,
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
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
   // params.countryCode = apiSerachpayload.countryCode;
 const latestCountry = payloadRef.current.countryCode; // 🔥 REAL LATEST 12/02/2026
    isExporterLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
     // "countryCode": params.countryCode,
     "countryCode": latestCountry,
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
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
        // console.log("exportList", exporterDataList)
        isExporterLoading(false);
      })
      .catch(err => {
        // console.log("Err", err);
        setExporterDataList([]);
        isExporterLoading(false);
      });
  }

  const getPortOriginList = (params) => {
    params.countryCode = apiSerachpayload.countryCode; // <-- Always use latest

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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc


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
    params.countryCode = apiSerachpayload.countryCode; // <-- Always use latest

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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
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

    console.log("params inside ",params.countryCode)
   // params.countryCode = apiSerachpayload.countryCode; // <-- Always use latest
   /*12/02/2026 */
    const latestCountry = payloadRef.current.countryCode; // 🔥 REAL LATEST
    isHscodeLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": moment(params.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(params.toDate).format("YYYY-MM-DD"),
      "searchBy": params.searchBy ? params.searchBy : "HS_CODE",
      "searchValue": params.searchValue ? params.searchValue : ["2"],
     // "countryCode": params.countryCode,
     "countryCode":latestCountry,
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
    }

    console.log("HS Code Paylload",postData , params.countryCode , apiSerachpayload.countryCode);
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
       // console.log("HS CODE LIST", hsList);
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
    params.countryCode = apiSerachpayload.countryCode; // <-- Always use latest

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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
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
       // console.log("HS CODE 4 digit LIST", hsList);
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
  //  params.countryCode = apiSerachpayload.countryCode;
const latestCountry = payloadRef.current.countryCode; // 🔥 REAL LATEST 12/02/2026
    isCoLoading(true);
    const postData = {
      "searchType": "TRADE",
      "tradeType": params.tradeType,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "searchBy": params.searchBy,
      "searchValue": params.searchValue,
     // "countryCode": params.countryCode,
     "countryCode": latestCountry,
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
    }

    console.log("API payload", postData)
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
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
      "stdUnitList": params.stdUnitList,
      "rangeQuantityStart": params.rangeQuantityStart,
      "rangeQuantityEnd": params.rangeQuantityEnd,
      "consumptionType": params.consumptionType,
      "rangeValueUsdStart": params.rangeValueUsdStart,
      "rangeValueUsdEnd": params.rangeValueUsdEnd,
      "rangeUnitPriceUsdStart": params.rangeUnitPriceUsdStart,
      "rangeUnitPriceUsdEnd": params.rangeUnitPriceUsdEnd,
      "incoterm": params.incoterm,
      "notifyParty": params.notifyParty,
      "productDesc": params.productDesc,
      "conditionProductDesc": params.conditionProductDesc
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
       // console.log("STD UNIT LIST", icList);
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
     console.log("updateFilter data in list1", data);
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
    if (data.consumptionType) {
      setConsumptionType(data.consumptionType);
    }
    if (data.incoterm) {
      setIncoterm(data.incoterm);
    }
    if (data.notifyParty) {
      setNotifyParty(data.notifyParty);
    }


    // if (searchParams && searchParams.tradeType) {
    //   let params = searchParams;
    //   // params.searchType = data.returnSearchId !== undefined || data.returnSearchId != null ? "HISTORY" : "ADVANCE";
    //   params.searchType = "ADVANCE";

    //   params.portOriginList = data.portOriginList;
    //   params.portDestinationList = data.portDestinationList;
    //   params.hsCodeList = data.hsCodeList;
    //   params.importerList = data.importerList;
    //   params.exporterList = data.exporterList;
    //   params.cityOriginList = data.cityOriginList;
    //   params.cityDestinationList = data.cityDestinationList;
    //   params.hsCode4DigitList = data.hsCode4DigitList;
    //   params.shipmentModeList = data.shipmentModeList;
    //   params.stdUnitList = data.stdUnitList;
    //   params.searchFlag = false

    //   // getIndividualRecordCount(params)

    //   if (data.portOriginList) {
    //     // setPortOriginList(data.portOriginList);
    //     params["portOriginList"] = data.portOriginList;
    //   }
    //   if (data.portDestinationList) {
    //     // setPortDestinationList(data.portDestinationList);
    //     params["portDestinationList"] = data.portDestinationList;
    //   }
    //   if (data.hsCodeList) {
    //     // setHsCodeList(data.hsCodeList);
    //     params["hsCodeList"] = data.hsCodeList;
    //   }
    //   if (data.hsCode4DigitList) {
    //     // setHsCode4digitList(data.hsCode4DigitList);
    //     params["hsCode4DigitList"] = data.hsCode4DigitList;
    //   }
    //   if (data.importerList) {
    //     // setImporterList(data.importerList);
    //     params["importerList"] = data.importerList;
    //   }
    //   if (data.exporterList) {
    //     // setExporterList(data.exporterList);
    //     params["exporterList"] = data.exporterList;
    //   }
    //   if (data.cityOriginList) {
    //     // setCityOriginList(data.cityOriginList);
    //     params["cityOriginList"] = data.cityOriginList;
    //   }
    //   if (data.cityDestinationList) {
    //     // setCityDestinationList(data.cityDestinationList);
    //     params["cityDestinationList"] = data.cityDestinationList;
    //   }
    //   if (data.shipmentModeList) {
    //     // setShipmentModeList(data.shipmentModeList);
    //     params["shipModeList"] = data.shipmentModeList;
    //   }
    //   if (data.stdUnitList) {
    //     // setStdUnitList(data.stdUnitList);
    //     params["stdUnitList"] = data.stdUnitList;
    //   }


    //   if (data.rangeQuantityStart != undefined && data.rangeQuantityStart != null) {
    //     params["rangeQuantityStart"] = data.rangeQuantityStart;
    //   } else {

    //   }
    //   if (data.rangeQuantityEnd != undefined && data.rangeQuantityEnd != null) {
    //     params["rangeQuantityEnd"] = data.rangeQuantityEnd;
    //   }
    //   if (data.rangeValueUsdStart != undefined && data.rangeValueUsdStart != null) {
    //     params["rangeValueUsdStart"] = data.rangeValueUsdStart;
    //   }
    //   if (data.rangeValueUsdEnd != undefined && data.rangeValueUsdEnd != null) {
    //     params["rangeValueUsdEnd"] = data.rangeValueUsdEnd;
    //   }
    //   if (data.rangeUnitPriceUsdStart != undefined && data.rangeUnitPriceUsdStart != null) {
    //     params["rangeUnitPriceUsdStart"] = data.rangeUnitPriceUsdStart;
    //   }
    //   if (data.rangeUnitPriceUsdEnd != undefined && data.rangeUnitPriceUsdEnd != null) {
    //     params["rangeUnitPriceUsdEnd"] = data.rangeUnitPriceUsdEnd;
    //   }
    //   if (data.consumptionType) {
    //     params["consumptionType"] = data.consumptionType;
    //   }
    //   if (data.incoterm) {
    //     params["incoterm"] = data.incoterm;
    //   }
    //   if (data.notifyParty) {
    //     params["notifyParty"] = data.notifyParty;
    //   }
    //   if (data.productDesc) {
    //     params["conditionProductDesc"] = data.conditionProductDesc;
    //     params["productDesc"] = data.productDesc;
    //   }
    //   if (data.returnSearchId) {
    //     params["returnSearchId"] = data.returnSearchId;
    //   }


    //   if (!data.countryCode && searchParams && searchParams.countryCode) {
    //     params["countryCode"] = searchParams.countryCode;
    //   } else if (data.countryCode) {
    //     params["countryCode"] = data.countryCode;
    //   }


    //   setSearchParams(params);
    //   getSearchData(params);

    //   // commented 05.04.2024

    //   //  getImporterList(params);
    //   //  getExporterList(params);
    //   //  getPortOriginList(params);
    //   //  getPortDestinationList(params);
    //   //  getHSCodeList(params);
    //   //  getIndianCityList(params);
    //   //  getForeignCountryList(params);
    //   //  getHSCode4digitList(params);
    //   // //  getIndividualRecordCount(params)
    //   //  getShipmentModeList(params);
    //   //  getStdUnitList(params);


    // }


    if (searchParams && searchParams.tradeType) {
      // Always start with a copy to preserve previous values
      let params = { ...searchParams };
      
      /* search counter only decrease  for main search , not for advance search 28/08/2025*/
      params.searchFlag = false; 

      params.searchType = "ADVANCE";
      // Overwrite only if present in data
      if (data.portOriginList) params.portOriginList = data.portOriginList;
      if (data.portDestinationList) params.portDestinationList = data.portDestinationList;
      if (data.hsCodeList) params.hsCodeList = data.hsCodeList;
      if (data.hsCode4DigitList) params.hsCode4DigitList = data.hsCode4DigitList;
      if (data.importerList) params.importerList = data.importerList;
      if (data.exporterList) params.exporterList = data.exporterList;
      if (data.cityOriginList) params.cityOriginList = data.cityOriginList;
      if (data.cityDestinationList) params.cityDestinationList = data.cityDestinationList;
      if (data.shipmentModeList) params.shipModeList = data.shipmentModeList;
      if (data.stdUnitList) params.stdUnitList = data.stdUnitList;
      if (data.rangeQuantityStart != undefined && data.rangeQuantityStart != null) params.rangeQuantityStart = data.rangeQuantityStart;
      if (data.rangeQuantityEnd != undefined && data.rangeQuantityEnd != null) params.rangeQuantityEnd = data.rangeQuantityEnd;
      if (data.rangeValueUsdStart != undefined && data.rangeValueUsdStart != null) params.rangeValueUsdStart = data.rangeValueUsdStart;
      if (data.rangeValueUsdEnd != undefined && data.rangeValueUsdEnd != null) params.rangeValueUsdEnd = data.rangeValueUsdEnd;
      if (data.rangeUnitPriceUsdStart != undefined && data.rangeUnitPriceUsdStart != null) params.rangeUnitPriceUsdStart = data.rangeUnitPriceUsdStart;
      if (data.rangeUnitPriceUsdEnd != undefined && data.rangeUnitPriceUsdEnd != null) params.rangeUnitPriceUsdEnd = data.rangeUnitPriceUsdEnd;
      if (data.consumptionType) params.consumptionType = data.consumptionType;
      if (data.incoterm) params.incoterm = data.incoterm;
      if (data.notifyParty) params.notifyParty = data.notifyParty;
      if (data.productDesc) {
        params.conditionProductDesc = data.conditionProductDesc;
        params.productDesc = data.productDesc;
      }
      if (data.returnSearchId) params.returnSearchId = data.returnSearchId;

      // Preserve countryCode if not present in new data
      if (!data.countryCode && !searchParams.countryCode) {
        params.countryCode = apiSerachpayload.countryCode;
      } else if (data.countryCode) {
        params.countryCode = data.countryCode;
      }
       console.log("updateFilter params in list1", params);
      setSearchParams(params);
      getSearchData(params);
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

  // ------ work for country by continent @ 30.05.2025 -------//

  // const getTradingCountryList = (params) => {
  //   setTradeType(params)
  //   AxiosMaster({
  //     method: "GET",
  //     url: `masterdata-management/countrylistbytrade/${params}`,


  //   })
  //     .then(res => {
  //       let countryList = [],
  //         multiCountryList = [];
  //       if (res.data.countryList) {
  //         res.data.countryList.forEach((item) => {
  //           multiCountryList.push({
  //             "value": item.shortcode,
  //             "label": item.name,
  //             "iso2code": item.image,
  //             "weightagePoints": params == "E" ? item.exportPointWeightage : item.importPointWeightage,
  //           });
  //           let specificItem = Object.assign(item, { hasChild: false })
  //           countryList.push(specificItem);
  //         })
  //         // }
  //         countryList = res.data.countryList.length > 0 && props.countryList.length > 0 && res.data.countryList.filter((item) => {
  //           return props.countryList.includes(item.shortcode)
  //         })

  //         setTradeCountryList(countryList);
  //         setMultiTradeCountryList(multiCountryList);
  //       }
  //     })
  //     .catch(err => {
  //       setTradeCountryList([])
  //     });
  // }



  const getTradingCountryList = (params) => {
    setTradeType(params);

    AxiosMaster({
      method: "GET",
      url: `/masterdata-management/countrylistbycontinent/${params}`,
    })
      .then(res => {
        let countryList = [];
        let multiCountryList = [];
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


        }
      })
      .catch(err => {
        setTradeCountryList([]);
      });
  };

  // ------ work for country by continent @ 30.05.2025 -------//


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

           // console.log("Main list1 fetchSearchQuery res", sParams);
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
              rangeQuantityStart: sParams.rangeQuantityStart ? sParams.rangeQuantityStart : null,
              rangeQuantityEnd: sParams.rangeQuantityEnd ? sParams.rangeQuantityEnd : null,
              consumptionType: sParams.consumptionType ? sParams.consumptionType : [],
              rangeValueUsdStart: sParams.rangeValueUsdStart ? sParams.rangeValueUsdStart : null,
              rangeValueUsdEnd: sParams.rangeValueUsdEnd ? sParams.rangeValueUsdEnd : null,
              rangeUnitPriceUsdStart: sParams.rangeUnitPriceUsdStart ? sParams.rangeUnitPriceUsdStart : null,
              rangeUnitPriceUsdEnd: sParams.rangeUnitPriceUsdEnd ? sParams.rangeUnitPriceUsdEnd : null,
              incoterm: sParams.incoterm ? sParams.incoterm : [],
              notifyParty: sParams.notifyParty ? sParams.notifyParty : [],
              productDesc: sParams.productDesc ?? [],
  conditionProductDesc: sParams.conditionProductDesc ?? "",
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

  //--- get country by continent @30.05.2025 ---//

  // const fetchTradingCountryListOnInnitialize = (params, countryCode, tradeType, initialValues) => {
  //   setTradeType(params)
  //   AxiosMaster({
  //     method: "GET",
  //     url: `masterdata-management/countrylistbytrade/${params}`,
  //   })
  //     .then(res => {
  //       let countryList = [],
  //         multiCountryList = [],
  //         selectedCountryList = [];
  //       if (res.data.countryList) {
  //         res.data.countryList.forEach((item) => {
  //           multiCountryList.push({
  //             "value": item.shortcode,
  //             "label": item.name,
  //             "iso2code": item.image,
  //             "weightagePoints": params == "E" ? item.exportPointWeightage : item.importPointWeightage,
  //           });
  //           let specificItem = Object.assign(item, { hasChild: false })
  //           countryList.push(specificItem);
  //         })

  //         countryList = res.data.countryList.length > 0 && props.countryList.length > 0 && res.data.countryList.filter((item) => {
  //           return props.countryList.includes(item.shortcode)
  //         });


  //         setTradeCountryList(countryList);
  //         setMultiTradeCountryList(multiCountryList);

  //         // let tempRow = countryList && countryList.filter((item) => item.shortcode.toLowerCase().includes(countryCode.toLowerCase()))
  //         const tempRow = countryList.filter((item) =>
  //           countryCode.some((code) => item.shortcode.toLowerCase() === code.toLowerCase())
  //         );

  //         tempRow.forEach((item) => {
  //           selectedCountryList.push({ "value": item.shortcode, "label": item.name });
  //         })
  //         setSelectedTradeCountry(selectedCountryList);



  //         setImporterForExport(tempRow[0].importerForExport)
  //         setExporterForImport(tempRow[0].exporterForImport)

  //         setDate(countryCode, tradeType, res.data.countryList);
  //         if (searchTypeValue !== "") {
  //           handleSearch(initialValues, countryList, searchTypeValue);
  //         } else {
  //           handleSearch(initialValues, countryList);
  //         }

  //       }
  //     }
  //     )
  //     .catch(err => {
  //       setTradeCountryList([])
  //     });
  // }

  // function setDate(text, tradeType, tradeCountryList) {
  //   // isLoading(true)
  //   let tempRow = tradeCountryList && tradeCountryList.filter((item) => item.shortcode.toLowerCase().includes(text.toLowerCase()));
  //   let fromDate = ""
  //   let toDate = ""

  //   if (tradeType == "I") {
  //     fromDate = moment(tempRow[0].importFrom).format('MM-DD-YYYY')
  //     toDate = moment(tempRow[0].importUpto).format('MM-DD-YYYY')
  //   }
  //   else {
  //     fromDate = moment(tempRow[0].exportFrom).format('MM-DD-YYYY')
  //     toDate = moment(tempRow[0].exportUpto).format('MM-DD-YYYY')
  //   }

  //   setMinDate(new Date(fromDate))
  //   setMaxDate(new Date(toDate))

  //   return new Date(toDate)
  // }

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

          setImporterForExport(tempRow[0]?.importerForExport || "");
          setExporterForImport(tempRow[0]?.exporterForImport || "");

          setDate(countryCode, tradeType, countryList);

          if (searchTypeValue !== "") {
            handleSearch(initialValues, countryList, searchTypeValue);
          } else {
            handleSearch(initialValues, countryList);
          }
        }
      })
      .catch(err => {
        setTradeCountryList([]);
      });
  };

  //--- get country by continent @30.05.2025 ---//


  function setDate(text, tradeType, tradeCountryList) {
    // text is now an array like ["Ind", "Afg"]
    const tempRow = tradeCountryList.filter((item) =>
      text.some((code) => item.shortcode.toLowerCase() === code.toLowerCase())
    );

    if (!tempRow.length) return;

    let fromDate = "";
    let toDate = "";

    if (tradeType === "I") {
      fromDate = moment(tempRow[0].importFrom).format("MM-DD-YYYY");
      toDate = moment(tempRow[0].importUpto).format("MM-DD-YYYY");
    } else {
      fromDate = moment(tempRow[0].exportFrom).format("MM-DD-YYYY");
      toDate = moment(tempRow[0].exportUpto).format("MM-DD-YYYY");
    }

    setMinDate(new Date(fromDate));
    setMaxDate(new Date(toDate));

    return new Date(toDate);
  }



  // function setMaxMinDate(text) {
  //   // isLoading(true)
  //   let tempRow = tradeCountryList && tradeCountryList.filter((item) => item.shortcode.toLowerCase().includes(text.toLowerCase()))
  //   let fromDate = ""
  //   let toDate = ""
  //   let countrywiseFromDate = ""
  //   try {
  //     if (tradeType == "I") {
  //       countrywiseFromDate = moment(tempRow[0].importFrom).format('MM-DD-YYYY')
  //       fromDate = moment(tempRow[0].importFrom).format('MM-DD-YYYY')
  //       toDate = moment(tempRow[0].importUpto).format('MM-DD-YYYY')
  //     }
  //     else {
  //       countrywiseFromDate = moment(tempRow[0].exportFrom).format('MM-DD-YYYY')
  //       fromDate = moment(tempRow[0].exportFrom).format('MM-DD-YYYY')
  //       toDate = moment(tempRow[0].exportUpto).format('MM-DD-YYYY')
  //     }

  //     setMinDate(new Date(fromDate))
  //     setMaxDate(new Date(toDate))

  //     return new Date(toDate)
  //   }
  //   catch {
  //     props.loadingStop()
  //     Swal.fire({
  //       title: 'Error !',
  //       text: "Please select country",
  //       icon: 'error',
  //       dangerMode: true,
  //       confirmButtonColor: '#3085d6',
  //     })
  //     return ""
  //   }

  // }

  function setMaxMinDate(selectedCountries, tradeType) {
    if (!selectedCountries || selectedCountries.length === 0) {
      Swal.fire({
        title: 'Error !',
        text: "Please select at least one country",
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      return;
    }


    let fromDates = [];
    let toDates = [];

    selectedCountries.forEach(country => {
      let tempRow = tradeCountryList.find(item => item.shortcode.toLowerCase() === country.value.toLowerCase());

      if (tempRow) {
        // if (tradeType === "I") {
        // change trade type to "IMPORT" for below condition @sarbojitghosh22 5/8/2025 //
        if (tradeType === "IMPORT") {
          fromDates.push(moment(tempRow.importFrom).toDate());
          toDates.push(moment(tempRow.importUpto).toDate());
        } else {
          fromDates.push(moment(tempRow.exportFrom).toDate());
          toDates.push(moment(tempRow.exportUpto).toDate());
        }
      }
    });

    if (fromDates.length > 0 && toDates.length > 0) {
      let minDate = new Date(Math.min(...fromDates));
      let maxDate = new Date(Math.max(...toDates));

      setMinDate(minDate);
      setMaxDate(maxDate);

      return maxDate;
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

          let apiResponse = res.data.distinctColumnValuesList;
          let formattedOptions = apiResponse.map(({ column_name, records_count }) => ({
            label: `${column_name} (${records_count})`,
            value: column_name
          }));

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

         // let apiResponse = res.data.distinctColumnValuesList;
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
                        {/* {(values.tradeType == "EXPORT" && importerForExport == "Y") || values.tradeType == "IMPORT" ? <option value="IMPORTER">Importer</option> : null}
                        {(values.tradeType == "IMPORT" && exporterForImport == "Y" || values.tradeType == "EXPORT") ? <option value="EXPORTER">Exporter</option> : null} */}

                        {/* importer and exporter always show in option @sarbojitghosh22 11-06-2025 */}
                        <option value="IMPORTER">Importer</option>
                        <option value="EXPORTER">Exporter</option>
                        {/* <option value="D">Does Not Contains</option> */}
                        {/* {values.searchBy == "PRODUCT" ? <>
                          <option value="D">Does Not Contains</option> </> : null} */}
                        {/* importer and exporter always show in option @sarbojitghosh22 11-06-2025 */}


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
                    {values.searchBy != "HS_CODE_2" ?
                      (<button
                        type="button" className="btn btn-warning"
                        // onClick={() => arrayHelpers.remove(index)}
                        //--- enableing search button when clicked remove @sarbojitghosh22 11-6-2025---//
                        onClick={() => {
                          arrayHelpers.remove(index);
                          setIsSearchClicked(false); // Enable the search button
                        }}
                      //--- enableing search button when clicked remove @sarbojitghosh22 11-6-2025---//

                      >
                        -
                      </button>)
                      :
                      values.queryBuilder.length > 1 ?
                        (<button
                          type="button" className="btn btn-warning"
                          // onClick={() => arrayHelpers.remove(index)}

                          //--- enableing search button when clicked remove @sarbojitghosh22 11-6-2025---//
                          onClick={() => {
                            arrayHelpers.remove(index);
                            setIsSearchClicked(false); // Enable the search button
                          }}
                        //--- enableing search button when clicked remove @sarbojitghosh22 11-6-2025---//


                        >
                          -
                        </button>)
                        : null
                    }
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

                  {/* --- date picker modification for coutry selection quatity @sarbojitghosh22 4/7/2025 --- */ }

                  const validateDateRange = (fromDate, toDate) => {
                    const from = moment(fromDate);
                    const to = moment(toDate);
                    const diffYears = to.diff(from, 'years', true); // use float


                    const maxYears = selectedTradeCountry.length === 1 ? 3 : 1;

                    if (diffYears > maxYears) {
                      Swal.fire({
                        title: "Invalid Date Range",
                        text: `For ${selectedTradeCountry.length === 1 ? "a single country" : "multiple countries"}, custom date range cannot exceed ${maxYears} year${maxYears > 1 ? "s" : ""}.`,
                        icon: "warning",
                        button: "OK"
                      });

                      // Optionally, clear the dates or reset
                      setFieldValue("fromDate", "");
                      setFieldValue("toDate", "");
                    }
                  };

                  {/* --- date picker modification for coutry selection quatity @sarbojitghosh22 4/7/2025 --- */ }

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
                                  setMultiTradeCountryList([]);
                                  setSelectedTradeCountry([]);

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
                        {/* <div className="col-md-3 pr-0 pb-3" >
                          <div className="dropdown bootstrap-select hero__form-input  form-control custom-select-multi" >
                          <Field
                              name="countryCode"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.countryCode && errors.countryCode ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.countryCode}
                              isMulti
                              
                              onChange={event => {
                                if(props.queryPerDay > 0 ){       
                                  setFieldValue("countryCode", event.target.value);
                                  setFieldValue("fromDate", "") ;
                                  setFieldValue("toDate", "") ;
                                  setFieldValue("dateRange", "") ;
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
                              <option value = "" >Select Country</option>
                              {Object.keys(tradeCountryList).map((item,index) => (                          
                                <option key = {index} value={tradeCountryList[item].shortcode}>{tradeCountryList[item].name}</option>
                              ))}
                            </Field>
                            {errors.countryCode && touched.countryCode ? (
                                  <span className="errorMsg">{errors.countryCode}</span>
                            ) : null}
                          <Select
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

                          <DropDownTreeComponent id="dropdowntree"
                            fields={ { 
                                      dataSource: tradeCountryList,
                                      value: 'shortcode',
                                      text: 'name',
                                      parentValue: "pid",
                                      hasChildren: 'hasChild'           
                                    }} 
                            showCheckBox={true} 
                            treeSettings={treeSettings} 
                            showSelectAll={true}
                            selectAllText={"Check All"} 
                            unSelectAllText={"UnCheck All"}       
                            value = {countryCode}
                            change={(selectedOption) => {                            
                              setFieldValue("countryCode", selectedOption.value);
                            }}
                            />
                          <MultiSelect
                            options={multiTradeCountryList}
                            value={selectedTradeCountry}
                            onChange={(selectedOption) => {
                              setSelectedTradeCountry(selectedOption);
                              const selectedValues = selectedOption.map(option => option.value);
                              // console.log("selectedValues >>> ", selectedValues)
                              setFieldValue("countryCode", selectedValues);
                              setFieldValue("fromDate", "");
                              setFieldValue("toDate", "");
                              setFieldValue("dateRange", "");
                              setMaxMinDate(selectedOption, values.tradeType);
                            }}
                            labelledBy="Select"
                          />




                          {errors.countryCode && touched.countryCode ? (
                            <span className="errorMsg">{errors.countryCode}</span>
                          ) : null}
                          </div>
                        </div> */}

                        <div className="col-md-3 pr-0 pb-3" >


                          <CountrySelector
                            multiTradeCountryList={multiTradeCountryList}
                            selectedTradeCountry={selectedTradeCountry}
                            setFieldValue={setFieldValue}
                            values={values}
                            setSelectedTradeCountry={setSelectedTradeCountry}
                            setMaxMinDate={setMaxMinDate}
                             hasSearchResults={hasSearchResults}  // ADD THIS LINE
searchResult={searchResult}                  // ADD THIS LINE
setIsSearchClicked={setIsSearchClicked} // Add this line  09/02/2026
                          />


                          {errors.countryCode && touched.countryCode ? (
                            <span className="errorMsg">{errors.countryCode}</span>
                          ) : null}
                          {/* </div> */}
                        </div>
                        <div className="col-md-2 pr-0 pb-3">
                          <div className="dropdown bootstrap-select hero__form-input">

                            {/* time frame validation for single and multiple country selection @sarbojitghosh22 2-5-2025 */}


                            {/* <Field
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
                                  let tempmaxMin = setMaxMinDate(selectedTradeCountry, values.tradeType);
                                  let tempMaxDate = moment(tempmaxMin).diff(moment(props.dataAccessUpto), 'days') > 0 ? props.dataAccessUpto : tempmaxMin
                                  let newMaxDate = ""

                                  if (values.countryCode.includes("IND") || values.countryCode.includes("SEZ")) {
                                    const newDate = moment().diff(moment(tempMaxDate), 'days') > 0 ? tempMaxDate : new Date();
                                    const d = new Date(newDate);
                                    d.setDate(1);
                                    newMaxDate = moment(d).subtract(1, 'days');
                                  } else {
                                    newMaxDate = moment().diff(moment(tempMaxDate), 'days') > 0 ? tempMaxDate : new Date();
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
                              <option value=""> Choose Month Range</option>
                              <option value="1">LAST 1 MONTH</option>
                              <option value="2">LAST 3 MONTHS</option>
                              <option value="3">LAST 6 MONTHS</option>
                              <option value="4">LAST 1 YEAR</option>
                              <option value="6">CUSTOM</option>
                            </Field> */}


                            <Field
                              name="dateRange"
                              component="select"
                              className={`hero__form-input form-control custom-select ${touched.dateRange && errors.dateRange ? "is-invalid" : ""}`}
                              autoComplete="off"
                              value={values.dateRange}
                              onChange={event => {
                                if (props.queryPerDay > 0) {
                                  props.loadingStart();
                                  setIsSearchClicked(false);
                                  setFieldValue("dateRange", event.target.value);
                                  console.log("props>>>>>>>>>>>>>>>>>", props)
                                  let tempmaxMin = setMaxMinDate(selectedTradeCountry, values.tradeType);
                                  let tempMaxDate = moment(tempmaxMin).diff(moment(props.dataAccessUpto), 'days') > 0 ? props.dataAccessUpto : tempmaxMin;
                                  // let newMaxDate = "";

                                  // if (values.countryCode.includes("IND") || values.countryCode.includes("SEZ")) {
                                  //   const newDate = moment().diff(moment(tempMaxDate), 'days') > 0 ? tempMaxDate : new Date();
                                  //   const d = new Date(newDate);
                                  //   d.setDate(1);
                                  //   newMaxDate = moment(d).subtract(1, 'days');
                                  // } else {
                                  //   newMaxDate = moment().diff(moment(tempMaxDate), 'days') > 0 ? tempMaxDate : new Date();
                                  // }


                                  // Calculate the last day of the previous month based on tempMaxDate @sarbojitghosh22 26-7-2025 ---//

                                  // // Always set to last day of previous month
                                  let baseDate = moment().diff(moment(tempMaxDate), 'days') > 0 ? moment(tempMaxDate) : moment();
                                  let lastDayPrevMonth = baseDate.clone().startOf('month').subtract(1, 'days');
                                  let newMaxDate = lastDayPrevMonth;

                                  // Calculate the last day of the previous month based on tempMaxDate @sarbojitghosh22 26-7-2025 ---//




                                  let fromdate = "";
                                  let dateDiff = "";
                                  let tempFromdate = "";

                                  if (newMaxDate !== "") {
                                    switch (event.target.value) {
                                      case "1":
                                        fromdate = new Date(newMaxDate);
                                        fromdate.setDate(1);
                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days');
                                        setFieldValue("fromDate", dateDiff >= 0 ? new Date(fromdate) : new Date(props.dataAccessInMonth));
                                        setFieldValue("toDate", new Date(newMaxDate));
                                        props.loadingStop();
                                        break;

                                      case "2":
                                        tempFromdate = moment(newMaxDate).subtract(3, 'months').add(5, "days").format("YYYY-MM-DD");
                                        fromdate = new Date(tempFromdate);
                                        fromdate.setDate(1);
                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days');
                                        setFieldValue("fromDate", dateDiff >= 0 ? new Date(fromdate) : new Date(props.dataAccessInMonth));
                                        setFieldValue("toDate", new Date(newMaxDate));
                                        props.loadingStop();
                                        break;

                                      case "3":
                                        tempFromdate = moment(newMaxDate).subtract(6, 'months').add(5, "days").format("YYYY-MM-DD");
                                        fromdate = new Date(tempFromdate);
                                        fromdate.setDate(1);
                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days');
                                        setFieldValue("fromDate", dateDiff >= 0 ? new Date(fromdate) : new Date(props.dataAccessInMonth));
                                        setFieldValue("toDate", new Date(newMaxDate));
                                        props.loadingStop();
                                        break;

                                      case "4":
                                        tempFromdate = moment(newMaxDate).subtract(12, 'months').add(5, "days").format("YYYY-MM-DD");
                                        fromdate = new Date(tempFromdate);
                                        fromdate.setDate(1);
                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days');
                                        setFieldValue("fromDate", dateDiff >= 0 ? new Date(fromdate) : new Date(props.dataAccessInMonth));
                                        setFieldValue("toDate", new Date(newMaxDate));
                                        props.loadingStop();
                                        break;

                                      case "5":
                                        tempFromdate = moment(newMaxDate).subtract(36, 'months').add(5, "days").format("YYYY-MM-DD");
                                        fromdate = new Date(tempFromdate);
                                        fromdate.setDate(1);
                                        dateDiff = moment(fromdate).diff(moment(props.dataAccessInMonth), 'days');
                                        setFieldValue("fromDate", dateDiff >= 0 ? new Date(fromdate) : new Date(props.dataAccessInMonth));
                                        setFieldValue("toDate", new Date(newMaxDate));
                                        props.loadingStop();
                                        break;

                                      default:
                                        setFieldValue("toDate", "");
                                        setFieldValue("fromDate", "");
                                        props.loadingStop();
                                    }
                                  }
                                } else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse();
                                }
                              }}
                            >
                              {(() => {
                                const options = [
                                  { value: "", label: "Choose Month Range" },
                                  { value: "1", label: "LAST 1 MONTH" },
                                  { value: "2", label: "LAST 3 MONTHS" },
                                  { value: "3", label: "LAST 6 MONTHS" },
                                ];

                                if (selectedTradeCountry.length === 1) {
                                  options.push({ value: "4", label: "LAST 1 YEAR" });
                                  options.push({ value: "5", label: "LAST 3 YEAR" });
                                } else if (selectedTradeCountry.length > 1) {
                                  options.push({ value: "4", label: "LAST 1 YEAR" });
                                }

                                options.push({ value: "6", label: "CUSTOM" });

                                return options.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ));
                              })()}
                            </Field>



                            {/* time frame validation for single and multiple country selection @sarbojitghosh22 2-5-2025 */}

                            {errors.dateRange && touched.dateRange ? (
                              <span className="errorMsg">{errors.dateRange}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-2 pr-0 pb-3">
                          <div className="input-search">
                            {/* <DatePicker
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
                            /> */}


                            {/* --- date picker modification for coutry selection quatity @sarbojitghosh22 4/7/2025 --- */}



                            <DatePicker
                              name="fromDate"
                              dateFormat="yyyy MMM dd"
                              placeholderText="From"
                              peekPreviousMonth
                              peekPreviousYear
                              showMonthDropdown
                              showYearDropdown
                              minDate={new Date(props.dataAccessInMonth)}
                              maxDate={new Date(props.dataAccessUpto || maxDate)}
                              className="form-control"
                              dropdownMode="select"
                              onChange={(value) => {
                                if (props.queryPerDay > 0) {
                                  setFieldValue("fromDate", value);
                                  setFieldTouched("fromDate");
                                  setFieldValue("dateRange", "6");
                                  setIsSearchClicked(false);

                                  // Enforce range logic after both are selected
                                  if (values.toDate) {
                                    validateDateRange(value, values.toDate);
                                  }
                                } else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse();
                                }
                              }}
                              selected={values.fromDate}
                            />




                            {/* --- date picker modification for coutry selection quatity @sarbojitghosh22 4/7/2025 --- */}

                            {errors.fromDate && touched.fromDate ? (
                              <span className="errorMsg">{errors.fromDate}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-2 pr-0 pb-3">
                          <div className="input-search">
                            {/* <DatePicker
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
                            /> */}

                            {/* --- date picker modification for coutry selection quatity @sarbojitghosh22 4/7/2025 --- */}

                            <DatePicker
                              name="toDate"
                              dateFormat="yyyy MMM dd"
                              placeholderText="To"
                              peekPreviousMonth
                              peekPreviousYear
                              showMonthDropdown
                              showYearDropdown
                              minDate={new Date(props.dataAccessInMonth)}
                              maxDate={new Date(props.dataAccessUpto || maxDate)}
                              className="form-control"
                              dropdownMode="select"
                              onChange={(value) => {
                                if (props.queryPerDay > 0) {
                                  setFieldValue("toDate", value);
                                  setFieldTouched("toDate");
                                  setFieldValue("dateRange", "6");
                                  setIsSearchClicked(false);

                                  // Enforce range logic after both are selected
                                  if (values.fromDate) {
                                    validateDateRange(values.fromDate, value);
                                  }
                                } else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse();
                                }
                              }}
                              selected={values.toDate}
                            />





                            {/* --- date picker modification for coutry selection quatity @sarbojitghosh22 4/7/2025 --- */}


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
                              // onChange={event => {
                              //   if (props.queryPerDay > 0) {
                              //     event.target.value == "PRODUCT" ? setFieldValue("matchType", "C") : setFieldValue("matchType", "L");
                              //     searchValue.length = 1
                              //     setFieldValue("searchBy", event.target.value);
                              //     setIsSearchClicked(false)
                              //   }
                              //   else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                              //     swalResponse()
                              //   }
                              // }}

                              // --- changed function to trigger add button @sarbojitghosh22 11-06-2025 ---//
                              onChange={event => {
                                if (props.queryPerDay > 0) {
                                  const selectedValue = event.target.value;
                                  setFieldValue("searchBy", selectedValue);
                                  setIsSearchClicked(false);

                                  // Reset dependent fields
                                  setFieldValue("matchType", "");
                                  setFieldValue("searchValue", []); // <-- This clears the Creatable input
                                  setSearchValue([]); // <-- If you use local state for defaultValue, clear it too
                                  setFieldValue("queryBuilder", []);


                                  // Set matchType based on the selected value
                                  selectedValue === "PRODUCT"
                                    ? setFieldValue("matchType", "C")
                                    : setFieldValue("matchType", "L");

                                  // Clear previous search values
                                  // searchValue.length = 1;

                                  // Automatically trigger "ADD" button functionality for HS_CODE_2
                                  if (selectedValue === "HS_CODE_2") {
                                    setFieldValue("queryBuilder", [
                                      { relation: "", searchBy: "HS_CODE_2", matchType: "", searchValue: "" }
                                    ]);
                                  }
                                } else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                  swalResponse();
                                }
                              }}
                            // --- changed function to trigger add button @sarbojitghosh22 11-06-2025 ---//
                            >
                              <option value="">Select Type</option>
                              <option value="HS_CODE_2">HS Code 2 digit</option>
                              <option value="HS_CODE">HS Code</option>
                              <option value="PRODUCT">Product</option>
                              {/* {(values.tradeType == "EXPORT" && importerForExport == "Y") || values.tradeType == "IMPORT" ? <option value="IMPORTER">Importer</option> : null}
                              {(values.tradeType == "IMPORT" && exporterForImport == "Y" || values.tradeType == "EXPORT") ? <option value="EXPORTER">Exporter</option> : null} */}

                              {/* search option  modify for import and export @sarbojitghosh22 11-06-2025  */}
                              <option value="IMPORTER">Importer</option> : null
                              <option value="EXPORTER">Exporter</option> : null
                              {/* search option  modify for import and export @sarbojitghosh22 11-06-2025  */}

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
                              {/* {values.searchBy == "PRODUCT" ? <>
                              <option value="C">Contains</option>
                              <option value="D">Does Not Contains</option> </> : null} */}
                              {/* dropdown modification for type @sarbojitghosh22 11-06-2025 */}
                              {values.searchBy == "PRODUCT" ? <>
                                <option value="C">Contains</option></> : null}
                              {/* dropdown modification for type @sarbojitghosh22 11-06-2025 */}

                              <option value="L">Like</option>
                            </Field>
                            {errors.matchType && touched.matchType ? (
                              <span className="errorMsg">{errors.matchType}</span>
                            ) : null}
                          </div>
                        </div>
                        {/* {searchValue && searchValue.length > 0 ? */}

                        {/* {searchValue && searchValue.length > 0 && values.searchBy && values.matchType ? ( */}
                        {values.searchBy && values.matchType ? (


                          <div className="col-md-4 pr-0 pb-3">
                            <div className="input-search" >
                              {/* <FormGroup >
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
                                      let newQuery = []
                                      let isQueryBuilder = false
                                      setIsSearchClicked(false)
                                      selectedOption.forEach((item) => {
                                        itemList.push(item.value);
                                        if (values.searchBy == "HS_CODE_2") {
                                          isQueryBuilder = true
                                        }
                                      });
                                      if (isQueryBuilder == true) {
                                        newQuery[0] = { relation: "", searchBy: "", matchType: "", searchValue: "" }
                                        setFieldValue("queryBuilder", newQuery)
                                      }
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
                              </FormGroup> */}

                              {/* hs code validation for minimum 4 digit @sarbojitghosh22 2-5-2025 */}

                              <FormGroup>
                                <Creatable
                                  key={values.searchBy + '-' + values.matchType} // This forces remount on change

                                  placeholder={values.searchBy === "HS_CODE" ? "Enter min 4 digits" : "Enter min 2 chars"}
                                  name="searchValue"
                                  options={suggestions}
                                  // --- Value modiftcaion for reset functionality @sarbojitghosh22 26-5-2025 --- //
                                  value={
                                    values.searchValue && Array.isArray(values.searchValue)
                                      ? values.searchValue.map(val =>
                                        typeof val === "string"
                                          ? { label: val, value: val }
                                          : val // already an object
                                      )
                                      : []
                                  }
                                  // --- Value modiftcaion for reset functionality @sarbojitghosh22 26-5-2025 --- //

                                  isMulti
                                  isOptionDisabled={() => values.searchValue && values.searchValue.length >= 10}
                                  noOptionsMessage={() => "name not found"}
                                  components={{ MenuList: SelectMenuButton }}
                                  onInputChange={(newValue) => {
                                    if (props.queryPerDay > 0) {
                                      getSuggestionList(newValue, values, "");
                                    }
                                  }}
                                  onChange={(selectedOption) => {
                                    if (props.queryPerDay > 0) {
                                      let itemList = [];
                                      let isValid = true;

                                      selectedOption.forEach((item) => {
                                        itemList.push(item.value);
                                        if (values.searchBy === "HS_CODE" && item.value.length < 4) {
                                          isValid = false;
                                        }
                                      });

                                      if (!isValid) {
                                        Swal.fire({
                                          title: "Error!",
                                          text: "HS Code must be at least 4 digits.",
                                          icon: "error",
                                          confirmButtonColor: "#3085d6",
                                        });
                                      } else {
                                        setFieldValue("searchValue", itemList);
                                        setIsSearchClicked(false);
                                      }
                                    } else if (props.queryPerDay <= 0 && props.queryPerDay != null) {
                                      swalResponse();
                                    }
                                  }}
                                // defaultValue={searchValue}
                                />
                                {errors.searchValue && touched.searchValue ? (
                                  <span className="errorMsg">{errors.searchValue}</span>
                                ) : null}
                              </FormGroup>

                              {/* hs code validation for minimum 4 digit @sarbojitghosh22 2-5-2025 */}

                            </div>
                            {/* </div> : null */}
                          </div>

                          // }
                        ) : null}

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
                    {/* {(searchParams.tradeType == "IMPORT" && exporterForImport == "Y" || searchParams.tradeType == "EXPORT") ? */}
                    {
                      exporterDataList.length > 0 ?

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
                        </div> : null
                    }
                    {/* {(searchParams.tradeType == "EXPORT" && importerForExport == "Y") || searchParams.tradeType == "IMPORT" ? */}
                    {importerDataList.length > 0 ?

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
                  setSearchResult={setSearchResult}
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
                  filterCountryList={filterCountryList}
                  multiTradeCountryList={multiTradeCountryList} // New prop for multiTradeCountryList
                  selectedTradeCountry={selectedTradeCountry} // New prop for selectedTradeCountry
                  apiSerachpayload={apiSerachpayload}
                  setApiSearchPayload={setApiSearchPayload} // <-- pass setter
                  indepthAccessCondition={indepthAccessCondition} //Indepth Conditions access 04/02/2026

                />
              ) : (
                <DataTableImport
                  exportToCSV={exportToCSV}
                  searchResult={searchResult}
                  setSearchResult={setSearchResult}
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
                  filterCountryList={filterCountryList}
                  multiTradeCountryList={multiTradeCountryList} // New prop for multiTradeCountryList
                  selectedTradeCountry={selectedTradeCountry} // New prop for selectedTradeCountry
                  // countryRecords={countryRecords}
                  apiSerachpayload={apiSerachpayload}
                  setApiSearchPayload={setApiSearchPayload} // <-- pass setter
                  indepthAccessCondition={indepthAccessCondition} //Indepth Conditions access 04/02/2026
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
          consumptionType={consumptionType}
          consumptionTypeDataList={consumptionTypeDataList}
          incoterm={incoterm}
          incotermDataList={incotermListData}
          notifyParty={notifyParty}
          notifyPartyDataList={notifyPartyListData}
          apiSerachpayload={apiSerachpayload}
          show={toggle}
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

       {showDownloadLoader && <DownloadLoader show={showDownloadLoader} />}
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
    setDloadCountSubuser: (data) => dispatch(setDloadCountSubuser(data)),
    setSearchQuery: (data) => dispatch(setSearchQuery(data))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
