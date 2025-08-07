<script setup>
  import { ref, onMounted, getCurrentInstance, watch}  from 'vue'
  import { createClient } from '@supabase/supabase-js'

  const instance = getCurrentInstance();
  const apikey = instance.appContext.config.globalProperties.$apikey;
  const url = instance.appContext.config.globalProperties.$url;
  const supabase = createClient(url, apikey);

  const props = defineProps({
      code_plot: {
          type: String,
          required: true,
          default: null
      },
      code_variable: {
          type: String,
          required: true,
          default: 'AT'
      },
      // instrument_seq_nr: {
      //     type: Number,
      //     required: true,
      //     default: 1
      // }
  });
  // statt loading noch zweite variable um button zu deaktivieren
  let loading = ref(false);
  const lastValue = ref(null);
  const currentVariable = ref(props.code_variable);
  // const instrument_seq_nr = ref(props.instrument_seq_nr);
  const variables = ref([]);

  // function _getCodeVariables() {
  //     supabase
  //         .schema('icp_dictionaries')
  //         .from('d_variable')
  //         .select('code, description, unit')
  //         .neq('code', 'XX')
  //         .then(response => {
  //             // console.log(response.data)
  //             variables.value = response.data;
  //         })
  //         .catch(error => {
  //             console.log(error)
  //         })
  // }

  // TODO abfragen welche codeVariables verfügbar sind
  function _updateFilter(codePlot, codeLocation=null){
        // console.log(codeLocation)
        // if(!codeLocation) {
        //     return;
        // }
        supabase
            .schema('icp_download')
            .from('code_variable_with_location') // TRY
            .select()
            // .in('instrument_seq_nr', codeLocation.instrument_seq_nrs)
            .eq('code_plot', codePlot)
            .then(response => {
              console.log(response.data)
                // variablesFilter.value = response.data.map(item => item.code_variable);
                // response.data.forEach(item => {
                //     variablesFilterDetails.value[item.code_variable] = item;
                // });
            })
            .catch(error => {
                console.log(error)
            });
    }

  // function to cycle through variables
  async function _cycleVariables() {
    // TODO replace static variables with dynamically fetched variables
    // from _updateFilter()
    const variables = ['AP', 'AT', 'BR', 'MP', 'NR', 'PR', 'RH', 'SD', 'SF', 'SR', 'ST', 'TF', 'UR', 'WC', 'WD', 'WS']
    let currentIndex = variables.indexOf(currentVariable.value);
    const nextIndex = (currentIndex + 1) % variables.length;
    currentVariable.value = variables[nextIndex];
    console.log('variable', currentVariable.value);
  }

  // function to reuse code from onMounted and watch
  async function _fetchLastData() {
    const { data, error } = await supabase
      .schema('icp_download')
      .from('mm_mem')
      .select('*') // use * to get all contents
      // .select('date_observation, daily_max, daily_min, daily_mean, code_variable, instrument_seq_nr')
      .eq('code_plot', props.code_plot)
      .eq('code_variable', currentVariable.value)
      .order('date_observation', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('error occured', error.message);
      lastValue.value = null; // Clear lastValue when there's an error
      loading.value = false;
      return;
    }

    // Always update lastValue, even if data is null/undefined
    lastValue.value = data || null;
    loading.value = false;
  }

  onMounted( async () => {
    loading.value = true
    // _getCodeVariables();
    await _updateFilter(props.code_plot);
    await _fetchLastData();
    // console.log('instrument_seq_nr', instrument_seq_nr.value);
  });

  // Watch for prop changes
  watch(() => [props.code_plot, props.code_variable], async () => {
    currentVariable.value = props.code_variable;
    await _fetchLastData();
  });

  // Watch for currentVariable and instrument changes (when cycling)
  watch([currentVariable,instrument_seq_nr], async () => {
    await _fetchLastData();
  });
</script>

<template>
  <!-- TODO <v-card> position='fixed' right bottom-->

  <div class="last-temp-widget">
    <!-- <v-btn-toggle v-model="instrument_seq_nr">
      <v-btn :value="1">Waldstandort</v-btn>
      <v-btn :value="2">Freifläche</v-btn>
    </v-btn-toggle> -->
    <br></br>
    <v-btn @click="_cycleVariables()" :disabled="loading">
      <!-- TODO check if button is disabled during reloading, exchange for other variable that is only true on reloading, not on initial mount-->
      <b>Cycle Variables</b>
    </v-btn>
    <br></br>
    <div v-if="!loading">
      <b>chosen variable: {{ currentVariable }}</b>
      <br>
      observation date: {{ lastValue?.date_observation || '' }}
      <br>
      mean value: {{ lastValue?.daily_mean || '' }}
      <br>
      max value: {{ lastValue?.daily_max || '' }}
      <br>
      min value: {{ lastValue?.daily_min || '' }}
    </div>
    <div v-else>
    <br></br>
      <v-progress-linear indeterminate="true"/>
    </div>
  </div>
</template>