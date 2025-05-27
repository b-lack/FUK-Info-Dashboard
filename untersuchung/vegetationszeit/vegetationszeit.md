---
layout: page
---
<script setup>
    // Hier soll das Thema Phänologie und die Entwicklung der Vegetationszeit erörtert werden.
    import { ref, onMounted } from 'vue'
    import BarPerYear from '../../components/BarPerYear.vue'

    let code_plot = ref('1201');
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

    const _setCodePlot = (code) => {
        code_plot.value = code;
        // code_variable_with_location
    };
</script>

<div class="mx-4 my-4 vp-doc mb-9">
    <h1>Vegetationszeit</h1>
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
    <v-card class="my-4" style="overflow:visible;">
        <v-card-text>
            <BarPerYear :code_plot="code_plot"/>
        </v-card-text>
    </v-card>
</div>
