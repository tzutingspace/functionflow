import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { axiosGetData } from '../../../utils/api';

const Config = (id) => {
  useEffect(() => {
    axiosGetData(setTool, `/tools/${id}`);
  }, []);

  return <></>;
};
