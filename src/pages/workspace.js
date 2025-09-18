// import React, { useEffect, useRef, useState } from 'react';
// import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { Link, Redirect } from 'react-router-dom';
// import ReactTooltip from 'react-tooltip';
// import Swal from 'sweetalert2';
// import AxiosACT from "../shared/AxiosACT";
// import moment from 'moment';
// import { loaderStart, loaderStop } from "../store/actions/loader";
// import { connect } from "react-redux";
// import { withRouter } from 'react-router-dom';


// function Workspace(props) {
//   const workspace_id = props.location.state ? props.location.state.workspace_id : "";
//   const workspace_name = props.location.state ? props.location.state.workspace_name : "";
//   const workRef = useRef();
//   const userId = localStorage.getItem("userToken");

//   const [workspaceError, setWorkspaceError] = useState("");
//   const [workspaceList, setWorkspaceList] = useState([]);
//   const [show, setShow] = useState(false);
//   const [workspaceName, setWorkspaceName] = useState(workspace_name);
//   const [workspaceId, setWorkspaceId] = useState(workspace_id);
//   const [searchQueryList, setSearchQueryList] = useState([]);
//   const [searchQueryListData, setSearchQueryListData] = useState([]);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleAddWorkspace = () => {

//     if (workRef.current.value) {
//       const postData = {
//         "name": workRef.current.value,
//         "is_active": "Y",
//       }
//       AxiosACT({
//         method: "POST",
//         url: `/activity-management/workspace`,
//         data: JSON.stringify(postData),
//         headers: {
//           "Content-Type": "application/json"
//         }
//       })
//         .then(res => {
//           // console.log("user", res.data);
//           Swal.fire({
//             title: 'Success',
//             text: "Workspace added successfully",
//             icon: 'success',
//           })
//           getWorkspaceList();
//         })
//         .catch(err => {
//           // console.log("Err", err);
//           let errorMsg = "Somethhing went wrong, please try again."
//           if (err.data.errorMsg) {
//             errorMsg = err.data.errorMsg;
//           }
//           Swal.fire({
//             title: 'Oops!',
//             text: errorMsg,
//             icon: 'error',
//           })
//         });
//       handleClose();
//     } else {
//       setWorkspaceError("Please enter workspace name");
//     }

//   }

//   const deleteWorkspaceItem = (id) => {
//     Swal.fire({
//       title: 'Remove',
//       text: " Are you sure you want to Remove workspace item ?",
//       icon: 'success',
//       dangerMode: true,
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//     }).then((isConfirm) => {

//       if (isConfirm.isConfirmed) {
//         AxiosACT({
//           method: "PUT",
//           url: `/activity-management/workspace/removesearch?userWorkspaceId=${id}`
//         })
//           .then(res => {
//             Swal.fire({
//               title: 'Remove',
//               text: " Item removed successfully",
//               icon: 'success',
//             }).then(getWorkspaceList(), getSearchQueryList())
//           })
//           .catch(err => {
//             // console.log("Err", err);
//           });
//       }
//     })

//   }

//   const getWorkspaceList = () => {

//     AxiosACT({
//       method: "GET",
//       url: `/activity-management/workspace/list?userId=${userId}`
//     })
//       .then(res => {
//         setWorkspaceList(res.data.workspaceList);
//       })
//       .catch(err => {
//         // console.log("Err", err);
//       });
//   }

//   const getSearchQueryList = () => {
//     const rquestParams = { "createdBy": userId, "workspaceId": workspaceId };
//     props.loadingStart()
//     AxiosACT({
//       method: "GET",
//       url: `/activity-management/workspace/searchByUser`,
//       params: rquestParams
//     })
//       .then(res => {
//         props.loadingStop()
//         setSearchQueryList(res.data.searchQueryWithWS);
//         setSearchQueryListData(res.data.searchQueryWithWS);
//         props.loadingStop()
//       })
//       .catch(err => {
//         // console.log("Err", err);
//         props.loadingStop()
//       });
//   }

//   useEffect(() => {
//     getWorkspaceList();
//   }, []);

//   useEffect(() => {
//     getSearchQueryList();
//   }, [workspaceId]);

//   const searchList = (text) => {
//     console.log("text", text)
//     let sqData = searchQueryListData.filter((sq) => sq.name.toLowerCase().includes(text.toLowerCase()) || sq.description.toLowerCase().includes(text.toLowerCase()));
//     setSearchQueryList(sqData);
//   }
//   return (
//     <>
//       <div className="container-fluid">

//         <div className="row">
//           <div className="col-md-12 list-page mt-3">

//             <ul className="folder">
//               <li>
//                 <span className='popover-link'>
//                   <Link to={"#"} onClick={handleShow}><i className="icon ion-md-add"></i></Link>
//                   <div className="workspaceIconLabel">Add New</div>
//                 </span>
//               </li>
//               {workspaceList.map((workspace, index) => {
//                 return (
//                   <li key={index}>
//                     <OverlayTrigger
//                       placement="top"
//                       delay={{ show: 250, hide: 400 }}
//                       overlay={<Tooltip className="show">{workspace.name}</Tooltip>}
//                     >
//                       {({ ref, ...triggerHandler }) => (
//                         <span {...triggerHandler} ref={ref} className='popover-link'>

//                           <>
//                             <Link to={"#"} onClick={() => {
//                               setWorkspaceName(workspace.name);
//                               setWorkspaceId(workspace.id)
//                             }}><i className="icon ion-ios-folder-open"></i></Link>
//                             <div className="workspaceIconLabel">{workspace.name}</div>
//                           </>
//                         </span>
//                       )}
//                     </OverlayTrigger>
//                   </li>
//                 )
//               })}
//               <li>
//                 <Link to={"#"} onClick={() => {
//                   setWorkspaceName("");
//                   setWorkspaceId("")
//                 }}><i className="icon ion-ios-folder-open"></i></Link>
//                 <div className="workspaceIconLabel">All</div>
//               </li>
//             </ul>

//             <div className="search-ar mt-2 mb-2">
//               <h2 className="headl">Manage Workspace {workspaceName ? ` - ${workspaceName}` : ""}</h2>
//               <div className="wrap float-right">
//                 <div className="search">
//                   <input type="text" className="searchTerm" placeholder="What are you looking for?"
//                     onChange={(event) => {
//                       searchList(event.target.value);
//                     }} />
//                   <button type="submit" className="searchButton">
//                     <i className="icon ion-md-search"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {(searchQueryList.length > 0 ? (
//               <ul className="regions-content">
//                 {searchQueryList.map((sq, index) => {
//                   return (
//                     <li className="product-card-item product-card-wrapper" key={index}>
//                       <div className="panel card-panel product-card">

//                         <div className="infodel" onClick={(e) => { deleteWorkspaceItem(sq.id) }}>
//                           <i className="icon ion-md-trash text-danger"></i>
//                         </div>

//                         <div className="panel-header">{moment(sq.createdDate).format("DD-MMM-YYYY")}</div>
//                         <div className="panel-content">
//                           <p className="product-name">
//                             <Link to={{
//                               pathname: "/list1",
//                               state: { search_id: sq.searchId, workspace_id: sq.workspaceId, workspace_name: sq.name, workspace_desc: sq.description, workspaceId: sq.id, search_type: "WORKSPACE" }
//                             }}
//                             // onClick={()=>{
//                             //   return (<Redirect to={{
//                             //     pathname: '/list',
//                             //     state: { key: "gopal" }
//                             // }} />)
//                             // }}
//                             >{sq.name}</Link></p>
//                           <p className="product-description">{sq.description}</p>
//                           <p className="workspace-highlight-content">
//                             <span>
//                               <h5>Trade</h5>
//                               <h4>{sq.tradeType}</h4>
//                             </span>
//                             <span>
//                               <h5>Country</h5>
//                               <h4>{sq.countryCode.length > 0 ? sq.countryCode.join(",") : "--"}</h4>
//                             </span>
//                             <span>
//                               <h5>Shipments</h5>
//                               <h4>{sq.totalRecords}</h4>
//                             </span>
//                             <span>
//                               <h5>Date Range</h5>
//                               <h4>{moment(sq.fromDate).format("DD-MMM-YYYY")} To {moment(sq.toDate).format("DD-MMM-YYYY")}</h4>
//                             </span>
//                           </p>

//                         </div>
//                         <div className="panel-footer text-center">
//                           <Link to={{
//                             pathname: "/list1",
//                             state: { search_id: sq.searchId, workspace_id: sq.workspaceId, workspace_name: sq.name, workspace_desc: sq.description, workspaceId: sq.id, search_type: "WORKSPACE" }
//                           }} >  Download
//                           </Link>
//                           <Link to={{
//                             pathname: "/analysis",
//                             state: { search_id: sq.searchId, workspace_id: sq.workspaceId, workspace_name: sq.name, workspace_desc: sq.description, workspaceId: sq.id, search_type: "WORKSPACE" }
//                           }} >  Analyze
//                           </Link>
//                         </div>

//                       </div>
//                     </li>
//                   )
//                 }
//                 )}
//               </ul>
//             ) : (
//               <div className='text-center'>No record found</div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Modal
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Add Workspace</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="row">
//             <div className="col-md-6">
//               <label>Name:</label>
//               <input type="text" name="workspace" ref={workRef} className="form-control" />
//               {workspaceError && (<p className='error'>{workspaceError}</p>)}
//             </div>

//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => {
//             handleAddWorkspace()
//           }}>Submit</Button>
//         </Modal.Footer>
//       </Modal>


//     </>
//   );
// }
// const mapStateToProps = state => {
//   return {
//     loading: state.loader.loading
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     loadingStart: () => dispatch(loaderStart()),
//     loadingStop: () => dispatch(loaderStop())
//   };
// };
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace));

import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2';
import AxiosACT from "../shared/AxiosACT";
import moment from 'moment';
import { loaderStart, loaderStop } from "../store/actions/loader";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';


function Workspace(props) {

  const workspace_id = props.location.state ? props.location.state.workspace_id : "";
  const workspace_name = props.location.state ? props.location.state.workspace_name : "";
  const workRef = useRef();
  const userId = localStorage.getItem("userToken");

  const [workspaceError, setWorkspaceError] = useState("");
  const [workspaceList, setWorkspaceList] = useState([]);
  const [show, setShow] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(workspace_name);
  const [workspaceId, setWorkspaceId] = useState(workspace_id);
  const [searchQueryList, setSearchQueryList] = useState([]);
  const [searchQueryListData, setSearchQueryListData] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddWorkspace = () => {

    if (workRef.current.value) {
      const postData = {
        "name": workRef.current.value,
        "is_active": "Y",
      }
      AxiosACT({
        method: "POST",
        url: `/activity-management/workspace`,
        data: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          Swal.fire({
            title: 'Success',
            text: "Workspace added successfully",
            icon: 'success',
          })
          getWorkspaceList();
        })
        .catch(err => {
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
      handleClose();
    } else {
      setWorkspaceError("Please enter workspace name");
    }

  }

  const deleteWorkspaceItem = (id) => {
    Swal.fire({
      title: 'Remove',
      text: " Are you sure you want to Remove workspace item ?",
      icon: 'success',
      dangerMode: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((isConfirm) => {

      if (isConfirm.isConfirmed) {
        AxiosACT({
          method: "PUT",
          url: `/activity-management/workspace/removesearch?userWorkspaceId=${id}`
        })
          .then(res => {
            Swal.fire({
              title: 'Remove',
              text: " Item removed successfully",
              icon: 'success',
            }).then(getWorkspaceList(), getSearchQueryList())
          })
          .catch(err => {
            // console.log("Err", err);
          });
      }
    })

  }

  const getWorkspaceList = () => {

    AxiosACT({
      method: "GET",
      url: `/activity-management/workspace/list?userId=${userId}`
    })
      .then(res => {
        setWorkspaceList(res.data.workspaceList);
      })
      .catch(err => {
        // console.log("Err", err);
      });
  }

  const getSearchQueryList = () => {
    const rquestParams = { "createdBy": userId, "workspaceId": workspaceId };
    props.loadingStart()
    AxiosACT({
      method: "GET",
      url: `/activity-management/workspace/searchByUser`,
      params: rquestParams
    })
      .then(res => {
        console.log("Workspace created res", res.data);
        props.loadingStop()
        setSearchQueryList(res.data.searchQueryWithWS);
        setSearchQueryListData(res.data.searchQueryWithWS);
        props.loadingStop()
      })
      .catch(err => {
        // console.log("Err", err);
        props.loadingStop()
      });
  }

  useEffect(() => {
    getWorkspaceList();
  }, []);

  useEffect(() => {
    getSearchQueryList();
  }, [workspaceId]);

  const searchList = (text) => {
    console.log("text", text)
    let sqData = searchQueryListData.filter((sq) => sq.name.toLowerCase().includes(text.toLowerCase()) || sq.description.toLowerCase().includes(text.toLowerCase()));
    setSearchQueryList(sqData);
  }
  return (
    <>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-12 list-page mt-3">

            <ul className="folder">
              <li>
                <span className='popover-link'>
                  <Link to={"#"} onClick={handleShow}><i className="icon ion-md-add"></i></Link>
                  <div className="workspaceIconLabel">Add New</div>
                </span>
              </li>
              {workspaceList.map((workspace, index) => {
                return (
                  <li key={index}>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={<Tooltip className="show">{workspace.name}</Tooltip>}
                    >
                      {({ ref, ...triggerHandler }) => (
                        <span {...triggerHandler} ref={ref} className='popover-link'>

                          <>
                            <Link to={"#"} onClick={() => {
                              setWorkspaceName(workspace.name);
                              setWorkspaceId(workspace.id)
                            }}><i className="icon ion-ios-folder-open"></i></Link>
                            <div className="workspaceIconLabel">{workspace.name}</div>
                          </>
                        </span>
                      )}
                    </OverlayTrigger>
                  </li>
                )
              })}
              <li>
                <Link to={"#"} onClick={() => {
                  setWorkspaceName("");
                  setWorkspaceId("")
                }}><i className="icon ion-ios-folder-open"></i></Link>
                <div className="workspaceIconLabel">All</div>
              </li>
            </ul>

            <div className="search-ar mt-2 mb-2">
              <h2 className="headl">Manage Workspace {workspaceName ? ` - ${workspaceName}` : ""}</h2>
              <div className="wrap float-right">
                <div className="search">
                  <input type="text" className="searchTerm" placeholder="What are you looking for?"
                    onChange={(event) => {
                      searchList(event.target.value);
                    }} />
                  <button type="submit" className="searchButton">
                    <i className="icon ion-md-search"></i>
                  </button>
                </div>
              </div>
            </div>

            {(searchQueryList.length > 0 ? (
              <ul className="regions-content">
                {searchQueryList.map((sq, index) => {
                  return (
                    <li className="product-card-item product-card-wrapper" key={index}>
                      <div className="panel card-panel product-card">

                        <div className="infodel" onClick={(e) => { deleteWorkspaceItem(sq.id) }}>
                          <i className="icon ion-md-trash text-danger"></i>
                        </div>

                        <div className="panel-header">{moment(sq.createdDate).format("DD-MMM-YYYY")}</div>
                        <div className="panel-content">
                          <p className="product-name">
                            <Link to={{
                              pathname: "/list1",
                              state: { search_id: sq.searchId, workspace_id: sq.workspaceId, workspace_name: sq.name, workspace_desc: sq.description, workspaceId: sq.id, search_type: "WORKSPACE" }
                            }}
                            >{sq.name}</Link></p>
                          <p className="product-description">{sq.description}</p>
                          <p className="workspace-highlight-content">
                            <span>
                              <h5>Trade</h5>
                              <h4>{sq.tradeType}</h4>
                            </span>
                            <span>
                              <h5>Country</h5>
                              {/* === MODIFICATION START === */}
                              <div className="workspace-card__country-container">
                                {sq.countryCode.length > 0 ? (
                                  sq.countryCode.map((code, idx) => (
                                    <span key={idx} className="workspace-card__country-item">{code}</span>
                                  ))
                                ) : (
                                  <h4>--</h4>
                                )}
                              </div>
                              {/* === MODIFICATION END === */}
                            </span>
                            <span>
                              <h5>Shipments</h5>
                              <h4>{sq.totalRecords}</h4>
                            </span>
                            <span>
                              <h5>Date Range</h5>
                              <h4>{moment(sq.fromDate).format("DD-MMM-YYYY")} To {moment(sq.toDate).format("DD-MMM-YYYY")}</h4>
                            </span>
                          </p>

                        </div>
                        <div className="panel-footer text-center">
                          <Link to={{
                            pathname: "/list1",
                            state: { search_id: sq.searchId, 
                                    workspace_id: sq.workspaceId,
                                    workspace_name: sq.name,
                                    workspace_desc: sq.description,
                                    workspaceId: sq.id, 
                                    search_type: "WORKSPACE" 
                              }
                          }} >  Download
                          </Link>
                          <Link to={{
                            pathname: "/analysis",
                            state: { search_id: sq.searchId,
                                    workspace_id: sq.workspaceId,
                                    workspace_name: sq.name,
                                    workspace_desc: sq.description,
                                    workspaceId: sq.id, 
                                    search_type: "WORKSPACE",
                                    tradeType: sq.tradeType,
                                    page_name:"work_space"
                                }
                          }} >  Analyze
                          </Link>
                        </div>

                      </div>
                    </li>
                  )
                }
                )}
              </ul>
            ) : (
              <div className='text-center'>No record found</div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <label>Name:</label>
              <input type="text" name="workspace" ref={workRef} className="form-control" />
              {workspaceError && (<p className='error'>{workspaceError}</p>)}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            handleAddWorkspace()
          }}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const mapStateToProps = state => {
  return {
    loading: state.loader.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadingStart: () => dispatch(loaderStart()),
    loadingStop: () => dispatch(loaderStop())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Workspace));
