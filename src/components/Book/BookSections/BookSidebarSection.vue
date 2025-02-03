<template>
    <div class="book_sidebar_section__container">
        <div class="book_sidebar_section__banner">
            <img v-if="book.cover_image" :src="book.cover_image" alt="">
            <img v-else src="/images/books/book_default.jpeg" alt="">
        </div>
        <!--  <div class="book_sidebar_section__info">
            <p>Страниц 566</p>
            <p>Рейтинг 16</p>
        </div> -->
        <div class="book_sidebar_section__buttons">
            <button>Читать</button>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";


export default {
    name: 'BookSidebarSection',
    computed: {
        ...mapState({
            book: state => state.book.book,
        })
    },
}
</script>
<style scoped>
.book_sidebar_section__container {
    padding: 10px;
    background-color: var(--white);
    width: 100%;
    transition: transform 0.2s, box-shadow 0.2s;
}

/* .book_sidebar_section__container:hover{
    transform: scale(1.01);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    
} */
.book_sidebar_section__banner {}

.book_sidebar_section__banner img {
    width: 100%;
}

.book_sidebar_section__buttons {
    margin-top: 10px;
}

.book_sidebar_section__info {
    display: flex;
    padding: 10px;
    gap: 10px;
    color: var(--gray);
}

.book_sidebar_section__buttons button {
    width: 100%;
    border: none;
    padding: 10px;
    background-color: var(--dark-muted);
    color: var(--white);
    border-radius: 6px;
}

.book_sidebar_section__buttons button:hover {
    width: 100%;
    border: none;
    padding: 10px;
    background-color: var(--dark);
    color: var(--white);
}

@media(max-width:640px) {
    .book_sidebar_section__container {}
}

@media(max-width:440px) {
    .book_sidebar_section__container {}
}
</style>