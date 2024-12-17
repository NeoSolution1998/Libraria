<template>
    <div class="books__container">

        <div class="books_search__block">
            <SearchBarFilter></SearchBarFilter>
        </div>

        <div class="books_filters__block">
            <FiltersVue></FiltersVue>
        </div>

        <div class="books__section">
            <div class="books_block">
                <BooksListComponent></BooksListComponent>
                <!-- <div  class="books__empty">
                <p>Постов пока нет или произошла ошибка при загрузке данных.</p>
            </div> -->
            </div>
        </div>

    </div>
</template>
<script>
export default {
    name: "BooksContainer",
}
</script>
<style>
.books__container {
    max-width: 1920px;
    margin: auto;
    display: grid;
    grid-template-areas:
        "search search"
        "filters books";
    background-color: var(--dark);
}

.books_search__block {
    grid-area: search;
}

.books_filters__block {
    grid-area: filters;
}

.books__section {
    grid-area: books;
}
</style>