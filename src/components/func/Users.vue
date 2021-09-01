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
      <div>
        <el-table :data="userlist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="Name"></el-table-column>
          <el-table-column prop="email" label="E-mail"></el-table-column>
          <el-table-column prop="mobile" label="Tel"></el-table-column>
          <el-table-column prop="role_name" label="Roles"></el-table-column>
          <!--  -->
          <el-table-column prop="mg_state" label="State">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <!--  -->
          <el-table-column label="Edit" width="190px">
            <template>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <el-button type="info" icon="el-icon-setting" size="mini"></el-button>
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
    <el-dialog title="ADD USER" :visible.sync="addFormVisible" width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
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
        <el-button @click="dialogFormVisible = false">Quit</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
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
        mobile: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // form rules
      addFormRules: {
        username: [
          {required: true, message: 'please input name', trigger: 'blur'},
          {min: 3, max: 10, message: 'name size is 3~10', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'please input password', trigger: 'blur'},
          {min: 6, max: 15, message: '6~16,number,@! and a~z', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '', trigger: 'blur'},
          {required: true, message: '', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '', trigger: 'blur'},
          {required: true, message: '', trigger: 'blur'}
        ]
      }
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
