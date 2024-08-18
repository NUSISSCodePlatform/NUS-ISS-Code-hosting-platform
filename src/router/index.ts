import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from "@/layout/index.vue";
import courses from '../views/dashboard/components/course.vue'
import people from '../views/dashboard/components/group.vue'
import assignment from '../views/dashboard/components/assignments.vue'
import modify from '../views/dashboard/components/modifyInfo.vue'
import projectInfo from "@/views/dashboard/components/projectInfo.vue";
import commit from "@/views/dashboard/components/commitHistory.vue";
import announcement from "@/views/dashboard/components/announcement.vue";
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: () =>
        import(/* webpackChunkName: "login" */ "../views/login/loginForm.vue"),
    meta: { title: "NUS ISS Code Hosting", hidden: true, notNeedAuth: true }
  },
  {
    path: "/404",
    component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue"),
    meta: { title: "404", hidden: true, notNeedAuth: true }
  },
  {  path:'/courses',
    name:'courses',
    component:courses

  },
  {
    path:'/:course/people',
    name:'people',
    component:people
  },
  {
    path:'/:course/assignment',
    name:'assignment',
    component:assignment
  },
  {
    path:'/:name/modify',
    name:'modify',
    component:modify
  },
  {
    path:'/:course/people/:teamid/projectInfo',
    name:'projectInfo',
    component:projectInfo
  },
  {
    path:'/:course/people/:teamid/projectInfo/:projectid/commitHistory',
    name:'commit',
    component:commit
  },
  {
    path:'/announcement',
    name:'announcement',
    component:announcement
  },
]

const router = new VueRouter({
  routes
})

export default router
