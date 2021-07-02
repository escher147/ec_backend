<template>
  <div>
    <el-table
    :data="paramsData"
    border
    stripe
  >
    <el-table-column type="expand">
      <template v-slot="expandProp">
        <el-tag 
          type="primary"
          closable
          v-for="(item, index) in expandProp.row.attr_vals" :key="index"
          @close="tagClose(index, expandProp.row)"
        >
          {{item}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="expandProp.row.inputVisible"
          v-model="expandProp.row.inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm(expandProp.row)"
          @blur="handleInputConfirm(expandProp.row)"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput(expandProp.row)">+ New Tag</el-button>
      </template>

    </el-table-column>  
    <el-table-column type="index"></el-table-column>    
    <el-table-column
      label="参数名称"
      prop="attr_name"
    >
    </el-table-column>
    <el-table-column label="操作">
      <template v-slot="attrProp">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditAttrDialog(attrProp.row)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttribute(attrProp.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editAttributeVisible"
      width="50%"
      @close="editDiologClose"  
    >
      <el-form ref="editRef" :model="editForm" :rules="editRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditAttribute">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>


<script>
import { getAttributeById, putCateAttribute, deleteCateAttribute } from 'network/goods'
export default {
  props: {
    paramsData: {
      type: Array,
      default() {
        return []
      }
    },
    titleText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editAttributeVisible: false,
      // 表单数据
      editForm: {},
      // 表单验证规则
      editRules: {
        attr_name: [{required: true, message:'名称不能为空', trigger: 'blur'}]
      },
      // newTag输入框显示隐藏控制
      // inputVisible: false,
      // 输入框的value
      // inputValue: ''


    }
  },
  methods: {
    showEditAttrDialog(attrInfo) {
      this.editAttributeVisible = true;
      getAttributeById(attrInfo.cat_id, attrInfo.attr_id, attrInfo.attr_sel).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !== 200) {
          return this.$message.error('获取参数出错');
        }
        this.editForm = rdata.data;
      })
    },
    // 提交编辑
    submitEditAttribute() {
      this.$refs.editRef.validate(valid => {
        if(!valid) {
          return this.$message.warning('名称不能为空');
        }
        putCateAttribute(this.editForm.cat_id, this.editForm.attr_id, this.editForm.attr_name, this.editForm.attr_sel).then(res => {
          const rdata = res.data;
          if (rdata.meta.status !== 200) {
            return this.$message.error('修改失败');
          }
          this.$emit('editAttrComplete');
          this.editAttributeVisible = false;
          this.$message.success('修改成功');
        })
      })
    },
    editDiologClose() {
      this.$refs.editRef.resetFields();
    },
    // 删除属性
    removeAttribute(attrInfo) {
      this.$confirm('确认删除分类?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCateAttribute(attrInfo.cat_id, attrInfo.attr_id).then(res => {
            const rdata = res.data;
            if (rdata.meta.status !== 200) {
              return this.$message.error('删除失败');         
            }
            this.$emit('removeAttrComplete');
            this.$message.success('删除成功');
          })
        }).catch(() => {});
      
    },
    // enter键抬起或者输入框失去焦点
    handleInputConfirm(row) {
      // 判断是否输入了内容
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue);
      row.inputValue = '';
      row.inputVisible = false;
      // 新增attr_vals提交到服务器
      this._putCateAttribute(row);
    },
    // 显示输入框
    showInput(row) {
      // console.log(row);
      row.inputVisible = true;
      // 文本框自动获取焦点
      // $nextTick在页面重新渲染后回调函数，不然无法获取input
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除属性tag
    tagClose(index, row) {
      row.attr_vals.splice(index, 1);
      // 删除后重新提交到服务器
      this._putCateAttribute(row);
    },
    // 编辑提交参数网络请求
    _putCateAttribute(row) {
      let attr_vals = row.attr_vals.join(' ');
      putCateAttribute(row.cat_id, row.attr_id, row.attr_name, row.attr_sel, attr_vals).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !==200) {
          return this.$message.error('操作失败');
        }
        this.$message.success('操作成功');
      })
    }
  },
  
  }
</script>


<style scoped>
  .el-table {
    margin-top: 15px;
  }
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 150px;
  }
</style>