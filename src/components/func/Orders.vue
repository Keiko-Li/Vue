<template>
  <el-card>
    <div class="search">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input class="input" v-model="queryInfo.query" placeholder="Please input message">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="message">
      <el-table :data="paylist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="Order Number" prop="order_number" ></el-table-column>
        <el-table-column label="user Id" prop="user_id" width="90"></el-table-column>
        <el-table-column label="Price(￥)" prop="order_price" width="90"></el-table-column>
        <el-table-column label="Send" prop="is_send" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send === '是'" type="success" size="mini"> YES </el-tag>
            <el-tag v-else type="danger"> NO </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="CreatTime" prop="create_time" width="105">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="UpdateTime" prop="update_time" width="110">
          <template slot-scope="scope">{{scope.row.update_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="Pay-Status" prop="order_pay" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === 1" type="warning" effect="dark"> NON </el-tag>
            <el-tag v-else type="info">ALPEADY</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="130">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
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
      // 获取商品列表
      paylist: [],
      // 总数目
      total: 0
    }
  },
  created () {
    this.getPayList()
  },
  methods: {
    async getPayList () {
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/orders', {params: this.queryInfo})
        .then(({data: res}) => {
          if (res.meta.status !== 200) return false
          this.paylist = res.data.goods
          this.total = res.data.total
        })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getPayList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getPayList()
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin: 15px 0px;
}
</style>
