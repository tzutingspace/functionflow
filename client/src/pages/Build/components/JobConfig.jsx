import { useState, useEffect, useRef, Children } from 'react';
import API from '../../../utils/api';
import styled from 'styled-components';

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
  width: 28%;
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

const JobConfig = ({ functionId, jobData, jobsData, setJobsData, idx }) => {
  // jobConfig紀錄
  const [jobConfigData, setJobConfigData] = useState({}); //jobConfig state
  const { name, description, template_input } = jobConfigData; // 取值
  const [input, setInput] = useState({}); //input state

  // 建立JobConfig時, 去抓取資料, 並紀錄需填寫內容
  useEffect(() => {
    // axios job configs
    const getConfigs = async () => {
      const { data } = await API.getConfigs(functionId);
      const JobConfig = data[0];
      console.log('axios回來的資料', JobConfig);
      // set job config template
      setJobConfigData(JobConfig);

      // 初始化(Input State) 需填入資料

      // 判斷類別
      const tempObj = {};
      JobConfig.template_input.forEach((item) => {
        console.log('檢查一下 jobconfig item type', item);
        if (item.type === 'list') {
          tempObj[item.name] = item.list[0];
        } else if (item.type === 'time') {
          const currentTime = new Date();
          const hours = String(currentTime.getHours()).padStart(2, '0');
          const minutes = String(currentTime.getMinutes()).padStart(2, '0');
          tempObj[item.name] = `${hours}:${minutes}`;
        } else if (item.type === 'date') {
          const currentTime = new Date();
          const year = String(currentTime.getFullYear()).padStart(4, '0');
          const month = String(currentTime.getMonth() + 1).padStart(2, '0');
          const date = String(currentTime.getDate()).padStart(2, '0');
          tempObj[item.name] = `${year}-${month}-${date}`;
        } else {
          tempObj[item.name] = '';
        }
      });

      // 更新初始化(Input State) 需填入資料
      setInput(() => {
        console.log('JOB CONFIG 初始值', { ...tempObj });
        return { ...tempObj };
      });
    };
    getConfigs();
  }, []);

  // 存Job
  async function saveJob() {
    console.log('選擇的function ID=', functionId);
    // 檢查資料是否填寫
    let isEmpty = false;
    for (const key of Object.keys(input)) {
      if (!input[key]) {
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) {
      alert('選項未填寫');
      return false;
    }

    const waitingSaveData = {};
    console.log('初始waitingSaveDate', waitingSaveData);
    // 判斷是否為trigger
    if (idx === 0) {
      // console.log('處理idx=0, 表示是trigger');
      waitingSaveData['id'] = jobData.id;
      waitingSaveData['name'] = jobData.name;
      waitingSaveData['function_id'] = functionId;
      //FIXME: 處理月和周的話怎麼辦
      waitingSaveData['start_time'] = input['Start Time'] + ' ' + input['Daily'] + ':00';
      waitingSaveData['job_number'] = jobsData.length - 1;
      await API.updateWorkflow(waitingSaveData);
    } else {
      waitingSaveData['workflowInfo'] = { id: jobsData[0].id };
      // waitingSaveData['jobsInfo'] = { [idx]: {} };
      waitingSaveData['jobsInfo'] = {
        job_name: jobsData[idx]['name'],
        function_id: functionId,
        sequence: idx,
        config_input: input,
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
      <div>
        <FunctionName>{`${name}`}</FunctionName>
        <FunctionDescription>{` ${description}`}</FunctionDescription>
      </div>
      {template_input &&
        template_input.map((item) => {
          return (
            <ConfigGroup key={item.name}>
              <InputLabel>{`${item.name}:`}</InputLabel>
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
                  onChange={(e) => {
                    let newObj = {};
                    newObj[item.name] = e.target.value;
                    setInput((prev) => {
                      return { ...prev, ...newObj };
                    });
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
              {item.type === 'date' && (
                <ConfigureTime
                  value={input[item.name]}
                  type="date"
                  onChange={(e) => {
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
      <SaveButton onClick={() => saveJob()}>Save Job</SaveButton>
    </>
  );
};

export default JobConfig;
