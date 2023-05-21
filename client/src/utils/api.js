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
    console.log('signup', res);
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
    // console.log('@api, getProfile token', jwt);
    const res = await axios.get(`${this.hostname}/user/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data.data;
  },

  // OAuth2
  async getDiscordChannel(code, jwt) {
    console.log('@getDiscordChannel', code);
    const res = await axios.get(`${this.hostname}/oauth2/token?code=${code}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log('res', res);
    return res.data.data.systemChannelId;
  },

  // 取得目前授權app accounts
  async getAppAccounts(jwt) {
    const res = await axios.get(`${this.hostname}/app-accounts`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log('res', res);
    return res.data;
  },

  // 新增或更新workflow and Job
  async createWorkflow(jwt) {
    console.log('@API', jwt);
    const res = await axios.post(
      `${this.hostname}/workflow`,
      { data: null },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return res.data;
  },
  async updateWorkflow(workflowInfo, jwt) {
    const id = workflowInfo.id;
    const res = await axios.put(
      `${this.hostname}/workflow/${id}`,
      { workflowInfo },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return res.data;
  },
  async changeWorkflowStatus(workflowId, changeStatus, jwt) {
    console.log('changeStatus', changeStatus);
    const res = await axios.put(
      `${this.hostname}/workflow/${workflowId}/status`,
      { changeStatus },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return res.data;
  },
  async createJob(jobInfo, jwt) {
    const res = await axios.post(`${this.hostname}/job`, jobInfo, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  },
  async updateJob(jobId, jobInfo, jwt) {
    const res = await axios.put(`${this.hostname}/job/${jobId}`, jobInfo, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  },
  async deployWorkflow(workflowId, workflowInfo, jwt) {
    const res = await axios.put(`${this.hostname}/workflow/${workflowId}/deploy`, workflowInfo, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
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
    const res = await axios.get(`${this.hostname}/workflow-and-job/${workflowId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  },
  // 抓取 instances 紀錄
  async getInstance(workflowId, jwt) {
    console.log('@get Instance', workflowId);
    const res = await axios.get(`${this.hostname}/instances/${workflowId}`, {
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
    const res = await axios.get(`${this.hostname}/triggers/${id}`);
    return res.data;
  },
  async getTools(type = 'all') {
    const res = await axios.get(`${this.hostname}/tools/${type}`);
    return res.data;
  },
  async getConfigs(id) {
    const res = await axios.get(`${this.hostname}/tools/${id}`);
    return res.data;
  },

  async getWorkflowByUser(jwt) {
    const res = await axios.get(`${this.hostname}/workflows`, {
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
