<template>
  <div class="container bg-dark p-5">
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <!-- Слайды для каждой книги -->
        <div 
          v-for="(book, index) in books" 
          :key="book.id" 
          :class="['carousel-item', { active: index === 0 }]"
        >
          <section id="book-info" class="py-5 bg-light">
            <div class="container">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <img
                    :src="book.image"
                    alt="Book Cover"
                    class="img-fluid mb-4 book-cover"
                  />
                </div>
                <div class="col-md-6">
                  <div class="book-info-content">
                    <h2 class="book-title">{{ book.title }}</h2>
                    <p class="book-quote">
                      <i class="fas fa-quote-left fa-2x quote-mark"></i>
                      {{ book.description }}
                    </p>
                    <p class="book-author">— {{ book.author }}</p>
                    <p class="book-description">
                      {{ book.words }}
                    </p>
                    <router-link to="/read" class="btn btn-primary">Начать читать</router-link>
                    <div class="progress mt-3">
                      <div
                        class="progress-bar"
                        role="progressbar"
                        style="width: 75%"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Предыдущий</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Следующий</span>
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, nextTick } from 'vue';

export default {
  name: "CarouselWithBookInfo",
  data() {
    return {
      books: [
        {
          id: 1,
          title: "Ведьмак",
          description: "Описание книги Ведьмак...",
          words: "Текст книги Ведьмак...",
          author: "Сапковский",
          image: "https://avatars.mds.yandex.net/get-altay/2701879/2a00000170773391ed19313da7fceb9cbafa/orig"
        },
        {
          id: 2,
          title: "Гарри Поттер",
          description: "Описание книги Гарри Поттер...",
          words: "Текст книги Гарри Поттер...",
          author: "Джоан Роулинг",
          image: "https://avatars.mds.yandex.net/get-altay/2701879/2a00000170773391ed19313da7fceb9cbafa/orig"
        },
        {
          id: 3,
          title: "Властелин Колец",
          description: "Описание книги Властелин Колец...",
          words: "Текст книги Властелин Колец...",
          author: "Дж. Р. Р. Толкин",
          image: "https://avatars.mds.yandex.net/get-altay/2701879/2a00000170773391ed19313da7fceb9cbafa/orig"
        },
      ],
    };
  },
  mounted() {
    this.initCarousel();
  },
  updated() {
    this.initCarousel();
  },
  methods: {
    initCarousel() {
      nextTick(() => {
        const carouselElement = document.getElementById('carouselExample');
        if (carouselElement) {
          new bootstrap.Carousel(carouselElement);
        }
      });
    }
  }
};
</script>

<style>
.carousel-caption {
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
}
.carousel-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
}
.carousel-item img {
  object-fit: cover;
  height: 100%;
}
.book-info-content {
  text-align: left;
}
</style>
