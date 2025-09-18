import React from 'react';
import { Link } from 'react-router-dom';

export default function MarketNews() {
  return (
    <>
      <div className="market-news mt15">
        <h2 className="heading">Important Notification</h2>
        <ul>
          <li>
            <Link to="/news-details">
              <strong>34/2023</strong>
              Amendment in Policy condition No.07 (ii) of Chapter - 27 of Schedule-I (Import Policy) of ITC (HS), 2022 reg.
              <span>2023-10-04</span>
            </Link>
          </li>
          <li>
            <Link to="/news-details">
              <strong>33/2023</strong>
              Extension of RoDTEP scheme for exports made from 01.10.2023 - reg
              <span>2023-09-26</span>
            </Link>
          </li>
          <li>
            <Link to="/news-details">
              <strong>32/2023</strong>
              Export of Non-Basmati White Rice (under HS Code 10063090) to UAE through National Cooperative Exports Limited (NCEL)
              <span>2023-09-25</span>
            </Link>
          </li>
          <li>
            <Link to="/news-details">
              <strong>27/2023</strong>
              Implementation of the Trade Notice No. 07/2023-24 dated 08.06.2023 in reference to the pre-import condition under Advance Authorisation Scheme -reg.
              <span>2023-09-25</span>
            </Link>
          </li>
          <li>
            <Link to="/news-details">
              <strong>31/2023</strong>
              De-listing of agencies authorized to issue Certificates of Origin- (Non Preferential) from Appendix 2E of FTP, 2023 –reg.
              <span>2023-09-20</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
