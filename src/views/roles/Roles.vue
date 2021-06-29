<template>
  <div>
    <bread-crumb :breadcrumb-item="rolesBreadCrumb"></bread-crumb>
    <roles-card></roles-card>
  </div>
</template>


<script>
import BreadCrumb from '@/components/content/BreadCrumb'
import RolesCard from '@/views/roles/rolesChildren/RolesCard'
export default {
  name: '',
  components: {
    BreadCrumb,
    RolesCard
  },
  data() {
    return {
      rolesBreadCrumb: ['权限管理', '角色列表'],
      // roleList: []
    }
  }
  }
</script>


<style scoped>

</style>