<template>
  <header-vue></header-vue>
  <div class="container">
    <!-- Кнопки для открытия фильтров, сортировки и боковой панели на мобильных устройствах -->
    <div class="d-md-none mb-3">
      <button class="btn btn-outline-dark mr-2" type="button" data-bs-toggle="collapse" data-bs-target="#filterSearchBar" aria-expanded="false" aria-controls="filterSearchBar">
        Фильтры и поиск
      </button>
      <button class="btn btn-outline-dark" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar" aria-expanded="false" aria-controls="sidebar">
        Категории
      </button>
    </div>

    <!-- Фильтры и сортировка -->
    <div id="filterSearchBar" class="filter-search-bar bg-light p-3 mb-4 rounded shadow-sm collapse d-md-block">
      <div class="row align-items-center flex-column flex-md-row">
        <div class="col-md-6 col-12 mb-3 mb-md-0">
          <input v-model="localSearchQuery" @input="onSearchInput" type="text" class="form-control" placeholder="Поиск..." />
        </div>
        <div class="col-md-6 col-12 text-md-right">
          <div class="btn-group mr-2">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownDate" data-bs-toggle="dropdown" aria-expanded="false">
              Сортировать по дате
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownDate">
              <li><button class="dropdown-item" type="button" @click="sortBooksByDate('date_asc')">По возрастанию</button></li>
              <li><button class="dropdown-item" type="button" @click="sortBooksByDate('date_desc')">По убыванию</button></li>
            </ul>
          </div>
          <div class="btn-group">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownName" data-bs-toggle="dropdown" aria-expanded="false">
              Сортировать по имени
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownName">
              <li><button class="dropdown-item" type="button" @click="sortBooksByName('name_asc')">По алфавиту</button></li>
              <li><button class="dropdown-item" type="button" @click="sortBooksByName('name_desc')">По алфавиту в обратном порядке</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="row flex-column-reverse flex-lg-row">
      <main class="col-lg-9 col-12">
        <div v-if="$store.state.books.books.length === 0" class="no-books">
          <p>Книги не найдены</p>
        </div>
        <div v-else>
          <books-list v-bind:books="$store.state.books.books" class="pad-left"></books-list>
        </div>
        <PaginationVue :totalPages="$store.state.books.totalPages" :currentPage="$store.state.books.currentPage" @page-changed="onPageChange"></PaginationVue>
      </main>

      <!-- Боковая панель -->
      <aside id="sidebar" class="col-lg-3 col-12 collapse d-lg-block">
        <div class="sidebar bg-light p-3 rounded shadow-sm mb-4">
          <h2 class="sidebar-title">Жанры</h2>
          <select class="form-select mb-3" v-model="selectedCategory" @change="onCategoryChange">
            <option v-for="category in category" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>

          <h2 class="sidebar-title">Теги</h2>
          <ul class="list-group">
            <li class="list-group-item">Фантастика</li>
            <li class="list-group-item">Детективы</li>
            <li class="list-group-item">Романы</li>
          </ul>
        </div>
        <div class="sidebar bg-light p-3 rounded shadow-sm mb-4">
          <div>Хотите написать собственную книгу или добавить стороннюю? Перейдите на вот эту <router-link :to="{ name: 'BookCreate' }">страницу</router-link> и добавьте ее.</div>
        </div>
      </aside>
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
      setSortByDate: "setSortByDate",
      setSortByName: "setSortByName",
    }),
    onSearchInput: debounce(function () {
      this.setSearchQuery(this.localSearchQuery);
      this.fetchBooks();
    }, 300),
    sortBooksByDate(order) {
      this.setSortByDate(order);
      this.fetchBooks();
    },
    sortBooksByName(order) {
      this.setSortByName(order);
      this.fetchBooks();
    },
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
.filter-search-bar {
  background-color: #f8f9fa;
}

.sidebar {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 1rem;
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

.pad-left {
  padding-left: 10px;
}

@media (max-width: 768px) {
  .filter-search-bar .row {
    flex-direction: column;
    text-align: center;
  }

  .btn-group {
    width: 100%;
    margin-top: 10px;
  }

  .sidebar {
    padding: 15px;
  }

  .sidebar-title {
    font-size: 0.9rem;
  }

  .list-group-item {
    font-size: 0.9rem;
  }

  .no-books {
    font-size: 16px;
  }

  .row {
    flex-direction: column-reverse;
  }

  main {
    margin-bottom: 20px;
  }
}
</style>
