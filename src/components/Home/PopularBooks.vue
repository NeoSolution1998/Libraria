<template>
    <section class="popular-books__container">
        <RouterLink class="no-underline" to="/books/1">
            <div class="books_header">

                <h1 class="books_header_text">Популярные книги</h1>
                <span class="icon-right-open"></span>

            </div>
        </RouterLink>


        <div class="popular-books__section">
            <!-- button -->
            <div class="popular-books__left-arrow">
                <span class="icon-left-open" @click="scrollLeft"></span>
            </div>
            <!--  -->
            <div class="popular-books__list">

                <div class="popular-books__item" v-for="book in books" :key="book.id">
                    <RouterLink class="no-underline" to="/books/1">
                        <div class="popular-books_banner">
                            <img :src="book.image" :alt="book.title" loading="lazy" />
                        </div>
                        <article class="popular-books__item-content">
                            <div class="popular-books_item-header">
                                <h2>{{ book.title }}</h2>
                                <span class="icon-heart"></span>
                            </div>

                            <p class="books__description">{{ book.description }}</p>
                            <footer class="popular-books__item-footer">
                                <p class="popular-books__author">{{ book.author }}</p>
                                <p class="popular-books__rating-star icon-star" aria-label="Rating">{{ book.rating }}
                                </p>
                            </footer>
                        </article>
                    </RouterLink>
                </div>
            </div>
            <!-- button -->
            <div class="popular-books__right-arrow">
                <span class="icon-right-open" @click="scrollRight"></span>
            </div>
            <!--  -->
        </div>

    </section>
</template>

<script>
import { ref } from "vue";

export default {
    name: "PopularBooks",
    data() {
        return {
            books: [
                {
                    id: 1,
                    title: "Game of Thrones Game of ThronesGame of Thrones",
                    description: "Описание книги Обреченное королевство.",
                    author: "Robert Martin",
                    rating: 5,
                    image: "/images/books/books_default12.jpg",
                },
                {
                    id: 1,
                    title: "Game of Thrones",
                    description: "Описание книги Обреченное королевство.",
                    author: "Robert Martin",
                    rating: 5,
                    image: "/images/books/series/Wedmak.jpg",
                },
                {
                    id: 2,
                    title: "Kingdom of Ashes",
                    description: "Описание книги Обреченное королевство.",
                    author: "Sarah J. Maas",
                    rating: 4.8,
                    image: "/images/books/books_default4.jpg",
                },
                {
                    id: 3,
                    title: "Harry Potter",
                    description: "Описание книги Обреченное королевство.",
                    author: "J.K. Rowling",
                    rating: 4.9,
                    image: "/images/books/series/LordOfTheRings.jpg",
                },
                {
                    id: 4,
                    title: "Default Book",
                    description: "Описание книги Обреченное королевство.Описание книги Обреченное королевство.писание книги Обреченное королевство.",
                    author: "John Doe",
                    rating: 4.7,
                    image: "/images/books/books_default2.jpg",
                }, {
                    id: 5,
                    title: "Default Book",
                    description: "Описание книги Обреченное королевство.",
                    author: "John Doe",
                    rating: 4.7,
                    image: "/images/books/books_default3.jpg",
                },
                {
                    id: 6,
                    title: "Default Book",
                    description: "Описание книги Обреченное королевство.",
                    author: "John Doe",
                    rating: 4.7,
                    image: "/images/books/books_default4.jpg",
                },
                {
                    id: 7,
                    title: "Default Book",
                    description: "Описание книги Обреченное королевство.",
                    author: "John Doe",
                    rating: 4.7,
                    image: "/images/books/books_default5.jpg",
                },
                {
                    id: 8,
                    title: "Default Book",
                    description: "Описание книги Обреченное королевство.",
                    author: "John Doe",
                    rating: 4.7,
                    image: "/images/books/books_default5.jpg",
                },
                {
                    id: 9,
                    title: "Default Book",
                    description: "Описание книги Обреченное королевство.",
                    author: "John Doe",
                    rating: 4.7,
                    image: "/images/books/books_default2.jpg",
                },
                {
                    id: 10,
                    title: "Default Book",
                    description: "Описание книги Обреченное королевство.",
                    author: "John Doe",
                    rating: 4.7,
                    image: "/images/books/books_default3.jpg",
                },
                {
                    id: 11,
                    title: "Default Book",
                    description: "Описание книги Обреченное королевство.",
                    author: "John Doe",
                    rating: 4.7,
                    image: "/images/books/books_default8.jpg",
                },
            ],
        }
    },
    methods: {
        scrollLeft() {
            const list = document.querySelector('.popular-books__list');
            list.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        },
        scrollRight() {
            const list = document.querySelector('.popular-books__list');
            list.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        }
    }
};
</script>

<style scoped>
.popular-books__container {
    padding: 40px 20px 0px 40px;
    max-width: 1920px;
    margin: auto;
    background-color: var(--dark);
    overflow: hidden;
    color: var(--white);
}

/* HEADER */
.books_header {
    display: flex;
    justify-content: start;
    align-items: center;
    margin: 20px 0px;
}

.books_header {
    display: flex;
}

.books_header h1 {
    color: var(--bisque);
    font-family: "Russo";
    font-size: 50px;
    margin-bottom: 8px;
}

.books_header span {
    color: var(--bisque);
    font-size: 35px;
}

/* Books LIST */
.popular-books__list {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: auto;
    overflow: hidden;
    gap: 20px;
    padding: 10px;
    padding-left: 0px;
    padding-bottom: 0px;
}

.popular-books__item {
    transition: transform 0.5s cubic-bezier(0.2, 0, 0.2, 1),
}

.popular-books__item:hover {
    transform: scale(1.04);
}

.popular-books_banner {
    position: relative;
}

.popular-books__item img {
    height: 400px;
    border-radius: 20px;
}

.popular-books__item-content {
    padding: 10px 0px;
}

.popular-books_item-header {
    display: flex;
    justify-content: space-between;
}

.popular-books__item-content h2 {
    font-size: 20px;
    margin-bottom: 5px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;

}

.books__description {
    font-size: 14px;
    color: var(--gray);
    margin-bottom: 5px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.popular-books__item-footer {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.popular-books__rating-star {
    color: var(--orange);
}

.no-underline {
    text-decoration: none;
    color: inherit;
}


/* СТРЕЛКИ */
.popular-books__section {
    position: relative;
}

.popular-books__left-arrow,
.popular-books__right-arrow {
    position: absolute;
    z-index: 100;
    color: var(--white);
    border-radius: 50%;
    background-color: var(--red);
    height: 55px;
    width: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
}

.popular-books__left-arrow {
    left: -10px;
    top: 40%;
    transform: translateY(-50%);
}

.popular-books__right-arrow {
    right: -10px;
    top: 40%;
    transform: translateY(-50%);
}

/* Эффект наведения */
.popular-books__left-arrow:hover,
.popular-books__right-arrow:hover {
    background-color: #f39c12;
    color: var(--white);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Эффект нажатия */
.popular-books__left-arrow:active,
.popular-books__right-arrow:active {
    transform: translateY(-50%) scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.popular-books__left-arrow,
.popular-books__right-arrow {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}


@media(max-width: 1024px) {
    .popular-books__container {
        padding: 20px;
        padding-bottom: 0px;
        max-width: 1024px;
    }

    /* HEADER */
    .books_header h1 {
        font-size: 22px;
        margin-bottom: 2px;
    }

    .books_header span {
        font-size: 16px;
    }

    /* BOOKS */
    .popular-books__list {
        gap: 10px;
    }

    .popular-books__item img {
        height: 250px;
        border-radius: 10px;
    }

    .icon-heart {
        font-size: 14px;
        padding-left: 10px;
    }

    .popular-books__item-content {
        padding: 10px 0px;

    }

    .popular-books__item-content h2 {
        font-size: 14px;
        margin-bottom: 5px;
    }

    .books__description {
        font-size: 10px;
        margin-bottom: 5px;
        color: var(--gray);

    }

    .popular-books__item-footer {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
    }

    .popular-books__left-arrow,
    .popular-books__right-arrow {


        height: 35px;
        width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        cursor: pointer;
    }
}

/* Show arrows on smaller screens */
@media(max-width: 768px) {
    .popular-books__list {
        overflow: scroll;
        /* Hide scroll on small screens */
        display: flex;
    }

    .popular-books__item img {
        height: 200px;
        border-radius: 10px;
    }

    .popular-books__item-content h2 {
        font-size: 12px;

    }

    .popular-books__left-arrow,
    .popular-books__right-arrow {
        display: none;
    }
}

@media(max-width:440px) {
    .popular-books__container {
        padding: 10px;
        padding-bottom: 0px;
        max-width: 440px;
    }

    /* HEADER */
    .books_header {
        margin: 0px;
    }

    .books_header h1 {
        font-size: 18px;
        margin-bottom: 0px;
    }

    .books_header span {
        font-size: 12px;

    }

    /* BOOKS */
    .popular-books__list {

        gap: 10px;
    }

    .popular-books__item img {
        height: 170px;
        border-radius: 10px;
    }

    .icon-heart {
        font-size: 10px;
        padding-left: 10px;
    }

    .popular-books__item-content {
        padding: 5px 0px;

    }

    .popular-books__item-content h2 {
        font-size: 10px;
        margin-bottom: 5px;


    }

    .books__description {
        font-size: 8px;
        margin-bottom: 5px;


        color: var(--gray);

    }

    .popular-books__item-footer {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
    }

}
</style>