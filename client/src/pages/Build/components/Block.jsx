import { useEffect, useState } from 'react';
import JobHead from './JobHead';
import Job from './Job';

export default function Block({ jobsData, setJobsData }) {
  console.log(jobsData);

  const [a, setA] = useState(100);

  function add() {
    console.log('12321');
    setA((prev) => {
      console.log('111', prev);
      return prev + 100;
    });
  }

  function addwork(_this) {
    console.log('addwork', _this);
    const count = jobsData.length;
    setJobsData((prev) => [...prev, count + 1]);
  }

  return (
    <div>
      <JobHead />
      <Job />
      {/* <button type="button" onClick={}>
        Remove
      </button> */}
      <button type="button" onClick={add}>
        Add
      </button>
      {a}
      <button
        type="button"
        onClick={(_this) => {
          addwork(_this);
        }}
      >
        Click Me
      </button>
    </div>
  );
}
