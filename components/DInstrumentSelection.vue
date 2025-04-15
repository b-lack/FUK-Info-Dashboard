<script setup>
    import { ref, onMounted, useAttrs, watch, getCurrentInstance, onBeforeUnmount, computed, defineEmits } from 'vue'
    import { createClient } from '@supabase/supabase-js';

    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey)

    // GET components attributes
    const attrs = useAttrs();
    const selected_location = ref('S');
    const key = ref(null);

    const possibleLocations = {
        F:{ code: 'F', description: 'Open field in forest area', instrument_seq_nrs: 0 },
        S: { code: 'S', description: 'Stand', instrument_seq_nrs: 0 }
    }

    const locations = ref([]);

    const emit = defineEmits(['update:codeLocation'])

    const _update = (codePlot) => {
        locations.value = [];
        supabase
            .schema('icp_download')
            .from('unique_instrument_seq_nr')
            .select('instrument_seq_nr, code_location, code_plot')
            .eq('code_plot', codePlot)
            .in('code_location', ['F', 'S'])
            .then(response => {

                // check if response.data.code_location has S or F
                const sCount = response.data.filter(item => item.code_location === 'S');
                if (sCount.length > 0) {
                    locations.value.push({
                        ...possibleLocations.S,
                        instrument_seq_nrs: sCount.map(item => item.instrument_seq_nr)
                    });

                }

                const fCount = response.data.filter(item => item.code_location === 'F');
                if (fCount.length > 0) {
                    locations.value.push({
                        ...possibleLocations.F,
                        instrument_seq_nrs: fCount.map(item => item.instrument_seq_nr)
                    });
                }

                _setCodeLocation(locations.value[0]);
            })
            .catch(error => {
                console.log(error)
            });
    }
    const _setCodeLocation = (location) => {
       
        selected_location.value = location.code;
        key.value = location.code;
        emit('update:codeLocation', location);
    }

    watch(() => [attrs.code_plot], ([newCodePlot]) => {
        if (newCodePlot !== undefined && newCodePlot !== null) {
            _update(newCodePlot);
        }
    }, { deep: true });
    onMounted(async () => {
        _update(attrs.code_plot);
    });

</script>

<template>
    <div class="my-4" v-if="locations.length > 0">
        <h5>Location</h5>
        <div class="my-4 d-flex flex-wrap ga-3">
            <v-btn-toggle
                rounded="xl"
                v-for="location in locations" :key="location.code"
                v-model="selected_location"
                mandatory>
                <v-btn :key="key" :value="location.code" @click="_setCodeLocation(location)">{{ location.description  }} ( {{ location.instrument_seq_nrs.length  }} Sensoren ) </v-btn>
            </v-btn-toggle>
        </div>
    </div>
</template>