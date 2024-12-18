<template>
    <div class="filters__category">
        <div class="filters__category_header">
            <h2 class="filters__category_name">Категории</h2>
            <ResetButton :onReset="resetCategoryFilter">Сбросить</ResetButton>
        </div>

        <select class="filters__category_list" v-model="selectedCategory">
            <option class="filters__category_item" value="all">Все категории</option>
            <option class="filters__category_item" value="books">Книги</option>
            <option class="filters__category_item" value="movies">Фильмы</option>
            <option class="filters__category_item" value="music">Музыка</option>
        </select>
    </div>
</template>

<script>


export default {
    name: "CategoryFilter",
    data() {
        return {
            selectedCategory: "all", // Текущая выбранная категория
        };
    },
    methods: {
        resetCategoryFilter() {
            this.selectedCategory = "all"; // Сбрасываем выбранную категорию
        },
    },
};
</script>

<style scoped>
.filters__category {
    margin-bottom: 20px;
}

.filters__category_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filters__category_name {
    font-size: 18px;
    margin: 0;
}

.filters__category_list {
    margin-top: 10px;
    padding: 10px;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    width: 100%;
}

@media(max-width:440px) {
    .filters__category {
        margin-bottom: 10px;
    }

    .filters__category_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .filters__category_name {
        font-size: 14px;
        margin: 0;
    }

    .filters__category_list {
        margin-top: 10px;
        padding: 10px;
        font-size: 14px;
        border: none;
        border-radius: 4px;
        width: 100%;
    }
}
</style>
