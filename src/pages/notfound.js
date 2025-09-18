import React from 'react';
import { Link } from 'react-router-dom';

export default function notfound(props) {
  const message = props.history.location.state?.data

  return (
    <>
      <div className="error-page vh-100 d-flex justify-content-center text-center">
        <div className="my-auto">
          <h2>Maintenance</h2>
          <p>{message}</p>
          <Link to="/" className="btn">
            Back to Home <i className="icon ion-md-home"></i>
          </Link>
        </div>
      </div>
    </>
  );
}
