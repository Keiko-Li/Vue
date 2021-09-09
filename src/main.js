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
import ZKTable from 'vue-table-with-tree-grid'

// 配置请求路径
axios.default.baseURL = `http://127.0.0.1:8888/api/private/v1/`
// 请求拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.config.productionTip = false
// 使用 Vue.component 注册为全局组件
Vue.component('tree-table', ZKTable)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App),
  components: { App },
  template: '<App/>'
}).$mount('#app')
