<script setup>
    import { ref, onMounted, getCurrentInstance, watch}  from 'vue'
    import { createClient } from '@supabase/supabase-js'

    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey);

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

    const props = defineProps({
        code_plot: {
            type: String,
            required: true,
            default: '1202'
        },
        code_variable: {
            type: String,
            required: true,
            default: 'AT'
        },
        instrument_seq_nr: {
            type: Number,
            required: true,
            default: 1
        }
    });

    let code_plot = ref(props.code_plot);
    let code_variable = ref(props.code_variable);
    let instrument_seq_nr = ref(props.instrument_seq_nr);
    let loading = ref(false);
    const lastTemp = ref(null);

    onMounted( async () => {
      loading.value = true
      try{
        const { data, error } = await supabase
          .schema('icp_download')
          .from('mm_mem')
          .select('*') // use * to get all contents
          // .select('date_observation, daily_max, daily_min, daily_mean, code_variable, instrument_seq_nr')
          .eq('code_plot', props.code_plot)
          .eq('code_variable', code_variable.value)
          .eq('instrument_seq_nr', instrument_seq_nr.value)
          .order('date_observation', { ascending: false })
          .limit(1)
          .single();
        if (error) {
          console.error('error occured', error.message);
        } else {
          lastTemp.value = data;
        }
      } catch (err) {
        console.error('error occured', err.message);
      } finally {
        loading.value = false;
      }
    });

    watch(() => props.code_plot, async (newCodePlot) => {
      loading.value = true;
      try {
          const { data, error } = await supabase
          .schema('icp_download')
          .from('mm_mem')
          .select('*')
          .eq('code_plot', newCodePlot)
          .eq('code_variable', code_variable.value)
          .eq('instrument_seq_nr', instrument_seq_nr.value)
          .order('date_observation', { ascending: false })
          .limit(1)
          .single();
          if (error) {
          console.error('error occured', error.message);
          } else {
          lastTemp.value = data;
          }
      } catch (err) {
          console.error('error occured', err.message);
      } finally {
          loading.value = false;
      }
    });
</script>

<template>
    <div v-if="lastTemp">
    observation date: {{ lastTemp?.date_observation }} |
    mean temp: {{ lastTemp?.daily_mean }}C |
    max temp: {{ lastTemp?.daily_max }}C |
    min temp: {{ lastTemp?.daily_min }}C

    <!-- include a loader/ loading screen/bar-->
    </div>

</template>
