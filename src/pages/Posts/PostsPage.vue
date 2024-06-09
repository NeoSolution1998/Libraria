<template>
  <header-vue></header-vue>
  <div class="container">
    <div class="content">
      <!-- <div v-if="$store.state.posts.posts.length === 0" class="no-posts">
          <p>Постов нет</p>
        </div> -->
      <div class="posts-list-wrapper">
        <posts-list v-bind:posts="$store.state.posts.posts"></posts-list>
      </div>

      <PaginationVue
          :totalPages="$store.state.posts.totalPages"
          :currentPage="$store.state.posts.currentPage"
          @page-changed="
            $store.commit('posts/handlePostsPageChanged', {
              pageNumber: $event,
              dispatch: $store.dispatch,
            })
          "
        ></PaginationVue>
    </div>
  </div>
  <footer-vue></footer-vue>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions({
      fetchPosts: "posts/fetchPosts",
    }),
    ...mapMutations({}),
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
