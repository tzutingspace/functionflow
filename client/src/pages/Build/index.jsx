import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Block from './components/Block';
import Head from './components/Head';
import './index.css';

const Build = () => {
  const [jobs, setJobs] = useState([{ name: 'Trigger', id: uuidv4() }]);

  return (
    <>
      <form>
        <Head />
        {jobs.map((item, idx) => (
          <Block key={item.id} jobData={item} jobsData={jobs} setJobsData={setJobs} idx={idx} />
        ))}
      </form>
    </>
  );
};

export default Build;
