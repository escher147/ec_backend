<template>
  <div>
    <el-card>
    <!-- 添加分类 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-button type="primary" @click="showAddCate" class="addbtn">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 分类列表 -->
    <tree-table
      :data="cateList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      border
    >
      <!-- 是否有效列模板 -->
      <template v-slot:isok="isokProp">
        <i class="el-icon-success" v-if="isokProp.row.cat_deleted === false"></i>
        <i class="el-icon-error" v-else></i>
      </template>
      <!-- 排序列模板 -->
      <template v-slot:order="orderProp">
        <el-tag type="success" size="mini" v-if="orderProp.row.cat_level === 0">一级</el-tag>
        <el-tag  size="mini" v-else-if="orderProp.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" size="mini" v-else>三级</el-tag>
      </template>
      <!-- 操作列模板 -->
      <template v-slot:operation="optProp">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCate(optProp.row)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="showRemoveMessage(optProp.row)">删除</el-button>
      </template>
    </tree-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <add-cate-dialog 
      ref="addCate" 
      :parent-cate-list="parentCateList"
      @addCateComplete="refreshCateList"  
    ></add-cate-dialog>
    <!-- 编辑分类对话框 -->
    <edit-cate-dialog 
      ref="editCate"
      @editCateComplete="refreshCateList"
    ></edit-cate-dialog>
  </div>
</template>


<script>
import { getGoodsCate, deleteCate } from 'network/goods'

import AddCateDialog from './AddCateDialog'
import EditCateDialog from './EditCateDialog'
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
     
      // 商品分类列表
      cateList: [],
      // 商品分类总数
      total: 0,
      // 表格列的属性
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      // 父级分类数据请求参数
      addCateQuery: {
        type: 2
      },
      parentCateList: []
    }
  },
  components: {
    AddCateDialog,
    EditCateDialog
  },
  created() {
    this._getGoodsCate(this.queryInfo);
  },
  methods: {
    // 网络请求
    _getGoodsCate(query) {
      getGoodsCate(query).then(res => {
        // console.log(res);
        const rdata = res.data;
        if (rdata.meta.status !== 200) {
          return this.$message.error('获取商品分类列表出错');
        }
        this.cateList = rdata.data.result;
        this.total = rdata.data.total;
        // console.log(this.cateList);
      })
    },

    // 事件监听
    // 添加分类
    showAddCate() {
      this.$refs.addCate.addCateDiologVisible = true;
      // 获取父级分类全部数据
      getGoodsCate(this.addCateQuery).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !== 200) {
          return this.$message.error('获取商品分类列表出错');
        }
        this.parentCateList = rdata.data;
      })
    },
    // 编辑分类
    showEditCate(cateInfo) {
      this.$refs.editCate.editCateForm = cateInfo;
      this.$refs.editCate.editCateDiologVisible = true
    },
    // 删除分类
    showRemoveMessage(cateInfo) {
      this.$confirm('确认删除分类?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCate(cateInfo.cat_id).then(res => {
            const rdata = res.data;
            if (rdata.meta.status !== 200) {
              return this.$message.error('删除分类失败');
            }
            this._getGoodsCate(this.queryInfo);
            this.$message.success('删除分类成功');
          })
        }).catch(() => {});
    },
     handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this._getGoodsCate(this.queryInfo);
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this._getGoodsCate(this.queryInfo);
    },
    // 重新请求分类列表数据
    refreshCateList() {
      this._getGoodsCate(this.queryInfo);
    }
  }
  }
</script>


<style scoped>
  .addbtn {
    margin-bottom: 15px;
  }
  .el-icon-success {
    color: green;
  }
  .el-icon-error {
    color: red;
  }
</style>