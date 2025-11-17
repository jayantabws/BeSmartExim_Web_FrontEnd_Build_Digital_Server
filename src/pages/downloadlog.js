import React, { useState, useEffect } from "react";
import Axios from "../shared/Axios";
import Swal from "sweetalert2";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { loaderStart, loaderStop } from "../store/actions/loader";
import { updateSubscriptionCount } from "../store/actions/data";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import DloadTemplateXLS from '../components/DloadTemplateXLS'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

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
  searchValue: "Search Value",
  relation: "Relation",
  searchBy: "Search By",
  queryBuilder: "Query Builder"
};

const DownloadLog = (props) => {
  const userId = localStorage.getItem("userToken");
  let userData = localStorage.getItem("user");
  userData = userData ? JSON.parse(userData) : {};

  const [totalCount, setTotalCount] = useState(0);
  const [downloadList, setDownloadList] = useState([]);
  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // 20 records per page
  const [filterSearchValue, setFilterSearchValue] = useState("");
  const [filteredArray, setFilteredArray] = useState([]);

  function onSortChange(sortName, sortOrder) {
    console.info('onSortChange', arguments);
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  //  FIXED: Get total count for download logs
  const getTotalCount = async (searchValue = "") => {
    try {
      let userID = userData && userData.uplineId == 0 ? "uplineId" : "userId";
      
      const params = {
        [userID]: userId,
      //  userId: userId,
        isDownloaded: 'Y'
      };

      if (searchValue && searchValue.trim() !== "") {
        params.searchValue = searchValue.trim();
      }
 
      console.log("Download Count API Params:", params);

      const response = await Axios({
        method: "GET",
        url: `search-management/search/countAllnew`,
        params: params
      });

      console.log("Download Count Response:", response.data);

      let count = 0;
      const data = response.data;

      if (typeof data === 'number') {
        count = data;
      } else if (data && typeof data === 'object') {
        count = data.totalCount || data.count || data.total || data.result || 0;
      } else if (typeof data === 'string' && !isNaN(data)) {
        count = parseInt(data);
      }

      console.log("Setting download total count to:", count);
      setTotalCount(count);
      return count;

    } catch (error) {
      console.error("Error fetching download count:", error);
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

  //  FIXED: Handle form submission
  const handleSubmit = async (values) => {
    const searchValue = values.searchValue || "";
    
    setCurrentPage(1);
    setFilterSearchValue(searchValue);
    
    console.log("Submitting search with value:", searchValue);
    
    await getTotalCount(searchValue);
    await handleSubmitWithPage(searchValue, 1);
  };

  //  FIXED: Main data fetching function for download logs
  const handleSubmitWithPage = async (searchValue, page) => {
    try {
      setLoading(true);
      props.loadingStart && props.loadingStart();

      let userID = userData && userData.uplineId == 0 ? "uplineId" : "userId";
      
      const params = {
        [userID]: userId,
        // userId: userId,
        isDownloaded: 'Y',
        pageNumber: page - 1, // 0-based indexing
        numberOfRecords: pageSize
      };

      if (searchValue && searchValue.trim() !== "") {
        params.searchValue = searchValue.trim();
      }

      console.log("Download List API Params:", params);

      const response = await Axios({
        method: "GET",
        url: `search-management/search/listAllnew`,
        params: params
      });

      console.log("Download List Response:", response.data);
      
      let tempQueryList = [];
      if (response.data && response.data.queryList && response.data.queryList.length > 0) {
        response.data.queryList.forEach((item, index) => {
          let jsonData = { ...item };
          
          // Process userSearchQuery if it exists
          if (item.userSearchQuery) {
            Object.keys(item.userSearchQuery).forEach((subKey) => {
              jsonData[subKey] = item.userSearchQuery[subKey];
            });
            
            // Build query string
            let queryParts = [];
            Object.keys(searchBYList).forEach((item2) => {
              if (item2 === "queryBuilder" && item.userSearchQuery[item2] && Array.isArray(item.userSearchQuery[item2])) {
                item.userSearchQuery[item2].forEach((subitem, subindex) => {
                  if (subitem && subitem.relation && subitem.searchBy && subitem.searchValue) {
                    queryParts.push(
                      `<b>${searchBYList[item2]} ${subindex + 1}</b>: ` +
                      `<b>Relation</b>: ${subitem.relation}, ` +
                      `<b>Search By</b>: ${subitem.searchBy}, ` +
                      `<b>Search Value</b>: ${subitem.searchValue}`
                    );
                  }
                });
              } else if (item.userSearchQuery[item2] && 
                         item.userSearchQuery[item2] !== "" && 
                         item.userSearchQuery[item2] !== null &&
                         searchBYList[item2]) {
                queryParts.push(`<b>${searchBYList[item2]}</b>: ${item.userSearchQuery[item2]}`);
              }
            });
            
            jsonData.querySting = queryParts.filter(part => part !== null && part !== "");
          }
          
          // Ensure unique ID
          jsonData.id = jsonData.id || jsonData.searchId || `download-${page}-${index}`;
          tempQueryList.push(jsonData);
        });
      }
      
      console.log("Processed download data:", tempQueryList);
      setDownloadList(tempQueryList);
      setCurrentPage(page);

    } catch (error) {
      console.error("Error fetching download data:", error);
      setDownloadList([]);
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

  //  NEW: Download log specific functions
  const fetchSearchQuery = (search_id) => {
    if (search_id) {
      Axios({
        method: "GET",
        url: `/search-management/search/details`,
        params: { searchId: search_id }
      })
        .then(res => {
          if (res.data.queryList) {
            let sParams = res.data.queryList[0].userSearchQuery;
            exportToCSV(sParams, search_id);
          }
        })
        .catch(err => {
          console.log("Error fetching search query:", err);
        });
    }
  }

  const exportToCSV = (searchParams, searchId) => {
    const postData = {
      "searchType": "TRADE",
      "tradeType": searchParams.tradeType,
      "fromDate": searchParams.fromDate,
      "toDate": searchParams.toDate,
      "searchBy": searchParams.searchBy,
      "searchValue": searchParams.searchValue,
      "countryCode": searchParams.countryCode,
      "pageNumber": 0,
      "numberOfRecords": 5000,
      "searchId": searchId,
      "hsCodeList": searchParams.hsCodeList || [],
      "exporterList": searchParams.exporterList || [],
      "importerList": searchParams.importerList || [],
      "cityOriginList": searchParams.cityOriginList || [],
      "cityDestinationList": searchParams.cityDestinationList || [],
      "portOriginList": searchParams.portOriginList || [],
      "portDestinationList": searchParams.portDestinationList || [],
      "orderByColumn": "",
      "orderByMode": "desc",
      "matchType": searchParams.matchType,
      "hsCode4DigitList": searchParams.hsCode4DigitList || [],
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
        if (searchParams.tradeType.toLowerCase() === "export" && searchParams.countryCode.toUpperCase() === "USA") {
          exportDataSet = res.data.expForeignList || []
        }
        else if (searchParams.tradeType.toLowerCase() === "export" && searchParams.countryCode.toUpperCase() === "IND") {
          exportDataSet = res.data.expIndList || []
        }
        else if (searchParams.tradeType.toLowerCase() === "import" && searchParams.countryCode.toUpperCase() === "USA") {
          exportDataSet = res.data.impForeignList || []
        }
        else if (searchParams.tradeType.toLowerCase() === "import" && searchParams.countryCode.toUpperCase() === "IND") {
          exportDataSet = res.data.impIndList || []
        }

        let filteredArray = []
        for (let i = 0; i < exportDataSet.length; i++) {
          let filtered = {};
          let obj = exportDataSet[i];
          for (let key in obj) {
            if (typeof obj[key] === "object") {
              let item = obj[key];
              if (item != null) {
                filtered[key] = obj[key];
              }
            } else {
              filtered[key] = obj[key];
            }
          }
          filteredArray.push(filtered);
        }
        setFilteredArray(filteredArray)
        downloadXLS(searchParams)
      })
      .catch(err => {
        console.log("Export CSV Error:", err);
      });
  }

  const downloadXLS = (searchParams) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = searchParams.tradeType + "_" + searchParams.countryCode + "_" + searchParams.fromDate + "_" + searchParams.toDate;
    
    const ws = XLSX.utils.table_to_sheet(document.getElementById("reportXLS"));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const renderView = (data) => {
    if (!data || !Array.isArray(data)) return "";
    
    let htmlView = `<table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Country Name</th>
        <th scope="col">Country Weightage</th>
        <th scope="col"># of country</th>
        <th scope="col">Total Point</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.countryName || ''}</td>
          <td>${item.weightagePoints || 0}</td>
          <td>${item.totalCount || 0}</td>
          <td>${item.totalWeightage || 0}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>`;
    return htmlView;
  }

  const viewDownloadLog = (cell, row) => {
    if (cell) {
      Axios({
        method: "GET",
        url: `download-log/get-log/${cell}`,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data && res.data.length > 0) {
            let tempData = res.data[0];
            let logData = JSON.parse(tempData.downloadJson);
            Swal.fire({
              title: "Download Log",
              text: "Download Log Data",
              icon: "info",
              html: renderView(logData)
            });
          }
        })
        .catch(err => {
          console.log("Error viewing download log:", err);
          Swal.fire({
            title: "Error",
            text: "Something went wrong, please try again.",
            icon: "error"
          });
        });
    }
  }

  //  FIXED: Format functions for download log data
  const searchTypeFormat = (cell, row) => {
    return cell?.searchType || cell || ""
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

  const periodFormat = (cell, row) => {
    if (!row.fromDate || !row.toDate) return "";
    return moment(row.fromDate).format("MMM. DD, YYYY") + " - " +
      moment(row.toDate).format("MMM. DD, YYYY")
  }

  const searchedOnFormat = (cell, row) => {
    if (!row.downloadedDate) return "";
    return moment(row.downloadedDate).format("MMM. DD, YYYY, h:mm:ss a")
  }

  const searchedByFormat = (cell, row) => {
    if (!cell) return "";
    return cell + (row.downloadedByEmail ? " [ " + row.downloadedByEmail + " ]" : "")
  }

  const actionFormatter = (cell, row) => {
    return (
      <div className='text-center'>
        <button 
          onClick={() => viewDownloadLog(cell, row)} 
          className="effect-btn btn btn-primary mt-2 mr-2 icon-lg"
          title="View Download Log"
        >
          <i className="icon ion-md-eye"></i>
        </button>
      </div>
    )
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
    <div>
      {/*  FIXED: Updated breadcrumb for download log */}
      {/* <div className="page-header mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-2">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Activity Log
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <h3 className="page-title mb-0">Download History</h3>
            </li>
          </ol>
        </nav>
      </div> */}

      {/*  FIXED: Single search field form */}
      <div className="filter-section bg-light p-3 rounded shadow-sm">
        <Formik
          initialValues={initialValues}
          validationSchema={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
            <div className="bg-white p-4 rounded shadow-sm" style={{ width: "100%", marginTop: "10px" }}>
              <h3 className="page-title mb-0 active">Download History</h3>
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

      {/*  FIXED: Download log table */}
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2">Loading download data...</p>
                </div>
              ) : (
                <div>
                  <BootstrapTable data={downloadList} striped hover options={options}>
                    <TableHeaderColumn width='50' isKey dataField='id' dataFormat={indexN}>Sl No</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='searchType' dataSort={true} dataFormat={searchTypeFormat}>Search Type</TableHeaderColumn>
                    <TableHeaderColumn width='400' dataField='querySting' dataFormat={QueryFormat}>Query</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='tradeType' dataSort={true}>Trade Type</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='countryCode' dataSort={true}>Country</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='fromDate' dataFormat={periodFormat} dataSort={true}>Period</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='totalRecords' dataSort={true}>Total Records</TableHeaderColumn>
                    {userData && userData.uplineId == 0 ?
                      <TableHeaderColumn width='200' dataField='downloadedByName' dataFormat={searchedByFormat} dataSort={true}>Download By</TableHeaderColumn> : null
                    }
                    <TableHeaderColumn width='200' dataField='downloadedDate' dataFormat={searchedOnFormat} dataSort={true}>Download On</TableHeaderColumn>
                    <TableHeaderColumn width='100' dataField='recordsDownloaded' dataSort={true}>Records</TableHeaderColumn>
                    <TableHeaderColumn width='150' dataField='searchId' dataFormat={actionFormatter}>Action</TableHeaderColumn>
                  </BootstrapTable>

                  {/* Custom Pagination */}
                  {totalCount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      <div>
                        <span className="text-muted">
                          Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                          <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> of{" "}
                          <strong>{totalCount}</strong> download records
                          
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
                  {!loading && downloadList.length === 0 && (
                    <div className="text-center py-4">
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        No download records found matching your search criteria.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden export template */}
      <div id="reportXLS" hidden={true}>
        {filteredArray && filteredArray.length > 0 ? <DloadTemplateXLS filteredArray={filteredArray} /> : null}
      </div>
    </div>
  );
};

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DownloadLog));