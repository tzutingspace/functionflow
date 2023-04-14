import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import Job from './Job';

const JobButton = styled.button``;

const Block = ({ jobData, setJobsData, idx }) => {
  function addWork(jobData) {
    const jobid = uuidv4();
    const newjob = { name: `Testing Job ${jobid}`, id: jobid };

    setJobsData((prev) => {
      const index = prev.findIndex((job) => job.id === jobData.id);
      if (index !== -1) {
        return [...prev.slice(0, index + 1), newjob, ...prev.slice(index + 1)];
      }
      return [...prev, newjob];
    });
  }

  function removeWork(jobData) {
    setJobsData((prevJobs) => prevJobs.filter((job) => job.id !== jobData.id));
  }

  return (
    <>
      <Job idx={idx} jobData={jobData} setJobsData={setJobsData} />
      {idx ? (
        <JobButton type="button" onClick={() => removeWork(jobData)}>
          Remove Job
        </JobButton>
      ) : (
        <></>
      )}
      <JobButton type="button" onClick={() => addWork(jobData)}>
        Add Job
      </JobButton>
    </>
  );
};

export default Block;
