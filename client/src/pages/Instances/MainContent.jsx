import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDate, capitalizeFirstLetter } from '../../utils/utils';
import API from '../../utils/api';

import success from './success.png';
import error from './error.png';

const Wrapper = styled.div`
  flex: 1;
  background-color: #fff;
  height: 100vh;
  overflow: hidden;
`;
const HeadWrapper = styled.div`
  background-color: #dfd1aaa3;
  color: #20315b;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

const HeadTitle = styled.div`
  font-size: 36px;
  margin-right: auto;
  font-weight: bold;
  border-bottom: solid;
`;

const EditWorkflow = styled(Link)`
  width: 100px;
  margin-left: 16px;
  padding: 8px 20px; /* 內邊距 */
  margin-right: 20px; /* 右邊間距 */
  background-color: #20315b;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 8px; /* 圓弧造型 */
  text-align: center;
`;

const MainArea = styled.div`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
  overflow: hidden;
  justify-items: auto;
`;

// 左邊
const LeftArea = styled.div`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-basis: 0%;
  flex-direction: column;
  flex-wrap: 1;
  flex-shrink: 1;
  flex: 1;
  overflow-y: auto;
  height: 100vh;
  padding-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 2rem;
  /* background-color: #dfd1aaa3; */
  border-right: 1px solid #dfd1aaa3;
`;

const LeftTitle = styled.div`
  font-size: 2.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
`;

const LeftWorkflowItems = styled.div`
  display: flex;
  justify-items: space-between;
  justify-content: center;
  margin-bottom: 1rem;
  /* border: solid 1px; */
  /* background-color: #dfd1aaa3; */
  cursor: pointer;
  border-bottom: 1px solid #dfd1aaa3;
  &:hover {
    background-color: #dfd1aaa3;
  }
`;

const LeftWorkflowSuccess = styled.div`
  background-image: url(${success});
  background-size: contain;
  background-repeat: no-repeat;
  border-color: transparent;
  height: 2rem;
  width: 2rem;
`;

const LeftWorkflowError = styled.div`
  background-image: url(${error});
  background-size: contain;
  background-repeat: no-repeat;
  border-color: transparent;
  height: 2rem;
  width: 2rem;
`;

const WorkflowStatusStyle = styled.div`
  /* border: solid 1px blue; */
  align-self: center;
`;

const WorkflowTriggerType = styled.div`
  margin: auto;
  /* border: solid 1px green; */
  align-self: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const WorkflowTriggerTime = styled.div`
  /* border: solid 1px purple; */
  align-self: center;
  text-align: right;
  width: 8rem;
  font-size: 0.7rem;
  font-weight: bold;
`;

// 右邊
const RightArea = styled.div`
  box-sizing: border-box;
  flex: 2;
  margin: 0px;
  overflow-y: auto;
  height: 100vh;
  padding-top: 1rem;
  padding-bottom: 10rem;
`;

// 參考Build/components/Block/Wrapper
const JobBlock = styled.div`
  position: relative;
  border: solid #20315b;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f8f8;
  max-width: 65%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0px;
  margin-bottom: 0px;
`;

// 參考Build/components/Job/JobTilteStyled
const JobTilteStyled = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 0;
  /* margin-bottom: 16px; */
  display: flex;
  color: #20315b;
  align-items: center;
  border-bottom: solid #dfd1aa;
`;

// 參考Build/components/Job/JobContent
const JobContent = styled.div`
  width: 95%;
  margin: auto;
  margin-top: 1rem;
  /* border: 1px solid black; */
`;

const WrapperJobItem = styled.div`
  /* border: 1px solid red; */
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const JobItemTitle = styled.div`
  /* border: 1px solid blue; */
  box-sizing: border-box;
  bottom: auto;
  display: flex;
  width: 10rem;
  color: #20315b;
  font-weight: bold;
  padding-bottom: 0.2rem;
`;

const JobItemContent = styled.div`
  /* border: 1px solid red; */
  color: #20315b;
  font-weight: bold;
`;

const JobConfigWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  /* background-color: yellow; */
`;

const SettingTitle = styled.div`
  /* border: 1px solid red; */
  /* background-color: green; */
  box-sizing: border-box;
  bottom: auto;
  display: flex;
  margin-left: 1rem;
  width: 9rem;
  color: #20315b;
  font-weight: bold;
`;

// 參考Build/components/Block/ButtonArea
const BottomArea = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-width: 0;
  width: auto;
  border-style: solid;
  border-color: transparent;
  position: relative;
`;

// 參考Build/components/Block/Emptydiv
const Emptydiv = styled.div`
  box-sizing: border-box;
  display: block;
  height: 1.5rem;
  padding-left: 1px;
  padding-right: 1px;
  width: 3px;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  background-color: #20315b;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  line-height: 1.5;
  font-size: 0.875rem;
`;

const MainContent = () => {
  const [workflowHistory, setworkflowHistory] = useState([]);
  const [workflowInstance, setworkflowInstance] = useState();

  useEffect(() => {
    const getInstances = async () => {
      const instances = await API.getInstance('id');
      console.log('api instances', instances);
      setworkflowHistory(() => instances);
      setworkflowInstance(() => instances[0]);
    };
    getInstances();
  }, []);

  const clickWorkflowInatance = (wfi) => {
    setworkflowInstance(() => {
      return { ...wfi };
    });
  };

  return (
    <Wrapper>
      <HeadWrapper>
        <HeadTitle>User Workflow Name</HeadTitle>
        <EditWorkflow to="/createworkflow">Edit</EditWorkflow>
      </HeadWrapper>
      <MainArea>
        <LeftArea>
          <LeftTitle>History</LeftTitle>
          {workflowHistory.map((wfi, idx) => (
            <LeftWorkflowItems
              key={wfi.workflowInfo.workflowInstanceId}
              idx={idx}
              onClick={() => clickWorkflowInatance(wfi)}
            >
              <WorkflowStatusStyle>
                {wfi.workflowInfo.status === 'success' ? (
                  <LeftWorkflowSuccess />
                ) : (
                  <LeftWorkflowError />
                )}
              </WorkflowStatusStyle>
              <WorkflowTriggerType>
                {wfi.workflowInfo.trigger_type.toUpperCase()}
              </WorkflowTriggerType>
              <WorkflowTriggerTime>
                {formatDate(wfi.workflowInfo.execution_time)}
              </WorkflowTriggerTime>
            </LeftWorkflowItems>
          ))}
        </LeftArea>
        <RightArea>
          {workflowInstance && (
            <>
              <JobBlock>
                <JobTilteStyled>Trigger</JobTilteStyled>
                <JobContent>
                  <JobConfigWrapper>
                    <WrapperJobItem>
                      <JobItemTitle>Status:</JobItemTitle>
                      <JobItemContent>
                        {workflowInstance.workflowInfo.status.toLowerCase()}
                      </JobItemContent>
                    </WrapperJobItem>
                  </JobConfigWrapper>
                  <JobConfigWrapper>
                    <WrapperJobItem>
                      <JobItemTitle>Type:</JobItemTitle>
                      <JobItemContent>
                        {workflowInstance.workflowInfo.trigger_type.toLowerCase()}
                      </JobItemContent>
                    </WrapperJobItem>
                  </JobConfigWrapper>
                  <JobConfigWrapper>
                    <WrapperJobItem>
                      <JobItemTitle>Manual Trigger:</JobItemTitle>
                      <JobItemContent>
                        {workflowInstance.workflowInfo.manual_trigger === 't' ? 'true' : 'false'}
                      </JobItemContent>
                    </WrapperJobItem>
                  </JobConfigWrapper>
                  <JobConfigWrapper>
                    <WrapperJobItem>
                      <JobItemTitle>Execution Time:</JobItemTitle>
                      <JobItemContent>
                        {formatDate(workflowInstance.workflowInfo.execution_time)}
                      </JobItemContent>
                    </WrapperJobItem>
                  </JobConfigWrapper>
                </JobContent>
              </JobBlock>
              <BottomArea>
                <Emptydiv></Emptydiv>
              </BottomArea>
            </>
          )}
          {workflowInstance &&
            workflowInstance.jobsInfo.map((jobsInstance, idx) => (
              <>
                <JobBlock>
                  <JobTilteStyled>{jobsInstance.jobname}</JobTilteStyled>
                  <JobContent>
                    <JobConfigWrapper>
                      <WrapperJobItem>
                        <JobItemTitle>Job Status:</JobItemTitle>
                        <JobItemContent>{jobsInstance.job_status}</JobItemContent>
                      </WrapperJobItem>
                    </JobConfigWrapper>
                    <JobItemTitle>{`Job Setting:`}</JobItemTitle>
                    {jobsInstance.customer_input &&
                      Object.entries(jobsInstance.customer_input).map(([key, val], idx) => {
                        return (
                          <JobConfigWrapper>
                            <WrapperJobItem>
                              <SettingTitle>{`${key}:`}</SettingTitle>
                              <JobItemContent>{`${val}`}</JobItemContent>
                            </WrapperJobItem>
                          </JobConfigWrapper>
                        );
                      })}
                    <JobItemTitle>{`Result Output:`}</JobItemTitle>
                    {jobsInstance.result_output &&
                      Object.entries(jobsInstance.result_output).map(([key, val], idx) => {
                        return (
                          <JobConfigWrapper>
                            <WrapperJobItem>
                              <SettingTitle>{`${key}:`}</SettingTitle>
                              <JobItemContent>{`${val}`}</JobItemContent>
                            </WrapperJobItem>
                          </JobConfigWrapper>
                        );
                      })}
                  </JobContent>
                </JobBlock>
                <BottomArea>
                  <Emptydiv></Emptydiv>
                </BottomArea>
              </>
            ))}
        </RightArea>
      </MainArea>
    </Wrapper>
  );
};

export default MainContent;
