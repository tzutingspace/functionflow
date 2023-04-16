import { useEffect, useState } from 'react';
import API from '../../../utils/api';
import styled from 'styled-components';

const HeadInput = styled.input``;

const Head = ({ jobsData, setJobsData, workflowTitle, setWorkflowTitle }) => {
  function changeHead(value) {
    setJobsData((prev) => {
      prev[0]['name'] = value;
      return [...prev];
    });
    setWorkflowTitle(value);
  }

  return (
    <>
      <label>WorkFlow Name：</label>
      <HeadInput
        onChange={(e) => changeHead(e.target.value)}
        placeholder="請輸入WorkFlow 名稱"
        value={workflowTitle}
      ></HeadInput>
      <button type="button">Deploy</button>
      <br />
      <div>----------------------------------------------------</div>
    </>
  );
};

export default Head;
