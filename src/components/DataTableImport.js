import React, { useState, useRef, useCallback, useEffect } from 'react';
import { IconButton, Pagination, TagPicker, Checkbox } from 'rsuite';
import { Cell, Column, HeaderCell, Table } from 'rsuite-table';
import 'rsuite/dist/rsuite.min.css';
import { FaPlusSquare, FaMinusSquare, FaBeer } from 'react-icons/fa';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import moment from 'moment';
import Swal from 'sweetalert2';
import { Dropdown, DropdownButton, Modal, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import AxiosACT from "../shared/AxiosACT";
import { columnListImportDashboardIND, columnListImportForeign, columnListImportUSA } from "../shared/TradeColumnList";
import DataTableCoutryFilterModal from '../shared/DataTableCoutryFilterModal';
import { MultiSelect } from "react-multi-select-component";
import { FaClipboardList } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Axios from '../shared/Axios';
import DataTableCoulumnFilter from '../shared/DataTableCoulumnFilter';
import { columnListImportGlobal } from '../shared/GlobalTradeColumnList';
import { columnListImportForeign as columnListExportForeign_new } from '../shared/SingleCountryTradeColumnList'
import Flag from 'react-world-flags';
import { FaGoogle } from 'react-icons/fa'; // Make sure this import is at the top


//const defaultSelectedColumns = ['hs_code', 'date', 'prod_desc', 'qty', 'importer', 'shipmentport', 'foreign_exporter', 'for_port', 'ind_port', 'for_count'];
const rowKey = 'id';

const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
    <Cell {...props}>
        <IconButton
            size="xs"
            appearance="subtle"
            onClick={() => {
                onChange(rowData);
            }}
            icon={
                expandedRowKeys.some((key) => key === rowData[rowKey]) ? <FaMinusSquare /> : <FaPlusSquare />
            }
        />
    </Cell>
);
const renderRowExpanded = (rowData) => {
    return (
        <div style={{ minHeight: '220px', width: 'auto', paddingLeft: '40px', backgroundColor: 'lightgray', padding: '6px' }}>
            <div className="row">
                <div className="col-md-2">
                    <p><b>Sl:</b> {rowData.id}</p>
                    <p><b>HSCODE:</b> {rowData.hs_code}</p>
                    <p><b>IEC:</b> {rowData.iec}</p>
                    <p><b>Indian Company Name:</b> {rowData.importer}</p>
                    <p><b>ADDRESS1:</b> {rowData.address1}</p>
                    <p><b>ADDRESS2:</b> {rowData.address2}</p>
                </div>
                <div className="col-md-2">
                    <p><b>CITY:</b> {rowData.city}</p>
                    <p><b>PIN:</b> {rowData.pin}</p>
                    <p><b>PROD_DESC:</b> {rowData.prod_desc}</p>
                    <p><b>IND_PORT:</b> {rowData.ind_port}</p>
                    <p><b>FOR_COUNT:</b> {rowData.for_count}</p>
                    <p><b>FOR_PORT:</b> {rowData.for_port}</p>
                    <p><b>VALUE:</b> {rowData.value}</p>
                </div>
                <div className="col-md-2">
                    <p><b>VALUE(US$):</b> {rowData.value_usd}</p>
                    <p><b>QTY:</b> {rowData.qty}</p>
                    <p><b>UNIT:</b> {rowData.unit}</p>
                    <p><b>VAL_DUTY_INR:</b> {rowData.val_duty_inr}</p>
                    <p><b>VAL_DUTY_USD:</b> {rowData.val_duty_usd}</p>
                    <p><b>Applicable DUTY:</b> {rowData.applicable_duty}</p>
                </div>
                <div className="col-md-2">
                    <p><b>UNIT RATE(IND RS):</b> {rowData.unit_rate_inr}</p>
                    <p><b>SHIP_MODE:</b> {rowData.ship_mode}</p>
                    <p><b>UNIT RATE(USD):</b> {rowData.unit_rate_usd}</p>
                    <p><b>BENO:</b> {rowData.beno}</p>
                    <p><b>CHA_NAME:</b> {rowData.cha_name}</p>
                    <p><b>Actual DUTY:</b> {rowData.actual_duty}</p>
                </div>
                <div className="col-md-1">
                    <p><b>Total Duty On Entire BE:</b> {rowData.total_duty_on_entire_be}</p>
                    <p><b>Typ:</b> {rowData.typ}</p>
                    <p><b>AG:</b> {rowData.ag}</p>
                    <p><b>Inv No:</b> {rowData.inv_no}</p>
                    <p><b>Item No:</b> {rowData.item_no}</p>
                    <p><b>UnitPrice FC:</b> {rowData.unitprice_fc}</p>
                </div>
                <div className="col-md-1">
                    <p><b>Currency:</b> {rowData.currency}</p>
                    <p><b>Foreign Exporter:</b> {rowData.foreign_exporter}</p>
                    <p><b>Foreign Address:</b> {rowData.foreign_address}</p>
                    <p><b>Date:</b> {rowData.date}</p>
                    <p><b>CUSH:</b> {rowData.cush}</p>
                    <p><b>Location:</b> {rowData.location}</p>
                    <p><b>Inv_Date:</b> {rowData.inv_date}</p>
                </div>
                <div className="col-md-1">
                    <p><b>Inv_Srl_No:</b> {rowData.inv_srl_no}</p>
                    <p><b>Inv_Value:</b> {rowData.inv_value}</p>
                    <p><b>ForCntry_Code:</b> {rowData.forcntry_code}</p>
                    <p><b>FORPORT_Code:</b> {rowData.forport_code}</p>
                    <p><b>ShipmentPort Code:</b> {rowData.shipmentportcode}</p>
                    <p><b>ShipmentPort:</b> {rowData.shipmentport}</p>
                    <p><b>BCD Notn:</b> {rowData.bcd_notn}</p>
                </div>
                <div className="col-md-1">
                    <p><b>BCD Rate:</b> {rowData.bcd_rate}</p>
                    <p><b>BCD Amt:</b> {rowData.bcd_amt}</p>
                    <p><b>CVD Notn:</b> {rowData.cvd_notn}</p>
                    <p><b>CVD Rate:</b> {rowData.cvd_rate}</p>
                    <p><b>CVD Amt</b> {rowData.cvd_amt}</p>
                    <p><b>IGST Amt</b> {rowData.igst_amt}</p>
                    <p><b>GST Cess Amt</b> {rowData.gst_cess_amt}</p>
                </div>
            </div>
        </div>
    );
};
const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
        <div style={{ lineHeight: '46px' }}>
            <Checkbox
                value={rowData[dataKey]}
                inline
                onChange={onChange}
                checked={checkedKeys.some(item => item === rowData[dataKey])}
            />
        </div>
    </Cell>
);



export default function DataTableImport(props) {
    let searchQuery = useSelector(state => state.data.searchQuery);


    // ---- for keyboard key press scroll @sarbojitghosh22 30-6-2025 modified on 4-7-2025---//

    const tableScrollRef = useRef(null);
    const tableRef = useRef();



    const handleTableKeyDown1 = (e) => {
        const bodyScrollable = document.querySelector('.rs-table-body-wheel-area');
        const headerScrollable = document.querySelector('.rs-table-header-row-wrapper'); // check class name here
        const scrollContainer = document.querySelector('.rs-table-body-row-wrapper');

        // Safety check
        if (!bodyScrollable || !headerScrollable || !scrollContainer) {
            console.warn('Required elements not found!');
            return;
        }

        // Extract current X transform
        const currentTransform = bodyScrollable.style.transform;
        const match = currentTransform.match(/translate3d\((-?\d+\.?\d*)px, 0px, 0px\)/);
        const currentX = match ? parseFloat(match[1]) : 0;

        // Calculate total scrollable width
        const row = bodyScrollable.querySelector('.rs-table-row'); // A single row's full width
        const scrollWidth = row?.scrollWidth || row?.offsetWidth || 0;
        const clientWidth = scrollContainer.clientWidth;
        const maxScroll = scrollWidth - clientWidth;

        const step = 100;
        let newX = currentX;

        if (e.key === 'ArrowRight') {
            if (Math.abs(currentX) >= maxScroll) return;
            newX = Math.max(currentX - step, -maxScroll);
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            if (currentX >= 0) return;
            newX = Math.min(currentX + step, 0);
            e.preventDefault();
        } else {
            return;
        }

        const newTransform = `translate3d(${newX}px, 0px, 0px)`;
        bodyScrollable.style.transform = newTransform;
        headerScrollable.style.transform = newTransform;
    };


    const handleTableKeyDown2 = (e) => {
        const bodyScrollable = document.querySelector('.rs-table-body-wheel-area');
        const headerScrollable = document.querySelector('.rs-table-header-row-wrapper');

        if (!bodyScrollable || !headerScrollable) {
            console.warn('Required elements not found!');
            return;
        }

        // 🧠 Extract current X and Y transform values
        const currentTransform = bodyScrollable.style.transform;
        const match = currentTransform.match(/translate3d\((-?\d+\.?\d*)px,\s*(-?\d+\.?\d*)px,\s*0px\)/);
        const currentX = match ? parseFloat(match[1]) : 0;
        const currentY = match ? parseFloat(match[2]) : 0;

        // Set scroll step sizes
        const stepX = 100; // horizontal scroll step
        const stepY = 46;  // row height (RSuite default)

        // Calculate scroll limits
        const row = bodyScrollable.querySelector('.rs-table-row');
        const scrollWidth = row?.scrollWidth || row?.offsetWidth || 0;
        const scrollHeight = row?.scrollHeight || row?.offsetHeight || 0;

        const container = bodyScrollable.parentElement;
        const clientWidth = container?.clientWidth || 0;
        const clientHeight = container?.clientHeight || 0;

        const maxScrollX = scrollWidth - clientWidth;
        const maxScrollY = scrollHeight * bodyScrollable.childElementCount - clientHeight;

        let newX = currentX;
        let newY = currentY;

        // 👉 Horizontal scroll
        if (e.key === 'ArrowRight') {
            if (Math.abs(currentX) >= maxScrollX) return;
            newX = Math.max(currentX - stepX, -maxScrollX);
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            if (currentX >= 0) return;
            newX = Math.min(currentX + stepX, 0);
            e.preventDefault();
        }

        // ⬇ Vertical scroll
        else if (e.key === 'ArrowDown') {
            newY = Math.max(currentY - stepY, -maxScrollY);
            e.preventDefault();
        }
        // ⬆ Vertical scroll
        else if (e.key === 'ArrowUp') {
            if (currentY >= 0) return; // already at top
            newY = Math.min(currentY + stepY, 0);
            e.preventDefault();
        } else {
            return;
        }

        // ✨ Apply the combined transform
        const newTransform = `translate3d(${newX}px, ${newY}px, 0px)`;
        bodyScrollable.style.transform = newTransform;
        headerScrollable.style.transform = `translate3d(${newX}px, 0px, 0px)`;
    };


    const handleTableKeyDown = (e) => {
        const bodyScrollable = document.querySelector('.rs-table-body-wheel-area');
        const headerScrollable = document.querySelector('.rs-table-header-row-wrapper');
        const verticalScrollbarHandle = document.querySelector('.rs-table-scrollbar-vertical .rs-table-scrollbar-handle');
        const horizontalScrollbarHandle = document.querySelector('.rs-table-scrollbar-horizontal .rs-table-scrollbar-handle');

        if (!bodyScrollable || !headerScrollable || !verticalScrollbarHandle || !horizontalScrollbarHandle) {
            console.warn('Required elements not found!');
            return;
        }

        // Extract current X and Y transform values
        const currentTransform = bodyScrollable.style.transform;
        const match = currentTransform.match(/translate3d\((-?\d+\.?\d*)px,\s*(-?\d+\.?\d*)px,\s*0px\)/);
        const currentX = match ? parseFloat(match[1]) : 0;
        const currentY = match ? parseFloat(match[2]) : 0;

        const stepX = 100;
        const stepY = 46; // Approximate row height

        const row = bodyScrollable.querySelector('.rs-table-row');
        const scrollWidth = row?.scrollWidth || row?.offsetWidth || 0;
        const scrollHeight = row?.scrollHeight || row?.offsetHeight || 0;

        const container = bodyScrollable.parentElement;
        const clientWidth = container?.clientWidth || 0;
        const clientHeight = container?.clientHeight || 0;

        const maxScrollX = scrollWidth - clientWidth;
        const maxScrollY = scrollHeight * bodyScrollable.childElementCount - clientHeight;

        let newX = currentX;
        let newY = currentY;

        if (e.key === 'ArrowRight') {
            if (Math.abs(currentX) >= maxScrollX) return;
            newX = Math.max(currentX - stepX, -maxScrollX);
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            if (currentX >= 0) return;
            newX = Math.min(currentX + stepX, 0);
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            newY = Math.max(currentY - stepY, -maxScrollY);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            if (currentY >= 0) return;
            newY = Math.min(currentY + stepY, 0);
            e.preventDefault();
        } else {
            return;
        }

        // Apply transform to table
        const newTransform = `translate3d(${newX}px, ${newY}px, 0px)`;
        bodyScrollable.style.transform = newTransform;
        headerScrollable.style.transform = `translate3d(${newX}px, 0px, 0px)`;

        // 💡 Calculate scroll percent
        const percentScrolledX = Math.abs(newX) / maxScrollX; // 0 to 1
        const percentScrolledY = Math.abs(newY) / maxScrollY;

        // 💡 Get available scroll space for scrollbar handle movement
        const scrollbarWidth = horizontalScrollbarHandle.parentElement.clientWidth;
        const handleWidth = horizontalScrollbarHandle.clientWidth;
        const maxHandleX = scrollbarWidth - handleWidth;

        const scrollbarHeight = verticalScrollbarHandle.parentElement.clientHeight;
        const handleHeight = verticalScrollbarHandle.clientHeight;
        const maxHandleY = scrollbarHeight - handleHeight;

        const handleTranslateX = maxHandleX * percentScrolledX;
        const handleTranslateY = maxHandleY * percentScrolledY;

        // 🟦 Move horizontal scrollbar
        horizontalScrollbarHandle.style.transform = `translate3d(${handleTranslateX}px, 0px, 0px)`;

        // 🟥 Move vertical scrollbar
        verticalScrollbarHandle.style.transform = `translate3d(0px, ${handleTranslateY}px, 0px)`;
    };


    // ---- for keyboard key press scroll @sarbojitghosh22 30-6-2025 modified on 4-7-2025---//




    // let columnListImportDashboard = props.countryCode.includes("IND") || props.countryCode.includes("SEZ") ? columnListImportDashboardIND : props.countryCode.includes("USA") ? columnListImportUSA : columnListImportForeign;
    // let columnListImportDashboard = searchQuery.countryCode.length > 1 ? columnListImportGlobal : columnListImportForeign;
    {/* country list for table for country length @sarbojitghosh22 2-5-2025 */ }
    let columnListImportDashboard = searchQuery.countryCode.length > 1 ? columnListImportGlobal : columnListExportForeign_new;




    {/* country list for table for country length @sarbojitghosh22 2-5-2025 */ }


    let tempDefaultSelectedColumns = columnListImportDashboard.filter(column => props.filteredColumn.some(key => key === column.key));
    let defaultSelectedColumns = []
    tempDefaultSelectedColumns.map(column => defaultSelectedColumns.push(column.key));
    let searchId = props.search_id ? props.search_id : null

    let checked = false;
    let indeterminate = false;
    let data = props.searchResult
    let newColumnsKeys = props.newColumnsKeys.length > 0 ? props.newColumnsKeys : defaultSelectedColumns.slice(0, 15)

    const [columnKeys, setColumnKeys] = useState(newColumnsKeys);
    const [loading, setLoading] = useState(false);
    const [compact, setCompact] = useState(true);
    const [bordered, setBordered] = useState(true);
    const [noData, setNoData] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [autoHeight, setAutoHeight] = useState(false);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rowDataModal, setRowDataModal] = useState(true);
    const [checkedKeys, setCheckedKeys] = useState([]);

    const [countryModal, setCountryModal] = useState(false);

    // State for modal, current column, and dropdown values
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterColumn, setFilterColumn] = useState(null);
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const nodeRef = React.createRef(null)

    let defaultColumns = []
    columnListImportDashboard.map((item, index) => {
        let objColumns = Object.keys(item);
        if (props.filteredColumn.includes(item.key)) {
            defaultColumns.push(item)
        }
    })

    if (checkedKeys.length === data.length) {
        checked = true;
    } else if (checkedKeys.length === 0) {
        checked = false;
    } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
        indeterminate = true;
    }

    const handleCheckAll = (value, checked) => {
        const keys = checked ? data.map(item => item.id) : [];
        setCheckedKeys(keys);
    };
    const handleCheck = (value, checked) => {
        const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
        setCheckedKeys(keys);
    };

    const columns = columnListImportDashboard.filter(column => columnKeys.some(key => key === column.key));
    const CompactCell = props => <Cell {...props} style={{ padding: 4 }} />;
    // const CompactHeaderCell = props => (
    //     <HeaderCell {...props} style={{ padding: 4, backgroundColor: '#3498ff', color: '#fff' }} />
    // );
    // const CompactHeaderCell = ({ children, columnKey, ...props }) => (
    //     <HeaderCell
    //         {...props}
    //         style={{
    //             padding: 4,
    //             backgroundColor: "#3498ff",
    //             color: "#fff",
    //             display: "flex",
    //             justifyContent: "space-between",
    //             alignItems: "center",
    //         }}
    //     >
    //         <span>{children}</span>
    //         {columnKey ?
    //             <FaClipboardList
    //                 style={{ cursor: "pointer", marginLeft: 8 }}
    //                 onClick={() => {

    //                     handleOpenFilter(columnKey, children)
    //                 }}
    //             /> : <></>}
    //     </HeaderCell>
    // );

    // --- for sorting application in the table @sarbojitghosh22 12-6-2025 ---//
    const CompactHeaderCell = ({ children, columnKey, sortColumn, sortType, onSort, ...props }) => (
        <HeaderCell
            {...props}
            style={{
                padding: 4,
                backgroundColor: "#3498ff",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "180px !important", // Set a fixed width for the header cell
            }}
        >
            <span>{children}</span>
            <div style={{ display: "flex", alignItems: "center" }}>
                {columnKey && (
                    <>
                        {/* Sorting icons */}
                        {/* <div style={{ cursor: "pointer", marginLeft: 8 }}> */}
                        <div style={{ cursor: "pointer" }}>

                            <span
                                style={{
                                    fontSize: "12px",
                                    marginRight: "4px",
                                    color: sortColumn === columnKey && sortType === "asc" ? "black" : "gray",
                                }}
                                onClick={() => onSort(columnKey, "asc")} // Send "asc" when clicking the ascending icon
                            >
                                ▲
                            </span>
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: sortColumn === columnKey && sortType === "desc" ? "black" : "gray",
                                }}
                                onClick={() => onSort(columnKey, "desc")} // Send "desc" when clicking the descending icon
                            >
                                ▼
                            </span>
                        </div>
                        {/* Previous functionality */}
                        <FaClipboardList
                            style={{ cursor: "pointer", marginLeft: 8 }}
                            onClick={() => {
                                handleOpenFilter(columnKey, children);
                            }}
                        />
                    </>
                )}
            </div>
        </HeaderCell>
    );
    // --- for sorting application in the table @sarbojitghosh22 12-6-2025 ---//


    const CustomCell = compact ? CompactCell : Cell;
    const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const handleExpanded = (rowData, dataKey) => {
        let open = false;
        const nextExpandedRowKeys = [];

        expandedRowKeys.forEach((key) => {
            if (key === rowData[rowKey]) {
                open = true;
            } else {
                nextExpandedRowKeys.push(key);
            }
        });

        if (!open) {
            nextExpandedRowKeys.push(rowData[rowKey]);
        }

        setExpandedRowKeys(nextExpandedRowKeys);
    };

    const handleModal = (rowData) => {
        setShowModal(true)
        setRowDataModal(rowData)
    }

    const handleModalClose = (rowData) => {
        setShowModal(false)
        setRowDataModal([])
    }



    const ExpandCellModal = ({ rowData, dataKey, expandedRowKeys, ...props }) => (
        <Cell {...props}>
            <IconButton
                size="xs"
                appearance="subtle"
                onClick={() => { handleModal(rowData) }}
                icon={<FaBeer />}
            />
        </Cell>
    );

    // --- handel sort modification @sarbojitghosh22 12-6-2025 --- //


    const [sortColumn, setSortColumn] = useState(null);
    const [sortType, setSortType] = useState(null);

    const handleSortColumn = (columnKey, currentSortType) => {

        const newSortType = currentSortType; // Toggle sort type

        setSortColumn(columnKey);
        setSortType(newSortType);

        setLoading(true);

        const updatedPayload = {
            ...props.apiSerachpayload,
            orderByColumn: columnKey,
            orderByMode: newSortType,
        };


        Axios({
            method: "POST",
            url: `search-management/search`,
            data: JSON.stringify(updatedPayload),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                props.setSearchResult(res.data.searchResult || []);

                console.log("IMPORT Sorted data fetched:", res.data);
            })
            .catch((err) => {
                console.error("Error fetching sorted data:", err);
            })
            .finally(() => {
                setLoading(false);
                props.setOrderByColumn(columnKey);
                props.setOrderByMode(newSortType);
            });


        // setTimeout(() => {
        //     setLoading(false);
        //     props.setOrderByColumn(sortColumn);
        //     props.setOrderByMode(currentSortType);
        // }, 500);
    };

    // --- handel sort modification @sarbojitghosh22 12-6-2025 --- //


    const history = useHistory();

    const googleRedirect = (keyValue) => {
        window.open(`https://www.google.com/search?q=${keyValue}`);
    }

    const handleSaveContact = (companyName) => {
        const postData = {
            "companyName": companyName,
            "address": null,
            "email": null,
            "mobile": null,
            "website": null
        }
        AxiosACT({
            method: "POST",
            url: `/activity-management/savecontact`,
            data: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (res.data == "CREATED") {
                    Swal.fire({
                        title: 'Success',
                        text: "Contact saved successfully",
                        icon: 'success',
                    })
                }
                else {
                    Swal.fire({
                        title: 'error',
                        text: "Duplicate Contact",
                        icon: 'error',
                    })
                }
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

    const handleOpenFilter = async (columnKey, label) => {
        try {
            setFilterColumn(label);
            setShowFilterModal(true);

            let updatedPayload = searchQuery;
            updatedPayload["columnName"] = columnKey;

            Axios({
                method: "POST",
                url: `/search-management/listdistinctcolumnvalue`,
                data: JSON.stringify(updatedPayload),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => {

                    let apiResponse = res.data.distinctColumnValuesList;
                    // let formattedOptions = apiResponse.map(({ column_name, records_count }) => ({
                    //     label: `${column_name} (${records_count})`,
                    //     value: column_name
                    // }));

                    setFilterOptions(apiResponse);
                })
        } catch (e) {
            setFilterOptions([]);
        }

        // Fetch options from your API
        // const data = await response.json();

        // Format options for react-multi-select-component
        // const formattedOptions = data.map(item => ({
        //     label: item,
        //     value: item
        // }));

        // const formattedOptions = [
        //     { label: "Option 1", value: "1" },
        //     { label: "Option 2", value: "2" },
        //     { label: "Option 3", value: "3" },
        // ];

    };

    const handleApplyFilter = () => {
        // Call your API with selected filter values
        const selectedValues = selectedOptions.map(opt => opt.value);
        // props.onApplyFilter(filterColumn, selectedValues);
        setShowFilterModal(false);
    };

    // //--- chnage in clicking all countries @sarbojitghosh22 4-6-2025 ---//

    // const [isCountrySelectorModalOpen, setIsCountrySelectorModalOpen] = useState(false);


    // const CountrySelectorModal = ({
    //     dataShow,
    //     dataHide,
    //     filterCountryList,
    //     // selectedCountries,
    //     setSelectedCountries,
    //     multiTradeCountryList,
    //     selectedTradeCountry,
    //     // countryRecords,
    //     // values,
    //     countryPayload,
    // }) => {
    //     const [tempSelectedCountries, setTempSelectedCountries] = useState([]);
    //     const [selectAll, setSelectAll] = useState(false);
    //     const [groupedCountries, setGroupedCountries] = useState({});
    //     const [localCountryRecords, setLocalCountryRecords] = useState([]);


    //     useEffect(() => {
    //         const grouped = multiTradeCountryList.reduce((acc, country) => {
    //             const continent = country.continentName || "Unknown";
    //             if (!acc[continent]) {
    //                 acc[continent] = [];
    //             }
    //             acc[continent].push(country);
    //             return acc;
    //         }, {});
    //         setGroupedCountries(grouped);
    //     }, [multiTradeCountryList]);

    //     useEffect(() => {
    //         const selectedValues = selectedTradeCountry.map((country) => country.value);
    //         setTempSelectedCountries(selectedValues);
    //         setSelectAll(selectedValues.length === filterCountryList.length);
    //     }, [selectedTradeCountry, filterCountryList]);

    //     useEffect(() => {
    //         const fetchLocalCountryRecords = async () => {

    //             let payload = searchQuery;
    //             payload["columnName"] = "ctry_name";

    //             try {
    //                 const response = await Axios({
    //                     method: "POST",
    //                     url: `/search-management/listdistinctcolumnvalue`,
    //                     data: JSON.stringify(payload),
    //                     headers: {
    //                         "Content-Type": "application/json"
    //                     }
    //                 });

    //                 if (response.data && response.data.distinctColumnValuesList) {
    //                     setLocalCountryRecords(response.data.distinctColumnValuesList);
    //                 }
    //             } catch (error) {
    //                 console.error("Error fetching country data:", error);
    //             }
    //         };

    //         if (dataShow) fetchLocalCountryRecords();
    //     }, [dataShow, countryPayload, setSelectedCountries]);

    //     const handleCheckboxChange = (shortcode) => {
    //         const updatedTempSelectedCountries = tempSelectedCountries.includes(shortcode)
    //             ? tempSelectedCountries.filter((code) => code !== shortcode)
    //             : [...tempSelectedCountries, shortcode];

    //         setTempSelectedCountries(updatedTempSelectedCountries);

    //         const updatedSelectedCountries = filterCountryList.filter((country) =>
    //             updatedTempSelectedCountries.includes(country.value)
    //         );

    //         setSelectedCountries(updatedSelectedCountries);
    //     };

    //     const handleSelectAllChange = () => {
    //         if (selectAll) {
    //             setTempSelectedCountries([]);
    //             setSelectedCountries([]);
    //         } else {
    //             const allCountryValues = filterCountryList.map((country) => country.value);
    //             setTempSelectedCountries(allCountryValues);
    //             setSelectedCountries(filterCountryList);
    //         }
    //         setSelectAll(!selectAll);
    //     };

    //     // Country label with count
    //     const getCountryLabelWithCount = (countryLabel) => {
    //         const record = localCountryRecords.find((item) => item.column_name === countryLabel);
    //         return record ? `${countryLabel} (${record.records_count})` : `${countryLabel} (0)`;
    //     };

    //     return (
    //         <Modal show={dataShow} onHide={dataHide} size="lg">
    //             <Modal.Header closeButton>
    //                 <Modal.Title>Source Countries</Modal.Title>
    //             </Modal.Header>
    //             <Modal.Body>
    //                 <div className="row mb-3">
    //                     <div className="col-md-12">
    //                         <div className="d-flex align-items-center countryModal_data_div">
    //                             <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
    //                             <label>Select All</label>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div className="countryModalData">
    //                     {Object.keys(groupedCountries).map((continent, index) => (
    //                         <div key={index} className="continent-section countryModal_contentSection">
    //                             <h5>{continent}</h5>
    //                             <div className="row countryModal_row">
    //                                 {groupedCountries[continent].map((country) => (
    //                                     <div key={country.value} className="col-md-4">
    //                                         <div className="d-flex align-items-center countryModal_data_div">
    //                                             <input
    //                                                 type="checkbox"
    //                                                 checked={tempSelectedCountries.includes(country.value)}
    //                                                 onChange={() => handleCheckboxChange(country.value)}
    //                                             />
    //                                             <label>
    //                                                 <Flag
    //                                                     code={country.iso2code}
    //                                                     style={{ width: "2em", height: "1.5em", marginRight: "5px" }}
    //                                                     alt={country.label}
    //                                                 />
    //                                                 {getCountryLabelWithCount(country.label)}
    //                                             </label>
    //                                         </div>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         </div>
    //                     ))}
    //                 </div>
    //             </Modal.Body>
    //             <Modal.Footer>
    //                 <Button variant="secondary"
    //                     onClick={() => {
    //                         setIsCountrySelectorModalOpen(false);
    //                     }}
    //                 >
    //                     Apply
    //                 </Button>

    //             </Modal.Footer>
    //         </Modal>
    //     );
    // };

    // //--- chnage in clicking all countries @sarbojitghosh22 4-6-2025 ---//

    // const handleClose = () => {
    //     setIsCountrySelectorModalOpen((prevState) => {
    //         return false;
    //     });
    // };

    // useEffect(() => {
    // }, [isCountrySelectorModalOpen]);




    // //--- chnage in clicking all countries @sarbojitghosh22 4-6-2025 ---//




    // --- api search data for countries change  @sarbojitghosh22 30/6/2025 --- //


    const [isCountrySelectorModalOpen, setIsCountrySelectorModalOpen] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState(props.selectedTradeCountry || []);


    const CountrySelectorModal = ({
        dataShow,
        dataHide,
        filterCountryList,
        selectedCountries,
        setSelectedCountries,
        multiTradeCountryList,
        apiSerachpayload,
        fetchSearchData,
        // setIsCountrySelectorModalOpen,
        countryPayload,
        // setApiSearchPayload
    }) => {
        // Local state for checkboxes
        const [tempSelectedCountries, setTempSelectedCountries] = useState(selectedCountries.map(c => c.value));
        const [selectAll, setSelectAll] = useState(false);
        const [localCountryRecords, setLocalCountryRecords] = useState([]);


        // Also update the effect to keep selectAll in sync if selectedCountries changes externally
        useEffect(() => {
            setTempSelectedCountries(selectedCountries.map(c => c.value));
            // setSelectAll(
            //     selectedCountries.length === filterCountryList.length
            // );
            setSelectAll(
                selectedCountries.length === apiSerachpayload.countryCode.length
            );
        }, [selectedCountries, filterCountryList]);



        // Checkbox handler
        const handleCheckboxChange = (shortcode) => {

            let updatedTempSelectedCountries;
            if (tempSelectedCountries.includes(shortcode)) {
                updatedTempSelectedCountries = tempSelectedCountries.filter(code => code !== shortcode);
            } else {
                updatedTempSelectedCountries = [...tempSelectedCountries, shortcode];
            }


            setTempSelectedCountries(updatedTempSelectedCountries);

            // Only check selectAll if all are selected
            // setSelectAll(updatedTempSelectedCountries.length === filterCountryList.length && filterCountryList.length > 0);
            setSelectAll(updatedTempSelectedCountries.length === selectedCountries.length && selectedCountries.length > 0);

        };


        // Select all handler
        const handleSelectAllChange = () => {

            if (selectAll) {
                setTempSelectedCountries([]);
                setSelectAll(false);
            } else {
                setTempSelectedCountries(filterCountryList.map(c => c.value));
                // setSelectAll(filterCountryList.length > 0); // Only true if there are countries
                // setSelectAll(
                //     selectedCountries.length === filterCountryList.length
                // );
                setSelectAll(
                    selectedCountries.length === apiSerachpayload.countryCode.length
                );
            }
        };

        useEffect(() => {
            const fetchLocalCountryRecords = async () => {

                let payload = searchQuery;
                payload["columnName"] = "ctry_name";

                try {
                    const response = await Axios({
                        method: "POST",
                        url: `/search-management/listdistinctcolumnvalue`,
                        data: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.data && response.data.distinctColumnValuesList) {
                        setLocalCountryRecords(response.data.distinctColumnValuesList);
                    }
                } catch (error) {

                }
            };

            if (dataShow) fetchLocalCountryRecords();
        }, [dataShow, countryPayload, setSelectedCountries]);

        const getCountryLabelWithCount = (countryLabel) => {
            // localCountryRecords should be available in the scope of your modal/component
            const record = localCountryRecords.find((item) => item.column_name === countryLabel);
            return record ? `${countryLabel} (${record.records_count})` : `${countryLabel} (0)`;
        };

        // --- KEEP YOUR MODAL DESIGN AS IS ---
        return (
            <Modal show={dataShow} onHide={dataHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Source Countries</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <div className="d-flex align-items-center countryModal_data_div">
                                <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                                <label>Select All</label>
                            </div>
                        </div>
                    </div>
                    <div className="countryModalData">
                        {Object.keys(multiTradeCountryList.reduce((acc, country) => {
                            const continent = country.continentName || "Unknown";
                            if (!acc[continent]) acc[continent] = [];
                            acc[continent].push(country);
                            return acc;
                        }, {})).map((continent, index) => (
                            <div key={index} className="continent-section countryModal_contentSection">
                                <h5>{continent}</h5>
                                <div className="row countryModal_row">
                                    {multiTradeCountryList.filter(c => (c.continentName || "Unknown") === continent).map((country) => (
                                        <div key={country.value} className="col-md-4 mb-2">
                                            <div className="d-flex align-items-center countryModal_data_div">
                                                <input
                                                    type="checkbox"
                                                    checked={tempSelectedCountries.includes(country.value)}
                                                    onChange={() => handleCheckboxChange(country.value)}
                                                />
                                                {/* <label style={{ marginLeft: 8 }}>{country.label}</label> */}
                                                <label>
                                                    <Flag
                                                        code={country.iso2code}
                                                        style={{ width: "2em", height: "1.5em", marginRight: "5px" }}
                                                        alt={country.label}
                                                    />
                                                    {getCountryLabelWithCount(country.label)}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={async () => {
                            setIsCountrySelectorModalOpen(false);

                            // Update parent state with selected country objects
                            const updatedSelectedCountries = filterCountryList.filter(c =>
                                tempSelectedCountries.includes(c.value)
                            );
                            setSelectedCountries(updatedSelectedCountries);

                            // Build payload and call API
                            const updatedPayload = {
                                ...apiSerachpayload,
                                countryCode: tempSelectedCountries
                            };
                            props.setApiSearchPayload(updatedPayload); // <-- update parent state
                            await fetchSearchData(updatedPayload);
                        }}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };



    const fetchSearchData = async (payload) => {

        try {
            const response = await Axios({
                method: "POST",
                url: `search-management/search`,
                data: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Try all possible keys, fallback to empty array
            if (response.data && response.data.searchResult) {
                props.setSearchResult(response.data.searchResult);
            } else if (response.data && response.data.expForeignList) {
                props.setSearchResult(response.data.expForeignList);
            } else if (response.data && response.data.impForeignList) {
                props.setSearchResult(response.data.impForeignList);
            } else {
                props.setSearchResult([]);
            }

            return response.data;
        } catch (error) {
            // Optionally handle error
            return null;
        }
    };


    const handleClose = () => {
        setIsCountrySelectorModalOpen((prevState) => {
            return false;
        });
    };

    useEffect(() => {
    }, [isCountrySelectorModalOpen]);



    // --- api search data for countries change  @sarbojitghosh22 30/6/2025 --- //


    return (
        <>
            <div className="data-menu mt-4 mb-2 text-right">
                <ul>
                    {/* <li style={{ background: "#ffc107", color: "blue" }} onClick={() => setCountryModal(true)}>All Countries ({props.totalRecord})</li> */}



                    {/* --- all countries display change @sarbojitghosh22 4-6-2025 --- */}


                    <li style={{ background: "#ffc107", color: "blue" }} onClick={() => {
                        setIsCountrySelectorModalOpen(true);
                    }}>
                        All Countries


                    </li>
                    {/* <CountrySelectorModal
                        key={isCountrySelectorModalOpen ? "open" : "closed"}
                        dataShow={isCountrySelectorModalOpen}
                        dataHide={handleClose}
                        filterCountryList={props.filterCountryList}
                        selectedCountries={props.selectedCountries}
                        setSelectedCountries={props.setSelectedCountries}
                        multiTradeCountryList={props.multiTradeCountryList}
                        selectedTradeCountry={props.selectedTradeCountry}
                        countryRecords={props.countryRecords}
                        values={props.values}
                    /> */}

                    <CountrySelectorModal
                        dataShow={isCountrySelectorModalOpen}
                        dataHide={handleClose}
                        filterCountryList={props.filterCountryList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries}
                        multiTradeCountryList={props.multiTradeCountryList}
                        countryPayload={props.countryPayload}
                        apiSerachpayload={props.apiSerachpayload}
                        fetchSearchData={fetchSearchData}
                        setIsCountrySelectorModalOpen={setIsCountrySelectorModalOpen}
                    />


                    {/* --- all countries display change @sarbojitghosh22 4-6-2025 --- */}


                    <li className="tableHeaderSelect">
                        <DropdownMultiselect
                            options={defaultColumns}
                            name="countries"
                            handleOnChange={(selected) => {

                                if (selected.length > 100) {
                                    selected = selected.slice(0, 100);
                                    Swal.fire({
                                        title: 'Alert!',
                                        text: 'Column display limit reached, max 10 are allowed',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                    });
                                    setColumnKeys(selected);
                                } else {
                                    setColumnKeys(selected)
                                }
                            }}
                            selected={columnKeys}
                            placeholder="Custom"
                            placeholderMultipleChecked="Custom"
                            buttonClass="cus-drop"
                            selectDeselectLabel={null}
                        />
                    </li>
                    {/* <li><i className="icon ion-md-repeat"></i> Custom Sort</li> */}
                    <li onClick={() => { props.exportToCSV(); }}><i className="icon ion-md-download"></i> Export All</li>
                    <li onClick={() => {
                        checkedKeys.length > 0 ? props.exportSelectedToCSV(checkedKeys) :
                            Swal.fire({
                                title: 'Oops!',
                                text: "Please select rows",
                                icon: 'error',
                            });
                    }}><i className="icon ion-md-download"></i> Export Selected</li>
                    <li className="customMenu">
                        <DropdownButton id="dropdown-basic-button" title="Save Query">
                            {props.state && props.state.hasOwnProperty("workspaceId") && props.state.workspaceId != "" ? <Dropdown.Item onClick={() => { props.saveQuery() }}>Save</Dropdown.Item> : null}
                            <Dropdown.Item onClick={() => { props.setWorkspace(true); }}>Save as</Dropdown.Item>
                        </DropdownButton></li>

                    <li className="customMenu">
                        <DropdownButton id="dropdown-basic-button" title="Go to">
                            <Dropdown.Item >
                                <Link to={{
                                    pathname: "/analysis",
                                    state: {
                                        search_id: searchId,
                                        workspaceData: props.state,
                                        columnKeys: columnKeys,
                                        importerForExport: props.importerForExport,
                                        exporterForImport: props.exporterForImport,
                                        apiSerachpayload: props.apiSerachpayload, // <-- added
                                        value: props.value // <-- add this if you have a value prop
                                    }
                                }}> Macro Analysis </Link>
                            </Dropdown.Item>
                            {/* <Dropdown.Item onClick = {(e)=>{
                                 Swal.fire({
                                    title: 'Info',
                                    text: "This Feature is Coming Soon",
                                    icon: 'info',
                                })
                            }}> */}
                             <Dropdown.Item >
                                <Link to={{
                                    pathname: "/indepthAnalysis",
                                    state: {
                                        search_id: searchId, columnKeys: columnKeys, workspaceData: props.state,
                                        importerForExport: props.importerForExport, exporterForImport: props.exporterForImport
                                    },
                                }}> In-depth Analysis </Link>
                            </Dropdown.Item> 
                        </DropdownButton></li>
                </ul>
            </div>

            <div className="row">
                <div className="col-md-12">
                    {/* {props.searchLoading?(
                    <div className="loaderBlock">
                        <div className="loader"></div>
                    </div>
                    ):null} */}
                    <div
                        ref={tableScrollRef}
                        tabIndex={0}
                        autoFocus
                        style={{
                            overflowX: "auto",
                            outline: "none",
                            width: "100%",           // Make sure this is set
                            minWidth: "900px",       // Add this line to force horizontal scroll if needed
                            maxWidth: "100vw"        // Optional: limit to viewport width
                        }}
                        onClick={e => e.currentTarget.focus()} // Optional: focus on click
                        onKeyDown={handleTableKeyDown} // <-- Add this line

                    >

                        <Table
                            ref={tableRef}
                            loading={loading || props.searchLoading}
                            height={500}
                            // hover={hover}
                            // showHeader={showHeader}
                            // autoHeight={autoHeight}
                            data={props.searchResult}
                            // bordered={bordered}
                            // cellBordered={bordered}
                            // headerHeight={compact ? 30 : 40}
                            // rowHeight={compact ? 30 : 46}
                            rowKey={rowKey}
                            expandedRowKeys={expandedRowKeys}
                            onRowClick={(data) => {
                            }}
                            renderRowExpanded={renderRowExpanded}
                            rowExpandedHeight={310}
                            //   rowExpandedWidth={650}
                            // sortColumn={props.orderByColumn}
                            // sortType={props.orderByMode}

                            sortColumn={sortColumn}
                            sortType={sortType}

                            onSortColumn={handleSortColumn}
                        >
                            <Column width={70} align="center">
                                <CustomHeaderCell style={{ padding: 0 }}>
                                    <div style={{ lineHeight: '40px' }}>
                                        <Checkbox
                                            inline
                                            checked={checked}
                                            indeterminate={indeterminate}
                                            onChange={handleCheckAll}
                                        />
                                    </div>
                                </CustomHeaderCell>
                                <CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
                            </Column>

                            {
                                props.countryCode.includes("XXXXX") ?
                                    <Column width={70} align="center">
                                        <CustomHeaderCell>#</CustomHeaderCell>
                                        <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
                                    </Column>
                                    : null
                            }

                            <Column width={70} align="center">
                                <CustomHeaderCell>Action</CustomHeaderCell>
                                <ExpandCellModal dataKey="id" expandedRowKeys={expandedRowKeys} />
                            </Column>
                            {columns.map(column => {
                                const { key, label, ...rest } = column;
                                return (
                                    <Column {...rest} key={key} resizable>
                                        {/* <CustomHeaderCell columnKey={key} >{label}</CustomHeaderCell> */}

                                        {/* table column sorting implementation @sarbojitghosh22 12-6-2025 */}


                                        <CustomHeaderCell
                                            columnKey={key}
                                            sortColumn={sortColumn}
                                            sortType={sortType}
                                            // onSort={handleSortColumn}
                                            onSort={(columnKey, currentSortType) => handleSortColumn(columnKey, currentSortType)}

                                        >
                                            {label}
                                        </CustomHeaderCell>

                                        {/* table column sorting implementation @sarbojitghosh22 12-6-2025 */}



                                        <Cell dataKey={key}>
                                            {rowData => {
                                                return (
                                                    <OverlayTrigger
                                                        placement="left"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={<Tooltip className="show"> {`${rowData[key]}`}</Tooltip>}
                                                    >
                                                        <span>
                                                            {(key === "importer" || key === "foreign_exporter" || key === "importer_name" || key === "exporter_name") ? (
                                                                <>
                                                                    {/* <a onClick={() => googleRedirect(rowData[key])}><i className="icon ion-ios-map"></i> </a> */}
                                                                    {/* --------- changes done for icon showing in table @sarbojitghosh22 25-6-2025 --------- */}

                                                                    <a onClick={() => googleRedirect(rowData[key])}><FaGoogle style={{ color: 'black', padding: '1px', height: '13px' }} /></a>
                                                                    {/* --------- changes done for icon showing in table @sarbojitghosh22 25-6-2025 ---------  */}

                                                                    <a onClick={() => handleSaveContact(rowData[key])}><i className="icon ion-ios-save"></i> </a> |{' '}
                                                                </>) : null}
                                                            {`${rowData[key]}`}
                                                        </span>
                                                    </OverlayTrigger>
                                                );
                                            }}
                                        </Cell>

                                    </Column>
                                );
                            })}
                        </Table>
                    </div>
                    {props.totalRecord > 0 ? (
                        <div style={{ padding: 20 }}>
                            <Pagination
                                prev
                                next
                                first
                                last
                                ellipsis
                                boundaryLinks
                                maxButtons={5}
                                size="xs"
                                layout={['total', '-', 'limit', '|', 'pager']}
                                //layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                                total={props.totalRecord > 10000 ? 10000 : props.totalRecord}
                                limitOptions={[10, 20, 30, 40, 50, 100, 200]}
                                limit={props.limit}
                                activePage={props.page}
                                onChangePage={props.setPage}
                                onChangeLimit={props.handleChangeLimit}
                            />
                        </div>
                    ) : null}
                </div>
                <div>
                    {rowDataModal ?
                        <Modal className="" bssize="md"
                            show={showModal}
                            onHide={handleModalClose}
                        >
                            <Modal.Header closeButton > Description </Modal.Header>
                            <Modal.Title >  </Modal.Title>

                            <Modal.Body style={{ height: '80vh', overflow: 'auto', scrollbarWidth: '10px' }}>
                                <div>
                                    {Object.keys(rowDataModal).map((item, index) => (
                                        columnListImportDashboard.map((val, i) => (
                                            <div key={index + i}>
                                                {rowDataModal[item] != null && val.key == item ? <p ref={nodeRef}><b>{val.label}:</b> {rowDataModal[item]}</p> : null}
                                            </div>
                                        ))
                                    ))}
                                </div>
                            </Modal.Body>

                        </Modal>
                        : null}
                </div>

                <Modal size="lg" show={showFilterModal} onHide={() => setShowFilterModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>List of {filterColumn}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <MultiSelect
                            options={filterOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Select"
                        /> */}
                        <DataTableCoulumnFilter data={filterOptions} />

                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button onClick={handleApplyFilter} variant="primary">Apply</Button> */}
                        <Button onClick={() => setShowFilterModal(false)} variant="secondary">close</Button>
                    </Modal.Footer>
                </Modal>

                {/* <DataTableCoutryFilterModal
                    show={countryModal}
                    filterCountryList={props.filterCountryList}
                    handleClose={() => setCountryModal(false)}
                >
                </DataTableCoutryFilterModal> */}
            </div>

        </>
    );

}