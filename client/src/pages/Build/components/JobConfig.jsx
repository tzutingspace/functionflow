import { useState, useEffect, useRef, Children } from 'react';
import API from '../../../utils/api';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
`;

const ConfigGroup = styled.div``;
const ConfigureSelect = styled.select``;
const ConfigureOptoin = styled.option``;
const ConfigureString = styled.input``;
const ConfigureNumber = styled.input``;
const ConfigureTime = styled.input``;

const JobConfig = ({ functionId, jobData, jobsData, setJobsData, idx }) => {
  // jobConfig紀錄
  const [jobConfigData, setJobConfigData] = useState({}); //jobConfig state
  const { name, description, template_input } = jobConfigData; // 取值
  const [input, setInput] = useState({}); //input state
  // const [output, setOutput] = useState(); // 暫時不用利用多的state去記output

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
        console.log('JOB CONFIG 初始值', tempObj);
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
      console.log('處理idx=0, 表示是trigger');
      waitingSaveData['id'] = jobData.id;
      waitingSaveData['function_id'] = functionId;
      //FIXME: 處理月和周的話怎麼辦
      waitingSaveData['start_time'] = input['Start Time'] + ' ' + input['Daily'] + ':00';
      waitingSaveData['job_number'] = jobsData.length;
      await API.updateWorkflow(waitingSaveData);
    } else {
      console.log('處理job');
      waitingSaveData['workflowInfo'] = { id: jobsData[0].id };
      waitingSaveData['jobsInfo'] = { [idx]: {} };
      waitingSaveData['jobsInfo'][idx] = {
        job_name: jobsData[idx]['name'],
        function_id: functionId,
        sequence: idx,
        config_input: input,
      };
      // 新增
      if (!jobsData[idx]['settingInfo']) {
        waitingSaveData['insertJobSeq'] = idx;
        const jobId = await API.createJob(waitingSaveData);
        waitingSaveData['jobsInfo']['job_id'] = jobId['data'];
      } else {
        // 更新
        waitingSaveData['updateJobSeq'] = idx;
        const jobId = jobsData[idx]['settingInfo']['jobsInfo']['job_id'];
        await API.updateJob(jobId, waitingSaveData);
      }
    }

    // 改變最上層(Block Chain)資料
    setJobsData((prev) => {
      const index = prev.findIndex((job) => job.uuid === jobData.uuid);
      if (index !== -1) {
        console.log('最終post資料, 寫回上層settingInfo', waitingSaveData);
        prev[index]['settingInfo'] = waitingSaveData;
      }
      return [...prev];
    });
    console.log('最後jobsData呈現的結果', jobsData);
  }

  return (
    <>
      <div>
        <div>{`Funcition Name: ${name}: ${description}`}</div>
        <button onClick={() => saveJob()}>Save Job</button>
      </div>
      {template_input &&
        template_input.map((item) => {
          return (
            <ConfigGroup key={item.name}>
              <div>{`${item.name}: ${item.description}`}</div>
              {item.type === 'list' && (
                <ConfigureSelect
                  value={input[item.name]}
                  onChange={(e) => {
                    let newObj = {};
                    newObj[item.name] = e.target.value;
                    setInput((prev) => {
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
      {/* {output && <div>{`預期結果${output}`}</div>} */}
    </>
  );
};

export default JobConfig;
