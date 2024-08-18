<template>
  <router-view></router-view>
</template>

<script>


export default {
  name: 'App',
  data() {
    return {
      userName: 'Jack'
    };
  },
  methods: {
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
