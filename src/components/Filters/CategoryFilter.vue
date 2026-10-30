<template>
    <div class="filters__category">
        <div class="filters__category_header">
            <h2 class="filters__category_name">Категории</h2>
            <ResetButton v-if="localCategory" :onReset="resetCategoryFilter">Сбросить</ResetButton>
        </div>

        <div v-if="loadingCategories" class="category-loading">Загрузка категорий…</div>
        <p v-else-if="loadError" class="category-error">{{ loadError }}</p>
        <select v-else class="form-select" :value="localCategory" @change="updateCategory">
            <option value="">Все категории</option>
            <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
            </option>
        </select>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import Cookies from 'js-cookie';
import ResetButton from '@/components/UI/Buttons/ResetButton.vue';

export default {
    name: "CategoryFilter",
    components: {
        ResetButton,
    },
    data() {
        return {
            categories: [],
            loadingCategories: true,
            loadError: null,
            localCategory: this.$store.state.books.selectedCategory || '',
        };
    },
    computed: {
        ...mapGetters('books', ['selectedCategory']),
    },
    watch: {
        selectedCategory(value) {
            this.localCategory = value || '';
        },
    },
    methods: {
        ...mapMutations('books', ['setSelectedCategory', 'setCurrentPage']),
        async fetchCategories() {
            try {
                const authToken = Cookies.get("auth_token") ?? "";
                const response = await axios.get(
                    `${process.env.VUE_APP_API_URL}/api/v1/categories`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            Accept: 'application/json',
                        },
                    }
                );

                const data = response.data?.data || response.data;
                this.categories = Array.isArray(data) ? data : [];
            } catch (error) {
                console.error('Ошибка при загрузке категорий:', error);
                this.loadError = 'Не удалось загрузить категории.';
            } finally {
                this.loadingCategories = false;
            }
        },
        updateCategory(event) {
            this.localCategory = event.target.value;
            this.setSelectedCategory(this.localCategory);
            this.setCurrentPage(1);
            this.fetchBooks();
        },
        resetCategoryFilter() {
            this.localCategory = '';
            this.setSelectedCategory('');
            this.setCurrentPage(1);
            this.fetchBooks();
        },
        fetchBooks() {
            this.$store.dispatch('books/fetchBooks', 1);
        },
    },
    mounted() {
        this.fetchCategories();
    },
};
</script>

<style scoped>
.filters__category {
    margin-bottom: var(--space-4);
}

.filters__category_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
}

.filters__category_name {
    margin: 0;
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    font-weight: 600;
}

.category-loading,
.category-error {
    margin: var(--space-2) 0 0;
    color: var(--text-muted);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
}

.category-error {
    color: var(--danger);
}

.form-select {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    color: var(--ink);
    background-color: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
}

.form-select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.15);
}
</style>
