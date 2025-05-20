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

    supabase.auth.onAuthStateChange((event, session) => {
        access_token.value = session?.access_token;
        user_email.value = session?.user?.email;
    });

    const _runScript = async () => {
        const { data } = await fetch(`${rUrl}/run-script?script=test_api`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token.value}`,
            },
            body: {
                script: 'echo "Hello World"',
            },
        });
        console.log(data);
    };
</script>

# Functions
<Firewall>
    <v-card>
        <v-list>
            <v-list-item>
                <v-list-item-title>
                    test_api.R
                </v-list-item-title>
                <template v-slot:append>
                    <v-btn @click="_runScript" :loading="loading">RUN</v-btn>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</Firewall>