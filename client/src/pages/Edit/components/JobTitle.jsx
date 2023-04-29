import { useContext } from 'react';
import { WorkflowStateContext } from '..';
import styled from 'styled-components';

//https://www.csscodelab.com/google-like-css-input-box-placeholder-shown/
const JobTileWrapper = styled.label`
  position: relative;
  /* margin-right: 1rem; */
  width: 85%;
  /* max-width: 600px; */
  border-radius: 6px;
  overflow: hidden;
`;

const JobNameLabel = styled.span`
  position: absolute;
  top: 15px;
  left: 10px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  transform-origin: 0 0;
  transform: translate3d(0, 0, 0);
  transition: all 0.2s ease;
  pointer-events: none;
`;

const JobName = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  border: 0;
  font-family: inherit;
  padding: 16px 12px 0 20px;
  height: 48px;
  font-size: 32px;
  font-weight: 900;
  background: #f3ecda; //rgba(0, 0, 0, 0.02);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  color: #20315b;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.5);
  }

  &:not(:placeholder-shown) + span {
    color: rgba(0, 0, 0, 0.5);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }

  &:focus {
    background: rgba(0, 0, 0, 0.05);
    outline: none;
    box-shadow: inset 0 -2px 0 #20315b;
    + span {
      color: #20315b;
      transform: translate3d(0, -12px, 0) scale(0.75);
      + span {
        transform: scaleX(1);
        transition: all 0.1s ease;
      }
    }
  }
`;

const FocusBackground = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  z-index: -1;
  transform: scaleX(0);
  transform-origin: left;
  transition: all 0.1s ease;
`;

function replaceNonAlphabeticCharacters(inputString) {
  const nonAlphabeticCharacters = /[^a-zA-Z0-9]/g;
  return inputString.replace(nonAlphabeticCharacters, '_');
}

const JobTitle = ({ jobData, idx }) => {
  const { setWorkflowJobs, setIsAllJobSave } = useContext(WorkflowStateContext);

  // 修改個別JOB名稱
  function changeJobName(e) {
    const inputValue = replaceNonAlphabeticCharacters(e.target.value);
    setWorkflowJobs((prev) => {
      const index = prev.findIndex((job) => job.id === jobData.id);
      if (index !== -1) {
        prev[index]['job_name'] = inputValue;
      }
      return [...prev];
    });
    setIsAllJobSave((prev) => {
      prev[idx] = false;
      return [...prev];
    });
  }

  return (
    <JobTileWrapper style={{ backgroundColor: jobData.job_name === '' ? '#e95353' : '#f3ecda' }}>
      <JobName
        style={
          ({ backgroundColor: jobData.job_name === '' ? '#e95353' : '#f3ecda' },
          { color: jobData.job_name.includes('untitled') ? 'grey' : '#20315b' })
        }
        type="text"
        value={jobData.job_name}
        onChange={(e) => changeJobName(e)}
      ></JobName>
      <JobNameLabel>
        {jobData.job_name === ''
          ? 'Please enter the job name!!!'
          : 'Job Name (Only accepts English letters, numbers, and underscores.)'}
      </JobNameLabel>
      <FocusBackground />
    </JobTileWrapper>
  );
};

export default JobTitle;
