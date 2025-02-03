<template>
    <div class="book_chapters_section__container">
        <h1>Главы книги</h1>
        <hr class="book_chapters__separator">
        <div class="book_chapters_section__chapters">
            <p v-if="false">
                Глав пока нет
            </p>
            <ul v-if="true">
                <li><a href="#">Chapter 1</a></li>
                <li><a href="#">Chapter 2</a></li>
                <li><a href="#">Chapter 3</a></li>
                <li><a href="#">Chapter 4</a></li>
                <li><a href="#">Chapter 5</a></li>
            </ul>
        </div>


    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";


export default {
    name: 'BookChaptersSection',
    computed: {
        ...mapState({
            book: state => state.book.book,
        })
    },
}
</script>
<style>
.book_chapters_section__container {
    max-width: 1920px;
    background-color: var(--white);
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 40px;
}

.book_chapters_section__container h1 {
    font-size: 30px;
    font-family: Russo;
}

.book_chapters_section__chapters ul {
    list-style: none;
    padding: 0;
    margin: 0;
    font-family: Russo;
    font-size: 20px;
}

.book_chapters_section__chapters li {
    margin-top: 10px;
}

@media(max-width:1024px) {
    .book_chapters_section__container {
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 10px;
        padding: 10px;
    }

    .book_chapters_section__container h1 {
        font-size: 18px;
    }

    .book_chapters_section__chapters ul {
        font-size: 14px;
    }

    .book_chapters_section__chapters li {
        margin-top: 10px;
    }
    .book_chapters__separator{
        margin:0;
    }
    
}

@media(max-width:640px) {}
</style>