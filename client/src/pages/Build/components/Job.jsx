import styled from 'styled-components';
import JobTitle from './JobTitle';
import Tool from './Tool';

const JobTilteStyled = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 10px;
  display: flex;
  color: #20315b;
  align-items: center;
`;

const JobContent = styled.div``;

const Job = ({ idx, jobData, jobsData, setJobsData, workflowTitle }) => {
  return (
    <>
      <JobTilteStyled>
        {idx ? <JobTitle jobData={jobData} setJobsData={setJobsData}></JobTitle> : <>Trigger</>}
      </JobTilteStyled>
      <JobContent>
        <Tool
          idx={idx}
          jobData={jobData}
          jobsData={jobsData}
          setJobsData={setJobsData}
          workflowTitle={workflowTitle}
        />
      </JobContent>
    </>
  );
};

export default Job;
