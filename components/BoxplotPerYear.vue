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
                    defol: [],
                    count: 0,
                };
            }
            series[item.code_plot][item.survey_year].count += 1;
            series[item.code_plot][item.survey_year].defol.push(item.code_defoliation);
        });
        console.log(series);
        seriesData.value = Object.keys(series).map(code_plot => {
            const data = [];
            Object.keys(series[code_plot]).forEach(year => {
                const defol = series[code_plot][year].defol;
            
                data.push({
                    value: defol,
                    name: year,
                    code_plot: plots[code_plot].name
                });
            });
            console.log(data);
            return {
                name: code_plot,
                type: 'boxplot',
                //stack: 'total',
                data: data.sort((a, b) => a.name - b.name), // Sort by year
            };
        });
        
    }

    function _requestData() {

        supabase.schema('icp_download')
            .from('cc_trc')
            .select('code_defoliation, survey_year, code_plot')
            .lt('code_removal', 10)
            .or(
                'and(code_plot.in.(1208,1209),code_tree_species.eq.48),' +
                'and(code_plot.in.(1207),code_tree_species.eq.20),' +
                'and(code_plot.in.(1203,1204),code_tree_species.eq.134)'
            )
            .in('survey_year', [2021, 2020])
            .then(({ data, error }) => {
                if (error) {
                    console.error('Error fetching data:', error);
                    return;
                }

                if (!data || data.length === 0) {
                    console.warn('No data found for the given parameters.');
                    return;
                }
                console.log('Fetched data:', data);
                _parseData(data);

  const option = {
  dataset: [
    {
      source: data
    },
    {
      id: 'code_defoliation',
      source: seriesData.value
    },
    {
      id: 'survey_year',
      source: xAxisData.value.map(year => ({
        survey_year: year,
        code_plot: plots[1201].name // Default plot for the x-axis
      }))
    }
    
  ],
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        datasetId: 'code_defoliation',
        itemStyle: {
          color: '#b8c5f2'
        },
        encode: {
          x: ['min', 'Q1', 'median', 'Q3', 'max'],
          y: 'code_plot',
          itemName: ['code_plot'],
          tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
        }
      },
      {
        name: 'detail',
        type: 'scatter',
        datasetId: 'survey_year',
        symbolSize: 6,
        tooltip: {
          trigger: 'item'
        },
        label: {
          show: true,
          position: 'top',
          align: 'left',
          verticalAlign: 'middle',
          rotate: 90,
          fontSize: 12
        },
        itemStyle: {
          color: '#d00000'
        },
        encode: {
          x: 'code_defoliation',
          y: 'code_plot',
          label: 'survey_year',
          itemName: 'survey_year',
          tooltip: ['code_plot', 'survey_year', 'code_defoliation']
        }
      }
    ]
  };
  myChart.setOption(option);
                _renderChart();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
            

 
    
    onMounted(async () => {
        _requestData();

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