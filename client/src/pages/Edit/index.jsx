import { useEffect, useState, useContext, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

import API from '../../utils/api';

import Block from './components/Block';
import Head from './components/Head';

const NextArea = styled.div`
  box-sizing: border-box;
  margin-top: 100px;
  width: 100vw;
`;

export const WorkflowStateContext = createContext({
  isDraft: true,
  setIsDraft: () => {},
  workflowJobs: [],
  setWorkflowJobs: () => {},
});

const Edit = () => {
  const { jwtToken, isLogin } = useContext(AuthContext);

  // const [workflowTitle, setWorkflowTitle] = useState('');
  // const [workflowStatus, setworkflowStatus] = useState('draft');
  // const [jobs, setJobs] = useState([{ name: 'Trigger', uuid: uuidv4() }]);

  const { workflowId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isDraft, _setIsDraft] = useState(true);
  const [workflowJobs, setWorkflowJobs] = useState([]);

  const setIsDraft = (status) => {
    _setIsDraft(status);
  };

  useEffect(() => {
    const getWorkflowAndJob = async () => {
      //workflow Id 從 Params 來
      // const workflowId = 188; // 先寫固定值
      const localJwtToken = localStorage.getItem('jwtToken');
      const data = await API.getWorkflowAndJob(workflowId, localJwtToken);
      console.log('API 有 job and wf 有資料嗎？', data.data);
      setWorkflowJobs(data.data);
      setLoading(false);
    };
    getWorkflowAndJob();
  }, []);

  return (
    <>
      <WorkflowStateContext.Provider value={{ isDraft, setIsDraft, workflowJobs, setWorkflowJobs }}>
        {!loading && (
          <>
            <Head
            // workflowTitle={workflowTitle}
            // setWorkflowTitle={setWorkflowTitle}
            // jobsData={jobs}
            // setJobsData={setJobs}
            // workflowStatus={workflowStatus}
            // setworkflowStatus={setworkflowStatus}
            />
            <NextArea>
              {console.log('In...Edit...index', workflowJobs)}
              {workflowJobs.map((item, idx) => (
                <Block
                  key={item.uuid}
                  // workflowTitle={workflowTitle}
                  // setworkflowStatus={setworkflowStatus}
                  jobData={item}
                  // jobsData={jobs}
                  // setJobsData={setJobs}
                  idx={idx}
                />
              ))}
            </NextArea>
          </>
        )}
      </WorkflowStateContext.Provider>
    </>
  );
};

export default Edit;
