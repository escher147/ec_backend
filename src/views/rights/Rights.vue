<template>
  <div>
    <bread-crumb :breadcrumb-item="rightsBreadCrumb"></bread-crumb>
    <rights-card></rights-card>
  </div>
</template>


<script>
import BreadCrumb from '@/components/content/BreadCrumb'
import RightsCard from '@/views/rights/rightsChildren/RightsCard'
export default {
  name: '',
  components: {
    BreadCrumb,
    RightsCard
  },
  data() {
    return {
      rightsBreadCrumb: ['权限管理', '权限列表']
    }
  },
  }
</script>


<style scoped>

</style>