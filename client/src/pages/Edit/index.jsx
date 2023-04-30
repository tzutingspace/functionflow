import { useEffect, useState, useContext, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import ReactLoading from 'react-loading';

import API from '../../utils/api';

import Block from './components/Block';
import Head from './components/Head';

const Loading = styled(ReactLoading)`
  margin-top: 50px;
`;

const NextArea = styled.div`
  box-sizing: border-box;
  margin-top: 100px;
  width: 100vw;
`;

export const WorkflowStateContext = createContext({
  isDraft: true,
  setIsDraft: () => {},
  isAllJobSave: [],
  setIsAllJobSave: () => {},
  workflowJobs: [],
  setWorkflowJobs: () => {},
});

const Edit = () => {
  const { workflowId } = useParams();
  const [workflowLoading, setWorkflowLoading] = useState(true); // 進入頁面先要 workflow 資料
  const [isDraft, _setIsDraft] = useState(true);
  const [isAllJobSave, setIsAllJobSave] = useState([]);
  const [workflowJobs, setWorkflowJobs] = useState([{ name: 'Trigger', id: uuidv4() }]);

  const { jwtToken, loading, isLogin } = useContext(AuthContext);

  const setIsDraft = (status) => {
    _setIsDraft(status);
  };

  useEffect(() => {
    if (!loading && !isLogin) {
      window.location.href = `/`;
    }
  }, [loading]);

  // 檢測是否有job被改變
  useEffect(() => {
    const changeToDraft = () => {
      setIsDraft(true);
    };

    for (const job of isAllJobSave) {
      if (!job) {
        changeToDraft();
        return;
      }
    }
  }, [isAllJobSave]);

  useEffect(() => {
    // Edit 舊 workflow
    const getWorkflowAndJob = async () => {
      // workflow Id 從 Params 來
      // const localJwtToken = localStorage.getItem('jwtToken');
      // console.log('@getWorkflowAndJob jwtToken', jwtToken);
      const data = await API.getWorkflowAndJob(workflowId, jwtToken);

      // FIXME: 一開始就符合前端的資料格式?
      const workflowsData = data.data.map((item) => {
        setIsAllJobSave((pre) => {
          return [...pre, false];
        });
        return { ...item, id: item.workflow_id || item.job_id }; //for react unique key;
      });
      setWorkflowJobs(workflowsData);
      setWorkflowLoading(false);
    };

    const createWorkflow = async () => {
      // const localJwtToken = localStorage.getItem('jwtToken');
      console.log('@createWorkflow jwtToken', jwtToken);
      const { data } = await API.createWorkflow(jwtToken);
      const workflowId = data;
      console.log('workflow ID:', workflowId);

      setWorkflowJobs((prev) => {
        prev[0]['id'] = workflowId; //for react unique key;
        prev[0]['workflow_id'] = workflowId; //real data
        prev[0]['workflow_name'] = 'Untitled Workflow';
        return [...prev];
      });
      setIsAllJobSave((prev) => {
        return [...prev, false];
      });
      setWorkflowLoading(false);
    };

    // 判斷編輯還是新建
    if (loading) return;
    if (workflowId) {
      getWorkflowAndJob();
    } else {
      createWorkflow();
    }
  }, [loading]);

  return (
    <>
      <WorkflowStateContext.Provider
        value={{
          isDraft,
          setIsDraft,
          workflowJobs,
          setWorkflowJobs,
          isAllJobSave,
          setIsAllJobSave,
        }}
      >
        {console.log('@最外層, 所有的workflow資訊', workflowJobs)}
        {console.log('@最外層, 所有isAllJobSave資訊', isAllJobSave)}
        {workflowLoading && <Loading type="spinningBubbles" color="#313538" />}
        {!workflowLoading && (
          <>
            <Head />
            <NextArea>
              {workflowJobs.map((item, idx) => (
                <Block key={item.id} jobData={item} idx={idx} />
              ))}
            </NextArea>
          </>
        )}
      </WorkflowStateContext.Provider>
    </>
  );
};

export default Edit;
