<template>
  <el-container class="home-container">
  <el-header>
    <header-comp></header-comp>
  </el-header>
  <el-container>
    <el-aside :width="currentCollapse ? '64px' : '200px'">
      <aside-comp @collapseToggle="collapseToggle"></aside-comp>
    </el-aside>
    <el-main>     
        <router-view></router-view>     
    </el-main>
  </el-container>
</el-container>

</template>


<script>
import HeaderComp from '@/components/content/HeaderComp'
import AsideComp from '@/components/content/AsideComp'
export default {
  name: 'Home',
  data() {
    return {
      currentCollapse: false
    }
  },
  components: {
    HeaderComp,
    AsideComp
  
  },
  methods: {
    collapseToggle(isCollapse) {
      this.currentCollapse = isCollapse;
    }
  }
  }
</script>


<style lang="less" scoped>
  .home-container {
    height: 100%;
    background-color: #F1F4F6;
  }
  .el-header {
    padding: 0;
    // margin-bottom: 4px;
    border-bottom: 1px solid #eee;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.2);
  }
  .el-aside {
    background-color: #222D32;
  }
  .el-main {
    background-color: #E8EDF0;
    margin: 15px 15px 0 15px;
  }
</style>