import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import API from '../../../utils/api';
import { getData } from '../../../utils/api';
import axios from 'axios';

const Job = ({ idx, jobData }) => {
  const [tools, setTool] = useState([]);
  const { id } = useParams();

  // 方法一
  // useEffect(() => {
  //   const getTools = async () => {
  //     const { data } = await API.getTools();
  //     console.log('工具', data);
  //     setTool(data);
  //   };
  //   getTools();
  // }, [id]);

  // 方法二
  useEffect(() => {
    getData(setTool, 'http://localhost:8080/api/tools');
  }, []);

  return (
    <>
      <>Job Title Name: {jobData.name}</>
      {tools.map((item) => (
        <>
          <p>{`Name: ${item.name}, Description: ${item.description}`}</p>
        </>
      ))}
    </>
  );
};

export default Job;
