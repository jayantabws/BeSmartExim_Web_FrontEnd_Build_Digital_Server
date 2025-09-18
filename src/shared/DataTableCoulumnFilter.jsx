import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

const DataTableCoulumnFilter = ({ data }) => {
    const [filterText, setFilterText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(data); // Set initial data when component mounts or data changes
    }, [data]);

    const handleSearch = () => {
        const lowercasedFilter = filterText.toLowerCase();
        const filtered = data.filter(item =>
            item.column_name?.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredData(filtered);
    };

    const columns = [
        {
            name: 'Title',
            selector: row => row.column_name,
        },
        {
            name: 'Total Records',
            selector: row => row.records_count,
        },
    ];

    return (
        <div className='row'>
            <div className='col-12 mb-3 d-flex justify-content-start'>
                <div className="input-group w-50">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Title"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>
            <div className='col-12'>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                />
            </div>
        </div>
    );
};

export default DataTableCoulumnFilter;
