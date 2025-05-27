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

    function _parseData(icpData) {
        // group By Year
        const groupedData = icpData.reduce((acc, item) => {
            const year = item.survey_year;
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(item);
            return acc;
        }, {});

        return Object.entries(groupedData).map(([year, items]) => {
            return {
                year: year,
                count: items.length,
                code_fruit_assess_2_or_3: items.filter(item => item.code_fruit_assess === 2 || item.code_fruit_assess === 3).length,
                code_fruit_assess: items.map(item => item.code_fruit_assess)
            };
        });
    }

    function _requestData(code_plot, code_variable, code_location) {

        supabase.schema('icp_download')
            .from('cc_trc')
            .select('code_fruit_assess, survey_year')
            .lt('code_removal', 10)
            .eq('code_plot', code_plot)
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
                const res = _parseData(data);
                console.log('Parsed data:', res);

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
                            console.log(params);
                            params.forEach(item => {
                                res += item.marker + item.seriesName + ': ' + parseFloat(item.value).toFixed(2) + ' %<br/>';
                            });
                            return res;
                        }
                    },
                    legend: {
                        top: 40,
                        data: []
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
                        data: res.map(item => item.year),
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                        data: res.map(item => item.code_fruit_assess_2_or_3 / item.count * 100),
                        name: 'Fruit Assess 2 or 3 (%)',
                        type: 'bar'
                        }
                    ],
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                };
                myChart.setOption(option, true);
                
                
            }).catch(error => {
                console.error('Error in requestData:', error);
            });
    }

    watch(() => [attrs.code_plot, attrs.code_variable, attrs.code_location], ([newPlot, newVariable, newCodeLocation]) => {
        console.log(newPlot);
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