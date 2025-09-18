import React, { Children, useState } from "react";
import { Table, Input, Popover, Whisper, Dropdown, Loader } from "rsuite";
import { FaFilter } from "react-icons/fa"; // Importing from react-icons

const { Column, HeaderCell, Cell } = Table;

// Sample Data
const initialData = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 28 },
    { id: 4, name: "David", age: 35 },
];

// Custom Header Cell with API Call Before Opening Popover
const ListFilterableHeaderCell = ({ children, ...props }) => {
    const [filterData, setFilterData] = useState([]); // API Data
    const [loading, setLoading] = useState(false); // Loading state
    const [open, setOpen] = useState(false); // Control popover visibility

    // Fetch Data from API before showing popover
    const fetchData = async () => {
        setLoading(true); // Show loader
        setOpen(false); // Close popover while loading

        try {
            // Simulating API call
            const response = await new Promise((resolve) =>
                setTimeout(() => resolve(["Option 1", "Option 2", "Option 3"]), 1000)
            );

            setFilterData(response);
            setOpen(true); // Open popover after data is loaded
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterSelect = (value) => {
        // onFilter(columnKey, value);
        setOpen(false); // Close popover after selection
    };

    // Popover Content
    const filterPopover = (
        <Popover>
            {loading ? (
                <Loader size="sm" content="Loading..." />
            ) : (
                <Dropdown.Menu>
                    {filterData.map((item, index) => (
                        <Dropdown.Item key={index} onSelect={() => handleFilterSelect(item)}>
                            {item}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            )}
        </Popover>
    );

    return (
        <HeaderCell
            {...props}
            style={{
                padding: 4,
                backgroundColor: "#3498ff",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>

            <span>{Children}</span>

            {/* Clickable Filter Icon */}
            <Whisper placement="bottomEnd" trigger="click" speaker={filterPopover} open={open} onClick={(e) => e.stopPropagation()}>
                <FaFilter
                    size={14} // Adjust icon size
                    style={{ cursor: "pointer", marginLeft: 8 }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent sorting on click
                        fetchData(); // Fetch API before showing popover
                    }}
                />
            </Whisper>
        </HeaderCell>
    );
};

export default ListFilterableHeaderCell;
