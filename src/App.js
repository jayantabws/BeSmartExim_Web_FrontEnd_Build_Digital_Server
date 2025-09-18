import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AxiosUser from './shared/AxiosUser';
import Index from './pages';
import './App.scss'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'font-awesome/css/font-awesome.min.css';
import Routes from './navigation/Routes';
import "../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-dropdowns/styles/material.css";



let userId = ""

function ctrlShiftKey(e, keyCode) {
  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}

export default class App extends Component {

  userId = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null;

  state = {
    theme: 'light',
    subscriptionDetails: []
  };

  componentDidMount() {
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    }, false);

    document.onkeydown = (e) => {

      // -- Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U  --- //
     
      if (
        e.keyCode === 123 ||
        ctrlShiftKey(e, 'I') ||
        ctrlShiftKey(e, 'J') ||
        ctrlShiftKey(e, 'C') ||
        (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
      )
        return false;

    };
  }


  render() {
    return (
      <div class="prevent-select">
        <ThemeProvider
          value={{
            data: this.state,
            update: () => {
              this.setState((state) => ({
                theme:
                  state.theme === 'light'
                    ? (this.theme = 'dark')
                    : (this.theme = 'light'),
              }));
            },
          }}
        >
          <Routes component={ScrollToTop} />
        </ThemeProvider>
      </div>
    );
  }
}

const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};
