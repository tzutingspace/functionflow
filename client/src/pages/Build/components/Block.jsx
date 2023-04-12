import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JobHead from './JobHead';
import Job from './Job';

const Block = ({ jobData, jobsData, setJobsData }) => {
  useEffect(() => {
    console.log('hello');
  });

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
      <JobHead jobData={jobData} />
      <Job />
      <button type="button" onClick={() => removeWork(jobData)}>
        Remove Job
      </button>
      <button
        type="button"
        onClick={() => {
          addWork(jobData);
        }}
      >
        Add Job
      </button>
    </div>
  );
};

export default Block;
