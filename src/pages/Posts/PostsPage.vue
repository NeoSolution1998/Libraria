<template>

    <header-vue></header-vue>
    <div class="container">
      <div class="content">
        <div v-if="posts.length === 0" class="no-posts">
          <p>Постов нет</p>
        </div>
        <div v-else class="posts-list-wrapper">
          <posts-list v-bind:posts="posts"></posts-list>
        </div>

        <PaginationVue
          :totalPages="totalPages"
          :currentPage="currentPage"
          @page-changed="handlePageChanged"
        ></PaginationVue>
      </div>
    </div>
    <footer-vue></footer-vue>

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
    async fetchPosts(page = 1, perPage = 8) {
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
    handlePageChanged(newPage) {
      this.currentPage = newPage;
      this.fetchPosts(newPage, this.perPage);
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>

<style scoped>
/* Основные стили контейнера */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Стили для контента */
.content {
  flex: 1;
}

/* Стили для постов */
.posts-list-wrapper {
  min-height: 300px; /* Установите минимальную высоту по вашему усмотрению */
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

/* Стили для футера */
footer-vue {
  margin-top: auto; /* Располагаем футер внизу контейнера */
}
</style>
