<script setup>
    import { ref, onMounted, getCurrentInstance, watch} from 'vue'
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

    onMounted( async () => {
        // console.log('Mounted LastTempWidget');
        loading.value = true
        // console.log(loading.value)
        try{
            lastTemp = await supabase
                .schema('icp_download')
                .from('mm_mem')
                // .select('date_observation, daily_max, daily_min, daily_mean, code_variable, instrument_seq_nr')
                .select('*')
                // use * to get all contents
                .eq('code_plot', code_plot.value)
                .eq('code_variable', code_variable.value)
                .eq('instrument_seq_nr', instrument_seq_nr.value)
                .order('date_observation', { ascending: false })
                .limit(1).single()
            console.log('try statement runs through till here')

            lastTemp = lastTemp.data
            console.log(lastTemp)
            // return lastTemp.value = data;
            console.log(lastTemp.date_observation)
            return lastTemp
        }
        catch (error) {
            console.log('this is an error')
        }

        finally {
            loading.value = false;
            console.log(loading.value)
        };
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
    <div>
    observation date: {{ lastTemp.date_observation }} |
    mean temp: {{ lastTemp.daily_mean }}C |
    max temp: {{ lastTemp.daily_max }}C |
    min temp: {{ lastTemp.daily_min }}C

    <!-- include a loader/ loading screen/bar-->
    </div>

</template>
