<template>
  <header-vue></header-vue>
  <div class="container">
    <div class="col-lg-12">
      <div class="sidebar">
        <h2 class="sidebar-title">Фильтры</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-2">
        <div class="col-lg-12">
          <div class="sidebar">
            <h2 class="sidebar-title">Фильтры и поиск</h2>
            <!-- Форма для поиска -->
            <div class="mb-3">
              <input v-model="localSearchQuery" @input="onSearchInput" type="text" class="form-control" placeholder="Поиск..." />
            </div>
            <!-- Дополнительные фильтры -->
            <h6 class="sidebar-title-h6">Дополнительные фильтры</h6>
            <!-- Добавьте дополнительные фильтры здесь -->
          </div>
        </div>
        <div class="col-lg-12">
          <div class="sidebar">
            <h2 class="sidebar-title">Жанры</h2>
            <select class="form-select" v-model="selectedCategory" @change="onCategoryChange">
              <option v-for="categories in category" :key="categories.id" :value="categories.id">
                {{ categories.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="sidebar">
            <h2 class="sidebar-title">Теги</h2>
            <ul class="list-group">
              <li class="list-group-item">Фантастика</li>
              <li class="list-group-item">Детективы</li>
              <li class="list-group-item">Романы</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-lg-10">
        <!-- Список постов -->
        <div v-if="$store.state.books.books.length === 0" class="no-books">
          <p>Книги не найдены</p>
        </div>
        <div v-else>
          {{ console.log($store.state.books.books) }}
          <books-list v-bind:books="$store.state.books.books"></books-list>
        </div>
        <PaginationVue 
          :totalPages="$store.state.books.totalPages" 
          :currentPage="$store.state.books.currentPage" 
          @page-changed="onPageChange"
        ></PaginationVue>
      </div>
    </div>
  </div>
  <FooterVue></FooterVue>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import debounce from 'lodash/debounce';

export default {
  data() {
    return {
      localSearchQuery: '',
      selectedCategory: ''
    };
  },
  computed: {
    ...mapState({
      searchQuery: state => state.books.searchQuery,
      category: state => state.books.category,
      selectedCategory: state => state.books.selectedCategory,
    }),
  },
  watch: {
    searchQuery: {
      immediate: true,
      handler(newVal) {
        this.localSearchQuery = newVal;
      }
    }
  },
  methods: {
    ...mapActions('books', {
      fetchBooks: "fetchBooks",
      initializeStateFromURL: "initializeStateFromURL",
    }),
    ...mapMutations('books', {
      setSearchQuery: "setSearchQuery",
      setCategory: "setCategory",
      setSelectedCategory: "setSelectedCategory",
      setCurrentPage: "setCurrentPage",
    }),
    onSearchInput: debounce(function() {
      this.setSearchQuery(this.localSearchQuery);
      this.fetchBooks();
    }, 300),
    onCategoryChange() {
      this.setSelectedCategory(this.selectedCategory);
      this.fetchBooks();
    },
    onPageChange(pageNumber) {
      this.setCurrentPage(pageNumber);
      this.fetchBooks();
    }
  },
  mounted() {
    this.initializeStateFromURL();
  },
};
</script>

<style scoped>
.row {
  padding-top: 20px;
}
.btn {
  margin: 20px;
  padding: 10px;
}
.sidebar {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  max-width: 100%;
}
.sidebar-title {
  font-size: 1rem;
  max-width: 100%;
}
.sidebar-title-h6 {
  font-size: 0.7rem;
  max-width: 100%;
}
.list-group-item {
  font-size: 1rem;
  max-width: 100%;
}
.no-books {
  text-align: center;
  font-size: 18px;
  color: #666666;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
