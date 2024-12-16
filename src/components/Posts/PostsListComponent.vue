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
  grid-template-columns: repeat(3, 33.33%);
  grid-template-rows: auto;
  gap: 10px;
}

.posts__item {
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--white);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 5px;

}

.posts__item:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.posts__item img {
  object-fit: cover;
  width: 100%;
  min-height: 300px;
  max-height: 300px;
  border-radius: 20px;

}

.post__description {
  width: 100%;
  margin-top: 10px;
  padding-left: 0px;
  padding-right: 10px;
}

.post__description h1 {
  overflow: hidden;
  height: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 25px;
  padding-right: 10px;
  line-height: 27px;
  font-family: "Russo";
}

.post__description p {
  padding-top: 0px;
  overflow: hidden;
  height: 100%;
  font-size: 18px;
  font-family: "Rubik-Regular";
  line-height: 20px;
  color: var(--gray);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.post__footer {
  display: flex;
  justify-content: space-between;
  color: var(--gray);
  padding-bottom: 10px;
  font-size: 18px;
  padding-left: 10px;
  padding-right: 10px;
}

@media (max-width: 1440px) {
  .posts__container {
    max-width: 1440px;
    padding: 20px;
    border-radius: 10px;
  }

  .posts__list {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: auto;
    gap: 10px;
  }

  .posts__item img {
    max-height: 300px;
  }

  .post__description h1 {
    font-size: 20px;
    line-height: 24px;
  }

  .post__description p {
    font-size: 16px;
    line-height: 20px;
  }

  .post__footer {
    padding-bottom: 10px;
    font-size: 16px;
    padding-left: 10px;
    padding-right: 10px;
  }
}

@media (max-width: 768px) {
  .posts__container {
    max-width: 768px;
    padding: 10px;
    border-radius: 10px;
  }

  .posts__list {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: auto;
    gap: 5px;
  }

  .posts__item img {
    max-height: 250px;
    min-height: 250px;
  }

  .post__description h1 {
    font-size: 18px;
    line-height: 20px;
  }

  .post__description p {
    font-size: 14px;
    line-height: 18px;
  }

  .post__footer {
    padding-bottom: 10px;
    font-size: 14px;
    padding-left: 5px;
    padding-right: 5px;
  }
}

@media (max-width: 640px) {
  .posts__container {
    max-width: 648px;
    padding: 0px;
    border-radius: 10px;
    background-color: var(--default);
  }

  .posts__list {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: auto;
    gap: 15px;
  }
.posts__item{
  padding: 10px;
}
  .posts__item img {
    max-height: 250px;
    min-height: 250px;
  }

  .post__description h1 {
    font-size: 18px;
    line-height: 20px;
  }

  .post__description p {
    font-size: 14px;
    line-height: 18px;
  }

  .post__footer {
    padding-bottom: 10px;
    font-size: 14px;
    padding-left: 5px;
    padding-right: 5px;
  }
}
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
          title: " Заголовок статьи ",
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