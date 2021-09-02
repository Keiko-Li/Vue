import Vue from 'vue'
import App from './App'
import router from './router/router.js'
import './assets/css/global.css'
// import qs from 'qs'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css' // 引用全部样式
import './plugins/element.js' // 按需引入样式
import './assets/fonts/iconfont.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
// 配置请求路径
axios.default.baseURL = `http://127.0.0.1:8888/api/private/v1/`
// 请求拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// Vue.prototype.$qs = qs
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App),
  components: { App },
  template: '<App/>'
}).$mount('#app')
