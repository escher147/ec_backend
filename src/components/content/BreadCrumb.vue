<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in breadcrumbItem" :key="item">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>


<script>
export default {
  name: '',
  props: {
    breadcrumbItem: {
      type: Array,
      default() {
        return []
      }
    }
  }
  }
</script>


<style scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }
</style>