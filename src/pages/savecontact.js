import React, { useEffect, useState } from 'react';
import AxiosACT from "../shared/AxiosACT";


export default function Markets() {

  const userId = localStorage.getItem("userToken");

  const [loading, isLoading] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [contactListData, setContactListData] = useState([]);


  const getContactList = () => {

    AxiosACT({
      method: "GET",
      url: `activity-management/listcontact?userId=${userId}`
    })
      .then(res => {
        setContactList(res.data.contactList);
        setContactListData(res.data.contactList);
        isLoading(true);
      })
      .catch(err => {
        // console.log("Err", err);
        isLoading(true);
      });
  }

  useEffect(() => {
    getContactList();
  }, []);

  const searchContact = (text) => {
    console.log("text", text)
    let contactData = contactList.filter((contact) => contact.companyName.toLowerCase().includes(text.toLowerCase()));
    setContactListData(contactData);
  }

  return (
    <>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-12 list-page mt-3">


            <div className="search-ar mt-2 mb-2">
              <h2 className="headl">Save Contact</h2>
              <div className="wrap float-right">
                <div className="search">
                  <input type="text" onChange={(e) => { searchContact(e.target.value) }} className="searchTerm" placeholder="What are you looking for?" />
                  <button type="submit" className="searchButton">
                    <i className="icon ion-md-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead className="">
                <tr>
                  <th>Sl.</th>
                  <th>Company Name</th>
                  <th>Address</th>
                  <th>Contact Number</th>
                  <th>Email Id</th>
                  <th>Website</th>
                  <th>Mail Us For Contact Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  contactListData.length > 0 ? (
                    contactListData.map((contact, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}.</td>
                          <td>{contact.companyName}</td>
                          <td>{contact.address ? contact.address : 'None'}</td>
                          <td>{contact.mobile ? contact.mobile : 'None'}</td>
                          <td>{contact.email ? contact.email : 'None'}</td>
                          <td>{contact.website ? contact.website : 'None'}</td>
                          <td><button className="btn btn-primary btn-sm"><i className="icon ion-ios-call"></i></button></td>
                        </tr>
                      )

                    })
                  ) : (<tr><td colSpan="7" style={{ textAlign: "center" }}>No record found</td></tr>)
                ) : (
                  <div className="loaderBlock">
                    <div className="loader"></div>
                  </div>
                )}
              </tbody>
            </table>

          </div>
        </div>


      </div>


    </>
  );
}
