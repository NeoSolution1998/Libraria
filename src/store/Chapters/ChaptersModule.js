import axios from 'axios';
import Cookies from 'js-cookie';

export const chaptersModule = {
  state: () => ({
    chapter: null,
    allChapter: null,
    loading: false,
    error: null,
  }),

  getters: {
    chapter: state => state.chapter,
    allChapter: state => state.allChapter,
    loading: state => state.loading,
    error: state => state.error,
  },

  mutations: {
    setChapter(state, chapter) {
      state.chapter = chapter;
    },
    setAllChapter(state, allChapter) {
      state.allChapter = allChapter;
    },
    setLoading(state, loading) {
      state.loading = Boolean(loading);
    },
    setError(state, error) {
      state.error = error;
    },
    setChapterLiked(state, { isLiked, likesCount }) {
      if (state.chapter) {
        state.chapter.is_liked = isLiked;
        state.chapter.likes_count = likesCount;
      }
    },
    setChapterRated(state, { rating, ratingsCount }) {
      if (state.chapter) {
        state.chapter.user_rating = rating;
        state.chapter.ratings_count = ratingsCount;
      }
    },
  },

  actions: {
    async fetchChapter({ commit, rootState }, { bookId, chapterId }) {
      commit('setLoading', true);
      commit('setError', null);

      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get(`${rootState.domain}/api/v1/books/${bookId}/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        });

        // Laravel JsonResource возвращает объект главы внутри ключа `data`.
        // Поддерживаем оба формата, чтобы читалка работала с API и моками.
        commit('setChapter', response.data?.data || response.data);
        return response.data?.data || response.data;
      } catch (e) {
        const status = e.response?.status;
        commit('setError', status === 401 ? 'auth' : status === 404 ? 'notfound' : 'network');
        commit('setChapter', null);
        console.error('Ошибка при получении главы:', e);
        throw e;
      } finally {
        commit('setLoading', false);
      }
    },

    async fetchAllChapters({ commit, rootState }, bookId) {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        let allChapters = [];
        let page = 1;
        let lastPage = 1;

        do {
          const response = await axios.get(`${rootState.domain}/api/v1/books/${bookId}/chapters`, {
            params: { page, per_page: 100 },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          // Поддерживаем разные форматы ответа API: { chapters: [...] } или { data: [...] }
          const chapters = response.data?.chapters ?? response.data?.data ?? response.data;
          const pageChapters = Array.isArray(chapters) ? chapters : [];
          allChapters = allChapters.concat(pageChapters);

          if (response.data.last_page !== undefined) {
            lastPage = response.data.last_page;
          } else if (response.data.meta?.last_page !== undefined) {
            lastPage = response.data.meta.last_page;
          } else {
            lastPage = page;
          }

          page++;
        } while (page <= lastPage && pageChapters.length > 0);

        commit('setAllChapter', allChapters);
        return allChapters;
      } catch (e) {
        commit('setAllChapter', []);
        console.error('Ошибка при получении всех глав:', e);
        throw e;
      }
    },

    async toggleChapterLike({ commit, rootState }, chapterId) {
      const authToken = Cookies.get("auth_token") ?? "";
      const chapter = rootState.chapters.chapter;
      const isCurrentlyLiked = chapter && chapter.is_liked;

      try {
        if (isCurrentlyLiked) {
          await axios.delete(`${rootState.domain}/api/v1/chapters/${chapterId}/like`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          commit('setChapterLiked', { isLiked: false, likesCount: Math.max(0, (chapter.likes_count || 0) - 1) });
        } else {
          const response = await axios.post(`${rootState.domain}/api/v1/chapters/${chapterId}/like`, {}, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          commit('setChapterLiked', { isLiked: true, likesCount: response.data.likes_count });
        }
      } catch (e) {
        console.error('Ошибка при смене лайка главы:', e);
        throw e;
      }
    },

    async rateChapter({ commit, rootState }, { chapterId, value }) {
      const authToken = Cookies.get("auth_token") ?? "";
      try {
        const response = await axios.post(`${rootState.domain}/api/v1/chapters/${chapterId}/rating`, { value }, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        commit('setChapterRated', { rating: response.data.rating, ratingsCount: response.data.ratings_count });
        return response.data;
      } catch (e) {
        console.error('Ошибка при оценке главы:', e);
        throw e;
      }
    },

    async unrateChapter({ commit, rootState }, chapterId) {
      const authToken = Cookies.get("auth_token") ?? "";
      try {
        const response = await axios.delete(`${rootState.domain}/api/v1/chapters/${chapterId}/rating`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        commit('setChapterRated', { rating: null, ratingsCount: response.data.ratings_count });
        return response.data;
      } catch (e) {
        console.error('Ошибка при удалении оценки главы:', e);
        throw e;
      }
    },
  },
  namespaced: true,
};
