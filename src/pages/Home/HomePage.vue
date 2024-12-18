<template>
  <div class="main-container">
    <header-vue></header-vue>
    
    <!-- Главное содержимое -->
    <main class="main-container">
      <!-- Главный баннер -->
      <WelcomeSection></WelcomeSection>

      <!-- Как это работает -->
      <HowWorksSection></HowWorksSection>

      <!-- Рекомендованные книги -->
           <popular-books></popular-books>

      <!-- Подписка -->
      <SubscriptionsComponent></SubscriptionsComponent>

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
.main-container {}



</style>
