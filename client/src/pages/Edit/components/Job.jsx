import styled from 'styled-components/macro';
import JobTitle from './JobTitle';
import Tool from './Tool';

const JobTilteStyled = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 16px;
  display: flex;
  color: #20315b;
  align-items: center;
`;

const JobContent = styled.div`
  width: 90%;
  margin: auto;
  margin-top: 20px;
`;

const TriggerStyled = styled.div`
  /* margin-right: 1rem; */
  margin-left: 2rem;
  /* padding-left: 10px; */
  /* border: solid 1px red; */
`;

const Job = ({ idx, jobData }) => {
  return (
    <>
      <JobTilteStyled>
        {idx ? (
          <JobTitle jobData={jobData} idx={idx}></JobTitle>
        ) : (
          <TriggerStyled>Trigger</TriggerStyled>
        )}
      </JobTilteStyled>
      <JobContent>
        <Tool idx={idx} jobData={jobData} />
      </JobContent>
    </>
  );
};

export default Job;
