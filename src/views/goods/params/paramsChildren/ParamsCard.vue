<template>
  <div>
    <el-card>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      close-text="知道了"
      show-icon=""
    ></el-alert>
    <!-- 选择商品分类 -->
    <el-row class="select-cate">
      <el-col>
        <span class="select-title">选择商品分类:</span>
        <el-cascader
          v-model="selectedCateId"
          :options="cateList"
          :props="cateCasProps"
          @change="cateChange"
          clearable></el-cascader>
      </el-col>
    </el-row> 
    <!-- tab选项卡切换 -->
     <el-tabs v-model="activeName" @tab-click="handleTabClick" >
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addAttributeVisible = true">添加参数</el-button>
        <params-table :params-data="manyCateParams" title-text="动态参数" @editAttrComplete="refreshTable" @removeAttrComplete="refreshTable"></params-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled"  @click="addAttributeVisible = true">添加属性</el-button>
        <params-table :params-data="onlyCateParams" title-text="静态属性" @editAttrComplete="refreshTable" @removeAttrComplete="refreshTable"></params-table>
      </el-tab-pane>
    </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addAttributeVisible"
      width="50%"
      @close="addDiologClose"  
    >
      <el-form ref="addRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddAttribute">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  
  
</template>


<script>
import { getGoodsCate, getCateAttributes, postCateAttribute } from 'network/goods'
import ParamsTable from '@/views/goods/params/paramsChildren/ParamsTable'
export default {
  data() {
    return {
      // 请求分类的参数
      queryInfo: {
        type: 3
      },
      // 保存商品分类数据
      cateList: [],
      // 选中的分类id
      selectedCateId: [],
       // 级联选择器props
      cateCasProps: { 
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被激活的tab选项卡
      activeName: 'many',
      // 保存获取的分类参数
      manyCateParams: [],
      onlyCateParams: [],
      // 控制添加属性对话框显示隐藏
      addAttributeVisible: false,
      // 表单数据
      addForm: {},
      // 表单验证规则
      addRules: {
        attr_name: [{required: true, message:'名称不能为空', trigger: 'blur'}]
      }
    }
  },
  components: {
    ParamsTable
  },
  created() {
    this._getGoodsCate(this.queryInfo)
  },
  methods: {
    // 网络请求
    // 获取商品分类列表
    _getGoodsCate(queryInfo) {
      getGoodsCate(queryInfo).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !==200) {
          return this.$message.error('获取商品分类出错');
        }
        this.cateList = rdata.data;
      })
    },
    // 根据id和sel获取分类参数
    _getCateAttributes(id,sel) {
      getCateAttributes(id, sel).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !== 200) {
        return this.$message.error('获取分类参数出错');
        }
        rdata.data.forEach(item => {
          // 避免为空返回一个含空字符串的数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
          // 控制添加newTag输入框的显示与隐藏
          item.inputVisible = false;
          // 添加newTag输入框的value
          item.inputValue = '';
        })
        if (this.activeName === 'many') {
          this.manyCateParams = rdata.data
        } else {
          this.onlyCateParams = rdata.data
        }
        // console.log(this.manyCateParams, this.onlyCateParams);
      })
    },
    // 事件监听
    // 级联选择器框中变化触发
    cateChange() {
      // console.log(this.selectedCateId);
      let length = this.selectedCateId.length;
      // 如果选中的不是三级分类清空selectedCateId
      if (length !== 3) {
        this.selectedCateId = [];
        // 保证从三级分类切换到一级二级时表格数据清空
        this.manyCateParams = [];
        this.onlyCateParams = [];
        return 
      }
      // 发送网络请求获取分类参数
      this._getCateAttributes(this.cateId, this.activeName);
    },
    // tab选项卡点击事件
    handleTabClick() {
      if (this.selectedCateId.length === 3) {
        this._getCateAttributes(this.cateId, this.activeName);
      }
    },
    // 添加对话框关闭事件
    addDiologClose() {
      this.$refs.addRef.resetFields();
    },
    // 提交添加属性
    submitAddAttribute() {
      this.$refs.addRef.validate(valid => {
        if (!valid) {
          return this.$message.warning('名称不能为空');
        }
        // 提交添加的属性参数
        postCateAttribute(this.cateId, this.addForm.attr_name, this.activeName).then(res => {
          const rdata = res.data;
          if (rdata.meta.status !== 201) {
            return this.$message.error('添加失败');
          }         
          this._getCateAttributes(this.cateId, this.activeName);
          this.$message.success('添加成功');
          this.addAttributeVisible = false;
        })
      })
    },
    // 修改属性完成后刷新属性表
    refreshTable() {
      this._getCateAttributes(this.cateId, this.activeName);
    }

  },
  computed: {
    isBtnDisabled() {
      return this.selectedCateId.length !== 3;
    },
    cateId() {
      if (this.selectedCateId.length === 3) {
        return this.selectedCateId[2];
      }
      return null;
    },
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性';
    }
  }
  
  }
</script>


<style scoped>
  .select-cate {
    margin: 15px 0;
  }
  .select-title {
    margin-right: 15px;
  }
</style>