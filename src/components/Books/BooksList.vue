<template>
  <div class="books">
    <div class="row">
      <div class="col-12">
        <BooksItem v-for="book in books" :key="book.id" :book="book" @removeBook="handleRemoveBook" />
      </div>
    </div>
  </div>
</template>

<script>
import BooksItem from './BooksItem.vue';

export default {
  name: "BooksList",
  components: {
    BooksItem
  },
  props: {
    books: {
      type: Array,
      required: true,
    },
  },
  emits: ['remove-book'],
  methods: {
    handleRemoveBook(bookId) {
      this.$emit("remove-book", bookId);
    },
  },
};
</script>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
}

.col-12 {
  padding: 0;
}
@media (max-width: 768px) {
  .books {
    padding: 10px;
  }
}
</style>
