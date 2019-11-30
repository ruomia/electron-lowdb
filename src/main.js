import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './element';
import './role'
import * as filters from './filters/index'; // 全局过滤器

Vue.config.productionTip = false

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
