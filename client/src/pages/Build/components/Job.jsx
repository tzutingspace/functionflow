import styled from 'styled-components';
import JobTitle from './JobTitle';
import Tool from './Tool';

const BlockTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-top: 0;
`;

const BlockContent = styled.div`
  /* 選擇區域的樣式設定 */
  /* 可以根據需求調整選擇區域的樣式，例如背景色、邊框、內邊距等 */
`;

const Job = ({ idx, jobData, jobsData, setJobsData }) => {
  return (
    <>
      <BlockTitle>
        {idx ? <JobTitle jobData={jobData} setJobsData={setJobsData}></JobTitle> : <>Trigger</>}
      </BlockTitle>
      <BlockContent>
        <Tool idx={idx} jobData={jobData} jobsData={jobsData} setJobsData={setJobsData} />
      </BlockContent>
    </>
  );
};

export default Job;
