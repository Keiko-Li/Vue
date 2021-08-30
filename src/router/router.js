import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})
// 暴露 router 之前，要挂载路由导航守卫
// 用户没有登陆时，没有权限访问特定页面，自动跳转登录页面
router.beforeEach((to, from, next) => {
  /* to: 将要访问路径
   * from：从哪个路径跳转而来
   * next()：放行函数
  */
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
