import axios from 'axios';
import Cookies from 'js-cookie';

export const commentsModule = {
  state: () => ({
    comments: [],
    total: 0,
    perPage: 6,
    currentPage: 1,
    lastPage: 1,
    loading: false,
    error: null,
  }),

  getters: {
    comments: state => state.comments,
    total: state => state.total,
    perPage: state => state.perPage,
    currentPage: state => state.currentPage,
    lastPage: state => state.lastPage,
    loading: state => state.loading,
    error: state => state.error,
  },

  mutations: {
    setComments(state, { data, total, currentPage, lastPage, perPage }) {
      state.comments = Array.isArray(data) ? data : [];
      state.total = total ?? 0;
      state.currentPage = currentPage ?? 1;
      state.lastPage = lastPage ?? 1;
      state.perPage = perPage ?? 6;
    },
    addComment(state, comment) {
      state.comments.unshift(comment);
      state.total = state.total + 1;
    },
    updateCommentInList(state, { commentId, content }) {
      const idx = state.comments.findIndex(c => c.id === commentId);
      if (idx !== -1) {
        state.comments[idx].content = content;
      }
    },
    updateCommentLike(state, { commentId, isLiked, likesCount }) {
      const idx = state.comments.findIndex(c => c.id === commentId);
      if (idx !== -1) {
        state.comments[idx].is_liked = Boolean(isLiked);
        state.comments[idx].likes_count = Number(likesCount || 0);
      }
    },
    removeComment(state, commentId) {
      state.comments = state.comments.filter(c => c.id !== commentId);
      state.total = Math.max(0, state.total - 1);
    },
    clearComments(state) {
      state.comments = [];
      state.total = 0;
      state.currentPage = 1;
      state.lastPage = 1;
    },
    setLoading(state, loading) {
      state.loading = Boolean(loading);
    },
    setError(state, error) {
      state.error = error;
    },
  },

  actions: {
    async addComment({ commit, dispatch, rootState }, { commentableType, commentableId, content, parentId }) {
      const authToken = Cookies.get("auth_token") ?? "";
      const response = await axios.post(`${rootState.domain}/api/v1/comments`,
        {
          commentable_type: commentableType,
          commentable_id: commentableId,
          content,
          parent_id: parentId,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const commentData = response.data;
      commit('addComment', commentData);
      return commentData;
    },
    async updateComment({ dispatch, rootState, commit }, { commentId, content, commentableType, commentableId }) {
      const authToken = Cookies.get("auth_token") ?? "";
      try {
        await axios.patch(`${rootState.domain}/api/v1/comments/${commentId}`,
          { content },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        commit('updateCommentInList', { commentId, content });
        dispatch('getComment', { commentableType, commentableId, page: 1 });
      } catch (err) {
        console.error('Ошибка при обновлении комментария:', err);
        throw err;
      }
    },
    async deleteComment({ commit, rootState }, { commentId, commentableType, commentableId }) {
      const authToken = Cookies.get("auth_token") ?? "";
      try {
        await axios.delete(`${rootState.domain}/api/v1/comments/${commentId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        commit('removeComment', commentId);
        if (commentableType && commentableId) {
          dispatch('getComment', { commentableType, commentableId, page: 1 });
        }
      } catch (err) {
        console.error('Ошибка при удалении комментария:', err);
        throw err;
      }
    },
    async getComment({ commit, rootState }, { commentableType, commentableId, page = 1, perPage = 6 }) {
      const authToken = Cookies.get("auth_token") ?? "";
      commit('setLoading', true);
      commit('setError', null);
      try {
        const response = await axios.get(`${rootState.domain}/api/v1/comments`, {
          params: { commentable_type: commentableType, commentable_id: commentableId, page, per_page: perPage },
          headers: { Authorization: `Bearer ${authToken}` },
        });

        // Backend returns: { data: [...], total, per_page, current_page, last_page }
        const body = response.data || {};
        const paginated = body.data ?? body;
        commit('setComments', {
          data: Array.isArray(paginated) ? paginated : (paginated.data ?? []),
          total: body.total ?? (Array.isArray(paginated) ? paginated.length : 0),
          currentPage: body.current_page ?? 1,
          lastPage: body.last_page ?? 1,
          perPage: body.per_page ?? perPage,
        });
      } catch (err) {
        commit('setError', err.response?.data?.message || 'Не удалось загрузить комментарии');
        console.error('Ошибка загрузки комментариев:', err);
      } finally {
        commit('setLoading', false);
      }
    },
    async toggleCommentLike({ rootState, commit }, { type, id, action }) {
      const authToken = Cookies.get("auth_token") ?? "";
      const isLiking = action === 'like';
      try {
        if (isLiking) {
          const response = await axios.post(`${rootState.domain}/api/v1/${type}/${id}/like`,
            {},
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          commit('updateCommentLike', {
            commentId: id,
            isLiked: response.data?.is_liked ?? true,
            likesCount: response.data?.likes_count ?? 0,
          });
          return response.data;
        }
        const response = await axios.delete(`${rootState.domain}/api/v1/${type}/${id}/like`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        commit('updateCommentLike', {
          commentId: id,
          isLiked: response.data?.is_liked ?? false,
          likesCount: response.data?.likes_count ?? 0,
        });
        return response.data;
      } catch (err) {
        console.error('Ошибка при изменении лайка комментария:', err);
        throw err;
      }
    },
  },
  namespaced: true
};
