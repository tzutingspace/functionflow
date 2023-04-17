import styled from 'styled-components';

const JobName = styled.input`
  width: 20%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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
      <label>Job Name: </label>
      <JobName type="text" placeholder={jobData.name} onChange={(e) => changeJobName(e)}></JobName>
    </>
  );
};

export default JobTitle;
