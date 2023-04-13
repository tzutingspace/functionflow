import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import API from '../../../utils/api';
import { axiosGetData } from '../../../utils/api';

const Tool = ({ idx }) => {
  const { id } = useParams();
  const [tools, setTool] = useState([]);
  const checkJob = useRef(false);

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
    axiosGetData(setTool, '/tools');
  }, []);

  function getNum(e) {
    console.log('testing');
    console.log(checkJob);
    console.log(e.target.value);
    checkJob.current = true;
    console.log(checkJob);
  }

  return (
    <>
      {idx ? (
        tools.map((item) => (
          <div>
            <button
              type="button"
              value={item.id}
              onClick={(e) => getNum(e)}
            >{`Name: ${item.name}, Description: ${item.description}`}</button>
          </div>
        ))
      ) : (
        <></>
      )}
    </>
  );
};

export default Tool;
