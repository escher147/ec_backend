<template>
  <el-dialog 
    title="添加分类" 
    :visible.sync="editCateDiologVisible" 
    width="50%" 
    close="editCateDialogClose" 
  >
    <el-form 
      :model="editCateForm"
      :rules="editCateRules"
      ref="editCateRedf"
      label-width="100px"
    >
      <el-form-item label="分类名称:" prop="cat_name">
        <el-input v-model="editCateForm.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editCateDiologVisible = false">取 消</el-button>
      <el-button type="primary" @click="submiteEitCate">确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
import { putEditCate } from 'network/goods'
export default {
  data() {
    return {
      // 当前分类数据
      editCateDiologVisible: false,
      editCateForm: {},
      editCateRules: {
        cat_name: [
            {required: true, message:'分类名称不能为空', trigger: 'blur'}
        ] 
      }
    }
  },
  methods: {
    // 网络请求

    // 事件监听
    // 提交修改信息
    submiteEitCate() {
      this.$refs.editCateRedf.validate(valid => {
        if (!valid) {
          return this.$message.warning('用户名不能为空');
        }
        putEditCate(this.editCateForm.cat_id, this.editCateForm.cat_name).then(res => {
          const rdata = res.data;
          if (rdata.meta.status !== 200) {
            return this.$message.error('修改分类名称失败');
          }
          this.$message.success('修改分类名称成功');
          this.$emit('editCateComplete');
          this.editCateDiologVisible = false;
      })
      })    
    }
  },
  }
</script>


<style scoped>

</style>