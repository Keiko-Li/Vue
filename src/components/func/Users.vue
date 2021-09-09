<template>
  <div>
    <el-card class="box-card">
      <div class="search">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="Please Input" class="input" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addFormVisible = true">ADD</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="message">
        <el-table :data="userlist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="Name"></el-table-column>
          <el-table-column prop="email" label="E-mail"></el-table-column>
          <el-table-column prop="mobile" label="Tel"></el-table-column>
          <el-table-column prop="role_name" label="Roles"></el-table-column>
          <!-- 用户状态修改与保持 -->
          <el-table-column prop="mg_state" label="State">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <!-- 操作台部分 -->
          <el-table-column label="Operation" width="190px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              <el-button type="info" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- add user form -->
    <el-dialog title="ADD USER" :visible.sync="addFormVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="65px" label-position="left">
        <el-form-item label="Name" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Key" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Tel." prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addFormVisible = false">Quit</el-button>
        <el-button type="primary" @click="addUser">Submit</el-button>
      </div>
    </el-dialog>
    <!-- edit user form -->
    <el-dialog title="EDIT USER" :visible.sync="editFormVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="65px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Tel." prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editFormVisible = false">Quit</el-button>
        <el-button type="primary" @click="editUserInfo()">Submit</el-button>
      </div>
    </el-dialog>
    <!-- edit role -->
    <el-dialog title="EDIT ROLE" :visible.sync="roleFormVisible" width="50%" @close="roleDialogClosed">
      <el-form :model="userInfo" label-width="85px" ref="roleFormRef" label-position="right">
        <el-form-item label="userName:">{{userInfo.username}}</el-form-item>
        <el-form-item label="nowRoles:">{{userInfo.role_name}}</el-form-item>
        <el-form-item label="newRoles:">
          <el-select v-model="selectRoleId" placeholder="Please select">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleFormVisible = false">Quit</el-button>
        <el-button type="primary" @click="editRoleInfo()">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 校验 email
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-+.]\w+)*$/
      if (!value) return callback(new Error("don't none"))
      if (regEmail.test(value)) return callback()
      callback(new Error('please enter a valid value'))
    }
    // 校验 Mobile
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?([0-9]{11,12})/
      if (!value) return callback(new Error("don't none"))
      if (regMobile.test(value)) return callback()
      callback(new Error('please enter a valid value'))
    }
    // 校验 passWord
    var checkPassword = (rule, value, callback) => {
      const regPassword = /^[a-zA-Z]\w+$/
      if (!value) return callback(new Error("don't none"))
      if (regPassword.test(value)) return callback()
      callback(new Error('please enter a valid value'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userlist: [],
      total: 0,
      // control form
      addFormVisible: false,
      // add user form data
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // form rules
      addFormRules: {
        username: [
          {required: true, message: 'please input name', trigger: 'blur'},
          {min: 3, max: 10, message: 'name size is 3~10', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'please input password', trigger: 'blur'},
          {min: 6, max: 15, message: '6~16,number,@! and a~z', trigger: 'blur'},
          {validator: checkPassword, trigger: 'blur'}
        ],
        email: [
          {required: true, message: '', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      editFormVisible: false,
      editForm: {},
      roleFormVisible: false,
      // 需要分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已经选中的角色 Id 植
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/users', {params: this.queryInfo})
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('error')
          this.userlist = res.data.users
          this.total = res.data.total
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 监听 pagesize 改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 pageNumber 改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听状态变化并保存状态
    userStateChanged (userinfo) {
      this.axios.put(`http://127.0.0.1:8888/api/private/v1/users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then(({data: res}) => {
          if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('updata default')
          }
          this.$message.success('updata successful')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户表单预校验
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        await this.axios.post('http://127.0.0.1:8888/api/private/v1/users', this.addForm)
          .then(({data: res}) => {
            if (res.meta.status !== 201) this.$message.error('add user default')
            this.$message.success('add user success')
            // 隐藏添加用户的对话框
            this.addFormVisible = false
            // 重新获取用户添加列表数据
            this.getUserList()
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
    // 修改用户表单预校验
    async editUser (id) {
      this.editFormVisible = true
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/users/' + id)
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error("don't get any values")
          this.editForm = res.data
        })
    },
    // 监听修改用户数据对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.ressetFields()
    },
    // 提交修改表单
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        await this.axios.put('http://127.0.0.1:8888/api/private/v1/users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          .then(({data: res}) => {
            if (res.meta.status !== 200) return this.$message.error('edit user default')
            // 隐藏添加用户的对话框
            this.editFormVisible = false
            // 重新获取用户添加列表数据
            this.getUserList()
            this.$message.success('edit user success')
          })
      })
    },
    // 删除用户数据
    async deleteUser (id) {
      await this.$confirm('This operation will delete all data of this user. Do you want to continue?', 'Attention', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await this.axios.delete('http://127.0.0.1:8888/api/private/v1/users/' + id)
            .then(({data: res}) => {
              if (res.meta.status !== 200) return this.$message.error('delete default!')
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getUserList()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'delete cancel'
          })
        })
    },
    // 角色分配表单
    async setRole (item) {
      this.roleFormVisible = true
      this.userInfo = item
      // 获取角色列表
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/roles')
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('get role list default!')
          this.rolesList = res.data
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    // 监听角色选择表单关闭事件
    roleDialogClosed () {
      this.selectRoleId = ''
    },
    async editRoleInfo () {
      if (!this.selectRoleId) return this.$message.error('please select role')
      await this.axios.put(`http://127.0.0.1:8888/api/private/v1/users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        })
        .then(({data: res}) => {
          console.log('111')
          if (res.meta.status !== 200) return this.$message.error('update default!')
          this.getUserList()
          this.$message.success('update successful!')
          this.roleFormVisible = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 30px;
  }
  .input {
    height: 30px;
  }
</style>
