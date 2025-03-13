<script setup>

    import { ref, onMounted, useAttrs, watch } from 'vue'
    import * as echarts from 'echarts';
    import { createClient } from '@supabase/supabase-js';

    const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w';
    const url = 'https://forstliche-umweltkontrolle.de:8000/';

    // GET components attributes
    const attrs = useAttrs();

    let myChart;
    const data = ref([]);
    const dataMax = ref([]);
    const dataMin = ref([]);
    const dataRange = ref([]);
    const supabase = createClient(url, apikey)

    function clearData() {
        data.value = [];
        dataMax.value = [];
        dataMin.value = [];
        dataRange.value = [];
    }

    function _parseData(icpData) {
        clearData();
        for (let i = 0; i < icpData.length; i++) {
            const base = new Date(icpData[i].date_observation);
            data.value.push([base, icpData[i].daily_mean]);
            dataMax.value.push([base, icpData[i].daily_max]);
            dataMin.value.push([base, icpData[i].daily_min]);
            //dataRange.value.push([base, icpData[i].daily_min, icpData[i].daily_max]);
        }
        // sort data by date
        data.value.sort((a, b) => a[0] - b[0]);
        dataMax.value.sort((a, b) => a[0] - b[0]);
        dataMin.value.sort((a, b) => a[0] - b[0]);
        //dataRange.value.sort((a, b) => a[0] - b[0]);
    }
    function _requestData(code_plot, code_variable) {
        supabase
            .schema('icp_download')
            .from('mm_mem')
            .select('date_observation, daily_max, daily_min, daily_mean')
            .eq('code_plot', code_plot)
            .eq('code_variable', code_variable)
            .not('daily_max', 'is', null)
            .not('daily_min', 'is', null)
            .not('daily_mean', 'is', null)
            .then(response => {
                _parseData(response.data)
                myChart = echarts.init(document.getElementById('chart'));
                _drawChart()
            })
            .catch(error => {
                console.log(error)
            })
    }

    // Watch for changes in attrs.code_plot and attrs.code_variable
    watch(() => [attrs.code_plot, attrs.code_variable], ([newPlot, newVariable]) => {
        if (newPlot && newVariable) {
            _requestData(newPlot, newVariable);
        }
    }, { deep: true });

    onMounted(async () => {
        if(attrs.code_plot && attrs.code_variable) {
            _requestData(attrs.code_plot, attrs.code_variable)
            console.log('sdfsdf');
            
        }
    });

    
    

    function _drawChart() {
        // Update title with current attributes
        option.title[0].text = `${attrs.code_variable_description['name']} in ${attrs.code_variable_description['unit']}`;
        
        // Update series data with reactive data
        //option.series[0].data = dataMax.value;
        //option.series[1].data = dataMin.value;
        option.series[0].data = data.value;
        option.series[0].name = attrs.code_variable_description['name'];
        
        myChart.setOption(option);
    }

    const option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            },
            
        },
        grid: {
            left: 50,
            top: 45,
            right: 0,
            bottom: 100
        },
        title: [
            {
                left: 'left',
                //text: `Temperature in ${attrs.code_plot} - ${attrs.code_variable}`,  // Title text - use from attrs if available
            },
            {
                left: 'left',
                text: 'ICP Forest Data des Landesbetrieb Forst Brandenburg',  // Footer text - use from attrs if available
                bottom: '0',
                textStyle: {
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#999'
                }
            },
            {
                left: 'right',
                text: 'forstliche-umweltkontrolle.de',  // Footer text - use from attrs if available
                bottom: '0',
                textStyle: {
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#999'
                }
            }
        ],
        toolbox: {
            feature: {
                type: 'cross',
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            //boundaryGap: false
        },
        yAxis: {
            type: 'value',
            //boundaryGap: [0, '100%']
        },
        dataZoom: [
            {
                type: 'inside',
                start: 80,
                end: 100,
                bottom: 40
            },
            {
                start: 80,
                end: 100,
                bottom: 40
            }
        ],
        
        series: [
            
            
            
            {
                name: 'Mean Temperature',
                type: 'line',
                symbol: 'circle',
                data: data.value,
                z: 2,
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },
            },
        ]
    };
    
</script>

<template>
    <div id="chart" style="width: 100%;height:500px;"></div>
</template>