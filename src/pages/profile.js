import React from 'react';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import * as Yup from "yup";
import AxiosUser from "../shared/AxiosUser";
import Swal from 'sweetalert2';
import { Link, Redirect, useHistory } from 'react-router-dom';


const validateForm = Yup.object().shape({
  firstname: Yup.string().required("Please enter first name"),
  lastname: Yup.string().required("Please enter last name"),
  email: Yup.string().email().required("Please enter valid email address"),
  mobile: Yup.string().required("Please enter valid mobile no"),
  company_name: Yup.string().required("This field is required")
});

const validatePasswordForm = Yup.object().shape({
  currentPass: Yup.string(),
  newPass: Yup.string(),
});


const Profile = (props) => {

  const user = localStorage.getItem("user");
  const loggedUser = user ? JSON.parse(user) : {};
  const userId = localStorage.getItem("userToken");
  const history = useHistory();

  const initialValues = {
    firstname: loggedUser.firstname,
    lastname: loggedUser.lastname,
    mobile: loggedUser.mobile,
    email: loggedUser.email,
    company_name: loggedUser.company_name
  };

  const PasswordInitialValues = {
    currentPass: "",
    newPass: ""
  }

  const handlePasswordSubmit = (values) => {
    const currentPass = loggedUser.password
    if (values.currentPass == currentPass){
      const postData = {
        "password": values.newPass,
      }
      
      AxiosUser({
        method: "PUT",
        url: `user-management/user/${userId}`,
        data: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          // console.log("user", res.data);
          Swal.fire({
            title: 'Thank You',
            text: "Your profile information has been updated successfully.",
            icon: 'success',
          }).then((val) =>{
            if(val.isConfirmed){
              logoutUser();
            }
          }
          );
          
        })
        .catch(err => {
          // console.log("Err", err);
          let errorMsg = "Somethhing went wrong, please try again."
          if (err.data.errorMsg) {
            errorMsg = err.data.errorMsg;
          }
          Swal.fire({
            title: 'Oops!',
            text: errorMsg,
            icon: 'error',
          })
        });

    }
    else {
      Swal.fire({
        title: 'Error!',
        text: "Incorrect Password",
        icon: 'error',
      })
    }
  }

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
      alert("LogOut Successful")    
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionID");
      sessionStorage.removeItem("userToken");
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


  const handleSubmit = (values) => {
    const postData = {
      "firstname": values.firstname,
      "lastname": values.lastname,
      "email": values.email,
      "mobile": values.mobile,
      "company_name": values.company_name,
      "user_type": "USER"
    }
    AxiosUser({
      method: "PUT",
      url: `user-management/user/${userId}`,
      data: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log("user", res.data);
        Swal.fire({
          title: 'Thank You',
          text: "Your profile information has been updated successfully.",
          icon: 'success',
        });
        getUserDetails();
      })
      .catch(err => {
        // console.log("Err", err);
        let errorMsg = "Somethhing went wrong, please try again."
        if (err.data.errorMsg) {
          errorMsg = err.data.errorMsg;
        }
        Swal.fire({
          title: 'Oops!',
          text: errorMsg,
          icon: 'error',
        })
      });
  }

  const getUserDetails = () => {
    AxiosUser({
      method: "GET",
      url: `/user-management/user/details?userId=${userId}`
    })
      .then(res => {
        // console.log("user", res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(err => {
        // console.log("Err", err);

      });
  }

  return (
    <>
      <div className="settings mtb15">
        <div className="container-fluid">
          <Tab.Container defaultActiveKey="profile">
            <Row>
              <Col lg={3}>
                <Nav variant="pills" className="settings-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profile</Nav.Link>
                  </Nav.Item>
                  {/*
                  <Nav.Item>
                    <Nav.Link eventKey="wallet">Wallet</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="settings">Settings</Nav.Link>
                  </Nav.Item> */}
                  </Nav> 
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">General Information</h5>
                        <div className="settings-profile">
                          <Formik
                            initialValues={initialValues}
                            validationSchema={validateForm}
                            onSubmit={handleSubmit}
                          >
                            {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
                              return (
                                <Form>
                                  {/* <img src={'img/avatar.svg'} alt="avatar" />
                                  <div className="custom-file">
                                    <input
                                      type="file"
                                      className="custom-file-input"
                                      id="fileUpload"
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="fileUpload"
                                    >
                                      Choose avatar
                                    </label>
                                  </div> */}
                                  <div className="form-row mt-4">
                                    <div className="col-md-6">
                                      <label htmlFor="formFirst">First name</label>
                                      <Field
                                        name="firstname"
                                        type="text"
                                        className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}
                                        placeholder="First Name"
                                        onChange={event => {
                                          setFieldValue("firstname", event.target.value);
                                        }}
                                      />
                                      {touched.firstname && errors.firstname && (<p className="error">{errors.firstname}</p>)}
                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="formLast">Last name</label>
                                      <Field
                                        name="lastname"
                                        type="text"
                                        className={`form-control ${touched.lastname && errors.lastname ? "is-invalid" : ""}`}
                                        placeholder="Last Name"
                                        onChange={event => {
                                          setFieldValue("lastname", event.target.value);
                                        }}
                                      />
                                      {touched.lastname && errors.lastname && (<p className="error">{errors.lastname}</p>)}

                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="emailAddress">Email</label>
                                      <Field
                                        name="email"
                                        type="text"
                                        className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                        placeholder="Email Address"
                                        onChange={event => {
                                          setFieldValue("email", event.target.value);
                                        }}
                                      />
                                      {touched.email && errors.email && (<p className="error">{errors.email}</p>)}
                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="phoneNumber">Phone</label>
                                      <Field
                                        name="mobile"
                                        type="text"
                                        className={`form-control ${touched.mobile && errors.mobile ? "is-invalid" : ""}`}
                                        placeholder="Mobile No"
                                        onChange={event => {
                                          setFieldValue("mobile", event.target.value);
                                        }}
                                      />
                                      {touched.mobile && errors.mobile && (<p className="error">{errors.mobile}</p>)}
                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="phoneNumber">Company Name</label>
                                      <Field
                                        name="company_name"
                                        type="text"
                                        className={`form-control ${touched.company_name && errors.company_name ? "is-invalid" : ""}`}
                                        placeholder="Company Name"
                                        onChange={event => {
                                          setFieldValue("company_name", event.target.value);
                                        }}
                                      />
                                      {touched.company_name && errors.company_name && (<p className="error">{errors.company_name}</p>)}
                                    </div>
                                    {/* <div className="col-md-6">
                                      <label htmlFor="selectLanguage">Language</label>
                                      <select
                                        id="selectLanguage"
                                        className="custom-select"
                                      >
                                        <option defaultValue>English</option>
                                        <option>Mandarin Chinese</option>
                                        <option>Spanish</option>
                                        <option>Arabic</option>
                                        <option>Russian</option>
                                      </select>
                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="selectCurrency">Currency</label>
                                      <select
                                        id="selectCurrency"
                                        className="custom-select"
                                      >
                                        <option defaultValue>USD</option>
                                        <option>EUR</option>
                                        <option>GBP</option>
                                        <option>CHF</option>
                                      </select>
                                    </div> */}
                                    <div className="col-md-12">
                                      <button type="submit" onClick={(event) => {
                                        event.preventDefault();
                                        handleSubmit();
                                      }} className="btn btn-primary">Update</button>
                                    </div>
                                  </div>
                                </Form>
                              )
                            }
                            }
                          </Formik>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Security Information</h5>
                        <div className="settings-profile">
                        <Formik
                            initialValues={PasswordInitialValues}
                            validationSchema={validatePasswordForm}
                            onSubmit={handlePasswordSubmit}
                          >
                            {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
                              return (
                                <Form>
                          
                            <div className="form-row">
                              <div className="col-md-6">
                                <label htmlFor="currentPass">
                                  Current password
                                </label>
                                <Field
                                  name="currentPass"
                                  type="password"
                                  className="form-control"
                                  placeholder="Enter your password" 
                                  onChange={event => {
                                    setFieldValue("currentPass", event.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-md-6">
                                <label htmlFor="newPass">New password</label>
                                <input
                                  name="newPass"
                                  type="password"
                                  className= "form-control"
                                  placeholder="Enter new password"
                                  onChange={event => {
                                    setFieldValue("newPass", event.target.value);
                                  }}
                                />
                              </div>
                              <div className="col-md-12">
                                <button type="submit" onClick={(event) => {
                                  event.preventDefault();
                                  handlePasswordSubmit(values);
                                }} className="btn btn-primary">Update</button>
                              </div>
                            </div>
                          </Form>
                              )
                            }}
                            </Formik>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>            
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </>
  );
}

export default Profile ;