<template>
    <div class="container-fluid">
      <header-vue></header-vue>
      <posts-item :post="$store.state.posts.post"></posts-item>
  
      <div class="container"><comments-vue></comments-vue></div>
  
      <footer-vue></footer-vue>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
  
  export default {
    name: "post",
    props: ["id"],
    data() {
      return {
        post: null,
      };
    },
    methods: {
      ...mapActions({
        getPost: "posts/getPost",
      }),
    },
    computed: {
      ...mapGetters({
  
      }),
    },
    mounted() {
      const postId = this.$route.params.id; 
      this.getPost(postId);
    },
  };
  </script>
  
  <style scoped>
  /* Ваши стили */
  </style>
  