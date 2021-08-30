<template>
    <div class="login_container">
        <!-- header area-->
        <div class="login_box">
            <div class="avater_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- login form -->
            <!-- 表单校验规则 -->
            <!-- 表单数据绑定 -->
            <!-- 表单引用与登录校验 -->
            <el-form label-width="0px" class="login_form" :model="loginform" :rules="loginFormRules" ref="loginFormRef">
                <!-- username -->
                <el-form-item class="username" prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginform.username" >
                    </el-input>
                </el-form-item>
                <!-- password -->
                <el-form-item class="password" prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-3702mima"
                    suffix-icon="iconfont icon-showpassword" v-model="loginform.password">
                    </el-input>
                </el-form-item>
                <!-- check botton -->
                <!-- 点击事件 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">sign in</el-button>
                    <el-button type="info" @click="resetLoginForm">reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录预设
      loginform: {
        username: 'admin',
        password: '123456'
      },
      // 规则校验
      loginFormRules: {
        username: [
          {required: true, message: 'please input username', trigger: 'blur'},
          {min: 3, max: 8, message: 'size 3-8', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'please input password', trigger: 'blur'},
          {min: 6, max: 15, message: 'size 6-15', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 重置表格
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录预验证
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // axios 使用完整接口路径
        await this.axios.post('http://127.0.0.1:8888/api/private/v1/login', this.loginform)
          .then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('登录失败')
            /* 1.将登陆成功后的 token，保存到客户端的sessionStorage(会话期间的存储机制) 中
            * 1.1 项目中其他接口在登录后能够访问
            * 1.2 token 仅在当前网站打卡期间生效，将 token 保存在 sessionStorage 中 */
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', res.data.token)
            // 2. 通过编程时导航跳转至后台主页，路由地址为 /home
            this.$router.push('/home')
          })
          .catch((error) => {
            console.log(error)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b;
    }
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .avater_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            };
        }
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
    }
</style>
