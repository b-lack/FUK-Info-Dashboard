<script setup>
 import DVariableSelection from '../../components/DVariableSelection.vue'
 import DInstrumentSelection from '../../components/DInstrumentSelection.vue'
 import { ref, onMounted } from 'vue'
 import { createClient } from '@supabase/supabase-js'

 const apikey = instance.appContext.config.globalProperties.$apikey;
 const url = instance.appContext.config.globalProperties.$url;
 const supabase = createClient(url, apikey);


 let code_plot = ref('1201');
 let code_variable = ref('AT');
 let instrument_seq_nr = ref(1);

 const variablesFilter = ref(['daily_max', 'daily_min', 'daily_mean']);

 onMounted(() => {
   last
 });

</script>
