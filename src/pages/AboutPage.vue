<template>
  <div class="about-page">
    <header-vue></header-vue>

    <div class="container mt-4">
      <h1 class="mb-4">О нас</h1>
      <p>
        Наша компания - это команда профессионалов, которые стремятся создавать качественные продукты
        и предоставлять лучший сервис для наших клиентов. Мы гордимся своей работой и постоянно стремимся
        к улучшению наших услуг.
      </p>
      <p>
        Мы верим в инновации, креативность и партнерские отношения. Наша цель - сделать вашу жизнь проще
        и помочь вам достичь ваших целей.
      </p>
      <p>
        Если у вас есть вопросы или предложения, не стесняйтесь связаться с нами. Мы всегда рады помочь
        и обсудить возможности сотрудничества.
      </p>
    </div>

    <footer-vue></footer-vue>
  </div>
</template>

<script>

export default {
  name: 'AboutPage',
}
</script>

<style scoped>
.about-page {
  min-height: 100vh; /* Высота страницы на весь экран */
  display: flex;
  flex-direction: column;
  
}

.container {
  flex-grow: 1; /* Занимает всю доступную высоту между хедером и футером */
  padding: 4%; /* Отступы в процентах от ширины страницы */
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}
</style>
