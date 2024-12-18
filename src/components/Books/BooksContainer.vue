<template>
    <div class="books__container">
        <div class="books__container_blocks">
            <div class="books_search__block">
                <SearchBarFilter></SearchBarFilter>
            </div>

            <div class="books_filters__block">
                <FiltersVue></FiltersVue>
            </div>


            <div class="books_block">
                <BooksListComponent v-if="books && books.length"></BooksListComponent>
                <div v-else class="books__empty">
                    <p>Постов пока нет или произошла ошибка при загрузке данных.</p>
                </div>
            </div>
        </div>
        <div class="books_pagination">
            <PaginationUI :totalPages="totalPages" :currentPage="currentPage" @page-changed="handlePageChange">
            </PaginationUI>
        </div>
    </div>

</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";


export default {

    name: "BooksContainer",
    data() {
        return {
            filtersVisible: false,
        }
    },

    computed: {
        ...mapState({
            books: state => state.books.books,
            totalPages: state => state.books.totalPages,
            currentPage: state => state.books.currentPage,
        }),
    },
    methods: {
        ...mapActions({
            fetchBooks: "books/fetchBooks",

        }),
        ...mapMutations({
            setCurrentPage: "books/setCurrentPage",
        }),
        handlePageChange(newPage) {
            this.setCurrentPage(newPage);
            this.fetchBooks();
        },
    },

    mounted() {
        this.fetchBooks();
    },
};
</script>
<style>
.books__container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
}

.books__container_blocks {
    max-width: 1920px;
    margin: auto;
    display: grid;
    grid-template-areas:
        "search search"
        "filters books";
    grid-template-columns: 1fr 3.5fr;
    background-color: var(--default);

    column-gap: 10px;
    row-gap: 10px;
}

.books_search__block {
    grid-area: search;
    background-color: var(--white);
}

.books_filters__block {
    grid-area: filters;
}

.books__block {
    grid-area: books;
}

.books_pagination {}

@media(max-width:1024px) {
    .books__container_blocks {
        max-width: 1024px;
        margin: auto;
        padding: 0px;
        display: grid;
        grid-template-areas:
            "search"
            "filters"
            "books";
        background-color: var(--white);
        grid-template-columns: 1fr;
        gap: 0px;
    }

    .books_filters__block {
        display: none;
    }

    .books__section {
        display: block;
        border: 2px solid var(--default);
    }
}
</style>