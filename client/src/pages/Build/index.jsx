import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Block from './components/Block';
import Head from './components/Head';
import './index.css';

const Build = () => {
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [jobs, setJobs] = useState([{ name: 'Trigger', id: uuidv4() }]);

  return (
    <>
      <Head workflowTitle={workflowTitle} setWorkflowTitle={setWorkflowTitle} />
      {jobs.map((item, idx) => (
        <Block key={item.id} jobData={item} setJobsData={setJobs} idx={idx} />
      ))}
    </>
  );
};

export default Build;
