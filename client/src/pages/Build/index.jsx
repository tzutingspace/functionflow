import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowStateProvider } from './contexts/workflowContext';
import { WorkflowStateContext } from './contexts/workflowContext';

import Block from './components/Block';
import Head from './components/Head';
import API from '../../utils/api';

const Build = () => {
  const location = useLocation();
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow');
  const [jobs, setJobs] = useState([{ name: 'Trigger', uuid: uuidv4() }]);

  const [workflowStatus, setworkflowStatus] = useState('draft');
  const { isJobsSave, setIsJobsSave } = useContext(WorkflowStateContext);

  useEffect(() => {
    const createWorkflow = async () => {
      const { data } = await API.createWorkflow();
      const workflowId = data;
      console.log('workflow ID:', workflowId);

      // 取得此workflow id
      setJobs((prev) => {
        prev[0]['id'] = workflowId;
        return [...prev];
      });
    };
    createWorkflow();
  }, []);

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
      </WorkflowStateProvider>
    </>
  );
};

export default Build;
