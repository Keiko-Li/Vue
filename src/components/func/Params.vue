<template>
  <div>
    <el-card class="box-card">
      <el-alert
        title="Attention: allowing only a third-level classification set parameters!"
        type="warning"
        description=""
        show-icon
        :closable="false"></el-alert>
      <div class="search">
        <span>Select Product Category:</span>
        <el-cascader
          expand-trigger="hover"
          :options="catelist"
          :props="cateProps"
          v-model="selectCatePid"
          @change="handleChange"
        ></el-cascader>
      </div>
        <!-- Tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!-- 动态参数版面 -->
          <el-tab-pane label="Parameters" name="many">
            <el-button type="primary" :disabled="isBtnDisable" @click="dialogVisible = true">ADD Params</el-button>
            <el-table :data="manyTableData" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="Params" prop="attr_name"></el-table-column>
              <el-table-column label="Operation">
                <template>
                  <el-button type="primary" icon="el-icon-edit" size="medium">Edit</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="medium">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 静态属性版面 -->
          <el-tab-pane label="Properties" name="only">
            <el-button type="primary" :disabled="isBtnDisable" @click="dialogVisible = true">ADD Propers</el-button>
            <el-table :data="onlyTableData" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="Params" prop="attr_name"></el-table-column>
              <el-table-column label="Operation">
                <template>
                  <el-button type="primary" icon="el-icon-edit" size="small">Edit</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="small">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性 -->
    <el-dialog :title="'ADD ' + titleText" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed" >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="85px" label-position="left">
        <el-form-item :label="titleText + ':'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">Quit</el-button>
        <el-button type="primary" @click="ADD()">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取商品列表
      catelist: [],
      // 指定级联选择器的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的分类的 Id 数组
      selectCatePid: [],
      // 打开页面标志位
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      dialogVisible: false,
      addForm: {},
      addFormRules: {
        attr_name: [
          {required: true, message: 'Please input name', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/categories')
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('get catelist default!')
          this.catelist = res.data
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    // 监听选择框选中项变化
    handleChange () {
      if (this.selectCatePid.length !== 3) {
        this.selectCatePid = []
        return
      }
      this.getParamsData()
    },
    // tab 页签点击事件的处理函数
    handleTabClick () {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数列表
    async getParamsData () {
      await this.axios.get(`http://127.0.0.1:8888/api/private/v1/categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        })
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('get catelist default!')
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          })
          if (this.activeName === 'many') {
            this.manyTableData = res.data
          } else {
            this.onlyTableData = res.data
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    ADD () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        await this.axios.post(`http://127.0.0.1:8888/api/private/v1/categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          .then(({data: res}) => {
            if (res.meta.status !== 201) return this.$message.error('created default!')
            this.getParamsData()
            this.dialogVisible = false
            this.$message.success('created successful!')
          })
          .catch((error) => {
            this.$message.error(error)
          })
      })
    }
  },
  // 计算属性
  computed: {
    // 设置按钮禁用规则，false 禁用
    isBtnDisable () {
      if (this.selectCatePid.length !== 3) {
        return true
      }
      return false
    },
    // 读取三级分类 Id
    cateId () {
      if (this.selectCatePid.length === 3) {
        return this.selectCatePid[2]
      }
      return null
    },
    // 动态 Dialog
    titleText () {
      if (this.activeName === 'many') return 'PARAMS'
      return 'PROPER'
    }
  }
}
</script>

<style lang="less" scoped>
  .search {
    margin: 15px 0px;
    span {
      margin: 15px;
    }
    .el-cascader {
      width: 20%;
    }
  }
  .el-tabs {
    margin-left: 15px;
    .el-button {
      margin-bottom: 15px;
    }
  }
  .el-tag {
    margin: 10px
  }
</style>
