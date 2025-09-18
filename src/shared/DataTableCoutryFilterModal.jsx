import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";

const options = [
    { label: "INDIA (50)", value: "ind" },
    { label: "AUSTRALIA (30)", value: "aus" },
    { label: "JAPAN (40)", value: "jpn" },
];

const DataTableCoutryFilterModal = ({ show, filterCountryList, handleClose }) => {
    const [selected, setSelected] = useState([]);
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Filter Countries</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12">
                        <div>
                            <label>Select Countries</label>
                            <MultiSelect
                                options={filterCountryList}
                                value={selected}
                                onChange={setSelected}
                                labelledBy="Select"
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Apply
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DataTableCoutryFilterModal;
