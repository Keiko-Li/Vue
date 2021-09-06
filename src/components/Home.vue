<template>
    <el-container class="home-container">
      <el-aside>
        <div class="logo">
            <img src="../assets/homeLogo.png" alt="logo" width="80">
            <span>靴下屋后台管理系统</span>
        </div>
        <el-menu class="el-menu"
        text-color="#d3dbe1"
        background-color = "#1a4c6b"
        active-text-color="#00a3ff"
        unique-opened
        router
        :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
            :index="'/'+ subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="sNavSta('/'+ item.path)">
              <template slot="title">
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: `${this.activePath}` }">{{this.$route.meta[0]}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{this.$route.meta[1]}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" @click="logout" class="signOut">Sign out</el-button>
          </div>
        </el-header>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>

export default({
  data () {
    return {
      // 左侧菜单
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/menus')
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.menulist = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // save link active-state
    sNavSta (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
})
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #e9edf0;
    display: flex;
    align-items: center;
    > div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .el-aside {
    background-color: #1a4c6b;
    font-size: 20px;
    color: #e9edf0;
    > div {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      span {
        align-items: center;
      }
    }
    .el-menu {
      border-right-width: 0px;
      i {
        width: 100px;
      }
      span {
        font-size: 18px;
        align-content: center;
      }
      .el-menu-subitem.is-active {
      background-color: #fff !important;
      }
    }
  }
  .el-main{
    background-color: #ffffff;
  }
  .iconfont {
    margin-right: 10px;
  }
</style>
