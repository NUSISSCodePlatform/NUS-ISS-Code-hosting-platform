<template>
  <el-container style="height: 100vh;">
    <el-header style="font-size: 20px; display: flex; justify-content: flex-end; align-items: center;">
      <div style="display: flex; align-items: center;">
        <el-dropdown>
          <i class="el-icon-setting bigger-icon" style="margin-left: 10px;"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="jumpModify(userName)">
                Modify Information
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{userName}}</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <LeftNav></LeftNav>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftNav from './views/dashboard/LeftNav.vue';

export default {
  name: 'App',
  components: {
    LeftNav,
  },
  data() {
    return {
      userName: 'Jack'
    };
  },
  methods: {
    jumpModify(name) {
      if (this.$route.name !== 'modify') {
        const formattedName = name.replace(/\s+/g, '').toLowerCase();
        this.$router.push(`/${formattedName}/modify`);
      }
    }
  }
};
</script>


<style>
/*铺满屏幕，没有边距*/
.el-header {
  /* 顶部部分的高度(默认60px) */
  background-color: #334157;
  color: #FFFFFF;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.bigger-icon {
  font-size: 24px; /* 你可以根据需要调整大小 */
}

html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
