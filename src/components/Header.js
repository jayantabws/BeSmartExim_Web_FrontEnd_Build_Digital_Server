import React, { useEffect , useState} from 'react';
import { Navbar, Nav, NavDropdown, Dropdown, Button } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { ThemeConsumer } from '../context/ThemeContext';
import AxiosUser from "../shared/AxiosUser";
import AxiosACT from "../shared/AxiosACT";
import Swal from 'sweetalert2';
import { loaderStart, loaderStop } from "../store/actions/loader";
import {updateSubscriptionCount, updateDownloadArrayCount, setCountryList, setDataAccessDate,setDloadCountSubuser, setUplineId, logoutUser,setMaxDownload} from "../store/actions/data"
import {Circles} from "react-loader-spinner";
import { connect } from "react-redux";
import { Modal } from 'react-bootstrap';
import Loader from "../components/Loader"
import axios from 'axios';

import TermsModal from '../pages/TermsModal';

const Header = (props) => {

  const history = useHistory();
  const userId = localStorage.getItem("userToken");
  let loginUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const user = localStorage.getItem("user");
  const loggedUser = user ? JSON.parse(user) : {};
  const userName = `${loggedUser.firstname} ${loggedUser.lastname}`;
  const userEmail = loggedUser.email;
  const userId_new = loggedUser.uplineId > 0 ? loggedUser.uplineId : loggedUser.userid

  const [session, setSession] = useState({
          accessToken: null,
          refreshToken: null,
          userInfo: null,
        });

/* POP up Terms Start */

// 1. Initialize userInfo directly from localStorage
  const [userInfo, setUserInfo] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // 2. Initialize showTerms based on the userInfo status immediately
  const [showTerms, setShowTerms] = useState(() => {
    return userInfo?.termsAndConditions === 0;
  });

    /*If User is not agreed to terms and conditions */
useEffect(() => {
  const userData = localStorage.getItem("user");
  const parsedUser = userData ? JSON.parse(userData) : null;

  if (parsedUser?.termsAndConditions === 0) {
    setShowTerms(true);
  }
}, [userInfo]); // Keep watching userInfo for changes when handleAgree fires

const handleAgree = (isChecked) => {
//console.log("User agreed:", isChecked);

  if (isChecked) {
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        const payloadData={"termsAndConditions":1}

            AxiosUser({
                  method: "PUT",
                  url: `user-management/user/${userId}`,
                  data: JSON.stringify(payloadData),
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
                .then(res => {
                    // console.log("user", res.data);
                    user.termsAndConditions = 1; // 👈 update here
                    localStorage.setItem("user", JSON.stringify(user));

                    setShowTerms(false);
                    Swal.fire({
                      title: 'Thank You',
                      text: "Terms and Conditions updated is successful",
                      icon: 'success',
                    });
                    
            });
           
  }
};

const handleDisagree = () => {
  logoutUser();
};
  /* POP up Terms end */

  useEffect(() => {

    let el = document.querySelector('#darkTheme');
    if (el) {
      el.addEventListener('click', function () {
        document.body.classList.toggle('dark');
      });
    };
    getSubscription();
    getDownloadArray();
   UpdateSubUserDloadCount()
  }, []);


  const UpdateSubUserDloadCount = async () => {  
    let countryArray = []
    let usersArr = JSON.parse(localStorage.getItem("user"))
    await AxiosUser({
      method: "GET",
      url: `/user-management/user/details?userId=${loggedUser.userid}`
    })
      .then(res => {

        if(props.uplineId == null){
          props.setUplineId(
            {uplineId: res.data.uplineId,
              }) 

              if(usersArr && usersArr.uplineId != 0){
                props.setDloadCountSubuser({download_count_subUser: res.data.downloadLimit})
              }  
        }
        else {
          if( props.uplineId != 0){
            props.setDloadCountSubuser({download_count_subUser: res.data.downloadLimit})
          }  
        }
        
      })
      .catch(err => {
        // console.log("Err", err);
      });
  }

  const getSubscription = async () => {  
    let countryArray = []
    await AxiosUser({
      method: "GET",
      url: `/user-management/user-subscription/activelist?userId=${userId_new}`
    })
      .then(res => {
        props.updateSubscriptionCount(
          {download_count: res.data.userSubscriptionList[0].downloadLimit,
            subscriptionId: res.data.userSubscriptionList[0].id,
            dataAccess_count: res.data.userSubscriptionList[0].dataAccessInMonth,
            totalWorkspace: res.data.userSubscriptionList[0].totalWorkspace,
            subUserCount: res.data.userSubscriptionList[0].subUserCount,
            queryPerDay: res.data.userSubscriptionList[0].queryPerDay,
            
          })  

          res.data.userSubscriptionList[0].countries.map((item,index)=>{
            countryArray.push(item.trim())
          })


          props.setCountryList({
            countryList: countryArray
          })
          
          props.setDataAccessDate({
            dataAccessInMonth: res.data.userSubscriptionList[0].dataAccessInMonth,
            dataAccessUpto: res.data.userSubscriptionList[0].dataAccessUpto
          })

          props.setMaxDownload({
            maxDownload: res.data.userSubscriptionList[0].recordsPerWorkspace,
          })

      })
      .catch(err => {
        // console.log("Err", err);
      });
  }

  const getDownloadArray = () => {
    AxiosACT({
      method: "GET",
      url: `/activity-management/download-tracker/get?userId=${userId_new}`
    })
      .then(res => {
       // alert("res.data", JSON.stringify(res.data));
            // console.log("GetDownloadArray call from header ,list of all downloadlist", res.data, userId_new);
       
          if(res.data){
            props.updateDownloadArrayCount({
                downloadArray: res.data
              }); 
          }else {
            props.updateDownloadArrayCount({
                downloadArray: []
              });  
          }  
      }).catch(err => {
        // console.log("Err", err);
      });
  }
  
  
 const LogoutSecondary = async (refreshToken, accessToken) => {
  try {
    //debugger;
    // Make the API call to logout on the server
    const response = await fetch('http://88.198.61.70/api/auth/logout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        token: refreshToken, accessToken: accessToken
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }

    // Clean up session storage
    sessionStorage.removeItem("chatSession");
    sessionStorage.removeItem("socket_user");
    sessionStorage.removeItem("user_Session");
    
    // Reset session state
    
    setSession({ accessToken: null, refreshToken: null, userInfo: null});
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if API call fails, clean up local session
    sessionStorage.removeItem("chatSession");
    sessionStorage.removeItem("socket_user");
    sessionStorage.removeItem("user_Session");
    
    setSession({ accessToken: null, refreshToken: null, userInfo: null});
  }
};

  const logoutUser = () => {
    let values = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    const postData = {
      "userId": values.userid,
      "loginId": values.loginId,
      "sessionId": values.sessionId
    }
    AxiosUser({
      method: "PUT",
      url: `/user-management/logout`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      // alert("LogOut Successful")    
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionID");
      sessionStorage.removeItem("userToken");
      localStorage.removeItem("ipAddress");
      props.logoutUser();
      let user_Session = localStorage.getItem("user_Session") ? JSON.parse(localStorage.getItem("user_Session")) : {}
      LogoutSecondary(user_Session.refreshToken, user_Session.accessToken );
      history.push("/login");
      })
      .catch(err => {
        // console.log("Err");
        Swal.fire({
          title: 'Oops!',
          text: 'Invalid login, please try again.',
          icon: 'error',
        })
      });
      
  }






  return (
    <>

    <TermsModal
  show={showTerms}
  onAgree={handleAgree}
  onDisagree={handleDisagree}
/>


      <header className="light-bb">
        <Navbar expand="lg">
          <Link className="navbar-brand" to="/">
            <ThemeConsumer>
              {({ data }) => {
                return data.theme === 'light' ? (
                  <img src={'img/logo.png'} alt="logo" />
                ) : (
                  <img src={'img/logo.png'} alt="logo" />
                );
              }}
            </ThemeConsumer>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="navbar-nav mr-auto">
              <Link to="/exchange" className="nav-link">
                Dashboard
              </Link>
              {/* <Link to="/markets" className="nav-link">
                  Markets
                </Link> */}
              {/* <Link to="/list" className="nav-link">
                Search List
              </Link> */}
              <Link to="/workspace" className="nav-link">
                Workspace
              </Link>
              <Link to="/savecontact" className="nav-link">
                Save Contact
              </Link>
              { loginUser && loginUser.uplineId == "0"?
              <Link to="/users" className="nav-link">
                Users
              </Link>
              : null }
              <Link to="/searchlog" className="nav-link">
                Search History
              </Link>
              <Link to="/downloadlog" className="nav-link">
                Download History
              </Link>
              <Link to="/subscriptions" className="nav-link">
                Subscriptions
              </Link>
              <Link to="/list1" className="nav-link">
                Search Global Data
              </Link>
              {/* <Link to="/savecontact" className="nav-link">
                BE Tickets
              </Link> */}
              <Link to="#" className="nav-link">
                Help Center
              </Link>
              {/* <Link to="/savecontact" className="nav-link">
                  Invite Colleague
                </Link> */}
              {/* <NavDropdown title="Dashboard">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link to="/wallet" className="dropdown-item">
                    Wallet
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    Settings
                  </Link>
                </NavDropdown> */}
              {/* <NavDropdown title="Others">
                  <Link to="/login" className="dropdown-item">
                    Login
                  </Link>
                  <Link to="/select-packeges" className="dropdown-item">
                    Select Packeges
                  </Link>
                  <Link to="/signup" className="dropdown-item">
                    Sign up
                  </Link>
                  <Link to="/lock" className="dropdown-item">
                    Lock
                  </Link>
                  <Link to="/otp-number" className="dropdown-item">
                    OTP Number
                  </Link>
                  <Link to="/otp-verify" className="dropdown-item">
                    OTP Verify
                  </Link>
                  <Link to="/reset" className="dropdown-item">
                    Reset
                  </Link>
                  <Link to="/notfound" className="dropdown-item">
                    404
                  </Link>
                </NavDropdown> */}
            </Nav>
            <Nav className="navbar-nav ml-auto">
              <Dropdown className="header-custom-icon">
                <Button variant="default">
                  <i className="icon ion-md-download"></i>
                  <sup className="cou">{props.uplineId != 0 ? props.download_count_subUser :
                   props.download_count ? props.download_count : 0}</sup>
                </Button>
                <Button variant="default">
                  <i className="icon ion-md-search"></i>
                  <sup className="cou">{props.queryPerDay ? props.queryPerDay : 0}</sup>
                </Button>
                {/* <ThemeConsumer>
                    {({ data, update }) => (
                      <Button variant="default" onClick={update} id="darkTheme">
                        {data.theme === 'light' ? (
                          <i className="icon ion-md-moon"></i>
                        ) : (
                          <i className="icon ion-md-sunny"></i>
                        )}
                      </Button>
                    )}
                  </ThemeConsumer> */}
                <Dropdown.Toggle variant="default">
                  <i className="icon ion-md-notifications"></i>
                  <span className="circle-pulse"></span>
                </Dropdown.Toggle>
                {/* 
                <Dropdown.Menu>
                  <div className="dropdown-header d-flex align-items-center justify-content-between">
                    <p className="mb-0 font-weight-medium">
                      6 New Notifications
                    </p>
                    <a href="#!" className="text-muted">
                      Clear all
                    </a>
                  </div>
                  <div className="dropdown-body">
                    <a href="#!" className="dropdown-item">
                      <div className="icon">
                        <i className="icon ion-md-lock"></i>
                      </div>
                      <div className="content">
                        <p>Account password change</p>
                        <p className="sub-text text-muted">5 sec ago</p>
                      </div>
                    </a>
                    <a href="#!" className="dropdown-item">
                      <div className="icon">
                        <i className="icon ion-md-alert"></i>
                      </div>
                      <div className="content">
                        <p>Solve the security issue</p>
                        <p className="sub-text text-muted">10 min ago</p>
                      </div>
                    </a>
                    <a href="#!" className="dropdown-item">
                      <div className="icon">
                        <i className="icon ion-logo-android"></i>
                      </div>
                      <div className="content">
                        <p>Download android app</p>
                        <p className="sub-text text-muted">1 hrs ago</p>
                      </div>
                    </a>
                    <a href="#!" className="dropdown-item">
                      <div className="icon">
                        <i className="icon ion-logo-bitcoin"></i>
                      </div>
                      <div className="content">
                        <p>Bitcoin price is high now</p>
                        <p className="sub-text text-muted">2 hrs ago</p>
                      </div>
                    </a>
                    <a href="#!" className="dropdown-item">
                      <div className="icon">
                        <i className="icon ion-logo-usd"></i>
                      </div>
                      <div className="content">
                        <p>Payment completed</p>
                        <p className="sub-text text-muted">4 hrs ago</p>
                      </div>
                    </a>
                  </div>
                  <div className="dropdown-footer d-flex align-items-center justify-content-center">
                    <a href="#!">View all</a>
                  </div>
                </Dropdown.Menu>
                */}
              </Dropdown>
              <Dropdown className="header-img-icon">
                <Dropdown.Toggle variant="default">
                  <img src={'img/avatar.svg'} alt="avatar" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="dropdown-header d-flex flex-column align-items-center">
                    <div className="figure mb-3">
                      <img src={'img/avatar.svg'} alt="" />
                    </div>
                    <div className="info text-center">
                      <p className="name font-weight-bold mb-0">{userName}</p>
                      <p className="email text-muted mb-3">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="dropdown-body">
                    <ul className="profile-nav">
                      <li className="nav-item">
                        <Link to="/profile" className="nav-link">
                          <i className="icon ion-md-person"></i>
                          <span>Profile</span>
                        </Link>
                      </li>
                      {/* <li className="nav-item">
                          <Link to="/wallet" className="nav-link">
                            <i className="icon ion-md-wallet"></i>
                            <span>My Wallet</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/settings" className="nav-link">
                            <i className="icon ion-md-settings"></i>
                            <span>Settings</span>
                          </Link>
                        </li> */}
                      <li className="nav-item">
                        <Link to={""} onClick={() => {
                          logoutUser();
                        }} className="nav-link red">
                          <i className="icon ion-md-power"></i>
                          <span>Log Out</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {props.loading ? (
           <Loader/>    
        ) : null}
      </header>
    </>
  );
}

const mapDispatchToProps = dispatch => {
  return {
      loadingStart: () => dispatch(loaderStart()),
      loadingStop: () => dispatch(loaderStop()),
      updateSubscriptionCount: (data) => dispatch(updateSubscriptionCount(data)), 
      updateDownloadArrayCount: (data) => dispatch(updateDownloadArrayCount(data)),
      setCountryList: (data) => dispatch(setCountryList(data)),
      setDataAccessDate: (data) => dispatch(setDataAccessDate(data)),
      setDloadCountSubuser: (data) => dispatch(setDloadCountSubuser(data)), 
      setUplineId: (data) => dispatch(setUplineId(data)),
      logoutUser: () => dispatch(logoutUser()),
      setMaxDownload:  (data) => dispatch(setMaxDownload(data)),
  }
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
      download_count_subUser: state.data.download_count_subUser,
      uplineId: state.data.uplineId,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);