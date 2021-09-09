<template>
  <el-card>
    <div class="search">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input class="input" v-model="queryInfo.query" placeholder="Please input message">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" >ADD GOODS</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="message">
      <el-table :data="goodlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="Production" prop="goods_name" ></el-table-column>
        <el-table-column label="ID" prop="goods_id" width="50"></el-table-column>
        <el-table-column label="Price" prop="goods_price" width="80"></el-table-column>
        <el-table-column label="Number" prop="goods_number" width="80"></el-table-column>
        <el-table-column label="Quelity" prop="goods_weight" width="80"></el-table-column>
        <el-table-column label="CreatTime" prop="add_time" width="105">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="UpdateTime" prop="upd_time" width="110">
          <template slot-scope="scope">{{scope.row.upd_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="Status" prop="goods_state" width="70">
          <template slot-scope="scope">
            <i v-if="scope.row.goods_state === 2" class="el-icon-success" style="color: lightgreen"></i>
            <i v-else-if="scope.row.goods_state === 1" class="el-icon-warning" style="color: gold"></i>
            <i v-else class="el-icon-error" style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column label="Level" prop="is_promote" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_promote !== 'false'" type="success">YES</el-tag>
            <el-tag v-else type="Info">NO</el-tag>
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
        :page-sizes="[10, 20, 50, 100]"
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
      goodlist: [],
      // 总数目
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/goods', {params: this.queryInfo})
        .then(({data: res}) => {
          if (res.meta.status !== 200) return false
          console.log(res.data)
          this.goodlist = res.data.goods
          this.total = res.data.total
        })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin: 15px 0px;
}
</style>
