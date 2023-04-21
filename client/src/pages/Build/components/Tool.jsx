import { useState, useEffect } from 'react';
import API from '../../../utils/api';
import JobConfig from './JobConfig';
import styled from 'styled-components';

const ToolButton = styled.button`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: #ccc;
  line-height: 1rem;
  max-height: 60px;
  width: 100%;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  width: 100%;
`;

const TextWrapper = styled.div`
  flex-grow: 1;
`;

const Title = styled.div`
  font-weight: bold;
`;

const Description = styled.div`
  font-size: 0.857em;
  font-weight: 200;
`;

const Tool = ({ jobData, jobsData, setJobsData, idx, workflowTitle }) => {
  const [tools, setTools] = useState([]);
  const [showJobConfig, setShowJobConfig] = useState(false);

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
      console.log('@Tool 理論上要顯示先前data');
      setShowJobConfig(true);
    }

    // getTools();
  }, []);

  // 點選function 後, reRender 該 function 的 config
  function reRender(id) {
    // 將function ID 寫回上層
    setJobsData((prev) => {
      if (idx === 0) {
        prev[idx]['trigger_function_id'] = id;
      } else {
        prev[idx]['function_id'] = id;
      }
      return [...prev];
    });
    setShowJobConfig(true);
  }

  return (
    <>
      {/* 尚未選擇tool */}
      {showJobConfig === false ? (
        tools.map((item) => (
          <ToolButton key={item.id} type="button" value={item.id} onClick={() => reRender(item.id)}>
            <ContentWrapper>
              <TextWrapper>
                <Title>{`${item.external_name}`}</Title>
                <Description style={{ fontSize: '0.857em', fontWeight: '200' }}>
                  <p>{`${item.description}`}</p>
                </Description>
              </TextWrapper>
            </ContentWrapper>
          </ToolButton>
        ))
      ) : (
        <></>
      )}
      {/* 顯示job config */}
      {showJobConfig ? (
        <JobConfig
          jobData={jobData}
          jobsData={jobsData}
          setJobsData={setJobsData}
          idx={idx}
          workflowTitle={workflowTitle}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Tool;
