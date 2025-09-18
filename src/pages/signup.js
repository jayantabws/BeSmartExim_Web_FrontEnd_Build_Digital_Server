import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import * as Yup from "yup";
import { Link } from 'react-router-dom';
// import '../assets/fonts/Moms_typewriter.ttf'
// import captcha from '../assets/image/captcha.jpg';
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import AxiosUser from "../shared/AxiosUser";
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

const initialValues = {
  firstname: "",
  lastname: "",
  mobile: "",
  email: "",
  company_name: ""
};
const validateForm = Yup.object().shape({
  firstname: Yup.string().required("Please enter first name"),
  lastname: Yup.string().required("Please enter last name"),
  email: Yup.string().email().required("Please enter valid email address"),
  mobile: Yup.string().required("Please enter valid mobile no"),
  company_name: Yup.string().required("This field is required")
});

export default function Signup() {
  const termsRef = useRef(null);
  const captchaRef = useRef(null);
  const history = useHistory();

  const [notAcceptTerms, isNotAcceptTerms] = useState(false);
  const [capthaNotMatched, isCaptchaNotMatched] = useState(false);

  useEffect(() => {
    loadCaptchaEnginge(6);
  })

  const handleSubmit = (values) => {
    isNotAcceptTerms(false);
    isCaptchaNotMatched(false);
    // console.log("Values", values);
    // console.log("terms", termsRef, captchaRef);
    if (!termsRef.current.checked) {
      isNotAcceptTerms(true);
    } else if (validateCaptcha(captchaRef.current.value) === false) {
      isCaptchaNotMatched(true);
    } else {
      const postData = {
        "firstname": values.firstname,
        "lastname": values.lastname,
        "email": values.email,
        "mobile": values.mobile,
        "company_name": values.company_name,
        "user_type": "USER",
        "subscription_id": 1
      }
      AxiosUser({
        method: "POST",
        url: `user-management/user`,
        data: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          // console.log("user", res.data);
          Swal.fire({
            title: 'Thank You',
            text: "Your registration is successful, after verification we will notify you for login credentials.",
            icon: 'success',
          }).then(() => {
            history.push('login');
          });
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

  }
  // return (
  //   <>
  //     <div className="login-body">
  //       <div className="sign-upbox -">
  //         <div className="login-img">
  //           {/*<img src={'img/login.jpg'} alt="logo" />*/}
  //         </div>
  //         <div className="form-access">
  //           <Formik
  //             initialValues={initialValues}
  //             validationSchema={validateForm}
  //             onSubmit={handleSubmit}
  //           >
  //             {({ values, errors, setFieldValue, setFieldError, touched, isValid, handleSubmit, submitForm }) => {
  //               return (
  //                 <Form>
  //                   <div class="text-center"><img src={'img/logo.png'} alt="logo" width={'116'} height={'135'} /></div>
  //                   <span>Create Account</span>
  //                   <div className="form-group">
  //                     <Field
  //                       name="firstname"
  //                       type="text"
  //                       className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}
  //                       placeholder="First Name"
  //                       onChange={event => {
  //                         setFieldValue("firstname", event.target.value);
  //                       }}
  //                     />
  //                     {touched.firstname && errors.firstname && (<p className="error">{errors.firstname}</p>)}
  //                   </div>
  //                   <div className="form-group">
  //                     <Field
  //                       name="lastname"
  //                       type="text"
  //                       className={`form-control ${touched.lastname && errors.lastname ? "is-invalid" : ""}`}
  //                       placeholder="Last Name"
  //                       onChange={event => {
  //                         setFieldValue("lastname", event.target.value);
  //                       }}
  //                     />
  //                     {touched.lastname && errors.lastname && (<p className="error">{errors.lastname}</p>)}
  //                   </div>
  //                   <div className="form-group">
  //                     <Field
  //                       name="email"
  //                       type="text"
  //                       className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
  //                       placeholder="Email Address"
  //                       onChange={event => {
  //                         setFieldValue("email", event.target.value);
  //                       }}
  //                     />
  //                     {touched.email && errors.email && (<p className="error">{errors.email}</p>)}
  //                   </div>
  //                   <div className="form-group">
  //                     <Field
  //                       name="mobile"
  //                       type="text"
  //                       className={`form-control ${touched.mobile && errors.mobile ? "is-invalid" : ""}`}
  //                       placeholder="Mobile No"
  //                       onChange={event => {
  //                         setFieldValue("mobile", event.target.value);
  //                       }}
  //                     />
  //                     {touched.mobile && errors.mobile && (<p className="error">{errors.mobile}</p>)}
  //                   </div>
  //                   <div className="form-group">
  //                     <Field
  //                       name="company_name"
  //                       type="text"
  //                       className={`form-control ${touched.company_name && errors.company_name ? "is-invalid" : ""}`}
  //                       placeholder="Company Name"
  //                       onChange={event => {
  //                         setFieldValue("company_name", event.target.value);
  //                       }}
  //                     />
  //                     {touched.company_name && errors.company_name && (<p className="error">{errors.company_name}</p>)}
  //                   </div>
  //                   <div className="custom-control custom-checkbox">
  //                     <input
  //                       type="checkbox"
  //                       className="custom-control-input"
  //                       id="form-checkbox"
  //                       ref={termsRef}
  //                     />
  //                     <label className="custom-control-label" htmlFor="form-checkbox">
  //                       I agree to the{' '}
  //                       <Link target={"_blank"} to="/terms-and-conditions">Terms & Conditions</Link>
  //                     </label>
  //                     {notAcceptTerms && (<p className='error'>Please accept terms and condition</p>)}
  //                   </div>
  //                   <LoadCanvasTemplate />
  //                   {/* <div className="captcha">

  //           </div> */}
  //                   <div className="form-group">
  //                     <input
  //                       type="text"
  //                       style={{ height: 25 }}
  //                       className="form-control"
  //                       placeholder="Please Enter The Text In Captcha"
  //                       ref={captchaRef}
  //                     />
  //                     {capthaNotMatched && (<p className='error'>Captha not matched</p>)}
  //                   </div>
  //                   <button type="submit" onClick={(event) => {
  //                     event.preventDefault();
  //                     handleSubmit();
  //                   }} className="btn btn-primary">Create Account</button>
  //                 </Form>
  //               )
  //             }
  //             }
  //           </Formik>
  //           <h2>
  //             Already have an account?
  //             <Link to="/login"> Sign in here</Link>
  //           </h2>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );



  // ...existing code...
  return (
    <>
      <div className="login-body">
        <div className="signup-logo">
          <img src="/img/bedatos_white_new.png" style={{ height: '70px' }} alt="beDATOS" />
        </div>
        <div className="sign-upbox">
          <div className="form-access">
            <Formik
              initialValues={initialValues}
              validationSchema={validateForm}
              onSubmit={handleSubmit}
            >
              {({ values, errors, setFieldValue, touched, handleSubmit }) => (
                <Form>
                  <h2 className="signup-title">SIGN UP</h2>
                  <div className="form-group">
                    <Field
                      name="firstname"
                      type="text"
                      className={`form-control ${touched.firstname && errors.firstname ? "is-invalid" : ""}`}
                      placeholder="First Name"
                      onChange={e => setFieldValue("firstname", e.target.value)}
                    />
                    {touched.firstname && errors.firstname && (<p className="error">{errors.firstname}</p>)}
                  </div>
                  <div className="form-group">
                    <Field
                      name="lastname"
                      type="text"
                      className={`form-control ${touched.lastname && errors.lastname ? "is-invalid" : ""}`}
                      placeholder="Last Name"
                      onChange={e => setFieldValue("lastname", e.target.value)}
                    />
                    {touched.lastname && errors.lastname && (<p className="error">{errors.lastname}</p>)}
                  </div>
                  <div className="form-group">
                    <Field
                      name="email"
                      type="text"
                      className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                      placeholder="Email Address"
                      onChange={e => setFieldValue("email", e.target.value)}
                    />
                    {touched.email && errors.email && (<p className="error">{errors.email}</p>)}
                  </div>
                  <div className="form-group">
                    <Field
                      name="mobile"
                      type="text"
                      className={`form-control ${touched.mobile && errors.mobile ? "is-invalid" : ""}`}
                      placeholder="Contact No"
                      onChange={e => setFieldValue("mobile", e.target.value)}
                    />
                    {touched.mobile && errors.mobile && (<p className="error">{errors.mobile}</p>)}
                  </div>
                  <div className="form-group">
                    <Field
                      name="company_name"
                      type="text"
                      className={`form-control ${touched.company_name && errors.company_name ? "is-invalid" : ""}`}
                      placeholder="Company Name"
                      onChange={e => setFieldValue("company_name", e.target.value)}
                    />
                    {touched.company_name && errors.company_name && (<p className="error">{errors.company_name}</p>)}
                  </div>
                  {/* <div className="form-group captcha-label">
                    <span>
                      CAPTCHA AREA
                    </span>

                    <div className="form-group">
                      <LoadCanvasTemplate />
                      <input
                        type="text"
                        style={{ height: 55 }}
                        className="form-control"
                        placeholder=""
                        ref={captchaRef}
                      />
                      {capthaNotMatched && (<p className='error'>Captcha not matched</p>)}
                    </div>
                  </div> */}

                  <div className=" captcha-row">
                    <div className='captcha-label-box'>
                      <div className="captcha-label-text">CAPTCHA</div>
                      <div className="captcha-image">
                        <LoadCanvasTemplate />
                      </div>
                    </div>

                    <div className="captcha-box">
                      {/* <div className="captcha-image">
                        <LoadCanvasTemplate />
                      </div> */}
                      <input
                        type="text"
                        className="form-control captcha-input"
                        placeholder=""
                        ref={captchaRef}
                        style={{ height: 55 }}
                      />
                    </div>
                    {capthaNotMatched && (<p className='error'>Captcha not matched</p>)}
                  </div>

                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="form-checkbox"
                      ref={termsRef}
                    />
                    <label className="custom-control-label" htmlFor="form-checkbox">
                      I agree to the <Link target="_blank" to="/terms-and-conditions"><b>Terms & Conditions</b></Link>
                    </label>
                    {notAcceptTerms && (<p className='error'>Please accept terms and condition</p>)}
                  </div>
                  <button type="submit" onClick={e => { e.preventDefault(); handleSubmit(); }} className="btn btn-primary signup-btn">
                    SIGN UP
                  </button>
                  <div className="signup-login-link">
                    Already on beDATOS? <Link to="/login"><b>Sign In</b></Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
  // ...existing code...
}
