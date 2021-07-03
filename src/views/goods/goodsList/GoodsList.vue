<template>
  <div>
    <bread-crumb :breadcrumbItem="goodsListBC"></bread-crumb>
    <goods-list-card></goods-list-card>
  </div>
</template>


<script>
import BreadCrumb from '@/components/content/BreadCrumb'
import GoodsListCard from '@/views/goods/goodsList/listChildren/GoodsListCard'
export default {
  data() {
    return {
      goodsListBC: ['商品管理','商品列表']
    }
  },
  components: {
    BreadCrumb,
    GoodsListCard
  }
  }
</script>


<style scoped>

</style>