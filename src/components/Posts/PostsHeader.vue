<template>
  <div class="articles-page-about-container">
    <div class="articles-page-about">
      <h1 class="articles-page-about-header">Книжный блог</h1>
      <p class="articles-page-about-text">
        Мы создадим ценность для вашего бизнеса с помощью качественного и понятного
        для пользователя проектирования. Мы создадим ценность для вашего бизнеса с помощью
        качественного и понятного для пользователя проектирования.
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "PostsHeader"
}
</script>
<style scoped>
.articles-page-about-container {
  max-width: 1920px;
  width: 100%;
  margin-bottom: 40px;
  background-color: var(--color-light-f5);
  margin: auto;
 
  transition: top 0.3s;
  background-image: url("/public/images/home/1.jpg");
  padding: 90px 140px 60px;
}

.articles-page-about-header {
  font-family: "Russo";
  font-size: 60px;
  color: var(--white);
}

.articles-page-about-text {
  margin-top: 12px;
  max-width: 1220px;

  color: var(--dark);
  margin-top: 28px;
  font-size: 24px;
}

</style>
