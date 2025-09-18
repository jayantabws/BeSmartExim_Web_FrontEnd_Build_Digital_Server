import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const OrderBook = (props) => {
  return (
    <>
      <div className="order-book mb15">
        <h2 className="heading">My Workspace <Link to={"/workspace"} className="float-right">View all</Link></h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th width="50%">Name</th>
              <th width="30%">Date</th>
              <th width="20%" class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
          { props.workspaceList.length>0?(
            props.workspaceList.map((workspace, index) => {
            return(
            <tr key={index}>      
            { console.log("workspace name ===== ",workspace.name)}
              <td width="50%">{workspace.name}</td>
              <td width="30%">{moment(workspace.created_date).format("DD-MMM-YYYY")}</td>
              {/* <td width="20%" class="text-center"><Link to={"/workspace"}> */}
              <td width="20%" class="text-center"><Link to={{pathname: "/workspace" ,state: {workspace_id : workspace.id, workspace_name: workspace.name}}}>
                <i className="icon ion-md-eye"></i></Link></td>
            </tr>
            )
          }
          )
          ):(<tr><td colSpan="3" style={{textAlign: "center"}}>No record found</td></tr>)}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default OrderBook;
