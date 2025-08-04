<script setup>
    import DVariableSelection from '../../components/DVariableSelection.vue'
    import DInstrumentSelection from '../../components/DInstrumentSelection.vue'
    import { ref, onMounted } from 'vue'
    import { createClient } from '@supabase/supabase-js'

    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey);


    let code_plot = ref('1201');
    let code_variable = ref('AT');
    let instrument_seq_nr = ref(1);
    //const variablesFilter = ref([]);

    onMounted(() => {
        // variablesFilter.value = ['AT'];
        _requestData(code_plot.value, code_variable.value, [instrument_seq_nr.value])
            .then(({ data, error }) => {
                if (error) {
                    console.error('Error fetching data:', error);
                } else {
                    // Process the data as needed
                    console.log('Fetched data:', data);
                }
            })
            .finally(() => {
                _loading.value = false;
            });
    });

    const plots = {
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

    function _requestData(code_plot, code_variable, instrument_seq_nr) {
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
        .in('instrument_seq_nr', instrument_seq_nr)
        .order('date_observation', { ascending: false })
        .limit(1)
    }

</script>

<template>
    <div class="last-temp-widget">
        <DInstrumentSelection v-model="instrument_seq_nr" :code_plot="code_plot" />
        <DVariableSelection v-model="code_variable" :variablesFilter="variablesFilter" />
        <div class="widget-content">
            <p>Last Temperature: {{ code_variable }} at instrument {{ instrument_seq_nr }}</p>
            <!-- Add more content as needed -->
        </div>
    </div>
</template>
