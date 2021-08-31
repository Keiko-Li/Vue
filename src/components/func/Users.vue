<template>
    <div>
        <el-card class="box-card">
          <div class="search">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input placeholder="Please Input" class="input" width="300" height="50">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary">Search</el-button>
              </el-col>
            </el-row>
          </div>

          <div class="text item">
              <el-table :data="tableData" border style="width: 100%">
                  <el-table-column prop="date" label="日期" width="180"></el-table-column>
                  <el-table-column prop="name" label="姓名" width="180"></el-table-column>
                  <el-table-column prop="address" label="地址"></el-table-column>
              </el-table>
          </div>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0
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
