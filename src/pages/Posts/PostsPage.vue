<template>
  <header-vue></header-vue>
  <!-- <PostsHeader></PostsHeader> -->

    <PostsVue></PostsVue>


  <!-- <div class="container">
    <div class="content">
      <div v-if="$store.state.posts.posts.length === 0" class="no-posts">
          <p>Постов нет</p>
        </div>
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
  </div> -->
  <footer-vue></footer-vue>
</template>

<script>

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      posts: state => state.posts.posts,
      totalPages: state => state.posts.totalPages,
      currentPage: state => state.posts.currentPage,
    }),
  },
  methods: {
    ...mapActions({
      fetchPosts: "posts/fetchPosts",
      initializeStateFromURL: "posts/initializeStateFromURL",
    }),
    ...mapMutations({}),
  },

  mounted() {
    this.initializeStateFromURL();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}

.posts-list-wrapper {
  min-height: 300px;
  margin-bottom: 15px;
}

.post {
  background-color: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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

footer-vue {
  margin-top: auto;
}
</style>
