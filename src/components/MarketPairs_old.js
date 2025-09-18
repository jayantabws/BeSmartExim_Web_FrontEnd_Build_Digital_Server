import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import AxiosMaster from "../shared/AxiosMaster";
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';

export default function MarketPairs() {

  const [importCountryList, setImportCountryList] = useState([]);
  const [exportCountryList, setExportCountryList] = useState([]);
  const [importCountryListFilter, setImportCountryListFilter] = useState([]);
  const [exportCountryListFilter, setExportCountryListFilter] = useState([]);
  const [searchParamsState, setsearchParamsState] = useState([]);

  const getTradingCountryList = (params) => {

    let searchParams = params ? ( params == "btc" ? "I" : "E") : "I"
    setsearchParamsState(searchParams)
    setImportCountryList(importCountryListFilter)
    setExportCountryList(exportCountryListFilter)
    document.getElementById("input_search").value = ""

    if ((importCountryList && importCountryList.length == 0 && searchParams == "I") ||
    (exportCountryList && exportCountryList.length == 0 && searchParams == "E") ) {
      AxiosMaster({
        method: "GET",
        url: `masterdata-management/countrylistbytrade/${searchParams}`,    
      })
        .then(res => {
          let countryList = [];
          searchParams == "I" ? setImportCountryList(res.data.countryList) : setExportCountryList(res.data.countryList)
          searchParams == "I" ? setImportCountryListFilter(res.data.countryList) : setExportCountryListFilter(res.data.countryList)
        })
        .catch(err => {
          setImportCountryList([])
        });
    } 

  }

  const searchUser = (text) => {
    let userData = []
    if(searchParamsState == "I"){
      userData =  importCountryListFilter.filter((contact) => contact.name.toLowerCase().includes(text.toLowerCase()))
      setImportCountryList(userData)
    }
    else {
      userData = exportCountryListFilter.filter((contact) => contact.name.toLowerCase().includes(text.toLowerCase()))
      setExportCountryList(userData)
    }
  }

  useEffect(() => {
    getTradingCountryList(null)  
  }, []);


  return (
    <>
      <div className="market-pairs">
      <span class="circle-pulse-orange"></span>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              <i className="icon ion-md-search"></i>
            </span>
          </div>
          <input
            type="text"
            id = "input_search"
            className="form-control"
            placeholder="Search"
            aria-describedby="inputGroup-sizing-sm"
            onChange={(e) => { searchUser(e.target.value) }}
          />
        </div>
        <Tabs defaultActiveKey="btc" onSelect = {(val) => {getTradingCountryList(val)}}>

          <Tab eventKey="btc" ref="btc" title="Importing Country">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Data From</th>
                  <th>Data Upto</th>
                </tr>
              </thead>
              <tbody>
              {importCountryList && importCountryList.map((item, index) =>(
                <Link to={{ 
                  pathname: "/list", 
                  state: {countryCode:item.shortcode, tradeType: "IMPORT" }
                  }} >
                <tr key = {index} > 
                  <td><h6>{item.name}</h6></td>
                  <td><h6>{item.importFrom ? (moment(item.importFrom).format('DD-MMM-YYYY')) : null}</h6></td>
                  <td><h6>{item.importFrom ? (moment(item.importUpto).format('DD-MMM-YYYY')) : null}</h6></td>
                </tr>
                </Link>
              )) }
              
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="eth" ref="eth" title="Exporting Country">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Data From</th>
                  <th>Data Upto</th>
                </tr>
              </thead>
              <tbody>
              {exportCountryList && exportCountryList.map((item, index) =>(
                 <Link to={{ 
                  pathname: "/list", 
                  state: {countryCode:item.shortcode, tradeType: "EXPORT" }
                  }} >
                <tr key = {index}>   
                  <td><h6>{item.name}</h6></td>
                  <td><h6>{item.exportFrom ? (moment(item.exportFrom).format('DD-MMM-YYYY')) : null}</h6></td>
                  <td><h6>{item.exportFrom ? (moment(item.exportUpto).format('DD-MMM-YYYY')) : null}</h6></td>
                </tr>
                </Link>
              )) }
              </tbody>
            </table>
          </Tab>

        </Tabs>
      </div>
    </>
  );
}
