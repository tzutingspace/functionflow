import { v4 as uuidv4 } from 'uuid';
import { useContext, useRef } from 'react';
import styled from 'styled-components';

import { WorkflowStateContext } from '..';

import Job from './Job';

import plus from './plus.png';

const Wrapper = styled.div`
  position: relative;
  border: 2.5px solid #20315b;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f8f8;
  max-width: 65%;
  margin-left: auto;
  margin-right: auto;
`;

const DeleteButton = styled.button`
  display: block;
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  background-color: rgb(232, 108, 108);
  color: #20315b;
  border: none;
  border-radius: 20px;
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
  font-weight: 600;
  /* text-align: center; */
`;

const ButtonArea = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-width: 0;
  height: 50px;
  width: auto;
  border-style: solid;
  border-color: transparent;
  position: relative;
`;

const Emptydiv = styled.div`
  box-sizing: border-box;
  display: block;
  height: 60px;
  padding-left: 1px;
  padding-right: 1px;
  width: 3px;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  background-color: #20315b;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  line-height: 1.5;
  font-size: 0.875rem;
`;

const AddButtonNew = styled.button`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  height: 32px;
  justify-content: center;
  margin: 0px;
  padding: 0px;
  top: 10px;
  position: absolute;
  width: 32px;
  background-image: url(${plus});
  background-size: contain;
  background-repeat: no-repeat;
  background-color: white;
  border-color: transparent;
  border: 0px;
  z-index: 1;
  cursor: pointer;
  bottom: -20px; /* 超出容器一點點 */
`;

const Block = ({ jobData, idx }) => {
  const { setWorkflowJobs, setIsAllJobSave } = useContext(WorkflowStateContext);
  const jobBlockRef = useRef(null);

  // 新增Job的button
  function addJob() {
    // 建立新job object
    const uuid = uuidv4();
    const newjob = { job_name: `untitled_${uuid.substring(0, 8)}`, id: uuid }; //本次新加的用uuid

    // 重新Set workflow Chain
    setWorkflowJobs((prev) => {
      const index = prev.findIndex((job) => job.id === jobData.id);
      if (index !== -1) {
        return [...prev.slice(0, index + 1), newjob, ...prev.slice(index + 1)];
      }
      return [...prev, newjob];
    });

    // 重新Set save job 狀況紀錄
    setIsAllJobSave((prev) => {
      const index = prev.findIndex((job) => job.id === jobData.id);
      if (index !== -1) {
        return [...prev.slice(0, index + 1), false, ...prev.slice(index + 1)];
      }
      return [...prev, false];
    });

    setTimeout(() => {
      if (jobBlockRef.current) {
        window.scrollTo({
          top: jobBlockRef.current.offsetTop + 250,
          behavior: 'smooth',
        });
      }
    }, 100);
  }

  // 移除Job的button
  function removeJob() {
    setWorkflowJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobData.id));
    setIsAllJobSave((prevJobs) => prevJobs.filter((job, index) => index !== idx));
  }

  return (
    <>
      <Wrapper ref={jobBlockRef}>
        {idx ? (
          <DeleteButton type="button" onClick={() => removeJob()}>
            Remove
          </DeleteButton>
        ) : (
          <></>
        )}
        <Job
          idx={idx}
          jobData={jobData}
          // workflowTitle={workflowTitle}
        />
      </Wrapper>
      <ButtonArea>
        <Emptydiv></Emptydiv>
        <AddButtonNew type="button" onClick={() => addJob()}></AddButtonNew>
      </ButtonArea>
    </>
  );
};

export default Block;
