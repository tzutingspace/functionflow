import { useState, useEffect } from 'react';
import API from '../../../utils/api';
import JobConfig from './JobConfig';

const Tool = ({ jobData, jobsData, setJobsData, idx }) => {
  const [tools, setTools] = useState([]);
  const [showJobConfig, setShowJobConfig] = useState(false);
  const [getConfigId, setgetConfigId] = useState();

  useEffect(() => {
    const typer = idx === 0 ? 'trigger' : '';
    const getTools = async () => {
      const { data } = await API.getTools(typer);
      setTools(data);
    };
    getTools();
  }, []);

  function reRender(e) {
    setgetConfigId(e.target.value);
    setShowJobConfig(true);
  }

  return (
    <>
      {showJobConfig === false ? (
        tools.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              value={item.id}
              onClick={(e) => reRender(e)}
            >{`Name: ${item.name}, Description: ${item.description}`}</button>
          </div>
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
