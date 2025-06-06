<script setup>
    import Firewall from '../components/Firewall.vue';
    import { ref, onMounted, getCurrentInstance, useAttrs } from 'vue'
    import { createClient } from '@supabase/supabase-js'

    const access_token = ref(null);
    const user_email = ref(null);
    
    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const rUrl = instance.appContext.config.globalProperties.$rUrl;

    const supabase = createClient(url, apikey)
    const loading = ref(false);

    const scripts = ref([]);

    const _getScripts = async () => {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Error getting session:', error);
            return [];
        }
        if (!sessionData.session || !sessionData.session.access_token) {
            console.error('No session found');
            return [];
        }
        access_token.value = sessionData.session.access_token;

        try {
            const response = await fetch(`${rUrl}/get-scripts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token.value}`,
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched scripts:', data);
            return data || [];
        } catch (error) {
            console.error('Error fetching scripts:', error);
            return [];
        }
    };

    const _runScript = async () => {
        const { data, error } = await supabase.functions.invoke('run-script', {
            body: JSON.stringify({ script: 'test-api' })
        });
        if (error) {
            console.error('Error invoking function:', error);
            return;
        }
    };
    onMounted(async () => {
       scripts.value = await _getScripts();
    });
</script>

# Functions

<Firewall>
    <v-card class="mt-11">
        <v-list v-if="scripts.length > 0">
            <v-list-item v-for="script in scripts" :key="script.id">
                <v-list-item-title>
                    {{ script }}
                </v-list-item-title>
                <template v-slot:append>
                    <v-btn @click="_runScript" :loading="loading" rounded="xl" color="primary">RUN</v-btn>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</Firewall>