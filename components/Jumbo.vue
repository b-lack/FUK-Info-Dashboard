
<script setup>
    import { useAttrs } from 'vue'
    const attrs = useAttrs();
</script>

<template>
    <v-card>
        <v-img
            src="{{ attrs.image }}"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="300px"
            cover
        >
            <v-card-title class="text-h5 font-weight-bold" v-id="attrs.titled">
                {{ attrs.titled }}
            </v-card-title>
        </v-img>
    </v-card>
</template>