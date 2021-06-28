<template>
  <div>
    <bread-crumb></bread-crumb>
    <user-card></user-card>
  </div>
</template>


<script>
import BreadCrumb from "@/views/user/userChildren/BreadCrumb";
import UserCard from "@/views/user/userChildren/UserCard";

export default {
  name: "",
  components: {
    BreadCrumb,
    UserCard,
  }
};
</script>


<style lang="less" scoped>
</style>