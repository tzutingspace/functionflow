import React, { useEffect, useState, useContext } from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Optional CSS

import { AuthContext } from '../../../contexts/authContext';
import API from '../../../utils/api';

const Wrapper = styled.div`
  flex: 1;
  background-color: #fff;
`;

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

const customStyles = {
  headRow: { style: { border: 'none' } },
  headCells: { style: { color: '#202124', fontSize: '14px' } },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: 'rgb(230, 244, 244)',
      borderBottomColor: '#FFFFFF',
      outline: '1px solid #FFFFFF',
    },
  },
  pagination: {
    style: {
      border: 'none',
    },
  },
};

const MainContent = () => {
  const [accountData, setAccountData] = useState([]); // 全部資訊
  const [records, setRecords] = useState([]); //顯示

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const { isLogin, jwtToken } = useContext(AuthContext);

  useEffect(() => {
    const getAccounts = async () => {
      const { data } = await API.getAppAccounts(jwtToken);
      console.log('userData axios回來的data', data);
      setAccountData(data);
      setRecords(data);
    };

    if (isLogin) {
      getAccounts();
    }
  }, [isLogin]);

  const columns = [
    {
      name: 'ACCOUNT',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'IDENTITY',
      selector: (row) => row.identity,
      sortable: true,
    },
    {
      name: 'SCOPE',
      selector: (row) => row.information,
      sortable: true,
    },
  ];

  return (
    <Wrapper>
      <HeadWrapper>
        <HeadTitle>Accounts</HeadTitle>
      </HeadWrapper>
      {records && (
        <DataTable
          title="Your Accounts"
          columns={columns}
          data={records}
          // selectableRows
          fixedHeader
          highlightOnHover
          clearSelectedRows={toggleCleared}
          customStyles={customStyles}
        ></DataTable>
      )}
    </Wrapper>
  );
};

export default MainContent;
