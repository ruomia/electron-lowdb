<template>
  <div>
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item">
        <el-input v-model="query.title" placeholder="会议名称"></el-input>
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
      <el-table-column :label="v.title" :prop="v.field" fixed v-for="(v,k) in tableField" :key="k"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="query.limit"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>

    <!--表单-->
    <el-dialog
      :title="formMap[formName]"
      :visible.sync="formVisible"
      :before-close="hideForm"
      width="85%"
      top="5vh"
    >
      <el-form :model="formData" :rules="formRules" ref="dataForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议时间" prop="meeting_time">
          <el-input v-model="formData.meeting_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议地址" prop="address">
          <el-input v-model="formData.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="主办单位" prop="host_unit">
          <el-input v-model="formData.host_unit" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认密码" prop="checkPassword">
                    <el-input type="password" v-model="formData.checkPassword" auto-complete="off"></el-input>
        </el-form-item>-->

        <!-- <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">未验证</el-radio>
          </el-radio-group>
        </el-form-item>
        -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideForm">取消</el-button>
        <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { meetingList, meetingSave, meetingDelete } from '../../api/meeting'
const formJson = {
  id: '',
  title: '',
  meeting_time: '',
  address: '',
  host_unit: ''
}
export default {
  data() {
    return {
      query: {
        title: '',
        page: 1,
        limit: 10
      },
      list: [],
      total: 0,
      loading: true,
      index: null,
      formName: null,
      formMap: {
        add: '新增',
        edit: '编辑'
      },
      formLoading: false,
      formVisible: false,
      formData: formJson,
      formRules: {},
      // addRules: {
      //     username: [
      //         { required: true, message: "请输入姓名", trigger: "blur" }
      //     ],
      //     password: [
      //         { required: true, message: "请输入密码", trigger: "blur" },
      //         { validator: validatePass, trigger: "blur" }
      //     ],
      //     checkPassword: [
      //         {
      //             required: true,
      //             message: "请再次输入密码",
      //             trigger: "blur"
      //         },
      //         { validator: validatePass2, trigger: "blur" }
      //     ],
      //     status: [
      //         { required: true, message: "请选择状态", trigger: "change" }
      //     ]
      // },
      editRules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      deleteLoading: false,
      tableField: [
        {
          title: '会议名称',
          field: 'title',
          type: 'text'
        },
        {
          title: '会议时间',
          field: 'meeting_time',
          type: 'text'
        },
        {
          title: '会议地点',
          field: 'address',
          type: 'text'
        },
        {
          title: '主办单位',
          field: 'host_unit',
          type: 'text'
        }
      ],
      formUrl: {
        add: '/admin/meeting/add',
        edit: '/admin/meeting/edit'
      }
    }
  },
  methods: {
    onReset() {
      this.query = {
        title: '',
        page: 1,
        limit: 10
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
      meetingList(this.query)
        .then(response => {
          console.log(response)
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
      // 清空表单
      this.$refs['dataForm'].resetFields()
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
      this.formRules = this.addRules
      if (index !== null) {
        this.index = index
        this.formName = 'edit'
        this.formRules = this.editRules
      }
    },
    formSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.formLoading = true
          let data = Object.assign({}, this.formData)
          meetingSave(data, this.formName)
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
              this.formLoading = false
              console.log(err)
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
            let para = { id: row.id }
            this.deleteLoading = true
            meetingDelete(para)
              .then(response => {
                this.deleteLoading = false
                if (response.code) {
                  this.$message.error(response.message)
                  return false
                }
                this.$message.success('操作成功')
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
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusFilterName(status) {
      const statusMap = {
        0: '禁用',
        1: '正常',
        2: '未验证'
      }
      return statusMap[status]
    }
  },
  mounted() {},
  created() {
    // 将参数拷贝进查询对象
    let query = this.$route.query
    this.query = Object.assign(this.query, query)
    this.query.limit = parseInt(this.query.limit)
    // 加载表格数据
    this.getList()
  }
}
</script>

<style type="text/scss" lang="scss"></style>
