import axios from 'axios';
import Cookies from 'js-cookie';

export const bookModule = {
  state: () => ({
    book: {},
    loading: false,
    error: null,
  }),

  getters: {
    book: state => state.book,
    loading: state => state.loading,
    error: state => state.error,
  },

  mutations: {
    setBook(state, book) {
      state.book = book && typeof book === 'object' ? book : {};
    },
    setLoading(state, loading) {
      state.loading = Boolean(loading);
    },
    setError(state, error) {
      state.error = error;
    },
  },

  actions: {
    async getBook({ commit, rootState }, bookId) {
      commit('setLoading', true);
      commit('setError', null);
      commit('setBook', {});

      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        });

        commit('setBook', response.data?.data || response.data);
      } catch (error) {
        const status = error.response?.status;
        commit('setBook', {});
        commit('setError', status === 401 ? 'auth' : status === 404 ? 'notfound' : 'network');
        console.error('Ошибка при получении книги:', error);
      } finally {
        commit('setLoading', false);
      }
    },
  },

  namespaced: true,
};
