<template>
  <div>
    <bread-crumb :breadcrumbItem="orderBc"></bread-crumb>
    <order-card></order-card>

  </div>
</template>


<script>
import BreadCrumb from '@/components/content/BreadCrumb'
import OrderCard from '@/views/order/orderChildren/OrderCard'
export default {
  data() {
    return {
      orderBc: ['订单管理', '订单列表']
    }
  },
  components: {
    BreadCrumb,
    OrderCard
  }
  }
</script>


<style scoped>

</style>