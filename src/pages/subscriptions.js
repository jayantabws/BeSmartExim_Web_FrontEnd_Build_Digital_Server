import React, { useEffect, useState } from 'react';
import AxiosUser from "../shared/AxiosUser";
import moment from 'moment';
import ViewSubscription from "../components/ViewSubscription"
import { Row, Col, Modal, Button, FormGroup } from 'react-bootstrap';

export default function Markets() {

  const userId = localStorage.getItem("userToken");

  const [loading, isLoading] = useState(false);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [subscriptionListData, setSubscriptionListData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);


  const getSubscriptionList = () => {

    AxiosUser({
      method: "GET",
      url: `user-management/user-subscription/list?userId=${userId}`
    })
      .then(res => {
        setSubscriptionList(res.data.userSubscriptionList);
        setSubscriptionListData(res.data.userSubscriptionList);
        isLoading(true);
      })
      .catch(err => {
        // console.log("Err", err);
        isLoading(true);
      });
  }

  useEffect(() => {
    getSubscriptionList();
  }, []);

  const userSubscription = (text) => {
    console.log("text", text)
    let subscriptionData = subscriptionList.filter((subscription) => subscription.name.toLowerCase().includes(text.toLowerCase()));
    setSubscriptionListData(subscriptionData);
  }

  const UserSubscriptionDetails = (rowData) => {
   setShowModal(true)
   setRowData(rowData)    
  }

  const handleClose = (e) => {
    setShowModal(false)
  }

  return (
    <>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-12 list-page mt-3">


            <div className="search-ar mt-2 mb-2">
              <h2 className="headl">Subscriptions</h2>
              <div className="wrap float-right">
                <div className="search">
                  <input type="text" onChange={(e) => { userSubscription(e.target.value) }} className="searchTerm" placeholder="What are you looking for?" />
                  <button type="submit" className="searchButton">
                    <i className="icon ion-md-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead className="">
                <tr>
                  <th>Sl. No.</th>
                  <th>Package Name</th>
                  {/*<th>Price (in INR)</th>*/}
                  <th>Validity (in Days)</th>
                  <th>Added On</th>
                  <th>Expire On</th>
                  <th>Status</th>                  
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  subscriptionListData.length > 0 ? (
                    subscriptionListData.map((subscription, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}.</td>
                          <td>{subscription.name}</td>
                          {/*<td>{subscription.price}</td>*/}
                          <td>{subscription.validityInDay}</td>
                          <td>{moment(subscription.createdDate).format("MMM. DD, YYYY")}</td>
                          <td>{moment(subscription.accountExpireDate).format("MMM. DD, YYYY")}</td>
                          <td>{subscription.isActive=='Y' ? <div style={{color:"green",fontWeight:"bold",}}>ACTIVE</div> : <div style={{color:"red",fontWeight:"bold"}}>INACTIVE</div>}</td>
                          <td><button className="btn btn-primary btn-sm" onClick = {()=> { UserSubscriptionDetails(subscription)}}><i className="icon ion-md-eye"></i></button></td>
                        </tr>
                      )

                    })
                  ) : (<tr><td colSpan="7" style={{ textAlign: "center" }}>No record found</td></tr>)
                ) : (
                  <div className="loaderBlock">
                    <div className="loader"></div>
                  </div>
                )}
              </tbody>
            </table>

          </div>
        </div>


      </div>
      
        <div>
            <Modal className="customModal brandModal" bsSize="md"
                show={showModal}
                onHide={handleClose}>
                <Modal.Header closeButton className="custmModlHead">
                    <div ><h3>Subscription Details </h3> </div>
                </Modal.Header>
                <Modal.Body>                                           
                <ViewSubscription 
                  rowData = {rowData}
                  isAdmin = {false}
                />                       
                </Modal.Body>
            </Modal>
        </div>

    </>
  );
}
