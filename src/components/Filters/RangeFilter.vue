<template>
    <div class="filters__range">
        <div class="filters__range_header">
            <label>Рейтинг</label>
            <ResetButton :onReset="resetRangeFilter">Сбросить</ResetButton>
        </div>

        <div class="rating">
            <span v-for="star in 5" :key="star" @click="setRating(star)" @mouseover="hoverRating(star)"
                @mouseleave="resetHover" :class="{ filled: star <= (hoveredRating || minRating) }">
                <IconVue name="star" />
            </span>
        </div>
        <p class="filters__range_selected">Минимальный рейтинг: {{ minRating }}</p>
    </div>
</template>

<script>
import IconVue from '@/components/Icons/IconVue.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: "RangeFilter",
    components: {
        IconVue
    },
    computed: {
        ...mapGetters('books', ['minRating']),
    },
    data() {
        return {
            hoveredRating: 0,
        };
    },
    methods: {
        ...mapMutations('books', ['setMinRating']),
        setRating(rating) {
            this.setMinRating(rating);
            this.fetchBooks();
        },
        hoverRating(rating) {
            this.hoveredRating = rating;
        },
        resetHover() {
            this.hoveredRating = 0;
        },
        resetRangeFilter() {
            this.setMinRating(0);
            this.fetchBooks();
        },
        fetchBooks() {
            this.$store.dispatch('books/fetchBooks', 1);
        }
    }
};
</script>

<style scoped>
.filters__range {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--space-4);
}

.filters__range_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
}

.filters__range_header label {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--ink);
    font-family: var(--font-sans);
}

.filters__range_selected {
    color: var(--info);
    margin-bottom: var(--space-1);
    font-size: var(--text-sm);
}

.rating {
    display: flex;
    gap: var(--space-1);
    font-size: var(--text-xl);
    color: var(--line);
    cursor: pointer;
}

.rating span {
    transition: color var(--transition-fast), transform var(--transition-fast);
}

.rating span.filled {
    color: var(--warning);
}

.rating span:hover {
    transform: scale(1.15);
}

@media (max-width: 640px) {
    .filters__range {
        margin-bottom: var(--space-3);
    }

    .filters__range_header label {
        font-size: var(--text-sm);
    }

    .filters__range_selected {
        font-size: var(--text-xs);
    }

    .rating {
        font-size: var(--text-xl);
    }
}
</style>