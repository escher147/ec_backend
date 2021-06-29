<template>
  <div class="aside_comp">
    <div class="toggle-button" @click="collapseToggle">
      <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
    </div>

    <!-- router属性：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
    <el-menu
      background-color="#222D32"
      text-color="#fff"
      active-text-color="#18BC9C"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
    >
      <!-- 一级菜单 -->
      <!-- el-submenu中index只接收字符串 -->
      <el-submenu 
        :index="item.id + ''"
        v-for="item in menuList" :key="item.id"
      >
        <!-- 一级菜单模板 -->
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item 
          :index="'/' + subItem.path"
          v-for="subItem in item.children" :key="subItem.id"
          @click="savePath('/' + subItem.path)"
        >
          <!-- 二级菜单模板 -->
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>


<script>
import { getMenuList } from 'network/aside'
export default {
  name: "Aside",
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this._getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
    // console.log(this.activePath);
  },
  methods: {
    // 网络请求
    _getMenuList() {
      getMenuList().then(res => {
        // console.log(res);
        const resdata = res.data;
        if (resdata.meta.status !== 200) return this.$message.error(resdata.meta.msg);
        this.menuList = resdata.data;
        // console.log(this.menuList);
      })
    },
    // 事件监听
    collapseToggle() {
      this.isCollapse = !this.isCollapse;
      this.$emit('collapseToggle', this.isCollapse);
    },
    savePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  },
};
</script>


<style lang="less" scoped>
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border-right: none;
  }
  .toggle-button {
    background-color: #374850;
    font-size: 18px;
    height: 36px;
    line-height: 36px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>