import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MarketHistory =(props)=> {
  return (
    <>
      <div className="market-history">
      <h2 className="heading">My Contact <Link to={"/savecontact"} className="float-right">View all</Link></h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th width="40%">Company Name</th>
              <th width="35%">Contact Number</th>
              <th width="25%">Email</th>
            </tr>
          </thead>
          <tbody>
            { props.contactListData.length>0?(
                props.contactListData.map((contact, index) => {
                  return (
                  <tr key={index}>
                    <td width="40%">{contact.companyName}</td>
                    <td width="35%">{contact.mobile?contact.mobile:'None'}</td>
                    <td width="25%">{contact.email?contact.email:'None'}</td>
                  </tr>
                  )

                })
                ):(<tr><td colSpan="3" style={{textAlign: "center"}}>No record found</td></tr>)}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MarketHistory; 
