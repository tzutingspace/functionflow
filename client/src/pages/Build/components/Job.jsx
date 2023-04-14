import { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../../../utils/api';
import { axiosGetData } from '../../../utils/api';

import Tool from './Tool';

const JobTitle = ({ jobData, setJobsData }) => {
  // 修改個別JOB名稱
  function changeJobName(e) {
    const inputValue = e.target.value;
    setJobsData((prev) => {
      const index = prev.findIndex((job) => job.id === jobData.id);
      if (index !== -1) {
        prev[index]['name'] = inputValue;
      }
      return [...prev];
    });
  }

  return (
    <>
      <label>Job Name: </label>
      <input type="text" placeholder={jobData.name} onChange={(e) => changeJobName(e)}></input>
    </>
  );
};

const Job = ({ idx, jobData, setJobsData }) => {
  return (
    <>
      <div>
        {idx ? <JobTitle jobData={jobData} setJobsData={setJobsData}></JobTitle> : <>Trigger</>}
      </div>
      <Tool idx={idx} jobData={jobData} setJobsData={setJobsData} />
    </>
  );
};

export default Job;
