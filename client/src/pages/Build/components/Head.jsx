import { useEffect, useState } from 'react';
import API from '../../../utils/api';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
  padding: 16px;
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

const Logo = styled.a`
  width: 40px;
  height: 40px;
  background-color: #ccc; /* 示例顏色 */
  margin-right: 16px;
`;

const HeadInput = styled.input`
  font-size: 26px;
  font-weight: bold;
`;

const WorkflowStatus = styled.div`
  font-size: 12px;
  color: #777; /* 示例顏色 */
  margin-left: 16px;

  background-color: gray; /* 灰色背景顏色 */
  border-radius: 20px; /* 圓弧造型 */
  padding: 8px 20px; /* 內邊距 */
  color: white; /* 文字顏色 */
  margin-right: 16px; /* 右邊間距 */
`;

const TriggerButton = styled.div`
  margin-left: 16px;
  padding: 8px 20px; /* 內邊距 */
  margin-right: 16px; /* 右邊間距 */
  background-color: #000000;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  border-radius: 20px; /* 圓弧造型 */
`;

const DeployButton = styled.div`
  background-color: #000000;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  border-radius: 20px; /* 圓弧造型 */
`;

const ExpandButton = styled.div`
  background-color: #000000;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 16px;
  margin-left: 16px;
  border: none;
  cursor: pointer;
  border-radius: 20px; /* 圓弧造型 */
`;

const ExpandedContent = styled.div`
  position: absolute;
  top: 100%; /* 使展開內容位於下方 */
  left: 0;
  right: 0;
  background-color: #f8f8f8;
  padding: 16px;
  z-index: 10; /* 設置較大的 z-index 值，使展開內容在上層 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled.button`
  color: #000000;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
`;

const Head = ({
  jobsData,
  setJobsData,
  workflowTitle,
  setWorkflowTitle,
  workflowStatus,
  setworkflowStatus,
}) => {
  const [expanded, setExpanded] = useState(false);

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
        settingInfo: jobsData[0]['settingInfo'],
        job_qty: jobsData.length - 1,
      },
      jobsInfo: { ...jobsInfotmp },
    };

    console.log('deploy', deployObj);
    const result = await API.deployWorkflow(jobsData[0]['id'], deployObj);
    console.log('結果', result);
    setworkflowStatus('deploy');
  }

  async function triggerWorkflow() {
    console.log('click trigger workflow');
    const id = jobsData[0]['id'];
    const result = await API.triggerWorkflow(id);
    console.log('Trigger 結果', result);
    alert('Trigger 已送出，請稍等結果');
  }

  return (
    <Wrapper>
      <WorkflowHeaderLeft>
        <Logo></Logo>
        <HeadInput
          onChange={(e) => changeHead(e.target.value)}
          placeholder="Untitled Workflow"
          value={workflowTitle}
        ></HeadInput>
        <WorkflowStatus>{workflowStatus}</WorkflowStatus>
      </WorkflowHeaderLeft>
      <WorkflowHeaderRight>
        {workflowStatus === 'depoly' ? (
          <TriggerButton type="button" onClick={() => triggerWorkflow()}>
            Trigger
          </TriggerButton>
        ) : (
          <></>
        )}
        <DeployButton type="button" onClick={() => deployWorkflow()}>
          Deploy
        </DeployButton>
        <ExpandButton onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Close' : 'OPEN'}
        </ExpandButton>
        {expanded && (
          <ExpandedContent>
            <BackButton>Back</BackButton>
          </ExpandedContent>
        )}
      </WorkflowHeaderRight>
    </Wrapper>
  );
};

export default Head;
