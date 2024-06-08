<template>
  <!-- Шапка -->
  <header-vue></header-vue>

  <!-- Главное содержимое -->
  <main class="container-main text-center ">
    <!-- Карусель с изображениями -->
    <div id="carousel" class="carousel slide mb-5" data-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="https://static.tildacdn.com/tild3861-6366-4465-b737-333037383034/_____.jpg"
            alt="..."
            class="d-block w-100"
          />
        </div>
        <div class="carousel-item">
          <img
            src="https://sneg.top/uploads/posts/2023-04/1681199302_sneg-top-p-biblioteka-kartinki-dlya-prezentatsii-inst-1.jpg"
            alt="..."
            class="d-block w-100"
          />
        </div>
        <div class="carousel-item">
          <img
            src="https://s1.1zoom.ru/big7/212/Closeup_Book_Library_356623.jpg"
            alt="..."
            class="d-block w-100"
          />
        </div>
      </div>
      <!-- Элементы управления -->
      <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Предыдущий</span>
      </a>
      <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Следующий</span>
      </a>
    </div>

    <!-- Популярные книги -->
  </main>
  <popular-vue></popular-vue>
  <!-- Подписка -->
  <subscription-vue></subscription-vue>

  <!-- Подвал -->
  <footer-vue id="footer"></footer-vue>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "Home",
  data() {
    return {
      logoSrc: "/images/logo.png", // Указываем путь к изображению логотипа
      userName: "", // Имя пользователя
      userAvatar: "", // URL аватарки пользователя
      popularBooks: [], // Список популярных книг
    };
  },
  created() {
    // Получаем список популярных книг при загрузке страницы
    this.fetchPopularBooks();
  },
  methods: {
    isLoggedIn() {
      const authToken = Cookies.get("auth_token");
      return authToken && authToken.length > 0;
    },
    async logout() {
      try {
        const authToken = Cookies.get("auth_token");

        if (!authToken) {
          console.error("Токен аутентификации не найден");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/v1/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        Cookies.remove("auth_token");
        this.$router.push("/login");
      } catch (error) {
        console.error("Ошибка при выходе из системы", error);
        // Дополнительная обработка ошибок, если необходимо
      }
    },
    async fetchPopularBooks() {
      try {
        const response = await axios.get("http://example.com/api/books/popular");
        this.popularBooks = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке популярных книг", error);
        // Дополнительная обработка ошибок, если необходимо
      }
    },
    addToFavorites(book) {
      // Логика добавления книги в избранное
    },
  },
};
</script>

<style scoped>
.container-main {
  background: linear-gradient(to left, #2c3e50, #2b4157); /* Градиентный фон */
}
.carousel-item img {
  max-height: 700px;
  max-width: 100%;
}
.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
}
</style>
