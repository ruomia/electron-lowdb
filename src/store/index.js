// import Vue from "vue";
// import Vuex from "vuex";
// import * as actions from "./actions";
// import * as getters from "./getters";
// // import app from "./modules/app";
// import admin from "./modules/admin";

// // if (process.env.NODE_ENV === "development") {
// // Vue.use(Vuex);
// // }

// // const debug = process.env.NODE_ENV !== "production";

// export default new Vuex.Store({
//   actions,
//   getters,
//   modules: {
//     // app,
//     admin
//   },
//   strict: debug
//   // plugins: debug ? [createLogger()] : []
// });
import Vue from 'vue'
import Vuex from 'vuex'
import admin from './modules/admin';
import app from './modules/app';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    admin,
    app
  }
})
