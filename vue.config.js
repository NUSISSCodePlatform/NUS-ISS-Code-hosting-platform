const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  //开启代理服务器
  devServer: {
    //方法1
    // proxy: 'http://43.163.8.76:5000'
    proxy: {
      //想走代理前面加api，不想走代理前缀不加
      '/login': {
        target: 'http://43.163.8.76:8081',
        pathRewrite:{'^/login':''},
        ws: true,
        changeOrigin: true
      },
      '/api8085': {
        target: 'http://43.163.8.76:8085/courses',
        pathRewrite: { '^/api8085': '' },
        ws: true,
        changeOrigin: true,
      },
      '/api8086': {
        target: 'http://43.163.8.76:8086/teams',
        pathRewrite: { '^/api8086': '' },
        ws: true,
        changeOrigin: true,
      },
      '/gitlab/projects': {
        target: 'http://43.163.8.76:8082/gitlab/projects',
        pathRewrite: { '^/gitlab/projects': '' },
        ws: true,
        changeOrigin: true,
      },
      '/gitlab/teams': {
        target: 'http://43.163.8.76:8082/gitlab/teams',
        pathRewrite: { '^/gitlab/teams': '' },
        ws: true,
        changeOrigin: true,
      },
    }
  }
});
