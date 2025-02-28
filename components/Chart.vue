<script setup>

    import { ref, onMounted } from 'vue'
    import * as echarts from 'echarts';

    var myChart;
    // mm_mem : https://icp-forests.org/documentation/Surveys/MM/MEM.html
    /**
     * 
     */

    function _drawChart() {
        myChart.setOption({
            title: {
                text: 'TMP Chart'
            },
            tooltip: {},
            xAxis: {
                data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
            },
            yAxis: {},
            series: [
                {
                name: 'sales',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
                }
            ]
        });
    }

    onMounted(() => {
        myChart = echarts.init(document.getElementById('chart'));
        _drawChart()
    })
    
</script>

<template>
    <div id="chart" style="width: 600px;height:400px;"></div>
</template>