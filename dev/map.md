# Map

<script setup>
    import Map from '../components/Map.vue'
    import { ref, onMounted } from 'vue';

    const mapRef = ref(null)

    onMounted(() => {
        console.log(mapRef.value.deckInstance)
    });
    function _loadPPS() {
        mapRef.value.loadData('aq_pps', 'code_plot', 'latitude', 'longitude', 'code_altitude');
    }
    function _loadGPL() {
        mapRef.value.loadData('bd_gpl', 'code_plot', 'latitude_soil', 'longitude_soil', 'code_accuracy');
    }
    function _loadPLS() {
        mapRef.value.loadData('s1_pls', 'code_plot', 'latitude', 'longitude', 'code_plot');
    }
</script>

<Map ref="mapRef"></Map>

<v-btn @click="_loadPPS">PPS</v-btn>
<v-btn @click="_loadGPL">GPL</v-btn>
<v-btn @click="_loadPLS">PLS</v-btn>
