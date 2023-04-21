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
  display: block;
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  background-color: rgb(232, 108, 108);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const AddTaskButtonArea = styled.div`
  position: relative;
  margin-top: 16px;
  margin-bottom: 16px;
  overflow: visible; /* 允許超出容器 */
`;
const AddButton = styled.button`
  background-color: #0c0c0c;
  color: #ffffff;
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

// JobData 是當前Block的資料
// JobsData 是整個workflow的資料

const Block = ({ workflowTitle, jobData, jobsData, setJobsData, idx }) => {
  // 新增Job的button
  function addJob() {
    // 建立新job object
    const uuid = uuidv4();
    const newjob = { name: `untitled_${uuid.substring(0, 8)}`, uuid: uuid };

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
      <Job
        idx={idx}
        jobData={jobData}
        jobsData={jobsData}
        setJobsData={setJobsData}
        workflowTitle={workflowTitle}
      />
      <AddTaskButtonArea></AddTaskButtonArea>
      <AddButton type="button" onClick={() => addJob()}>
        Add Job
      </AddButton>
      <AddTaskButtonArea></AddTaskButtonArea>
    </Wrapper>
  );
};

export default Block;
