<template>
  <div>
   <el-card>
     <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入关键字"
          v-model="queryInfo.query"
          class="input-with-select"
          clearable
          @clear="searchGoods"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchGoods"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="linkToAdd">添加商品</el-button>
      </el-col>
    </el-row>
     <!-- 用户列表区 -->
    <el-table :data="goodsList" border stripe>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" align="center" width="120"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" align="center"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" align="center" width="200"></el-table-column>     
      <el-table-column label="操作" width="130" align="center">
        <template v-slot="goodsProp">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeGoods(goodsProp.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
   </el-card>
  </div>
</template>


<script>
import { getGoodsList, deleteGoods } from 'network/goods'
import { formatDate } from 'common/utils'
export default {
  data() {
    return {
      queryInfo: {
        queryInfo: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 商品总数
      total: 0
    }
  },
  created() {
    this._getGoodsList(this.queryInfo);
  },
  methods: {
    // 网络请求
    _getGoodsList(queryInfo) {
      getGoodsList(queryInfo).then(res => {
        const resdata = res.data;
        if (resdata.meta.status !== 200){
          return this.$message.error("获取商品列表失败");
        }
        // 将add_time时间戳格式化（也可以在全局定义一个过滤器filter对add_time进行格式化）
        resdata.data.goods.forEach(item => {
          let date = new Date(item.add_time * 1000);
          item.add_time = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        })
        this.goodsList = resdata.data.goods;
        // console.log(this.goodsList);
        this.total = resdata.data.total;
      })
    },
    // 事件监听
    // 分页器相关
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this._getGoodsList(this.queryInfo);
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this._getGoodsList(this.queryInfo);
    },
    // 搜索商品
    searchGoods() {
      this._getGoodsList(this.queryInfo);
    },
    // 跳转到添加商品页
    linkToAdd() {
      this.$router.push('/goods/add');
    },
    // 删除商品
    removeGoods(id) {
      this.$confirm('确定删除此商品?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoods(id).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message({type: 'error', message: '删除失败!', center: true});
            }
            this.$message({type: 'success', message: '删除成功!', center: true});
            // 删除完成后重新请商品数据
            this._getGoodsList(this.queryInfo);

          });
          
        }).catch(() => {});
    }
  }
}
</script>


<style scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
.el-pagination {
  margin-top: 15px;
}
</style>