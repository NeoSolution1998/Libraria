import axios from 'axios';
import Cookies from 'js-cookie';

export const booksModule = {
  state: () => ({
    books: [],
    book: null,
    totalPages: 0,
    currentPage: 1,
    perPage: 6,
    page: 1
  }),

  getters: {
    books: state => state.books,
    totalPages: state => state.totalPages,
    currentPage: state => state.currentPage,
    book: state => state.book,
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
    handleBooksPageChanged(state, { pageNumber, dispatch }) {
      state.currentPage = pageNumber;
      dispatch('books/fetchBooks', state.currentPage);
    },
  },

  actions: {
    async fetchBooks({ commit, state, rootState }, page = state.page, perPage = state.perPage) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get(rootState.domain + "/api/v1/books", {
          params: {
            page: page,
            per_page: perPage,
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        commit('setBooks', response.data.books);
        commit('setTotalPages', Math.ceil(response.data.total_books / response.data.per_page));
        commit('setCurrentPage', response.data.current_page);
      } catch (e) {
        console.error(e);
      }
    },

    async getBook({ commit, state, rootState }, bookId) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get(rootState.domain + `/api/v1/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        state.book = response.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
  namespaced: true
};
