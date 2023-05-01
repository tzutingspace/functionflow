import { useState, useEffect, useContext } from 'react';

import styled from 'styled-components/macro';

import API from '../../../utils/api';
import JobConfig from './JobConfig';
import { TfiSave } from 'react-icons/tfi';

import { WorkflowStateContext } from '..';

const ToolButton = styled.button`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.5rem;
  /* border-radius: 0.25rem; */
  border-radius: 10px;
  background-color: #f3ecda;
  line-height: 1rem;
  max-height: 60px;
  width: 90%;
  margin-left: 2rem;
  margin-bottom: 6px;
  border: 0px;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  width: 100%;
  padding: 2px 2px; /* 內邊距 */
`;

const TextWrapper = styled.div`
  flex-grow: 1;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: left;
  margin-left: 10px;
  color: #20315b;
`;

const Description = styled.div`
  font-size: 0.857em;
  font-weight: 200;
  text-align: left;
  margin-left: 14px;
  color: #20315b;
`;

const CantSaveButtonDiv = styled.div`
  display: block;
  position: absolute; /* 加入絕對定位 */
  top: 100px;
  right: 24px;
  padding: 15px;
  background-color: #dfd1aa5d;
  cursor: not-allowed;
  border: none;
  border-radius: 36px;
  width: 30px;
  height: 30px;
`;

const CantSaveButton = styled(TfiSave)`
  color: #4a609659;
  cursor: not-allowed;
  border: none;
  width: 30px;
  height: 30px;
`;

const Tool = ({ jobData, idx }) => {
  const [tools, setTools] = useState([]);
  const [showJobConfig, setShowJobConfig] = useState(false);
  const { setWorkflowJobs, joyrideState, setJoyrideState } = useContext(WorkflowStateContext);

  // 取得目前可用的function tools
  useEffect(() => {
    const getTools = async () => {
      if (idx === 0) {
        const { data } = await API.getTriggers();
        setTools(data);
      } else {
        const { data } = await API.getTools();
        setTools(data);
      }
    };
    // 新建立
    if (!jobData.settingInfo) {
      getTools();
    } else {
      setShowJobConfig(true);
    }
  }, []);

  // 點選function 後, reRender 該 function 的 config
  function reRender(id) {
    // 將function ID 寫回上層
    setWorkflowJobs((prev) => {
      if (idx === 0) {
        prev[idx]['trigger_function_id'] = id;
      } else {
        prev[idx]['function_id'] = id;
      }
      return [...prev];
    });
    setShowJobConfig(true);

    if (joyrideState.stepIndex === 1) {
      setJoyrideState({
        ...joyrideState,
        run: true,
        stepIndex: 2,
      });
    }
    if (joyrideState.stepIndex === 5) {
      setJoyrideState({
        ...joyrideState,
        run: true,
        stepIndex: 6,
      });
    }
  }

  return (
    <>
      {/* 尚未選擇tool */}
      {showJobConfig === false ? (
        tools.map((item) => (
          <ToolButton
            className="tool-button"
            key={item.id}
            type="button"
            value={item.id}
            onClick={() => reRender(item.id)}
          >
            <ContentWrapper>
              <TextWrapper>
                <Title>{`${item.external_name}`}</Title>
                <Description>
                  <p>{`${item.description}`}</p>
                </Description>
              </TextWrapper>
            </ContentWrapper>
          </ToolButton>
        ))
      ) : (
        <></>
      )}
      {showJobConfig === false ? (
        <CantSaveButtonDiv>
          <CantSaveButton></CantSaveButton>
        </CantSaveButtonDiv>
      ) : (
        <></>
      )}
      {/* 顯示job config */}
      {showJobConfig ? <JobConfig jobData={jobData} idx={idx} /> : <></>}
    </>
  );
};

export default Tool;
