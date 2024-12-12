import axios from 'axios';
import Cookies from 'js-cookie';
import router from '@/router/router';

export const headerModule = {
  state: () => ({
    logoSrc: "/images/logo.png",
    defaultAvatar: "/images/default-avatar.png", 
    userName: "", 
    userAvatar: "", 
    user: null
  }),

  getters: {
    user: state => state.user,

  },

  mutations: {

  },

  actions: {
    async fetchUserData({ commit, state, rootState }) {
        const authToken = Cookies.get("auth_token");

        if (authToken) {
          try {
            const response = await axios.get(rootState.domain + "/api/v1/auth/user", {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
  
            state.userName = response.data.name;
            state.userAvatar = response.data.avatar;
            state.user = response.data
          } catch (error) {
            console.error("Ошибка получения данных пользователя", error);
          }
        }
      },
      async logout({ commit, state, rootState }) {
        try {
          const authToken = Cookies.get("auth_token");
  
          if (!authToken) {
            console.error("Токен аутентификации не найден");
            return;
          }
  
          const response = await axios.post(
            rootState.domain + "/api/v1/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
  
          Cookies.remove("auth_token");
          router.push("/login");
        } catch (error) {
          console.error("Ошибка при выходе из системы", error);
          // Дополнительная обработка ошибок, если необходимо
        }
      },
  },
  namespaced: true
};
