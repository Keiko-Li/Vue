<template>
    <div>
      <el-card>
        <div id="main" style="wdith: 600px; height: 400px;">111</div>
      </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#e9eef3'
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
          { boundaryGap: false }
        ],
        yAxis: [
          {type: 'value'}
        ]
      }
    }
  },
  created () {

  },
  // 此时，页面的元素，已经被渲染完毕了！
  async mounted () {
    //  3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 4.获取服务器数据
    await this.axios.get('http://127.0.0.1:8888/api/private/v1/reports/type/1')
      .then(({data: res}) => {
        if (res.meta.status !== 200) return this.$message.error('get data default!')
        // 4.和准备数据和配置项
        const result = _.merge(res.data, this.options)
        console.log(result)
        // 5.展示数据
        myChart.setOption(result)
      })
      .catch((error) => {
        this.$message.error(error)
      })
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>
