import { v4 as uuidv4 } from 'uuid';
import { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { IoTrashOutline } from 'react-icons/io5';
import { WorkflowStateContext } from '..';

import Job from './Job';

const TriggerDiv = styled.div`
  position: relative;
  border: 12px solid #20315b;
  border-radius: 10px 10px 0 0;
  margin-left: auto;
  margin-right: auto;
  left: -18px;
  bottom: 1.1rem;
  z-index: 1;
  width: calc(100% + 13px);
  padding-bottom: 0;
`;

const Wrapper = styled.div`
  position: relative;
  border: 2.5px solid #20315b;
  border-radius: 8px;
  padding: 16px;
  background-color: whitesmoke;
  max-width: 65%;
  margin-left: auto;
  margin-right: auto;
`;

const DeleteButtonDiv = styled.div`
  display: block;
  position: absolute; /* 加入絕對定位 */
  top: 170px;
  right: 24px;
  padding: 15px;
  background-color: #dfd1aa;
  cursor: pointer;
  border: none;
  border-radius: 36px;
  width: 30px;
  height: 30px;
`;

const DeleteButton = styled(IoTrashOutline)`
  color: #20315b;
  cursor: pointer;
  border: none;
  width: 30px;
  height: 30px;
`;

const ButtonArea = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-width: 0;
  height: 60px;
  width: auto;
  border-style: solid;
  border-color: transparent;
  position: relative;
`;

const EmptyDiv = styled.div`
  box-sizing: border-box;
  display: block;
  height: 60px;
  padding-left: 1px;
  padding-right: 1px;
  width: 3px;
  margin: 0 0 0 0 ;
  background-color: #20315b;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  line-height: 1.5;
  font-size: 0.875rem;
`;

const AddButtonNew = styled(AiOutlinePlusCircle)`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  height: 40px;
  justify-content: center;
  margin: 0;
  padding: 0;
  top: 10px;
  position: absolute;
  width: 40px;
  color: #20315b;
  background-color: white;
  border: 0 transparent;
  z-index: 1;
  cursor: pointer;
  &:hover {
    width: 50px;
    height: 50px;
  }
`;

const Block = ({ jobData, idx }) => {
  const { setWorkflowJobs, setIsAllJobSave } = useContext(WorkflowStateContext);
  const { joyrideState, setJoyrideState } = useContext(WorkflowStateContext);
  const jobBlockRef = useRef(null);

  // 新增Job的button
  function addJob() {
    // 建立新job object
    const uuid = uuidv4();
    const newJob = { job_name: `untitled_${uuid.substring(0, 8)}`, id: uuid }; //本次新加的用uuid

    // 重新Set workflow Chain
    setWorkflowJobs((prev) => {
      const index = prev.findIndex((job) => job.id === jobData.id);
      if (index !== -1) {
        return [...prev.slice(0, index + 1), newJob, ...prev.slice(index + 1)];
      }
      return [...prev, newJob];
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

    if (joyrideState.stepIndex === 4) {
      setJoyrideState({
        ...joyrideState,
        run: true,
        stepIndex: 5,
      });
    }
  }

  // 移除Job的button
  function removeJob() {
    setWorkflowJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobData.id));
    setIsAllJobSave((prevJobs) => prevJobs.filter((job, index) => index !== idx));
  }

  return (
    <>
      <Wrapper ref={jobBlockRef}>
        {idx === 0 ? <TriggerDiv></TriggerDiv> : <></>}
        {idx ? (
          <DeleteButtonDiv onClick={() => removeJob()}>
            <DeleteButton type="button"></DeleteButton>
          </DeleteButtonDiv>
        ) : (
          <></>
        )}
        <Job idx={idx} jobData={jobData} />
      </Wrapper>
      <ButtonArea id={`add-job-button-${idx}`}>
        <EmptyDiv></EmptyDiv>
        <AddButtonNew type="button" onClick={() => addJob()}></AddButtonNew>
      </ButtonArea>
    </>
  );
};

export default Block;
