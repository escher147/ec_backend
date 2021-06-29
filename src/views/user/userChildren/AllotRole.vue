<template>
  <el-dialog
    title="设置角色"
    :visible.sync="roleDialogVisible"
    width="50%"
    @closed="handleClose"
  >
    <p>用户名：{{userInfo.username}}</p>
    <p>当前角色：{{userInfo.role_name}}</p>
    <p>新角色：
      <el-select v-model="selectedRole" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
    </p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="roleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="putAlloted">确 定</el-button>
    </span>
  </el-dialog>  
</template>


<script>
import { putUserRole } from 'network/users'
export default {
  name: '',
  props: {
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    roleList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      roleDialogVisible: false,
      selectedRole: ''
    }
  },
  methods: {
    putAlloted() {
      if(!this.selectedRole) {
        return this.$message.warning('请选择要分配的角色');
      }
      putUserRole(this.userInfo.id, this.selectedRole).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !== 200) {
          return this.$message.error('分配角色失败');
        }
        this.$emit('finishAllotRole');
        this.$message.success('分配角色成功');
        this.roleDialogVisible = false;
      })
    },
    // 对话框关闭后重置选择框
    handleClose() {
      this.selectedRole = '';
    }
  }
  }
</script>


<style scoped>

</style>