<script setup>
    import { ref, onMounted, getCurrentInstance} from 'vue'
    import { createClient } from '@supabase/supabase-js'

    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey);


    let code_plot = ref('1201');
    let code_variable = ref('AT');
    let instrument_seq_nr = ref(1);
    let loading = ref(false);
    let lastTemp = ref(null);

    onMounted(() => {
        console.log('Mounted LastTempWidget');
        loading.value = true;
        supabase
            .schema('icp_download')
            .from('mm_mem')
            .select('date_observation, daily_max, daily_min, daily_mean, code_variable, instrument_seq_nr') // use * to get all contents
            .eq('code_plot', code_plot.value)
            .eq('code_variable', code_variable.value)
            .in('instrument_seq_nr', instrument_seq_nr.value)
            .order('date_observation', { ascending: false })
            .limit(1).single.then(({ data, error }) => {
                if (error) {
                    console.error('Error fetching data:', error);
                } else {
                    console.log('Fetched data:', data);
                    lastTemp.value = data
                }
            })
            .finally(() => {
                loading.value = false;
            });
    });

    // definition der anderen plots für später
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


</script>

<template>
    <p>
    {{ lastTemp.dateObservation }} -
    {{ lastTemp.daily_mean }} -
    {{ lastTemp.daily_max}} -
    {{ lastTemp.daily_min }}

    <!-- include a loader/ loading screen/bar-->
    </p>

</template>
