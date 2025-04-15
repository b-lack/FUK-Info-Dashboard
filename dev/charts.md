---
layout: home
---
# Meteo

<script setup>
  import Chart from '../components/Chart.vue'
  import DvariableSelection from '../components/DvariableSelection.vue'
  import DInstrumentSelection from '../components/DInstrumentSelection.vue'
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

<div class="my-4">
    <h5>Probefläche</h5>
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

<!--Location-->
<DInstrumentSelection :code_plot="code_plot" @update:codeLocation="code_location = $event"/>

<!--Sensors-->
<DvariableSelection :variablesFilter="variablesFilter" :code_plot="code_plot" :code_location="code_location" @update:codeVariable="code_variable = $event" />

<v-card class="my-4" style="overflow:visible;">
 <v-card-text>
  <Chart :code_plot="code_plot" :code_location="code_location" :code_variable="code_variable" :variablesFilter="variablesFilter" @update:variablesFilter="variablesFilter = $event"  />
    <p>
        Lufttemperatur Tagesmittel im Vergleich mit dem 68 % Quantil der in der Zeitreihe 1951-vergangenes Jahr an der Station gemessenen Tagesmitteltemperaturen (Tagesmittel +- Standardabweichung; [°C]).Normalwerte (1951 -2024) hier auch mit Extremwerten von 1951 -2024.
    </p>
    </v-card-text>
</v-card>