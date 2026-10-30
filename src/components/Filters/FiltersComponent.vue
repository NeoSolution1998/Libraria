<template>
    <div class="filters__container">
        <div class="filters__section">
            <CategoryFilter></CategoryFilter>
        </div>

        <div class="filters__section">
            <DateFilter></DateFilter>
        </div>

        <div class="filters__section">
            <RangeFilter></RangeFilter>
        </div>

        <div class="filters__section">
            <TagFilter></TagFilter>
        </div>

        <div class="filters__button">
            <TextButton @click="resetAllFilters">Сбросить все фильтры</TextButton>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: "FiltersComponent",
    methods: {
        ...mapMutations('books', ['resetFilters']),
        resetAllFilters() {
            this.resetFilters();
            this.$store.dispatch('books/fetchBooks', 1);
        }
    }
};
</script>

<style scoped>
.filters__container {
    width: 100%;
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    background-color: var(--surface);
    border: 1px solid var(--line);
    font-family: var(--font-sans);
}

.filters__container h1 {
    margin-bottom: var(--space-4);
    color: var(--ink);
    font-size: var(--text-lg);
    font-weight: 600;
}

.filters__section {
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--line);
}

.filters__section:last-of-type {
    border-bottom: none;
}

.filters__button {
    display: flex;
    justify-content: center;
    margin-top: var(--space-4);
    padding-top: var(--space-3);
    border-top: 1px solid var(--line);
}
</style>