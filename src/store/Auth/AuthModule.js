import axios from "axios";
import Cookies from "js-cookie";
import router from "@/router/router";

export const authModule = {
    state: () => ({
        user: null, // Информация о текущем пользователе
        userName: "",
        userAvatar: "",
    }),

    getters: {
        isAuthenticated: (state) => !!state.user, // Проверка авторизации
        user: (state) => state.user, // Данные пользователя
    },

    mutations: {
        setUser(state, user) {
            state.user = user;
            state.userName = user.name || "";
            state.userAvatar = user.avatar || "";
        },
        clearUser(state) {
            state.user = null;
            state.userName = "";
            state.userAvatar = "";
        },
    },

    actions: {
        async login({ commit, dispatch, rootState }, credentials) {
            try {
                const apiUrl = `${rootState.domain || process.env.VUE_APP_API_URL}/api/v1/auth/login`;
                const response = await axios.post(apiUrl, credentials, {
                    headers: { "Content-Type": "application/json" },
                });

                const token = response.data.token;
                Cookies.set("auth_token", token);

                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                await dispatch("fetchUser");

                const prevPageUrl = localStorage.getItem("prevPageUrl");
                router.push(prevPageUrl || "/");
            } catch (error) {
                console.error("Ошибка авторизации", error.response?.data);
                throw error.response?.data || { message: "Ошибка авторизации." };
            }
        },

        async register({ commit }, userData) {
            try {
                const apiUrl = `${process.env.VUE_APP_API_URL}/api/v1/auth/register`;

                const response = await axios.post(apiUrl, userData, {
                    headers: { "Content-Type": "application/json" },
                });

                const token = response.data.token;
                Cookies.set("auth_token", token);

                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                commit("setUser", response.data.user);

                return response.data;
            } catch (error) {
                console.error("Ошибка регистрации", error.response?.data);
                throw error.response?.data || { message: "Ошибка регистрации." };
            }
        },

        async fetchUser({ commit, rootState }) {
            const authToken = Cookies.get("auth_token");

            if (!authToken) {
                console.warn("Токен аутентификации отсутствует");
                commit("clearUser");
                return;
            }

            try {
                const response = await axios.get(`${rootState.domain || process.env.VUE_APP_API_URL}/api/v1/auth/user`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                commit("setUser", response.data);
            } catch (error) {
                console.error("Ошибка получения данных пользователя", error);
                commit("clearUser");
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

    namespaced: true,
};
