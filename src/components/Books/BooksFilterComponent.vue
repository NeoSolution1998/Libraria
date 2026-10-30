<template>
    <div class="books-filter__container">
        <div class="books-filter__content">
            <p class="books-filter__description">Используйте панель фильтров для поиска книг</p>
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "BooksFilterComponent",
}
</script>
<style scoped>
.books-filter__container {
    background-color: var(--surface);
    color: var(--ink);
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    border: 1px solid var(--line);
}

.books-filter__description {
    margin: 0;
    color: var(--text-muted);
    font-size: var(--text-sm);
}
</style>