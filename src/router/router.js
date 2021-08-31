import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/func/Users.vue'
import Roles from '../components/func/Roles.vue'
import Rights from '../components/func/Rights.vue'
import Reports from '../components/func/Reports.vue'
import Params from '../components/func/Params.vue'
import Orders from '../components/func/Orders.vue'
import Goods from '../components/func/Goods.vue'
import Categories from '../components/func/Categories.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/reports', component: Reports },
        { path: '/params', component: Params },
        { path: '/orders', component: Orders },
        { path: '/goods', component: Goods },
        { path: '/categories', component: Categories }
      ]
    }
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
