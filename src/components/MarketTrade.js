import React, { useRef } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
// import { useHistory , withRouter  } from 'react-router-dom';

const MarketTrade = (props) => {
  const searchTypeRef = useRef();
  const searchValueRef = useRef();
  // const history =useHistory;
  const handleSubmit = () => {
    if (!searchTypeRef.current.value) {
      Swal.fire({
        title: 'Alert!',
        text: 'Please select search type',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } else if (!searchValueRef.current.value) {
      Swal.fire({
        title: 'Alert!',
        text: 'Please enter search value',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } else {
      const data = { searchType: searchTypeRef.current.value, searchValue: searchValueRef.current.value };
      props.routeToList(data);
    }

  }
  return (
    <>
      <section className="domains market-trade">
        <div className="row">
          <div className="col-sm-12">
            <h2>Search Global Export Import Trade Data</h2>
            <hr className="small" />
            <p><strong>Example:</strong> Potassium | Sulphate | Sesame seedWaste | Paper | Icon | Copper | Steel | Paper | Metal | Rice | PVC | Resin</p>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-11 com-md-11 center-block">

            <form className="form-inline domainsearch" method="post" action="#">
              <div className="row no-gutter">
                <div className="col-sm-7">
                  <input type="text" className="form-control" placeholder="Enter search value" ref={searchValueRef} />
                </div>
                <div className="col-sm-3">
                  <select className="form-control" ref={searchTypeRef}>
                    <option value="">Select Type</option>
                    <option value="HS_CODE">HS Code</option>
                    <option value="PRODUCT">Product</option>
                    <option value="IMPORTER">Importer</option>
                    <option value="EXPORTER">Exporter</option>
                  </select>
                </div>
                <div className="col-sm-2">
                  <button type="submit" onClick={(event) => {
                    event.preventDefault();
                    handleSubmit();
                  }} className="btn btn-primary">SEARCH</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="padding10">
          <div className="row">
            <div className="col-md-4">
              <div className="bg-light-warning px-6 py-8 rounded-2 text-center">
                <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                  <i className="icon ion-md-search"></i>
                </span>
                <Link className="text-warning fs-6" to="/list1">Trade Search</Link>
                <h5>Records of any product name or HS Code</h5>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light-danger px-6 py-8 rounded-2 text-center">
                <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                  <i className="icon ion-md-analytics"></i>
                </span>
                <Link href="#" className="text-danger fs-6" to="/list1">Macro Analysis</Link>
                <h5>Summarised reports with graphs and charts</h5>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light-success px-6 py-8 rounded-2 text-center">
                <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                  <i className="icon ion-md-analytics"></i>
                </span>
                <Link href="#" className="text-success fs-6" to="/list1">In-depth Analysis</Link>
                <h5>Coming Soon <br />&nbsp;</h5>
              </div>
            </div>
          </div>
        </div>

      </section>















      {/* <div className="market-trade">
        <Tabs defaultActiveKey="limit">
          <Tab eventKey="limit" title="Limit">
            <div className="d-flex justify-content-between">
              <div className="market-trade-buy">
                <form action="#">
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">BTC</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <ul className="market-trade-list">
                    <li>
                      <a href="#!">25%</a>
                    </li>
                    <li>
                      <a href="#!">50%</a>
                    </li>
                    <li>
                      <a href="#!">75%</a>
                    </li>
                    <li>
                      <a href="#!">100%</a>
                    </li>
                  </ul>
                  <p>
                    Available: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Volume: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Margin: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Fee: <span>0 BTC = 0 USD</span>
                  </p>
                  <button type="submit" className="btn buy">
                    Buy
                  </button>
                </form>
              </div>
              <div className="market-trade-sell">
                <form action="#">
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">BTC</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <ul className="market-trade-list">
                    <li>
                      <a href="#!">25%</a>
                    </li>
                    <li>
                      <a href="#!">50%</a>
                    </li>
                    <li>
                      <a href="#!">75%</a>
                    </li>
                    <li>
                      <a href="#!">100%</a>
                    </li>
                  </ul>
                  <p>
                    Available: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Volume: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Margin: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Fee: <span>0 BTC = 0 USD</span>
                  </p>
                  <button className="btn sell">Sell</button>
                </form>
              </div>
            </div>
          </Tab>
          <Tab eventKey="market" title="Market">
            <div className="d-flex justify-content-between">
              <div className="market-trade-buy">
                <form action="#">
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">BTC</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <ul className="market-trade-list">
                    <li>
                      <a href="#!">25%</a>
                    </li>
                    <li>
                      <a href="#!">50%</a>
                    </li>
                    <li>
                      <a href="#!">75%</a>
                    </li>
                    <li>
                      <a href="#!">100%</a>
                    </li>
                  </ul>
                  <p>
                    Available: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Volume: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Margin: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Fee: <span>0 BTC = 0 USD</span>
                  </p>
                  <button type="submit" className="btn buy">
                    Buy
                  </button>
                </form>
              </div>
              <div className="market-trade-sell">
                <form action="#">
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">BTC</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <ul className="market-trade-list">
                    <li>
                      <a href="#!">25%</a>
                    </li>
                    <li>
                      <a href="#!">50%</a>
                    </li>
                    <li>
                      <a href="#!">75%</a>
                    </li>
                    <li>
                      <a href="#!">100%</a>
                    </li>
                  </ul>
                  <p>
                    Available: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Volume: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Margin: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Fee: <span>0 BTC = 0 USD</span>
                  </p>
                  <button className="btn sell">Sell</button>
                </form>
              </div>
            </div>
          </Tab>
          <Tab eventKey="stop-limit" title="Stop Limit">
            <div className="d-flex justify-content-between">
              <div className="market-trade-buy">
                <form action="#">
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">BTC</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <ul className="market-trade-list">
                    <li>
                      <a href="#!">25%</a>
                    </li>
                    <li>
                      <a href="#!">50%</a>
                    </li>
                    <li>
                      <a href="#!">75%</a>
                    </li>
                    <li>
                      <a href="#!">100%</a>
                    </li>
                  </ul>
                  <p>
                    Available: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Volume: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Margin: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Fee: <span>0 BTC = 0 USD</span>
                  </p>
                  <button type="submit" className="btn buy">
                    Buy
                  </button>
                </form>
              </div>
              <div className="market-trade-sell">
                <form action="#">
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">BTC</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <ul className="market-trade-list">
                    <li>
                      <a href="#!">25%</a>
                    </li>
                    <li>
                      <a href="#!">50%</a>
                    </li>
                    <li>
                      <a href="#!">75%</a>
                    </li>
                    <li>
                      <a href="#!">100%</a>
                    </li>
                  </ul>
                  <p>
                    Available: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Volume: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Margin: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Fee: <span>0 BTC = 0 USD</span>
                  </p>
                  <button className="btn sell">Sell</button>
                </form>
              </div>
            </div>
          </Tab>
          <Tab eventKey="stop-market" title="Stop Market">
            <div className="d-flex justify-content-between">
              <div className="market-trade-buy">
                <form action="#">
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">BTC</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <ul className="market-trade-list">
                    <li>
                      <a href="#!">25%</a>
                    </li>
                    <li>
                      <a href="#!">50%</a>
                    </li>
                    <li>
                      <a href="#!">75%</a>
                    </li>
                    <li>
                      <a href="#!">100%</a>
                    </li>
                  </ul>
                  <p>
                    Available: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Volume: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Margin: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Fee: <span>0 BTC = 0 USD</span>
                  </p>
                  <button type="submit" className="btn buy">
                    Buy
                  </button>
                </form>
              </div>
              <div className="market-trade-sell">
                <form action="#">
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">BTC</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <ul className="market-trade-list">
                    <li>
                      <a href="#!">25%</a>
                    </li>
                    <li>
                      <a href="#!">50%</a>
                    </li>
                    <li>
                      <a href="#!">75%</a>
                    </li>
                    <li>
                      <a href="#!">100%</a>
                    </li>
                  </ul>
                  <p>
                    Available: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Volume: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Margin: <span>0 BTC = 0 USD</span>
                  </p>
                  <p>
                    Fee: <span>0 BTC = 0 USD</span>
                  </p>
                  <button className="btn sell">Sell</button>
                </form>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div> */}
    </>
  );
}
export default MarketTrade;
