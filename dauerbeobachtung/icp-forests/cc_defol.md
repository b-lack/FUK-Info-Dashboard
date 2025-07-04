---
layout: page
---
<script setup>
    // Hier soll das Thema Kronenverlichtung erörtert werden.
    import { ref, onMounted } from 'vue'
    import BoxplotPerYear from '../../components/BoxplotPerYear.vue'

    let code_plot = ref('1201');

    const _setCodePlot = (code) => {
        code_plot.value = code;
        // code_variable_with_location
    };
</script>

<div class="mx-4 my-4 vp-doc mb-9">
    <h1>Visual Assessment of Crown Defolation</h1>
    <v-card class="my-4" style="overflow:visible;">
        <v-card-text>
            <BoxplotPerYear :code_plot="code_plot"/>
        </v-card-text>
    </v-card>
</div>