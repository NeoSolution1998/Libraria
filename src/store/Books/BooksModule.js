import axios from 'axios';
import Cookies from 'js-cookie';

export const booksModule = {
  state: () => ({
    books: [],
    book: null,
    category: [],
    totalPages: 0,
    currentPage: 1,
    perPage: 6,
    searchQuery: '',
    selectedCategory: '' 
  }),

  getters: {
    books: state => state.books,
    totalPages: state => state.totalPages,
    currentPage: state => state.currentPage,
    book: state => state.book,
    category: state => state.category,
    searchQuery: state => state.searchQuery,
    selectedCategory: state => state.selectedCategory,
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
  },

  actions: {
    async fetchBooks({ commit, state, rootState }, page = state.currentPage, perPage = state.perPage) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";

        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        url.searchParams.set('search', state.searchQuery);
        url.searchParams.set('category', state.selectedCategory);
        window.history.pushState({}, '', url);

        const response = await axios.get(`${rootState.domain}/api/v1/books`, {
          params: {
            page: page,
            per_page: perPage,
            search: state.searchQuery,
            category: state.selectedCategory 
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        commit('setBooks', response.data.books);
        commit('setCategory', response.data.category);
        commit('setTotalPages', Math.ceil(response.data.meta.total_books / response.data.meta.per_page));
        commit('setCurrentPage', page);
      } catch (e) {
        console.error(e);
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
        console.error(e);
      }
    },

    initializeStateFromURL({ commit, dispatch }) {
      const url = new URL(window.location.href);
      const page = parseInt(url.searchParams.get('page')) || 1;
      const searchQuery = url.searchParams.get('search') || '';
      const selectedCategory = url.searchParams.get('category') || ''; 

      commit('setCurrentPage', page);
      commit('setSearchQuery', searchQuery);
      commit('setSelectedCategory', selectedCategory); 
      dispatch('fetchBooks', page);
    }
  },
  namespaced: true
};
