import React, { useEffect, useState } from "react";
import Axios from "../shared/Axios";

const ensureArray = (v) => (Array.isArray(v) ? v : []);

export default function IndepthSearchTable({
  params ,               // search payload passed from indepth page
  filteredColumn = [],        // unused (we use fixed columns per request)
  initialPage = 1,
  initialLimit = 20,
  onRowClick = () => {}
}) {

  console.log('IndepthSearchTable params',  params );
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);

  // Fixed column definitions (as requested)
  let dateColumn;
  let exporter_name;
  let importer_name
  let total_value;
  let country_origin_destination_label;
  if(params.tradeType==="EXPORT"){
      dateColumn="date";
      exporter_name="exporter_name";
      importer_name="recepient_name";
      total_value="total_value_usd";
      country_origin_destination_label=" Country of Destination";
  }else{
      dateColumn="be_date";
      exporter_name="exporter_name";
      importer_name="importer_name";
      total_value="total_value";
      country_origin_destination_label=" Country Origin";
  }
  const columnDefs = [
    { key: dateColumn, label: "Date" },
    { key: "hs_code", label: "HS Code" },
    { key: "product_description", label: "Product Description" },
    { key: importer_name, label: "Importer Name" },
    { key: exporter_name, label: "Exporter Name" },
   // { key: "country_of_origin", label: "Country of Origin" },
   { 
      key: "country_of_origin", 
      label: country_origin_destination_label,
      //  ADD: Multiple possible field names + custom logic
      alternateKeys: ["country_name", "origin_country", "country", "destination_country", "countryOfOrigin"]
    },
    { key: "std_quantity", label: "Std Quantity" },
    { key: "std_unit", label: "Std Unit" },
    { key: "total_value_usd", label: "Total Value $" },
    { key: "quantity", label: "Quantity" },
    { key: "unit", label: "Unit" },
    { key: "unit_price_usd", label: "Unit Price $" },
    { key: total_value, label: "Total Value" },
    { key: "currency", label: "Currency" },
    { key: "origin_port", label: "Origin Port" },
    { key: "destination_port", label: "Destination Port" },
    { key: "mode_of_transport", label: "Mode of Transport" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
    { key: "hs_code2", label: "HS Code2" },
    { key: "hs_code4", label: "HS Code4" }
  ];

  const buildPostData = (p, pg = 0, nr = limit) => ({
    searchType: "TRADE",
    tradeType: p?.tradeType ?? null,
    fromDate: p?.fromDate ?? null,
    toDate: p?.toDate ?? null,
    searchBy: p?.searchBy ?? null,
    searchValue: p?.searchValue ?? null,
    countryCode: ensureArray(p?.countryCode),
    pageNumber: pg,
    numberOfRecords: nr,
    matchType: p?.matchType ?? null,
    portOriginList: ensureArray(p?.portOriginList),
    portDestinationList: ensureArray(p?.portDestinationList),
    hsCodeList: ensureArray(p?.hsCodeList),
    hsCode4DigitList: ensureArray(p?.hsCode4DigitList),
    exporterList: ensureArray(p?.exporterList),
    importerList: ensureArray(p?.importerList),
    cityOriginList: ensureArray(p?.cityOriginList),
    cityDestinationList: ensureArray(p?.cityDestinationList),
    queryBuilder: ensureArray(p?.queryBuilder),
    shipModeList: ensureArray(p?.shipmentModeList),
    stdUnitList: ensureArray(p?.stdUnitList),
    searchId: p?.searchId ?? null
  });
console.log('params',  params );

  // ✅ ADD: Helper function to get only the selected country from main search
  const getSelectedCountry = () => {
    if (!params) return "";
    
    // Check if countryCode is set in main search
    if (params.countryCode && Array.isArray(params.countryCode) && params.countryCode.length > 0) {
      return params.countryCode[0]; // Return first selected country from main search
    }
    
    // Check cityOriginList and cityDestinationList which contain selected countries
    if (params.cityOriginList && params.cityOriginList.length > 0) {
      return params.cityOriginList[0]; // Return first selected country
    }
    
    if (params.cityDestinationList && params.cityDestinationList.length > 0) {
      return params.cityDestinationList[0]; // Return first selected country
    }
    
    return ""; // Return empty if no country selected
  };


  
  const getFieldValue = (row, column) => {
    // Special handling for country_of_origin
    if (column.key === "country_of_origin") {
      // Try to get from API response first
      let value = row[column.key];
      
      // Try alternate field names if primary key is empty
      if ((value === null || value === undefined || value === "") && column.alternateKeys) {
        for (const altKey of column.alternateKeys) {
          value = row[altKey];
          if (value !== null && value !== undefined && value !== "") {
            break;
          }
        }
      }
      
      // ✅ UPDATED: Only use selected country if API doesn't have country data
      if (value === null || value === undefined || value === "") {
        value = getSelectedCountry(); // Only return selected country, no default
      }
      
      return value;
    }
    
    // For other fields, return the direct value
    let value = row[column.key];
    if (value === null || typeof value === "undefined") value = "";
    return value;
  };

  const dedupeById = (arr) => {
    const seen = new Set();
    return arr.filter((r) => {
      const id = String(r?.id ?? r?._id ?? JSON.stringify(r));
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };


// ...existing code...

  const fetchTotalCount = async (postData) => {
    try {
      const res = await Axios({
        method: "POST",
        url: `/search-management/searchcount`,
        data: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" }
      });

      const data = res && res.data;
      let raw = null;
      if (data && typeof data.searchcount !== "undefined") raw = data.searchcount;
      else if (data && typeof data.totalRecords !== "undefined") raw = data.totalRecords;
      else if (data && typeof data.totalCount !== "undefined") raw = data.totalCount;
      else raw = data;

      const n = Number(raw);
      return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : null;
    } catch (err) {
      console.warn("searchcount failed:", err);
      return null;
    }
  };

  const fetchData = async (pg = page, lim = limit) => {
    if (!params || !params.tradeType) {
      setData([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const countPayload = buildPostData(params, 0, 0);
      const backendTotal = await fetchTotalCount(countPayload);
      if (backendTotal !== null) setTotal(backendTotal);

      const postData = buildPostData(params, pg - 1, lim);
      const res = await Axios({
        method: "POST",
        url: `/search-management/searchdepth`,
        data: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" }
      });
    console.log('res',  res );

     // ✅ ADD: Debug selected country
      console.log('Selected Country from search:', getSelectedCountry());
      const trade = (postData.tradeType || "").toLowerCase();
      const list = trade === "export" ? (res && res.data && res.data.expForeignList ? res.data.expForeignList : []) : (res && res.data && res.data.impForeignList ? res.data.impForeignList : []);
      const cleaned = dedupeById(Array.isArray(list) ? list : []);
      setData(cleaned);

      if (backendTotal === null) {
        const resData = res && res.data;
        let tryTotal = null;
        if (resData && typeof resData.totalRecords !== "undefined") tryTotal = resData.totalRecords;
        else if (resData && typeof resData.totalCount !== "undefined") tryTotal = resData.totalCount;
        const coerced = tryTotal != null ? Number(tryTotal) : null;
        setTotal(coerced !== null && Number.isFinite(coerced) ? Math.max(0, Math.floor(coerced)) : (cleaned.length || 0));
      }

      const computedTotalPages = Math.max(1, Math.ceil((backendTotal !== null ? backendTotal : (res && res.data && (res.data.totalRecords || cleaned.length))) / lim));
      if (pg > computedTotalPages) setPage(computedTotalPages);
    } catch (err) {
      console.error("IndepthSearchTable fetch error:", err);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

// ...existing code...

  // refetch when params change
  useEffect(() => {
    setPage(1);
    fetchData(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  // fetch when page/limit change
  useEffect(() => {
    fetchData(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <div className="card mt-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <strong>Search Results</strong>
          <div className="small text-muted">Total: {total}</div>
        </div>
        <div>
          <small>Page {page} / {totalPages}</small>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive" style={{ maxHeight: "60vh" }}>
          <table className="table table-bordered table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th style={{ width: 50 }} className="text-center">#</th>
                {columnDefs.map(col => <th key={col.key}>{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columnDefs.length + 1} className="text-center py-4">Loading...</td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((row, i) => {
                  const rowId = row?.id ?? row?._id ?? `idx-${(page - 1) * limit + i}`;
                  return (
                    <tr key={`row-${rowId}`} onDoubleClick={() => onRowClick(row)} style={{ cursor: "pointer" }}>
                      <td className="text-center">{(page - 1) * limit + i + 1}</td>
                      {columnDefs.map(col => {
                        // ✅ UPDATED: Use helper function to get value
                        let v = getFieldValue(row, col);
                        if (typeof v === "object") v = JSON.stringify(v);
                        return <td key={`${col.key}-${rowId}`}>{v}</td>;
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columnDefs.length + 1} className="text-center py-4">No records</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="d-flex align-items-center gap-2">
            <label className="mb-0">Rows</label>
            <select
              className="form-select form-select-sm ms-2"
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              style={{ width: 90 }}
            >
              {[10,20,30,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</button>
            <nav aria-label="page navigation">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(1)}>1</button></li>
                {totalPages <= 7 ? (
                  Array.from({length: totalPages}).map((_, idx) => {
                    const pnum = idx + 1;
                    return <li key={pnum} className={`page-item ${page === pnum ? "active" : ""}`}><button className="page-link" onClick={() => setPage(pnum)}>{pnum}</button></li>;
                  })
                ) : (
                  <>
                    {page > 3 && <li className="page-item disabled"><span className="page-link">…</span></li>}
                    {Array.from({length: 5}).map((_, idx) => {
                      const start = Math.max(1, Math.min(totalPages - 4, page - 2));
                      const pnum = start + idx;
                      return <li key={pnum} className={`page-item ${page === pnum ? "active" : ""}`}><button className="page-link" onClick={() => setPage(pnum)}>{pnum}</button></li>;
                    })}
                    {page < totalPages - 2 && <li className="page-item disabled"><span className="page-link">…</span></li>}
                  </>
                )}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(totalPages)}>{totalPages}</button></li>
              </ul>
            </nav>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</button>
          </div>

          <div>
            <small>Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}</small>
          </div>
        </div>
      </div>
    </div>
  );
}