<template>
    <transition name="slide-up">
        <div class="filters-dropdown" v-if="isVisible" @click.self="closeModal">
            <div class="filters-dropdown__header">
                <h1>Фильтры</h1>
                <button class="filters-dropdown__close" @click="closeModal" aria-label="Закрыть фильтры">
                    <span class="icon-cancel-1"></span>
                </button>
            </div>

            <!-- Блок с прокруткой -->
            <div class="filters-dropdown__content" ref="scrollableBlock">
                <div class="filters-dropdown__section">
                    <CategoryFilter></CategoryFilter>
                </div>
                <div class="filters-dropdown__section">
                    <DateFilter></DateFilter>
                </div>
                <div class="filters-dropdown__section">
                    <RangeFilter></RangeFilter>
                </div>
                <div class="filters-dropdown__section">
                    <TagFilter></TagFilter>
                </div>
                <div class="filters-dropdown__actions">
                    <TextButton @click="resetAllFilters">Сбросить все фильтры</TextButton>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: "FiltersDropdown",
    props: {
        isVisible: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        ...mapMutations('books', ['resetFilters']),
        closeModal() {
            this.$emit("toggleFiltersDropdown");
        },
        resetAllFilters() {
            this.resetFilters();
            this.$store.dispatch('books/fetchBooks', 1);
        },
    },
};
</script>

<style scoped>
.filters-dropdown {
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: calc(100vh - 60px);
    background-color: var(--surface);
    color: var(--ink);
    font-family: var(--font-sans);
    padding: var(--space-4) var(--space-5);
    box-shadow: var(--shadow-lg);
    overflow-y: auto;
    border-top-left-radius: var(--radius-xl);
    border-top-right-radius: var(--radius-xl);
}

.filters-dropdown__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--line);
}

.filters-dropdown__header h1 {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: 600;
    font-family: var(--font-display);
}

.filters-dropdown__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background-color: var(--surface-hover);
    border: none;
    color: var(--danger);
    font-size: var(--text-xl);
    cursor: pointer;
    transition: background-color var(--transition-fast), color var(--transition-fast);
}

.filters-dropdown__close:hover {
    background-color: var(--danger);
    color: var(--white);
}

.filters-dropdown__content {
    flex: 1;
    overflow-y: auto;
}

.filters-dropdown__section {
    margin-bottom: var(--space-4);
}

.filters-dropdown__actions {
    margin-top: var(--space-4);
    padding-top: var(--space-3);
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: center;
}

/* Анимации появления/ухода модалки */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform var(--transition-base);
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

@media (max-width: 640px) {
    .filters-dropdown {
        padding: var(--space-3) var(--space-4);
        max-height: calc(100vh - 50px);
    }

    .filters-dropdown__header h1 {
        font-size: var(--text-lg);
    }
}
</style>