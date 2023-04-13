import axios from 'axios';

//  方法一
const API = {
  hostname: 'http://localhost:8080/api',
  async getTools() {
    const res = await axios.get(`${this.hostname}/tools`);
    return res.data;
  },
};

// 方法二
const axiosGetData = async (setData, endpoint) => {
  const url = `http://localhost:8080/api${endpoint}`;
  const res = await axios.get(url);
  const { data } = res.data;
  setData(data);
};

export default API;
export { axiosGetData };
