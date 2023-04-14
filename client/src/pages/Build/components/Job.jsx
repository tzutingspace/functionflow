import { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../../../utils/api';
import { axiosGetData } from '../../../utils/api';

import Tool from './Tool';

const JobTitle = ({ jobData, setJobsData }) => {
  function changeJobName(e) {
    setJobsData((prev) => {
      const index = prev.findIndex((job) => job.id === jobData.id);
      if (index !== -1) {
        prev[index]['name'] = e.target.value;
      }
      console.log('改變job title', prev);
      return [...prev];
    });
  }

  return (
    <>
      <label>Job Name: </label>
      <input
        type="text"
        placeholder={jobData.name}
        onChange={(e) => changeJobName(e, jobData, setJobsData)}
      ></input>
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
