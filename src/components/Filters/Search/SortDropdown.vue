<template>
    <div class="sort-dropdown" @click="closeDropdown">
        <ul class="sort-dropdown__list" @click.stop>
            <li v-for="(option, index) in options" :key="index"
                :class="['sort-dropdown__item', { active: option.value === selectedSort }]"
                @click="selectOption(option.value)">
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "SortDropdown",
    props: {
        options: {
            type: Array,
            required: true
        },
        selectedSort: {
            type: String,
            required: true
        }
    },
    emits: ['toggleSortDropdown', 'selectOption'],
    methods: {
        selectOption(value) {
            this.$emit('selectOption', value);
            // Parent handles toggling via @selectOption
        },
        closeDropdown() {
            this.$emit('toggleSortDropdown');
        },
    },
};
</script>

<style scoped>
.sort-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 50;
    min-width: 220px;
    background-color: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--space-1);
    margin-top: var(--space-1);
}

.sort-dropdown__list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sort-dropdown__item {
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    transition: background-color var(--transition-fast), color var(--transition-fast);
    font-size: var(--text-sm);
    font-family: var(--font-sans);
    color: var(--ink);
    border-radius: var(--radius-md);
}

.sort-dropdown__item:hover {
    background-color: var(--surface-hover);
    color: var(--accent);
}

.sort-dropdown__item.active {
    background-color: var(--accent);
    color: var(--ink);
    font-weight: 500;
}

@media (max-width: 640px) {
    .sort-dropdown {
        min-width: 200px;
    }

    .sort-dropdown__item {
        padding: var(--space-2) var(--space-3);
        font-size: var(--text-sm);
    }
}
</style>