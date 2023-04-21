import axios from 'axios';

//  方法一
const API = {
  hostname: 'http://localhost:8080/api',

  // 新增或更新workflow and Job

  async createWorkflow() {
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

  async deployWorkflow(workflowId, workflowInfo) {
    const res = await axios.put(`${this.hostname}/workflow/depoly/${workflowId}`, workflowInfo);
    return res.data;
  },

  // GET function 資訊
  async getTriggers() {
    const res = await axios.get(`${this.hostname}/triggers`);
    return res.data;
  },
  async getTriggerConfigs(id) {
    const res = await axios.get(`${this.hostname}/trigger/${id}`);
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

  //FIXME: userID 要從JWT給 DEMO 暫時寫成/:id
  async getWorkflowByUser() {
    const id = 3;
    const res = await axios.get(`${this.hostname}/workflow/user/${id}`);
    return res.data;
  },

  // Trigger workflow
  async triggerWorkflow(id) {
    const res = await axios.get(`${this.hostname}/trigger/workflow/${id}`);
    return res;
  },
};

export default API;
