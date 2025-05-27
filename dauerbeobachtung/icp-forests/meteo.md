---
layout: page
---

<script setup>
  import Chart from '../../components/Chart.vue'
  import DVariableSelection from '../../components/DVariableSelection.vue'
  import DInstrumentSelection from '../../components/DInstrumentSelection.vue'
  import { ref, onMounted } from 'vue'

  let code_plot = ref('1201');
  let code_variable = ref({
    description: 'Air temperature',
    unit: '°C',
    code: 'AT'
  });
  const code_location = ref(null);
  const variablesFilter = ref([]);

  onMounted(() => {
    variablesFilter.value = ['AT'];
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

  // https://icp-forests.org/documentation/Dictionaries/d_variable.html

  const _setCodePlot = (code) => {
    code_plot.value = code;
    // code_variable_with_location
  };
 
</script>

<div class="mx-4 my-4 vp-doc mb-9">
    <h1>Meteo</h1>

<div class="my-9">
    <h5>
        <v-icon class="mr-2" size="20">mdi-map-marker-distance</v-icon>
        Probeflächen
    </h5>
    <div class="my-4 d-flex flex-wrap ga-3">
        <v-btn-toggle
            rounded="xl"
            v-for="(value, key) in plots" :key="key"
            v-model="code_plot"
            mandatory
        >
            <v-btn :key="key" :value="key" @click="_setCodePlot(key)">{{ value.name }}</v-btn>
        </v-btn-toggle>
    </div>
</div>

<div class="my-9">
    <!--Location-->
    <h5>
        <v-icon class="mr-2" size="20">mdi-map-marker</v-icon>
        Waldstandort / Freifläche
    </h5>
    <DInstrumentSelection :code_plot="code_plot" @update:codeLocation="code_location = $event"/>
</div>

<div class="my-9">
    <!--Sensors-->
    <h5>
        <v-icon class="mr-2" size="20">mdi-access-point-network</v-icon>
    Sensor
    </h5>
    <DVariableSelection :variablesFilter="variablesFilter" :code_plot="code_plot" :code_location="code_location" @update:codeVariable="code_variable = $event" />
</div>

<v-card class="my-4" style="overflow:visible;">
 <v-card-text>
  <Chart :code_plot="code_plot" :code_location="code_location" :code_variable="code_variable" :variablesFilter="variablesFilter" @update:variablesFilter="variablesFilter = $event"  />
  </v-card-text>
</v-card>

</div>