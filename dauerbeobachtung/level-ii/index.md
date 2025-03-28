# Level II

Auf der Intensitätsstufe Level II werden in Brandenburg von ursprünglich (1996-2007) 6 Kiefernbeständen (1201-1206) gegenwärtig noch 4 (1202-1204) im Rahmen des ICP-Forests, sowie zusätzlich eine Buchen- (1207) und zwei Eichenbestände (1208, 1209) beobachtet. Im Land Berlin ist ein Kiefern-/Eichen-Altbestand (1101) im Grunewald noch in das Level II Programm einbezogen. Die Beobachtung des benachbarten Kiefernjungbestandes (1102) und eines Kiefernbestandes in Köpenick (1103) werden seit 2003 nur noch extensiv fortgeführt. Die Erhebungen erfolgen durch das Landeskompetenzzentrum Forst Eberswalde (LFE) mit Unterstützung durch die örtlichen Revierförster.

<script setup>
    import Map from '../../components/Map.vue'
    import { ref, onMounted, watch, getCurrentInstance, computed, inject } from 'vue';
    import { createClient } from '@supabase/supabase-js';
    import { useTheme } from 'vuetify'
    import { useGlobalTheme } from '../../.vitepress/theme/composables/useGlobalTheme'
    import TablePerPlot from '../../components/TablePerPlot.vue'
    const { isDark } = useGlobalTheme()

    const codePlot_list = [
        { code_plot: 1101, name: 'Grünewald', link: '/dauerbeobachtung/level-ii/grunewald_1101' },
        { code_plot: 1201, name: 'Natteheide', link: '/dauerbeobachtung/level-ii/natteheide_1201' },
        { code_plot: 1202, name: 'Beerenbusch Kiefer', link: '/dauerbeobachtung/level-ii/beerenbusch-kiefer_1202' },
        { code_plot: 1203, name: 'Kienhorst', link: '/dauerbeobachtung/level-ii/kienhorst_1203' },
        { code_plot: 1204, name: 'Weitzgrund', link: '/dauerbeobachtung/level-ii/weitzgrund_1204' },
        { code_plot: 1205, name: 'Neusorgefeld', link: '/dauerbeobachtung/level-ii/neusorgefeld_1205' },
        { code_plot: 1206, name: 'Schwenow', link: '/dauerbeobachtung/level-ii/schwenow_1206' },
        { code_plot: 1207, name: 'Beerenbusch Buchen', link: '/dauerbeobachtung/level-ii/beerenbusch_buchen_1207' },
        { code_plot: 1208, name: 'Fünfeichen', link: '/dauerbeobachtung/level-ii/fuenfeichen_1208' },
        { code_plot: 1209, name: 'Kienhorst Eichen', link: '/dauerbeobachtung/level-ii/kienhorst_eichen_1209' }
    ];


    const theme = useTheme()
    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey)

    const mapRef = ref(null)

    const selectionRef = ref(null)

    onMounted(() => {
        // Initialize the map or perform any setup needed
        mapRef.value.loadData('si_plt', 'code_plot', 'latitude', 'longitude', 'code_altitude');
        mapRef.value.onParentClick = function (info, event) {
            // Handle map click event
            console.log('Parent Map clicked:', e);
        };
    });

    const selectByClick = (info, event) => {
        console.log(info.object);
        const code_plot = info.object?.properties?.code_plot;
        if (code_plot) {
            // goto
            const plot = codePlot_list.find(item => item.code_plot === code_plot);
            
            if (plot) {
                // Open the link in same tab
                window.location.href = plot.link;
            }
        }
    }
    const parentHover = (info, tooltip) => {

        const code_plot = info.object.properties.code_plot;
        const plot = codePlot_list.find(item => item.code_plot === code_plot);
        if (plot) {
            tooltip.innerHTML = plot.name;
        } else {
            // If no plot found, you can set a default message or leave it empty
            tooltip.innerHTML = code_plot;
        }
    }

</script>

<Map ref="mapRef" :selectByClick="selectByClick" :parentHover="parentHover" ></Map>

<div style="margin-top: 50px;"></div>
<v-list-subheader>Komponenten des Energie- und Stoffhaushaltes</v-list-subheader>
<v-table>
    <thead>
        <tr>
            <th>Erhebungen</th>
            <th>Level II Standard</th>
            <th>Level II Core</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>Immission</td>
        <td>kontinuierlich</td>
        <td>-</td>
        </tr>
        <tr>
        <td>Deposition</td>
        <td>kontinuierlich</td>
        <td>kontinuierlich</td>
        </tr>
        <tr>
        <td>Meteorologie</td>
        <td>kontinuierlich</td>
        <td>kontinuierlich</td>
        </tr>
        <tr>
        <td>Bodenzustand (Vorrat)</td>
        <td>10-jährig</td>
        <td>10-jährig</td>
        </tr>
        <tr>
        <td>Bodenphysik</td>
        <td>einmalig</td>
        <td>einmalig</td>
        </tr>
            <tr>
        <td>Bodenlösungschemie</td>
        <td>-</td>
        <td>kontinuierlich</td>
        </tr>
        <tr>
        <td>Bodenwassergehalt</td>
        <td>-</td>
        <td>kontinuierlich</td>
        </tr>
        <tr>
        <td>Grundwasser</td>
        <td>-</td>
        <td>[1]-jährlich</td>
        </tr>
        <tr>
        <td>CO2 und H2O Flux-Messung</td>
        <td>-</td>
        <td>[2]-½ h</td>
        </tr>
    </tbody>
</v-table>

<div style="margin-top: 50px;"></div>
<v-list-subheader>Biologische Systemreaktionen</v-list-subheader>
<v-table>
    <thead>
        <tr>
            <th>Erhebungen</th>
            <th>Level II Standard</th>
            <th>Level II Core</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Biomarker Vitaltät</td>
            <td>-jährlich</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Kronenzustand</td>
            <td>jährlich</td>
            <td>jährlich</td>
        </tr>
        <tr>
            <td>LAI</td>
            <td>-2 x jährlich</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Phänologie</td>
            <td>-täglich</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Bestandeswachstum</td>
            <td>5 - jährig</td>
            <td>5 - jährig</td>
        </tr>
        <tr>
            <td>Einzelbaumwachstum</td>
            <td>-jährlich, 14d, h</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Nadel-/Blattanalysen</td>
            <td>jedes 2. Jahr</td>
            <td>jährlich</td>
        </tr>
        <tr>
            <td>Streufall</td>
            <td>-kontinuierlich</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Bodenrespiration</td>
            <td>[3]-14-tägig</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Bodenvegetation</td>
            <td>5 - jährig</td>
            <td>5 - jährig</td>
        </tr>
        <tr>
            <td>Biotische Schaderreger</td>
            <td>jährlich</td>
            <td>jährlich</td>
        </tr>
        <tr>
            <td>Ozonschäden</td>
            <td>-jährlich</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Genmarker Baum</td>
            <td>-einmalig</td>
            <td>-</td>
        </tr>
    </tbody>
</v-table>