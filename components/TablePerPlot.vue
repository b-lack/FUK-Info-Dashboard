<script setup>
    import { ref, useAttrs, computed } from 'vue';
    const attrs = useAttrs();

    const code_plot = attrs.code_plot;
    console.log(code_plot);

    const rawPlots = [
        {
            "code_plot": 1201,
            "Revier / Oberförsterei": "Königsberg/ Neustadt",
            "Niederschlag Jahr": 570,
            "Niederschlag Vegetationszeit": 320,
            "Makroklimaform": "beta",
            "Höhenlage Freifläche / Bestand": "56 / 74",
            "natürliche Waldgesellschaft": "Blaubeer- Traubeneichen- Buchen-Wald",
            "Wuchsgebiet": "7 Ostmecklenburger- Nordbrandenburger- Jungmoränenland",
            "Stamm Standortsgruppe": "Z2m",
            "Lokal Bodenforms": "NeS Nedlitzer Sand- Braunerde, leicht übersandet",
            "Körnung im Oberboden": "anlehmiger Mittel- Feinsand",
            "Kalktiefe": "ohne Kalk",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "6 ca. 2,5 m"
        },
        {
            "code_plot": 1202,
            "Revier / Oberförsterei": "Rheinsberg/ Neuruppin",
            "Niederschlag Jahr": 600,
            "Niederschlag Vegetationszeit": 344,
            "Makroklimaform": "my",
            "Höhenlage Freifläche / Bestand": "55 / 70",
            "natürliche Waldgesellschaft": "Schattblumen- Eichen- Buchen-Wald",
            "Wuchsgebiet": "6 Mittelmecklenburger- Jungmoränenland",
            "Stamm Standortsgruppe": "M2f",
            "Lokal Bodenforms": "TdS Tasdorfer Sand- Braunerde",
            "Körnung im Oberboden": "anlehmiger Mittel- Feinsand",
            "Kalktiefe": "ca. 1,40 m",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "7 gw-fern"
        },
        {
            "code_plot": 1203,
            "Revier / Oberförsterei": "Joachimstal/ Eberswalde",
            "Niederschlag Jahr": 585,
            "Niederschlag Vegetationszeit": 335,
            "Makroklimaform": "beta",
            "Höhenlage Freifläche / Bestand": "68 / 70",
            "natürliche Waldgesellschaft": "Blaubeer- Traubeneichen- Buchen-Wald",
            "Wuchsgebiet": "7 Ostmecklenburger- Nordbrandenburger- Jungmoränenland",
            "Stamm Standortsgruppe": "Z2m",
            "Lokal Bodenforms": "HsS Haselberger Sand- Rostpodsol",
            "Körnung im Oberboden": "reiner Mittel- Feinsand",
            "Kalktiefe": "ca. 1,70 m",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "7 gw-fern"
        },
        {
            "code_plot": 1204,
            "Revier / Oberförsterei": "Brück/ Dippmannsdorf",
            "Niederschlag Jahr": 570,
            "Niederschlag Vegetationszeit": 320,
            "Makroklimaform": "epsilon",
            "Höhenlage Freifläche / Bestand": "120 / 105",
            "natürliche Waldgesellschaft": "Schattblumen- Eichen- Buchen-Wald",
            "Wuchsgebiet": "16 Hoher Fläming",
            "Stamm Standortsgruppe": "M2m",
            "Lokal Bodenforms": "NeS Nedlitzer Sand- Braunerde",
            "Körnung im Oberboden": "anlehmiger Mittel- Feinsand",
            "Kalktiefe": "ohne Kalk",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "7 gw-fern"
        },
        {
            "code_plot": 1205,
            "Revier / Oberförsterei": "Walddrehna/ Luckau",
            "Niederschlag Jahr": 570,
            "Niederschlag Vegetationszeit": 367,
            "Makroklimaform": "phi",
            "Höhenlage Freifläche / Bestand": "131 / 133",
            "natürliche Waldgesellschaft": "Blaubeer- Kiefern- Traubeneichen- Wald",
            "Wuchsgebiet": "15 Düben- Niederlausitzer Altmoränenland",
            "Stamm Standortsgruppe": "Z2m",
            "Lokal Bodenforms": "BäS Bärenthorener Sand- Braunerde",
            "Körnung im Oberboden": "reiner Mittel- Feinsand",
            "Kalktiefe": "ohne Kalk",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "7 gw-fern"
        },
        {
            "code_plot": 1206,
            "Revier / Oberförsterei": "Storkow/ Erkner",
            "Niederschlag Jahr": 550,
            "Niederschlag Vegetationszeit": 309,
            "Makroklimaform": "gamma",
            "Höhenlage Freifläche / Bestand": "49 / 68",
            "natürliche Waldgesellschaft": "Blaubeer- Kiefern- Traubeneichen- Wald",
            "Wuchsgebiet": "11 Mittelbrandenburger Talsand- und Moränenland",
            "Stamm Standortsgruppe": "Z2t",
            "Lokal Bodenforms": "GmS Grubenmühler Sand- Braunerde",
            "Körnung im Oberboden": "reiner Mittel- Feinsand",
            "Kalktiefe": "ca. 3 m",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "7 gw-fern"
        },
        {
            "code_plot": 1207,
            "Revier / Oberförsterei": "Rheinsberg/ Neuruppin",
            "Niederschlag Jahr": 600,
            "Niederschlag Vegetationszeit": 344,
            "Makroklimaform": "my",
            "Höhenlage Freifläche / Bestand": "56 / 90",
            "natürliche Waldgesellschaft": "Schattblumen-Buchenwald",
            "Wuchsgebiet": "6 Mittelmecklenburger- Jungmoränenland",
            "Stamm Standortsgruppe": "M2f",
            "Lokal Bodenforms": "TdS Tasdorfer Sand- Braunerde",
            "Körnung im Oberboden": "Mittel-Grobsand feinsandiger Mittelsand",
            "Kalktiefe": "1,80 m",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "7 gw-fern"
        },
        {
            "code_plot": 1208,
            "Revier / Oberförsterei": "Dammendorf/ Siehdichum",
            "Niederschlag Jahr": 533,
            "Niederschlag Vegetationszeit": 311,
            "Makroklimaform": "gamma",
            "Höhenlage Freifläche / Bestand": "110 / 124",
            "natürliche Waldgesellschaft": "Waldreitgras Beerkraut Kiefern-Traubeneichen- Wald",
            "Wuchsgebiet": "11 Mittelbrandenburger Talsand- und Moränenland",
            "Stamm Standortsgruppe": "M2t",
            "Lokal Bodenforms": "DobsB Doberitzer Bänder-Sandbraunerde",
            "Körnung im Oberboden": "Mittel-Grobsand feinsandiger Mittelsand",
            "Kalktiefe": "ohne Kalk",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "7 gw-fern"
        },
        {
            "code_plot": 1101,
            "Revier / Oberförsterei": "Saubucht/ FA Grunewald",
            "Niederschlag Jahr": 571,
            "Niederschlag Vegetationszeit": 325,
            "Makroklimaform": "gamma",
            "Höhenlage Freifläche / Bestand": "46 / 54",
            "natürliche Waldgesellschaft": "Horstgras-Kiefern-Eichenwald",
            "Wuchsgebiet": "11 Mittelbrandenburger Talsand- und Moränenland",
            "Stamm Standortsgruppe": "Z2t",
            "Lokal Bodenforms": "Schwach podsolierte Rostbraunerde",
            "Körnung im Oberboden": "Mittel-Grobsand feinsandiger Mittelsand",
            "Kalktiefe": "ohne Kalk",
            "Grundwasserstufe / mittlerer frühjährlicher Grundwasserstand": "7 gw-fern"
        }
    ];
    // Create a new array without the code_plot property
    const plots = rawPlots.map(plot => {
        const { code_plot, ...rest } = plot;
        return rest;
    });

    // Computed property to safely get the selected plot
    const selectedPlot = computed(() => {
        const plot = rawPlots.find(plot => plot.code_plot == code_plot);
        if (!plot) return null;

        // Remove code_plot from the selected plot
        const { code_plot: _, ...rest } = plot;
        return rest;
    });
</script>

<template>
    <div v-if="!attrs.code_plot" class="table-container">
        <v-table density="compact" style="width: 100%; padding: 0px;">
            <thead>
                <tr>
                    <th v-for="(header, index) in Object.keys(plots[0])" :key="index">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(plot, index) in plots" :key="index">
                    <td v-for="(value, key) in plot" :key="key">
                        
                        <span style="white-space: nowrap;">{{ value }}</span>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
    <div v-else class="table-container" style="margin-top: 50px;">
        <v-list-subheader>Plot Details</v-list-subheader>
        <v-list>
            <v-list-item v-for="(value, key) in selectedPlot" :key="key">
                    <v-list-item-title>{{ key }}</v-list-item-title>
                    
                <template v-slot:append>
                    <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
                </template>
            </v-list-item>
        </v-list>
    </div>
</template>