import React, { useEffect, useState, useMemo } from 'react';
import differenceBy from 'lodash/differenceBy';
import DataTable from 'react-data-table-component';
import API from '../../../utils/api';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeadWrapper = styled.div`
  background-color: #333;
  color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

const HeadTitle = styled.div`
  font-weight: bold;
  font-size: larger;
  margin-right: auto;
`;

const HeadSearch = styled.input`
  width: 300px;
  padding-right: 50px;
  margin: 0px 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const AddWorkflow = styled.button`
  width: 100px;
  color: #000000;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const WorkflowTable = () => {
  ``;
  const [workflowdata, setWorkflowdata] = useState([]); // 全部資訊
  const [records, setRecords] = useState([]); //顯示

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  useEffect(() => {
    const getworkflows = async () => {
      const { data } = await API.getWorkflowByUser();
      console.log('axios回來的data', data);
      setWorkflowdata(data);
      setRecords(data);
    };
    getworkflows();
  }, []);

  const colums = [
    {
      name: 'NAME',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'STEPS',
      selector: (row) => row.job_qty,
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
      return (
        row.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.status.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setRecords(newData);
  };

  const handleSelect = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    console.log('Selected Rows: ', selectedRows);
  };

  // reference:https://react-data-table-component.netlify.app/?path=/docs/selectable-manage-selections--manage-selections
  const contextActions = useMemo(() => {
    const handleDelete = async () => {
      if (
        window.confirm(`Are you sure you want to delete:\r ${selectedRows.map((r) => r.name)}?`)
      ) {
        setToggleCleared(!toggleCleared);
        setRecords(differenceBy(records, selectedRows, 'id'));
        console.log('被選擇的項目', selectedRows[0]);

        const deleteIds = selectedRows.map((workflow) => workflow.id);

        //FIXME: JWT token?? 應該可以從useContext拿
        const localJwtToken = localStorage.getItem('jwtToken');
        console.log('ids', deleteIds);
        await API.deleteWorkflows({ id: deleteIds }, localJwtToken);
      }
    };
    return (
      <button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon>
        Delete
      </button>
    );
  }, [records, selectedRows, toggleCleared]);

  return (
    <>
      <HeadWrapper>
        <HeadTitle>Workflows</HeadTitle>
        <HeadSearch
          placeholder="I am a search bar."
          type="text"
          onChange={handleFilter}
        ></HeadSearch>
        <AddWorkflow>
          <Link to="/createworkflow">New +</Link>
        </AddWorkflow>
      </HeadWrapper>
      {records && (
        <DataTable
          title="Wokflows"
          columns={colums}
          data={records}
          selectableRows
          fixedHeader
          pagination
          contextActions={contextActions}
          onSelectedRowsChange={handleSelect}
          clearSelectedRows={toggleCleared}
        ></DataTable>
      )}
    </>
  );
};

export default WorkflowTable;
