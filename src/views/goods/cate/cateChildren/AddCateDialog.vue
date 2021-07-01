<template>
  <el-dialog 
    title="添加分类" 
    :visible.sync="addCateDiologVisible" 
    width="50%"
    @close="addCateDialogClose"  
  >
    <el-form 
      :model="addCateForm"
      :rules="addCateRules"
      ref="addCateRedf"
      label-width="100px"
    >
      <el-form-item label="分类名称:" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称:">
        <el-cascader
          v-model="seletcedCateId"
          :options="parentCateList"
          :props="cateCasProps"
          @change="cateChange"
          clearable></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addCateDiologVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitAddCate">确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
import { postGoodCate } from 'network/goods'
export default {
  props: {
    parentCateList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      addCateDiologVisible: false,
      addCateForm: {
        // 添加分类的名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 默认等级为一级分类
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
            {required: true, message:'分类名称不能为空', trigger: 'blur'}
        ]       
      },
      // 级联选择器props
      cateCasProps: { 
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 级联选择器选中分类的id
      seletcedCateId: []
    }
  },
  methods: {
    // 选择分类项发生变化
    cateChange() {
      let length = this.seletcedCateId.length;
      // 判断length是否大于0来区分是否有选中父级分类
      if (length > 0) {
        this.addCateForm.cat_pid = this.seletcedCateId[length - 1];
        this.addCateForm.cat_level = length;
        return
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }

    },
    // 提交添加分类信息
    submitAddCate() {
       this.$refs.addCateRedf.validate(valid => {
        if (!valid) {
          return this.$message.warning('分类名称不能为空')
        }
        postGoodCate(this.addCateForm).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !== 201) {
          return this.$message.error('添加分类失败');
        }
        this.$emit('addCateComplete');
        this.addCateDiologVisible = false;
      })
       }) 
    },
    // 关闭对话框后重置表单数据
    addCateDialogClose() {
      this.$refs.addCateRedf.resetFields();
      this.seletcedCateId = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    }
  }
  }
</script>


<style scoped>
  .el-cascader {
    width: 100%;
  } 
  

</style>