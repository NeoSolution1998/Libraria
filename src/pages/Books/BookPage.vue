<template>
  <div class="container-fluid">
    <header-vue></header-vue>
    <book-vue :book="book"></book-vue>

    <div  class="container "><comments-vue></comments-vue></div>
    
    <footer-vue></footer-vue>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {
  name: "Book",
  props: ["id"],
  data() {
    return {
      book: null,
    };
  },
  methods: {
    async getBook() {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const bookId = this.$route.params.id; // Получаем id из параметров маршрута
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("BOOK", response.data);
        this.book = response.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
  mounted() {
    this.getBook();
  },
};
</script>

<style scoped>
/* Ваши стили */
</style>
