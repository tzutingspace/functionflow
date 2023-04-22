import { useState, useEffect, useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import API from '../../../utils/api';
import styled from 'styled-components';
import { WorkflowStateContext } from '../contexts/workflowContext';

const FunctionWrapper = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const FunctionName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const FunctionDescription = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
`;

const InputLabel = styled.div`
  margin-right: 10px;
  font-size: 16px;
`;

const InputDescription = styled.div`
  margin-right: 10px;
  font-size: 12px;
  margin-bottom: 3px;
`;

const ConfigGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ConfigureSelect = styled.select`
  width: 30%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ConfigureOptoin = styled.option`
  width: 30%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ConfigureString = styled.input`
  width: 60%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ConfigureNumber = styled.input`
  width: 28%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ConfigureTime = styled.input`
  width: 28%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const SaveButton = styled.button`
  display: block;
  position: absolute; /* 加入絕對定位 */
  bottom: 20px; /* 距離底部 20px */
  right: 20px; /* 距離右側 20px */
  padding: 10px;
  background-color: #0c0c0c;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  font-size: 14px;
`;

const ReturnValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ReturnValueTitle = styled.div`
  padding: 10px 10px 1px 3px;
  font-size: 12px;
`;

const ReturnValueSet = styled.div`
  display: flex;
  flex-direction: row;
`;

const ReturnValue = styled.div`
  padding: 10px 10px 1px 10px;
  font-size: 12px;
`;

const ReturnValueResult = styled.div`
  padding: 0px 20px;
  font-size: 12px;
`;

const ValueCopy = styled.a`
  padding: 10px 10px 1px 10px;
  font-size: 6px;
  color: #7f7979;
  padding: 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    color: #000;
  }
`;

const JobConfig = ({ jobData, jobsData, setJobsData, idx, workflowTitle }) => {
  // 紀錄是否save過
  const { isJobsSave, setIsJobsSave } = useContext(WorkflowStateContext);

  // jobConfig紀錄
  const [jobConfigData, setJobConfigData] = useState({}); //jobConfig state
  const { name, external_name, description, template_input, template_output } = jobConfigData; // 取值
  const [input, setInput] = useState({}); //input state
  const [copied, setCopied] = useState(false); // 複製用

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

      // 初始化(Input State) 需填入資料
      // 判斷類別
      const tempObj = {};
      tempConfig.template_input.forEach((item) => {
        console.log('檢查 jobconfig', item);
        if (item.type === 'list') {
          tempObj[item.name] = item.list[0];
        } else if (item.type === 'time' || item.type === 'interval') {
          const currentTime = new Date();
          const hours = String(currentTime.getHours()).padStart(2, '0');
          const minutes = String(currentTime.getMinutes()).padStart(2, '0');
          tempObj[item.name] = `${hours}:${minutes}`;
        } else if (item.type === 'datetime-local') {
          const currentTime = new Date();
          const year = String(currentTime.getFullYear()).padStart(4, '0');
          const month = String(currentTime.getMonth() + 1).padStart(2, '0');
          const date = String(currentTime.getDate()).padStart(2, '0');
          const hours = String(currentTime.getHours()).padStart(2, '0');
          const minutes = String(currentTime.getMinutes()).padStart(2, '0');
          tempObj[item.name] = `${year}-${month}-${date} ${hours}:${minutes}`;
        } else if (item.type === 'number') {
          const displayNumber = item.min < 0 ? 1 : item.min;
          tempObj[item.name] = displayNumber;
        } else {
          tempObj[item.name] = '';
        }
      });

      // 更新初始化(Input State) 需填入資料
      setInput(() => {
        return { ...tempObj };
      });
    };

    // 如果沒有資料才去axios資料
    if (!jobData.settingInfo) {
      getConfigs();
    } else {
      console.log('@Job config 顯示舊data');
    }
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
    console.log('初始waitingSaveDate', waitingSaveData);
    if (idx === 0) {
      console.log('處理idx=0, update workflow status');
      waitingSaveData['id'] = jobData.id;
      waitingSaveData['name'] = workflowTitle;
      waitingSaveData['start_time'] = input.start_time;
      waitingSaveData['trigger_function_id'] = jobData['trigger_function_id'];
      waitingSaveData['job_number'] = jobsData.length - 1;
      waitingSaveData['jobsInfo'] = input;
      await API.updateWorkflow(waitingSaveData);
    } else {
      console.log('處理idx!=0, update jobs status');
      console.log('jobConfigData', jobConfigData);
      console.log('jobData', jobsData);
      console.log('jobConfigData template', jobConfigData['template_output']);
      waitingSaveData['workflowInfo'] = { id: jobsData[0].id };
      waitingSaveData['jobsInfo'] = {
        job_name: jobsData[idx]['name'],
        function_id: jobData['function_id'],
        sequence: idx,
        customer_input: input,
      };
      // 新增JOB
      if (!jobsData[idx]['settingInfo']) {
        // waitingSaveData['insertJobSeq'] = idx;
        const jobId = await API.createJob(waitingSaveData);
        waitingSaveData['jobsInfo']['job_id'] = jobId['data'];
        // 更新JOB
      } else {
        console.log('更新job', jobsData[idx]);
        // waitingSaveData['updateJobSeq'] = idx;
        const jobId = jobsData[idx]['settingInfo']['jobsInfo']['job_id'];
        await API.updateJob(jobId, waitingSaveData);
        waitingSaveData['jobsInfo']['job_id'] = jobId;
      }
    }

    // 改變最上層(Block Chain)資料
    setJobsData((prev) => {
      console.log('setting jobs data');
      const index = prev.findIndex((job) => job.uuid === jobData.uuid);
      if (index !== -1) {
        // console.log('最終post資料, 寫回上層settingInfo', waitingSaveData);
        prev[index]['settingInfo'] = waitingSaveData;
      }
      return [...prev];
    });
    console.log('最後jobsData呈現的結果', jobsData);
  }

  return (
    <>
      <FunctionWrapper>
        <FunctionName>{`${external_name}`}</FunctionName>
        <FunctionDescription>{` ${description}`}</FunctionDescription>
      </FunctionWrapper>
      {template_input &&
        template_input.map((item) => {
          return (
            <ConfigGroup key={item.name}>
              <InputLabel>{`${item.label}:`}</InputLabel>
              <InputDescription>{`${item.description}`}</InputDescription>
              {item.type === 'list' && (
                <ConfigureSelect
                  value={input[item.name]}
                  onChange={(e) => {
                    let newObj = {};
                    newObj[item.name] = e.target.value;
                    setInput((prev) => {
                      console.log('onchange', { ...prev, ...newObj });
                      return { ...prev, ...newObj };
                    });
                  }}
                >
                  {item.list.map((opt) => {
                    return <ConfigureOptoin key={opt}>{opt}</ConfigureOptoin>;
                  })}
                </ConfigureSelect>
              )}
              {item.type === 'string' && (
                <ConfigureString
                  value={input[item.name]}
                  placeholder={item.name}
                  onChange={(e) => {
                    let newObj = {};
                    newObj[item.name] = e.target.value;
                    setInput((prev) => {
                      return { ...prev, ...newObj };
                    });
                  }}
                ></ConfigureString>
              )}
              {item.type === 'number' && (
                <ConfigureNumber
                  value={input[item.name]}
                  type="number"
                  max={item.max}
                  min={item.min}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    let newObj = {};
                    if (!isNaN(value) && value >= item.min && value <= item.max) {
                      newObj[item.name] = e.target.value;
                      setInput((prev) => {
                        return { ...prev, ...newObj };
                      });
                    }
                  }}
                ></ConfigureNumber>
              )}
              {item.type === 'time' && (
                <ConfigureTime
                  value={input[item.name]}
                  type="time"
                  onChange={(e) => {
                    let newObj = {};
                    newObj[item.name] = e.target.value;
                    setInput((prev) => {
                      return { ...prev, ...newObj };
                    });
                  }}
                ></ConfigureTime>
              )}
              {item.type === 'datetime-local' && (
                <ConfigureTime
                  value={input[item.name]}
                  type="datetime-local"
                  onChange={(e) => {
                    console.log('時間值', e.target.value);
                    let newObj = {};
                    newObj[item.name] = e.target.value;
                    setInput((prev) => {
                      return { ...prev, ...newObj };
                    });
                  }}
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
              <>
                <ReturnValueSet>
                  <ReturnValue key={item.name}>{`steps.${jobData.name}.${item.name}`}</ReturnValue>
                  <CopyToClipboard
                    text={`{{steps.${jobData.name}.${item.name}}}`}
                    onCopy={() => setCopied(true)}
                  >
                    <ValueCopy type="button">Copy</ValueCopy>
                  </CopyToClipboard>
                </ReturnValueSet>
                <ReturnValueResult>{`return_value_type: ${item.type}`}</ReturnValueResult>
              </>
            );
          })}
      </ReturnValueWrapper>
      <SaveButton onClick={() => saveJob()}>Save Job</SaveButton>
    </>
  );
};

export default JobConfig;
