<template>
    <div class="books-list_container">
        <div class="books-item" v-for="book in books" :key="book.id">
            <div class="books-item__image_block">
                <img v-if="book.cover_image" src="#" alt="">
                <img v-else src="/images/books/books_default4.jpg" alt="">
            </div>

            <div class="books-item__description_block">
                <div>
                    <div class="books-item__header">
                        <RouterLink class="no-underline" :to="`books/${book.id}`"><h1>{{ book.title }}</h1></RouterLink>
                       
                        <span class="icon-bookmark-empty"></span>
                    </div>

                    <div class="books-item__author">
                        <p>{{ book.author }}</p>
                    </div>

                    <div class="books-item__range">
                        <p>Рейтинг:</p>
                        <span class="books-item__range_star icon-star" aria-label="Rating">0</span>
                    </div>

                    <div class="books-item__description">
                        <p>
                            {{ book.description }}
                        </p>
                    </div>
                </div>

                <div class="books-item__footer">
                    <span class="books-item__footer_item icon-thumbs-up-1"> {{ book.likes_count }}</span>
                    <span class="books-item__footer_item icon-reply-2">0</span>
                    <span class="books-item__footer_item icon-comment-2">{{ book.comments_count }}</span>
                    <span class="books-item__footer_item icon-eye">{{ book.views_count }}</span>
                </div>
            </div>


            <div class="books-item__separator"></div>
        </div>
    </div>

</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
    name: "BooksListComponent",
    computed: {
        ...mapState({
            books: state => state.books.books,
        })
    },
}
</script>
<style>
.books-list_container {
    max-width: 1920px;
    color: var(--darks);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.books-item {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    justify-content: start;
    align-items: start;
    background-color: var(--white);
    border-radius: 10px;
    font-family: "Rubik-Medium";
    padding: 30px 30px 30px 30px;
    gap: 20px;

}

.books-item__image_block {
    box-shadow: 0px 1px 8px var(--gray);
    border-radius: 30px;

}

.books-item__image_block img {
    object-fit: cover;
    width: 100%;
    height: 350px;
    padding: 5px;
    border-radius: 30px;
}

.books-item__description_block {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.books-item__header {
    display: flex;
    justify-content: space-between;
    align-items: start;

}

.books-item__header h1 {
    font-family: "Russo";
    font-size: 30px;
    margin-bottom: 0px
}

.books-item__header .icon-bookmark-empty {
    font-size: 30px;
    color: var(--dark-muted);
}

.books-item__author {}

.books-item__author p {
    font-family: "Russo";
    color: var(--blue);
    margin-bottom: 5px;
    font-size: 18px;
}

.books-item__range {
    display: flex;
    gap: 5px;
    font-size: 18px;
}

.books-item__range p {
    font-family: 'Russo';
    color: var(--red);
    margin-bottom: 0px;
    font-size: 18px;
}

.books-item__range_star {
    color: var(--orange);
}

.books-item__description {}

.books-item__description p {
    font-family: 'Rubik-Regular';
    color: var(--gray);
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 18px;
}

.books-item__footer {
    display: flex;
    justify-content: end;
    gap: 10px;
    font-size: 18px;

}

.books-item__footer_item {}

.icon-thumbs-up-1,
.icon-reply-2,
.icon-comment-2,
.icon-eye,
.books-item__footer_item {
    color: var(--dark-muted);
}

.books-item__separator{
    display: none;
}
@media(max-width:1366px) {
    .books-item__image_block img {
        height: 300px;

    }
}
@media(max-width:1024px) {
    .books-list_container{
        gap: 0px;
 
    }
    .books-item {
        border-radius: 10px;
        padding: 10px 20px;
        gap: 15px;
        grid-template-rows: auto;
        grid-template-areas: 
        "image description"
        "separator separator";
    }

    .books-item__image_block {
        border-radius: 20px;
        grid-area: image;
    }
    .books-item__description_block{
        grid-area: description;
    }
    .books-item__image_block img {
        height: 250px;
        padding: 3px;
        border-radius: 20px;
    }

    .books-item__header h1 {
        font-size: 22px;
    }

    .books-item__header .icon-bookmark-empty {
        font-size: 20px;
    }

    .books-item__range p {
        font-size: 14px;
    }

    .books-item__range_star {
        font-size: 14px;
    }

    .books-item__author p {

        margin-bottom: 5px;
        font-size: 16px;
    }

    .books-item__description p {
        -webkit-line-clamp: 6;
        font-size: 14px;
    }

    .books-item__footer {
        display: flex;
        justify-content: end;
        gap: 5px;
        font-size: 13px;
    }
    .books-item__separator{
        background-color: var(--default);
        height: 2px;
        width: 100%;
        display: block;
        grid-area: separator;
        margin-top: 8px;
    }
}

@media(max-width:640px) {
    .books-item {
        border-radius: 10px;
        padding: 10px 10px;
        gap: 10px;

        grid-template-rows: auto;
    }

    .books-item__image_block {
        box-shadow: 0px 1px 8px var(--gray);
        border-radius: 20px;

    }

    .books-item__image_block img {
        object-fit: cover;
        width: 100%;
        height: 200px;
        padding: 3px;
        border-radius: 20px;
    }

    .books-item__header h1 {
        font-size: 22px;
    }

    .books-item__header .icon-bookmark-empty {
        font-size: 22px;
    }

    .books-item__range p {
        font-size: 13px;
    }

    .books-item__range_star {
        font-size: 12px;
    }

    .books-item__author p {

        margin-bottom: 5px;
        font-size: 14px;
    }

    .books-item__description p {
        -webkit-line-clamp: 4;
        font-size: 13px;
    }

    .books-item__footer {
        display: flex;
        justify-content: end;
        gap: 5px;
        font-size: 12px;

    }
    .books-item__separator{
        height: 1px;
    }
}

@media(max-width:440px) {
    .books-item {
        border-radius: 10px;
        padding: 10px 10px;
        gap: 10px;

        grid-template-rows: auto;
    }

    .books-item__image_block {
        box-shadow: 0px 1px 2px var(--gray);
        border-radius: 10px;

    }

    .books-item__image_block img {
        width: 100%;
        height: 180px;
        border-radius: 10px;
    }

    .books-item__header h1 {
        font-size: 16px;
    }

    .books-item__header .icon-bookmark-empty {
        font-size: 16px;
    }

    .books-item__range p {
        font-size: 10px;
    }

    .books-item__range_star {
        font-size: 10px;
    }

    .books-item__author p {

        margin-bottom: 5px;
        font-size: 12px;
    }

    .books-item__description p {
        -webkit-line-clamp: 6;
        font-size: 10px;
    }

    .books-item__footer {
        display: flex;
        justify-content: end;
        gap: 5px;
        font-size: 10px;

    }
}
</style>
