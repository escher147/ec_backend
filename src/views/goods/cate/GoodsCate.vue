<template>
  <div>
    <bread-crumb :breadcrumbItem="goodsCateBC"></bread-crumb>
    <cate-card></cate-card>
  </div>
</template>


<script>
import BreadCrumb from '@/components/content/BreadCrumb'
import CateCard from '@/views/goods/cate/cateChildren/CateCard'
export default {
  components: {
    BreadCrumb,
    CateCard
  },
  data() {
    return {
      goodsCateBC: ['商品管理', '商品分类']
    }
  },
  }
</script>


<style scoped>

</style>