import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import API from '../../../utils/api';

const WorkflowTable = (searchText, setSearchText) => {
  const [workflowdata, setWorkflowdata] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const getworkflows = async () => {
      const { data } = await API.getWorkflowByUser();
      console.log(data);
      setWorkflowdata(data);
      setRecords(data);
    };
    getworkflows();
  }, []);

  const colums = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'STEPS',
      selector: (row) => row.job_number,
      sortable: true,
    },
    {
      name: 'STATUS',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'UPDATED',
      selector: (row) => row.updated_at,
      sortable: true,
    },
  ];

  const handleFilter = (event) => {
    const newData = workflowdata.filter((row) => {
      return row.name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  };

  return (
    <div>
      <div>
        {console.log(records)}
        <input type="text" onChange={handleFilter}></input>
      </div>
      {records && (
        <DataTable
          columns={colums}
          data={records}
          selectableRows
          fixedHeader
          pagination
        ></DataTable>
      )}
    </div>
  );
};

export default WorkflowTable;
