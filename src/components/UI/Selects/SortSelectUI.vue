<!-- SortSelect.vue -->
<template>
    <div class="sort-select">
        <select class="form-select" v-model="selectedValue" @change="onChange">
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
        options: {
            type: Array,
            required: true,
        },
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
.form-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--space-3) center;
    background-size: 16px;
    padding-right: var(--space-10);
    width: 100%;
    height: 48px;
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
    font-family: var(--font-sans);
    color: var(--ink);
    background-color: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.15);
}

.form-select option {
    padding: var(--space-2);
}
</style>