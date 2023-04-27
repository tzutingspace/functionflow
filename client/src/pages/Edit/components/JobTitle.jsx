import { useContext } from 'react';
import { WorkflowStateContext } from '..';
import styled from 'styled-components';

const JobNameLabel = styled.div``;

const JobName = styled.input`
  width: 30%;
  height: 150%;
  padding: 8px;
  margin-left: 2px;
  border: 1px solid #20315b;
  border-radius: 4px;
  font-size: 18px;
  /* margin-bottom: 10px; */
`;

const JobTitle = ({ jobData }) => {
  const { setWorkflowJobs } = useContext(WorkflowStateContext);

  // 修改個別JOB名稱
  function changeJobName(e) {
    const inputValue = e.target.value;
    setWorkflowJobs((prev) => {
      const index = prev.findIndex((job) => job.job_id === jobData.job_id);
      if (index !== -1) {
        prev[index]['job_name'] = inputValue;
      }
      return [...prev];
    });
  }

  return (
    <>
      <JobNameLabel>Job Name: </JobNameLabel>
      <JobName
        type="text"
        placeholder={jobData.job_name}
        value={jobData.job_name}
        onChange={(e) => changeJobName(e)}
      ></JobName>
    </>
  );
};

export default JobTitle;
