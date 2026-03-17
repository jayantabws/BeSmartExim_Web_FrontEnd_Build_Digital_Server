import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
const searchBYList = { "HS_CODE": "HS Code", "PRODUCT": "Product", "IMPORTER": "Importer", "EXPORTER": "Exporter" };


const HistoryOrder = (props) => {
  const history = useHistory();

  const safeValue = (value) => {
    if (!value) return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return "-";
    return value;
  };

  const formatDate = (date) => {
    return moment(date, "YYYY-MM-DD", true).isValid()
      ? moment(date).format("MMM. DD, YYYY")
      : "-";
  };

  return (
    <>
      <div className="market-order mt15">
        <h2 className="heading">Recent 5 search list</h2>       

        <table className="table table-striped cus-tab">
          <thead>
            <tr>
              <th width="8%">Search Type</th>
              <th width="10%">HS-CODE / Query</th>
              <th width="8%">Trade Type</th>
              <th width="8%">Country</th>
              <th width="15%">Period</th>
              <th width="10%">Re-Run Query</th>
            </tr>
          </thead>
          <tbody>
          {console.log("search.userSearchQuery.searchBy === ", "test")}
            {props.recentSearchList.map((search, index) => (
            <tr key={index}>
              <td width="8%">{safeValue(search?.userSearchQuery?.searchType)}</td>

              <td width="10%">
                Search By: {safeValue(searchBYList[search?.userSearchQuery?.searchBy])}
                <br />
                Search Value: {safeValue(search?.userSearchQuery?.searchValue)}
              </td>

              <td width="8%">{safeValue(search?.userSearchQuery?.tradeType)}</td>
              <td width="8%">{safeValue(search?.userSearchQuery?.countryCode)}</td>

              <td width="15%">
                {formatDate(search?.userSearchQuery?.fromDate)} - {formatDate(search?.userSearchQuery?.toDate)}
              </td>

              <td width="10%">
                <button
                  onClick={() => {
                    history.push({
                      pathname: "/list1",
                      state: {
                        search_id: search.searchId,
                        search_type: "HISTORY",
                      },
                    });
                  }}
                  className="effect-btn btn btn-primary mt-2 mr-2 icon-lg"
                >
                  <i className="icon ion-md-search"></i>
                </button>
              </td>
            </tr>
          ))}

          </tbody>
        </table>







        {/* <span className="no-data">
          <i className="icon ion-md-document"></i>
          No data
        </span> */}

      </div>
    </>
  );
}
export default HistoryOrder;
