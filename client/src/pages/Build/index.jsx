import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

import { AuthContext } from '../../contexts/authContext';
import { WorkflowStateProvider } from './contexts/workflowContext';
import { WorkflowStateContext } from './contexts/workflowContext';

import Block from './components/Block';
import Head from './components/Head';
import API from '../../utils/api';

const NextArea = styled.div`
  box-sizing: border-box;
  margin-top: 100px;
  width: 100vw;
`;

const Build = () => {
  const { jwtToken, isLogin } = useContext(AuthContext);

  const location = useLocation();
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow');
  const [jobs, setJobs] = useState([{ name: 'Trigger', uuid: uuidv4() }]);

  const [workflowStatus, setworkflowStatus] = useState('draft');
  // const { isJobsSave, setIsJobsSave } = useContext(WorkflowStateContext);

  useEffect(() => {
    const createWorkflow = async () => {
      console.log('@createworkflow useEffect', isLogin, jwtToken);
      const { data } = await API.createWorkflow(jwtToken);
      const workflowId = data;
      console.log('workflow ID:', workflowId);

      // 取得此workflow id
      setJobs((prev) => {
        prev[0]['id'] = workflowId;
        return [...prev];
      });
    };
    if (isLogin) {
      createWorkflow();
    }
    //FIXME: 沒有登入應該要導引到登入
  }, [isLogin]);

  return (
    <>
      <WorkflowStateProvider>
        <Head
          workflowTitle={workflowTitle}
          setWorkflowTitle={setWorkflowTitle}
          jobsData={jobs}
          setJobsData={setJobs}
          workflowStatus={workflowStatus}
          setworkflowStatus={setworkflowStatus}
        />
        <NextArea>
          {jobs.map((item, idx) => (
            <Block
              key={item.uuid}
              workflowTitle={workflowTitle}
              setworkflowStatus={setworkflowStatus}
              jobData={item}
              jobsData={jobs}
              setJobsData={setJobs}
              idx={idx}
            />
          ))}
        </NextArea>
      </WorkflowStateProvider>
    </>
  );
};

export default Build;
