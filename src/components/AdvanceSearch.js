import React, { useState, useRef, useCallback, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { MultiSelect } from "react-multi-select-component";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const AdvanceSearch = (props) => {



  useEffect(() => {
    // Update fields when either payload or modal open state changes
    if (props.apiSerachpayload) {
      
      setRangeQuantityStart(props.apiSerachpayload.rangeQuantityStart ?? props.apiSerachpayload.rangeQuantityStart ?? "");
      setRangeQuantityEnd(props.apiSerachpayload.rangeQuantityEnd ?? props.apiSerachpayload.rangeQuantityEnd ?? "");
      setRangeValueUsdStart(props.apiSerachpayload.rangeValueUsdStart ?? props.apiSerachpayload.rangeValueUsdStart ?? "");
      setRangeValueUsdEnd(props.apiSerachpayload.rangeValueUsdEnd ?? props.apiSerachpayload.rangeValueUsdEnd ?? "");
      setrangeUnitPriceUsdStart(props.apiSerachpayload.rangeUnitPriceUsdStart ?? props.apiSerachpayload.rangeUnitPriceUsdStart ?? "");
      setRangeUnitPriceUsdEnd(props.apiSerachpayload.rangeUnitPriceUsdEnd ?? props.apiSerachpayload.rangeUnitPriceUsdEnd ?? "");

      // setRangeQuantityStart(props.apiSerachpayload.rangeQuantityStart || "");
      // setRangeQuantityEnd(props.apiSerachpayload.rangeQuantityEnd || "");
      // setRangeValueUsdStart(props.apiSerachpayload.rangeValueUsdStart || "");
      // setRangeValueUsdEnd(props.apiSerachpayload.rangeValueUsdEnd || "");
      // setrangeUnitPriceUsdStart(props.apiSerachpayload.rangeUnitPriceUsdStart || "");
      // setRangeUnitPriceUsdEnd(props.apiSerachpayload.rangeUnitPriceUsdEnd || "");

      setConsumptionType(props.apiSerachpayload.consumptionType ??  props.apiSerachpayload.consumptionType ?? []);
      setSelectedConsumptionType(
        (props.apiSerachpayload.consumptionType ??  props.apiSerachpayload.consumptionType ?? []).map(item => ({ label: item, value: item }))
      );

      setIncoterm(props.apiSerachpayload.incoterm ?? props.apiSerachpayload.incoterm ?? []);
      setSelectedIncotermList(
        (props.apiSerachpayload.incoterm ?? props.apiSerachpayload.incoterm ?? []).map(item => ({ label: item, value: item }))
      );

      setNotifyParty(props.apiSerachpayload.notifyParty ?? props.apiSerachpayload.notifyParty ?? []);
      setSelectedNotifyPartyList(
        (props.apiSerachpayload.notifyParty ?? props.apiSerachpayload.notifyParty ?? []).map(item => ({ label: item, value: item }))
      );
     
      setConditionProductDesc(props.apiSerachpayload.conditionProductDesc || "C");

      /* setProductDesc(props.apiSerachpayload.productDesc || []);
       setDescriptionSelectList(
         (props.apiSerachpayload.productDesc || []).map(item => ({ label: item, value: item }))
       );  */

    /*    if (props.apiSerachpayload.productDesc && Array.isArray(props.apiSerachpayload.productDesc)) {
      const selectList = props.apiSerachpayload.productDesc.map(item => ({ label: item, value: item }));
      setDescriptionSelectList(selectList);
      setProductDesc(props.apiSerachpayload.productDesc); // keep your array of strings as well
    }  else if(props.apiSerachpayload.productDesc && Array.isArray(props.apiSerachpayload.productDesc)){
       const selectList = props.apiSerachpayload.productDesc.map(item => ({ label: item, value: item }));
      setDescriptionSelectList(selectList);
      setProductDesc(props.apiSerachpayload.productDesc); // keep your array of strings as well
    }else{
      setDescriptionSelectList([]);
      setProductDesc([]);
    }  */

      // const descList = props.apiSerachpayload.productDesc ?? props.apiSerachpayload.productDesc ?? [];
      // setProductDesc(descList);
      // setDescriptionSelectList(
      //   descList.map(item => ({ label: item, value: item }))
      // );  
    }
  }, [props.apiSerachpayload, props.show]); // Add props.show here

  const reduxApiSerachpayload = useSelector(state => state.data?.apiSerachpayload);
  const apiSerachpayload = props.apiSerachpayload || reduxApiSerachpayload || {};


  const [portOriginList, setPortOriginList] = useState([]);
  const [selectedPol, setSelectedPol] = useState([]);
  const [portDestinationList, setPortDestinationList] = useState([]);
  const [selectedPdl, setSelectedPdl] = useState([]);
  const [hsCodeList, setHsCodeList] = useState([]);
  const [selectedHsCode, setSelectedHsCode] = useState([]);
  const [importerList, setImporterList] = useState([]);
  const [selectedImporter, setSelectedImporter] = useState([]);
  const [exporterList, setExporterList] = useState([]);
  const [selectedExporter, setSelectedExporter] = useState([]);
  const [cityOriginList, setCityOriginList] = useState([]);
  const [selectedCityOrigin, setSelectedCityOrigin] = useState([]);
  const [cityDestinationList, setCityDestinationList] = useState([]);
  const [selectedCityDestination, setSelectedCityDestination] = useState([]);
  const [hsCode4DigitList, setHsCode4digitList] = useState([]);
  const [selectedHsCode4Disgit, setSelectedHsCode4Digit] = useState([]);
  const [shipmentModeList, setShipmentModeList] = useState([]);
  const [selectedShipmentMode, setSelectedShipmentMode] = useState([]);
  const [stdUnitList, setStdUnitList] = useState([]);
  const [selectedStdUnit, setSelectedStdUnit] = useState([]);
  const [rangeQuantityStart, setRangeQuantityStart] = useState('');
  const [rangeQuantityEnd, setRangeQuantityEnd] = useState('');
  const [rangeValueUsdStart, setRangeValueUsdStart] = useState('');
  const [rangeValueUsdEnd, setRangeValueUsdEnd] = useState('');
  const [rangeUnitPriceUsdStart, setrangeUnitPriceUsdStart] = useState('');
  const [rangeUnitPriceUsdEnd, setRangeUnitPriceUsdEnd] = useState('');
  const [consumptionType, setConsumptionType] = useState([]);
  const [selectedConsumptionType, setSelectedConsumptionType] = useState([]);

  const [incoterm, setIncoterm] = useState([]);
  const [selectedIncotermList, setSelectedIncotermList] = useState([]);

  const [notifyParty, setNotifyParty] = useState([]);
  const [selectedNotifyPartyList, setSelectedNotifyPartyList] = useState([]);
  const [productDesc, setProductDesc] = useState([]);
  const [conditionProductDesc, setConditionProductDesc] = useState("C");

  const handleSubmit = () => {

console.log("Advance search Hit === ");

    // --- Handle minQ and maxQ (quantity range) @sarbojitghosh22 2-8-2025 --- //

    let minQ = "";
    let maxQ = "";

    let minV = "";
    let maxV = "";

    let minU = "";
    let maxU = "";

    if (!rangeQuantityStart && !rangeQuantityEnd) {
      minQ = "";
      maxQ = "";
    } else if (!rangeQuantityStart && rangeQuantityEnd) {
      minQ = "0.00001";
      maxQ = rangeQuantityEnd;
    } else if (rangeQuantityStart && !rangeQuantityEnd) {
      minQ = rangeQuantityStart;
      maxQ = "999999";
    } else {
      minQ = rangeQuantityStart;
      maxQ = rangeQuantityEnd;
    }

    // Handle minV and maxV (value range)
    if (!rangeValueUsdStart && !rangeValueUsdEnd) {
      minV = "";
      maxV = "";
    } else if (!rangeValueUsdStart && rangeValueUsdEnd) {
      minV = "0.00001";
      maxV = rangeValueUsdEnd;
    } else if (rangeValueUsdStart && !rangeValueUsdEnd) {
      minV = rangeValueUsdStart;
      maxV = "999999";
    } else {
      minV = rangeValueUsdStart;
      maxV = rangeValueUsdEnd;
    }

    // Handle minU and maxU (unit price range)
    if (!rangeUnitPriceUsdStart && !rangeUnitPriceUsdEnd) {
      minU = "";
      maxU = "";
    } else if (!rangeUnitPriceUsdStart && rangeUnitPriceUsdEnd) {
      minU = "0.00001";
      maxU = rangeUnitPriceUsdEnd;
    } else if (rangeUnitPriceUsdStart && !rangeUnitPriceUsdEnd) {
      minU = rangeUnitPriceUsdStart;
      maxU = "99999999";
    } else {
      minU = rangeUnitPriceUsdStart;
      maxU = rangeUnitPriceUsdEnd;
    }

    // --- Handle minQ and maxQ (quantity range) @sarbojitghosh22 2-8-2025 --- //


    const data = {
      portOriginList,
      portDestinationList,
      hsCodeList,
      importerList,
      exporterList,
      cityOriginList,
      cityDestinationList,
      hsCode4DigitList,
      shipmentModeList,
      stdUnitList,
      // rangeQuantityStart,
      // rangeQuantityEnd,
      // rangeValueUsdStart,
      // rangeValueUsdEnd,
      // rangeUnitPriceUsdStart,
      // rangeUnitPriceUsdEnd,
      rangeQuantityStart: minQ,
      rangeQuantityEnd: maxQ,
      rangeValueUsdStart: minV,
      rangeValueUsdEnd: maxV,
      rangeUnitPriceUsdStart: minU,
      rangeUnitPriceUsdEnd: maxU,
      consumptionType,
      incoterm,
      notifyParty,
      conditionProductDesc,
      productDesc,
      returnSearchId: props.searchId,
    };

    // // At least one of the min/max fields must have a positive value (> 0)
    // const minMaxFields = [
    //   Number(rangeQuantityStart),
    //   Number(rangeQuantityEnd),
    //   Number(rangeValueUsdStart),
    //   Number(rangeValueUsdEnd),
    //   Number(rangeUnitPriceUsdStart),
    //   Number(rangeUnitPriceUsdEnd)
    // ];
    // // const hasPositiveInput = minMaxFields.some(val => val > 0);
    // const hasPositiveInput = minMaxFields.every(val => val > 0);

    // if (!hasPositiveInput) {
    //   Swal.fire({
    //     title: 'Validation Error',
    //     text: 'Please enter at least one positive value for Quantity, Value, or Unit Price (min or max).',
    //     icon: 'warning',
    //     confirmButtonColor: '#3085d6',
    //   });
    //   return;
    // }

    // Validation for min and max values @sarbojitghosh22 11-6-2025 //
    if (
      !validateMinMaxOnSubmit(rangeQuantityStart, rangeQuantityEnd, 'Quantity') ||
      !validateMinMaxOnSubmit(rangeValueUsdStart, rangeValueUsdEnd, 'Value') ||
      !validateMinMaxOnSubmit(rangeUnitPriceUsdStart, rangeUnitPriceUsdEnd, 'Unit Price')
    ) {
      return; // Stop submission if validation fails
    }
    // Validation for min and max values @sarbojitghosh22 11-6-2025 //



    if (portOriginList.length == 0 && portDestinationList.length == 0 && hsCodeList.length == 0 && importerList.length == 0
      && exporterList.length == 0 && cityOriginList.length == 0 && cityDestinationList.length == 0 && hsCode4DigitList.length == 0
      && shipmentModeList.length == 0 && stdUnitList.length == 0 && rangeQuantityStart == "" && rangeQuantityEnd == "" && rangeValueUsdStart == "" && rangeValueUsdEnd == ""
      && rangeUnitPriceUsdStart == "" && rangeUnitPriceUsdEnd == "" && consumptionType.length == 0 && incoterm.length == 0 && notifyParty.length == 0
      && productDesc.length == 0) {

      Swal.fire({
        title: 'Select !',
        text: 'Select atleast one filter or reset filter',
        icon: 'error',
        dangerMode: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
    }
    else {
      console.log("Advance search Data === ", data);
      props.updateFilter(data);
    }

  }

  // const validateMinMaxOnSubmit = (rangeValueUsdStart, rangeValueUsdEnd, type) => {
  //   if (rangeValueUsdStart && !rangeValueUsdEnd) {
  //     Swal.fire({
  //       title: 'Validation Error',
  //       text: `Please enter Maximum ${type}.`,
  //       icon: 'warning',
  //       confirmButtonColor: '#3085d6',
  //     });
  //     return false;
  //   }
  //   if (rangeValueUsdEnd && !rangeValueUsdStart) {
  //     Swal.fire({
  //       title: 'Validation Error',
  //       text: `Please enter Minimum ${type}.`,
  //       icon: 'warning',
  //       confirmButtonColor: '#3085d6',
  //     });
  //     return false;
  //   }
  //   return true;
  // };

  const validateMinMaxOnSubmit1 = (rangeValueUsdStart, rangeValueUsdEnd, type) => {
    if (rangeValueUsdStart && !rangeValueUsdEnd) {
      Swal.fire({
        title: 'Validation Error',
        text: `Please enter Maximum ${type}.`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }
    if (rangeValueUsdEnd && !rangeValueUsdStart) {
      Swal.fire({
        title: 'Validation Error',
        text: `Please enter Minimum ${type}.`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }
    if (rangeValueUsdStart && rangeValueUsdEnd) {
      if (Number(rangeValueUsdEnd) < Number(rangeValueUsdStart)) {
        Swal.fire({
          title: 'Validation Error',
          text: `Maximum ${type} must be greater than or equal to Minimum ${type}.`,
          icon: 'warning',
          confirmButtonColor: '#3085d6',
        });
        return false;
      }
    }
    return true;
  };

  //  --- min and max value logic change @sarbojitghosh22 15-7-2025 --- //

  const validateMinMaxOnSubmit = (rangeValueUsdStart, rangeValueUsdEnd, type) => {
    let min = rangeValueUsdStart;
    let max = rangeValueUsdEnd;

    // If only min is provided, set max to a very large number
    if (min && !max) {
      max = "9999999999";
    }
    // If only max is provided, set min to a very small positive number
    if (max && !min) {
      min = "0.0000000001";
    }

    // If both are provided, check that max >= min
    if (min && max) {
      if (Number(max) < Number(min)) {
        Swal.fire({
          title: 'Validation Error',
          text: `Maximum ${type} must be greater than or equal to Minimum ${type}.`,
          icon: 'warning',
          confirmButtonColor: '#3085d6',
        });
        return false;
      }
    }
    return true;
  };

  //  --- min and max value logic change @sarbojitghosh22 15-7-2025 --- //


  const resetAdvaceFilter = () => {
    const data = {
      portOriginList: [],
      portDestinationList: [],
      hsCodeList: [],
      importerList: [],
      exporterList: [],
      cityOriginList: [],
      cityDestinationList: [],
      hsCode4DigitList: [],
      shipmentModeList: [],
      stdUnitList: [],
      rangeQuantityStart: "",
      rangeQuantityEnd: "",
      rangeValueUsdStart: "",
      rangeValueUsdEnd: "",
      rangeUnitPriceUsdStart: "",
      rangeUnitPriceUsdEnd: "",
      consumptionType: [],
      incoterm: [],
      notifyParty: [],
      productDesc: [],
      returnSearchId: props.searchId
    };
    // props.updateFilter(data);

    props.resetFilter(data);

  }

  useEffect(() => {

    updatePOL();
    UpdatePDL();
    updateHSCodes();
    update4digitHSCodes();
    updateImporters();
    updateExporters();
    updateCityList();
    updateCountryList();
    updateShipmentMode();
    updateUnits();
    updateConsumptionType();
    updateIncoterm();
    updateNotifyPartyList();
    updateMinMaxValues();           // <-- add this
    updateProductDescription();     // <-- add this
  }, [])

  let defaultPOL = () => {
    let pol = [{
      label: "",
      value: ""
    }]
    props.portOriginList.forEach(item => {
      pol.push({ value: item, label: item });
    });

    return pol;
  }

  const updatePOL = () => {
    let pol = [],
      selectedItem = [];

    props.portOriginList.forEach(item => {
      pol.push(item);
      selectedItem.push({ value: item, label: item });
    });

    setPortOriginList(pol);
    setSelectedPol(selectedItem);
  }

  let defaultPDL = () => {
    let pdl = []
    props.portDestinationList.forEach(item => {
      pdl.push({ value: item, label: item });
    });
    return pdl;
  }

  const UpdatePDL = () => {
    let pdl = [],
      selectedItem = [];
    props.portDestinationList.forEach(item => {
      pdl.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setPortDestinationList(pdl);
    setSelectedPdl(selectedItem);
  }

  let defaultHSCodes = () => {
    let hsCodes = []
    props.hsCodeList.forEach(item => {
      hsCodes.push({ value: item, label: item });
    });
    return hsCodes;
  }

  const updateHSCodes = () => {
    let hsCodes = [],
      selectedItem = [];
    props.hsCodeList.forEach(item => {
      hsCodes.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setHsCodeList(hsCodes);
    setSelectedHsCode(selectedItem);
  }

  let default4digitHSCodes = () => {
    let hsCodes4Digits = []
    props.hsCode4DigitList.forEach(item => {
      hsCodes4Digits.push({ value: item, label: item });
    });
    return hsCodes4Digits;
  }

  const update4digitHSCodes = () => {
    let hsCodes4Digits = [],
      selectedItem = [];
    props.hsCode4DigitList.forEach(item => {
      hsCodes4Digits.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setHsCode4digitList(hsCodes4Digits);
    setSelectedHsCode4Digit(selectedItem);
  }

  let defaultImporters = () => {
    let importers = []
    props.importerList.forEach(item => {
      importers.push({ value: item, label: item });
    });
    return importers;
  }

  const updateImporters = () => {
    let importers = [],
      selectedItem = [];
    props.importerList.forEach(item => {
      importers.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setImporterList(importers);
    setSelectedImporter(selectedItem);
  }

  let defaultExporters = () => {
    let exporters = []
    props.exporterList.forEach(item => {
      exporters.push({ value: item, label: item });
    });
    return exporters;
  }

  const updateExporters = () => {
    let exporters = [],
      selectedItem = [];
    props.exporterList.forEach(item => {
      exporters.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setExporterList(exporters);
    setSelectedExporter(selectedItem);
  }

  let defaultCityList = () => {
    let cityList = []
    props.cityOriginList.forEach(item => {
      cityList.push({ value: item, label: item });
    });
    return cityList;
  }

  const updateCityList = () => {
    let cityList = [],
      selectedItem = [];
    props.cityOriginList.forEach(item => {
      cityList.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setCityOriginList(cityList);
    setSelectedCityOrigin(selectedItem);
  }


  let defaultCountryList = () => {
    let CityDestinationList = []
    props.cityDestinationList.forEach(item => {
      CityDestinationList.push({ value: item, label: item });
    });
    return CityDestinationList;
  }

  const updateCountryList = () => {
    let CityDestinationList = [],
      selectedItem = [];
    props.cityDestinationList.forEach(item => {
      CityDestinationList.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setCityDestinationList(CityDestinationList);
    setSelectedCityDestination(selectedItem);
  }

  let defaultShipmentMode = () => {
    let ShipmentModeLst = []
    props.shipmentModeList.forEach(item => {
      ShipmentModeLst.push({ value: item, label: item });
    });
    return ShipmentModeLst;
  }

  const updateShipmentMode = () => {
    let ShipmentModeLst = [],
      selectedItem = [];
    props.shipmentModeList.forEach(item => {
      ShipmentModeLst.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setShipmentModeList(ShipmentModeLst);
    setSelectedShipmentMode(selectedItem);
  }

  let defaultUnits = () => {
    let StdUnitList = []
    props.stdUnitList.forEach(item => {
      StdUnitList.push({ value: item, label: item });
    });
    return StdUnitList;
  }

  const updateUnits = () => {
    let StdUnitList = [],
      selectedItem = [];
    props.stdUnitList.forEach(item => {
      StdUnitList.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setStdUnitList(StdUnitList);
    setSelectedStdUnit(selectedItem);
  }

  // const handleMinQuantityChange = (e) => {
  //   const value = e.target.value;
  //   if (/^\d*\.?\d*$/.test(value)) {
  //     setRangeQuantityStart(value);
  //   }
  // };

  // const handleMaxQuantityChange = (e) => {
  //   const value = e.target.value;
  //   if (/^\d*\.?\d*$/.test(value)) {
  //     setRangeQuantityEnd(value);
  //   }
  // };

  /* validation added for min and max quantity value @sarbojitghosh22 11-6-2025 */

  const validateMinMax = (rangeValueUsdStart, rangeValueUsdEnd, type) => {
    if (rangeValueUsdStart && !rangeValueUsdEnd) {
      Swal.fire({
        title: 'Validation Error',
        text: `Please enter Maximum ${type}.`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }
    if (rangeValueUsdEnd && !rangeValueUsdStart) {
      Swal.fire({
        title: 'Validation Error',
        text: `Please enter Minimum ${type}.`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }
    return true;
  };

  const handleMinChange = (e, type, setMin, rangeValueUsdEnd) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setMin(value);
      validateMinMax(value, rangeValueUsdEnd, type);
    }
  };

  const handleMaxChange = (e, type, setMax, rangeValueUsdStart) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setMax(value);
      validateMinMax(rangeValueUsdStart, value, type);
    }
  };

  /* validation added for min and max quantity value @sarbojitghosh22 11-6-2025 */

  const updateConsumptionType = () => {
    let mainList = [],
      selectedItem = [];
    props.consumptionType.forEach(item => {
      mainList.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setConsumptionType(mainList);
    setSelectedConsumptionType(selectedItem);
  }

  const updateIncoterm = () => {

    let mainList = [],
      selectedItem = [];
    props.incoterm.forEach(item => {
      mainList.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setIncoterm(mainList);
    setSelectedIncotermList(selectedItem);
  }

  const updateNotifyPartyList = () => {
    let mainList = [],
      selectedItem = [];
    props.notifyParty.forEach(item => {
      mainList.push(item);
      selectedItem.push({ value: item, label: item });
    });
    setNotifyParty(mainList);
    setSelectedNotifyPartyList(selectedItem);
  }

  const handleMinValueChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setRangeValueUsdStart(value);
    }
  };

  const handleMaxValueChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setRangeValueUsdEnd(value);
    }
  };

  const handleMinUnitPriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setrangeUnitPriceUsdStart(value);
    }
  };

  const handleMaxUnitPriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setRangeUnitPriceUsdEnd(value);
    }
  };

  const handleChangeData = (selectedValues) => {
  };

  const customSingleValue = ({ data }) => (
    <div>
      <input type="checkbox" checked readOnly /> {data.label}
    </div>
  );

  // -- advance search value show issue @sarbojitghosh22 25-6-2025 -- //

  const [descriptionSelectList, setDescriptionSelectList] = useState([]);

 
  const updateMinMaxValues = () => {


    setRangeQuantityStart(props.apiSerachpayload.rangeQuantityStart ?? props.apiSerachpayload.rangeQuantityStart ?? "");
    setRangeQuantityEnd(props.apiSerachpayload.rangeQuantityEnd ?? props.apiSerachpayload.rangeQuantityEnd ?? "");
    setRangeValueUsdStart(props.apiSerachpayload.rangeValueUsdStart ?? props.apiSerachpayload.rangeValueUsdStart ?? "");
    setRangeValueUsdEnd(props.apiSerachpayload.rangeValueUsdEnd ?? props.apiSerachpayload.rangeValueUsdEnd ?? "");
    setrangeUnitPriceUsdStart(props.apiSerachpayload.rangeUnitPriceUsdStart ?? props.apiSerachpayload.rangeUnitPriceUsdStart ?? "");
    setRangeUnitPriceUsdEnd(props.apiSerachpayload.rangeUnitPriceUsdEnd ?? props.apiSerachpayload.rangeUnitPriceUsdEnd ?? "");


    setConsumptionType(props.apiSerachpayload.consumptionType ??  props.apiSerachpayload.consumptionType ?? []);
      setSelectedConsumptionType(
        (props.apiSerachpayload.consumptionType ??  props.apiSerachpayload.consumptionType ?? []).map(item => ({ label: item, value: item }))
      );

      setIncoterm(props.apiSerachpayload.incoterm ?? props.apiSerachpayload.incoterm ?? []);
      setSelectedIncotermList(
        (props.apiSerachpayload.incoterm ?? props.apiSerachpayload.incoterm ?? []).map(item => ({ label: item, value: item }))
      );

       setNotifyParty(props.apiSerachpayload.notifyParty ?? props.apiSerachpayload.notifyParty ?? []);
      setSelectedNotifyPartyList(
        (props.apiSerachpayload.notifyParty ?? props.apiSerachpayload.notifyParty ?? []).map(item => ({ label: item, value: item }))
      );


    setConditionProductDesc(props.apiSerachpayload.conditionProductDesc || "C");


   /* const descList = props.apiSerachpayload.productDesc ?? props.apiSerachpayload.productDesc ?? [];
    setProductDesc(descList);
    setDescriptionSelectList(
      descList.map(item => ({ label: item, value: item }))
    );
 */

     /* if (props.apiSerachpayload.productDesc && Array.isArray(props.apiSerachpayload.productDesc)) {
      const selectList = props.apiSerachpayload.productDesc.map(item => ({ label: item, value: item }));
      setDescriptionSelectList(selectList);
      setProductDesc(props.apiSerachpayload.productDesc); // keep your array of strings as well
    }  else if(props.apiSerachpayload.productDesc && Array.isArray(props.apiSerachpayload.productDesc)){
       const selectList = props.apiSerachpayload.productDesc.map(item => ({ label: item, value: item }));
      setDescriptionSelectList(selectList);
      setProductDesc(props.apiSerachpayload.productDesc); // keep your array of strings as well
    }else{
      setDescriptionSelectList([]);
      setProductDesc([]);
    } */


    // setRangeQuantityStart(apiSerachpayload.rangeQuantityStart || "");
    // setRangeQuantityEnd(apiSerachpayload.rangeQuantityEnd || "");
    // setRangeValueUsdStart(apiSerachpayload.rangeValueUsdStart || "");
    // setRangeValueUsdEnd(apiSerachpayload.rangeValueUsdEnd || "");
    // setrangeUnitPriceUsdStart(apiSerachpayload.rangeUnitPriceUsdStart || "");
    // setRangeUnitPriceUsdEnd(apiSerachpayload.rangeUnitPriceUsdEnd || "");

    // if(apiSerachpayload.rangeQuantityStart) {
    //     setRangeQuantityStart(apiSerachpayload.rangeQuantityStart);
    //   }else if(apiSerachpayload.rangeQuantityStart) {
    //      setRangeQuantityStart(apiSerachpayload.rangeQuantityStart);
    //   }else{
    //     setRangeQuantityStart("");
    //   }



  };

  const updateProductDescription = () => {
    setConditionProductDesc(props.apiSerachpayload.conditionProductDesc || "C");
    // For CreatableSelect
   /* if (props.apiSerachpayload.productDesc && Array.isArray(props.apiSerachpayload.productDesc)) {
      const selectList = props.apiSerachpayload.productDesc.map(item => ({ label: item, value: item }));
      setDescriptionSelectList(selectList);
      setProductDesc(props.apiSerachpayload.productDesc); // keep your array of strings as well
    } else {
      setDescriptionSelectList([]);
      setProductDesc([]);
    }*/

    if (props.apiSerachpayload.productDesc && Array.isArray(props.apiSerachpayload.productDesc)) {
      const selectList = props.apiSerachpayload.productDesc.map(item => ({ label: item, value: item }));
      setDescriptionSelectList(selectList);
      setProductDesc(props.apiSerachpayload.productDesc); // keep your array of strings as well
    }  else if(props.apiSerachpayload.productDesc && Array.isArray(props.apiSerachpayload.productDesc)){
       const selectList = props.apiSerachpayload.productDesc.map(item => ({ label: item, value: item }));
      setDescriptionSelectList(selectList);
      setProductDesc(props.apiSerachpayload.productDesc); // keep your array of strings as well
    }else{
      setDescriptionSelectList([]);
      setProductDesc([]);
    }
  };

  // // Update updateProductDescription to use apiSerachpayload from above
  // const updateProductDescription = () => {
  //   setConditionProductDesc(apiSerachpayload.conditionProductDesc || "C");
  //   if (apiSerachpayload.productDesc && Array.isArray(apiSerachpayload.productDesc)) {
  //     const selectList = apiSerachpayload.productDesc.map(item => ({ label: item, value: item }));
  //     setDescriptionSelectList(selectList);
  //     setProductDesc(apiSerachpayload.productDesc);
  //   } else {
  //     setDescriptionSelectList([]);
  //     setProductDesc([]);
  //   }
  // };

  // -- advance search value show issue @sarbojitghosh22 25-6-2025 -- //

  return (
    <div className="advance-search">
      <button className="btn btn-link cl-butt" onClick={() => props.toggleFromChild(false)}><i className="icon ion-md-close-circle-outline font-size-24"></i></button>
      <form className="hero__form v3 filter listing-filter">
        <h4>Advance Search</h4>
        {props.countryDestinationList.length > 0 || props.countryOriginList.length > 0 ||
          props.importerDataList.length > 0 || props.exporterDataList.length > 0 ||
          props.hsCodeDataList.length > 0 || props.hsCode4digitDataList.length > 0 ||
          props.portDestinationDataList.length > 0 || props.portOriginDataList.length > 0 ||
          props.shipmentModeDataList.length > 0 || props.stdUnitDataList.length > 0 ?

             <div className="row ad-mid mb-3">
            {props.type === "IMPORT" && props.portDestinationDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Port Of Origin</label>
                  {/* <Select
                    defaultValue={defaultPOL}
                    isMulti
                    name="colors"
                    options={props.type === "IMPORT" ? props.portDestinationDataList : props.portOriginDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setPortOriginList(itemList);

                      }}
                    classNamePrefix="select"
                    closeMenuOnSelect={false}
                    components={{ SingleValue: customSingleValue }}
                  /> */}
                  <MultiSelect
                    options={props.type === "IMPORT" ? props.portDestinationDataList : props.portOriginDataList}
                    value={selectedPol}
                    onChange={(selectedOption) => {
                      setSelectedPol(selectedOption)
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setPortOriginList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}
            {props.type === "EXPORT" && props.portOriginDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Port Of Origin</label>
                  {/* <Select
                    defaultValue={defaultPOL}
                    isMulti
                    name="colors"
                    options={props.type === "IMPORT" ? props.portDestinationDataList : props.portOriginDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setPortOriginList(itemList);

                      }}
                    classNamePrefix="select"
                    components={{ SingleValue: customSingleValue }}
                  /> */}
                  <MultiSelect
                    options={props.type === "IMPORT" ? props.portDestinationDataList : props.portOriginDataList}
                    value={selectedPol}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      setSelectedPol(selectedOption)
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setPortOriginList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}
            {props.type === "IMPORT" && props.portOriginDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Port Of Destination</label>
                  {/* <Select
                    defaultValue={defaultPDL}
                    isMulti
                    name="destinationPort"
                    options={props.type === "IMPORT" ? props.portOriginDataList : props.portDestinationDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    lassNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setPortDestinationList(itemList);

                      }}
                  /> */}
                  <MultiSelect
                    options={props.type === "IMPORT" ? props.portOriginDataList : props.portDestinationDataList}
                    value={selectedPdl}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      setSelectedPdl(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setPortDestinationList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}
            {props.type === "EXPORT" && props.portDestinationDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Port Of Destination</label>
                  {/* <Select
                    defaultValue={defaultPDL}
                    isMulti
                    name="destinationPort"
                    options={props.type === "IMPORT" ? props.portOriginDataList : props.portDestinationDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    lassNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setPortDestinationList(itemList);

                      }}
                  /> */}
                  <MultiSelect
                    options={props.type === "IMPORT" ? props.portOriginDataList : props.portDestinationDataList}
                    value={selectedPdl}
                    onChange={(selectedOption) => {
                      setSelectedPdl(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setPortDestinationList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {props.hsCode4digitDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>HSCodes 4digit </label>
                  {/* <Select
                    defaultValue={default4digitHSCodes}
                    isMulti
                    name="hsCode4Digitlist"
                    options={props.hsCode4digitDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setHsCode4digitList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.hsCode4digitDataList}
                    value={selectedHsCode4Disgit}
                    onChange={(selectedOption) => {
                      setSelectedHsCode4Digit(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setHsCode4digitList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}
            {props.hsCodeDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>HSCodes</label>
                  {/* <Select
                    defaultValue={defaultHSCodes}
                    isMulti
                    name="hsCodelist"
                    options={props.hsCodeDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setHsCodeList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.hsCodeDataList}
                    value={selectedHsCode}
                    onChange={(selectedOption) => {
                      setSelectedHsCode(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setHsCodeList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {/* {props.importerDataList.length > 0 && (props.type == "EXPORT" && props.importerForExport == "Y") || props.type == "IMPORT" ? */}
            {props.importerDataList.length > 0 ?

              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Importer</label>
                  {/* <Select
                    defaultValue={defaultImporters}
                    isMulti
                    name="importer"
                    options={props.importerDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setImporterList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.importerDataList}
                    value={selectedImporter}
                    onChange={(selectedOption) => {
                      setSelectedImporter(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setImporterList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {/* {props.type==="EXPORT" && props.importerDataList.length > 0 && props.countryCode != "USA" ?
                <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                  <div className="dropdown bootstrap-select hero__form-input">
                    <label>Importer</label>
                    <Select
                        defaultValue={defaultImporters}
                        isMulti
                        name="importer"
                        options={props.importerDataList}
                        className="dropdown bootstrap-select hero__form-input"
                        classNamePrefix="select"
                        onChange={(selectedOption) => {
                          let itemList = [];
                          selectedOption.forEach((item)=>{
                            itemList.push(item.value);
                          });
                          setImporterList(itemList);
                        }}
                    />
                  </div>
                </div> : null } */}

            {/* {props.exporterDataList.length > 0 && (props.type == "IMPORT" && props.exporterForImport == "Y") || props.type == "EXPORT" ? */}
            {props.exporterDataList.length > 0 ?

              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Exporter</label>
                  {/* <Select
                    defaultValue={defaultExporters}
                    isMulti
                    name="exporter"
                    options={props.exporterDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setExporterList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.exporterDataList}
                    value={selectedExporter}
                    onChange={(selectedOption) => {
                      setSelectedExporter(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setExporterList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {props.type === "IMPORT" && props.countryOriginList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>{props.type === "IMPORT" ? "Country Of Origin" : "City Of Origin"}</label>
                  {/* <Select
                    defaultValue={defaultCityList}
                    isMulti
                    name="cityOfOrigin"
                    options={props.type === "IMPORT" ? props.countryOriginList : props.countryDestinationList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setCityOriginList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.type === "IMPORT" ? props.countryOriginList : props.countryDestinationList}
                    value={selectedCityOrigin}
                    onChange={(selectedOption) => {
                      setSelectedCityOrigin(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setCityOriginList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}
            {props.type === "EXPORT" && props.countryCode != "USA" && props.countryDestinationList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>{props.type === "IMPORT" ? "Country Of Origin" : "City Of Origin"}</label>
                  {/* <Select
                    defaultValue={defaultCityList}
                    isMulti
                    name="cityOfOrigin"
                    options={props.type === "IMPORT" ? props.countryOriginList : props.countryDestinationList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setCityOriginList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.type === "IMPORT" ? props.countryOriginList : props.countryDestinationList}
                    value={selectedCityOrigin}
                    onChange={(selectedOption) => {
                      setSelectedCityOrigin(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setCityOriginList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {props.type === "IMPORT" && props.countryDestinationList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>{(props.countryCode === "IND" || props.countryCode === "SEZ") ? "City Of Destination" : "Country Of Destination"}</label>
                  {/* <Select
                    defaultValue={defaultCountryList}
                    isMulti
                    name="countryOfOrigin"
                    options={props.type === "IMPORT" ? props.countryDestinationList : props.countryOriginList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setCityDestinationList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.type === "IMPORT" ? props.countryDestinationList : props.countryOriginList}
                    value={selectedCityDestination}
                    onChange={(selectedOption) => {
                      setSelectedCityDestination(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setCityDestinationList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}
            {props.type === "EXPORT" && props.countryOriginList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>{props.type === "IMPORT" ? "City Of Destination" : "Country Of Destination"}</label>
                  {/* <Select
                    defaultValue={defaultCountryList}
                    isMulti
                    name="countryOfOrigin"
                    options={props.type === "IMPORT" ? props.countryDestinationList : props.countryOriginList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setCityDestinationList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.type === "IMPORT" ? props.countryDestinationList : props.countryOriginList}
                    value={selectedCityDestination}
                    onChange={(selectedOption) => {
                      setSelectedCityDestination(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setCityDestinationList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {props.shipmentModeDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Shipment Mode</label>
                  {/* <Select
                    defaultValue={defaultShipmentMode}
                    isMulti
                    name="shippingMode"
                    options={props.shipmentModeDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });

                      setShipmentModeList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.shipmentModeDataList}
                    value={selectedShipmentMode}
                    onChange={(selectedOption) => {
                      setSelectedShipmentMode(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setShipmentModeList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {props.stdUnitDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Units</label>
                  {/* <Select
                    defaultValue={defaultUnits}
                    isMulti
                    name="stdUnitList"
                    options={props.stdUnitDataList}
                    className="dropdown bootstrap-select hero__form-input"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setStdUnitList(itemList);
                    }}
                  /> */}
                  <MultiSelect
                    options={props.stdUnitDataList}
                    value={selectedStdUnit}
                    onChange={(selectedOption) => {
                      setSelectedStdUnit(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setStdUnitList(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {/* <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Minimum Quantity</label>
                <input
                  type="text"
                  className="form-control"
                  id="rangeQuantityStart"
                  value={rangeQuantityStart}
                  onChange={handleMinQuantityChange}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Maximum Quantity</label>
                <input
                  type="text"
                  className="form-control"
                  id="rangeQuantityEnd"
                  value={rangeQuantityEnd}
                  onChange={handleMaxQuantityChange}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Minimum Value (in USD)</label>
                <input
                  type="text"
                  className="form-control"
                  id="rangeValueUsdStart"
                  value={rangeValueUsdStart}
                  onChange={handleMinValueChange}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Maximum Value (in USD)</label>
                <input
                  type="text"
                  className="form-control"
                  id="rangeValueUsdEnd"
                  value={rangeValueUsdEnd}
                  onChange={handleMaxValueChange}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Minimum Unit price (in USD)</label>
                <input
                  type="text"
                  className="form-control"
                  id="rangeUnitPriceUsdStart"
                  value={rangeUnitPriceUsdStart}
                  onChange={handleMinUnitPriceChange}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Maximum Unit price (in USD)</label>
                <input
                  type="text"
                  className="form-control"
                  id="rangeUnitPriceUsdEnd"
                  value={rangeUnitPriceUsdEnd}
                  onChange={handleMaxUnitPriceChange}
                />
              </div>
            </div> */}

        
            {/* validation for min and max value @sarbojitghosh22 11-6-2025 */}

            {props.consumptionTypeDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Consumption Type</label>
                  <MultiSelect
                    options={props.consumptionTypeDataList}
                    value={selectedConsumptionType}
                    onChange={(selectedOption) => {
                      setSelectedConsumptionType(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setConsumptionType(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            {props.incotermDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Incoterm</label>
                  <MultiSelect
                    options={props.incotermDataList}
                    value={selectedIncotermList}
                    onChange={(selectedOption) => {
                      setSelectedIncotermList(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setIncoterm(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}

            <div className='col-lg-12 col-md-4 col-sm-6 mb-3'>
              <div className='hero__form-input'>
                <label for="description_drop" className="form-label">Product description</label>
                <select
                  className="form-control"
                  aria-label="Default select example"
                  id="description_drop"
                  value={conditionProductDesc}
                  onChange={(e) => {
                    setConditionProductDesc(e.target.value);
                  }}
                >
                  <option value="C">Contains</option>
                  <option value="D">Does Not Contains</option>
                </select>
              </div>
            </div>

              <div className='col-lg-12 col-md-4 col-sm-6 mb-3'>
              <div className="input-search" >
                {/* <CreatableSelect
                  isMulti
                  options={[]}
                  onChange={(selectedOption) => {
                    let itemList = [];
                    selectedOption.forEach((item) => {
                      itemList.push(item.value);
                    });
                    setProductDesc(itemList);
                  }}
                /> */}
                {/* advance search value show issue @sarbojitghosh22 25-6-2025  */}
                <CreatableSelect
                  isMulti
                  options={[]}
                  value={descriptionSelectList}
                  onChange={(selectedOption) => {
                    let itemList = [];
                    if (selectedOption) {
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setDescriptionSelectList(selectedOption);
                    } else {
                      setDescriptionSelectList([]);
                    }
                    setProductDesc(itemList);
                  }}
                />
                {/* advance search value show issue @sarbojitghosh22 25-6-2025 */}

              </div>
            </div>

            {props.notifyPartyDataList.length > 0 ?
              <div className="col-lg-12 col-md-4 col-sm-6 mb-3">
                <div className="dropdown bootstrap-select hero__form-input">
                  <label>Notify Party</label>
                  <MultiSelect
                    options={props.notifyPartyDataList}
                    value={selectedNotifyPartyList}
                    onChange={(selectedOption) => {
                      setSelectedNotifyPartyList(selectedOption);
                      let itemList = [];
                      selectedOption.forEach((item) => {
                        itemList.push(item.value);
                      });
                      setNotifyParty(itemList);
                    }}
                    labelledBy="Select"
                  />
                </div>
              </div> : null}



               {/* validation for min and max value @sarbojitghosh22 11-6-2025 */}
            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Minimum Quantity</label>
                {/* <input
                  type="text"
                  className="form-control"
                  id="rangeQuantityStart"
                  value={rangeQuantityStart}
                  onChange={(e) => setRangeQuantityStart(e.target.value)}
                /> */}
                <input
                  type="text"
                  className="form-control"
                  id="rangeQuantityStart"
                  value={rangeQuantityStart}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only positive integers >= 1
                    if (/^(|[1-9]\d*)$/.test(value)) {
                      setRangeQuantityStart(value);
                    }
                  }}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Maximum Quantity</label>
                {/* <input
                  type="text"
                  className="form-control"
                  id="rangeQuantityEnd"
                  value={rangeQuantityEnd}
                  onChange={(e) => setRangeQuantityEnd(e.target.value)}
                /> */}
                <input
                  type="text"
                  className="form-control"
                  id="rangeQuantityEnd"
                  value={rangeQuantityEnd}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only positive integers >= 1
                    if (/^(|[1-9]\d*)$/.test(value)) {
                      setRangeQuantityEnd(value);
                    }
                  }}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Minimum Value (in USD)</label>
                {/* <input
                  type="text"
                  className="form-control"
                  id="rangeValueUsdStart"
                  value={rangeValueUsdStart}
                  onChange={(e) => setRangeValueUsdStart(e.target.value)}
                /> */}
                <input
                  type="text"
                  className="form-control"
                  id="rangeValueUsdStart"
                  value={rangeValueUsdStart}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only positive integers >= 1
                    if (/^(|[1-9]\d*)$/.test(value)) {
                      setRangeValueUsdStart(value);
                    }
                  }}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Maximum Value (in USD)</label>
                {/* <input
                  type="text"
                  className="form-control"
                  id="rangeValueUsdEnd"
                  value={rangeValueUsdEnd}
                  onChange={(e) => setRangeValueUsdEnd(e.target.value)}
                /> */}
                <input
                  type="text"
                  className="form-control"
                  id="rangeValueUsdEnd"
                  value={rangeValueUsdEnd}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only positive integers >= 1
                    if (/^(|[1-9]\d*)$/.test(value)) {
                      setRangeValueUsdEnd(value);
                    }
                  }}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Minimum Unit price (in USD)</label>
                {/* <input
                  type="text"
                  className="form-control"
                  id="rangeUnitPriceUsdStart"
                  value={rangeUnitPriceUsdStart}
                  onChange={(e) => setrangeUnitPriceUsdStart(e.target.value)}
                /> */}
                <input
                  type="text"
                  className="form-control"
                  id="rangeUnitPriceUsdStart"
                  value={rangeUnitPriceUsdStart}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only positive integers >= 1
                    if (/^(|[1-9]\d*)$/.test(value)) {
                      setrangeUnitPriceUsdStart(value);
                    }
                  }}
                />
              </div>
            </div>

            <div className='col-6 mb-3'>
              <div className='hero__form-input'>
                <label>Maximum Unit price (in USD)</label>
                {/* <input
                  type="text"
                  className="form-control"
                  id="rangeUnitPriceUsdEnd"
                  value={rangeUnitPriceUsdEnd}
                  onChange={(e) => setRangeUnitPriceUsdEnd(e.target.value)}
                /> */}
                <input
                  type="text"
                  className="form-control"
                  id="rangeUnitPriceUsdEnd"
                  value={rangeUnitPriceUsdEnd}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only positive integers >= 1
                    if (/^(|[1-9]\d*)$/.test(value)) {
                      setRangeUnitPriceUsdEnd(value);
                    }
                  }}
                />
              </div>
            </div>

          

           
          

          </div>
          :
          <div>No Matching Records Found. Please Reset ...</div>}
        <div className="row">
          <div className="col-sm-12">
            <button className="btn btn-warning" type="reset" onClick={() => { resetAdvaceFilter() }}>Reset</button> &nbsp;
            {props.countryDestinationList.length > 0 || props.countryOriginList.length > 0 ||
              props.importerDataList.length > 0 || props.exporterDataList.length > 0 ||
              props.hsCodeDataList.length > 0 || props.hsCode4digitDataList.length > 0 ||
              props.portDestinationDataList.length > 0 || props.portOriginDataList.length > 0 ?
              <button className="btn btn-primary" type="button" onClick={() => { handleSubmit() }}>Search</button> : null}
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdvanceSearch;