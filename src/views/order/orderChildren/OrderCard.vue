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
          @clear="searchOrder"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchOrder"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
     <!-- 订单列表区 -->
    <el-table :data="ordersList" border stripe>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="300" align="center"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100" align="center"></el-table-column>
      <el-table-column prop="pay_status" label="是否付款" width="100" align="center">
        <template v-slot="orderProp">
          <el-tag type="success" v-if="orderProp.row.pay_status === '1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100" align="center"></el-table-column>
      <el-table-column prop="create_time" label="下单时间" width="200" align="center"></el-table-column>
      <el-table-column label="操作" width="130" align="center">
        <template>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditAddress"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            size="mini"
            @click="showLogistics"
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
   <!-- 修改地址对话框 -->
   <el-dialog
     title="修改地址"
     :visible.sync="editAddressVisible"
     width="50%"
     @close="editDialogClose"
    >
     <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
       <el-form-item label="省市区/县" prop="address1">
        <el-cascader
          :options="cityData"
          v-model="editForm.address1"
          :props="{ expandTrigger: 'hover' }">
        </el-cascader>
       </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="editForm.address2"></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer">
       <el-button @click="editAddressVisible = false">取 消</el-button>
       <el-button type="primary" @click="editAddressVisible = false">确 定</el-button>
     </div>
   </el-dialog>
   <!-- 查看物流对话框 -->
   <el-dialog
     title="订单物流信息"
     :visible.sync="logisticsVisible"
     width="50%">
     <!-- Timeline时间线 -->
     <el-timeline :reverse="false">
      <el-timeline-item
        v-for="(activity, index) in logisticsData"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
      </el-timeline-item>
    </el-timeline>
   </el-dialog>
  </div>
</template>


<script>
import { getOrders, getLogistics } from 'network/orders'
import { formatDate } from 'common/utils'
import cityData from '@/common/citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      ordersList: [],
      total: 0,
      editAddressVisible: false,
      editForm: {
        address1: [],
        address2: ''
      },
      cityData,
      editRules: {
        address1: [{required: true, message:'请选择地址', trigger: 'blur'}],
        address2: [{required: true, message:'请输入详细地址', trigger: 'blur'}]
      },
      logisticsVisible: false,
      logisticsData: [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ],
    }
  },
  created() {
    this._getOrders(this.queryInfo);
  },
  methods: {
    // 网络请求
    // 请求订单列表数据
    _getOrders(queryInfo) {
      getOrders(queryInfo).then(res => {
        const rdata = res.data;
        if (rdata.meta.status !== 200) {
          return this.$message.error('获取订单列表出错');
        }
        
        rdata.data.goods.forEach(item => {
          let date = new Date(item.create_time * 1000);
          item.create_time = formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        })
        this.ordersList = rdata.data.goods;
        this.total = rdata.data.total;
      })
    },
    // 事件监听
    // 搜索订单
    searchOrder(){
      console.log(this.queryInfo);
      this._getOrders(this.queryInfo);
    },
    // 分页器相关事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this._getOrders(this.queryInfo);
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this._getOrders(this.queryInfo);
    },
    // 显示修改地址对话框
    showEditAddress() {
      this.editAddressVisible = true;
    },
    // 关闭对话框
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 显示物流信息对话框
    showLogistics() {
      // getLogistics().then(res => {
      //   console.log(res);
      // })
      this.logisticsVisible = true;
    }
  },
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
.el-cascader {
  width: 100%;
}
</style>