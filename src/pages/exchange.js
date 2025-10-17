import React, { useEffect, useState, useContext  } from 'react';
import HistoryOrder from '../components/HistoryOrder';
import MarketHistory from '../components/MarketHistory';
import MarketNews from '../components/MarketNews';
import MarketPairs from '../components/MarketPairs';
import MarketTrade from '../components/MarketTrade';
import OrderBook from '../components/OrderBook';
import TradingChart from '../components/TradingChart';
import TradingChartDark from '../components/TradingChartDark';
import { ThemeConsumer } from '../context/ThemeContext';
import { Link, useHistory, withRouter } from 'react-router-dom';
import moment from 'moment';
import AxiosACT from "../shared/AxiosACT";
import AxiosUser from "../shared/AxiosUser";
import Axios from "../shared/Axios";
import {updateSubscriptionCount, updateDownloadArrayCount, setCountryList, setDataAccessDate,setDloadCountSubuser} from "../store/actions/data"
import { connect } from "react-redux";
import { loaderStart, loaderStop } from "../store/actions/loader";

const Exchange = (props) => {

  // const subscriptionDetails = useContext(SubscriptionContext);

  // console.log("subscriptionDetails ===== ", subscriptionDetails)
  const history = useHistory();
  const userId = localStorage.getItem("userToken");

  const user = localStorage.getItem("user");
  const loggedUser = user ? JSON.parse(user) : {};
  const userName = `${loggedUser.firstname} ${loggedUser.lastname}`;
  const userEmail = loggedUser.email;
  const companyName = `${loggedUser.companyName}`;

  const [todayTime, setTodayTime] = useState("");
  const [workspaceList, setWorkspaceList] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);
  const [loading, isLoading] = useState(false);  
  const [contactList, setContactList] = useState([]);   
  const [recentSearchList, setRecentSearchList] = useState([]);

  const currentDateTime = () => {
    let currTime = moment().format('DD-MMM-YYYY | h:mm:ss a'); 
    setTodayTime(currTime);
  }

  useEffect(()=>{
    setInterval(() => {
      currentDateTime();
    }, 1000);
    getWorkspaceList();
    getContactList();
    getRecentSearchList();
    getSubscription();
  },[])

  const getWorkspaceList = () => {

    AxiosACT({
      method: "GET",
      url: `/activity-management/workspace/list?userId=${userId}`
    })
      .then(res => {
        isLoading(true);
        setWorkspaceList(res.data.workspaceList);
      })
      .catch(err => {
        // console.log("Err", err);
        isLoading(true);
      });
  }

  const getSubscription = () => {
    
    let userId_new = loggedUser.uplineId > 0 ? loggedUser.uplineId : loggedUser.userid  

    AxiosUser({
      method: "GET",
      url: `/user-management/user-subscription/activelist?userId=${userId_new}`
    })
      .then(res => {
        isLoading(true);
        setSubscriptionDetails(res.data.userSubscriptionList[0]);
       
      })
      .catch(err => {
        // console.log("Err", err);
        isLoading(true);
      });
  }

  const getContactList = () => {
    AxiosACT({
      method: "GET",
      url: `activity-management/listcontact?userId=${userId}`
    })
      .then(res => {
        setContactList(res.data.contactList);
        isLoading(true);
      })
      .catch(err => {
        // console.log("Err", err);
        isLoading(true);
      });
  }

  const getRecentSearchList = () => {
    Axios({
      method: "GET",
      url: `/search-management/search/topFiveQueries?usetId=${userId}`
    })
      .then(res => {
        setRecentSearchList(res.data.queryList);
        isLoading(true);
      })
      .catch(err => {
        // console.log("Err", err);
        isLoading(true);
      });
  }
const routeToList = (data) => {
  history.push({
        pathname:"/list1", 
        state: {
          searchType: data.searchType, 
          searchValue: data.searchValue
        },
        search: "searchValue"
       });
}


  return (
    <>
      <div className="container-fluid mtb15 no-fluid">
        <div className="row sm-gutters home">

          <div className="col-md-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <ul className="up-bredcum">
                <li>Dashboard <i className="icon ion-md-close"></i></li>
                <li>Search <i className="icon ion-md-close"></i></li>
              </ul>
              <div className="page-title-right">
                <Link className="btn btn-warning" to="/list1"><i class="icon ion-md-globe text-primary font-size-24 sub" ></i> Global Search</Link>
              </div>

            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-xl-4">
                <div className="card bg-primary">
                  <div className="card-body">
                    <div className="py-3">
                      <div className="main-wid position-relative">
                        <h5 className="text-white">{companyName} Dashboard</h5>
                        <h5 className="text-white mb-0"> Welcome Back, {userName}!</h5>
                        <p className="text-white-50 mt-3 mb-0">Today is {todayTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="card">
                      <div className="card-body bg-soft-primary">
                        <div className="avatar">
                          <span className="avatar-title bg-soft-primary rounded">
                            <i className="icon ion-md-albums text-primary font-size-24"></i>
                          </span>
                        </div>
                        <p className="text-muted mt-4 mb-0">Package Name</p>
                        <h4 className="mt-1 mb-0">{subscriptionDetails.name}</h4>

                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="card">
                      <div className="card-body bg-soft-success">
                        <div className="avatar">
                          <span className="avatar-title bg-soft-success rounded">
                            <i className="icon ion-md-speedometer text-primary font-size-24"></i>
                          </span>
                        </div>
                        <p className="text-muted mt-4 mb-0">Available Download Limit</p>
                        <h4 className="mt-1 mb-0">{props.uplineId != 0 ? props.download_count_subUser :
                   props.download_count ? props.download_count : 0}</h4>

                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="card">
                      <div className="card-body bg-soft-primary">
                        <div className="avatar">
                          <span className="avatar-title bg-soft-primary rounded">
                            <i className="icon ion-ios-calendar text-primary font-size-24"></i>
                          </span>
                        </div>
                        <p className="text-muted mt-4 mb-0">Date of Expire the validity</p>
                        <h4 className="mt-1 mb-0">{moment(subscriptionDetails.accountExpireDate).format("MMM. DD,  YYYY HH:mm")}</h4>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>


          <div className="col-sm-12 col-md-3">
            <MarketPairs />
          </div>
          <div className="col-sm-12 col-md-6">
            {/* <ThemeConsumer>
                {({ data }) => {
                  return data.theme === 'light' ? (
                    <TradingChart />
                  ) : (
                    <TradingChartDark />
                  );
                }}
              </ThemeConsumer> */}
            <MarketTrade routeToList = {routeToList}/>
          </div>
          <div className="col-md-3">
            <OrderBook workspaceList={workspaceList} />
            <MarketHistory contactListData={contactList} />
          </div>
          <div className="col-md-3">
            <MarketNews />
          </div>
          <div className="col-md-9">
            <HistoryOrder recentSearchList={recentSearchList} />
          </div>
        </div>
      </div>
    </>
  );
  
}

const mapDispatchToProps = dispatch => {
  return {
      updateSubscriptionCount: (data) => dispatch(updateSubscriptionCount(data)), 
      updateDownloadArrayCount: (data) => dispatch(updateDownloadArrayCount(data)),
      setCountryList: (data) => dispatch(setCountryList(data)),
      setDataAccessDate: (data) => dispatch(setDataAccessDate(data)),
      setDloadCountSubuser: (data) => dispatch(setDloadCountSubuser(data)), 
      loadingStart: () => dispatch(loaderStart()),
      loadingStop: () => dispatch(loaderStop()),
      
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
} 
export default connect(mapStateToProps, mapDispatchToProps)(Exchange);
