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

const JobTitle = ({ jobData, setJobsData }) => {
  // 修改個別JOB名稱
  function changeJobName(e) {
    const inputValue = e.target.value;
    setJobsData((prev) => {
      const index = prev.findIndex((job) => job.uuid === jobData.uuid);
      if (index !== -1) {
        prev[index]['name'] = inputValue;
      }
      return [...prev];
    });
  }

  return (
    <>
      <JobNameLabel>Job Name: </JobNameLabel>
      <JobName type="text" placeholder={jobData.name} onChange={(e) => changeJobName(e)}></JobName>
    </>
  );
};

export default JobTitle;
