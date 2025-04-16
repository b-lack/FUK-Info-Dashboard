<script setup>

    import { ref, onMounted, useAttrs, defineEmits, watch, getCurrentInstance, onBeforeUnmount } from 'vue'
    import * as echarts from 'echarts';
    import { createClient } from '@supabase/supabase-js';

    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey)

    // GET components attributes
    const attrs = useAttrs();
    
    let myChart;
    const chartContainer = ref(null);
    const data = ref([]);
    const series = ref([]);

    const _loading = ref(false);

    const dataMax = ref([]);
    const dataMin = ref([]);
    const dataRange = ref([]);

    const emit = defineEmits(['update:variablesFilter'])
    const existingVariables = ref([]);

    const chartHeight = ref(600);

    function clearData() {
        data.value = [];
        dataMax.value = [];
        dataMin.value = [];
        dataRange.value = [];
    }
    /*function _getUniqueVariable(icpData){
        // From Column code_variable

        for (let i = 0; i < icpData.length; i++) {
            const variable = icpData[i].code_variable;
            console.log(variable);
            if (!existingVariables.value.includes(variable)) {
                existingVariables.value.push(variable);
            }
        }
        emit('update:variablesFilter', existingVariables.value)
    }*/
    function _parseData(icpData, instrument_seq_nr) {
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

        series.value.push({
            name: `Sensor ${instrument_seq_nr}`,
            avg: data.value,
            max: dataMax.value,
            min: dataMin.value
        });
    }
    function _requestData(code_plot, code_variable, code_location) {
        if(_loading.value) {
            return;
        }
        _loading.value = true;
        supabase
            .schema('icp_download')
            .from('mm_mem')
            .select('date_observation, daily_max, daily_min, daily_mean, code_variable, instrument_seq_nr')
            .eq('code_plot', code_plot)
            .eq('code_variable', code_variable.code)
            .in('instrument_seq_nr', code_location.instrument_seq_nrs)
            .not('daily_max', 'is', null)
            .not('daily_min', 'is', null)
            .not('daily_mean', 'is', null)
            .then(response => {
                // group resonse.data by instrument_seq_nr
                const instrumentData = {};
                response.data.forEach(item => {
                    if (!instrumentData[item.instrument_seq_nr]) {
                        instrumentData[item.instrument_seq_nr] = [];
                    }
                    instrumentData[item.instrument_seq_nr].push(item);
                });
                
                // clear series
                series.value = [];
                // clear data
                clearData();

                Object.values(instrumentData).forEach((_instrumentData) => {
                    if(_instrumentData.length === 0) {
                        return;
                    }
                    _parseData(_instrumentData, _instrumentData[0]["instrument_seq_nr"]);
                });
               


                myChart = echarts.init(chartContainer.value);


                const seriesCount = series.value.length;
                const maxSeriesCount = 4; // Maximum number of series to display

                console.log(seriesCount);
                if(seriesCount == 0) {
                    myChart.clear();
                    _loading.value = false;
                    return;
                }
                //chartHeight.value = Math.min(maxSeriesCount, seriesCount) * (400 );

                // set chart height
                myChart.resize({
                    height: chartHeight.value,
                    width: chartContainer.value.clientWidth
                });
                _loading.value = false;
                _drawChart()
            })
            .catch(error => {
                console.log(error)
                _loading.value = false;
            })
    }

    // Resize handler function
    const handleResize = () => {
        if (myChart) {
            myChart.resize();
        }
    };

    // Watch for changes in attrs.code_plot and attrs.code_variable
    watch(() => [attrs.code_plot, attrs.code_variable, attrs.code_location], ([newPlot, newVariable, newCodeLocation]) => {
        if (newPlot && newVariable && newCodeLocation) {
            _requestData(newPlot, newVariable, newCodeLocation);
        }
    }, { deep: true });

    onMounted(async () => {
        if(attrs.code_plot && attrs.code_variable && attrs.code_location) {
            _requestData(attrs.code_plot, attrs.code_variable, attrs.code_location);            
        }

        // Add resize event listener
        window.addEventListener('resize', handleResize);
    });

    // Clean up resources when component unmounts
    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
        if (myChart) {
            myChart.dispose();
            myChart = null;
        }
    });
    
    
    // https://echarts.apache.org/examples/en/editor.html?c=line-gradient&theme=dark
    function _drawChart() {
        // Update title with current attributes
        option.title[0].text = `${attrs.code_variable.description} in ${attrs.code_variable.unit}`;
        
        //option.xAxis = [];
        //option.yAxis = [];
        option.series = [];
        option.grid = [];
        option.legend.data = [];
        option.yAxis.name = attrs.code_variable.unit;

        // Series Count
        const seriesCount = series.value.length;

        const maxSeriesCount = 1; // Maximum number of series to display
        const globalChartHeight = chartHeight.value - 150;
        
        series.value.forEach((item, index) => {
            const gridIndex = index;

            /*if(index > maxSeriesCount) {
                return;
            }*/

            let topPadding = 60;
            let bottomPadding = 90;
            if(seriesCount > 1) {
                option.legend.data.push(item.name);
                topPadding = 70 + (Math.ceil(seriesCount / 8) * 22);
            }

            // Top position of the grid in Pixels
            const top = topPadding + index * (globalChartHeight / Math.min(maxSeriesCount, seriesCount) + 0) + 'px';
            const height = (chartHeight.value - bottomPadding - topPadding) + 'px';

            option.grid.push({
                left: 10,
                top,
                right: 10,
                height,
                containLabel: true
            });

            /*option.xAxis.push({
                type: 'time',
                gridIndex: gridIndex,
                name: attrs.code_variable.description,
                position: 'bottom',
                axisLabel: {
                    formatter: function (value, index) {
                        return echarts.format.formatTime('yyyy-MM-dd', value);
                    }
                },
                splitLine: {
                    show: true
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return echarts.format.formatTime('yyyy-MM-dd', params.value);
                        }
                    }
                }
            });
            option.yAxis.push({
                type: 'value',
                gridIndex: gridIndex,
                //name: attrs.code_variable.unit,
                position: 'left',
                axisLabel: {
                    formatter: '{value}'
                },
                splitLine: {
                    show: true
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return params.value;
                        }
                    }
                }
            });*/

            /*option.series.push({
                name: `Max ${attrs.code_variable.description}`,
                type: 'line',
                symbol: 'circle',
                data: item.max,
                z: 1,
                itemStyle: {
                    color: 'rgba(0, 136, 255, 100)'
                },
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
            });*/
            option.series.push({
                name: item.name,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                data: item.avg,
                z: 1,
                /*itemStyle: {
                    color: 'rgb(0, 136, 255)'
                },*/
                //xAxisIndex: gridIndex,
                //yAxisIndex: gridIndex,
            });
            /*option.series.push({
                name: `Min ${attrs.code_variable.description}`,
                type: 'line',
                symbol: 'circle',
                data: item.min,
                z: 1,
                itemStyle: {
                    color: 'rgba(0, 136, 255, 100)'
                },
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
            });*/
        });
        
        myChart.setOption(option, true);
    }

    const option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            },
            formatter: function (params) {
                let res = params[0].axisValueLabel + '<br/>';
                params.forEach(item => {
                    res += item.marker + item.seriesName + ': ' + parseFloat(item.value[1]).toFixed(2) + ' ' + attrs.code_variable.unit + '<br/>';
                });
                return res;
            }
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
        legend: {
            top: 40,
            data: []
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time'
        },
        yAxis: {
            type: 'value',
            
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
        
        series: []
    };
    
</script>

<template>
    <div class="relative">
        <div v-if="_loading" class="position-absolute" style="top:0px; left:0px; width:100%; height:5px; z-index: 10; border-radius: 5px;">
            <v-progress-linear
                color="green"
                indeterminate
            ></v-progress-linear>
        </div>
        <div ref="chartContainer" style="width: 100%;"></div>
    </div>
</template>