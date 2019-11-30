/**
 * 配置编译环境和线上环境之间的切换
 *
 * PUBLIC_PATH: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
let BASE_URL = process.env.VUE_APP_API_BASE;
// let ROUTER_MODE = "history";
// let ROUTER_MODE = "";
let IMG_BASE_URL = BASE_URL;
export { BASE_URL, IMG_BASE_URL };
