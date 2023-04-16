import axios from 'axios';

//  方法一
const API = {
  hostname: 'http://localhost:8080/api',

  async createWorkflow() {
    //FIXME: 暫時用固定值
    const res = await axios.post(`${this.hostname}/workflow`);
    return res.data;
  },
  async updateWorkflow(workflowInfo) {
    const id = workflowInfo.id;
    const res = await axios.put(`${this.hostname}/workflow/${id}`, { workflowInfo });
    return res.data;
  },
  async createJob(jobInfo) {
    const res = await axios.post(`${this.hostname}/job`, jobInfo);
    return res.data;
  },
  async updateJob(jobId, jobInfo) {
    const res = await axios.put(`${this.hostname}/job/${jobId}`, jobInfo);
    return res.data;
  },
  async getTools(typer = '') {
    const res = await axios.get(`${this.hostname}/tools/${typer}`);
    return res.data;
  },
  async getConfigs(id) {
    const res = await axios.get(`${this.hostname}/tool/${id}`);
    return res.data;
  },
};

export default API;
