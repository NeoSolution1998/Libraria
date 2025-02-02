import axios from 'axios';
import Cookies from 'js-cookie';

export const bookModule = {
  state: () => ({
    book: [],
  }),

  getters: {
    book: state => state.book,
  },

  mutations: {
    setBook(state, book) {
      state.book = book;
    },
  },

  actions: {
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
  },

  namespaced: true
};
