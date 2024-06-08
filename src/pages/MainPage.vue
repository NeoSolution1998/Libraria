<template>
  <!-- Шапка -->
  <header-vue></header-vue>

  <!-- Главное содержимое -->
  <main class="container-fluid text-center bg-light">
    <!-- Главный баннер -->
    <section id="hero" class="welcome-container text-white bg-dark">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 text-start">
            <h1>Добро пожаловать в нашу библиотеку</h1>
            <p>Читайте книги, делитесь мыслями, находите друзей</p>
            <router-link to="/books" class="btn btn-outline-light mb-3">
              Начать читать
            </router-link>
          </div>
          <div class="col-md-6">
            <img
              src="/images/main/books1.png"
              alt="..."
              class="welcome-image img-fluid"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Как это работает -->
    <section id="how-it-works" class="py-5 bg-light">
      <div class="container">
        <h2>Как это работает?</h2>
        <div class="row">
          <div class="col-md-4">
            <div class="icon-block">
              <i class="fas fa-user-plus fa-3x"></i>
              <h3>Регистрация</h3>
              <p>Зарегистрируйтесь на нашем сайте</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="icon-block">
              <i class="fas fa-search fa-3x"></i>
              <h3>Поиск книг</h3>
              <p>Найдите интересующие вас книги</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="icon-block">
              <i class="fas fa-book-open fa-3x"></i>
              <h3>Читайте и делитесь</h3>
              <p>Читайте книги и делитесь своими мыслями</p>
            </div>
          </div>
        </div>
      </div>
    </section>


<!--     <popular-book-series></popular-book-series> -->
    
    <!-- Рекомендованные книги -->
    <section id="recommended-books" class="py-5 bg-light">
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
/* Стили для обложки книги */
.book-cover {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Стили для блока информации о книге */
.book-info-content {
  padding: 20px;
  background: #fff; /* White background */
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
  color: #007bff; /* Цвет цитаты */
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
