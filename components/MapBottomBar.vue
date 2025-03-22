<script setup>
    import { ref, watch, computed } from 'vue';
    const slider4 = ref(0);
    const startDate = ref('1996-10-29');
    const endDate = ref('2023-10-29');
    const currentlySelectedDate = ref(startDate.value);

    // Function to calculate the number of days between two dates
    const calculateDaysBetween = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const timeDiff = Math.abs(endDate - startDate);
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    const daysBetween = calculateDaysBetween(startDate.value, endDate.value);
    const step = 100 / daysBetween;

    // Initialize range to full range (0-100)
    const rangeValue = ref([0, 100]);

    // Function to determine season icon based on slider value
    const dayAsLabelFromRangeSlider = (sliderValue) => {
        const date = new Date(startDate.value);
        date.setDate(date.getDate() + Math.floor(sliderValue / step));
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Computed visible date range based on rangeValue
    /*const visibleDateRange = computed(() => {
        const startDayOffset = Math.floor(rangeValue.value[0] / step);
        const endDayOffset = Math.floor(rangeValue.value[1] / step);
        
        const visibleStartDate = new Date(startDate.value);
        visibleStartDate.setDate(visibleStartDate.getDate() + startDayOffset);
        
        const visibleEndDate = new Date(startDate.value);
        visibleEndDate.setDate(visibleEndDate.getDate() + endDayOffset);
        
        return {
            start: visibleStartDate.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            end: visibleEndDate.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            startValue: rangeValue.value[0],
            endValue: rangeValue.value[1]
        };
    });*/

    // Function to update the slider value based on the number of days
    const dayAsLabelFromSlider = (currentSliderValue) => {
        const currentDate = new Date(startDate.value);
        currentDate.setDate(currentDate.getDate() + Math.floor(currentSliderValue / step));
        currentlySelectedDate.value = currentDate.toISOString().split('T')[0];
        return currentDate.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };
    

    // Watch for changes in rangeValue
    watch(
        rangeValue,
        (newRangeValue) => {
            // If slider4 is outside the new range, reset it to the start of range
            if (slider4.value < newRangeValue[0] || slider4.value > newRangeValue[1]) {
                slider4.value = newRangeValue[0];
            }
        },
        { deep: true, immediate: true } 
    );

    // Optional: Emit events when date range changes
    const emit = defineEmits(['dateRangeChanged', 'currentDateChanged']);

    // Watch for changes to notify parent components
    /*watch(visibleDateRange, (newRange) => {
        emit('dateRangeChanged', newRange);
    }, { deep: true, immediate: true });*/

    watch(slider4, (newValue) => {
        emit('currentDateChanged', dayAsLabelFromSlider(newValue));
    });
    defineExpose({
        currentlySelectedDate
    });
</script>

<template>
    <div class="map-bottom-bar">
        <div style="width: 100%; margin: 0px;">
            <v-slider
                v-model="slider4"
                thumb-label="always"
                :step="step"
                :min="rangeValue[0]"
                :max="rangeValue[1]"
                color="#46774c"
            >
                <template v-slot:thumb-label="{ modelValue }" class="no-wrap">
                    <div class="no-wrap">{{ dayAsLabelFromSlider(modelValue) }}</div>
                </template>
            </v-slider>
        </div>
        <div style="width: 100%; margin: 0px;">
            <v-range-slider
                v-model="rangeValue"
                :max="100"
                min="0"
                :step="step"
                class="align-center"
                hide-details
                thumb-label="always"
                color="#46774c"
            >
                <template v-slot:thumb-label="{ modelValue }" color="#46774c">
                    <div class="no-wrap">{{ dayAsLabelFromRangeSlider(modelValue) }}</div>
                </template>
            </v-range-slider>
        </div>
    </div>
</template>

<style scoped>
    .map-bottom-bar {
        position: fixed;
        z-index: 1000;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #1b1b1f;
        padding: 10px 50px;
    }
    .no-wrap {
        white-space: nowrap;
    }
</style>