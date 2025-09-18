import React, { Component,useState, useRef, useCallback, useEffect, Fragment } from 'react'
import moment from 'moment';
import AxiosMaster from '../shared/AxiosMaster';


const ViewSubscription = (props) => {

  const [subscriptionDetails, setSubscriptionDetails] = useState([]);

  const getSubscriptionDetails = () => {
    let subscriptionId = props.rowData.subscriptionId

    AxiosMaster({
      method: "GET",
      url: `masterdata-management/subscription/${subscriptionId}`,    
    })
      .then(res => {
        setSubscriptionDetails(res.data)
      })
      .catch(err => {
        setSubscriptionDetails([])
      });
  }


  useEffect(() => {
    getSubscriptionDetails(props)
  },[])


    return (
      <div>
          <table class="table table-striped table-hover">
            
              <thead>
              <tr>
                <th>Item Name</th>
                <th>Assigned</th>
                <th>Available</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Total Download Limit</td>
                <td>{subscriptionDetails && subscriptionDetails.downloadLimit}</td>
                <td>{props.rowData.downloadLimit}</td>
              </tr>
              <tr>
                <td>Total Sub User</td>
                <td>{subscriptionDetails && subscriptionDetails.subUserCount}</td>
                <td>{props.rowData.subUserCount}</td>
              </tr>
              <tr>
                <td>Total Workspace</td>
                <td>{subscriptionDetails && subscriptionDetails.workspaceLimit}</td>
                <td>{props.rowData.totalWorkspace}</td>
              </tr>
              {/*
              <tr>
                <td>Maximum Number of Records Per Workspace</td>
                <td>{subscriptionDetails && subscriptionDetails.recordPerWorkspace}</td>
                <td>{props.rowData.recordsPerWorkspace}</td>
              </tr>
               */}
              <tr>
                <td>Data Available Upto</td>
                <td>{subscriptionDetails && subscriptionDetails.dataAccess}</td>
                <td>{props.rowData.dataAccessInMonth}</td>
              </tr>
              <tr>
                <td>Search Query Per Day</td>
                <td>{subscriptionDetails && subscriptionDetails.searchQueryPerDay}</td>
                <td>{props.rowData.queryPerDay}</td>
              </tr>                    
              <tr>
                <td>Plan Create Date</td>                     
                <td colSpan={2}>{moment(props.rowData.createdDate).format("DD-MM-YYYY")}</td>
              </tr>
              <tr>
                <td>Plan Expire Date</td>
                <td colSpan={2}>{moment(props.rowData.accountExpireDate).format("DD-MM-YYYY")}</td>
              </tr>
            </tbody>
            
          </table>
      </div>
    )

}

export default ViewSubscription
