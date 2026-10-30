<template>
    <div class="filters__date">
        <div class="filters__date_header">
            <label>Дата публикации</label>
            <ResetButton v-if="startDate || endDate" :onReset="resetDateFilter">Сбросить</ResetButton>
        </div>

        <div class="filters__date_inputs">
            <label>
                <span>От</span>
                <input
                    v-model="startDate"
                    class="form-input filters__date_input"
                    type="date"
                    :max="endDate || undefined"
                    @change="updateDateRange"
                >
            </label>
            <label>
                <span>До</span>
                <input
                    v-model="endDate"
                    class="form-input filters__date_input"
                    type="date"
                    :min="startDate || undefined"
                    @change="updateDateRange"
                >
            </label>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import ResetButton from '@/components/UI/Buttons/ResetButton.vue';

export default {
    name: "DateFilter",
    components: {
        ResetButton,
    },
    data() {
        return {
            startDate: this.$store.state.books.startDate || '',
            endDate: this.$store.state.books.endDate || '',
        };
    },
    computed: {
        storeStartDate() {
            return this.$store.state.books.startDate || '';
        },
        storeEndDate() {
            return this.$store.state.books.endDate || '';
        },
    },
    watch: {
        storeStartDate(value) {
            if (value !== this.startDate) this.startDate = value || '';
        },
        storeEndDate(value) {
            if (value !== this.endDate) this.endDate = value || '';
        },
    },
    methods: {
        ...mapMutations('books', ['setStartDate', 'setEndDate', 'setCurrentPage']),
        resetDateFilter() {
            this.startDate = '';
            this.endDate = '';
            this.setStartDate(null);
            this.setEndDate(null);
            this.setCurrentPage(1);
            this.fetchBooks();
        },
        updateDateRange() {
            this.setStartDate(this.startDate || null);
            this.setEndDate(this.endDate || null);
            this.setCurrentPage(1);
            this.fetchBooks();
        },
        fetchBooks() {
            this.$store.dispatch('books/fetchBooks', 1);
        },
    },
};
</script>

<style scoped>
.filters__date {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--space-4);
}

.filters__date_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
}

.filters__date_header label {
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    font-weight: 600;
}

.filters__date_inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
}

.filters__date_inputs label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
}

.filters__date_inputs span {
    color: var(--text-muted);
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.filters__date_input {
    width: 100%;
    min-width: 0;
    padding: var(--space-2);
    color: var(--ink);
    background-color: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
}

.filters__date_input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.15);
}
</style>
