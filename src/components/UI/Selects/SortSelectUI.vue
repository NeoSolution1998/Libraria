<!-- SortSelect.vue -->
<template>
    <div class="sort-select">
        <select class="search_bar__sorts_list" v-model="selectedValue" @change="onChange">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: "SortSelectUI",
    props: {
        // Массив опций для селектора
        options: {
            type: Array,
            required: true,
        },
        // Текущая выбранная опция
        modelValue: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            selectedValue: this.modelValue,
        };
    },
    methods: {
        onChange() {
            this.$emit("update:modelValue", this.selectedValue);
        },
    },
    watch: {
        modelValue(newValue) {
            this.selectedValue = newValue;
        },
    },
};
</script>

<style scoped>
.sort-select {
    border: none;
    font-family: "Russo";
    font-size: 18px;

}

.search_bar__sorts_list {
    border: none;
    
    height: 60px;
    padding-left: 15px;
    border-radius: 8px;
    color: var(--gray);
}
</style>