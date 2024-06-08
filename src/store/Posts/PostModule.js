import axios from 'axios';

export const postModule = {
    state: () => ({
        posts: [],
        totalPages: 0,
        currentPage: 1,
        perPage: 5,
    }),

    mutations: {
        setPosts(state, posts) {
            state.posts = posts;
        },
        setTotalPages(state, totalPages) {
            state.totalPages = totalPages;
        },
        setCurrentPage(state, currentPage) {
            state.currentPage = currentPage;
        },
    },
    actions: {
        async fetchPosts({ state, commit }) {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/v1/posts", {
                    params: {
                        page: state.page,
                        per_page: state.perPage,
                    },
                    headers: {
                        Authorization: `Bearer CIFZiME42jOGAdciZfkD6FKuN3XL3Pwx0kOQb9lzf5ac247a`, // Замените на ваш токен авторизации
                    },
                });
                commit("setPosts", response.data.posts);
            } catch (e) {
                console.error(e);
            }
        },

    }
};
