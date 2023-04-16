import { useEffect, useState } from 'react';
import API from '../../../utils/api';
import styled from 'styled-components';

const HeadInput = styled.input``;

const Head = ({ jobsData, setJobsData, workflowTitle, setWorkflowTitle }) => {
  function changeHead(value) {
    // 更新上層 jobs Data
    setJobsData((prev) => {
      prev[0]['name'] = value;
      return [...prev];
    });
    // 更新 title
    setWorkflowTitle(value);
  }

  async function deployWorkflow() {
    console.log('開發中...deploy workflow', jobsData);

    const jobsInfotmp = jobsData.slice(1).reduce((acc, curr, index) => {
      acc[index + 1] = { ...curr['settingInfo']['jobsInfo'][index + 1] };
      return acc;
    }, {});

    const deployObj = {
      workflowInfo: {
        name: jobsData[0]['name'],
        status: 'active',
        start_time: jobsData[0]['settingInfo']['start_time'],
        function_id: jobsData[0]['settingInfo']['function_id'],
        trigger_api_route: jobsData[0]['settingInfo']['trigger_api_route'],
        job_number: jobsData.length - 1,
      },
      jobsInfo: { ...jobsInfotmp },
    };

    console.log('deploy', deployObj);
    const result = await API.deployWorkflow(jobsData[0]['id'], deployObj);
    console.log('結果', result);
  }

  return (
    <>
      <label>WorkFlow Name：</label>
      <HeadInput
        onChange={(e) => changeHead(e.target.value)}
        placeholder="請輸入WorkFlow 名稱"
        value={workflowTitle}
      ></HeadInput>
      <button type="button" onClick={() => deployWorkflow()}>
        Deploy
      </button>
      <br />
      <div>----------------------------------------------------</div>
    </>
  );
};

export default Head;
