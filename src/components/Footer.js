import React, { Component } from 'react';
import SalesIQ from '../shared/ZohoPlugin';
import ChatWidget from './ChatWidget';
export default class Footer extends Component {
  
  render() {

    return (
      <>
        <footer className="footer">
          <p>Copyright 2022, All right reserved.</p>
      

          <ChatWidget/>
        </footer>
      </>
    );
  }
}
