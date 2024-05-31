<template>
  <div>
    <header-vue></header-vue>
    <div class="col-lg-12">
      <div v-if="posts.length === 0" class="no-posts">
        <p>Постов нет</p>
      </div>
      <div v-else>
        <posts-list v-bind:posts="posts"></posts-list>
      </div>
    </div>

    <footer-vue></footer-vue>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      posts: [],
      totalPages: 0,
      currentPage: 1,
      perPage: 5,
    };
  },
  methods: {
    async fetchPosts(page = 1, perPage = 4) {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/posts", {
          params: {
            page: page,
            per_page: perPage,
          },
          headers: {
            Authorization: `Bearer CIFZiME42jOGAdciZfkD6FKuN3XL3Pwx0kOQb9lzf5ac247a`, // Замените на ваш токен авторизации
          },
        });
        console.log("Get response", response.data.posts);
        this.posts = response.data.posts;
        this.totalPages = Math.ceil(response.data.total_posts / response.data.per_page);
        this.currentPage = response.data.current_page;
      } catch (e) {
        console.error(e);
      }
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>

<style scoped>
/* Стили для изображений в постах */
.post-img img {
  border-radius: 5px;
  max-height: 200px; /* Уменьшение размера изображения */
}

/* Стили для информации об авторе и дате публикации */
.author-info {
  padding: 10px 0;
}

.author-info .info p {
  margin-bottom: 5px;
}

/* Стили для кнопки "Читать далее" */
.caption .btn {
  margin-top: 10px;
}

/* Стили для поста */
.post {
  background-color: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Стили для сообщения о том, что постов нет */
.no-posts {
  text-align: center;
  font-size: 18px;
  color: #666666;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
