<template>
    <section class="books__container">
        <div class="books_header">
            <h1>Популярные книги</h1>
            <span class="icon-right-open"></span>
        </div>

        <div class="books__list">

            <div class="books__item" v-for="book in books" :key="book.id">
                <RouterLink class="no-underline" to="/books/1">
                    <div class="books_banner">
                        <img :src="book.image" :alt="book.title" loading="lazy" />
                    </div>
                    <article class="books__item-content">
                        <div class="books_item-header">
                            <h2>{{ book.title }}</h2>
                            <span class="icon-heart"></span>
                        </div>

                        <p class="books__description">{{ book.description }}</p>
                        <footer class="books__item-footer">
                            <p class="books__author">{{ book.author }}</p>
                            <p class="books__rating-star icon-star" aria-label="Rating">{{ book.rating }}</p>
                        </footer>
                    </article>
                </RouterLink>

            </div>
        </div>
    </section>
</template>

<script>
import { ref } from "vue";

export default {
    name: "PopularBooks",
    setup() {
        const books = ref([
            {
                id: 1,
                title: "Game of Thrones",
                description: "Описание книги Обреченное королевство.",
                author: "Robert Martin",
                rating: 5,
                image: "/images/books/potter.png",
            },
            {
                id: 2,
                title: "Kingdom of Ashes",
                description: "Описание книги Обреченное королевство.",
                author: "Sarah J. Maas",
                rating: 4.8,
                image: "/images/books/Kingdom.png",
            },
            {
                id: 3,
                title: "Harry Potter",
                description: "Описание книги Обреченное королевство.",
                author: "J.K. Rowling",
                rating: 4.9,
                image: "/images/books/potter.png",
            },
            {
                id: 4,
                title: "Default Book",
                description: "Описание книги Обреченное королевство.",
                author: "John Doe",
                rating: 4.7,
                image: "/images/books/default.png",
            }, {
                id: 5,
                title: "Default Book",
                description: "Описание книги Обреченное королевство.",
                author: "John Doe",
                rating: 4.7,
                image: "/images/books/default.png",
            },
            {
                id: 6,
                title: "Default Book",
                description: "Описание книги Обреченное королевство.",
                author: "John Doe",
                rating: 4.7,
                image: "/images/books/default.png",
            },
            {
                id: 7,
                title: "Default Book",
                description: "Описание книги Обреченное королевство.",
                author: "John Doe",
                rating: 4.7,
                image: "/images/books/1.webp",
            },
            {
                id: 8,
                title: "Default Book",
                description: "Описание книги Обреченное королевство.",
                author: "John Doe",
                rating: 4.7,
                image: "/images/books/2.jpg",
            },
            {
                id: 9,
                title: "Default Book",
                description: "Описание книги Обреченное королевство.",
                author: "John Doe",
                rating: 4.7,
                image: "/images/books/3.webp",
            },
            {
                id: 10,
                title: "Default Book",
                description: "Описание книги Обреченное королевство.",
                author: "John Doe",
                rating: 4.7,
                image: "/images/books/4.jpg",
            },
            {
                id: 11,
                title: "Default Book",
                description: "Описание книги Обреченное королевство.",
                author: "John Doe",
                rating: 4.7,
                image: "/images/books/5.jpg",
            },
        ]);

        return { books };
    },
};
</script>

<style scoped>
.books__container {
    padding: 40px;
    max-width: 1920px;
    margin: auto;
    background-color: var(--dark);
    overflow: hidden;
    color: var(--white);
}
.no-underline{

}
.books_header {
    display: flex;
    justify-content: start;
    align-items: center;
    margin: 20px 0px;
}

.icon-right-open {
    font-size: 25px;
    padding-left: 10px;
}

.books__list {
    display: flex;
    gap: 20px;
    align-items: stretch;
    /* Выравниваем элементы по высоте */
}

.books__item {
    transition: transform 0.5s cubic-bezier(0.2, 0, 0.2, 1),
}


.books__item:hover {
    transform:  scale(1.04) ;



}
.books_banner {
    position: relative;
}

.books__item img {
    height: 400px;
    border-radius: 20px;
}

.books__item-content {
    padding: 15px 0px;

}

.books_item-header {
    display: flex;
    justify-content: space-between;
}

.books__item-content h2 {
    font-size: 18px;
    margin-bottom: 10px;
}

.books__description {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
}

.books__item-footer {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.books__rating-star {
    color: #f39c12;
}
.no-underline {
  text-decoration: none;
  color: inherit;
}
@media(max-width:440px) {
    .books__container {
        padding: 10px;
        max-width: 440px;
    }

    .books_header {
        margin: 0px;
    }

    .books_header h1 {
        font-size: 18px;
    }

    .icon-right-open {
        font-size: 12px;
        padding-left: 5px;
    }

    .books__list {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        /* Включаем горизонтальную прокрутку */
        scroll-behavior: smooth;
        /* Плавная прокрутка */
    }

    .books__item img {
        height: 170px;
        border-radius: 10px;
    }

    .icon-heart {
        font-size: 10px;
        padding-left: 10px;
    }

    .books__item-content {
        padding: 5px 0px;

    }

    .books__item-content h2 {
        font-size: 10px;
        margin-bottom: 5px;
        height: 15px;
        overflow: hidden;
    }

    .books__description {
        font-size: 8px;
        color: #666;
        margin-bottom: 5px;
        height: 30px;
        overflow: hidden;
    }

    .books__item-footer {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
    }
}
</style>