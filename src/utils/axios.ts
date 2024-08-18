// apiClient.js 或 apiClient.ts
import axios from 'axios';

// 创建用于通过代理访问的 apiClient 实例
const apiClient = axios.create({
    baseURL: '/login', // Base URL is the proxy prefix
    headers: {
        'Content-Type': 'application/json'
    }
});

// 创建用于直接访问端口 8085 的 apiClient8085 实例
const apiClient8085 = axios.create({
    baseURL: '/api8085', // Base URL for 8085 port
    headers: {
        'Content-Type': 'application/json'
    }
});

const getTeamClient = axios.create({
    baseURL: '/api8086', // Base URL for 8085 port
    headers: {
        'Content-Type': 'application/json'
    }
});

const getGitlabClient = axios.create({
    baseURL: '/gitlab/projects', // Base URL for 8085 port
    headers: {
        'Content-Type': 'application/json'
    }
});

const getGitlabClientTeams = axios.create({
    baseURL: '/gitlab/teams', // Base URL for 8085 port
    headers: {
        'Content-Type': 'application/json'
    }
});

// 导出两个 axios 实例
export { apiClient, apiClient8085, getTeamClient,getGitlabClient,getGitlabClientTeams};
