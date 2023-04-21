import styled from 'styled-components';
import JobTitle from './JobTitle';
import Tool from './Tool';

const JobTilteStyled = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-top: 0;
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
