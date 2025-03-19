---
layout: home
---
# Meteo

<script setup>
  import Chart from '../components/Chart.vue'
  import { ref, onMounted } from 'vue'

  let code_plot = ref('1201');
  let code_variable = ref('AT');

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
  const variables = {
    //AP: {name: 'Atmospheric pressure', unit: 'hPa'},
    AT: {name: 'Air temperature', unit: '°C'},
    MP: {name: 'Soil Moisture Matric potential', unit: 'kPa'},
    //PR: {name: 'Precipitation', unit: 'mm'},
    RH: {name: 'Relative air humidity', unit: '%'},
    //SR: {name: 'Global radiation', unit: 'W/m²'},
    ST: {name: 'Soil temperature', unit: '°C'},
    TF: {name: 'Throughfall', unit: 'mm'},
    WC: {name: 'Water content', unit: 'Vol%'},
    //WD: {name: 'Wind direction', unit: '°'},
    WS: {name: 'Wind speed', unit: 'm/s'}
  }
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
            <v-btn  :key="key" :value="key" @click="code_plot = key">{{ value.name }}</v-btn>
        </v-btn-toggle>
    </div>
</div>

<v-card class="my-4" style="overflow:visible;">
 <v-card-text>
  <Chart :code_plot="code_plot" :code_variable="code_variable" :code_plot_description="plots[code_plot]" :code_variable_description="variables[code_variable]"  />
  <p>
   Lufttemperatur Tagesmittel im Vergleich mit dem 68 % Quantil der in der Zeitreihe 1951-vergangenes Jahr an der Station gemessenen Tagesmitteltemperaturen (Tagesmittel +- Standardabweichung; [°C]).Normalwerte (1951 -2024) hier auch mit Extremwerten von 1951 -2024.
    </p>
    </v-card-text>
</v-card>

<div class="my-4">
    <h5>Sensor</h5>
    <div class="my-4 d-flex flex-wrap ga-3">
        <v-btn-toggle
            rounded="xl"
            v-for="(value, key) in variables" :key="key"
            v-model="code_variable"
            mandatory>
            <v-btn :key="key" :value="key" @click="code_variable = key">{{ value.name }}</v-btn>
        </v-btn-toggle>
    </div>
</div>