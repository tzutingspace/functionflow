import { useState, useEffect } from 'react';
import API from '../../../utils/api';
import JobConfig from './JobConfig';
import styled from 'styled-components';

const ToolTag = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 8px;
`;

const Tool = ({ jobData, jobsData, setJobsData, idx }) => {
  const [tools, setTools] = useState([]);
  const [showJobConfig, setShowJobConfig] = useState(false);
  const [getConfigId, setgetConfigId] = useState();

  useEffect(() => {
    const typer = idx === 0 ? 'trigger' : '';
    const getTools = async () => {
      const { data } = await API.getTools(typer);
      console.log('tool', data);
      setTools(data);
    };
    getTools();
  }, []);

  function reRender(e) {
    console.log('EEEEE', e);
    console.log('target', e.target.value);
    setgetConfigId(e.target.value);
    setShowJobConfig(true);
  }

  return (
    <>
      {showJobConfig === false ? (
        tools.map((item) => (
          <ToolTag key={item.id} type="button" value={item.id} onClick={(e) => reRender(e)}>
            {`Name: ${item.name}, Description: ${item.description}`}
          </ToolTag>
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
