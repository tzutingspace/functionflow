import { useState, useEffect, useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import styled from 'styled-components';

import API from '../../../utils/api';
import Discord from '../../../components/Discord';
import { formatInputDate } from '../../../utils/utils';

import { WorkflowStateContext } from '..';

const FunctionWrapper = styled.div`
  padding-bottom: 10px;
`;

const FunctionName = styled.div`
  font-size: 26px;
  font-weight: bold;
  color: #20315b;
`;

const FunctionDescription = styled.div`
  margin-left: 8px;
  font-size: 16px;
  color: #20315b;
`;

const InputLabel = styled.div`
  color: #20315b;
  font-size: 22px;
  font-weight: 500;
`;

const InputDescription = styled.div`
  color: #20315b;
  margin-left: 14px;
  font-size: 14px;
  margin-bottom: 3px;
`;

const ConfigGroup = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 85%;
  padding: 8px 8px; /* 內邊距 */
  background-color: #f3ecda;
  border-radius: 10px;
  margin-bottom: 10px;
  margin-left: 20px;
`;

const ConfigureSelect = styled.select`
  box-sizing: border-box;
  max-width: 250px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 14px;
`;

const ConfigureOption = styled.option`
  box-sizing: border-box;
  min-width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 14px;
`;

const ConfigureString = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 14px;
  max-width: 250px;
`;

const ConfigureNumber = styled.input`
  box-sizing: border-box;
  max-width: 250px;
  min-width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 14px;
`;

const ConfigureTime = styled.input`
  width: 60%;
  min-width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 14px;
`;

const SaveButton = styled.button`
  display: block;
  position: absolute; /* 加入絕對定位 */
  bottom: 25px; /* 距離底部 20px */
  right: 20px; /* 距離右側 20px */
  padding: 10px;
  background-color: #20315b;
  color: #dfd1aa;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  font-size: 18px;
`;

const ReturnValueWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 85%;
  padding: 8px 8px; /* 內邊距 */
  background-color: #f3ecda;
  border-radius: 10px;
  margin-bottom: 10px;
  margin-left: 20px;
`;

const ReturnValueTitle = styled.div`
  padding: 0px 10px 1px 3px;
  font-size: 18px;
`;

const ReturnValueSet = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ReturnValue = styled.div`
  padding: 0px 10px 0px 10px;
  font-size: 14px;
  border: none;
`;

const ReturnValueResult = styled.div`
  padding: 0px 10px 0px 10px;
  font-size: 14px;
`;

const ValueCopy = styled.a`
  padding: 0px 10px 0px 10px;
  font-size: 14px;
  color: #b6abab;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    color: #000;
  }
`;

const JobConfig = ({ jobData, idx }) => {
  const { workflowJobs, setWorkflowJobs } = useContext(WorkflowStateContext);

  // 紀錄是否save過
  const [isSave, setIsSave] = useState(false);

  // jobConfig紀錄
  const [jobConfigData, setJobConfigData] = useState({}); //jobConfig state
  const { name, external_name, description, template_input, template_output } = jobConfigData; // 取值
  const [input, setInput] = useState({}); //input state
  const [copied, setCopied] = useState(false); // 複製用

  // Discord 用
  // const [channelId, setChannelId] = useState('');

  // 建立JobConfig (抓取資料, 並紀錄需填寫內容)
  useEffect(() => {
    // axios job configs
    const getConfigs = async () => {
      let functionId = jobData['function_id'];
      if (idx === 0) {
        functionId = jobData['trigger_function_id'];
      }
      let tempConfig;
      if (idx === 0) {
        const { data } = await API.getTriggerConfigs(functionId);
        tempConfig = data[0];
        setJobConfigData(tempConfig);
      } else {
        const { data } = await API.getConfigs(functionId);
        tempConfig = data[0];
        setJobConfigData(tempConfig);
      }

      // 判斷類別
      const tempObj = {};
      tempConfig.template_input.forEach((item) => {
        console.log('檢查 jobconfig', item);
        if (item.type === 'list') {
          tempObj[item.name] = item.list[0];
          // edit 專用
          if (jobData.settingInfo) {
            tempObj[item.name] = jobData.settingInfo.customer_input[item.name];
          }
        } else if (item.type === 'time' || item.type === 'interval') {
          const currentTime = new Date();
          const hours = String(currentTime.getHours()).padStart(2, '0');
          const minutes = String(currentTime.getMinutes()).padStart(2, '0');
          tempObj[item.name] = `${hours}:${minutes}`;
          if (jobData.settingInfo) {
            tempObj[item.name] = jobData.settingInfo.customer_input[item.name];
          }
        } else if (item.type === 'datetime-local') {
          const currentTime = new Date();
          const year = String(currentTime.getFullYear()).padStart(4, '0');
          const month = String(currentTime.getMonth() + 1).padStart(2, '0');
          const date = String(currentTime.getDate()).padStart(2, '0');
          const hours = String(currentTime.getHours()).padStart(2, '0');
          const minutes = String(currentTime.getMinutes()).padStart(2, '0');
          tempObj[item.name] = `${year}-${month}-${date} ${hours}:${minutes}`;
          if (jobData.settingInfo) {
            tempObj[item.name] = formatInputDate(jobData.settingInfo.customer_input[item.name]);
          }
        } else if (item.type === 'number') {
          const displayNumber = item.min < 0 ? 1 : item.min;
          tempObj[item.name] = displayNumber;
          if (jobData.settingInfo) {
            tempObj[item.name] = jobData.settingInfo.customer_input[item.name];
          }
        } else {
          tempObj[item.name] = '';
          if (jobData.settingInfo) {
            tempObj[item.name] = jobData.settingInfo.customer_input[item.name];
          }
        }
      });

      // 更新初始化(Input State) 需填入資料
      setInput(() => {
        return { ...tempObj };
      });
    };
    getConfigs();
  }, []);

  // 存Job
  async function saveJob() {
    // 檢查資料是否填寫
    let isEmpty = false;
    for (const key of Object.keys(input)) {
      if (!input[key]) {
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) {
      alert('您尚有選項未填寫');
      return false;
    }

    // 處理 post data
    const waitingSaveData = {};
    if (idx === 0) {
      // Trigger
      waitingSaveData['id'] = jobData.workflow_id;
      waitingSaveData['name'] = workflowJobs[0].workflow_name;
      waitingSaveData['start_time'] = input.start_time;
      waitingSaveData['trigger_function_id'] = jobData['trigger_function_id'];
      waitingSaveData['job_number'] = workflowJobs.length - 1;
      waitingSaveData['jobsInfo'] = input;
      const res = await API.updateWorkflow(waitingSaveData);
      console.log('idx==0, res:', res);
      setIsSave(true);
    } else {
      // JOB
      waitingSaveData['workflowInfo'] = { id: workflowJobs[0].workflow_id };

      waitingSaveData['jobsInfo'] = {
        job_name: workflowJobs[idx]['job_name'],
        function_id: jobData['function_id'],
        sequence: idx,
        customer_input: input,
      };
      if (!workflowJobs[idx]['settingInfo']) {
        // 新增JOB
        const res = await API.createJob(waitingSaveData);
        // 取得新加的jobId
        waitingSaveData['jobsInfo']['job_id'] = res['data'];
        console.log('create a job. res:', res);
      } else {
        // 更新JOB
        console.log('更新job', workflowJobs[idx]);
        // edit 專用
        const jobId = workflowJobs[idx]['job_id'];
        const res = await API.updateJob(jobId, waitingSaveData);
        waitingSaveData['jobsInfo']['job_id'] = jobId; // FIXME: 要更新嗎？
        console.log('update a job. res:', res);
      }
      setIsSave(true);
    }

    // 改變最上層(Block Chain)資料
    setWorkflowJobs((prev) => {
      console.log('setWorkflowJobs data');
      const index = prev.findIndex((job) => job.job_id === jobData.job_id);
      if (index !== -1) {
        // console.log('最終post資料, 寫回上層settingInfo', waitingSaveData);
        prev[index]['settingInfo'] = waitingSaveData;
      }
      return [...prev];
    });
    console.log('最後jobsData呈現的結果', workflowJobs);
  }

  // 變更數字job
  const changeNumJob = (e, item) => {
    console.log('變更數字 job', 'e:', e.target.value, 'item:', item);
    const value = parseInt(e.target.value, 10);
    let newObj = {};
    if (!isNaN(value) && value >= item.min && value <= item.max) {
      newObj[item.name] = e.target.value;
      setInput((prev) => {
        return { ...prev, ...newObj };
      });
    }
    setIsSave(false);
  };

  // 變更job
  const changeJob = (e, item) => {
    console.log('變更job', 'e:', e.target.value, 'item:', item);
    let newObj = {};
    newObj[item.name] = e.target.value;
    setInput((prev) => {
      console.log('@setInput , onchange', { ...prev, ...newObj });
      return { ...prev, ...newObj };
    });
    setIsSave(false);
  };

  return (
    <>
      <FunctionWrapper>
        <FunctionName>{`${external_name}`}</FunctionName>
        <FunctionDescription>{` ${description}`}</FunctionDescription>
      </FunctionWrapper>
      {template_input &&
        template_input.map((item) => {
          console.log('template input', item);
          return (
            <ConfigGroup key={item.name}>
              <InputLabel>{`${item.label}:`}</InputLabel>
              {item.description && <InputDescription>{`${item.description}`}</InputDescription>}
              {item.type === 'list' && (
                <ConfigureSelect value={input[item.name]} onChange={(e) => changeJob(e, item)}>
                  {item.list.map((opt) => {
                    return <ConfigureOption key={opt}>{opt}</ConfigureOption>;
                  })}
                </ConfigureSelect>
              )}
              {item.type === 'appInfo' && item.appProp === 'discord' && (
                <>
                  {!input[item.name] && <Discord item={item} setInput={setInput}></Discord>}
                  <ConfigureString
                    value={input[item.name]}
                    placeholder={'Your Discord channel ID'}
                    readOnly
                  ></ConfigureString>
                </>
              )}
              {item.type === 'string' && (
                <ConfigureString
                  value={input[item.name]}
                  placeholder={item.name}
                  onChange={(e) => changeJob(e, item)}
                ></ConfigureString>
              )}
              {item.type === 'number' && (
                <ConfigureNumber
                  value={input[item.name]}
                  type="number"
                  max={item.max}
                  min={item.min}
                  onChange={(e) => changeNumJob(e, item)}
                ></ConfigureNumber>
              )}
              {item.type === 'time' && (
                <ConfigureTime
                  value={input[item.name]}
                  type="time"
                  onChange={(e) => changeJob(e, item)}
                ></ConfigureTime>
              )}
              {item.type === 'datetime-local' && (
                <ConfigureTime
                  value={input[item.name]}
                  type="datetime-local"
                  onChange={(e) => changeJob(e, item)}
                ></ConfigureTime>
              )}
            </ConfigGroup>
          );
        })}
      <ReturnValueWrapper>
        {template_output && template_output.length !== 0 ? (
          <ReturnValueTitle>$return_value:</ReturnValueTitle>
        ) : (
          <></>
        )}
        {template_output &&
          template_output.map((item) => {
            return (
              <div key={item.name}>
                <ReturnValueSet key={item.name}>
                  <ReturnValue>{`return_name: ${item.name}`}</ReturnValue>
                  <CopyToClipboard
                    text={`{{steps.${jobData.job_name}.${item.name}}}`}
                    onCopy={() => setCopied(true)}
                  >
                    <ValueCopy type="button">Copy</ValueCopy>
                  </CopyToClipboard>
                </ReturnValueSet>
                <ReturnValueResult>{`return_value_type: ${item.type}`}</ReturnValueResult>
              </div>
            );
          })}
      </ReturnValueWrapper>
      {!isSave && <SaveButton onClick={() => saveJob()}>Save Job</SaveButton>}
    </>
  );
};

export default JobConfig;
