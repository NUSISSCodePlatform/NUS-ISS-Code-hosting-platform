<template>
  <div>
    <div class="app-container">
      <div class="app-header">
        <div class="app-header-left">
          <span class="app-icon"></span>
          <p class="app-name">NUS ISS Code Hosting Platform</p>
        </div>
        <div class="app-header-right">
          <el-dropdown>
            <i class="el-icon-setting bigger-icon" style="margin-left: 10px;"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="jumpModify(userName)">
                  Modify Information
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="logout">
                  Log Out
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="profile-btn">
            <span>{{userName}}</span>
          </div>
        </div>
        <button class="messages-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        </button>
      </div>
      <div class="app-content">
        <div class="app-sidebar">
          <a class="app-sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home" @click="goToCourses">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" /></svg>
          </a>
        </div>
        <div class="projects-section">
          <div class="projects-section-header">
            <p>Groups</p>
          </div>
          <div>
            <el-collapse>
              <el-collapse-item v-for="(item, index) in displayedTeams" :key="index" style="width: 100%">
                <template slot="title">
                  <span style="float: left; font-weight: bold; font-size: 28px; color: #2C8DF4;">
                  <div>
                      Team {{ item.team_name }}
                  </div>
                  </span>
                </template>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex;">
                    <div v-for="(membersDetail, index2) in item.users" :key="index2" style="font-size: 30px">
                      {{ membersDetail.student_name }}<span>&nbsp;</span>
                    </div>
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                  <button v-if="shouldShowKnowMore(item)" style="font-weight: bold; font-size: 14px; color: #2C8DF4;" @click="handleKnowMore(item)">
                    Know More
                  </button>
                  <button v-if="shouldShowLeave(item)" style="font-weight: bold; font-size: 14px; color: #2C8DF4;" @click="handleLeave(item)">
                    Leave
                  </button>
                  <button v-if="shouldShowJoin(item)" style="font-weight: bold; font-size: 14px; color: #2C8DF4;" @click="handleJoin(item)">
                    Join
                  </button>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totalItems"
                :page-size="pageSize"
                style="text-align: center; margin-top: 20px;">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {apiClient, getTeamClient} from "@/utils/axios";
import {Message} from "element-ui";

export default {
  name: 'People',
  computed: {
    // 根据当前页码和每页数量动态显示的团队
    displayedTeams() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.teams.slice(startIndex, endIndex);
    },
    // 计算总项目数（用于分页器）
    totalItems() {
      console.log(this.teams.length)
      return this.teams.length;
    },
    isUserInAnyTeam() {
      return this.teams.some(team =>
          team.users.some(user => user.student_name === this.userName)
      )
    }
  },
  created() {
    this.fetchTeams();
    this.getCurrentTime();
  },
  data() {
    return {
      teams: [], // 初始化团队列表为空
      teamMembers: [],
      pageSize: 2, // 每页显示的团队数量
      currentPage: 1, // 当前页码
      userName:localStorage.getItem('username'),
      groupDDLtime:'',
      currentTime:'',
    };
  },
  mounted() {
    document.addEventListener('DOMContentLoaded', () => {
      var modeSwitch = document.querySelector('.mode-switch');

      modeSwitch.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        modeSwitch.classList.toggle('active');
      });

      var listView = document.querySelector('.list-view');
      var gridView = document.querySelector('.grid-view');
      var projectsList = document.querySelector('.project-boxes');

      listView.addEventListener('click', () => {
        gridView.classList.remove('active');
        listView.classList.add('active');
        projectsList.classList.remove('jsGridView');
        projectsList.classList.add('jsListView');
      });

      gridView.addEventListener('click', () => {
        gridView.classList.add('active');
        listView.classList.remove('active');
        projectsList.classList.remove('jsListView');
        projectsList.classList.add('jsGridView');
      });

      document.querySelector('.messages-btn').addEventListener('click', () => {
        document.querySelector('.messages-section').classList.add('show');
      });

      document.querySelector('.messages-close').addEventListener('click', () => {
        document.querySelector('.messages-section').classList.remove('show');
      });
    });
  },
  methods: {
    async fetchTeams() {
      const token = localStorage.getItem('token'); // 从 localStorage 获取 JWT token
      this.userName = localStorage.getItem('username'); // 从 token 中获取用户名
      const course = this.$route.params.course; // 从路由参数中获取课程名
      console.log(course)
      try {
        const response = await getTeamClient.get(`/get/${course}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        console.log(response)
        if (response.data.code === 200) {
          this.teams = response.data.data; // 将 response.data 存储到 teams 数组中
          this.groupDDLtime=response.data.data[0].deadline;
          console.log(this.groupDDLtime)
        } else {
          console.error('Error fetching teams:', response.msg);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    },
    async logout() {
      try {
        const response = await apiClient.post('/users/logout'); // Use the custom Axios instance
        console.log(response);
        if (response.data.code === 200) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('userId');
          Message.success('Logout successful');
          this.$router.push('/');
        } else {
          Message.error('Logout failed');
        }
      } catch (error) {
        Message.error('Logout failed');
      }
    },
    async handleJoin(team) {
      try {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 JWT token

        const response = await getTeamClient.post('/join', {
          username: this.userName,
          size: team.users.length,
          teamId: team.id
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response)
        if (response.data.code===200) {
          alert('Successfully joined to the team!');
          this.fetchTeams(); // 刷新团队信息
        } else {
          alert('Failed to joined the team.');
        }
      } catch (error) {
        console.error('Error joined teams:', error);
      }
    },
    handleKnowMore(team) {
      const currentPath = this.$route.path;
      const teamid = String(team.id);
      const formattedCourseName = teamid.replace(/\s+/g, '').toLowerCase();
      this.$router.push(`${currentPath}/${formattedCourseName}/projectInfo`).catch(err => {
        console.error(err);
      });
    },
    async handleLeave(team) {
      try {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 JWT token
        console.log("click")
        const response = await getTeamClient.post('/leave', {
          username: this.userName,
          size: team.users.length,
          teamId: team.id
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response)
        if (response.data.code===200) {
          alert('Successfully leave to the team!');
          this.fetchTeams(); // 刷新团队信息
        } else {
          alert('Failed to leave the team.');
        }
      } catch (error) {
        console.error('Error switching teams:', error);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    jumpModify(name) {
      if (this.$route.name !== 'modify') {
        const formattedName = name.replace(/\s+/g, '').toLowerCase();
        this.$router.push(`/${formattedName}/modify`);
      }
    },
    getCurrentTime() {
      //获取当前时间并打印
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();

      // 将月份和日期格式化为两位数
      mm = mm < 10 ? '0' + mm : mm;
      dd = dd < 10 ? '0' + dd : dd;

      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
      this.currentTime = _this.gettime;
      console.log(_this.gettime)
    },
    goToCourses() {
      this.$router.push(`/courses`);
    },
    goToAnnounce() {
      this.$router.push(`/announcement`).catch(err => {
        console.error(err);
      });
    },
    shouldShowKnowMore(team) {
      // 只有在当前时间超过截止时间，并且用户在当前组时，才显示Know more按钮
      return this.currentTime > this.groupDDLtime && this.isInCurrentTeam(team);
    },

    isInCurrentTeam(team) {
      return team.users.some(user => user.student_name === this.userName);
    },

    shouldShowLeave(team) {
      // 只有在截止时间之前才显示leave按钮，并且当前用户在当前team中
      return this.currentTime <= this.groupDDLtime && this.isInCurrentTeam(team);
    },

    shouldShowJoin(team) {
      // 只有在截止时间之前，且当前用户不在任何一个team中时，所有team显示join按钮
      return this.currentTime <= this.groupDDLtime && !this.teams.some(t => this.isInCurrentTeam(t));
    }
  }
};
</script>


<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=DM+Sans:400,500,700&display=swap");

* {
  box-sizing: border-box;
}

:root {
  --app-container: #f3f6fd;
  --main-color: #1f1c2e;
  --secondary-color: #4A4A4A;
  --link-color: #1f1c2e;
  --link-color-hover: #c3cff4;
  --link-color-active: #fff;
  --link-color-active-bg: #1f1c2e;
  --projects-section: #fff;
  --message-box-hover: #fafcff;
  --message-box-border: #e9ebf0;
  --more-list-bg: #fff;
  --more-list-bg-hover:  #f6fbff;
  --more-list-shadow: rgba(209, 209, 209, 0.4);
  --button-bg: #1f1c24;
  --search-area-bg: #fff;
  --star: #1ff1c2e;
  --message-btn: #fff;
}

.dark:root {
  --app-container: #1f1d2b;
  --app-container: #111827;
  --main-color: #fff;
  --secondary-color: rgba(255,255,255,.8);
  --projects-section: #1f2937;
  --link-color: rgba(255,255,255,.8);
  --link-color-hover: rgba(195, 207, 244, 0.1);
  --link-color-active-bg: rgba(195, 207, 244, 0.2);
  --button-bg: #1f2937;
  --search-area-bg: #1f2937;
  --message-box-hover: #243244;
  --message-box-border: rgba(255,255,255,.1);
  --star: #ffd92c;
  --light-font: rgba(255,255,255,.8);
  --more-list-bg: #2f3142;
  --more-list-bg-hover:  rgba(195, 207, 244, 0.1);
  --more-list-shadow: rgba(195, 207, 244, 0.1);
  --message-btn: rgba(195, 207, 244, 0.1);
}

html, body {
  width: 100%;
  height: 100vh;
  margin: 0;
}

body {
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
  display: flex;
  justify-content: center;
  background-color: var(--app-container);
}

button, a {
  cursor: pointer;
}

.app {
  &-container {
    width: 1710px;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--app-container);
    transition: .2s;
    max-width: 1800px;

    button, input, optgroup, select, textarea {
      font-family: 'DM Sans', sans-serif;
    }
  }

  &-content {
    display: flex;
    height: 100%;
    overflow: hidden;
    padding: 16px 24px 24px 0;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 16px 24px;
    position: relative;

    &-left, &-right {
      display: flex;
      align-items: center;
    }

    &-left { flex-grow: 1; }

    &-right button {
      margin-left: 10px;
    }
  }

  &-icon {
    width: 26px;
    height: 2px;
    border-radius: 4px;
    background-color: var(--main-color);
    position: relative;

    &:before, &:after {
      content: '';
      position: absolute;
      width: 12px;
      height: 2px;
      border-radius: 4px;
      background-color: var(--main-color);
      left: 50%;
      transform: translatex(-50%);
    }

    &:before { top: -6px; }
    &:after { bottom: -6px; }
  }

  &-name {
    color: var(--main-color);
    margin: 0;
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    margin: 0 32px;
  }
}

.mode-switch {
  background-color: transparent;
  border: none;
  padding: 0;
  color: var(--main-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-wrapper {
  border-radius: 20px;
  background-color: var(--search-area-bg);
  padding-right: 12px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 480px;
  color: var(--light-font);
  box-shadow: 0 2px 6px 0 rgba(136,148,171,.2),0 24px 20px -24px rgba(71,82,107,.1);
  overflow: hidden;

  .dark & { box-shadow: none; }
}

.search-input {
  border: none;
  flex: 1;
  outline: none;
  height: 100%;
  padding: 0 20px;
  font-size: 16px;
  background-color: var(--search-area-bg);
  color: var(--main-color);

  &:placeholder {
    color: var(--main-color);
    opacity: .6;
  }
}

.add-btn {
  color: #fff;
  background-color: var(--button-bg);
  padding: 0;
  border: 0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-btn {
  color: var(--main-color);
  padding: 0;
  border: 0;
  background-color: transparent;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-btn {
  padding: 0;
  border: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  padding-left: 12px;
  border-left: 2px solid #ddd;

  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 4px;
  }

  span {
    color: var(--main-color);
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
  }
}

.page-content {
  flex: 1;
  width: 100%;
}

.app-sidebar {
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &-link {
    color: var(--main-color);
    color: var(--link-color);
    margin: 16px 0;
    transition: .2s;
    border-radius: 50%;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: var(--link-color-hover);
      color: var(--link-color-active);
    }

    &.active {
      background-color: var(--link-color-active-bg);
      color: var(--link-color-active);
    }
  }
}

.projects-section {
  flex: 2;
  background-color: var(--projects-section);
  border-radius: 32px;
  padding: 32px 32px 0 32px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

  &-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 32px;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    color: var(--main-color);

    p {
      font-size: 24px;
      line-height: 32px;
      font-weight: 700;
      opacity: .9;
      margin: 0;
      color: var(--main-color);
    }

    .time {
      font-size: 20px;
    }
  }
}

.projects-status {
  display: flex;
}

.item-status {
  display: flex;
  flex-direction: column;
  margin-right: 16px;

  &:not(:last-child) .status-type:after {
    content: '';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translatey(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 1px solid var(--secondary-color);
  }
}

.status-number {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  color: var(--main-color);
}

.status-type {
  position: relative;
  padding-right: 24px;
  color: var(--secondary-color);
}

.view-actions {
  display: flex;
  align-items: center;
}


.view-btn {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  color: var(--main-color);
  margin-left: 8px;
  transition: .2s;

  &.active {
    background-color: var(--link-color-active-bg);
    color: var(--link-color-active);
  }

  &:not(.active):hover {
    background-color:  var(--link-color-hover);
    color: var(--link-color-active);
  }
}


.messages-section {
  flex-shrink: 0;
  padding-bottom: 32px;
  background-color: var(--projects-section);
  margin-left: 24px;
  flex: 1;
  width: 100%;
  border-radius: 30px;
  position: relative;
  overflow: auto;
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);

  .messages-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    border: none;
    background-color: transparent;
    color: var(--main-color);
    display: none;
  }

  &.show {
    transform: translateX(0);
    opacity: 1;
    margin-left: 0;
  }

  .projects-section-header {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 32px 24px 0 24px;
    background-color:  var(--projects-section);
  }
}

.message-box {
  border-top: 1px solid var(--message-box-border);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  width: 100%;

  &:hover {
    background-color: var(--message-box-hover);
    border-top-color: var(--link-color-hover);

    + .message-box {
      border-top-color: var(--link-color-hover);
    }
  }

  img {
    border-radius: 50%;
    object-fit: cover;
    width: 40px;
    height: 40px;
  }
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .name {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    color: var(--main-color);
    margin: 0;
  }
}

.message-content {
  padding-left: 16px;
  width: 100%;
}

.star-checkbox {
  input {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;
  }

  label {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .dark & {
    color: var(--secondary-color);



    input:checked + label {
      color: var(--star);
    }
  }

  input:checked + label svg {
    fill: var(--star);
    transition: .2s;
  }
}

.message-line {
  font-size: 14px;
  line-height: 20px;
  margin: 8px 0;
  color: var(--secondary-color);
  opacity: .7;

  &.time {
    text-align: right;
    margin-bottom: 0;
  }
}

.project-boxes {
  margin: 0 -8px;
  overflow-y: auto;
  width: 1500px;
  height: 1000px;

  &.jsGridView {
    display: flex;
    flex-wrap: wrap;

    .project-box-wrapper {
      width: 50%;
    }
  }

  &.jsListView {
    .project-box {
      display: flex;
      border-radius: 10px;
      position: relative;
      > * {
        margin-right: 24px;
      }
    }

    .more-wrapper {
      position: absolute;
      right: 16px;
      top: 16px;
    }

    .project-box-content-header {
      order: 1;
      max-width: 120px;
    }

    .project-box-header {
      order: 2;
    }

    .project-box-footer {
      order: 3;
      padding-top: 0;
      flex-direction: column;
      justify-content: flex-start;
    }

    .project-box-footer:after {
      display: none;
    }

    .participants {
      margin-bottom: 8px;
    }

    .project-box-content-header p {
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .project-box-header > span {
      position: absolute;
      bottom: 16px;
      left: 16px;
      font-size: 12px;
    }

    .box-progress-wrapper {
      order: 3;
      flex: 1;
    }
  }
}

.project-box {
  --main-color-card: #dbf6fd;
  border-radius: 30px;
  padding: 16px;
  background-color: var(--main-color-card);

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    color: var(--main-color);

    span {
      color: #4A4A4A;
      opacity: .7;
      font-size: 14px;
      line-height: 16px;
    }
  }

  &-content-header {
    text-align: center;
    margin-bottom: 16px;

    p { margin: 0; }
  }

  &-wrapper {
    padding: 8px;
    transition: .2s;
  }
}

.project-btn-more {
  padding: 0;
  height: 14px;
  width: 24px;
  height: 24px;
  position: relative;
  background-color: transparent;
  border: none;
  flex-shrink: 0;

  /*&:after, &:before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--main-color);
    opacity: .8;
    left: 50%;
    transform: translatex(-50%);
  }

  &:before { top: 0;}
  &:after { bottom: 0; }*/
}

.more-wrapper {
  position: relative;
}

.box-content-header {
  font-size: 30px;
  line-height: 24px;
  font-weight: 700;
  opacity: .7;
}

.box-content-subheader {
  font-size: 14px;
  line-height: 24px;
  opacity: .7;
}

.box-progress {
  display: block;
  height: 4px;
  border-radius: 6px;

  &-bar {
    width: 100%;
    height: 4px;
    border-radius: 6px;
    overflow: hidden;
    background-color: #fff;
    margin: 8px 0;
  }

  &-header {
    font-size: 14px;
    font-weight: 700;
    line-height: 16px;
    margin: 0;
  }

  &-wrapper {

  }

  &-percentage {
    text-align: right;
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    line-height: 16px;
  }
}

.project-box-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    background-color: rgba(255,255,255,0.6);;
    width: calc(100% + 32px);
    top: 0;
    left: -16px;
    height: 1px;
  }
}

.participants {
  display: flex;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;

    &:not(:first-child) {
      margin-left: -8px;
    }
  }
}

.add-participant {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255,255,255,0.6);
  margin-left: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.days-left {
  background-color: rgba(255,255,255,0.6);
  font-size: 12px;
  border-radius: 20px;
  flex-shrink: 0;
  padding: 6px 16px;
  font-weight: 700;
}

.mode-switch.active .moon {
  fill: var(--main-color);
}

.messages-btn {
  border-radius: 4px 0 0 4px;
  position: absolute;
  right: 0;
  top: 58px;
  background-color: var(--message-btn);
  border: none;
  color: var(--main-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  display: none;
}

@media screen and (max-width: 980px) {
  .project-boxes.jsGridView .project-box-wrapper {
    width: 50%;
  }

  .status-number, .status-type {
    font-size: 14px;
  }

  .status-type:after {
    width: 4px;
    height: 4px;
  }

  .item-status { margin-right: 0; }
}

@media screen and (max-width: 880px) {
  .messages-section {
    transform: translateX(100%);
    position: absolute;
    opacity: 0;
    top: 0;
    z-index: 2;
    height: 100%;
    width: 100%;

    .messages-close { display: block; }
  }

  .messages-btn { display: flex; }
}

@media screen and (max-width: 720px) {
  .app-name, .profile-btn span { display: none; }

  .add-btn, .notification-btn, .mode-switch {
    width: 20px;
    height: 20px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .app-header-right button {
    margin-left: 4px;
  }
}

@media screen and (max-width: 520px) {
  .projects-section { overflow: auto; }
  .project-boxes { overflow-y: visible; }

  .app-sidebar, .app-icon { display: none; }

  .app-content { padding: 16px 12px 24px 12px;}

  .status-number, .status-type {
    font-size: 10px;
  }

  .view-btn {
    width: 24px;
    height: 24px;
  }

  .app-header {
    padding: 16px 10px;
  }

  .search-input {
    max-width: 120px;
  }

  .project-boxes.jsGridView .project-box-wrapper {
    width: 100%;
  }

  .projects-section {
    padding: 24px 16px 0 16px;
  }

  .profile-btn img {
    width: 24px;
    height: 24px;
  }

  .app-header {
    padding: 10px;
  }

  .projects-section-header p,
  .projects-section-header .time{
    font-size: 18px;
  }

  .status-type {
    padding-right: 4px;

    &:after {
      display: none;
    }
  }

  .search-input {
    font-size: 14px;
  }

  .messages-btn { top: 48px; }

  .box-content-header {
    font-size: 12px;
    line-height: 16px;
  }

  .box-content-subheader {
    font-size: 12px;
    line-height: 16px;
  }

  .project-boxes.jsListView .project-box-header > span {
    font-size: 10px;
  }

  .box-progress-header {
    font-size: 12px;
  }

  .box-progress-percentage {
    font-size: 10px;
  }

  .days-left {
    font-size: 8px;
    padding: 6px 6px;
    text-align: center;
  }

  .project-boxes.jsListView .project-box > * {
    margin-right: 10px;
  }

  .project-boxes.jsListView .more-wrapper {
    right: 2px;
    top: 10px;
  }
}
</style>
