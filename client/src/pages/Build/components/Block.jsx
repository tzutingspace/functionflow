import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import Job from './Job';

const Wrapper = styled.div`
  position: relative;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f8f8;
  margin-bottom: 16px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f8f8f8;
  color: #007bff;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 16px;
  cursor: pointer;
`;

const AddTaskButtonArea = styled.div`
  position: relative;
  margin-top: 16px;
  margin-bottom: 16px;
  overflow: visible; /* 允許超出容器 */
`;
const AddButton = styled.button`
  background-color: #grey;
  color: #007bff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px; /* 超出容器一點點 */
  z-index: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Divider = styled.div`
  height: 2px;
  width: 1px;
  background-color: #ccc;
  padding: 1px;
`;

const Button = styled.button`
  height: 3rem;
  width: 3rem;
  background-color: #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
`;

const SvgIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  fill: #fff;
`;

const ButtonDivider = styled.div`
  height: 2px;
  width: 1px;
  background-color: #ccc;
  padding: 1px;
`;

const Block = ({ jobData, jobsData, setJobsData, idx }) => {
  // 新增Job的button
  function addJob() {
    // 建立新job object
    const jobid = uuidv4();
    const newjob = { name: `Default ${jobid.substring(0, 8)}`, uuid: jobid };

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
    <Wrapper>
      {idx ? (
        <DeleteButton type="button" onClick={() => removeJob()}>
          Remove Job
        </DeleteButton>
      ) : (
        <></>
      )}
      <Job idx={idx} jobData={jobData} jobsData={jobsData} setJobsData={setJobsData} />
      <AddTaskButtonArea></AddTaskButtonArea>
      <AddButton type="button" onClick={() => addJob()}>
        Add Job
      </AddButton>
      <AddTaskButtonArea></AddTaskButtonArea>
    </Wrapper>
  );
};

export default Block;
