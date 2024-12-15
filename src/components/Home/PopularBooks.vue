<template>
    <section class="books__container">
        <RouterLink class="no-underline" to="/books/1">
            <div class="books_header">

                <h1 class="books_header_text">Популярные книги</h1>
                <span class="icon-right-open"></span>

            </div>
        </RouterLink>


        <div class="books__section">
            <!-- button -->
            <div class="books__left-arrow">
                <span class="icon-left-open" @click="scrollLeft"></span>
            </div>
            <!--  -->
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
            <!-- button -->
            <div class="books__right-arrow">
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
                    image: "/images/books/potter.png",
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
                    image: "/images/books/Kingdom.png",
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
            ],
        }
    },
    methods: {
        scrollLeft() {
            const list = document.querySelector('.books__list');
            list.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        },
        scrollRight() {
            const list = document.querySelector('.books__list');
            list.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        }
    }
};
</script>

<style scoped>
.books__container {
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
.books__list {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: auto;
    overflow: hidden;
    gap: 20px;
    padding: 10px;
    padding-left: 0px;
    padding-bottom: 0px;
}

.books__item {
    transition: transform 0.5s cubic-bezier(0.2, 0, 0.2, 1),
}

.books__item:hover {
    transform: scale(1.04);
}

.books_banner {
    position: relative;
}

.books__item img {
    height: 400px;
    border-radius: 20px;
}

.books__item-content {
    padding: 10px 0px;
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
    color: var(--gray);
    max-height: 60px;
    margin-bottom: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
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


/* СТРЕЛКИ */
.books__section {
    position: relative;
}

.books__left-arrow,
.books__right-arrow {
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

.books__left-arrow {
    left: -10px;
    top: 40%;
    transform: translateY(-50%);
}

.books__right-arrow {
    right: -10px;
    top: 40%;
    transform: translateY(-50%);
}

/* Эффект наведения */
.books__left-arrow:hover,
.books__right-arrow:hover {
    background-color: #f39c12;
    color: var(--white);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Эффект нажатия */
.books__left-arrow:active,
.books__right-arrow:active {
    transform: translateY(-50%) scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.books__left-arrow,
.books__right-arrow {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}


@media(max-width: 1024px) {
    .books__container {
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
    .books__list {
        gap: 10px;
    }

    .books__item img {
        height: 250px;
        border-radius: 10px;
    }

    .icon-heart {
        font-size: 14px;
        padding-left: 10px;
    }

    .books__item-content {
        padding: 10px 0px;

    }

    .books__item-content h2 {
        font-size: 14px;
        margin-bottom: 5px;
        height: 30px;
        overflow: hidden;
    }

    .books__description {
        font-size: 10px;
        margin-bottom: 5px;
        overflow: hidden;
        max-height: 50px;
        color: var(--gray);

    }

    .books__item-footer {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
    }

    .books__left-arrow,
    .books__right-arrow {


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
    .books__list {
        overflow: scroll;
        /* Hide scroll on small screens */
        display: flex;
    }
    .books__item img {
        height: 200px;
        border-radius: 10px;
    }
    .books__item-content h2 {
        font-size: 12px;

    }
    .books__left-arrow,
    .books__right-arrow {
        display: none;
    }
}

@media(max-width:440px) {
    .books__container {
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
    .books__list {

        gap: 10px;
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
        margin-bottom: 5px;
        overflow: hidden;
        max-height: 50px;
        color: var(--gray);

    }

    .books__item-footer {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
    }

}
</style>