import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import Job from './Job';
import { useRef } from 'react';

const JobButton = styled.button``;

const Block = ({ jobData, setJobsData, idx }) => {
  function addWork() {
    const jobid = uuidv4();
    const newjob = { name: `Testing Job ${jobid}`, id: jobid };

    setJobsData((prev) => {
      const index = prev.findIndex((job) => job.id === jobData.id);
      if (index !== -1) {
        // 重新Set Block Chain
        return [...prev.slice(0, index + 1), newjob, ...prev.slice(index + 1)];
      }
      return [...prev, newjob];
    });
  }

  function removeWork() {
    setJobsData((prevJobs) => prevJobs.filter((job) => job.id !== jobData.id));
  }

  return (
    <>
      <Job idx={idx} jobData={jobData} setJobsData={setJobsData} />
      {idx ? (
        <JobButton type="button" onClick={() => removeWork()}>
          Remove Job
        </JobButton>
      ) : (
        <></>
      )}
      <JobButton type="button" onClick={() => addWork()}>
        Add Job
      </JobButton>
    </>
  );
};

export default Block;
