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

  let loading = ref(false);
  const lastValue = ref(null);
  const currentVariable = ref(props.code_variable);
  // const instrument_seq_nr = ref(props.instrument_seq_nr);
  let variables = ref([]);

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

  async function _updateFilter(codePlot, codeLocation=null){
        // console.log(codeLocation)
        // if(!codeLocation) {
        //     return;
        // }
        supabase
            .schema('icp_download')
            .from('code_variable_with_location') // TRY
            .select()
            .eq('code_plot', codePlot)
            .then(response => {
              // following https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-a-javascript-array
              // and https://stackoverflow.com/questions/33089695/how-can-i-sort-an-es6-set
              variables = [...new Set(response.data.map(item => item.code_variable))].sort();
              // console.log('type of variables:', typeof(variables));
              // console.log('variables', variables);
              // console.log(response.data)
              return variables;
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
    let currentIndex = variables.indexOf(currentVariable.value);
    const nextIndex = (currentIndex + 1) % variables.length;
    currentVariable.value = variables[nextIndex];
  }

  // function to reuse code in onMounted and watch
  async function _fetchLastData() {
    const { data, error } = await supabase
      .schema('icp_download')
      .from('mm_mem')
      .select('*') // use * to get all contents
      // .select('date_observation, daily_max, daily_min, daily_mean, code_variable')
      .eq('code_plot', props.code_plot)
      .eq('code_variable', currentVariable.value)
      .order('date_observation', { ascending: false })
      .limit(1)
      .single();
    console.log('data', data);
    // null and 0 are seen as the same return value in Vue, so we need to check for null explicitly
    // if (data.daily_max === 0 || data.daily_min === 0 || data.daily_mean === 0) {
    //   console.warn('No data found for the given plot and variable');
    //   lastValue.value = null; // Clear lastValue when no data is found
    //   console.log('lastValue: ', lastValue.value);
    //   loading.value = false;
    //   return;
    // }
    if (error) {
      console.error('error occured', error.message);
      lastValue.value = null; // Clear lastValue when there's an error
      loading.value = false;
      return;
    }

    // Always update lastValue, even if data is null/undefined
    lastValue.value = data;
    loading.value = false;
  }

  onMounted( async () => {
    loading.value = true
    // ACCORDING TO COPILOT, AWAIT DOES NOT DO ANYTHING HERE, PLEASE CHECK
    variables = await _updateFilter(props.code_plot);
    await _fetchLastData();
  });

  // Watch for prop changes
  watch(() => [props.code_plot, props.code_variable], async () => {
    currentVariable.value = props.code_variable;
    await _fetchLastData();
  });

  // Watch for currentVariable changes (when cycling)
  watch([currentVariable], async () => {
    await _fetchLastData();
  });
</script>

<template>
  <v-card
  elevation="8"
  shaped
  outlined
  color="primary"
  location="bottom"
  style="position: fixed; bottom: 3px;"> <!--right: 20px;-->
    <v-card-title>
        <v-icon>mdi-weather-hazy</v-icon>
        <span class="headline"> Zuletzt gemessene klimatische Werte</span>
    </v-card-title>
    <v-card-actions>
      <v-select
        v-model="currentVariable"
        :items="variables"
        item-text="description"
        item-value="code"
        label=""
        outlined
        dense
        style="min-width: 90px;"
        @click="_fetchLastData"
        />
      <!-- <v-btn @click="_cycleVariables()" :disabled="loading" elevation="3">
        <b>Klick mich!</b>
      </v-btn> -->
      <div v-if="!loading">
        <!-- <b>Klimavariable:</b> {{ currentVariable }} - -->
        <b>Aufnahmedatum:</b> {{ lastValue && lastValue.date_observation || 'NA' }} |
        <b>Durchschnittlich:</b> {{ lastValue && lastValue.daily_mean || 'NA' }} |
        <b>Maximal:</b> {{ lastValue && lastValue.daily_max || 'NA' }} |
        <b>Minimal:</b> {{ lastValue && lastValue.daily_min || 'NA' }}
      </div>
      <div v-else>
        <v-progress-linear indeterminate/>
      </div>
    </v-card-actions>
  </v-card>
</template>