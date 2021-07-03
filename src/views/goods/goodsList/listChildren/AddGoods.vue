<template>
  <div>
    <bread-crumb :breadcrumbItem="addGoodsBC"></bread-crumb>
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"  
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeStep - 0" finish-status="success" align-center> 
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-position="top">
        <!-- tab选项卡 -->
        <el-tabs v-model="activeStep" :tab-position="tabPosition" :before-leave="beforeTabLeave" @tab-click="tabSwitch">
          <!-- 基本信息选项卡 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat" type="number">
              <el-cascader
              v-model="addForm.goods_cat"
              :options="goodsCate"
              :props="cateCasProps"
              @change="cateChange"
              clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数选项卡 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox 
                  v-for="(vitem, vindex) in item.attr_vals" 
                  :key="vindex" 
                  :label="vitem"
                  border  
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性选项卡 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item 
              v-for="item in onlyData" 
              :key="item.attr_id"              
              :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片选项卡 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"  
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容选项卡 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="submitNewGoods">提交商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="previewDialogVisible"
      width="50%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>


<script>
import { getGoodsCate, getCateAttributes, postGoods } from 'network/goods'

import { deepCopy } from 'common/utils'

import BreadCrumb from '@/components/content/BreadCrumb'
export default {
  data() {
    return {
      addGoodsBC: ['商品管理','添加商品'],
      // 步骤条当前进度
      activeStep: '0',
      // tab选项卡的位置
      tabPosition: 'left',
      // 商品分类数据
      goodsCate: [],
      cateCasProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addRules: {
        goods_name: [
          {required: true, message:'商品名称不能为空', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message:'商品价格不能为空', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message:'商品重量不能为空', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message:'商品数量不能为空', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message:'商品分类不能为空', trigger: 'blur'}
        ]
      },
      // 动态参数数据
      manyData: [],
      // 静态属性数据
      onlyData: [],
      // 商品图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 因为el-upload使用的是自己封装的网络请求，项目使用了axios拦截器，直接upload图片会响应无效token，因此需要在请求头中携带token
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的地址
      previewPath: '',
      // 预览图片对话框
      previewDialogVisible: false
    }
  },
  components: {
    BreadCrumb
  },
  created() {
    getGoodsCate().then(res => {
      const rdata = res.data;
      if (rdata.meta.status !== 200) {
        return this.$message.error('获取商品分类出错');
      }
      this.goodsCate = rdata.data;
    })
  },
  methods: {
    // 级联选择器变化
    cateChange() {
      let length = this.addForm.goods_cat.length;
      if (length !== 3) {
        this.addForm.goods_cat = [];
      }
      // console.log(this.addForm.goods_cat);
    },
    // 阻止tab选项卡切换
    beforeTabLeave(activeName, oldActiveName) {
      let length = this.addForm.goods_cat.length;
      if (oldActiveName === '0' && length !== 3) {
        this.$message.error('请先选择商品分类');
        return false;
      }
    },
    // tab选项卡切换
    tabSwitch() {
      // 当activeName为1时请求商品参数数据
      if (this.activeStep === '1') {
        getCateAttributes(this.cateId, 'many').then(res => {
          const rdata = res.data;
          if (rdata.meta.status !== 200) {
            return this.$message.error('获取动态参数出错');
          }
          rdata.data.forEach(item => {
            // 避免为空返回一个含空字符串的数组
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
          })
          this.manyData = rdata.data;
        })
      } else if (this.activeStep === '2') {
        getCateAttributes(this.cateId, 'only').then(res => {
          const rdata = res.data;
          if (rdata.meta.status !== 200) {
            return this.$message.error('获取静态属性出错');
          }
          this.onlyData = rdata.data;
          console.log(this.onlyData);
        })
      }
    },
    // 预览商品图片
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },
    // 删除所选图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(item => item.pic === filePath);
      this.addForm.pics.splice(index, 1);
    },
    // 上传图片成功后
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    // 提交要添加的商品信息
    submitNewGoods() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.warning('必填项不能为空')
        }
        // 将goods_cat变为字符串
        // 拷贝addForm，直接修改会影响级联选择器
        let addFormCopy = deepCopy(this.addForm);
        addFormCopy.goods_cat = addFormCopy.goods_cat.join(',');
        // 处理动态参数和静态属性
        this.manyData.forEach(item => {
          const newManyData = {attr_id: item.attr_id, attr_value: item.attr_vals.join(',')};
          this.addForm.attrs.push(newManyData);
        })
        this.onlyData.forEach(item => {
          const newOnlyData = {attr_id: item.attr_id, attr_value: item.attr_vals};
          this.addForm.attrs.push(newOnlyData);
        })
        addFormCopy.attrs = this.addForm.attrs;
        // 添加商品网络请求
        postGoods(addFormCopy).then(res => {
          const rdata = res.data;
          if (rdata.meta.status !== 201) {
            this.$message.error('添加商品失败');
          }
          this.$message.success('添加商品成功');
          this.$router.push('/goods');
        })
      })
    }

  },
  computed: {
    cateId() {
      if( this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null
    }
  }
  }
</script>


<style scoped>
 .el-checkbox {
   margin: 0 10px 10px 0 !important;
 }
 .previewImg {
   width: 100%;
 }
 .el-button {
   margin-top: 15px;
 }
</style>