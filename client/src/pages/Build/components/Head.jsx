import { useEffect, useState, useContext } from 'react';
import API from '../../../utils/api';
import styled from 'styled-components';
import io, { Socket } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { WorkflowStateContext } from '../contexts/workflowContext';
import { AuthContext } from '../../../contexts/authContext';
import logo from './logo.png';

import ActionAlerts from '../components/Alert.jsx';

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

const ExpandButton = styled.div`
  background-color: #20315b;
  color: #dfd1aa;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 16px;
  margin-left: 16px;
  border: none;
  cursor: pointer;
  border-radius: 20px; /* 圓弧造型 */
`;

const ExpandedContent = styled.div`
  position: absolute;
  top: 150%; /* 使展開內容位於下方 */
  left: 10;
  right: 0;
  background-color: #f8f8f8;
  padding: 20px;
  z-index: 10; /* 設置較大的 z-index 值，使展開內容在上層 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled(Link)`
  color: #20315b;
  justify-items: auto;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
`;

const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

const Head = ({
  jobsData,
  setJobsData,
  workflowTitle,
  setWorkflowTitle,
  workflowStatus,
  setworkflowStatus,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [triggerResult, setTriggerResult] = useState('');

  const { user, isLogin, jwtToken } = useContext(AuthContext);
  const { isDraft, setIsDraft } = useContext(WorkflowStateContext);

  const [isTrigger, setIsTrigger] = useState(false);
  const [isTriggerResultBack, setIsTriggerResultBack] = useState(false);

  //FIXME: 確認是否登入;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function changeHead(value) {
    // 更新上層 jobs Data
    setJobsData((prev) => {
      prev[0]['name'] = value;
      return [...prev];
    });
    // 更新 title
    setWorkflowTitle(value);
    setworkflowStatus('draft');
    setIsDraft(true);
  }

  async function deployWorkflow() {
    const jobsInfotmp = jobsData.slice(1).reduce((acc, curr, index) => {
      // 這邊sequence會重新確認
      curr['settingInfo']['jobsInfo']['sequence'] = index + 1;
      acc[index + 1] = { ...curr['settingInfo']['jobsInfo'] };
      return acc;
    }, {});

    console.log('Depoly 確認目前JobsData', jobsData);

    const deployObj = {
      workflowInfo: {
        name: workflowTitle,
        status: 'active',
        start_time: jobsData[0]['settingInfo']['start_time'],
        trigger_function_id: jobsData[0]['trigger_function_id'],
        trigger_api_route: jobsData[0]['trigger_api_route'],
        jobsInfo: { ...jobsData[0]['settingInfo']['jobsInfo'] },
        job_qty: jobsData.length - 1,
      },
      jobsInfo: { ...jobsInfotmp },
    };

    console.log('deploy', deployObj);
    const result = await API.deployWorkflow(jobsData[0]['id'], deployObj);
    console.log('deploy結果', result);
    setworkflowStatus('deploy');
    setIsDraft(false);
  }

  async function triggerWorkflow() {
    console.log('click trigger workflow');
    const id = jobsData[0]['id'];
    const socketId = user.name + user.id;
    const result = await API.triggerWorkflow(id, socketId, jwtToken);
    console.log('Trigger 送出 response', result);
    // alert('Trigger 已送出，請稍等結果');
    setIsTrigger(true);

    //FIXME: 需要帶變數
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
        <Logo to="/"></Logo>
        <HeadInput
          onChange={(e) => changeHead(e.target.value)}
          placeholder="Untitled Workflow"
          value={workflowTitle}
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
        <ExpandButton onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Close' : 'OPEN'}
        </ExpandButton>
        {expanded && (
          <ExpandedContent>
            <BackButton to="/">Back</BackButton>
            <BackButton to="/history">History</BackButton>
          </ExpandedContent>
        )}
        {/* <p>{triggerResult}</p> */}
      </WorkflowHeaderRight>
    </Wrapper>
  );
};

export default Head;
