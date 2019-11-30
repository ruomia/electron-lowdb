<template>
  <div>
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item">
        <el-input v-model="query.role_name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item class="query-form-item">
        <el-select v-model="query.status" placeholder="状态">
          <el-option label="全部" value></el-option>
          <el-option label="禁用" value="0"></el-option>
          <el-option label="正常" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-refresh" @click="onReset"></el-button>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click.native="handleForm(null, null)">新增</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list" style="width: 100%;">
      <el-table-column label="角色 ID" prop="id"></el-table-column>
      <el-table-column label="角色名称" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilterType">
            {{
            scope.row.status | statusFilterName
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.id !== 'g4kSPxHV31'"
            type="text"
            size="small"
            @click.native="handleAuth(scope.row.id)"
          >授权</el-button>
          <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
          <el-button
            v-if="scope.row.id !== 'g4kSPxHV31'"
            type="text"
            size="small"
            @click.native="handleDel(scope.$index, scope.row)"
            :loading="deleteLoading"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="query.limit"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>

    <!--授权界面-->
    <el-dialog
      title="授权"
      :visible.sync="authFormVisible"
      :close-on-click-modal="false"
      class="dialog"
    >
      <el-tree
        style="max-height: 45vh;overflow-y: auto;"
        :data="authList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        :props="defaultProps"
        :default-checked-keys="authDefaultCheckedKeys"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="authFormVisible = !authFormVisible">取消</el-button>
        <el-button type="primary" @click.native="authSubmit()" :loading="authLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--表单-->
    <el-dialog
      :title="formMap[formName]"
      :visible.sync="formVisible"
      :before-close="hideForm"
      width="85%"
      top="5vh"
    >
      <el-form :model="formData" :rules="formRules" ref="dataForm">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="formData.role_name" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="排序" prop="listorder">
                    <el-input type="" v-model="formData.listorder" auto-complete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="描述">
                    <el-input type="textarea" v-model="formData.remark"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideForm">取消</el-button>
        <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  authRoleList,
  authRoleAuthList,
  authRoleAuth,
  authRoleSave,
  authRoleDelete
} from '../../api/auth/role'
const formJson = {
  id: '',
  pid: 0,
  role_name: '',
  status: 1,
  remark: '',
  listorder: 999
}
export default {
  data() {
    return {
      query: {
        role_name: '',
        status: '',
        page: 1,
        limit: 20
      },
      list: [],
      total: 0,
      loading: true,
      authList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      authLoading: false,
      authFormVisible: false,
      authFormData: {
        role_id: '',
        auth_rules: []
      },
      authDefaultCheckedKeys: [],
      index: null,
      formName: null,
      formMap: {
        add: '新增',
        edit: '编辑'
      },
      formLoading: false,
      formVisible: false,
      formData: formJson,
      formRules: {
        role_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      deleteLoading: false
    }
  },
  methods: {
    onReset() {
      this.query = {
        role_name: '',
        status: '',
        page: 1,
        limit: 20
      }
      this.getList()
    },
    onSubmit() {
      this.getList()
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.getList()
    },
    getList() {
      this.loading = true
      authRoleList(this.query)
        .then(response => {
          this.loading = false
          this.list = response.data.list || []
          this.total = response.data.total || 0
        })
        .catch(() => {
          this.loading = false
          this.list = []
          this.total = 0
        })
    },
    // 显示授权界面
    handleAuth(roleId) {
      console.log(roleId)
      this.authFormData.role_id = roleId
      this.authFormData.auth_rules = []
      this.authList = []
      authRoleAuthList({ role_id: roleId })
        .then(response => {
          console.log(response)
          if (response.code) {
            this.authFormVisible = false
            this.$message({
              message: response.message,
              type: 'error'
            })
            return
          }
          this.authFormVisible = true
          this.authList = response.data.auth_list || []
          this.authDefaultCheckedKeys = response.data.checked_keys
          // this.$refs.tree.setCheckedKeys(tempCheckedKeys);
        })
        .catch(err => {
          console.log(err)
        })
    },
    authSubmit() {
      this.authLoading = true
      //   let getNodeParents = function(node) {
      //     let arr = []
      //     let id = node.data.id || null
      //     if (id) {
      //       arr.push(node.data.id)
      //     }
      //     if (node.parent) {
      //       arr = arr.concat(getNodeParents(node.parent))
      //     }
      //     return arr
      //   }
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      this.authFormData.auth_rules = checkedKeys

      // return false;
      // let arr = [];
      // for (let checkedKey of checkedKeys) {
      //     let node = this.$refs.tree.getNode(checkedKey);
      //     arr = arr.concat(getNodeParents(node));
      // }
      // console.log(arr);
      // let setArr = new Set(arr);
      // this.authFormData.auth_rules = [...setArr];
      if (!this.authFormData) {
        this.$alert('请至少选择一个权限', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // console.log(this.authFormData);
      authRoleAuth(this.authFormData)
        .then(response => {
          this.authLoading = false
          if (response.code) {
            this.$message.error(response.message)
            return false
          }
          this.$message.success('授权成功')
          // 刷新表单
          this.authFormVisible = false
        })
        .catch(err => {
          console.log(err)
          this.authLoading = false
        })
    },
    // 刷新表单
    resetForm() {
      if (this.$refs['dataForm']) {
        // 清空验证信息表单
        this.$refs['dataForm'].clearValidate()
        // 刷新表单
        this.$refs['dataForm'].resetFields()
      }
    },
    // 隐藏表单
    hideForm() {
      // 更改值
      this.formVisible = !this.formVisible
      return true
    },
    // 显示表单
    handleForm(index, row) {
      this.formVisible = true
      this.formData = JSON.parse(JSON.stringify(formJson))
      if (row !== null) {
        this.formData = Object.assign({}, row)
      }

      this.formName = 'add'
      if (index !== null) {
        this.index = index
        this.formName = 'edit'
      }
    },
    formSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.formLoading = true
          let data = Object.assign({}, this.formData)
          console.log(data)
          // 获取选中的权限
          authRoleSave(data, this.formName)
            .then(response => {
              console.log(response)
              this.formLoading = false
              if (response.code) {
                this.$message.error(response.message)
                return false
              }
              this.$message.success('操作成功')
              this.formVisible = false
              if (this.formName === 'add') {
                // 向头部添加数据
                if (response.data && response.data.id) {
                  data.id = response.data.id
                  this.list.unshift(data)
                }
              } else {
                this.list.splice(this.index, 1, data)
              }
              // 刷新表单
              this.resetForm()
            })
            .catch(err => {
              console.log(err)
              this.formLoading = false
            })
        }
      })
    },
    // 删除
    handleDel(index, row) {
      if (row.id) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.deleteLoading = true
            let para = { id: row.id }
            authRoleDelete(para)
              .then(response => {
                this.deleteLoading = false
                if (response.code) {
                  this.$message.error(response.message)
                  return false
                }
                this.$message.success('删除成功')
                // 刷新数据
                this.list.splice(index, 1)
              })
              .catch(() => {
                this.deleteLoading = false
              })
          })
          .catch(() => {
            this.$message.info('取消删除')
          })
      }
    }
  },
  filters: {
    statusFilterType(status) {
      const statusMap = {
        0: 'gray',
        1: 'success'
      }
      return statusMap[status]
    },
    statusFilterName(status) {
      const statusMap = {
        0: '禁用',
        1: '正常'
      }
      return statusMap[status]
    }
  },
  mounted() {},
  created() {
    // 加载表格数据
    this.getList()
  }
}
</script>

<style type="text/scss" lang="scss"></style>
