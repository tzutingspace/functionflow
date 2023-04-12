import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Block from './components/Block';
import './index.css';

const Build = () => {
  const [jobs, setJobs] = useState([{ name: 'Trigger', id: uuidv4 }]);

  return (
    <div>
      {jobs.map((item) => (
        <Block key={item.id} jobData={item} jobsData={jobs} setJobsData={setJobs} />
      ))}
      <div />
    </div>
  );
};

export default Build;
