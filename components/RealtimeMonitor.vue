<script setup>
    import { ref, onMounted, getCurrentInstance, useAttrs } from 'vue'
    import { createClient } from '@supabase/supabase-js'
    import * as timeago from 'timeago.js';

    
    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;

    const supabase = createClient(url, apikey)

    const monitorData = ref([]);

    onMounted(async () => {
        const { data, error } = await supabase.from('r_monitor').select('*').order('timestamp', { ascending: false }).limit(30);
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            monitorData.value = data;
        }
    });
</script>

<template>
    <div class="realtime-monitor">
        <h2>Monitor Data from R-Server</h2>
        <v-table v-if="monitorData.length > 0">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Script</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in monitorData" :key="index">
                    <td>{{ timeago.format(item.timestamp) }}</td>
                    <td>{{ item.script }}</td>
                    <td>{{ item.user_id }}</td>
                    <td>{{ item.action }}</td>
                    <td>{{ item.details }}</td>
                </tr>
            </tbody>
        </v-table>
        <p v-else>No data available.</p>
        <div>Last 30 entries</div>
    </div>
</template>