import React, { useEffect, useState } from 'react';
import Axios from "../shared/Axios";
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { loaderStart, loaderStop } from "../store/actions/loader";
import { updateSubscriptionCount } from "../store/actions/data"
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const validateForm = Yup.object().shape({
  searchValue: Yup.string(),
});

const initialValues = {
  searchValue: "",
};

const searchBYList = {
  cityDestinationList: "Destination City",
  cityOriginList: "City of Origin",
  exporterList: "Exporter List",
  hsCode4DigitList: "HS Code (4 Digit)",
  hsCodeList: "HS Code (8 Digit)",
  importerList: "Importer List",
  portDestinationList: "Destination Port",
  portOriginList: "Port of Origin",
  rangeQuantityStart: "Minimum Quantity",
  rangeQuantityEnd: "Maximum Quantity",
  rangeValueUsdStart: "Minimum Value (in USD)",
  rangeValueUsdEnd: "Maximum Value (in USD)",
  rangeUnitPriceUsdStart: "Minimum Unit Price (in USD)",
  rangeUnitPriceUsdEnd: "Maximum Unit Price (in USD)",
  consumptionType: "Consumption Type",
  incoterm: "Incoterm",
  notifyParty: "Notify Party",
  searchValue: "Search Value",
  relation: "Relation",
  searchBy: "Search By",
  queryBuilder: "Additional"
};

const SearchLogNew = (props) => {
  const history = useHistory();

  const userId = localStorage.getItem("userToken");
  let userData = localStorage.getItem("user");
  userData = userData ? JSON.parse(userData) : {};

  const [totalCount, setTotalCount] = useState(0);
  const [searchList, setSearchList] = useState([]);
  const [searchListData, setSearchListData] = useState([]);
  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // 20 records per page like DownloadLogNew
  const [filterSearchValue, setFilterSearchValue] = useState("");

  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  //  NEW: Get total count for search logs
  const getTotalCount = async (searchValue = "") => {
    try {
      let userID = userData && userData.uplineId == 0 ? "uplineId" : "userId";
      
      const params = {
        [userID]: userId
      };

      //  FIXED: Add search parameter if provided
      if (searchValue && searchValue.trim() !== "") {
        params.searchValue = searchValue.trim();
      }

      console.log("Search Count API Params:", params);

      const response = await Axios({
        method: "GET",
        url: `search-management/search/countAllnew`,
        params: params
      });

      console.log("Search Count Response:", response.data);

      let count = 0;
      const data = response.data;

      if (typeof data === 'number') {
        count = data;
      } else if (data && typeof data === 'object') {
        count = data.totalCount || data.count || data.total || data.result || 0;
      } else if (typeof data === 'string' && !isNaN(data)) {
        count = parseInt(data);
      }

      console.log("Setting search total count to:", count);
      setTotalCount(count);
      return count;

    } catch (error) {
      console.error("Error fetching search count:", error);
      setTotalCount(0);
      return 0;
    }
  };

  //  FIXED: Initial load
  useEffect(() => {
    const initializeData = async () => {
      await getTotalCount("");
      await handleSubmitWithPage("", 1);
    };
    
    initializeData();
  }, []);

  //  NEW: Handle form submission
  const handleSubmit = async (values) => {
    const searchValue = values.searchValue || "";
    
    setCurrentPage(1);
    setFilterSearchValue(searchValue);
    
    console.log("Submitting search with value:", searchValue);
    
    await getTotalCount(searchValue);
    await handleSubmitWithPage(searchValue, 1);
  };

  //  FIXED: Main data fetching function for search logs using listAllnew
  const handleSubmitWithPage = async (searchValue, page) => {
    try {
      setLoading(true);
      props.loadingStart && props.loadingStart();

      let userID = userData && userData.uplineId == 0 ? "uplineId" : "userId";
      
      const params = {
        [userID]: userId,
        pageNumber: page - 1, // 0-based indexing
        numberOfRecords: pageSize
      };

      //  FIXED: Add search parameter if provided
      if (searchValue && searchValue.trim() !== "") {
        params.searchValue = searchValue.trim();
      }

      console.log("Search List API Params:", params);

      const response = await Axios({
        method: "GET",
        url: `search-management/search/listAllnew`,
        params: params
      });

      console.log("Search List Response:", response.data);
      
      let tempQueryList = [];
      if (response.data && response.data.queryList && response.data.queryList.length > 0) {
        response.data.queryList.forEach((item, index) => {
          let jsonData = { ...item };
          
          // Process userSearchQuery if it exists
          if (item.userSearchQuery) {
            Object.keys(item.userSearchQuery).forEach((subKey) => {
              if (subKey !== "searchId") {
                jsonData[subKey] = item.userSearchQuery[subKey];
              }
            });
            
            // Build query string like the original
            jsonData['querySting'] = searchBYList ? Object.keys(searchBYList).map((item2, index2) => {
              if (item2 === "queryBuilder" && item.userSearchQuery[item2]) {
                return item.userSearchQuery[item2].map((subitem, subindex) => (
                  `<b>${searchBYList[item2] + (subindex + 1)}</b>: ` +
                  `<b>${searchBYList["relation"]}</b>: ${subitem.relation}, ` +
                  `<b>${searchBYList["searchBy"]}</b>: ${subitem.searchBy}, ` +
                  `<b>${searchBYList["searchValue"]}</b>: ${subitem.searchValue}`
                ));
              } else {
                return (item.userSearchQuery[item2] !== "" && item.userSearchQuery[item2] !== null) ? 
                  `<b>${searchBYList[item2]}</b>: ${item.userSearchQuery[item2]}` : null;
              }
            }).filter(item => item !== null) : null;
          }
          
          // Ensure unique ID
          jsonData.id = jsonData.id || jsonData.searchId || `search-${page}-${index}`;
          tempQueryList.push(jsonData);
        });
      }
      
      console.log("Processed search data:", tempQueryList);
      setSearchList(tempQueryList);
      setSearchListData(tempQueryList);
      setCurrentPage(page);

    } catch (error) {
      console.error("Error fetching search data:", error);
      setSearchList([]);
      if (page === 1) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
      props.loadingStop && props.loadingStop();
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(totalCount / pageSize) && !loading) {
      console.log("Changing to page:", page);
      handleSubmitWithPage(filterSearchValue, page);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  //  FIXED: Format functions for search log data
  const searchTypeFormat = (cell, row) => {
    return cell || row.searchType || "";
  }

  const QueryFormat = (cell, row, enumObject, index) => {
    if (!cell) return "";
    
    if (Array.isArray(cell)) {
      let res = cell.filter(elements => {
        return elements !== null && elements !== undefined && elements !== "";
      });
      return res.join(", ");
    }
    
    return cell;
  }

  const tradeTypeFormat = (cell, row) => {
    return cell || row.tradeType || "";
  }

  const countryFormat = (cell, row) => {
    return cell || row.countryCode || "";
  }

  const periodFormat = (cell, row) => {
    if (!row.fromDate || !row.toDate) return "";
    return moment(row.fromDate).format("MMM. DD, YYYY") + " - " + 
           moment(row.toDate).format("MMM. DD, YYYY");
  }

  const searchedOnFormat = (cell, row) => {
    if (!row.createdDate) return "";
    return moment(row.createdDate).format("MMM. DD, YYYY, h:mm:ss a");
  }

  const searchedByFormat = (cell, row) => {
    if (!cell) return "";
    return cell + (row.createdByEmail ? " [ " + row.createdByEmail + " ]" : "");
  }

  const actionFormatter = (cell, row) => {
    return (
      <div className='text-center'>
        <button 
          onClick={() => {
            history.push({
              pathname: '/list1',
              state: {
                search_id: cell, 
                workspace_id: "NIL", 
                search_type: "HISTORY"
              }
            });
          }} 
          className="effect-btn btn btn-primary mt-2 mr-2 icon-lg"
          title="View Search Results"
        >
          <i className="icon ion-md-search"></i>
        </button>
      </div>
    );
  }

  const indexN = (cell, row, enumObject, index) => {
    return <div>{(currentPage - 1) * pageSize + index + 1}</div>;
  };

  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange,
    noDataText: loading ? 'Loading...' : 'No records found'
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <div className="container-fluid">
        {/*  NEW: Breadcrumb like DownloadLogNew */}
        {/* <div className="page-header mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2">
              <li className="breadcrumb-item">
                <a href="!#" onClick={(event) => event.preventDefault()}>
                  Activity Log
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <h3 className="page-title mb-0">Search History</h3>
              </li>
            </ol>
          </nav>
        </div> */}

        {/*  NEW: Filter Section like DownloadLogNew */}
        <div className="filter-section bg-light p-3 rounded shadow-sm">
         
          <Formik
            initialValues={initialValues}
            validationSchema={validateForm}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, resetForm }) => (
           <Form>
                       <div className="bg-white p-4 rounded shadow-sm" style={{ width: "100%", marginTop: "10px" }}>
                         <h3 className="page-title mb-0 active">Search History</h3>
             <div className="d-flex flex-wrap align-items-end justify-content-end" style={{ gap: "15px" }}>
               
               {/* Search Field */}
               <div style={{ minWidth: "280px", maxWidth: "400px" }}>
                 <label className="form-label fw-semibold mb-2 text-dark">Search Value</label>
                 <Field
                   type="text"
                   name="searchValue"
                   placeholder="Search by query, trade type, country..."
                   className="form-control"
                   style={{
                     height: "42px",
                     borderRadius: "6px",
                     border: "1px solid #ced4da",
                     fontSize: "14px"
                   }}
                 />
               </div>
           
               {/* Search & Reset Buttons */}
               <div className="d-flex align-items-end" style={{ gap: "10px" }}>
                 
                 {/* Search */}
                    <button
                                 type="submit"
                                 className="btn btn-primary fw-semibold shadow-sm w-100 d-flex align-items-center justify-content-center"
                                 style={{
                                   height: "42px",
                                   borderRadius: "6px",
                                   fontSize: "14px",
                                   fontWeight: "600",
                                   letterSpacing: "0.5px"
                                 }}
                                 disabled={loading}
                               >
                                 {loading ? (
                                   <>
                                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                     SEARCHING...
                                   </>
                                 ) : (
                                   <>
                                     <i className="fas fa-search me-2"></i>
                                     SEARCH
                                   </>
                                 )}
                               </button>
           
                 {/* Reset */}
               <button
                                 type="button"
                                 onClick={async () => {
                                   resetForm({
                                     values: {
                                       searchValue: "",
                                     }
                                   });
                                   
                                   setCurrentPage(1);
                                   setFilterSearchValue("");
                                   
                                   await getTotalCount("");
                                   await handleSubmitWithPage("", 1);
                                 }}
                                 className="btn btn-outline-secondary fw-semibold shadow-sm w-100 d-flex align-items-center justify-content-center"
                                 style={{
                                   height: "42px",
                                   borderRadius: "6px",
                                   fontSize: "14px",
                                   fontWeight: "600",
                                   letterSpacing: "0.5px",
                                   borderColor: "#6c757d",
                                   color: "#6c757d"
                                 }}
                                 disabled={loading}
                               >
                                 <i className="fas fa-undo me-2"></i>
                                 RESET
                               </button>
           
               </div>
           
             </div>
           </div>
           
                       </Form>
            )}
          </Formik>
        </div>

        {/*  UPDATED: Search history table */}
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <div className="text-center my-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2">Loading search data...</p>
                  </div>
                ) : (
                  <div>
                    <BootstrapTable data={searchList} striped hover options={options}>
                      <TableHeaderColumn width='50' isKey dataField='id' dataFormat={indexN}>Sl No</TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='searchType' dataSort={true} dataFormat={searchTypeFormat}>Search Type</TableHeaderColumn>
                      <TableHeaderColumn width='520' dataField='querySting' dataFormat={QueryFormat} dataSort={true}>Query</TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='tradeType' dataSort={true} dataFormat={tradeTypeFormat}>Trade Type</TableHeaderColumn>
                      <TableHeaderColumn width='80' dataField='countryCode' dataSort={true} dataFormat={countryFormat}>Country</TableHeaderColumn>
                      <TableHeaderColumn width='150' dataField='userSearchQuery' dataFormat={periodFormat} dataSort={true}>Period</TableHeaderColumn>
                      <TableHeaderColumn width='100' dataField='totalRecords' dataSort={true}>Total Records</TableHeaderColumn>
                      {userData && userData.uplineId == 0 ?
                        <TableHeaderColumn width='150' dataField='createdByName' dataFormat={searchedByFormat} dataSort={true}>Searched By</TableHeaderColumn> : null
                      }
                      <TableHeaderColumn width='160' dataField='userSearchQuery' dataFormat={searchedOnFormat} dataSort={true}>Searched On</TableHeaderColumn>
                      <TableHeaderColumn width='50' dataField='searchId' dataFormat={actionFormatter}>Action</TableHeaderColumn>
                    </BootstrapTable>

                    {/* Custom Pagination */}
                    {totalCount > 0 && (
                      <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <div>
                          <span className="text-muted">
                            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                            <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> of{" "}
                            <strong>{totalCount}</strong> search records
                            
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            disabled={currentPage === 1 || loading}
                            onClick={() => handlePageChange(1)}
                            style={{ marginRight: '5px' }}
                            title="First Page"
                          >
                            <i className="fas fa-angle-double-left"></i> First
                          </button>

                          <button
                            className="btn btn-sm btn-outline-primary"
                            disabled={currentPage === 1 || loading}
                            onClick={() => handlePageChange(currentPage - 1)}
                            style={{ marginRight: '5px' }}
                            title="Previous Page"
                          >
                            <i className="fas fa-angle-left"></i> Prev
                          </button>

                          <div className="mx-2">
                            {generatePageNumbers().map((pageNum) => (
                              <button
                                key={pageNum}
                                className={`btn btn-sm ${
                                  currentPage === pageNum 
                                    ? 'btn-primary' 
                                    : 'btn-outline-primary'
                                }`}
                                onClick={() => handlePageChange(pageNum)}
                                disabled={loading}
                                style={{ 
                                  marginRight: '3px', 
                                  minWidth: '35px',
                                  fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                                }}
                              >
                                {pageNum}
                              </button>
                            ))}
                          </div>

                          <button
                            className="btn btn-sm btn-outline-primary"
                            disabled={currentPage === totalPages || loading}
                            onClick={() => handlePageChange(currentPage + 1)}
                            style={{ marginRight: '5px' }}
                            title="Next Page"
                          >
                            Next <i className="fas fa-angle-right"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-primary"
                            disabled={currentPage === totalPages || loading}
                            onClick={() => handlePageChange(totalPages)}
                            title="Last Page"
                          >
                            Last <i className="fas fa-angle-double-right"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* No Data Message */}
                    {!loading && searchList.length === 0 && (
                      <div className="text-center py-4">
                        <div className="alert alert-info">
                          <i className="fas fa-info-circle me-2"></i>
                          No search records found matching your search criteria.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadingStart: () => dispatch(loaderStart()),
    loadingStop: () => dispatch(loaderStop()),
    updateSubscriptionCount: (data) => dispatch(updateSubscriptionCount(data)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchLogNew));