import React, { useEffect, useState } from "react";
import AxiosUser from "../shared/AxiosUser";
import moment from "moment";
import AddUser from "../components/CreateUser";
import EditUser from "../components/EditUser";
import { Modal } from "react-bootstrap";
import { loaderStart, loaderStop } from "../store/actions/loader";
import { updateSubscriptionCount } from "../store/actions/data";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";

function Users(props) {
  const userId = localStorage.getItem("userToken");
  const loginUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const PAGE_SIZE = 10;

  const [userListData, setUserListData] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // full data for search
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rowData, setRowdata] = useState(false);

  const formatUser = (user, isLoginUser = false) => {
    return {
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      mobile: user.mobile || "",
      isActive: user.isActive || "",
      createdDate: user.createdDate
        ? moment(user.createdDate).format("YYYY-MM-DD")
        : "",
      password: user.password || "",
      companyName: user.companyName || "",
      downloadLimit: user.downloadLimit || "",
      id: isLoginUser ? user.userid : user.id,
    };
  };

  // 1) Count API for total pagination count
  const getUserCount = async () => {
    try {
      const res = await AxiosUser({
        method: "GET",
        url: "user-management/user/countbyuplineid",
        params: {
          uplineId: userId,
          isDelete: "N",
        },
        headers: {
          accessedBy: userId,
        },
      });

      // change this according to your API response
      const count =
        res?.data?.count ||
        res?.data?.totalCount ||
        res?.data?.total ||
        res?.data ||
        0;

      setTotalCount(Number(count));
    } catch (err) {
      console.log("Count API error:", err);
      setTotalCount(0);
    }
  };

  // 2) Paginated list API
  const getPaginatedUserList = async (page = 0) => {
    props.loadingStart();

    try {
      const res = await AxiosUser({
        method: "GET",
        url: "user-management/user/listbyuplineid",
        params: {
          uplineId: userId,
          pageNumber: page,
          isDelete: "N",
        },
        headers: {
          accessedBy: userId,
        },
      });

      // adjust key if API returns another field name
      const apiUsers =
        res?.data?.userList ||
        res?.data?.data ||
        res?.data?.content ||
        res?.data ||
        [];

      let tempUserList = [];

      // add logged-in user at first page only
      if (page === 0 && loginUser) {
        tempUserList.push(formatUser(loginUser, true));
      }

      apiUsers.forEach((user) => {
        tempUserList.push(formatUser(user));
      });

      setUserListData(tempUserList);
      setCurrentPage(page);
    } catch (err) {
      console.log("List API error:", err);
      setUserListData([]);
    } finally {
      props.loadingStop();
    }
  };

  // 3) Full list for search
  const getAllUsersForSearch = async () => {
    try {
      let tempUsers = [];

      if (loginUser) {
        tempUsers.push(formatUser(loginUser, true));
      }

      const res = await AxiosUser({
        method: "GET",
        url: "user-management/user/list",
        params: {
          uplineId: userId,
        },
      });

      const apiUsers = res?.data?.userList || [];

      apiUsers.forEach((user) => {
        tempUsers.push(formatUser(user));
      });

      setAllUsers(tempUsers);
    } catch (err) {
      console.log("Full list API error:", err);
      setAllUsers([]);
    }
  };

  const loadInitialData = async () => {
    props.loadingStart();
    try {
      await Promise.all([getUserCount(), getPaginatedUserList(0), getAllUsersForSearch()]);
    } finally {
      props.loadingStop();
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleModal = () => {
    if (props.subUserCount > 0) {
      Swal.fire({
        title: "Create User !",
        text: `Available Limit ${props.subUserCount}. \n Are you sure you want to Create New User ?`,
        icon: "warning",
        dangerMode: true,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((isConfirm) => {
        if (isConfirm.value) {
          setShowModal(true);
        }
      });
    } else {
      Swal.fire({
        title: "Create User !",
        text: "Your User Limit Exhausted",
        icon: "error",
        dangerMode: true,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const UpdateSubscription = (params) => {
    AxiosUser({
      method: "PUT",
      url: `user-management/user-subscription/update/${props.subscriptionId}`,
      data: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        props.updateSubscriptionCount({
          download_count: props.download_count,
          subscriptionId: props.subscriptionId,
          dataAccess_count: props.dataAccess_count,
          totalWorkspace: props.totalWorkspace,
          subUserCount: props.subUserCount - 1,
        });
      })
      .catch(() => {
        console.log("Something went wrong");
      });
  };

  const OnUserCreate = () => {
    handleModalClose();
    loadInitialData();
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const modalSubmit = () => {
    setShowModal(false);
    setShowEditModal(false);
    loadInitialData();
  };

  const handleEditModal = (rowData) => {
    setShowEditModal(true);
    setRowdata(rowData);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  // Search
  const searchUser = (text) => {
    setSearchText(text);

    if (!text.trim()) {
      setIsSearching(false);
      setCurrentPage(0);
      getPaginatedUserList(0);
      return;
    }

    setIsSearching(true);

    const filtered = allUsers.filter((user) => {
      const first = user.firstname ? user.firstname.toLowerCase() : "";
      const last = user.lastname ? user.lastname.toLowerCase() : "";
      const email = user.email ? user.email.toLowerCase() : "";
      const company = user.companyName ? user.companyName.toLowerCase() : "";
      const value = text.toLowerCase();

      return (
        first.includes(value) ||
        last.includes(value) ||
        email.includes(value) ||
        company.includes(value)
      );
    });

    setCurrentPage(0);
    setUserListData(filtered.slice(0, PAGE_SIZE));
  };

  const handlePageChange = (page) => {
    if (page < 0 || page >= totalPages) return;

    setCurrentPage(page);

    if (isSearching) {
      const filtered = allUsers.filter((user) => {
        const first = user.firstname ? user.firstname.toLowerCase() : "";
        const last = user.lastname ? user.lastname.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const company = user.companyName ? user.companyName.toLowerCase() : "";
        const value = searchText.toLowerCase();

        return (
          first.includes(value) ||
          last.includes(value) ||
          email.includes(value) ||
          company.includes(value)
        );
      });

      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      setUserListData(filtered.slice(start, end));
    } else {
      getPaginatedUserList(page);
    }
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "Remove",
      text: " Are you sure you want to Remove the user?",
      icon: "warning",
      dangerMode: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((isConfirm) => {
      if (isConfirm.isConfirmed) {
        const postData = {
          isDelete: "Y",
        };

        AxiosUser({
          method: "PUT",
          url: `user-management/deleteuser/${id}`,
          data: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(() => {
            Swal.fire({
              title: "Remove",
              text: " User removed successfully",
              icon: "success",
            }).then(() => {
              loadInitialData();
            });
          })
          .catch((err) => {
            console.log("Delete error:", err);
          });
      }
    });
  };

  const filteredTotalCount = isSearching
    ? allUsers.filter((user) => {
        const first = user.firstname ? user.firstname.toLowerCase() : "";
        const last = user.lastname ? user.lastname.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const company = user.companyName ? user.companyName.toLowerCase() : "";
        const value = searchText.toLowerCase();

        return (
          first.includes(value) ||
          last.includes(value) ||
          email.includes(value) ||
          company.includes(value)
        );
      }).length
    : totalCount + 1; // +1 because login user is added manually on page 0

  const totalPages = Math.ceil(filteredTotalCount / PAGE_SIZE);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 list-page mt-3">
            <div className="search-ar mt-2 mb-2">
              <h2 className="headl">Users</h2>
              &nbsp;&nbsp;
              <button onClick={handleModal}>Add User</button>

              <div className="wrap float-right">
                <div className="search">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => searchUser(e.target.value)}
                    className="searchTerm"
                    placeholder="Search by firstname, lastname, email, company"
                  />
                  <button type="submit" className="searchButton">
                    <i className="icon ion-md-search"></i>
                  </button>
                </div>
              </div>
            </div>

            <table className="table table-striped table-hover">
              <thead>
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
                {userListData.length > 0 ? (
                  userListData.map((user, index) => {
                    const serialNo = currentPage * PAGE_SIZE + index + 1;

                    return (
                      <tr key={user.id || index}>
                        <td>{serialNo}.</td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname || ""}</td>
                        <td>{user.companyName || ""}</td>
                        <td>{user.email || ""}</td>
                        <td>{user.mobile || ""}</td>
                        <td>{user.downloadLimit || ""}</td>
                        <td>{user.isActive === "Y" ? "Active" : "Inactive"}</td>
                        <td>{user.createdDate || ""}</td>
                        <td>
                          {serialNo > 1 ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              <i className="icon ion-ios-trash"></i>
                            </button>
                          ) : null}
                          &nbsp;
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEditModal(user)}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No record found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
                <button
                  className="btn btn-secondary btn-sm mr-2"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm mx-1 ${
                      currentPage === i ? "btn-primary" : "btn-light"
                    }`}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="btn btn-secondary btn-sm ml-2"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          {showModal ? (
            <Modal show={showModal} onHide={handleModalClose}>
              <Modal.Header closeButton>Create User</Modal.Header>
              <Modal.Title></Modal.Title>
              <Modal.Body
                style={{ height: "80vh", overflow: "auto", scrollbarWidth: "10px" }}
              >
                <div>
                  <AddUser
                    UpdateSubscription={UpdateSubscription}
                    OnUserCreate={OnUserCreate}
                    subUserCount={props.subUserCount}
                    download_count={props.download_count}
                    subscriptionId={props.subscriptionId}
                    loaderStart={props.loadingStart}
                    loaderStop={props.loadingStop}
                  />
                </div>
              </Modal.Body>
            </Modal>
          ) : null}
        </div>

        <div>
          {showEditModal ? (
            <Modal show={showEditModal} onHide={handleEditModalClose}>
              <Modal.Header closeButton>Edit User</Modal.Header>
              <Modal.Title></Modal.Title>
              <Modal.Body
                style={{ height: "80vh", overflow: "auto", scrollbarWidth: "10px" }}
              >
                <div>
                  <EditUser
                    rowData={rowData}
                    download_count={props.download_count}
                    modalSubmit={modalSubmit}
                  />
                </div>
              </Modal.Body>
            </Modal>
          ) : null}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loader.loading,
    download_count: state.data.download_count,
    subscriptionId: state.data.subscriptionId,
    dataAccess_count: state.data.dataAccess_count,
    totalWorkspace: state.data.totalWorkspace,
    subUserCount: state.data.subUserCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadingStart: () => dispatch(loaderStart()),
    loadingStop: () => dispatch(loaderStop()),
    updateSubscriptionCount: (data) => dispatch(updateSubscriptionCount(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Users)
);