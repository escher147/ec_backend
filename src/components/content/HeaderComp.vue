<template>
  <div class="header-comp">
    <div class="header-left">
      <img src="@/assets/img/icon.png">
      <span>后台管理系统</span>
    </div>
    <el-button type="info" 
               icon="el-icon-switch-button" 
               @click="logout"
               class="logout-btn"
               plain></el-button>
  </div>
 
</template>


<script>
export default {
  name: 'Header',
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  }
  }
</script>


<style lang="less" scoped>
  .header-comp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 100%;
    font-size: 20px;  
    > div {
      display: flex;
      align-items: center;
      margin-left: 10px;
      span {
        margin-left: 15px;
      }
    }
  }
  .header-left img {
    width: 52px;
    height: 52px;
  }
  .logout-btn {
    margin-right: 10px;
  }
</style>