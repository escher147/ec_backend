<template>
  <div class="login_box">
    <!-- 头像 -->
    <div class="avatar_box">
      <img src="@/assets/img/logo.png" alt="">
    </div>
    <!-- 登录表单 -->
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0px" class="form_box">
      <!-- 输入区 -->
      <el-form-item prop="username">
        <!-- 属性方式加图标 -->
        <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <!-- slot方式加图标 -->
        <el-input type="password" v-model="loginForm.password">
          <i slot="prefix" class="el-input__icon el-icon-lock"></i>
        </el-input>
      </el-form-item>
      <!-- 按钮区 -->
      <el-form-item class="btn_box">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { loginReq } from 'network/login'
export default {
  name: 'LoginBox',
  data() {
    return {
      // element-ui from数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      loginRules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名长度在 3 到 10个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, max: 15, message: '密码长度在 6 到 15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return;
        // 登录请求
        const username = this.loginForm.username,
              password = this.loginForm.password;
        loginReq(username, password).then(res => {
          // console.log(res);
          const status = res.data.meta.status;
          const token = res.data.data.token;
          if (status === 200) {
            this.$message({
              center: true,
              message: '登录成功',
              type: 'success'
            });
            // 将token保存在sessionStorage中，并跳转到首页
            window.sessionStorage.setItem('token', token);
            this.$router.push('/home')
          } else if (status == 400) {
            this.$message({
              showClose: true,
              center: true,
              message: '用户名或密码错误',
              type: 'error'
            });
          } 
        })
      })
    }
  }
  
  }
</script>


<style lang="less" scoped>
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_box {
    position: absolute;
    width: 130px;
    height: 130px;
    border: 1px solid #ddd;
    border-radius: 50%;
    padding: 7px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    left: 50%;
    transform: translate(-50%,-50%);
    img {
      
      width: 100%;
      height: 100%;
      border-radius: 50%;
      
    }
  }
  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btn_box {
    display: flex;
    justify-content: flex-end;
  }

</style>