import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import io from 'socket.io-client';

import API from '../../../utils/api';
import { WorkflowStateContext } from '..';
import { AuthContext } from '../../../contexts/authContext';
import ActionAlerts from './Alert.jsx';
import logo from './logo.png';

import JoyRide from 'react-joyride';
import { Steps } from '../../../utils/joyride';

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
`;

const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

const Head = () => {
  const { user, isLogin, jwtToken } = useContext(AuthContext);
  const { isDraft, setIsDraft, workflowJobs, setWorkflowJobs, isAllJobSave, setIsAllJobSave } =
    useContext(WorkflowStateContext);

  const [workflowTitle, setWorkflowTitle] = useState(workflowJobs[0].workflow_name);

  const [triggerResult, setTriggerResult] = useState('');

  const [isTrigger, setIsTrigger] = useState(false);
  const [isTriggerResultBack, setIsTriggerResultBack] = useState(false);

  console.log('eweqw', Steps);

  // change workflow name
  function changeHead(value) {
    // 因為route切換關西, workflow命名不可以用slash
    const inputValue = value.replace('/', '_');
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
        alert('您尚有 job 未存檔');
        return;
      }
    }

    if (workflowJobs.length <= 1) {
      alert('您尚未建立job');
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
    const result = await API.deployWorkflow(workflowJobs[0]['id'], deployObj);
    console.log('deploy結果', result);
    setIsDraft(false);
  }

  async function triggerWorkflow() {
    console.log('click trigger workflow...');
    const id = workflowJobs[0]['id'];
    const socketId = user.name + user.id;
    const result = await API.triggerWorkflow(id, socketId, jwtToken);
    console.log('Trigger 送出 response', result);
    setIsTrigger(true);

    socket.emit('trigger', socketId);
    socket.on('triggerFinish', (data) => {
      console.log('後端emit資料過來', data);
      // alert(`Trigger 已完成, 結果:${data.message}`);
      setTriggerResult(() => {
        return data.message;
      });
      setIsTriggerResultBack(true);
    });
  }

  return (
    <Wrapper>
      <ActionAlerts
        isOpen={isTrigger}
        onClose={setIsTrigger}
        message={'Trigger 已送出，請稍等結果'}
      ></ActionAlerts>
      {
        <ActionAlerts
          isOpen={isTriggerResultBack}
          onClose={setIsTriggerResultBack}
          message={`Trigger 已完成, 結果:${triggerResult}`}
        ></ActionAlerts>
      }
      <WorkflowHeaderLeft>
        <Logo to="/workflows"></Logo>
        <HeadInput
          onChange={(e) => changeHead(e.target.value)}
          placeholder="Untitled Workflow"
          value={workflowTitle}
          id="change-workflow-name"
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
        <DeployButton type="button" onClick={() => deployWorkflow()}>
          Deploy
        </DeployButton>
      </WorkflowHeaderRight>
    </Wrapper>
  );
};

export default Head;
