<template>
  <div>
    <bread-crumb :breadcrumb-item="userBreadCrum"></bread-crumb>
    <user-card></user-card>
  </div>
</template>


<script>
import BreadCrumb from "@/components/content/BreadCrumb";
import UserCard from "@/views/user/userChildren/UserCard";

export default {
  name: "",
  components: {
    BreadCrumb,
    UserCard,
  },
  data() {
    return {
      userBreadCrum: ['用户管理', '用户列表']
    }
  },
};
</script>


<style lang="less" scoped>
</style>