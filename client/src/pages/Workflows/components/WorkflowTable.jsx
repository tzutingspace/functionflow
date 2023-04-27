import React, { useEffect, useState, useMemo, useContext } from 'react';
import differenceBy from 'lodash/differenceBy';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Optional CSS

import { AuthContext } from '../../../contexts/authContext';
import API from '../../../utils/api';
import { formatDate } from '../../../utils/utils';

const HeadWrapper = styled.div`
  background-color: #dfd1aaa3;
  color: #20315b;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

const HeadTitle = styled.div`
  font-size: 36px;
  margin-right: auto;
  font-weight: bold;
`;

const HeadSearch = styled.input`
  width: 300px;
  padding-right: 50px;
  margin: 0px 4px;
  border: 2px solid #20315b;
  border-radius: 4px;
  padding: 8px 20px; /* 內邊距 */
`;

const AddWorkflow = styled(Link)`
  width: 100px;
  margin-left: 20px;
  margin-right: 20px; /* 右邊間距 */
  background-color: #20315b;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 13px 16px 10px 16px; /* 內邊距 */
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 8px; /* 圓弧造型 */
  text-align: center;
`;

const DeleteButton = styled.button`
  margin-left: 16px;
  padding: 8px 20px; /* 內邊距 */
  margin-right: 20px; /* 右邊間距 */
  background-color: #d61e2d;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 20px; /* 造型 */
`;

const customStyles = {
  headRow: { style: { border: 'none' } },
  headCells: { style: { color: '#202124', fontSize: '14px' } },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: 'rgb(230, 244, 244)',
      borderBottomColor: '#FFFFFF',
      borderRadius: '25px',
      outline: '1px solid #FFFFFF',
    },
  },
  pagination: {
    style: {
      border: 'none',
    },
  },
};

const WorkflowName = styled(Link)`
  color: #20315b;
  font-weight: bold;
  /* text-decoration: none;
  border-bottom: solid; */

  &:active {
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
`;

const WorkflowTable = () => {
  const [workflowdata, setWorkflowdata] = useState([]); // 全部資訊
  const [records, setRecords] = useState([]); //顯示

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const { user, isLogin, jwtToken } = useContext(AuthContext);

  useEffect(() => {
    const getworkflows = async () => {
      const userId = user.id;
      console.log('userId', userId);
      const { data } = await API.getWorkflowByUser(userId, jwtToken);
      console.log('axios回來的data', data);
      setWorkflowdata(data);
      setRecords(data);
    };
    if (isLogin) {
      getworkflows();
    }
    // getworkflows();
  }, [isLogin]);

  const colums = [
    {
      name: 'NAME',
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <WorkflowName to={`/instances/@${user.name}/${row.name}/${row.id}`}>
          {row.name}
        </WorkflowName>
      ),
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
      selector: (row) => formatDate(row.updated_at),
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
      confirmAlert({
        title: 'Confirm delete',
        message: `Are you sure you want to delete:\r ${selectedRows.map((r) => r.name)}?`,
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              setToggleCleared(!toggleCleared);
              setRecords(differenceBy(records, selectedRows, 'id'));
              console.log('被選擇的項目', selectedRows[0]);

              const deleteIds = selectedRows.map((workflow) => workflow.id);

              //FIXME: JWT token?? 應該可以從useContext拿
              const localJwtToken = localStorage.getItem('jwtToken');
              console.log('ids', deleteIds);
              await API.deleteWorkflows({ id: deleteIds }, localJwtToken);
            },
          },
          {
            label: 'No',
          },
        ],
      });
    };
    return (
      <DeleteButton key="delete" onClick={handleDelete}>
        Delete
      </DeleteButton>
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
        <AddWorkflow to="/edit">New+</AddWorkflow>
      </HeadWrapper>
      {records && (
        <DataTable
          title="Your Workflows"
          columns={colums}
          data={records}
          selectableRows
          fixedHeader
          pagination
          highlightOnHover
          contextActions={contextActions}
          onSelectedRowsChange={handleSelect}
          clearSelectedRows={toggleCleared}
          customStyles={customStyles}
        ></DataTable>
      )}
    </>
  );
};

export default WorkflowTable;
