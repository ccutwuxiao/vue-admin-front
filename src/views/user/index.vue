<template>
  <el-card class="box-card">
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addDialogFormVisible = true">
          Add
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :index="indexMethod"
        />
        <el-table-column
          prop="username"
          label="用户名"
          width="180"
        />
        <el-table-column
          prop="password"
          label="密码"
        />
        <el-table-column
          prop="name"
          label="姓名"
          width="180"
        />
        <el-table-column
          prop="role"
          label="角色"
          width="180"
        />
        <el-table-column
          prop="age"
          label="年龄"
          width="180"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editRow(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteRow(scope.$index, scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="listQuery.pagination.currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="0"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listQuery.pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="addForm.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="addForm.password" autocomplete="off" show-password />
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select v-model="addForm.role" placeholder="角色" :label-width="formLabelWidth">
              <el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="addForm.name" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加用户" :visible.sync="updateDialogFormVisible">
        <el-form :model="updateForm">
          <el-form-item label="Id" :label-width="formLabelWidth">
            <el-input v-model="updateForm.id" max-length="10" disabled="disabled" />
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="updateForm.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="updateForm.password" autocomplete="off" show-password />
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select v-model="updateForm.role" placeholder="角色" :label-width="formLabelWidth">
              <el-option v-for="item in roleTypeOptions" :key="item.key" :label="item.name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="updateForm.name" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateData">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>
<script>
import { queryUsers, delUser, updateUser, saveUser } from '@/api/table'
const roleTypeOptions = [
  { key: 'admin', name: '管理员' },
  { key: 'editor', name: '普通用户' }
]
export default {
  data() {
    return {
      listLoading: true,
      tableData: null,
      listQuery: {
        name: null,
        pagination: {
          pageSize: 5,
          currentPage: 1,
          total: 0
        }
      },
      roleTypeOptions,
      addDialogFormVisible: false,
      addForm: {
        username: null,
        password: null,
        role: null,
        name: null
      },
      updateDialogFormVisible: false,
      updateForm: {
        id: null,
        username: null,
        password: null,
        role: null,
        name: null
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleFilter() {
      this.listQuery.pagination.currentPage = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.pagination.pageSize = val
      console.log(`每页 ${val} 条`)
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.pagination.currentPage = val
      console.log(`当前页: ${val}`)
      this.fetchData()
    },
    editRow(index, row) {
      this.updateDialogFormVisible = true
      this.updateForm = Object.assign({}, row)
    },
    deleteRow(index, row) {
      this.$confirm('此操作将永久删除用户 ' + row.name + ', 是否继续?', '提示', { type: 'warning' })
        .then(() => { // 向服务端请求删除
          delUser(row.id).then((response) => {
            this.$message.success('成功删除了用户' + row.name + '!')
            this.fetchData()
          }).catch((response) => {
            this.$message.error('删除失败!')
          })
        }).catch(() => {
          this.$message.info('已取消操作!')
        })
    },
    indexMethod(index) {
      return index * 1
    },
    fetchData() {
      this.listLoading = true
      queryUsers(this.listQuery).then(response => {
        this.tableData = response.data.list
        this.listQuery.pagination = response.data.pagination
        this.listLoading = false
      }).catch()
    },
    saveData() {
      saveUser(this.addForm).then(response => {
        this.$message.success('用户添加成功!')
        this.addDialogFormVisible = false
        this.fetchData()
      }).catch((response) => {
        this.$message.error('添加失败!')
      })
    },
    updateData() {
      updateUser(this.updateForm).then(response => {
        this.$message.success('用户修改成功!')
        this.updateDialogFormVisible = false
        this.fetchData()
      }).catch((response) => {
        this.$message.error('修改失败!')
      })
    }
  }
}
</script>
