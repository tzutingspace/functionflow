import { useEffect, useState } from 'react';
import Block from './components/Block';
import './index.css';

export default function Build() {
  const [jobs, setJobs] = useState([1]);

  function addwork() {
    const count = jobs.length;
    setJobs((prev) => [...prev, count + 1]);
  }

  return (
    <div>
      {jobs.map((item) => (
        <Block key={item} jobsData={jobs} setJobsData={setJobs} />
      ))}
      <div />
    </div>
  );
}
