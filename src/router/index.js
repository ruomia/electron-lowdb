import Vue from 'vue';
import VueRouter from 'vue-router';
// import { ROUTER_MODE } from '../config/app';
import Home from '../views/home/index.vue';
// if (process.env.NODE_ENV === 'development') {
// }
Vue.use(VueRouter);

const err401 = r =>
  require.ensure([], () => r(require('../views/error/err401.vue')), 'home');
const err404 = r =>
  require.ensure([], () => r(require('../views/error/err404.vue')), 'home');
const login = r =>
  require.ensure([], () => r(require('../views/login/index.vue')), 'home');
const main = r =>
  require.ensure([], () => r(require('../views/home/main.vue')), 'home');

// 注意 权限字段 authRule （严格区分大小写）
export const constantRouterMap = [
  {
    path: '*',
    component: err404,
    hidden: true
  },
  {
    path: '/401',
    component: err401,
    name: '401',
    hidden: true
  },
  {
    path: '/404',
    component: err404,
    name: '404',
    hidden: true
  },
  {
    path: '/500',
    component: err404,
    name: '500',
    hidden: true
  },
  {
    path: '/login',
    component: login,
    name: '登录',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    redirect: '/readme',
    name: '首页',
    hidden: true
  },
  {
    path: '/readme',
    component: Home,
    redirect: '/readme/main',
    icon: 'el-icon-s-home',
    name: '控制台',
    noDropdown: true,
    children: [
      {
        path: 'main',
        component: main
      }
    ]
  }
];
// 解决两次访问相同路由地址报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// 实例化vue的时候只挂载constantRouterMap
const router = new VueRouter({
  // mode: 'history', //后端支持可开
  mode: 'hash',
  // mode: ROUTER_MODE,
  routes: constantRouterMap
  // strict: process.env.NODE_ENV !== 'production'
});
export default router;
