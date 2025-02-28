import { ref, onMounted } from 'vue';

<script setup>
    const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w';
    import { ref, onMounted } from 'vue'
    import { useAttrs } from 'vue'

    const url = 'http://116.203.31.116:8000/rest/v1/';
    const schema = ref(null);
    const attrs = useAttrs()

    async function _requestRestSchema() {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Profile': attrs.type,
                'apikey': apikey
            }
        });
        const data = await response.json()
        return data
    }

    onMounted(async () => {
        const data = await _requestRestSchema();
        schema.value = data;
    })

    const filterProperties = (properties) => {
        return Object.entries(properties).filter(([key, value]) => key !== 'intkey');
    }

    const filterTables = (tables) => {
        return Object.entries(tables).filter(([key, value]) => key !== 'table_template');
    }

    const tableTitle = (table) => {
        if(attrs.type === 'icp_dictionaries') return table;
        const tableArray = table.split('_');
        return tableArray[0].toUpperCase() + ' -> ' + tableArray[1].toUpperCase();
    }

    const surveyLink = (table) => {
        const tableArray = table.split('_');
        return `https://www.icp-forests.org/documentation/Surveys/${tableArray[0].toUpperCase()}/${tableArray[1].toUpperCase()}.html`;
    }
    
</script>

<template>
    <div v-if="schema">
        <div v-for="(definition in filterTables(schema.definitions)">
            <hr/>
            <h3>
                {{ tableTitle(definition[0]) }}
                <a v-if="attrs.type === 'icp_dictionaries'" :href="`https://www.icp-forests.org/documentation/Dictionaries/${definition[0]}.html`" target="_blank">
                    <Badge type="warning" >
                        full documentation
                    </Badge>
                </a>
                <a v-if="attrs.type === 'icp_download'" :href="surveyLink(definition[0])" target="_blank">
                    <Badge type="warning" >
                        full documentation
                    </Badge>
                </a>
            </h3>

            
            <h4>Required</h4>
            <p>
                <span v-for="required in definition[1].required ">
                    <Badge type="warning" >
                        {{required}}  
                    </Badge>
                </span>
            </p>
            <h4>Properties</h4>
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Type</th>
                        <th>Format</th>
                        <!--<th>Description</th>
                        <th>Default</th>-->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(property in filterProperties(definition[1].properties)">
                        <td><b>{{ property[0] }}</b></td>
                        <td>{{ property[1].type }}</td>
                        <td>{{ property[1].format || '' }}</td>
                        <!--<td>{{ property[1].description }}</td>
                        <td>{{ property[1].default }}</td>-->
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>