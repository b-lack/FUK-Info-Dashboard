---
layout: home
---
<script setup>
    import Map from '../components/Map.vue'
    //import ClientOnly from '../components/ClientOnly.vue'
    import { ref, onMounted, watch, getCurrentInstance, computed } from 'vue';
    import MapBottomBar from '../components/MapBottomBar.vue'

    import { createClient } from '@supabase/supabase-js';

    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey)

    const mapRef = ref(null)
    const selectionRef = ref(null)

    const resultDataByCodeVariable = ref({});

    const pltData = ref([]);

    // Replace your current selectedDate computed with this watch
    watch(
        () => selectionRef.value?.currentlySelectedDate,
        (newDate, oldDate) => {
            //console.log('Date changed:', newDate);
            if (newDate && newDate !== oldDate) {
            _updateMap('AT');
            }
        }
    );
    const selectedDate = computed(() => {
        return selectionRef.value?.currentlySelectedDate || 'No date selected';
    });
    // Function to convert DDMMSS format to decimal degrees
    function convertDMSToDecimal(dmsValue) {
        // Handle negative values (Western longitudes/Southern latitudes)
        const isNegative = dmsValue < 0;
        let absDms = Math.abs(dmsValue);
        
        // Extract degrees, minutes, and seconds
        const degrees = Math.floor(absDms / 10000);
        absDms -= degrees * 10000;
        
        const minutes = Math.floor(absDms / 100);
        const seconds = absDms - minutes * 100;
        
        // Calculate decimal degrees
        let decimalValue = degrees + (minutes / 60) + (seconds / 3600);
        
        // Apply negative sign if needed
        return isNegative ? -decimalValue : decimalValue;
    }
    function _updateMap(code_variable) {
        const points = _filterDataBySelectedDate(code_variable);
        if (!points) {
            return;
        }
        for (const point of points) {
            const plot = pltData.value.filter(item => item.code_plot === point.code_plot);
            if (plot.length === 0) {
                continue;
            }
            point.coordinates = [convertDMSToDecimal(plot[0].longitude), convertDMSToDecimal(plot[0].latitude)];
        }
        if (points && mapRef.value) {
            mapRef.value.updateDataLayer(points);
        }
    }
    function _filterDataBySelectedDate(code_variable) {
        const selectedDate = selectionRef.value?.currentlySelectedDate;
        if (!selectedDate) {
            return null;
        }
        const data = resultDataByCodeVariable.value[code_variable];
        if (!data) {
            return null;
        }
        const filteredData = data.filter(item => item.date_observation === selectedDate);
        return filteredData;
    }

    async function _loadAllData(code_variable) {
        if(resultDataByCodeVariable.value[code_variable] !== undefined) {
            return resultDataByCodeVariable.value[code_variable];
        }

        try {
            const { data, error } = await supabase
                .schema('icp_download')
                .from('mm_mem')
                .select('date_observation, daily_max, daily_min, daily_mean, code_plot, code_variable')
                //.eq('code_plot', code_plot)
                .eq('code_variable', code_variable)
                .not('daily_max', 'is', null)
                .not('daily_min', 'is', null)
                .not('daily_mean', 'is', null).order('date_observation', { ascending: true });
            if (error) {
                console.error('Error fetching data:', error);
                return null;
            }
            resultDataByCodeVariable.value[code_variable] = data;
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    function _loadPPS() {
        mapRef.value.loadData('aq_pps', 'code_plot', 'latitude', 'longitude', 'code_altitude');
    }
    function _loadGPL() {
        mapRef.value.loadData('bd_gpl', 'code_plot', 'latitude_soil', 'longitude_soil', 'code_accuracy');
    }
    function _loadPLS() {
        mapRef.value.loadData('s1_pls', 'code_plot', 'latitude', 'longitude', 'code_plot');
    }
    async function _loadPLT() {

        //const {data, error} = await mapRef.value.loadData('si_plt', 'code_plot', 'latitude', 'longitude', 'code_plot');
        const { data, error } = await supabase
            .schema('icp_download')
            .from('si_plt')
            .select('code_plot, latitude, longitude, code_plot')
            .not('latitude', 'is', null)
            .not('longitude', 'is', null)
            .order('code_plot', { ascending: true });
        if (error) {
            console.error('Error fetching data:', error);
            return;
        }
        pltData.value = data;

        await _loadAllData('AT');
        _updateMap('AT');

    }
</script>

# Meteo

<v-btn @click="_loadPPS">PPS</v-btn>  
<v-btn @click="_loadGPL">GPL</v-btn>  
<v-btn @click="_loadPLS">PLS</v-btn>  
<v-btn @click="_loadPLT">PLT</v-btn>  

<Map ref="mapRef"></Map>




<MapBottomBar ref="selectionRef"/>
