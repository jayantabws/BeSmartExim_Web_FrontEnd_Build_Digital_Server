import React, { Component } from 'react';
import SalesIQ from '../shared/ZohoPlugin';
export default class Footer extends Component {
  
  render() {

    return (
      <>
        <footer className="footer">
          <p>Copyright 2022, All right reserved.</p>
          <p><SalesIQ/></p>
        </footer>
      </>
    );
  }
}
