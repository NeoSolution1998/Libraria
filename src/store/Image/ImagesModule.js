import axios from 'axios';
import Cookies from 'js-cookie';

export const imagesModule = {
  state: () => ({
    images: [],
    userProfileImage: null, // Добавлено для хранения изображения профиля пользователя
    loading: false,
    error: null,
  }),

  getters: {
    getImages: state => state.images,
    getUserProfileImage: state => state.userProfileImage,
    getError: state => state.error,
    isLoading: state => state.loading,
  },

  mutations: {
    SET_IMAGES(state, images) {
      state.images = images;
    },
    SET_USER_PROFILE_IMAGE(state, imagePath) {
      state.userProfileImage = imagePath;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },

  actions: {
    async fetchUserProfileImage({ commit, rootState }, userId) {
      commit('SET_LOADING', true);
      try {
        const authToken = Cookies.get('auth_token') ?? '';
        const response = await axios.get(`${rootState.domain}/api/v1/images/${userId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        commit('SET_USER_PROFILE_IMAGE', response.data.path);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Ошибка при загрузке изображения пользователя');
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async uploadImage({ commit, rootState }, { file, imagetable_id, image_type }) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('imagetable_id', imagetable_id);
      formData.append('image_type', image_type);

      commit('SET_LOADING', true);
      try {
        const authToken = Cookies.get('auth_token') ?? '';
        const response = await axios.post(`${rootState.domain}/api/v1/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        console.log(response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Ошибка при загрузке изображения');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  namespaced: true,
};
