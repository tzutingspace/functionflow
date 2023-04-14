import { useState, useEffect } from 'react';
// import API from '../../../utils/api';
import { axiosGetData } from '../../../utils/api';
import JobConfig from './JobConfig';

const Tool = ({ jobData, setJobsData, idx }) => {
  const [tools, setTools] = useState([]);
  const [showJobConfig, setShowJobConfig] = useState(false);
  const [getConfigId, setgetConfigId] = useState();

  useEffect(() => {
    axiosGetData(setTools, '/tools');
  }, []);

  function reRender(e) {
    setgetConfigId(e.target.value);
    setShowJobConfig(true);
  }

  return (
    <>
      {idx && showJobConfig === false ? (
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
      {showJobConfig ? <JobConfig id={getConfigId} /> : <></>}
    </>
  );
};

export default Tool;
