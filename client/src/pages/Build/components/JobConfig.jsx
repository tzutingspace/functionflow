import { useState, useEffect, useRef } from 'react';
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

const JobConfig = ({ id }) => {
  const [jobConfigData, setJobConfigData] = useState({});
  const { name, description, template_input } = jobConfigData;
  const [input, setInput] = useState({});

  useEffect(() => {
    const getConfigs = async () => {
      const { data } = await API.getConfigs(id);
      const JobConfig = data[0];
      setJobConfigData(JobConfig);
      const Obj = {};
      JobConfig.template_input.forEach((item) => {
        if (item.type === 'list') {
          Obj[item.name] = item.list[0];
        } else if (item.type !== 'list') {
          Obj[item.name] = '';
        }
      });
      setInput((prev) => {
        return { ...prev, ...Obj };
      });
    };
    getConfigs();
  }, []);

  async function saveJob(e, name) {
    console.log(e, name);
    Object.keys(input).forEach((data) => {
      console.log(input[data]);
      console.log(data);
    });

    const res = await API.saveJob(input);
  }
  return (
    <>
      <div>
        <div>{`Funcition Name: ${name}: ${description}`}</div>
        <button
          onClick={(e) => {
            saveJob(e);
          }}
        >
          Save Job
        </button>
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
            </ConfigGroup>
          );
        })}
    </>
  );
};

export default JobConfig;
