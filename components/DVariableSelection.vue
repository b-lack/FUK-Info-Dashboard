<script setup>
    import { ref, onMounted, useAttrs, watch, getCurrentInstance, onBeforeUnmount, computed, defineEmits } from 'vue'
    import { createClient } from '@supabase/supabase-js';

    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey)

    // GET components attributes
    const attrs = useAttrs();

    const code_variable = ref(null);
    const key = ref(null);
    const variables = ref([]);
    const variablesFilter = ref([]);
    const variablesFilterDetails = ref({});

    const emit = defineEmits(['update:codeVariable'])

    function _updateFilter(codePlot, codeLocation){
        console.log(codeLocation)
        if(!codeLocation) {
            return;
        }
        supabase
            .schema('icp_download')
            .from('code_variable_with_location') // TRY
            .select()
            .in('instrument_seq_nr', codeLocation.instrument_seq_nrs)
            .eq('code_plot', codePlot)
            .then(response => {
                variablesFilter.value = response.data.map(item => item.code_variable);
                response.data.forEach(item => {
                    variablesFilterDetails.value[item.code_variable] = item;
                });
            })
            .catch(error => {
                console.log(error)
            });
    }
    function _requestData() {
        // https://github.com/orgs/supabase/discussions/19517#discussioncomment-8258747
        supabase
            .schema('icp_dictionaries')
            .from('d_variable')
            .select('code, description, unit')
            .neq('code', 'XX')
            .then(response => {
                console.log(response.data)
                variables.value = response.data;
            })
            .catch(error => {
                console.log(error)
            })
    }

    onMounted(async () => {
        _requestData();
    });

    watch(() => [attrs.code_plot, attrs.code_location], ([newCodePlot, newLocation]) => {
        if (newCodePlot !== undefined && newCodePlot !== null && newCodePlot !== '') {
            _updateFilter(newCodePlot, newLocation);
        }
    }, { deep: true });

    // Computed filtered variables
    const filteredVariables = computed(() =>
        variables.value.filter(v => variablesFilter.value.includes(v.code))
    );

    const _setCodeVariable = (newVariable) => {
        code_variable.value = newVariable.code;
        emit('update:codeVariable', newVariable);
    }

</script>

<template>
   
    <div class="my-4 d-flex flex-wrap ga-3">
        <v-btn-toggle
            rounded="xl"
            v-for="variable in filteredVariables" :key="variable.code"
            v-model="code_variable"
            mandatory>
            <v-btn :key="key" :value="variable.code" @click="_setCodeVariable(variable)">{{ variable.description  }} [{{variable.unit}}]</v-btn>
        </v-btn-toggle>
    </div>

</template>
