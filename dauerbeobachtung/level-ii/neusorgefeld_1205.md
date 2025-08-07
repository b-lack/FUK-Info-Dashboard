<script setup>
    import Chart from '../../components/Chart.vue'
    import TablePerPlot from '../../components/TablePerPlot.vue'
    import { ref, onMounted } from 'vue'
    import Jumbo from '../../components/Jumbo.vue'
    import LastClimateValues from '../../components/LastClimateValues.vue';

    let code_plot = ref('1205');
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
<Jumbo image="/level2/1205-Neusorgefeld_Bestand_resized.jpg" titled="Neusorgefeld"/>

## Meteo
<Chart :code_plot="code_plot" :code_variable="code_variable" :code_plot_description="plots[code_plot]" :code_variable_description="variables[code_variable]"  />

## Flächen-Details
<TablePerPlot  :code_plot="code_plot" />

## Zuletzt gemessene klimatische Werte
<LastClimateValues :code_plot="code_plot" :code_variable="code_variable"/>
