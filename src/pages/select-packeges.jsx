import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { useContext } from 'react';
import { AccordionContext } from 'react-bootstrap';

export default function SelectPackeges() {

  let history = useHistory();

  function ContextAwareToggle({ children, eventKey, callback }) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(
      eventKey,
      () => callback && callback(eventKey),
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
      <button
        type="button"
        style={{ boxShadow: isCurrentEventKey ? '0px 0px 10px #ccc' : 'lavender' }}
        onClick={decoratedOnClick}
      >
        {children}
        {
          isCurrentEventKey ? <i className="icon ion-md-remove"></i> : <i className="icon ion-md-add"></i>
        }
      </button>
    );
  }
  return (
    <>

      <section className="container packeges">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2>Pick a plan</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 column">
            <ul className="pricing-table">
              <li className="title">Free</li>
              <li className="price">Free <span>/ month</span></li>
              <li className="bullet-item"><strong>Validity</strong> Lifetime</li>
              <li className="bullet-item"><strong>Unlimited Full shipment view</strong> No</li>
              <li className="bullet-item"><strong>Unlimited importer exporter view</strong> No</li>
              <li className="bullet-item"><strong>Unlimited Searches</strong> 75 Searches Per Qtr.</li>
              <li className="bullet-item"><strong>Global Search</strong> No</li>
              <li className="bullet-item"><strong>Number of Workspaces</strong> 4</li>
              <li className="bullet-item">Users 1</li>
              <li className="cta-button"><a className="button" onClick={() => history.push('/signup')}>Get Started</a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 column">
            <ul className="pricing-table highlight">
              <li className="title">Startup</li>
              <li className="price">999USD <span>/ year</span></li>
              <li className="bullet-item"><strong>Validity</strong> Lifetime</li>
              <li className="bullet-item"><strong>Unlimited Full shipment view</strong> No</li>
              <li className="bullet-item"><strong>Unlimited importer exporter view</strong> No</li>
              <li className="bullet-item"><strong>Unlimited Searches</strong> 75 Searches Per Qtr.</li>
              <li className="bullet-item"><strong>Global Search</strong> No</li>
              <li className="bullet-item"><strong>Number of Workspaces</strong> 4</li>
              <li className="bullet-item">Users 10</li>
              <li className="cta-button"><a className="button" onClick={() => history.push('/signup')}>Get Started</a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 column">
            <ul className="pricing-table">
              <li className="title">SME</li>
              <li className="price">3999USD <span>/ year</span></li>
              <li className="bullet-item"><strong>Validity</strong> Lifetime</li>
              <li className="bullet-item"><strong>Unlimited Full shipment view</strong> No</li>
              <li className="bullet-item"><strong>Unlimited importer exporter view</strong> No</li>
              <li className="bullet-item"><strong>Unlimited Searches</strong> 75 Searches Per Qtr.</li>
              <li className="bullet-item"><strong>Global Search</strong> No</li>
              <li className="bullet-item"><strong>Number of Workspaces</strong> 4</li>
              <li className="bullet-item">Users 100</li>
              <li className="cta-button"><a className="button" onClick={() => history.push('/signup')}>Get Started</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Accordion className="acc" defaultActiveKey="0">
              <Card>
                <Card.Header>
                  <ContextAwareToggle eventKey="0">What is Besmartexim ?</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Besmartexim is a USA-based Market Research Company that brings to you global export-import intelligence information from 81* countries across the world. It is one of the most trusted, reputed, and authentic source of market research for global exporters and importers. Besmartexim has many unique features and analytical tools that are easy to do-it - yourself.Within minutes you can analyse bulky data that is presented in neat, meaningful, and relevant dashboards and charts for quick analysis.You can filter the data and carry out multiple analyses and get comparison reports on Markets, Products, Importers, and Exporters from all over the world.</Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <ContextAwareToggle eventKey="1">How many countries are covered in your database?</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>Our database covers 81* countries. We keep enriching this database for creating a better research experience for you. Some of our latest additions are Indonesia, Korea, and Uganda.</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </div>


      </section>


      {/* <div className="vh-100 d-flex justify-content-center">
        <div className="form-access my-auto">
          <form>
            <span>Create Account</span>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                required
              />
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="form-checkbox"
                required
              />
              <label className="custom-control-label" htmlFor="form-checkbox">
                I agree to the{' '}
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </form>
          <h2>
            Already have an account?
            <Link to="/login"> Sign in here</Link>
          </h2>
        </div>
      </div> */}
    </>
  );
}
