<script setup>
    import TablePerPlot from '../../components/TablePerPlot.vue'
    import { ref, onMounted } from 'vue'

    let code_plot = ref('1202');
</script>
<v-card>
    <v-img
        src="/images/sensors.jpg"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="200px"
        cover
    >
        <v-card-title class="text-h5 font-weight-bold">
            Beerenbusch Kiefer
        </v-card-title>
    </v-img>
</v-card>

Die seit 1996 betriebene Dauerbeobachtungsfläche "Beerenbusch Kiefer" (1202) befindet sich im Wuchsgebiet Mittelmecklenburger-Jungmoränenland auf Tasdorfer Sand-Braunerde. Die natürliche Waldgesellschaft ist der Schattblumen-Eichen-Buchen-Wald.

## Meteo

## Flächen-Details

<TablePerPlot  :code_plot="code_plot" />