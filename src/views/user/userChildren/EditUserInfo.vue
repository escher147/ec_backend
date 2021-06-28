<template>
  <el-dialog
    title="修改用户"
    :visible.sync="editDialogVisible"
    width="50%"
  >
     <el-form 
      :model="editForm" :rules="editRules" 
      ref="editRef"
      label-width="70px"
    >
     <el-form-item label="用户名">
      <el-input v-model="editForm.username" disabled></el-input>
     </el-form-item>
     <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email"></el-input>
     </el-form-item>
     <el-form-item label="手机" prop="mobile">
      <el-input v-model="editForm.mobile"></el-input>
     </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitEdit">确 定</el-button>
    </span>  
  </el-dialog>
</template>


<script>
import { UserFormValidator } from 'common/mixin.js'
import { putEditUser } from 'network/users'
export default {
  name: '',
  mixins: [UserFormValidator],
  data() {
    return {
      editDialogVisible: false
    }
  },
  props: {
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  }, 
  methods: {
    submitEdit() {
      this.$refs.editRef.validate(valid => {
        if (!valid) {
          return this.$message.warning({message: '请输入正确的信息', center: true});
        }
        putEditUser(this.editForm.id, this.editForm.email, this.editForm.mobile).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error({message: '修改失败', center: true});
          }
          this.$message.success({message: '修改成功', center: true});
          this.editDialogVisible = false;
          this.$emit('editSuccess')
        })
      })
    }
  }
  }
</script>


<style scoped>

</style>