<script setup>
    import TablePerPlot from '../../components/TablePerPlot.vue'
    import Jumbo from '../../components/Jumbo.vue'
    import { ref, onMounted } from 'vue'
    import LastClimateValues from '../../components/LastClimateValues.vue';

    let code_plot = ref('1202');
</script>


<Jumbo image="/level2/1202-Beerenbusch_Bestand_resized.jpg" titled="Beerenbusch Kiefer"/>

Die seit 1996 betriebene Dauerbeobachtungsfläche "Beerenbusch Kiefer" (1202) befindet sich im Wuchsgebiet Mittelmecklenburger-Jungmoränenland auf Tasdorfer Sand-Braunerde. Die natürliche Waldgesellschaft ist der Schattblumen-Eichen-Buchen-Wald.

## Meteo

## Flächen-Details

<TablePerPlot  :code_plot="code_plot" />

## Zuletzt gemessene klimatische Werte
<LastClimateValues :code_plot="code_plot" :code_variable="code_variable"/>