<template>
  <div>
    <el-button type="info" icon="el-icon-switch-button" @click="logout"></el-button>
  </div>
</template>


<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  }
  }
</script>


<style lang="less" scoped>

</style>