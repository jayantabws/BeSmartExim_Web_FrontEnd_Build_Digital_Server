import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AxiosUser from "../shared/AxiosUser";
import Swal from 'sweetalert2';
import { loaderStart, loaderStop } from "../store/actions/loader";
import { connect } from "react-redux";
import Loader from "../components/Loader"

const  Reset = (props) => {
  const emailRef = useRef();
  const otpRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const history = useHistory();

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpFlag, setOtpFlag] = useState(false); 
  const [passwordFlag, setpasswordFlag] = useState(false); 
  const [passwordError, setPasswordError] = useState("");
  const [otpValue, setOtpValue] = useState(""); 
  const [userId, setUserId] = useState(""); 

  const SubmitOnClick = () =>{
    if(emailRef.current && emailRef.current.value && !otpRef.current){
      setEmailError("")
      props.loadingStart()
      AxiosUser({
        method: "GET",
        url: `user-management/forgotpassword?userEmail=${emailRef.current.value}`
      })
        .then(res => {
          setOtpError("")
          setOtpFlag(true)
          Swal.fire({
            title: 'Success',
            text: 'An OTP has been sent to your registered email id.',
            icon: 'success',
          })
          setOtpValue(res.data.otp)
          setUserId(res.data.userid)
          localStorage.setItem("userToken", res.data.userid)
          props.loadingStop()
        })
        .catch(err => {
          // console.log("Err", err);
          let errorMsg = "Invalid email-id, please try again."
          if (err.data.errorMsg) {
            errorMsg = err.data.errorMsg;
          }
          setEmailError(errorMsg);
          props.loadingStop()
        });
    } else {
      setEmailError("Please enter valid email");
    }

    if(otpRef.current && otpRef.current.value && otpRef.current.value == otpValue){
      setOtpError("")
      setpasswordFlag(true)
      setOtpFlag(false)
      setEmailError("")
    }else {
      setOtpError("Invalid OTP")
    }

    if(passwordRef.current && passwordRef.current.value && !otpRef.current && !emailRef.current){
      setEmailError("")
      if(passwordRef.current.value == confirmPasswordRef.current.value){
        setPasswordError("")       
        setOtpError("")
        props.loadingStart()
        const postData = {
          "password" : passwordRef.current.value
        }
        AxiosUser({
          method: "PUT",
          url: `/user-management/user/${userId}`,
          data: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            Swal.fire({
              title: 'Success',
              text: 'Password reset successful',
              icon: 'success',
            })
            props.loadingStop()
            history.push("/login");
          })
          .catch(err => {
            // console.log("Err", err);
            let errorMsg = "Invalid email-id, please try again."
            if (err.data.errorMsg) {
              errorMsg = err.data.errorMsg;
            }
            setEmailError(errorMsg);
            props.loadingStop()
          });

      }else {
        setPasswordError("New password and confirm Password is different ")
      }
        
    }else {
     // setPasswordError("Invalid Password")
    }
  }

  return (
    <>
      <div className="vh-100 d-flex justify-content-center">
        <div className="form-access my-auto">
          <form autoComplete="off">
          <div class="text-center"><img src={'img/logo.png'} alt="logo" width={'116'} height={'135'}/></div>
            <span>Forgot password</span>           
          
            {passwordFlag == false &&
            <input
              type="email"
              className="form-control"
              placeholder="Enter Your Email Address"
              ref={emailRef}
              autoComplete="off"
            />}
            {emailError && otpFlag == false ? (<p className='error'>{emailError}</p>) : <br/>}

            {otpFlag && passwordFlag == false &&
            <input
              type="text"
              className="form-control"
              placeholder="Enter OTP"
              ref={otpRef}
              autoComplete="off"
            />}
            {otpFlag && otpError ? (<p className='error'>{otpError}</p>) : <br/>}
            
            {passwordFlag && 
            <>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              ref={passwordRef}
              autoComplete="off"
            />
            <br/>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              ref={confirmPasswordRef}
              autoComplete="off"
            />
            </>}
            {passwordFlag && passwordError ? (<p className='error'>{passwordError}</p>) : <br/>}

            <button type="button" className="btn btn-primary" onClick={()=> {SubmitOnClick()}}>
              Reset
            </button>
            <h2>
              Remember Password?
              <Link to="/login"> Sign in here</Link>
            </h2>
          </form>
        </div>
      </div>
      {props.loading ? (
           <Loader/>    
        ) : null}
    </>
  );
}

const mapDispatchToProps = dispatch => {
  return {
      loadingStart: () => dispatch(loaderStart()),
      loadingStop: () => dispatch(loaderStop())
  }
}

const mapStateToProps = state => {
  return {
      loading: state.loader.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reset);