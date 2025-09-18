import React, { useEffect, useState } from 'react';
import Axios from "../shared/Axios";
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import imagePencil from '../assets/image/pencil-square.svg';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { loaderStart, loaderStop } from "../store/actions/loader";
import { updateSubscriptionCount } from "../store/actions/data"
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import DloadTemplateXLS from '../components/DloadTemplateXLS'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Swal from 'sweetalert2';

// const searchBYList = { "HS_CODE": "HS Code", "PRODUCT": "Product", "IMPORTER": "Importer", "EXPORTER": "Exporter" };

const searchBYList = {
  cityDestinationList: "Destination City",
  cityOriginList: "City of Origin",
  exporterList: "Exporter List",
  hsCode4DigitList: "HS Code (4 Digit)",
  hsCodeList: "HS Code (8 Digit)",
  importerList: "Importer List",
  portDestinationList: "Destination Port",
  portOriginList: "Port of Origin",
  searchValue: "Search Value"
}

let initialValues = {
  tradeType: "",
  searchBy: "",
  searchValue: "",
  countryCode: "",
  fromDate: "",
  toDate: "",
  matchType: "",
  dateRange: "",
  searchFlag: false
};

const DownloadLog = (props) => {
  const history = useHistory();

  const userId = localStorage.getItem("userToken");
  let userData = localStorage.getItem("user");
  userData = userData ? JSON.parse(userData) : {};

  const [searchList, setSearchList] = useState([]);
  const [searchListData, setSearchListData] = useState([]);
  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [searchValue, setSearchValue] = useState([]);
  const [isDownloaded, setIsDownloaded] = useState("");
  const [filteredArray, setFilteredArray] = useState([]);


  const getSearchList = () => {

    let userID = ""
    userID = userData && userData.uplineId == 0 ? "uplineId" : "userId";
    props.loadingStart()
    Axios({
      method: "GET",
      url: `search-management/search/listAll?${userID}=${userId}&isDownloaded=Y`
    })
      .then(res => {
        let tempQueryList = []
        if (res.data.queryList && res.data.queryList.length > 0) {
          res.data.queryList.map((item, index) => {
            let jsonData = {}
            Object.keys(item).map((key, Val) => {
              if (key != "userSearchQuery") {
                jsonData[key] = item[key]
              }
              else {
                Object.keys(item["userSearchQuery"]).map((subKey, subVal) => {
                  jsonData[subKey] = item["userSearchQuery"][subKey]
                  jsonData['querySting'] = searchBYList ? Object.keys(searchBYList).map((item2, index2) => (
                    item2 == "queryBuilder" && item["userSearchQuery"][item2] ? (
                      item["userSearchQuery"][item2].map((subitem, subindex) => (
                        `<b>${searchBYList[item2] + (subindex + 1)}</b>` + " : " +
                        `<b>${searchBYList["relation"]}</b>` + " : " + subitem.relation + " ,&nbsp " + `<b>${searchBYList["searchBy"]}</b>` + " : " + subitem.searchBy + " ,&nbsp " + `<b>${searchBYList["searchValue"]}</b>` + " : " + subitem.searchValue
                      ))
                    ) :
                      (item["userSearchQuery"][item2] != "" && item["userSearchQuery"][item2] != null ? `<b>&nbsp;${searchBYList[item2]}</b>` + " : " + item["userSearchQuery"][item2] : null)
                  )) : null

                })
              }
            })
            tempQueryList.push(jsonData)
          })
        }
        console.log("tempQueryList [======= ", tempQueryList)
        setSearchList(tempQueryList);
        setSearchListData(tempQueryList);
        props.loadingStop()
      })
      .catch(err => {
        // console.log("Err", err);
        props.loadingStop()
      });
  }

  const fetchSearchQuery = (search_id) => {
    if (search_id) {
      let newSuggestionList = []
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
            };

            sParams.searchValue.map((item, index) => {
              let specificItem = { "value": item, "label": item };
              newSuggestionList.push(specificItem);
            })
            setSearchValue(newSuggestionList)
            exportToCSV(sParams, search_id);
            setIsDownloaded(res.data.queryList[0].isDownloaded)
          }
        })
        .catch(err => {
          // console.log("Err", err);
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
      "hsCodeList": searchParams.hsCodeList,
      "exporterList": searchParams.exporterList,
      "importerList": searchParams.importerList,
      "cityOriginList": searchParams.cityOriginList,
      "cityDestinationList": searchParams.cityDestinationList,
      "portOriginList": searchParams.portOriginList,
      "portDestinationList": searchParams.portDestinationList,
      "orderByColumn": "",
      "orderByMode": "desc",
      "matchType": searchParams.matchType,
      "hsCode4DigitList": searchParams.hsCode4DigitList,

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
          exportDataSet = res.data.expForeignList
        }
        else if (searchParams.tradeType.toLowerCase() === "export" && searchParams.countryCode.toUpperCase() === "IND") {
          exportDataSet = res.data.expIndList
        }
        else if (searchParams.tradeType.toLowerCase() === "import" && searchParams.countryCode.toUpperCase() === "USA") {
          exportDataSet = res.data.impForeignList
        }
        else if (searchParams.tradeType.toLowerCase() === "import" && searchParams.countryCode.toUpperCase() === "IND") {
          exportDataSet = res.data.impIndList
        }
        else {
          exportDataSet = []
        }

        let filteredArray = []
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
        // setTimeout(downloadXLS(searchParams,totalRecord,1), 5000)
        downloadXLS(searchParams)


      })
      .catch(err => {
        // console.log("Err == ", err);
      });
  }

  const downloadXLS = (searchParams) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = searchParams.tradeType + "_" + searchParams.countryCode + "_" + searchParams.fromDate + "_" + searchParams.toDate;
    // const ws = XLSX.utils.json_to_sheet(filteredArray);

    const ws = XLSX.utils.table_to_sheet(document.getElementById("reportXLS"));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);

  }


  function onSortChange(sortName, sortOrder) {
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  useEffect(() => {
    getSearchList();
  }, []);

  const searchTypeFormat = (cell, row) => {
    return cell.searchType
  }

  const QueryFormat = (cell, row, enumObject, index) => {

    // let textString  =  searchBYList ? Object.keys(searchBYList).map((item, index) => (
    //       row[item] != "" && row[item] != null ? `<b>${searchBYList[item]}</b>` +" : "+ row[item] : null
    //     ) ) : null 

    let res = cell.filter(elements => {
      return elements !== null;
    });
    return (res)

  }

  const tradeTypeFormat = (cell, row) => {
    return cell.tradeType
  }

  const countryFormat = (cell, row) => {
    return cell.countryCode
  }

  const periodFormat = (cell, row) => {
    return moment(row.fromDate).format("MMM. DD, YYYY") + "-" +
      moment(row.toDate).format("MMM. DD, YYYY")
  }

  const searchedOnFormat = (cell, row) => {
    return moment(row.downloadedDate).format("MMM. DD, YYYY, h:mm:ss a")
  }

  const searchedByFormat = (cell, row) => {
    return cell + " [ " + row.downloadedByEmail + " ]"
  }

  const renderView = (data) => {
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
          <td>${index + 1}</th>
          <td>${item.countryName}</td>
          <td>${item.weightagePoints}</td>
          <td>${item.totalCount}</td>
          <td>${item.totalWeightage}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>`;
    return htmlView;
  }

  const viewDownloadLog = (cell, row) => {
    // console.log("Cell data >>> ", cell);
    // console.log("Row Data >>> ", row);

    if (cell) {
      Axios({
        method: "GET",
        url: `download-log/get-log/${cell}`,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          // console.log("Get Download Log", res.data);
          if (res.data) {
            let tempData = res.data[0];
            let logData = JSON.parse(tempData.downloadJson);
            // console.log("LogData >>> ", logData);
            Swal.fire({
              title: "Download Log",
              text: "Download Log Data",
              icon: "info",
              html: renderView(logData)
            });
          }
        })
        .catch(err => {
          // console.log("Err", err);
          let errorMsg = "Somethhing went wrong, please try again."
        });
    }
  }

  const actionFormatter = (cell, row) => {
    return (
      <div className='text-center'>
        <button onClick={() => viewDownloadLog(cell, row)} className="effect-btn btn btn-primary mt-2 mr-2 icon-lg">
          <i className="icon ion-md-eye"></i>
        </button>
      </div>
    )
  }

  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange
  };

  const indexN = (cell, row, enumObject, index) => {
    return (<div>{index + 1}</div>);
  }

  return (
    <>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-12 list-page mt-3">

            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Download History</h4>
                    <div >
                      <BootstrapTable data={searchList} striped hover
                        pagination={true} search
                        options={options}
                      >
                        <TableHeaderColumn width='70' isKey dataField='id' dataFormat={indexN}>Sl No</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='searchType' dataSort={true}>Search Type</TableHeaderColumn>
                        <TableHeaderColumn width='400' dataField='querySting' dataFormat={QueryFormat} >Query</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='tradeType' dataSort={true}>Trade Type</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='countryCode' dataSort={true}>Country</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='userSearchQuery' dataFormat={periodFormat} dataSort={true}>Period</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='totalRecords' dataSort={true}>Total Records</TableHeaderColumn>
                        {userData && userData.uplineId == 0 ?
                          <TableHeaderColumn width='200' dataField='downloadedByName' dataFormat={searchedByFormat} dataSort={true}>Download By</TableHeaderColumn> : null
                        }
                        <TableHeaderColumn width='200' dataField='userSearchQuery' dataFormat={searchedOnFormat} dataSort={true}>Download On</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='recordsDownloaded' dataSort={true}>Records</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='searchId' dataFormat={actionFormatter}>Action</TableHeaderColumn>
                      </BootstrapTable>

                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div id="reportXLS" hidden={true}>
          {filteredArray && filteredArray.length > 0 ? <DloadTemplateXLS filteredArray={filteredArray} /> : null}
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DownloadLog));
