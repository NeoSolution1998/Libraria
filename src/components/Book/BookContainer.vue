<template>
    <div class="book__container">
        <div class="book_sidebar__section">
            <BookSidebarSection></BookSidebarSection>
        </div>
        <div class="book_main__section">
            <BookMainSection></BookMainSection>
        </div>
    </div>

    <div>
        <BookChaptersSection></BookChaptersSection>
    </div>
</template>
<script>
import BookChaptersSection from './BookSections/BookChaptersSection.vue';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
    name: 'BookContainer',
    data() {
    },

    computed: {
        ...mapState({
            book: state => state.book.book,
        }),
    },
    methods: {
        ...mapActions({
            getBook: "book/getBook",

        }),
        ...mapMutations({
        }),
        handlePageChange(newPage) {
            this.getBook();
        },
    },

    mounted() {
        const bookId = this.$route.params.id;
        this.getBook(bookId);
    },
}
</script>
<style scoped>
.book__container {
    background-color: var(--white);
    max-width: 1920px;
    margin: auto;
    display: grid;
    grid-template-areas:
        'sidebar main';
    grid-template-columns: 1fr 4fr;
    gap: 10px;
    padding: 40px;
    padding-top: 10px;
    border-end-end-radius: 10px;
    border-end-start-radius: 10px;
}

.book_sidebar__section {
    grid-area: sidebar;
    width: 100%;
}

.book_main__section {
    grid-area: main;
}

@media(max-width:1024px) {
    .book__container {
        grid-template-areas:
            'sidebar' 'main';
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 10px;
        padding-top: 10px;
        border-end-end-radius: 10px;
        border-end-start-radius: 10px;
        max-width: 1024px;
    }
}

@media(max-width:640px) {
    .book__container {
        grid-template-areas:
            'sidebar' 'main';
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 0px;
        padding-top: 10px;
        border-end-end-radius: 10px;
        border-end-start-radius: 10px;
        max-width: 1024px;
    }
}
</style>