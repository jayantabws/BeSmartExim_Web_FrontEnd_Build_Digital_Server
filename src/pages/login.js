import React, { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import * as Yup from "yup";
import AxiosUser from "../shared/AxiosUser";
import Swal from 'sweetalert2';
import axios from 'axios';
import { updateSubscriptionCount, updateDownloadArrayCount, setCountryList, setDataAccessDate, setDloadCountSubuser, setUplineId } from "../store/actions/data"
import { connect } from "react-redux";
import { loaderStart, loaderStop } from "../store/actions/loader";
import Loader from "../components/Loader"
import AxiosMaster from "../shared/AxiosMaster";

const initialValues = {
  email: "",
  password: ""
};
const validateForm = Yup.object().shape({
  email: Yup.string().email().required("Please enter valid email address"),
  password: Yup.string().required("Please enter password")
});


const Login = (props) => {
   const [ip, setIp] = useState([]);
  const [isMaintenance, setIsMaintenance] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //const [monthYear, setMonthYear] = useState("");
  const [siteMaintenance, setSiteMaintenance] = useState(null);
  const history = useHistory();

  // const getDateMonth=()=>{
  //     AxiosMaster({
  //         method: "GET",
  //         url: `/masterdata-management/getdate`,
  //       }).then(res => {
  //         console.log("date",res.data);
  //          setMonthYear(res.data);
  //         }).catch(err => {
  //     });
  // }




  const handleSubmit = (values) => {
    // console.log("Values", values);
    props.loadingStart()
    const postData = {
      "email": values.email,
      "password": values.password,
      "ipaddress": ip
    }
    AxiosUser({
      method: "POST",
      url: `/user-management/login`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log("user", res.data);
        props.loadingStop()
        if (res.data.userid) {
          localStorage.setItem("user", JSON.stringify(res.data));
          localStorage.setItem("userToken", res.data.userid);
          sessionStorage.setItem("userToken", res.data.userid);
          localStorage.setItem("sessionID", res.data.sessionId);

          // LoginSecondary({
          //   youruserid: res.data.userid,
          //   yourusername: res.data.email, 
          //   yourname: res.data.firstname + " " + res.data.lastname ,
          // });  

         history.push("/dashboard");

        
          // props.setUplineId(
          //   {
          //     uplineId: res.data.uplineId,
          //   })
     
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Invalid login, please try again.',
            icon: 'error',
          })
        }
      })
      .catch(err => {
        // console.log("Err");
        props.loadingStop()
        Swal.fire({
          title: 'Oops!',
          text: err.data.errorMsg,
          icon: 'error',
        })
      });
  }

  const getData = () => {
    const res = axios.get("https://api.ipify.org/?format=json").then(res => {
      setIp(res.data.ip);
    });

  };

  const checkMaintenance = () => {
    let postData = {}
    AxiosMaster({
      method: "POST",
      url: `/masterdata-management/sitesettings`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res.data)
        setSiteMaintenance(res.data.settingsList);
        // if (res.data.settingsList[0].isMaintanance == "Y") {
        //   setIsMaintenance(res.data.settingsList[0].isMaintanance)
        //   props.history.push({
        //     pathname: "/maintenance",
        //     state: {
        //       data: res.data.settingsList[0].siteMessage
        //     }
        //   });
        // }
      })
  }

  useEffect(() => {
    getData();
    getDateMonth();
    checkMaintenance()
    
    props.loadingStop()
    const userToken = sessionStorage.getItem("userToken") && localStorage.getItem("sessionID");
    if (userToken) {
      history.push("/dashboard");
    }

  }, [])

  // return (
  //   <>
  //     {isMaintenance != "Y" || isMaintenance != "" ?
  //       <div className="login-body">

  //         <div className="d-flex justify-content-right">
  //           <div className="logint-left">
  //             <div class="logint-Left">
  //               <h2>BE2.0 Supply Chain Intelligence</h2>
  //               <p>
  //                 BE2.0, being a cutting-edge trade intelligence, is a data-driven platform that enables you to make the impactful business decision. With the provisions of hassle-free, practical and convenient tools, BE2.0 gives you the accessibility of an efficacious monitor of export-oriented, import-oriented or both kind of companies' cargo movement across the globe.
  //               </p> <p>
  //                 Visualize and map the international market with millions of records with BE2.0 to leverage the competitive edge that equips you with the tools to identify the various correlations, demand-supply trends and relations, useful forecasting, etc.

  //               </p>
  //               <div>
  //                 <h5>Find Us On</h5>
  //                 <ul class="social">
  //                   <li class="facebook"></li>
  //                   <li class="instagram"></li>
  //                   <li class="linkedin"></li>
  //                 </ul>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="login-img">
  //             {/*<img src={'img/login.jpg'} alt="logo" />*/}
  //           </div>
  //           <div className="form-access logint">
  //             <Formik
  //               initialValues={initialValues}
  //               validationSchema={validateForm}
  //               onSubmit={handleSubmit}
  //             >
  //               {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
  //                 return (
  //                   <Form>
  //                     <div class="text-center"><img src={'img/logo.png'} alt="logo" width={'116'} height={'135'} /></div>

  //                     <span>Sign In</span>
  //                     <div className="form-group">
  //                       <Field
  //                         name="email"
  //                         type="text"
  //                         className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
  //                         placeholder="Email Address"
  //                         onChange={event => {
  //                           setFieldValue("email", event.target.value);
  //                         }}
  //                       />
  //                       {touched.email && errors.email && (<p className="error">{errors.email}</p>)}
  //                     </div>
  //                     <div className="form-group">
  //                       <Field
  //                         name="password"
  //                         type="password"
  //                         className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
  //                         placeholder="Password"
  //                         onChange={event => {
  //                           setFieldValue("password", event.target.value);
  //                         }}
  //                       />
  //                       {touched.password && errors.password && (<p className="error">{errors.password}</p>)}
  //                     </div>
  //                     <div className="text-right">
  //                       <Link to="/reset">Forgot Password?</Link>
  //                     </div>
  //                     <div className="custom-control custom-checkbox">
  //                       <input
  //                         type="checkbox"
  //                         className="custom-control-input"
  //                         id="form-checkbox"
  //                       />
  //                       <label className="custom-control-label" htmlFor="form-checkbox">
  //                         Remember me
  //                       </label>
  //                     </div>
  //                     <button type="submit" onClick={(event) => {
  //                       event.preventDefault();
  //                       handleSubmit();
  //                     }} className="btn btn-primary">Sign In</button>
  //                   </Form>
  //                 )
  //               }
  //               }
  //             </Formik>
  //             <h2>
  //               Don't have an account? <Link to="/signup">Sign up here</Link>
  //             </h2>
  //           </div>
  //         </div>
  //         {props.loading ? (
  //           <Loader />
  //         ) : null}
  //       </div> : null}
  //   </>
  // );

  // ...existing imports...





  // ...existing code... != "Y"
  return (
    <>
      {isMaintenance != "Y" || isMaintenance != "" ?
        <div className="login-main-bg">
          <div className="login-logo">
            <img src="/img/bedatos_white_new.png" style={{ height: '70px' }} alt="beDATOS" />
          </div>
          <div className="login-flex-container">
            <div className="login-card">
              <div className="login-form-access">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validateForm}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, setFieldValue, touched, handleSubmit }) => (
                    <Form>
                      <h2 className="login-title">SIGN IN</h2>
                      <div className="login-form-group">
                        <Field
                          name="email"
                          type="text"
                          className={`login-form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                          placeholder="Email"
                          onChange={event => setFieldValue("email", event.target.value)}
                        />
                        {touched.email && errors.email && (<p className="login-error">{errors.email}</p>)}
                      </div>
                      {/* <div className="login-form-group login-password-group">
                     
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={`login-form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                          placeholder="Password"
                          onChange={event => setFieldValue("password", event.target.value)}
                        />
                        <span
                          className="login-show-password"
                          onClick={() => setShowPassword(prev => !prev)}
                          style={{ userSelect: "none" }}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </span>

                        {touched.password && errors.password && (<p className="login-error">{errors.password}</p>)}
                      </div> */}

                      <div className="login-form-group login-password-group">
                        <div style={{ position: "relative" }}>
                          <Field
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className={`login-form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                            placeholder="Password"
                            onChange={event => setFieldValue("password", event.target.value)}
                          />
                          <span
                            className="login-show-password"
                            onClick={() => setShowPassword(prev => !prev)}
                            style={{ userSelect: "none" }}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </span>
                        </div>
                        {touched.password && errors.password && (
                          <p className="login-error">{errors.password}</p>
                        )}
                      </div>


                      <div className="login-links-row">
                        <Link to="/reset" className="login-forgot-link">Forgot Password?</Link>
                      </div>
                      <div className="login-custom-control login-custom-checkbox">
                        <input
                          type="checkbox"
                          className="login-custom-control-input"
                          id="login-form-checkbox"
                        />
                        <label className="login-custom-control-label" htmlFor="login-form-checkbox">
                          Keep me logged in
                        </label>
                      </div>
                      <button type="submit" onClick={e => { e.preventDefault(); handleSubmit(); }} className="btn btn-primary login-btn">
                        SIGN IN
                      </button>
                      <div className="login-signup-link">
                        <Link to="/signup">Sign Up</Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="login-marketing-block">
              <div className="login-marketing-inner">
                <div className="login-marketing-title">What's New?</div>
                {/* <div className="login-marketing-main">
                  AUGUST'S Export-<br />
                  Import Insights<br />
                  are available<br />
                  now
                </div> */}

                {/* <div className="login-marketing-main">
                  Export and Import Trade Insights are updated with {monthYear ? monthYear : ""} transactions at beDATOS. <br />
                  YOUR PORTAL HAS BEEN UPDATED. <br />
                  Access the data with more features now <br />
                </div> */}
              {/* <div className="login-marketing-main">
                {siteMaintenance?.[0]?.loginMsg}
              </div> */}

              <div className="login-marketing-main">
              {siteMaintenance?.[0]?.loginMsg?.replace(/\.\s*/g, ".\n")}
            </div>



                {/* <div className="login-marketing-main custom-marketing-main">
                  <span className="custom-marketing-headline">
                    Export and Import Trade Insights are updated<br />
                    with <b>Jul'25 transactions</b> at <span className="custom-marketing-brand">beDATOS</span>.
                  </span>
                  <span className="custom-marketing-update">
                    <b>YOUR PORTAL HAS BEEN UPDATED.</b>
                  </span>
                  <span className="custom-marketing-desc">
                    Access the data with <b>more features</b> now.
                  </span>
                </div> */}


              </div>
            </div>
          </div>
          {props.loading ? (
            <Loader />
          ) : null}
        </div>
        :   <div className="error-page vh-100 d-flex justify-content-center text-center">
                <div className="my-auto">
                  <h1>Maintenance</h1>
                  <h4>{siteMaintenance?.[0]?.siteMessage}</h4>
                  {/* <Link to="/login" className="btn">
                    Back to Login <i className="icon ion-md-home"></i>
                  </Link> */}
                </div>
              </div>}
    </>
  );
  // ...existing code...

  // ...existing code...

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
    setUplineId: (data) => dispatch(setUplineId(data)),

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

export default connect(mapStateToProps, mapDispatchToProps)(Login);