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
    const chartHeight = ref(600);
    let myChart;
    const chartContainer = ref(null);

    const xAxisData = ref([]);
    const seriesData = ref([]);

    const plots = {
        1101: {name: 'Grunewald'},
        1201: {name: 'Natteheide'},
        1202: {name: 'Beerenbusch'},
        1203: {name: 'Kienhorst'},
        1204: {name: 'Weitzgrund'},
        1205: {name: 'Neusorgefeld'},
        1206: {name: 'Schwenow'},
        1207: {name: 'Beerenbusch Buchen'},
        1208: {name: 'Fünfeichen'},
        1209: {name: 'Kienhorst Eichen'}
    };

    function _parseData(icpData) {

        // xAxis by grouped survey_year
        const xAxis = icpData.reduce((acc, item) => {
            if (!acc.includes(item.survey_year)) {
                acc.push(item.survey_year);
            }
            return acc;
        }, []).sort((a, b) => a - b);
        xAxisData.value = xAxis;

        // seriesData array by code_plot
        const series = {};
        icpData.forEach(item => {
            if (!series[item.code_plot]) {
                series[item.code_plot] = {};
            }
            if (!series[item.code_plot][item.survey_year]) {
                series[item.code_plot][item.survey_year] = {
                    count_fruit_assess: 0,
                    count: 0,
                };
            }
            series[item.code_plot][item.survey_year].count += 1;
            series[item.code_plot][item.survey_year].count_fruit_assess += (item.code_fruit_assess === 2 || item.code_fruit_assess === 3) ? 1 : 0;
        });
        console.log(series);
        seriesData.value = Object.keys(series).map(code_plot => {
            const data = [];
            Object.keys(series[code_plot]).forEach(year => {
                const percentage = (series[code_plot][year].count_fruit_assess / series[code_plot][year].count) * 100;
                data.push({
                    value: percentage.toFixed(2),
                    name: year,
                    code_plot: code_plot
                });
            });
            console.log(data);
            return {
                name: code_plot,
                type: 'bar',
                //stack: 'total',
                data: data.sort((a, b) => a.name - b.name), // Sort by year
            };
        });
        
    }

    function _requestData(code_plot, code_variable, code_location) {

        supabase.schema('icp_download')
            .from('cc_trc')
            .select('code_fruit_assess, survey_year, code_plot')
            .lt('code_removal', 10)
            //.eq('code_plot', code_plot)
            //.or('code_fruit_assess.eq.2,code_fruit_assess.eq.3')
            .then(({ data, error }) => {
                if (error) {
                    console.error('Error fetching data:', error);
                    return;
                }

                if (!data || data.length === 0) {
                    console.warn('No data found for the given parameters.');
                    return;
                }
                _parseData(data);

                const option = {
                    title: [
                        {
                            left: 'left',
                            text: `Vegetationszeit`,  // Title text - use from attrs if available
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
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        },
                        formatter: function (params) {
                            let res = params[0].axisValueLabel + '<br/>';
                            params.forEach(item => {
                                res += item.marker + item.seriesName + ': ' + parseFloat(item.value).toFixed(2) + ' %<br/>';
                            });
                            return res;
                        }
                    },
                    legend: {
                        top: 0,
                        data: seriesData.value.map(item => item.name),
                    },
                    grid: {
                        left: 50,
                        top: 45,
                        right: 0,
                        bottom: 100
                    },
                    xAxis: {
                        type: 'category',
                        name: 'Year',
                        data: xAxisData.value,
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: seriesData.value,
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    dataZoom: [
                        {
                            start: 65,
                            end: 100,
                            bottom: 40
                        }
                    ],
                };
                myChart.setOption(option, true);
                
                
            }).catch(error => {
                console.error('Error in requestData:', error);
            });
    }

    watch(() => [attrs.code_plot, attrs.code_variable, attrs.code_location], ([newPlot, newVariable, newCodeLocation]) => {
        if (newPlot) {
            _requestData(newPlot, newVariable, newCodeLocation);
        }
    }, { deep: true });

    onMounted(async () => {
        if(attrs.code_plot) {
            _requestData(attrs.code_plot, attrs.code_variable, attrs.code_location);            
        }

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        myChart = echarts.init(chartContainer.value);
        myChart.resize({
            height: chartHeight.value,
            width: chartContainer.value.clientWidth
        });

    });
    // Resize handler function
    const handleResize = () => {
        if (myChart) {
            myChart.resize();
        }
    };
</script>

<template>
    <div ref="chartContainer" style="width: 100%;"></div>
</template>