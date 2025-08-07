<script setup>
  import { ref, onMounted, getCurrentInstance, watch}  from 'vue'
  import { createClient } from '@supabase/supabase-js'

  const instance = getCurrentInstance();
  const apikey = instance.appContext.config.globalProperties.$apikey;
  const url = instance.appContext.config.globalProperties.$url;
  const supabase = createClient(url, apikey);

  // definition der anderen plots für später
  // const plots = {
  //     1201: {name: 'Natteheide'},
  //     1202: {name: 'Beerenbusch'},
  //     1203: {name: 'Kienhorst'},
  //     1204: {name: 'Weitzgrund'},
  //     1205: {name: 'Neusorgefeld'},
  //     1206: {name: 'Schwenow'},
  //     1207: {name: 'Beerenbusch Buchen'},
  //     1208: {name: 'Fünfeichen'},
  //     1209: {name: 'Kienhorst Eichen'}
  // };

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
      instrument_seq_nr: {
          type: Number,
          required: true,
          default: 1
      }
  });

  let loading = ref(false);
  const lastValue = ref(null);

  // Create a reactive references for the currentVariable that can be modified
  const currentVariable = ref(props.code_variable);
  const instrument_seq_nr = ref(props.instrument_seq_nr);
  const variables = ref([]);

  function _getCodeVariables() {
      supabase
          .schema('icp_dictionaries')
          .from('d_variable')
          .select('code, description, unit')
          .neq('code', 'XX')
          .then(response => {
              // console.log(response.data)
              variables.value = response.data;
          })
          .catch(error => {
              console.log(error)
          })
  }
// console.log('available variables', variables.value)

  // function to cycle through variables
  async function _cycleVariables() {
    const variables = ['AP', 'AT', 'BR', 'MP', 'NR', 'PR', 'RH', 'SD', 'SF', 'SR', 'ST', 'TF', 'UR', 'WC', 'WD', 'WS']
    // const variables = _getCodeVariables();
    let currentIndex = variables.indexOf(currentVariable.value);
    // console.log('currentIndex', currentIndex);
    const nextIndex = (currentIndex + 1) % variables.length;
    // console.log('nextIndex', nextIndex);
    currentVariable.value = variables[nextIndex];
    console.log('variable', currentVariable.value);
  }

  // function to switch instruments
  // async function _switchInstrument() {
  //   if (instrument_seq_nr.value === 1) {
  //     instrument_seq_nr.value = 2; // Switch to Freifläche
  //   } else {
  //     instrument_seq_nr.value = 1; // Switch to Waldstandort
  //   }
  //   console.log('current instrument_seq_nr', instrument_seq_nr.value);
  //   loading.value = true;
  //   await _fetchLastData();
  // }

  // function to reuse code from onMounted and watch
  async function _fetchLastData() {
    const { data, error } = await supabase
      .schema('icp_download')
      .from('mm_mem')
      .select('*') // use * to get all contents
      // .select('date_observation, daily_max, daily_min, daily_mean, code_variable, instrument_seq_nr')
      .eq('code_plot', props.code_plot)
      .eq('code_variable', currentVariable.value)
      .eq('instrument_seq_nr', instrument_seq_nr.value)
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
    _getCodeVariables();
    await _fetchLastData();
    // console.log('instrument_seq_nr', instrument_seq_nr.value);
  });

  // Watch for prop changes
  watch(() => [props.code_plot, props.code_variable], async () => {
    // loading.value = true;
    // Update currentVariable when prop changes
    currentVariable.value = props.code_variable;
    _getCodeVariables();
    await _fetchLastData();
  });

  // Watch for currentVariable changes (when cycling)
  watch(currentVariable, async () => {
    // loading.value = true;
    await _fetchLastData();
  });

  // Watch for instrument_seq_nr changes (when toggling between Waldstandort/Freifläche)
  watch(instrument_seq_nr, async () => {
    // loading.value = true;
    await _fetchLastData();
  });
</script>

<template>
  <div class="last-temp-widget">
    <v-btn-toggle v-model="instrument_seq_nr">
      <v-btn :value="1">Waldstandort</v-btn>
      <v-btn :value="2">Freifläche</v-btn>
    </v-btn-toggle>
    <br></br>
    <v-btn @click="_cycleVariables()">
      <b>Cycle Variables</b>
    </v-btn>
    <!-- <v-switch label='Freifläche' @click="_switchInstrument()"></v-switch> -->
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