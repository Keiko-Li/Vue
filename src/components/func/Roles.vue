<template>
  <div>
    <el-card class="box-card">
      <el-row class="add_role">
        <el-col>
          <el-button type="primary" @click="addFormVisible=true">ADD ROLES</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleslist" border stripe>
        <el-table-column label="#" type="expand">
          <template slot-scope="scope">
            <el-row :class="['dbbottom', l1 === 0 ? 'dbtop':'', 'vcenter']" v-for="(item1, l1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[l2 === 0 ? '':'dbtop', 'vcenter']" v-for="(item2, l2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRolesById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,) in item2.children" :key="item3.id" type="warning" closable @close="removeRolesById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="Roles"></el-table-column>
        <el-table-column prop="roleDesc" label="Descripte"></el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editRoles(scope.row.id)">Edit</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteRoles(scope.row.id)">Delete</el-button>
            <el-button type="info" icon="el-icon-setting" size="small" @click="showSetRightDialog(scope.row)">Setting</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色表单 -->
    <el-dialog title="ADD ROLES" :visible.sync="addFormVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" ref="addFormRef" label-width="80px" label-position="left">
        <el-form-item label="Role" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="Descripte" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addFormVisible = false">Quit</el-button>
        <el-button type="primary" @click="addRoles()">Submit</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色表单 -->
    <el-dialog title="EDIT ROLES" :visible.sync="editFormVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="90px" label-position="left">
        <el-form-item label="Role">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="Descripte" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editFormVisible = false">Quit</el-button>
        <el-button type="primary" @click="editRolesInfo()">Submit</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="SET RIFHTS" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">
      <el-tree :data="getRightsList"
               :props="treeProps"
               show-checkbox node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef">
      </el-tree>
      <div slot="footer">
        <el-button @click="setRightDialogVisible = false">Quit</el-button>
        <el-button type="primary" @click="setInfo()">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleslist: [],
      addFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          {required: true, message: 'please input name', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: 'please input name', trigger: 'blur'}
        ]
      },
      editFormVisible: false,
      editForm: {},
      setRightDialogVisible: false,
      getRightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/roles')
        .then(({data: res}) => {
          if (res.meta.status !== 200) return console.log('get data default!')
          this.roleslist = res.data
          console.log(this.roleslist)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 监听添加角色对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色
    addRoles () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        await this.axios.post('http://127.0.0.1:8888/api/private/v1/roles/', this.addForm)
          .then(({data: res}) => {
            if (res.meta.status !== 201) this.$message.error('add roles default!')
            this.addFormVisible = false
            this.getRolesList()
            this.$message.success(res.meta.msg)
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
    // 编辑角色
    async editRoles (id) {
      this.editFormVisible = true
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/roles/' + id)
        .then(({data: res}) => {
          if (res.meta.status !== 200) this.$message.error('update default!')
          this.editForm = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 提交编辑角色
    editRolesInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        await this.axios.put('http://127.0.0.1:8888/api/private/v1/roles/' + this.editForm.roleId,
          {
            // roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
          .then(({data: res}) => {
            if (res.meta.status !== 200) this.$message.error('update default!')
            this.getRolesList()
            this.$message.success('update successful!')
            this.editFormVisible = false
          })
      })
    },
    // 删除角色
    async deleteRoles (id) {
      await this.$confirm('This operation will delete all data of this user. Do you want to continue?', 'Attention', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await this.axios.delete('http://127.0.0.1:8888/api/private/v1/roles/' + id)
            .then(({data: res}) => {
              if (res.meta.status !== 200) return this.$message.error('delete default!')
              this.$message({
                type: 'success',
                message: 'delete successful!'
              })
              this.getRolesList()
            })
            .catch(() => {
              this.$message.error({
                type: 'info',
                message: 'delete cancel'
              })
            })
        })
    },
    // 根据ID删除权限
    async removeRolesById (role, item) {
      await this.$confirm('This operation will delete all data of this user. Do you want to continue?', 'Attention', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await this.axios.delete(`http://127.0.0.1:8888/api/private/v1/roles/${role.id}/rights/${item}`)
            .then(({data: res}) => {
              if (res.meta.status !== 200) return this.$message.error('delete default!')
              this.$message({
                type: 'success',
                message: 'delete successful!'
              })
              role.children = res.data
            })
            .catch(() => {
              this.$message.error({
                type: 'info',
                message: 'delete cancel'
              })
            })
        })
    },
    // 展示权限选择
    async showSetRightDialog (role) {
      this.roleId = role.id
      await this.axios.get('http://127.0.0.1:8888/api/private/v1/rights/tree')
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('get default!')
          this.getLeafKeys(role, this.defKeys)
          this.getRightsList = res.data
          this.$message.success(res.meta.msg)
          this.setRightDialogVisible = true
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    // 递归获取三级权限ID
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeafKeys(element, arr)
      })
    },
    // 监听 Setting 窗口关闭事件
    setRightDialogClose () {
      this.defKeys = []
    },
    // 提交权限更改
    async setInfo () {
      const key = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = key.join(',')
      await this.axios.post(`http://127.0.0.1:8888/api/private/v1/roles/${this.roleId}/rights`, {rids: idStr})
        .then(({data: res}) => {
          if (res.meta.status !== 200) return this.$message.error('update default!')
          this.$message.success('update successful!')
          this.getRolesList()
          this.setRightDialogVisible = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .add_role {
    margin-bottom: 20px;
  }
  .dbtop {
    border-top: 1px solid #eee;
  }
  .dbbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
  .el-tag {
    margin: 7px;
  }
</style>
