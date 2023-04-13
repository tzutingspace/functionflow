import { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../../../utils/api';
import { axiosGetData } from '../../../utils/api';

import Tool from './Tool';

const Job = ({ idx, jobData }) => {
  const [JobTitle, setJobTitle] = useState(['Tigger']);

  return (
    <>
      <div>{idx ? <>Job Title Name: {JobTitle[idx]}</> : <>Trigger</>}</div>
      <Tool idx={idx} />
    </>
  );
};

export default Job;
