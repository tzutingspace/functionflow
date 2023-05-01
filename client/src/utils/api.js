import axios from 'axios';

const API = {
  hostname: process.env.REACT_APP_API_URL,

  // user 相關
  async signup(data) {
    console.log('signup', data);
    const res = await axios.post(`${this.hostname}/user/signup`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data.data;
  },
  async login(data) {
    console.log('login', data);
    const res = await axios.post(`${this.hostname}/user/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data.data;
  },
  async getProfile(jwt) {
    // console.log('@api, getprofile token', jwt);
    const res = await axios.get(`${this.hostname}/user/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data.data;
  },

  // OAuth2
  async getDiscordChannel(code) {
    console.log('@getDiscordChannel', code);
    const res = await axios.get(`${this.hostname}/oauth2/token?code=${code}`);
    console.log('res', res);
    return res.data.data.systemChannelId;
  },

  // 新增或更新workflow and Job
  async createWorkflow(jwt) {
    console.log('@API', jwt);
    //FIXME: post 可以不給data？
    const data = { data: 'empty' };
    const res = await axios.post(`${this.hostname}/workflow`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  },
  async updateWorkflow(workflowInfo) {
    const id = workflowInfo.id;
    const res = await axios.put(`${this.hostname}/workflow/${id}`, { workflowInfo });
    return res.data;
  },
  async updateWorkflowStatus(workflowId, changeStatus) {
    console.log('changeStatus', changeStatus);
    const id = workflowId;
    const res = await axios.put(`${this.hostname}/workflow/status/${id}`, { changeStatus });
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
  async deleteWorkflows(workflowIds, jwt) {
    console.log('@delete workflowIds', workflowIds);
    const res = await axios.delete(`${this.hostname}/workflows/`, {
      data: workflowIds,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  },

  // Edit 先前的workflow
  async getWorkflowAndJob(workflowId, jwt) {
    const res = await axios.get(`${this.hostname}/workflowandjob/${workflowId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  },
  // 抓取intances 紀錄
  async getInstance(workflowId, jwt) {
    console.log('@get Instance', workflowId);
    const res = await axios.get(`${this.hostname}/instance/${workflowId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data.data;
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
  async getWorkflowByUser(userId, jwt) {
    const res = await axios.get(`${this.hostname}/workflow/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  },
  // Trigger workflow
  async triggerWorkflow(id, socketId, jwt) {
    const data = { socketId };
    const res = await axios.post(`${this.hostname}/trigger/workflow/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  },
};

export default API;
