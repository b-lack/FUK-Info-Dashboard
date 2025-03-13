# Aktuelle Witterungsdaten

Grünland-Temperatur-Summe.
Die Grünland-Temperatur-Summe (GTS200) ist die Summe der positiven Tagesmittel der Lufttemperatur ab dem 1.Januar bis zum Erreichen einer Summe von 200, wobei die Januarwerte mit 0,5 und die Februarwerte mit 0,75 gewichtet in die Berechnung eingehen..
Errechnet wird der Tag des Jahres (DoY) an dem diese Summe 200 erreicht. Diese Wärmesumme wird in der Agrarmeteorologie als Indikator für den Vegetationsbeginn genutzt.

<script setup>
  import Chart from '../components/Chart.vue'
  import { ref, onMounted } from 'vue'

  let code_plot = ref('1201');
  let code_variable = ref('AT');

  const plots = {
    1201: {name: '1201'},
    1202: {name: '1202'},
    1203: {name: '1203'},
    1204: {name: '1204'},
    1205: {name: '1205'},
    1206: {name: '1206'},
    1207: {name: '1207'},
    1208: {name: '1208'},
    1209: {name: '1209'}
  };
  // https://icp-forests.org/documentation/Dictionaries/d_variable.html
  const variables = {
    AP: {name: 'Atmospheric pressure', unit: 'hPa'},
    AT: {name: 'Air temperature', unit: '°C'},
    MP: {name: 'Soil Moisture Matric potential', unit: 'kPa'},
    PR: {name: 'Precipitation', unit: 'mm'},
    RH: {name: 'Relative air humidity', unit: '%'},
    SR: {name: 'Global radiation', unit: 'W/m²'},
    ST: {name: 'Soil temperature', unit: '°C'},
    TF: {name: 'Throughfall', unit: 'mm'},
    WC: {name: 'Water content', unit: 'Vol%'},
    WD: {name: 'Wind direction', unit: '°'},
    WS: {name: 'Wind speed', unit: 'm/s'}
  }
</script>

<div v-for="(value, key) in plots" :key="key">
  <button @click="code_plot = key">{{ value.name }}</button>
</div>
<div v-for="(value, key) in variables" :key="key">
  <button @click="code_variable = key">{{ value.name }}</button>
</div>


<Chart :code_plot="code_plot" :code_variable="code_variable" :code_plot_description="plots[code_plot]" :code_variable_description="variables[code_variable]"  />
