<template>
  <el-card class="box-card">
    <el-table :data="rightslist" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="Permission Name" prop="authName"></el-table-column>
        <el-table-column label="Path" prop="path"></el-table-column>
        <el-table-column label="Permission Level" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level ==='0'">1 level</el-tag>
            <el-tag v-else-if="scope.row.level ==='1'" type="success">2 level</el-tag>
            <el-tag v-else type="warning">3 level</el-tag>
          </template>
        </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rightslist: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/rights/list')
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('get list default!')
          this.rightslist = res.data
          console.log(this.rightslist)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
