<template>
  <div class="login_container">
    <login-box></login-box>
  </div>
</template>


<script>

  import LoginBox from '@/views/login/loginChildren/LoginBox'
  export default {
    name: 'Login',
    components: {
      LoginBox
    }
    }
</script>


<style lang="less" scoped>
  .login_container {
    background-color: #BCD2EE;
    height: 100%;
  }
</style>