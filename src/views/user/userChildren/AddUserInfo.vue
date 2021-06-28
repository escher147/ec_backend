<template>
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClose"  
  >
    <el-form 
      :model="addForm" :rules="addRules" 
      ref="addRef"
      label-width="70px"
    >
     <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username"></el-input>
     </el-form-item>
     <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password"></el-input>
     </el-form-item>
     <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email"></el-input>
     </el-form-item>
     <el-form-item label="手机" prop="mobile">
      <el-input v-model="addForm.mobile"></el-input>
     </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitUserInfo">确 定</el-button>
    </span>
</el-dialog>
</template>


<script>
import { postUser } from 'network/users'
import { UserFormValidator } from 'common/mixin.js'
export default {
  name: '',
  mixins: [UserFormValidator],
  data() {
    return {
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [
            {required: true, message:'请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名长度在3-10字符之间', trigger: 'blur'}
        ],
        password: [
            {required: true, message:'请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '密码长度在6-15字符之间', trigger: 'blur'}
        ]
        
      }
    }
  },
  methods: {
    // 关闭表单时重置表单内容
    addDialogClose() {
      this.$refs.addRef.resetFields();
    },
    // 提交
    submitUserInfo() {
      // console.log(this.addForm.username);
      this.$refs.addRef.validate(valid => {
        if(!valid) {
          return this.$message.warning({
            message: '请填入正确的信息',
            center: true
          })
        }
      postUser(this.addForm).then(res => {
        console.log(res);
        if (res.data.meta.status !== 201) {
          return this.$message.error({message: '添加失败', center: true})
        }
        this.$message.success({message: '添加成功', center: true});
        this.addDialogVisible = false;
        this.$emit('addSuccess')
      })
      })
    }
  }
  }
</script>


<style scoped>

</style>