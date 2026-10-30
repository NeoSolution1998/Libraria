import axios from "axios";
import Cookies from "js-cookie";
import router from "@/router/router";

const apiUrl = process.env.VUE_APP_API_URL;

const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
});

export const authModule = {
    state: () => ({
        user: null,
        userName: "",
        userAvatar: "",
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        user: (state) => state.user,
    },

    mutations: {
        setUser(state, user) {
            if (!user) {
                state.user = null;
                state.userName = "";
                state.userAvatar = "";
                return;
            }

            state.user = user;
            state.userName = user.name || "";
            state.userAvatar = user.avatar || user.images?.[0]?.image || "";
        },
        clearUser(state) {
            state.user = null;
            state.userName = "";
            state.userAvatar = "";
        },
    },

    actions: {
        async login({ commit }, credentials) {
            try {
                const response = await axios.post(`${apiUrl}/api/v1/auth/login`, credentials, {
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                });

                const token = response.data.token;

                if (!token) {
                    throw { message: "Сервер не вернул токен авторизации." };
                }

                Cookies.set("auth_token", token, { expires: 7, sameSite: "Lax" });
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                const userResponse = await axios.get(`${apiUrl}/api/v1/auth/user`, {
                    headers: authHeaders(token),
                });

                commit("setUser", userResponse.data?.data || userResponse.data);

                const redirect = router.currentRoute.value.query.redirect
                    || localStorage.getItem("prevPageUrl")
                    || "/";
                localStorage.removeItem("prevPageUrl");

                await router.push(
                    ["/login", "/registration"].includes(redirect) ? "/" : redirect
                );

                return response.data;
            } catch (error) {
                console.error("Ошибка авторизации", error.response?.data || error);
                throw error.response?.data || error;
            }
        },

        async register({ commit }, userData) {
            try {
                const response = await axios.post(`${apiUrl}/api/v1/auth/register`, userData, {
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                });

                const token = response.data.token;

                if (!token) {
                    throw { message: "Сервер не вернул токен авторизации." };
                }

                Cookies.set("auth_token", token, { expires: 7, sameSite: "Lax" });
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                let user = response.data.user;

                if (!user) {
                    const userResponse = await axios.get(`${apiUrl}/api/v1/auth/user`, {
                        headers: authHeaders(token),
                    });
                    user = userResponse.data?.data || userResponse.data;
                }

                commit("setUser", user);

                return response.data;
            } catch (error) {
                console.error("Ошибка регистрации", error.response?.data || error);
                throw error.response?.data || error;
            }
        },

        async fetchUser({ commit }) {
            const authToken = Cookies.get("auth_token");

            if (!authToken) {
                commit("clearUser");
                return null;
            }

            try {
                const response = await axios.get(`${apiUrl}/api/v1/auth/user`, {
                    headers: authHeaders(authToken),
                });
                const user = response.data?.data || response.data;
                commit("setUser", user);
                return user;
            } catch (error) {
                console.error("Ошибка получения данных пользователя", error);
                if (error.response?.status === 401) {
                    Cookies.remove("auth_token");
                }
                commit("clearUser");
                return null;
            }
        },

        async logout({ commit }) {
            const authToken = Cookies.get("auth_token");

            try {
                if (authToken) {
                    await axios.post(
                        `${apiUrl}/api/v1/auth/logout`,
                        {},
                        { headers: authHeaders(authToken) }
                    );
                }
            } catch (error) {
                console.error("Ошибка при выходе из системы", error);
            } finally {
                Cookies.remove("auth_token");
                delete axios.defaults.headers.common["Authorization"];
                commit("clearUser");
                await router.push("/login");
            }
        },

        async updateUser({ commit, dispatch, rootState }, userData) {
            try {
                const authToken = Cookies.get("auth_token");
                const userId = rootState.auth.user?.id;

                if (!authToken || !userId) {
                    throw new Error("Пользователь не авторизован");
                }

                const formData = new FormData();

                Object.keys(userData).forEach((key) => {
                    const value = userData[key];

                    if (value === undefined || value === null) return;
                    if (value instanceof File) {
                        formData.append(key, value);
                        return;
                    }

                    formData.append(key, value);
                });

                formData.append("_method", "PUT");

                const response = await axios.post(
                    `${apiUrl}/api/v1/users/${userId}`,
                    formData,
                    {
                        headers: {
                            ...authHeaders(authToken),
                        },
                    }
                );

                await dispatch("fetchUser");

                return response.data;
            } catch (error) {
                console.error("Ошибка при обновлении профиля", error);
                throw error.response?.data || { message: "Ошибка при обновлении профиля" };
            }
        },
    },

    namespaced: true,
};
