<template>
  <header-vue></header-vue>
  <Breadcrumbs></Breadcrumbs>
  <book-vue :book="$store.state.books.book"></book-vue>

  <div class="container">
    <div class="main-body">
      <div class="card" style="border-radius: 15px;">
        <div class="card-body">
          <div class="chapters-list">
            <h3>Главы книги</h3>
            <ul v-if="allChapters && allChapters.length > 0">
              <li v-for="chapter in allChapters" :key="chapter.id">
                <router-link :to="{ name: 'Chapter', params: { bookId: $store.state.books.book.id, chapterId: chapter.id } }">
                  {{ chapter.title }}
                </router-link>
              </li>
            </ul>
            <p v-else>Главы не найдены</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-4"></div>
  <comments-vue :commentableType="'App\\Models\\Book'" :commentableId="this.$route.params.id"></comments-vue>

  <footer-vue></footer-vue>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Book",
  props: ["id"],
  computed: {
    ...mapState('chapters', {
      allChapters: state => state.allChapter,
    }),
  },
  methods: {
    ...mapActions('books', ['getBook']),
    ...mapActions('chapters', ['fetchAllChapters']),
  },
  mounted() {
    const bookId = this.$route.params.id;
    this.getBook(bookId);
    this.fetchAllChapters(bookId);
  },
};
</script>

<style scoped>
.chapters-list {
  margin-bottom: 20px;
}

.chapters-list h3 {
  margin-bottom: 15px;
}

.chapters-list ul {
  list-style-type: none;
  padding-left: 0;
}

.chapters-list li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}
</style>
