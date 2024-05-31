<template>
    <BooksItem
      v-for="book in books"
      :key="book.id"
      :book="book"
      @removeBook="handleRemoveBook"
    >
    </BooksItem>
</template>

<script> 
export default {
  name: "BooksList",
  props: {
    books: {
      type: Array,
      required: true,
    },
  },
  emits: ['remove-book'],
  methods: {
    handleRemoveBook(bookId) {
      console.log('bookList');
      this.$emit("remove-book", bookId);
    },
  },
  mounted() {
    /* console.log(this.books); */
  },
};
</script>

<style scoped>
.books {
  padding: 15px;
  border: 3px solid teal;
  border-radius: 20px;
}

.h {
  text-align: center;
}
</style>
