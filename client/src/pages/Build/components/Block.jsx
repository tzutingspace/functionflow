import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import Job from './Job';

const JobButton = styled.button``;

const Block = ({ jobData, jobsData, setJobsData, idx }) => {
  // 新增Job的button
  function addJob() {
    // 建立新job object
    const jobid = uuidv4();
    const newjob = { name: `Testing Job ${jobid}`, uuid: jobid };

    // 重新Set workflow Chain
    setJobsData((prev) => {
      const index = prev.findIndex((job) => job.uuid === jobData.uuid);
      if (index !== -1) {
        return [...prev.slice(0, index + 1), newjob, ...prev.slice(index + 1)];
      }
      return [...prev, newjob];
    });
  }

  // 移除Job的button
  function removeJob() {
    setJobsData((prevJobs) => prevJobs.filter((job) => job.uuid !== jobData.uuid));
  }

  return (
    <>
      <Job idx={idx} jobData={jobData} jobsData={jobsData} setJobsData={setJobsData} />
      {idx ? (
        <JobButton type="button" onClick={() => removeJob()}>
          Remove Job
        </JobButton>
      ) : (
        <></>
      )}
      <JobButton type="button" onClick={() => addJob()}>
        Add Job
      </JobButton>
      <br />
      <br />
    </>
  );
};

export default Block;
