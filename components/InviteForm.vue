<script setup>
    import { ref, onMounted, getCurrentInstance, useAttrs } from 'vue'
    import { createClient } from '@supabase/supabase-js'

    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;

    let supabase = createClient(url, apikey);
    const valid = ref(false);

    const email = ref('');
    const emailRules = [
        v => !!v || 'E-Mail is required',
        v => /.+@.+\..+/.test(v) || 'E-Mail must be valid'
    ];

    const getServiceKeyDialog = async () => {
        // This function can be used to fetch or display service keys if needed
        console.log('Fetching service key dialog...');
        const serviceKey = prompt('Please enter the service key:');
        if (!serviceKey) {
            console.error('Service key is required');

            return;
        }

        supabase = createClient(url, serviceKey);
        sendInvite();
    };

    const sendInvite = async () => {
        console.log('Sending invite to:', email.value);
        if (!valid.value) return;
        if (!email.value) {
            console.error('Email is required');
            return;
        }

        const { data, error } = await supabase.auth.admin.inviteUserByEmail(email.value, {
            redirectTo: 'https://forstliche-umweltkontrolle.de/authentication/set-password',
            data: {
                role: 'user' // or any other role you want to assign
            }
        });


        if (error) {
            console.error('Error sending invite:', error);
            return;
        }
    };
</script>


<template>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-Mail Address des Einzuladenden"
                    required
                    variant="outlined"
                    rounded="xl"
                ></v-text-field>
                <v-btn
                    color="primary"
                    class="my-4"
                    variant="tonal"
                    rounded="xl"
                    :disabled="!valid"
                    @click.stop.prevent
                    @click="getServiceKeyDialog"
                >Send Invitation</v-btn>
            </v-row>
        </v-container>
    </v-form>
</template>