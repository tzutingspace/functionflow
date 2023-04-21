import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Block from './components/Block';
import Head from './components/Head';
import API from '../../utils/api';

const Build = () => {
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow');
  const [jobs, setJobs] = useState([{ name: 'Trigger', uuid: uuidv4() }]);
  const [workflowStatus, setworkflowStatus] = useState('draft');

  useEffect(() => {
    const createWorkflow = async () => {
      const { data } = await API.createWorkflow();
      const workflowId = data;
      console.log('workflow ID:', workflowId);

      // 取得此workflow id
      setJobs((prev) => {
        console.log('jobs prev', prev);
        prev[0]['id'] = workflowId;
        return [...prev];
      });
    };
    createWorkflow();
  }, []);

  return (
    <>
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
          jobData={item}
          jobsData={jobs}
          setJobsData={setJobs}
          idx={idx}
        />
      ))}
    </>
  );
};

export default Build;
