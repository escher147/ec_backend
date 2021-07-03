<template>
  <div>
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>


<script>
import * as echarts from 'echarts';
import { getReports } from 'network/report'
import _ from 'lodash'
export default {
  data() {
    return {
      reportData: {},
      // 与reportData合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    getReports().then(res => {
      const rdata = res.data;
      if (rdata.meta.status !== 200) {
        this.$message.error('获取数据出错');
      }
      this.reportData = rdata.data;
      console.log(this.reportData);
      const result = _.merge(this.reportData, this.options)
      myChart.setOption(result);

    })
    // 指定图表的配置项和数据
   

    // 使用刚指定的配置项和数据显示图表。
  }
  }
</script>


<style scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
 #main {
   margin: 0 auto;
 }
</style>