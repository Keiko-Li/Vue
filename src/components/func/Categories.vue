<template>
  <div>
    <el-card class="box-card">
      <div class="search">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" @click="getParentCateList()">ADD GOODS</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <tree-table
        class="message"
        :data="catelist"
        :columns="columns"
        :selection-type='false'
        :expand-type='false'
        show-index index-text="#"
        border>
          <template slot='Avail' slot-scope="scope">
            <i class="el-icon-success" style="color: lightgreen;" v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error" style="color: red;" v-else></i>
          </template>
          <template class="level" slot='Level' slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">level 1</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success">level 2</el-tag>
            <el-tag v-else type="warning">level 3</el-tag>
          </template>
          <template slot="Operation">
            <el-button type="primary" icon="el-icon-edit" size="medium">Edit</el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium">Delete</el-button>
          </template>
        </tree-table>
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
    <!-- 添加分类 -->
    <el-dialog title="ADD GOODS" :visible.sync="addFormVisible" width="500px" @close="addCateDialogClosed()">
      <el-form :model="addcate" :rules="addCateRules" ref="addCateFormRef" label-width="110px" label-position="left" size="medium">
        <el-form-item label="Category:" prop="cat_name" >
          <el-input v-model="addcate.cat_name" placeholder="Please select!"></el-input>
        </el-form-item>
        <el-form-item label="Classification:">
          <el-cascader
            expand-trigger="hover"
            v-model="selectCatePid"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addFormVisible = false">Quit</el-button>
        <el-button type="primary" @click="addCateForm()">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品数据列表
      catelist: [],
      // 商品总数目
      total: '',
      columns: [
        { label: 'Categories', prop: 'cat_name' },
        { label: 'Avail', prop: 'cat_deleted', type: 'template', template: 'Avail' },
        { label: 'Level', prop: 'cat_level', type: 'template', template: 'Level' },
        { label: 'Operation', type: 'template', template: 'Operation' }
      ],
      addFormVisible: false,
      addcate: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          {required: true, message: 'please input name', trigger: 'blur'}
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的 Id 数组
      selectCatePid: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/categories', { params: this.queryInfo })
        .then(({data: res}) => {
          if (res.meta.status !== 200) this.$message.error('get categries default!')
          this.catelist = res.data.result
          this.total = res.data.total
        })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      this.addFormVisible = true
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/categories', { params: { type: 2 } })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error('get parents list default!')
          this.parentCateList = res.data
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    // 监听添加分类表单数据改变
    handleChange () {
      console.log(this.selectCatePid)
      if (this.selectCatePid.length > 0) {
        this.addcate.cat_pid = this.selectCatePid[this.selectCatePid.length - 1]
        this.addcate.cat_level = this.selectCatePid.length
      } else {
        this.addcate.cat_pid = 0
        this.addcate.cat_level = 0
      }
    },
    // 监听添加分类表单对话框关闭事件，重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectCatePid = []
      this.addcate.cat_pid = 0
      this.addcate.cat_level = 0
    },
    // 添加分类表单提交
    addCateForm () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false
        await this.axios.post('http://127.0.0.1:8888/api/private/v1/categories', this.addcate)
          .then(({data: res}) => {
            if (res.meta.status !== 201) return this.$message.error('created default!')
            this.getCateList()
            this.addFormVisible = false
            this.$message.success('Create Cate successful!')
          })
          .catch((error) => {
            this.$message.error(error)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .message {
    margin-top: 15px;
    font-size: 16px !important;
    .el-tag {
      font-size: 15px !important;
    }
  }
  .el-cascader {
    width: 100%;
  }
</style>
