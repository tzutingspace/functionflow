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

const Tool = ({ jobData, jobsData, setJobsData, idx }) => {
  const [tools, setTools] = useState([]);
  const [showJobConfig, setShowJobConfig] = useState(false);
  const [getConfigId, setgetConfigId] = useState();

  useEffect(() => {
    const getTools = async () => {
      console.log('idx', idx);
      if (idx === 0) {
        const { data } = await API.getTriggers();
        console.log('tools', data);
        setTools(data);
      } else {
        const { data } = await API.getTools();
        console.log('tools', data);
        setTools(data);
      }
    };
    getTools();
  }, []);

  function reRender(id) {
    setgetConfigId(id);
    setShowJobConfig(true);
  }

  return (
    <>
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
      {showJobConfig ? (
        <JobConfig
          jobData={jobData}
          jobsData={jobsData}
          setJobsData={setJobsData}
          functionId={getConfigId}
          idx={idx}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Tool;
