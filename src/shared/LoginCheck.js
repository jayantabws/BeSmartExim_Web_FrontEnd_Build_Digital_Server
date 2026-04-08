import AxiosUser from './AxiosUser';
import Swal from 'sweetalert2';


const LoginCheck = (props) =>{
  
  const user = localStorage.getItem("user");
  const loggedUser = user ? JSON.parse(user) : {};

    AxiosUser({
        method: "GET",
        url: `/user-management/user/loginstatus?loginId=${loggedUser.loginId}`
      })
        .then(res => {
          if(res.data.logoutTime != null){
            LogoutUser(props)
          }
        })
        .catch(err => {
          // console.log("Err", err);
        });
  
}

const LogoutUser = (props) => {
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
        Swal.fire({
            title: 'Oops!',
            text: 'Session Timeout',
            icon: 'error',
          })   
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionID");
      sessionStorage.removeItem("userToken");

      localStorage.removeItem("ipAddress");
      props.push("/login");
      })
      .catch(err => {
        // console.log("Err");
      });
      
  }

export default LoginCheck;

