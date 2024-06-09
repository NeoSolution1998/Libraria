<template>
  <div class="container-fluid">
    <header-vue></header-vue>
    <book-vue :book="$store.state.books.book"></book-vue>

    <div class="container"><comments-vue></comments-vue></div>

    <footer-vue></footer-vue>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Book",
  props: ["id"],
  data() {
    return {
      book: null,
    };
  },
  methods: {
    ...mapActions({
      getBook: "books/getBook",
    }),
  },
  computed: {
    ...mapGetters({

    }),
  },
  mounted() {
    const bookId = this.$route.params.id; 
    this.getBook(bookId);
  },
};
</script>

<style scoped>
/* Ваши стили */
</style>
