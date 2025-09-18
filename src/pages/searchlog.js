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

  rangeQuantityStart: "Minimum Quantity",
  rangeQuantityEnd: "Maximun Quantity",
  rangeValueUsdStart: "Minimum Value (in USD)",
  rangeValueUsdEnd: "Maximun Value (in USD)",
  rangeUnitPriceUsdStart: "Minimum Unit Price (in USD)",
  rangeUnitPriceUsdEnd: "Maximun Unit Price (in USD)",
  consumptionType: "Consumption Type",
  incoterm: "Incoterm",
  notifyParty: "Notify Party",

  searchValue: "Search Value",
  relation: "Relation",
  searchBy: "Search By",
  queryBuilder: "Additional"

}


const Markets = (props) => {
  const history = useHistory();

  const userId = localStorage.getItem("userToken");
  let userData = localStorage.getItem("user");
  userData = userData ? JSON.parse(userData) : {};

  const [searchList, setSearchList] = useState([]);
  const [searchListData, setSearchListData] = useState([]);
  const [sortName, setSortName] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(0); // starts from 0
  const [pageSize] = useState(10); // default limit
  const [hasMoreData, setHasMoreData] = useState(true); // to disable next if needed
  const [totalCount, setTotalCount] = useState(0);

  const getTotalCount = () => {
    let userID = userData && userData.uplineId == 0 ? "uplineId" : "userId";
    Axios({
      method: "GET",
      url: `search-management/search/countAll?${userID}=${userId}`,
    })
      .then((res) => {
        console.log("Count Res > >>", res)
        if (res.data && res.status === 200) {
          setTotalCount(res.data);
        }
      })
      .catch((err) => {
        // console.log("Count Error", err);
      });
  };


  const getSearchList = (page = 0) => {

    let userID = ""
    userID = userData && userData.uplineId == 0 ? "uplineId" : "userId";
    props.loadingStart()
    Axios({
      method: "GET",
      url: `search-management/search/listAll?${userID}=${userId}&page=${page}&size=${pageSize}`
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
                  if (subKey != "searchId") {
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
                  }
                })
              }
            })
            tempQueryList.push(jsonData)
          })
        }
        setSearchList(tempQueryList);
        setSearchListData(tempQueryList);
        console.log("Inside search list total count >>> ", totalCount)
        setHasMoreData((page + 1) * pageSize < totalCount); // check if more data is available
        props.loadingStop()
      })
      .catch(err => {
        // console.log("Err", err);
        props.loadingStop()
      });
  }

  function onSortChange(sortName, sortOrder) {
    setSortName(sortName);
    setSortOrder(sortOrder);
  }

  useEffect(() => {
    getTotalCount();
  }, []);

  useEffect(() => {
    if (totalCount > 0) {
      getSearchList(currentPage);
    } // fetch when component mounts or page changes
  }, [currentPage, totalCount]);

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasMoreData) {
      setCurrentPage(currentPage + 1);
    }
  };

  const searchTypeFormat = (cell, row) => {
    return cell.searchType
  }

  const QueryFormat = (cell, row, enumObject, index) => {

    // let textString  =  searchBYList ? Object.keys(searchBYList).map((item, index) => (
    //   item == "queryBuilder" && row[item] && row[item].length > 0 ? (
    //     row[item].map((subitem, subindex) => (
    //       `<b>${searchBYList[item]+(subindex+1)}</b>` +" : "+
    //       `<b>${searchBYList["relation"]}</b>` +" : "+ subitem.relation + " , "+ `<b>${searchBYList["searchBy"]}</b>` +" : "+ subitem.searchBy + " , "+ `<b>${searchBYList["searchValue"]}</b>` +" : "+ subitem.searchValue
    //     ))
    //   ) : 
    //   (row[item] != "" && row[item] != null ? `<b>${searchBYList[item]}</b>` +" : "+ row[item] : null)
    // )) : null



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
    return moment(row.fromDate).format("MMM. DD, YYYY") + " - " + moment(row.toDate).format("MMM. DD, YYYY");
  }

  const searchedOnFormat = (cell, row) => {
    return moment(row.createdDate).format("MMM. DD, YYYY, h:mm:ss a")
  }

  const searchedByFormat = (cell, row) => {
    return cell + " [ " + row.createdByEmail + " ]"
  }


  const actionFormatter = (cell, row) => {
    return (<div> <button onClick={() => {
      history.push({
        pathname: '/list1',
        state: {
          search_id: cell, workspace_id: "NIL", search_type: "HISTORY"
        }
      })
    }} className="effect-btn btn btn-primary mt-2 mr-2 icon-lg"><i className="icon ion-md-search"></i></button>
    </div>)
  }

  const options = {
    sortName: sortName,
    sortOrder: sortOrder,
    onSortChange: onSortChange
  };

  const indexN = (cell, row, enumObject, index) => {
    return (<div>{(currentPage * pageSize) + (index + 1)}</div>);
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
                    <h4 className="card-title">Search History</h4>
                    <div >
                      <BootstrapTable data={searchList} striped hover
                        pagination={false} search
                        options={options}
                      >
                        <TableHeaderColumn width='50' isKey dataField='id' dataFormat={indexN}>Sl No</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='searchType' dataSort={true}>Search Type</TableHeaderColumn>
                        <TableHeaderColumn width='520' dataField='querySting' dataFormat={QueryFormat} dataSort={true}>Query</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='tradeType' dataSort={true}>Trade Type</TableHeaderColumn>
                        <TableHeaderColumn width='80' dataField='countryCode' dataSort={true}>Country</TableHeaderColumn>
                        <TableHeaderColumn width='150' dataField='userSearchQuery' dataFormat={periodFormat} dataSort={true}>Period</TableHeaderColumn>
                        <TableHeaderColumn width='100' dataField='totalRecords' dataSort={true}>Total Records</TableHeaderColumn>
                        {userData && userData.uplineId == 0 ?
                          <TableHeaderColumn width='150' dataField='createdByName' dataFormat={searchedByFormat} dataSort={true}>Searched By</TableHeaderColumn> : null
                        }
                        <TableHeaderColumn width='160' dataField='userSearchQuery' dataFormat={searchedOnFormat} dataSort={true}>Searched On</TableHeaderColumn>
                        <TableHeaderColumn width='50' dataField='searchId' dataFormat={actionFormatter}>Action</TableHeaderColumn>
                      </BootstrapTable>
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-outline-primary"
                          onClick={handlePrev}
                          disabled={currentPage === 0}
                        >
                          Previous
                        </button>
                        <span>Page {currentPage + 1} of {Math.ceil(totalCount / pageSize)}</span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={handleNext}
                          disabled={!hasMoreData}
                        >
                          Next
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Markets));
