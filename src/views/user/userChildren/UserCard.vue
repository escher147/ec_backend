<template>
  <el-card class="box-card">
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入关键字"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="_getUsers(queryInfo)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="_getUsers(queryInfo)"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表区 -->
    <el-table :data="userList" border stripe>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            @change="stateChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="175">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editUser(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteConfirm(scope.row.id)"
          ></el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="设置角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="allotRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户对话框 -->
    <add-user-info ref="add" @addSuccess="addSuccess"></add-user-info>
    <!-- 修改用户信息对话框 -->
    <edit-user-info
      ref="edit"
      :editForm="editForm"
      @editSuccess="editSuccess"
    ></edit-user-info>
    <!-- 设置用户角色对话框 -->
    <allot-role ref="allot" :userInfo="userInfo" :roleList="roleList" @finishAllotRole="refreshUserList"></allot-role>
  </el-card>
</template>


<script>
import { getUsers, putUserState, getUserById, deleteUser } from "network/users";
import { getRoles } from 'network/roles.js'

import AddUserInfo from "@/views/user/userChildren/AddUserInfo";
import EditUserInfo from "@/views/user/userChildren/EditUserInfo";
import AllotRole from '@/views/user/userChildren/AllotRole'
export default {
  name: "",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
      editForm: {},
      userInfo: {},
      roleList: []
    };
  },
  components: {
    AddUserInfo,
    EditUserInfo,
    AllotRole
  },
  created() {
    this._getUsers(this.queryInfo);
  },
  methods: {
    // 网络请求
    // 获取用户列表
    _getUsers(queryInfo) {
      getUsers(queryInfo).then((res) => {
        // console.log(res);
        const resdata = res.data;
        if (resdata.meta.status !== 200)
          return this.$message.error("获取用户列表失败");
        this.userList = resdata.data.users;
        this.total = resdata.data.total;
        // console.log(this.userList, this.total);
      });
    },
    

    // 事件监听

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this._getUsers(this.queryInfo);
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this._getUsers(this.queryInfo);
    },
    // 用户状态改变
    stateChange(newInfo) {
      // console.log(newInfo);
      putUserState(newInfo.id, newInfo.mg_state).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          newInfo.mg_state = !newInfo.mg_state;
          return this.$message.error("修改用户状态失败");
        }
        return this.$message.success({
          message: "操作成功",
          center: true,
        });
      });
    },
    // 点击添加用户
    addUser() {
      this.$refs.add.addDialogVisible = true;
    },
    // 添加成功后重新请求数据
    addSuccess() {
      this._getUsers(this.queryInfo);
    },
    // 点击修改用户信息
    editUser(id) {
      this.$refs.edit.editDialogVisible = true;
      getUserById(id).then((res) => {
        const data = res.data;
        if (data.meta.status !== 200) {
          return this.$message.error({
            message: "获取用户信息失败",
            center: true,
          });
        }
        this.editForm = data.data;
      });
    },
    // 修改成功后重新请求数据
    editSuccess() {
      this._getUsers(this.queryInfo);
    },
    // 删除用户确认
    deleteConfirm(id) {
      this.$confirm('确定删除此用户?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message({type: 'error', message: '删除失败!', center: true});
            }
            this.$message({type: 'success', message: '删除成功!', center: true});
            // 删除完成后重新请用户数据
            this._getUsers(this.queryInfo);
          });
          
        }).catch(() => {});
    },
    // 分配用户的角色
    allotRole(userInfo) {
      this.userInfo = userInfo;
      // 获取角色列表
      getRoles().then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('出现了一些错误，请关闭对话框后重试');
        }
        this.roleList = res.data.data;
      })
      this.$refs.allot.roleDialogVisible = true;
    },
    // 分配成功后重新请求数据
    refreshUserList() {
      this._getUsers(this.queryInfo);
    }
  },
};
</script>


<style scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
.el-pagination {
  margin-top: 15px;
}
</style>