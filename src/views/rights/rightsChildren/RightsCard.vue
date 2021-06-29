<template>
  <el-card>
    <el-table
      :data="rightList"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
         <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
         <el-tag v-else-if="scope.row.level === '1'">二级</el-tag>
         <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>


<script>
import { getListRights } from 'network/rights'
export default {
  name: '',
  data() {
    return {
      rightList: []
    }
  },
  created() {
    this._getListRights();
  },
  methods: {
    _getListRights() {
       getListRights().then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('获取权限列表失败');
        }
        this.rightList = res.data.data;
      })
    }
  }
  }
</script>


<style scoped>

</style>