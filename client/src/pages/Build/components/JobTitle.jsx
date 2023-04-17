import styled from 'styled-components';

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
      <input type="text" placeholder={jobData.name} onChange={(e) => changeJobName(e)}></input>
    </>
  );
};

export default JobTitle;
