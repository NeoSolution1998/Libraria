import axios from 'axios';
import Cookies from 'js-cookie';

export const commentsModule = {
  state: () => ({
    comments: [],
  }),

  getters: {
    comments: state => state.comments,
  },

  mutations: {
    setComments(state, comments) {
      state.comments = comments;
    },
    addComment(state, comment) {
      state.comments.push(comment);
    },
    clearComments(state) {
      state.comments = [];
    }
  },

  actions: {
    async addComment({ commit, dispatch, rootState }, { commentableType, commentableId, content, parentId }) {
      const authToken = Cookies.get("auth_token") ?? "";
      const response = await axios.post(`${rootState.domain}/api/v1/comments`, 
        { commentableType, commentableId, content, parentId }, 
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      dispatch('getComment', { commentableType, commentableId });
    },
    async updateComment({ dispatch, rootState }, { commentId, content, commentableType, commentableId }) {
      const authToken = Cookies.get("auth_token") ?? "";
      await axios.patch(`${rootState.domain}/api/v1/comments/${commentId}`, 
        { content }, 
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      dispatch('getComment', { commentableType, commentableId });
    },
    async getComment({ commit, rootState }, { commentableType, commentableId }) {
      const authToken = Cookies.get("auth_token") ?? "";
      commit('clearComments');
      const response = await axios.get(`${rootState.domain}/api/v1/comments`, {
        params: { commentableType, commentableId },
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log(response.data);
      commit('setComments', response.data);
    },
  },
  namespaced: true
};
