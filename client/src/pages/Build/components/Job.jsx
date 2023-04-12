import { useState } from 'react';

const Job = () => {
  const [data, setData] = useState('');

  function dateChange(e) {
    setData(e.target.value);
  }

  return (
    <div>
      <div>Daily Schedule</div>
      <p>Trigger your workflow on one or more days each week at a specific time.</p>
      <input type="date" value={data} onChange={dateChange}></input>
    </div>
  );
};

export default Job;
