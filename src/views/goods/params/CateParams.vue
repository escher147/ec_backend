<template>
  <div>
    <bread-crumb :breadcrumbItem="cateParamsBC"></bread-crumb>
    <params-card></params-card>
  </div>
</template>


<script>
import BreadCrumb from '@/components/content/BreadCrumb'
import ParamsCard from '@/views/goods/params/paramsChildren/ParamsCard'
export default {
  data() {
    return {
      cateParamsBC: ['商品管理', '参数列表']
    }
  },
  components: {
    BreadCrumb,
    ParamsCard
  }
  }
</script>


<style scoped>

</style>