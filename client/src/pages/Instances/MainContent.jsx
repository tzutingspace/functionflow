import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../utils/utils';
import { AuthContext } from '../../contexts/authContext';
import API from '../../utils/api';

import { ImCheckmark, ImCancelCircle } from 'react-icons/im';

import { styled as muiStyled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

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
  margin-right: 1.5rem;
  font-weight: bold;
`;

const StyledFormGroup = muiStyled(FormGroup)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const IOSSwitch = muiStyled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const EditWorkflow = styled(Link)`
  width: 100px;
  padding: 13px 16px 10px 16px; /* 內邊距 */
  margin-left: auto;
  margin-right: 20px; /* 右邊間距 */
  background-color: #20315b;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
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
  border-right: 1px solid #dfd1aaa3;
  padding-bottom: 10rem;
`;

const LeftTitle = styled.div`
  font-size: 2.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
`;

const LeftWorkflowItems = styled.div`
  /* background-color: red; */
  display: flex;
  justify-items: space-between;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 3px 6px 3px 3px; /* 內邊距 */
  border-radius: 8px; /* 造型 */
  cursor: pointer;
  border-bottom: 1px solid #dfd1aaa3;
  &:hover {
    background-color: #dfd1aaa3;
  }
`;

const LeftWorkflowSuccess = styled(ImCheckmark)`
  height: 1.7rem;
  width: 1.7rem;
  padding: 0px;
  color: #66b566;
`;

const LeftWorkflowError = styled(ImCancelCircle)`
  height: 1.7rem;
  width: 1.7rem;
  padding: 0px;
  color: red;
`;

const WorkflowInstanceStatusStyle = styled.div`
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
  max-width: 1000px;
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
  font-size: 16px;
  text-decoration: underline;
`;

const JobItemContent = styled.div`
  /* border: 1px solid red; */
  color: #20315b;
  font-weight: bold;
  width: 65%;
  /* flex-wrap: wrap; */
  overflow-wrap: break-word; /* 兼容性更好的寫法，當單詞超出邊界時換行 */
  margin-left: auto;
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
  /* margin-left: 1rem; */
  width: 9rem;
  color: #20315b;
  font-weight: bold;
  /* justify-content: center; */
  align-items: center;
  /* line-height: 1rem; */
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
  const { loading, jwtToken } = useContext(AuthContext);

  // 主要顯示
  const [workflowHistory, setworkflowHistory] = useState([]);
  const [workflowInstance, setworkflowInstance] = useState();

  // workflow status
  const [workflowStatus, setWorkflowStatus] = useState(false);
  const isEmptyWorkflow = useRef(false);

  const { workflowName, workflowid } = useParams('active');

  useEffect(() => {
    const getInstances = async () => {
      const instances = await API.getInstance(workflowid, jwtToken);
      console.log('api instances', instances);

      //FIXME: 處理api錯誤？

      // 沒要到資料
      if (instances.length === 0) return;

      // set workflow狀態
      setWorkflowStatus(() => {
        if (instances[0]['workflowInfo']['workflowStatus'] === 'active') {
          return true;
        }

        // job 為零, 不應該讓他active
        if (!instances[0]['workflowInfo']['workflowJobsQty']) {
          console.log('jobsQty', instances[0]['workflowInfo']['workflowJobsQty']);
          isEmptyWorkflow.current = true;
        }
        return false;
      });

      // 沒有instance 歷史紀錄
      if (!instances[0].workflowInfo.workflowInstanceId) return;

      // set workflow history 紀錄 , 左邊用
      setworkflowHistory(() => instances);

      // set instances 狀況 右邊使用
      setworkflowInstance(() => instances[0]);
    };
    if (loading) return;
    getInstances();
  }, [loading]);

  // 顯示右邊項目
  const clickWorkflowInatance = (wfi) => {
    setworkflowInstance(() => {
      return { ...wfi };
    });
  };

  // workflow active <= => inactive
  const handleSwitchChange = async () => {
    console.log('switch....');
    console.log('你有這筆workflow的資訊嗎?', workflowInstance);
    if (isEmptyWorkflow.current) {
      alert('此workflow尚未有對應的job, 請建立workflow在調整');
      return;
    }
    console.log('workflowId', workflowid);
    console.log('workflowStatus', workflowStatus);
    const changeWorkflowStatus = !workflowStatus ? 'active' : 'inactive';
    const res = await API.updateWorkflowStatus(workflowid, changeWorkflowStatus);
    console.log(res);
    setWorkflowStatus((prev) => !prev);
  };

  return (
    <Wrapper>
      <HeadWrapper>
        <HeadTitle>{workflowName}</HeadTitle>
        <StyledFormGroup sx={{ display: 'flex' }}>
          <FormControlLabel
            labelPlacement="end"
            control={<IOSSwitch sx={{ m: '1', marginRight: '10px' }} />}
            label={workflowStatus ? 'Active' : 'Inactive'}
            onChange={handleSwitchChange}
            checked={workflowStatus}
            // inputProps={{ 'aria-label': 'controlled' }}
          />
        </StyledFormGroup>
        {/* <WorkflowStatusStyle>{workflowStatus}</WorkflowStatusStyle> */}
        <EditWorkflow to={`/edit/${workflowid}`}>Edit</EditWorkflow>
      </HeadWrapper>
      <MainArea>
        <LeftArea>
          <LeftTitle>History</LeftTitle>
          {workflowHistory.map((wfi) => (
            <LeftWorkflowItems
              key={wfi.workflowInfo.workflowInstanceId}
              onClick={() => clickWorkflowInatance(wfi)}
            >
              <WorkflowInstanceStatusStyle>
                {wfi.workflowInfo.status === 'finished' ? (
                  <LeftWorkflowSuccess />
                ) : (
                  <LeftWorkflowError />
                )}
              </WorkflowInstanceStatusStyle>
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
                      <JobItemTitle>Status</JobItemTitle>
                      <JobItemContent>
                        {workflowInstance.workflowInfo.status.toLowerCase()}
                      </JobItemContent>
                    </WrapperJobItem>
                  </JobConfigWrapper>
                  <JobConfigWrapper>
                    <WrapperJobItem>
                      <JobItemTitle>Type</JobItemTitle>
                      <JobItemContent>
                        {workflowInstance.workflowInfo.trigger_type.toLowerCase()}
                      </JobItemContent>
                    </WrapperJobItem>
                  </JobConfigWrapper>
                  <JobConfigWrapper>
                    <WrapperJobItem>
                      <JobItemTitle>Manual Trigger</JobItemTitle>
                      <JobItemContent>
                        {workflowInstance.workflowInfo.manual_trigger === 't' ? 'true' : 'false'}
                      </JobItemContent>
                    </WrapperJobItem>
                  </JobConfigWrapper>
                  <JobConfigWrapper>
                    <WrapperJobItem>
                      <JobItemTitle>Execution Time</JobItemTitle>
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
            workflowInstance.jobsInfo.map((jobsInstance) => (
              <div key={jobsInstance.jobname}>
                <JobBlock>
                  <JobTilteStyled>{jobsInstance.jobname}</JobTilteStyled>
                  <JobContent>
                    <JobConfigWrapper>
                      <WrapperJobItem>
                        <JobItemTitle>Job Status</JobItemTitle>
                        <JobItemContent>{jobsInstance.job_status}</JobItemContent>
                      </WrapperJobItem>
                    </JobConfigWrapper>
                    <JobItemTitle>{`Job Setting`}</JobItemTitle>
                    {jobsInstance.customer_input &&
                      Object.entries(jobsInstance.customer_input).map(([title, val]) => {
                        return (
                          <JobConfigWrapper key={title}>
                            <WrapperJobItem>
                              <SettingTitle>{`${title}`}</SettingTitle>
                              <JobItemContent>{`${val}`}</JobItemContent>
                            </WrapperJobItem>
                          </JobConfigWrapper>
                        );
                      })}
                    <JobItemTitle>{`Result Output`}</JobItemTitle>
                    {jobsInstance.result_output &&
                      Object.entries(jobsInstance.result_output).map(([title, val]) => {
                        return (
                          <JobConfigWrapper key={title}>
                            <WrapperJobItem>
                              <SettingTitle>{`${title}`}</SettingTitle>
                              <JobItemContent>{`${val}`}</JobItemContent>
                              {/* {Array.isArray(val) ? (
                                Object.entries(val[0]).map(([key, value]) => {
                                  if (key === 'title') {
                                    return (
                                      <JobItemContent>{`${key}: ${value.slice(
                                        0,
                                        17
                                      )}...`}</JobItemContent>
                                    );
                                  }
                                })
                              ) : (
                                <JobItemContent>{`${val}`}</JobItemContent>
                              )} */}
                            </WrapperJobItem>
                          </JobConfigWrapper>
                        );
                      })}
                  </JobContent>
                </JobBlock>
                <BottomArea>
                  <Emptydiv></Emptydiv>
                </BottomArea>
              </div>
            ))}
        </RightArea>
      </MainArea>
    </Wrapper>
  );
};

export default MainContent;
