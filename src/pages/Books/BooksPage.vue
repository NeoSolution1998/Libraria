<template>
  <div class="container-fluid">
    <header-vue></header-vue>

    <div class="row">
      <div class="col-lg-2">
        <div class="col-lg-12">
          <div class="sidebar">
            <h2 class="sidebar-title">Фильтры и поиск</h2>
            <!-- Форма для поиска -->
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Поиск..." />
            </div>
            <!-- Дополнительные фильтры -->
            <h6 class="sidebar-title-h6">Дополнительные фильтры</h6>
            <!-- Добавьте дополнительные фильтры здесь -->
          </div>
        </div>

        <div class="col-lg-12">
          <div class="sidebar">
            <h2 class="sidebar-title">Жанры</h2>
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
        <div v-if="books.length === 0" class="no-books">
          <p>Книги не найдены</p>
        </div>
        <div v-else>
          <books-list v-bind:books="books" @remove-book="removeBook"></books-list>
        </div>
        <PaginationVue
          :totalPages="totalPages"
          :currentPage="currentPage"
          @page-changed="handlePageChanged"
        ></PaginationVue>
      </div>
    </div>

    <popular-vue></popular-vue>

    <FooterVue></FooterVue>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      books: [],
      totalPages: 0,
      currentPage: 1,
      perPage: 5,
      dialogVisible: false,
    };
  },
  
  methods: {
    async fetchBooks(page = 1, perPage = 4) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get("http://127.0.0.1:8000/api/v1/books", {
          params: {
            page: page,
            per_page: perPage,
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log('dfsdfds',response);
        this.books = response.data.books;
        this.totalPages = Math.ceil(response.data.total_books / response.data.per_page);
        this.currentPage = response.data.current_page;
      } catch (e) {
        console.error(e);
      }
    },
    async removeBook(bookId) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        await axios.delete(`http://127.0.0.1:8000/api/v1/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        this.fetchBooks(this.currentPage);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) {
            console.error("Server error. Please try again later.");
          } else {
            console.error("Error deleting book:", error.response.data);
          }
        } else if (error.request) {
          console.error("Server is unreachable. Please try again later.");
        } else {
          console.error("An error occurred:", error.message);
        }
      }
    },
    handlePageChanged(pageNumber) {
      console.log("Страница которая отправляется в запрос", pageNumber);
      this.fetchBooks(pageNumber);
      this.currentPage = pageNumber;
    },
  },
  mounted() {
    this.fetchBooks(this.currentPage);
    /* console.log(this.totalPages); */
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
  max-width: 100%; /* Устанавливаем максимальную ширину */
}

.sidebar-title {
  font-size: 1rem; /* Размер текста для заголовков в боковой панели */
  max-width: 100%; /* Устанавливаем максимальную ширину */
}
.sidebar-title-h6 {
  font-size: 0.7rem; /* Размер текста для заголовков в боковой панели */
  max-width: 100%; /* Устанавливаем максимальную ширину */
}

.list-group-item {
  font-size: 1rem; /* Размер текста для элементов списка */
  max-width: 100%; /* Устанавливаем максимальную ширину */
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
