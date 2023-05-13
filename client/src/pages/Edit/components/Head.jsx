import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import io from 'socket.io-client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import API from '../../../utils/api';
import { WorkflowStateContext } from '..';
import { AuthContext } from '../../../contexts/authContext';
// import ActionAlerts from './Alert.jsx';
import logo from './logo.png';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
  padding: 16px;
  margin-bottom: 20px;
  width: 100vw;
  position: fixed;
  box-sizing: border-box;
  flex-wrap: nowrap;
  z-index: 300;
  top: 0;
`;

const WorkflowHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const WorkflowHeaderRight = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  width: 48px;
  height: 48px;
  background-image: url(${logo});
  background-size: contain;
  background-color: #ccc; /* 示例顏色 */
  margin-right: 16px;
`;

const HeadInput = styled.input`
  font-size: 28px;
  font-weight: bold;
  height: 44px;
  color: #20315b;
`;

const WorkflowStatus = styled.div`
  font-size: 18px;
  margin-left: 16px;
  background-color: #dfd1aa82; /* 灰色背景顏色 */
  border-radius: 20px; /* 圓弧造型 */
  padding: 10px 16px; /* 內邊距 */
  color: #20315b; /* 文字顏色 */
  margin-right: 16px; /* 右邊間距 */
  font-weight: bold;
  padding: 10px 16px;
  width: 40px;
  border: none;
  text-align: center;
  width: auto;
`;

const TriggerButton = styled.div`
  margin-left: 16px;
  padding: 8px 20px; /* 內邊距 */
  margin-right: 16px; /* 右邊間距 */
  background-color: #6acf91;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  border-radius: 20px; /* 圓弧造型 */
  text-align: center;
  width: 60px;
`;

const DeployButton = styled.div`
  background-color: #20315b;
  color: #dfd1aa;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  border-radius: 20px; /* 圓弧造型 */
  text-align: center;
  width: 60px;
`;

const BackButton = styled(Link)`
  background-color: #20315b;
  color: #dfd1aa;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  border-radius: 20px; /* 圓弧造型 */
  margin-left: 16px;
  margin-right: 10px;
  width: 60px;
  text-align: center;
  text-decoration: none;
`;

const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

function replaceSpecialCharacters(inputString) {
  const regexForUrlEncodedChars = /[%!'"()*&$+/,:;=?#\\]/g;
  return inputString.replace(regexForUrlEncodedChars, '_');
}

const Head = () => {
  const { user, jwtToken } = useContext(AuthContext);
  const { isDraft, setIsDraft, workflowJobs, setWorkflowJobs, isAllJobSave } =
    useContext(WorkflowStateContext);

  const [workflowTitle, setWorkflowTitle] = useState(workflowJobs[0].workflow_name);

  // const [triggerResult, setTriggerResult] = useState('');
  // const [isTrigger, setIsTrigger] = useState(false);
  // const [isTriggerResultBack, setIsTriggerResultBack] = useState(false);

  // change workflow name
  function changeHead(value) {
    // 因為route切換關西, workflow命名不可以用slash
    const inputValue = replaceSpecialCharacters(value); //.replace('/', '_');
    // 更新上層 jobs Data
    setWorkflowJobs((prev) => {
      prev[0]['workflow_name'] = inputValue;
      return [...prev];
    });
    // 更新 title
    setWorkflowTitle(inputValue);
    setIsDraft(true);
  }

  // deploy workflow name
  async function deployWorkflow() {
    for (const job of isAllJobSave) {
      if (job === false) {
        // alert('您尚有 job 未存檔');
        toast.warn("You still have some jobs that haven't been saved.", {
          position: 'top-center',
          autoClose: 2000,
          theme: 'dark',
        });
        return;
      }
    }

    if (workflowJobs.length <= 1) {
      // alert('您尚未建立job');
      toast.warn("You haven't created any jobs yet.", {
        position: 'top-center',
        autoClose: 2000,
        theme: 'dark',
      });
      return;
    }

    const jobsInfoData = workflowJobs.slice(1).reduce((acc, curr, index) => {
      // 這邊sequence會重新確認
      curr['settingInfo']['jobsInfo']['sequence'] = index + 1;
      acc[index + 1] = { ...curr['settingInfo']['jobsInfo'] };
      return acc;
    }, {});

    console.log('Depoly 確認目前workflowJobs: ', workflowJobs);

    const deployObj = {
      workflowInfo: {
        id: workflowJobs[0]['id'],
        name: workflowTitle,
        status: 'active',
        start_time: workflowJobs[0]['settingInfo']['start_time'],
        trigger_function_id: workflowJobs[0]['trigger_function_id'],
        trigger_api_route: workflowJobs[0]['trigger_api_route'],
        jobsInfo: { ...workflowJobs[0]['settingInfo']['jobsInfo'] },
        job_qty: workflowJobs.length - 1,
      },
      jobsInfo: { ...jobsInfoData },
    };

    console.log('deploy Obj', deployObj);
    const result = await API.deployWorkflow(workflowJobs[0]['id'], deployObj, jwtToken);
    console.log('deploy結果', result);
    setIsDraft(false);
    toast.success('This workflow has been successfully deployed.', {
      position: 'top-right',
      style: {
        top: '100px',
      },
      autoClose: 2000,
      theme: 'dark',
    });
  }

  // manual trigger workflow
  async function triggerWorkflow() {
    console.log('click trigger workflow...');
    const id = workflowJobs[0]['id'];
    const socketId = user.name + user.id;
    const result = await API.triggerWorkflow(id, socketId, jwtToken);
    console.log('Trigger 送出 response:', result);

    toast.success(
      'The manual trigger has been submitted. Please wait for the result. You can navigate to other pages while waiting.',
      {
        position: 'top-right',
        style: {
          top: '100px',
        },
        autoClose: 10000,
        theme: 'dark',
      }
    );

    // setIsTrigger(true);
    socket.emit('trigger', socketId);
    socket.on('triggerFinish', (data) => {
      console.log('後端emit資料過來', data);
      toast.success(`The trigger has been completed, the result is: ${data.message}`, {
        position: 'top-right',
        style: {
          top: '100px',
        },
        autoClose: 3000,
        theme: 'dark',
      });
      socket.off('triggerFinish');

      // setTriggerResult(() => {
      //   return data.message;
      // });
      // setIsTriggerResultBack(true);
    });
  }

  return (
    <>
      <Wrapper>
        <WorkflowHeaderLeft>
          <Logo to="/workflows"></Logo>
          <HeadInput
            onChange={(e) => changeHead(e.target.value)}
            placeholder="Untitled Workflow"
            value={workflowTitle}
            id="setting-workflow-name"
          ></HeadInput>
          <WorkflowStatus>{isDraft ? 'draft' : 'active'}</WorkflowStatus>
        </WorkflowHeaderLeft>
        <WorkflowHeaderRight>
          {isDraft ? (
            <></>
          ) : (
            <TriggerButton type="button" onClick={() => triggerWorkflow()}>
              Trigger
            </TriggerButton>
          )}
          <DeployButton id="deploy-button" type="button" onClick={() => deployWorkflow()}>
            Deploy
          </DeployButton>
          <BackButton to={`/instances/@${user.name}/${workflowTitle}/${workflowJobs[0].id}`}>
            Back
          </BackButton>
          {console.log('dsdsasad', workflowTitle, user.name, workflowJobs[0].id)}
        </WorkflowHeaderRight>
      </Wrapper>
      <ToastContainer />
    </>
  );
};

export default Head;
