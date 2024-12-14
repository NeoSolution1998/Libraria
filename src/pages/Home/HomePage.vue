<template>
  <div class="main-container">
    <header-vue></header-vue>

    <!-- Главное содержимое -->
    <main class="container-fluid text-center bg-light">
      <!-- Главный баннер -->
      <WelcomeSection></WelcomeSection>

      <!-- Как это работает -->
      <HowWorksSection></HowWorksSection>


      <!--     <popular-book-series></popular-book-series> -->
           <div class="bg-dark">edfdf</div>
      <!-- Рекомендованные книги -->
      <section id="recommended-books" class=" bg-light">
        <popular-books></popular-books>
      </section>

      <!-- Подписка -->

      <subscription-vue></subscription-vue>

      <!-- Популярные посты -->
      <section id="popular-posts" class="mt-3 py-5 bg-dark text-white">
        <popular-posts></popular-posts>
      </section>

      <!-- Подписка -->
      <!-- <section id="subscribe" class="py-5 bg-primary text-white">
        <div class="container">
          <h2>Подпишитесь на наши обновления</h2>
          <p>Получайте уведомления о новых книгах и постах</p>
          <a href="#" class="btn btn-light">Подписаться</a>
        </div>
      </section> -->
    </main>

    <!-- Подвал -->
    <footer-vue id="footer"></footer-vue>
  </div>
  <!-- Шапка -->

</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
};
</script>

<style scoped>
.container {
  padding-top: 60px;
}

/* Стили для обложки книги */

.book-cover {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Стили для блока информации о книге */
.book-info-content {
  padding: 20px;
  background: #fff;
  /* White background */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Стили для названия книги */
.book-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Стили для цитаты */
.book-quote {
  font-style: italic;
  margin-bottom: 10px;
}

.quote-mark {
  display: inline-block;
  margin-right: 10px;
  color: #007bff;
  /* Цвет цитаты */
}

.book-author {
  font-weight: bold;
  margin-bottom: 20px;
}

/* Стили для прогресса */
.progress {
  height: 1rem;
  background-color: #e9ecef;
  border-radius: 0.25rem;
}

.progress-bar {
  background-color: #007bff;
}

/* Общие стили */
.container-fluid {
  padding: 0%;
}

.welcome-container {
  border-bottom-left-radius: 3%;
  border-bottom-right-radius: 3%;
}

.welcome-image {
  border-radius: 5%;
  max-width: 300px;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

#hero {
  padding: 60px 0;
}

.icon-block {
  text-align: center;
  padding: 20px;
}

.icon-block img {
  max-width: 100px;
  margin-bottom: 20px;
}

.card img {
  height: 200px;
  object-fit: cover;
}

#subscribe {
  padding: 60px 0;
}

html {
  scroll-behavior: smooth;
}
</style>
