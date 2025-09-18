import React, { useEffect, useState } from 'react';
import AxiosUser from "../shared/AxiosUser";
import moment from 'moment';
import AddUser from '../components/CreateUser';
import EditUser from '../components/EditUser';
import { Dropdown, DropdownButton, Modal,  OverlayTrigger, Tooltip } from 'react-bootstrap';
import { loaderStart, loaderStop } from "../store/actions/loader";
import {updateSubscriptionCount} from "../store/actions/data"
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';


 function Users(props) {

  const userId = localStorage.getItem("userToken");
  const loginUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const [userList, setUserList] = useState([]);
  const [userListData, setUserListData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rowData, setRowdata] = useState(false);

  const getUserList = () => {
    props.loadingStart()
    let temp_userList = [{
        "firstname" : loginUser.firstname,
        "lastname" : loginUser.lastname,
        "email" : loginUser.email,
        "mobile" : loginUser.mobile,
        "isActive" : loginUser.isActive ,
        "createdDate" : loginUser.createdDate ? moment(loginUser.createdDate).format("YYYY-MM-DD") : null,
        "id" :  loginUser.userid
    }]
    let temp_userListData = [{
        "firstname" : loginUser.firstname,
        "lastname" : loginUser.lastname,
        "email" : loginUser.email,
        "mobile" : loginUser.mobile,
        "isActive" : loginUser.isActive ,
        "createdDate" : loginUser.createdDate ? moment(loginUser.createdDate).format("YYYY-MM-DD") : null,
        "password" : loginUser.password,
        "companyName": loginUser.companyName,
        "id" :  loginUser.userid
        
    }]

    AxiosUser({
      method: "GET",
      url: `user-management/user/list?uplineId=${userId}`
    })
      .then(res => {       

        res.data.userList.forEach(user => {
          let temp_userList_1 = {
            "firstname" : user.firstname,
            "lastname" : user.lastname,
            "email" : user.email,
            "mobile" : user.mobile,
            "isActive" : user.isActive,
            "createdDate" : user.createdDate ? moment(user.createdDate).format("YYYY-MM-DD") : null,
            "password" : user.password,
            "companyName": user.companyName,
            "downloadLimit": user.downloadLimit,
            "id" :  user.id
          }
          temp_userList.push(temp_userList_1)
          temp_userListData.push(temp_userList_1)

        });
        setUserList(temp_userList)
        setUserListData(temp_userListData)

        props.loadingStop()
      })
      .catch(err => {
        // console.log("Err", err);
        props.loadingStop()
      });
  }

  const handleModal = ()  => {
    if(props.subUserCount > 0 ){
      Swal.fire({
        title: 'Create User !',
        text: `Available Limit ${props.subUserCount}. \n Are you sure you want to Create New User ?`,
        icon: 'warning',
        dangerMode: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        }).then((isConfirm)=> {
          if(isConfirm.value){
            setShowModal(true)
          }})
    }
    else {
      Swal.fire({
        title: 'Create User !',
        text: "Your User Limit Exhausted",
        icon: 'error',
        dangerMode: true,
        confirmButtonColor: '#3085d6',
      }).then((isConfirm)=> {})
    }
   
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
        // props.updateSubscriptionCount({
        //   download_count: params.downloadLimit,
        //   subscriptionId: props.subscriptionId,
        //   dataAccess_count: props.dataAccess_count,
        //   totalWorkspace: props.totalWorkspace,
        //   subUserCount: props.subUserCount - 1
        // })

        props.updateSubscriptionCount({
          download_count: props.download_count,
          subscriptionId: props.subscriptionId,
          dataAccess_count: props.dataAccess_count,
          totalWorkspace: props.totalWorkspace,
          subUserCount: props.subUserCount - 1
        })
      })
      .catch(err => {
        // console.log("Err", err);
        let errorMsg = "Somethhing went wrong, please try again."
      });

}

  const OnUserCreate = () => {
    handleModalClose()
    getUserList()
  }

  const handleModalClose = ()  => {
    setShowModal(false)
  }
  const modalSubmit = (e) => {
    setShowModal(false)
    setShowEditModal(false)
    getUserList()
  }

  const handleEditModal = (rowData)  => {
    setShowEditModal(true)
    setRowdata(rowData)
  }

  const handleEditModalClose = ()  => {
    setShowEditModal(false)
  }

  useEffect(() => {
    getUserList();
  }, []);

  const searchUser = (text) => {
    console.log("text", text)
    let userData = userList.filter((contact) => contact.firstname.toLowerCase().includes(text.toLowerCase()) ||
                                                contact.lastname.toLowerCase().includes(text.toLowerCase()) );
    setUserListData(userData);
  }

  const deleteUser = (id) => {
    Swal.fire({
      title: 'Remove',
      text: " Are you sure you want to Remove the user?",
      icon: 'warning',
      dangerMode: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((isConfirm)=> {

      if(isConfirm.isConfirmed){
        const postData = {
          "isDelete": "Y"
        }
        AxiosUser({
          method: "PUT",
          url: `user-management/deleteuser/${id}`,
          data: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          Swal.fire({
            title: 'Remove',
            text: " User removed successfully",
            icon: 'success',
          }).then(getUserList())
        })
        .catch(err => {
          // console.log("Err", err);
        });
      }
    })
    
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 list-page mt-3">
          

            <div className="search-ar mt-2 mb-2">
              <h2 className="headl">Users</h2>
              &nbsp;&nbsp;<button onClick={(e) => { handleModal(e.target.value) } }>Add User</button>
              <div className="wrap float-right">
                <div className="search">
                  <input type="text" onChange={(e) => { searchUser(e.target.value) }} className="searchTerm" placeholder="What are you looking for?" />
                  <button type="submit" className="searchButton">
                    <i className="icon ion-md-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead className="">
                <tr>
                  <th>SL No.</th>
                  <th>Firstname</th>
                  <th>Last Name</th>
                  <th>Company Name</th>
                  <th>Email Id</th>
                  <th>Mobile</th>
                  <th>Available Download Limit</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  userListData.length > 0 ? (
                    userListData.map((user, index) => {   
                      return (
                        <tr key={index}>
                          <td>{index + 1}.</td>
                          <td>{user.firstname}</td>
                          <td>{user.lastname ? user.lastname : ''}</td>
                          <td>{user.companyName ? user.companyName : ''}</td>
                          <td>{user.email ? user.email : ''}</td>
                          <td>{user.mobile ? user.mobile : ''}</td>
                          <td>{user.downloadLimit ? user.downloadLimit : ''}</td>
                          <td>{user.isActive && user.isActive == "Y" ? "Active" : "Inactive" }</td>
                          <td>{user.createdDate ? user.createdDate : ''}</td>
                           <td>{index >= 1 ? <button className="btn btn-primary btn-sm" onClick ={() => {deleteUser(user.id)}}><i className="icon ion-ios-trash"></i></button> : null} &nbsp;
                          <button className="btn btn-primary btn-sm" onClick ={() => {handleEditModal(user)}} ><i className="fa fa-pencil"></i></button></td>
                        </tr>
                      )

                    })
                  ) : (<tr><td colSpan="7" style={{ textAlign: "center" }}>No record found</td></tr>)
                }
              </tbody>
            </table>

          </div>
        </div>
        <div>
            { showModal ? 
            <Modal className="" bssize="md"
                show={showModal}
                onHide={handleModalClose} 
                >             
                <Modal.Header closeButton > Create User </Modal.Header>
                <Modal.Title >  </Modal.Title>

                    <Modal.Body style= {{ height: '80vh', overflow : 'auto', scrollbarWidth : '10px' } }>
                    <div>
                    <AddUser  
                      UpdateSubscription = {UpdateSubscription}
                      OnUserCreate = {OnUserCreate}
                      subUserCount= {props.subUserCount}
                      download_count = {props.download_count}
                      subscriptionId = {props.subscriptionId}
                      loaderStart = {props.loadingStart}
                      loaderStop = {props.loadingStop}
                    />
                    </div>
                    </Modal.Body>
                        
              </Modal>
            : null}
        </div>

        <div>
            { showEditModal ? 
            <Modal className="" bssize="md"
                show={showEditModal}
                onHide={handleEditModalClose} 
                >             
                <Modal.Header closeButton > Edit User </Modal.Header>
                <Modal.Title >  </Modal.Title>

                    <Modal.Body style= {{ height: '80vh', overflow : 'auto', scrollbarWidth : '10px' } }>
                    <div>
                    <EditUser  
                      rowData = {rowData}
                      download_count = {props.download_count}
                      modalSubmit = {modalSubmit}
                    />
                    </div>
                    </Modal.Body>
                        
              </Modal>
            : null}
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
    subUserCount: state.data.subUserCount
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadingStart: () => dispatch(loaderStart()),
    loadingStop: () => dispatch(loaderStop()),
    updateSubscriptionCount: (data) => dispatch(updateSubscriptionCount(data)), 
  };
};
export default withRouter (connect( mapStateToProps, mapDispatchToProps)(Users));