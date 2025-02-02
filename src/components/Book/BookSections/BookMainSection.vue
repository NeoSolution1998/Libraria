<template>
    <div class="book_main_section__container">
        <div class="book_main_section__content">
            <div class="book_main_section__header">
                <h1>{{book.title}}</h1>
            </div>

            <div class="book_main_section__author">
                <h3>Автор:</h3>
                <p>{{book.author}}</p>
            </div>

            <div class="book_main_section__range">
                <h3 class="book_main_section__range_header">Рейтинг: </h3>
                <p class="book_main_section__range_icon">5<span class="icon-star"></span></p>
            </div>

            <div class="book_main_section__description">
                <h3>Описание: </h3>
                <p>{{book.description}}</p>

            </div>
            <div class="book_main_section__meta">
                <div class="book_main_section__meta_list">
                    <div class="book_main_section__meta_item">
                        <p>Возрастное ограниченее</p>
                        <p>16</p>
                    </div>
                    <hr class="book_meta__separator" />
                    <div class="book_main_section__meta_item">
                        <p>Дата выхода</p>
                        <p>2024</p>
                    </div>
                    <hr class="book_meta__separator" />
                    <div class="book_main_section__meta_item">
                        <p>Дата добавления на сайт</p>
                        <p>2023</p>
                    </div>
                    <hr class="book_meta__separator" />
                    <div class="book_main_section__meta_item">
                        <p>Последнее обновление</p>
                        <p>Вчера</p>
                    </div>
                    <hr class="book_meta__separator" />
                    <div class="book_main_section__meta_item">
                        <p>Объем</p>
                        <p>670</p>
                    </div>
                    <hr class="book_meta__separator" />
                    <div class="book_main_section__meta_item">
                        <p>Количество глав</p>
                        <p>22</p>
                    </div>
                    <hr class="book_meta__separator" />
                    <div class="book_main_section__meta_item">
                        <p>Издательство</p>
                        <p>MIT</p>
                    </div>
                    <hr class="book_meta__separator" />
                    <div class="book_main_section__meta_item">
                        <p>Время чтения</p>
                        <p>5ч</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";


export default {
    name: 'BookMainSection',
    computed: {
        ...mapState({
            book: state => state.book.book,
        })
    },
}
</script>
<style scoped>
.book_main_section__container {
    padding: 10px;
    padding-top: 0px;
    background-color: var(--white);

}

.book_main_section__content {
    padding: 20px;
}

.book_main_section__header h1 {
    font-family: Russo;
    font-size: 40px;
}

.book_main_section__author {
    display: flex;
    gap: 10px;

}

.book_main_section__author h3 {
    color: var(--dark);
    font-size: 18px;
    font-family: Russo;
}

.book_main_section__range {
    display: flex;
    gap: 10px;
}

.book_main_section__range h3 {
    color: var(--dark);
    font-size: 18px;
    font-family: Russo;
}

.book_main_section__range span {
    color: var(--orange);
}

.book_main_section__range_header {
    font-size: Russo;
    color: var(--dark);
}

.book_main_section__range_icon {
    color: var(--orange);
}


.book_main_section__description {
    color: var(--gray);
}

.book_main_section__description h3 {
    color: var(--dark);
    font-size: 18px;
    font-family: Russo;
}

.book_main_section__description p {
    font-family: Rubik-Regular;
}

.book_main_section__author a {
    font-family: Rubik-Medium;
    font-size: 20px;
    color: var(--gray);
}

.book_main_section__meta {
    background-color: var(--light);
    border-radius: 10px;
    padding: 20px;
    width: 400px;
    margin-top: 20px;
}

.book_main_section__meta_list {}

.book_main_section__meta_item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 0px;
    gap: 40px;
}

.book_main_section__meta_item p {
    font-family: Rubik-Regular;
    font-size: 18px;
}

.book_meta__separator {
    margin: 5px;
}

@media(max-width:640px) {
    .book_main_section__content {
        padding: 0px;
    }

    .book_main_section__header h1 {
        font-size: 20px;
    }

    .book_main_section__author h3 {
        font-size: 16px;
    }

    .book_main_section__range h3 {
        font-size: 16px;
    }

    .book_main_section__description h3 {
        font-size: 16px;
    }

    .book_main_section__description p {
        font-size: 14px;
    }

    .book_main_section__author a {
        font-size: 20px;

    }

    .book_main_section__meta {
        padding: 10px;
        width: 100%;
    }

    .book_main_section__meta_item {
        gap: 20px;
    }

    .book_main_section__meta_item p {
        font-size: 14px;
    }

    .book_meta__separator {
        margin: 0px;
    }
}
</style>