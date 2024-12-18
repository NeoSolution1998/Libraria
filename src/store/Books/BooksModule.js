import axios from 'axios';
import Cookies from 'js-cookie';

export const booksModule = {
  state: () => ({
    books: [],
    book: [],
    category: [],
    totalPages: 0,
    currentPage: 1,
    perPage: 6,
    searchQuery: '',
    selectedCategory: '',
    sortByDate: '',
    sortByName: ''
  }),

  getters: {
    books: state => state.books,
    totalPages: state => state.totalPages,
    currentPage: state => state.currentPage,
    book: state => state.book,
    category: state => state.category,
    searchQuery: state => state.searchQuery,
    selectedCategory: state => state.selectedCategory,
    sortByDate: state => state.sortByDate,
    sortByName: state => state.sortByName,
  },

  mutations: {
    setBooks(state, books) {
      state.books = books;
    },
    setTotalPages(state, totalPages) {
      state.totalPages = totalPages;
    },
    setCurrentPage(state, currentPage) {
      state.currentPage = currentPage;
    },
    setBook(state, book) {
      state.book = book;
    },
    setCategory(state, category) {
      state.category = category;
    },
    setSelectedCategory(state, category) {
      state.selectedCategory = category;
    },
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    setSortByDate(state, order) {
      state.sortByDate = order;
    },
    setSortByName(state, order) {
      state.sortByName = order;
    },
  },

  actions: {
    async fetchBooks({ commit, state, rootState }, page = state.currentPage, perPage = state.perPage) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const apiUrl = `${process.env.VUE_APP_API_URL}/api/v1/books`;

        const response = await axios.get(apiUrl, {
          params: {
            page: page,
            per_page: perPage,
            search: state.searchQuery,
            category: state.selectedCategory,
            sortDate: state.sortByDate,
            sortName: state.sortByName
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(response.data);
        
        commit('setBooks', response.data.books);
        commit('setCategory', response.data.category);
        commit('setTotalPages', Math.ceil(response.data.total_books / response.data.per_page));
        commit('setCurrentPage', page);
      } catch (e) {
        console.error('Ошибка при получении данных о книгах:', e);
      }
    },

    async getBook({ commit, state, rootState }, bookId) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get(`${rootState.domain}/api/v1/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        commit('setBook', response.data);
      } catch (e) {
        console.error('Ошибка при получении книги:', e);
      }
    },

    async createBook({ commit, rootState }, bookData) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const formData = new FormData();

        for (const key in bookData) {
          if (bookData[key] !== null && bookData[key] !== '') {
            formData.append(key, bookData[key]);
          }
        }

        const response = await axios.post(`${rootState.domain}/api/v1/books`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        });

        commit('setBook', response.data);
      } catch (e) {
        console.error('Ошибка при создании книги:', e);
      }
    },

    initializeStateFromURL({ commit, dispatch }) {
      const url = new URL(window.location.href);
      const page = parseInt(url.searchParams.get('page')) || 1;
      const searchQuery = url.searchParams.get('search') || '';
      const selectedCategory = url.searchParams.get('category') || '';
      const sortByDate = url.searchParams.get('sortDate') || '';
      const sortByName = url.searchParams.get('sortName') || '';

      commit('setCurrentPage', page);
      commit('setSearchQuery', searchQuery);
      commit('setSelectedCategory', selectedCategory);
      commit('setSortByDate', sortByDate);
      commit('setSortByName', sortByName);

      dispatch('fetchBooks', page);
    },
  },

  namespaced: true
};
