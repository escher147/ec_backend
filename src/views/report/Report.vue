<template>
  <div>
    <bread-crumb :breadcrumbItem="reportBC"></bread-crumb>
    <report-card></report-card>
  </div>
</template>


<script>
import BreadCrumb from '@/components/content/BreadCrumb'
import ReportCard from '@/views/report/reportChildren/ReportCard'
export default {
  data() {
    return {
      reportBC: ['数据统计', '数据报表']
    }
  },
  components: {
    BreadCrumb,
    ReportCard
  }
  }
</script>


<style scoped>

</style>