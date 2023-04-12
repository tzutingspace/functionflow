import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Block from './components/Block';
import './index.css';

const Build = () => {
  const [jobs, setJobs] = useState([{ name: 'Trigger', id: uuidv4() }]);

  return (
    <>
      {jobs.map((item, idx) => (
        <Block key={item.id} jobData={item} jobsData={jobs} setJobsData={setJobs} idx={idx} />
      ))}
    </>
  );
};

export default Build;
