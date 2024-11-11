import axios from 'axios';
import Cookies from 'js-cookie';

export const chaptersModule = {
  state: () => ({
    chapter: null,
    allChapter: null,
  }),

  getters: {
    chapter: state => state.chapter,
    allChapter: state => state.allChapter,
  },

  mutations: {
    setChapter(state, chapter) {
      state.chapter = chapter;
    },
    setAllChapter(state, allChapter) {
      state.allChapter = allChapter;
    },
  },

  actions: {
    async fetchChapter({ commit, rootState }, { bookId, chapterId }) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get(`${rootState.domain}/api/v1/books/${bookId}/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        commit('setChapter', response.data);
      } catch (e) {
        console.error('Ошибка при получении главы:', e);
      }
    },

    async fetchAllChapters({ commit, rootState }, bookId) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get(`${rootState.domain}/api/v1/books/${bookId}/chapters`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        commit('setAllChapter', response.data);
      } catch (e) {
        console.error('Ошибка при получении всех глав:', e);
      }
    },
  },
  namespaced: true,
};
