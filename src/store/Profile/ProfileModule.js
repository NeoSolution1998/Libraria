import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.VUE_APP_API_URL;

const authHeaders = () => {
  const token = Cookies.get('auth_token') ?? '';

  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
};

export const profileModule = {
  namespaced: true,
  state: () => ({
    profile: null,
    loading: false,
    error: null,
    followLoading: false,
  }),
  getters: {
    profile: (state) => state.profile,
    loading: (state) => state.loading,
    error: (state) => state.error,
    followLoading: (state) => state.followLoading,
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile || null;
    },
    setLoading(state, loading) {
      state.loading = Boolean(loading);
    },
    setError(state, error) {
      state.error = error;
    },
    setFollowLoading(state, loading) {
      state.followLoading = Boolean(loading);
    },
    setFollowing(state, { isFollowing, followersCount }) {
      if (!state.profile) return;

      state.profile.is_following = Boolean(isFollowing);
      if (typeof followersCount === 'number') {
        state.profile.followers_count = followersCount;
      }
    },
  },
  actions: {
    async fetchProfile({ commit }, userId) {
      if (!userId) {
        commit('setProfile', null);
        commit('setError', 'auth');
        return null;
      }

      commit('setLoading', true);
      commit('setError', null);

      try {
        const response = await axios.get(`${apiUrl}/api/v1/users/${userId}`, {
          headers: authHeaders(),
        });
        const profile = response.data?.data || response.data;
        commit('setProfile', profile);
        return profile;
      } catch (error) {
        const status = error.response?.status;
        commit('setProfile', null);
        commit('setError', status === 401 ? 'auth' : status === 404 ? 'notfound' : 'network');
        return null;
      } finally {
        commit('setLoading', false);
      }
    },

    async followUser({ commit, state }, userId) {
      commit('setFollowLoading', true);
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/users/${userId}/follow`,
          {},
          { headers: authHeaders() }
        );
        commit('setFollowing', {
          isFollowing: true,
          followersCount: response.data?.followers_count,
        });
        return response.data;
      } finally {
        commit('setFollowLoading', false);
      }
    },

    async unfollowUser({ commit }, userId) {
      commit('setFollowLoading', true);
      try {
        const response = await axios.delete(
          `${apiUrl}/api/v1/users/${userId}/follow`,
          { headers: authHeaders() }
        );
        commit('setFollowing', {
          isFollowing: false,
          followersCount: response.data?.followers_count,
        });
        return response.data;
      } finally {
        commit('setFollowLoading', false);
      }
    },
  },
};
