<template>
  <header-vue></header-vue>
  <Breadcrumbs></Breadcrumbs>
  <div class="about-page">

    <div class="container">
      <section class="hero-section">
        <h1 class="hero-title">О нас</h1>
        <p class="hero-subtitle">
          Мы создаем решения, которые вдохновляют, упрощают жизнь и помогают достигать целей.
        </p>
      </section>

      <section class="about-section">
        <div class="about-card">
          <h2>Кто мы?</h2>
          <p>Мы - команда специалистов, увлеченных созданием инновационных решений для цифровой трансформации бизнеса и
            повышения эффективности процессов.</p>
        </div>

        <div class="about-card">
          <h2>Что мы делаем?</h2>
          <p>Мы разрабатываем программное обеспечение, создаем пользовательские приложения, внедряем системы управления
            данными, чтобы помогать нашим клиентам достигать устойчивого роста,
            оптимизировать операции и улучшать взаимодействие с клиентами.</p>
        </div>


        <div class="about-card">
          <h2>Наши ценности</h2>
          <ul class="values-list">
            <li>Качество и надежность</li>
            <li>Индивидуальный подход</li>
            <li>Инновации и креативность</li>
          </ul>
        </div>
      </section>

      <section class="mission-section">
        <h2>Наша миссия</h2>
        <p>Мы стремимся быть надежным партнером для наших клиентов и помогать им на пути к успеху.</p>
      </section>
    </div>
    <footer-vue></footer-vue>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
};
</script>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;

  font-family: sans-serif;
  background-color: var(--light);
}

.container {
  flex-grow: 1;
  padding: 20px 20px;
  max-width: 1900px;
  margin: 0 auto;
}

.hero-section {
  text-align: start;
  padding: 40px 0;
  background: linear-gradient(135deg, #17613e, #10583a);
  color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.hero-title {
  font-size: 2.2rem;

  margin-bottom: 16px;
  font-family: 'Russo';
}

.hero-subtitle {
  font-size: 1.2rem;
  line-height: 1.6;
}

.about-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 40px;
}

.about-card {
  flex: 1 1 calc(33% - 20px);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.about-card h2 {
  font-size: 1.6rem;
  margin-bottom: 12px;
  color: var(--green-light);
  font-family: 'Russo', sans-serif;
}

.values-list {
  list-style-type: disc;
  margin: 10px 0 0 20px;
  padding: 0;
}

.mission-section {
  margin-top: 60px;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.mission-section h2 {
  font-size: 1.8rem;
  color: var(--green-light);
  margin-bottom: 16px;
  font-family: 'Russo', sans-serif;
}

.mission-section p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #6b7280;
}

@media(max-width:640px) {
  .about-section {
    display: grid;

    gap: 20px;
    margin-top: 20px;
  }

  .mission-section {
    margin-top: 20px;
  }
}
</style>
