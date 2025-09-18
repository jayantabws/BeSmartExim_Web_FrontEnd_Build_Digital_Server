import React, { Component,useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { Row, Col, Modal, Button, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select'
import AxiosMaster from '../shared/AxiosMaster';
import AxiosUser from "../shared/AxiosUser";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';


const validateForm = Yup.object().shape({
  firstname: Yup.string().required("Please enter first name"),
  lastname: Yup.string().required("Please enter last name"),
  email: Yup.string().email().required("Please enter valid email address"),
  mobile: Yup.string().required("Please enter valid mobile no"),
  companyName: Yup.string().required("This field is required"),
  downloadLimit: Yup.string().required("This field is required"),
  isActive: Yup.string().required("This field is required"),
  password: Yup.string().required("This field is required"),
});


const EditeUser = (props) => {


  const initialValues = {
    firstname: props.rowData.firstname,
    lastname: props.rowData.lastname,
    mobile: props.rowData.mobile,
    email: props.rowData.email,
    companyName: props.rowData.companyName,
    downloadLimit: props.download_count,
    isActive: props.rowData.isActive,
    password: props.rowData.password
  };
  

  const [userList, setUserList] = useState([]);

  const handleSubmit = (values) => {
      const postData = {
        "firstname": values.firstname,
        "lastname": values.lastname,
        "email": values.email,
        "mobile": values.mobile,
        "companyName": values.companyName,
        "downloadLimit": values.downloadLimit,
        "isActive": values.isActive,
        "password": values.password
      }
console.log("Props ==== ", props)
      if(values.downloadLimit <= props.download_count) {

        AxiosUser({
          method: "PUT",
          url: `user-management/user/${props.rowData.id}`,
          data: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            // console.log("user", res.data);
            Swal.fire({
              title: 'Thank You',
              text: "User update is successful",
              icon: 'success',
            }).then(() => {props.modalSubmit()});
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
              title: 'Oops!',
              text: "Download Limit should be less than total limit",
              icon: 'error',
            })
      }
  }


  useEffect(() => {

  },[])


    return (
      <div>
        
          <Formik
            initialValues={initialValues}
            validationSchema={validateForm}
            onSubmit={handleSubmit}
          >
            {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {        
              return (
                <Form >
                  <div className="form-group">
                    <label><b>First Name</b></label>
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
                  <div className="form-group">
                  <label><b>Last Name</b></label>
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
                  <div className="form-group">
                  <label><b>Email</b></label>
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
                  <div className="form-group">
                  <label><b>Mobile</b></label>
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
                  <div className="form-group">
                      <label><b>Password</b></label>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                          placeholder="Password"
                          onChange={event => {
                            setFieldValue("password", event.target.value);
                          }}
                        />
                        {touched.password && errors.password && (<p className="error">{errors.password}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>Company Name</b></label>
                    <Field
                      name="companyName"
                      type="text"
                      className={`form-control ${touched.companyName && errors.companyName ? "is-invalid" : ""}`}
                      placeholder="Company Name"
                      onChange={event => {
                        setFieldValue("companyName", event.target.value);
                      }}
                    />
                    {touched.companyName && errors.companyName && (<p className="error">{errors.companyName}</p>)}
                  </div> 
                  <div className="form-group">
                  <label><b>Assigned Download Limit</b></label>
                    <Field
                      name="downloadLimit"
                      type="text"
                      className={`form-control ${touched.downloadLimit && errors.downloadLimit ? "is-invalid" : ""}`}
                      placeholder="Download Limit"
                      onChange={event => {
                        setFieldValue("downloadLimit", event.target.value);
                      }}
                    />
                    {touched.downloadLimit && errors.downloadLimit && (<p className="error">{errors.downloadLimit}</p>)}
                  </div>
                  <div className="form-group">
                  <label><b>Status</b></label>
                    <Field
                      name="isActive"
                      component="select"
                      className={`form-control ${touched.isActive && errors.isActive ? "is-invalid" : ""}`}
                      autoComplete="off"      
                      onChange={event => {
                        setFieldValue("isActive", event.target.value);
                      }}
                    >    
                      <option value= "" >Please Select</option>
                      <option value= "Y" >Active</option>
                      <option value= "N" >Inactive</option>
                      {touched.isActive && errors.isActive && (<p className="error">{errors.isActive}</p>)}
                    </Field>   
                  </div>
                  
                  <button type="submit"  className="btn btn-primary">Update User</button>
                </Form>
              )
            }
            }
          </Formik>

               
      </div>
    )

}

export default EditeUser
