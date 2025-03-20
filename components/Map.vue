<script setup>
    import { ref, onMounted, useAttrs, watch, getCurrentInstance, onBeforeUnmount } from 'vue'
    import {Deck, WebMercatorViewport, TRANSITION_EVENTS} from '@deck.gl/core';
    import {GeoJsonLayer, BitmapLayer, ScatterplotLayer} from '@deck.gl/layers';
    import {TileLayer} from '@deck.gl/geo-layers';
    import {bboxPolygon, difference, featureCollection} from '@turf/turf';
    import { createClient } from '@supabase/supabase-js';

    const instance = getCurrentInstance();
    const apikey = instance.appContext.config.globalProperties.$apikey;
    const url = instance.appContext.config.globalProperties.$url;
    const supabase = createClient(url, apikey)

    const attrs = useAttrs();

    const mapElement = ref(null);
    const deckInstance = ref(null);
    const bbMask = ref(null);
    const INERTIA_EASING = t => 1 - (1 - t) * (1 - t);
    const boundingBox = [
        [12.0833, 51.3411],
        [14.6596, 53.5511]
    ];// npm install @deck.gl/core@8.9.36	 @deck.gl/layers@8.9.36	 @deck.gl/geo-layers@8.9.36	

    const fitBounds = (bounds, options = {}) => {
        // get mapElement width
        const mapViewState = mapElement.value.getBoundingClientRect();

        let {longitude, latitude, zoom} = new WebMercatorViewport({ width: mapViewState.width-40, height: mapViewState.height-40 }).fitBounds(bounds)
        zoom = Math.min(zoom, 19);

        if(typeof bounds !== 'object' ) return;
        deckInstance.value.setProps({viewState: {
            ...deckInstance.value.props.viewState,
            longitude,
            latitude,
            zoom: zoom,
            //pitch: 30,
            //transitionInterpolator: new FlyToInterpolator({speed: 2000}),
            transitionDuration: 1000,
            transitionInterruption: TRANSITION_EVENTS.SNAP_TO_END,
            transitionEasing: INERTIA_EASING,
            
        }});
    };

    const INITIAL_VIEW_STATE = {
        latitude: 52.520008,
        longitude: 13.404954,
        zoom: 5,
        //pitch: 30,
        bearing: 0,
    };

    // Function to convert DDMMSS format to decimal degrees
    function convertDMSToDecimal(dmsValue) {
        // Handle negative values (Western longitudes/Southern latitudes)
        const isNegative = dmsValue < 0;
        let absDms = Math.abs(dmsValue);
        
        // Extract degrees, minutes, and seconds
        const degrees = Math.floor(absDms / 10000);
        absDms -= degrees * 10000;
        
        const minutes = Math.floor(absDms / 100);
        const seconds = absDms - minutes * 100;
        
        // Calculate decimal degrees
        let decimalValue = degrees + (minutes / 60) + (seconds / 3600);
        
        // Apply negative sign if needed
        return isNegative ? -decimalValue : decimalValue;
    }

    const polyMask = (isochrone) => {
        const bboxPoly = bboxPolygon([-180, -85, 180, 85]);
        const mask = difference(featureCollection([bboxPoly, isochrone]));
        return mask;
    }
    const loadData = async (table, uniquenessColumn, latitudeColumn, longitudeColumn, dataColumn) => {
        const addedFeatures = [];
        await supabase.schema('icp_download').from(table)
            .select(`${uniquenessColumn}, ${latitudeColumn}, ${longitudeColumn}, ${dataColumn}`)
            .then(response => {
                const data = response.data;

                const features = [];
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    // convert +/-DDMMSS in Degrees Minutes Seconds (WGS84) to decimal degrees
                    const lat = convertDMSToDecimal(item[latitudeColumn]);
                    const lon = convertDMSToDecimal(item[longitudeColumn]);
                    // check if the item is already added
                    if (addedFeatures.includes(item[uniquenessColumn])) {
                        continue;
                    }525825
                    // add the item to the addedFeatures array
                    addedFeatures.push(item[uniquenessColumn]);
                    features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [lon, lat]
                        },
                        properties: {
                            value: item[dataColumn]
                        }
                    });
                }
                
                
                console.log(features.length);
                const layer = new ScatterplotLayer({
                    id: 'data-scatterplot-layer',
                    data: features,
                    getPosition: d => d.geometry.coordinates,
                    getRadius: d => Math.sqrt(d.properties.value) * 100,
                    getFillColor: [70, 119, 76],
                    pickable: true,
                    radiusMinPixels: 5,
                    radiusMaxPixels: 5,
                });
                const layers = deckInstance.value.props.layers;
                layers[2] = layer;
                console.log(layers);
                deckInstance.value.setProps({
                   layers: [...layers]
                });
            })
            .catch(error => {
                console.error('Error loading data:', error);
            });
    }
    const _loadMask = async () => {
        await fetch('/brandenburg.geojson')
            .then(response => response.json())
            .then(data => {
                bbMask.value = data.features[0];
                //const mask = polyMask(data);
                //bbMask.value = mask;
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
            });
        const layers = deckInstance.value.props.layers;
        layers[1] = new GeoJsonLayer({
                    id: 'mask-layer-0_8',
                    data: polyMask(bbMask.value),
                    getFillColor: [27,27,31,255],
                    stroked: false,
                    extruded: false,
                    wireframe: true,
                    lineJointRounded: true,
                });
        /*deckInstance.value.setProps({
            layers
        });*/
    }
    
    onMounted(async () => {
        

        deckInstance.value = new Deck({
            mapStyle: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
            parent: mapElement.value,
            initialViewState: INITIAL_VIEW_STATE,
            controller: true,
            onLoad: () => {
                fitBounds(boundingBox);
            },
            layers: [
                new TileLayer({
                    id: 'tile-layer',
                    data: [
                        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ],
                    pickable:true,
                    renderSubLayers: props => {
                        const {
                            bbox: {west, south, east, north}
                        } = props.tile;
                
                        return [
                            new BitmapLayer(props, {
                                data: null,
                                image: props.data,
                                bounds: [west, south, east, north]
                            })
                        ];
                    }
                })
            ]
        });
        await _loadMask();
    });
    defineExpose({
        deckInstance,
        fitBounds,
        loadData
    });
</script>


<template>
    <div ref="mapElement" style="aspect-ratio: 1;"></div>
</template>

