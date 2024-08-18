import Vue from 'vue'
import Router from 'vue-router'
import 'normalize.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import SvgIcon from 'vue-svgicon'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import '@/styles/home.scss'
import 'vue-area-linkage/dist/index.css'

import * as echarts from 'echarts'

import '@/styles/newRJWMsystem.scss'
import '@/styles/icon/iconfont.css'
import App from '@/App.vue'
import router from '@/router'
import '@/icons/components'

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  'tagName': 'svg-icon',
  'defaultWidth': '1em',
  'defaultHeight': '1em'
})

Vue.config.productionTip = false
const routerPush = Router.prototype.push

Vue.prototype.$echarts = echarts
new Vue({
  router,
  'render': (h) => h(App)
}).$mount('#app')
