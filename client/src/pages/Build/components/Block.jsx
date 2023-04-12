import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Job from './Job';

const Block = ({ jobData, jobsData, setJobsData, idx }) => {
  function addWork(jobData) {
    console.log('addwork', jobData);
    const jobid = uuidv4();
    const newjob = { name: `Testing Job ${jobid}`, id: jobid };
    setJobsData((prev) => {
      // const prevJobs = [...prev];
      // prevJobs.splice(jobData, 0, newjob);
      return [...prev, newjob];
    });
  }

  function removeWork(jobData) {
    console.log('removeWork', jobData);
    setJobsData((prevJobs) => prevJobs.filter((job) => job.id !== jobData.id));
  }

  return (
    <div>
      {/* <JobHead jobData={jobData} /> */}
      <Job idx={idx} jobData={jobData} />
      {idx ? (
        <button type="button" onClick={() => removeWork(jobData)}>
          Remove Job
        </button>
      ) : (
        <></>
      )}

      <button
        type="button"
        onClick={() => {
          addWork(jobData);
        }}
      >
        Add Job
      </button>
      <div></div>
    </div>
  );
};

export default Block;
