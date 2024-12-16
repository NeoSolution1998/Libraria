<template>
  <div class="posts__container">
    <div class="posts__list">
      <div class="posts__item" v-for="post in posts">
        <img :src="post.image" alt="">
        <div class="post__description">
          <h1>{{ post.title }}</h1>
          <p>{{ post.description }}</p>
        </div>
        <div class="post__footer">
          <RouterLink class="no-underline" to="/posts/1">Читать полностью</RouterLink>
          <span class="icon-chat"> 24</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.posts__container {
  max-width: 1920px;
  padding: 40px;
  background-color: var(--white);
  border-radius: 10px;
}

.posts__list {
  display: grid;
  justify-content: center;
  grid-template-columns: 33.3% 33.3% 33.3%;
  grid-template-rows: auto;
  gap: 15px;

}

.posts__item {
  border-radius: 30px;
  overflow: hidden;
  background-color: var(--white);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  /* Плавный переход для трансформации и теней */
  padding: 10px;
}

.posts__item:hover {
  transform: scale(1.01);
  /* Увеличение элемента */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  /* Тень при наведении */
}

.posts__item img {
  object-fit: cover;
  width: 100%;
  height: 400px;
  border-radius: 20px;
  padding-bottom: 10px;
}

.post__description {
  width: 100%;
  margin-top: 10px;
}

.post__description h1 {

  overflow: hidden;
  height: 54px;
  font-size: 30px;
  line-height: 27px;
  font-family: "Russo";
}

.post__description p {
  padding-top: 10px;
  overflow: hidden;
  height: 70px;
  font-size: 18px;
  font-family: "Rubik-Regular";
  line-height: 20px;
  color: var(--gray);
}

.post__footer {
  display: flex;
  justify-content: space-between;
  color: var(--gray);
  padding-bottom: 30px;
  font-size: 18px;
}

@media (min-width: 320px) {}
</style>

<script>
export default {
  name: "PostsListComponent",
  components: {
  },
  data() {
    return {
      posts: [
        {
          id: 1,
          title: " Заголовок статьи тут может быть очень много строчек, но лишнее обрезаетсястроки - максимум...",
          description: "Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.",
          author: "Robert Martin",
          image: "/images/books/potter.png",
        },
        {
          id: 1,
          title: " Заголовок статьи тут может быть очень много строчек, но лишнее обрезаетсястроки - максимум...",
          description: "Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.",
          author: "Robert Martin",
          image: "/images/posts/article1.jpg",
        },
        {
          id: 1,
          title: " Заголовок статьи тут может быть очень много строчек, но лишнее обрезаетсястроки - максимум...",
          description: "Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.",
          author: "Robert Martin",
          image: "/images/posts/article2.jpg",
        }, {
          id: 1,
          title: " Заголовок статьи тут может быть очень много строчек, но лишнее обрезаетсястроки - максимум...",
          description: "Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.",
          author: "Robert Martin",
          image: "images/posts/article3.jpg",
        },
        {
          id: 1,
          title: " Заголовок статьи тут может быть очень много строчек, но лишнее обрезаетсястроки - максимум...",
          description: "Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.",
          author: "Robert Martin",
          image: "images/posts/article4.jpg",
        },
        {
          id: 1,
          title: " Заголовок статьи тут может быть очень много строчек, но лишнее обрезаетсястроки - максимум...",
          description: "Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.Описание книги Обреченное королевство.",
          author: "Robert Martin",
          image: "images/posts/article5.jpg",
        },
      ]
    }
  }
};
</script>