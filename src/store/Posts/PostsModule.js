import axios from 'axios';
import Cookies from 'js-cookie';

export const postsModule = {
    state: () => ({
        posts: [],
        post: [],
        totalPages: 0,
        currentPage: 1,
        perPage: 6,
        page: 1,
        searchQuery: '',
        sortByDate: '',
        sortByName: ''
    }),

    getters: {
        searchQuery: state => state.searchQuery,
    },

    mutations: {
        setPosts(state, posts) {
            state.posts = posts;
        },
        setTotalPages(state, totalPosts) {
            state.totalPages = totalPosts;
        },
        setCurrentPage(state, currentPage) {
            state.currentPage = currentPage;
        },
        setSearchQuery(state, query) {
            state.searchQuery = query;
        },
        setSortByDate(state, order) {
            state.sortByDate = order;
        },
        setSortByName(state, order) {
            state.sortByName = order;
        },
        handlePostsPageChanged(state, { pageNumber, dispatch }) {
            state.currentPage = pageNumber;
            dispatch('posts/fetchPosts', state.currentPage);
        },
    },
    actions: {
        async fetchPosts({ state, commit, rootState }, page = state.currentPage, per_page = state.perPage) {
            try {
                const authToken = Cookies.get("auth_token") ?? "";
                const apiUrl = `${process.env.VUE_APP_API_URL}/api/v1/posts`;

                const response = await axios.get(apiUrl, {
                    params: {
                        page: page,
                        per_page: per_page,
                        search: state.searchQuery,
                        sortDate: state.sortByDate,
                        sortName: state.sortByName
                    },
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        headers: { "Content-Type": "application/json" },
                    },
                });
                console.log(response.data.total_posts);
                commit('setPosts', response.data.posts);
                commit('setTotalPages', Math.ceil(response.data.total_posts / response.data.per_page));
                commit('setCurrentPage', state.currentPage++);
            } catch (e) {
                console.error(e);
            }
        },
        async getPost({ commit, state, rootState }, postId) {
            try {
                const authToken = Cookies.get("auth_token") ?? "";
                const apiUrl = `${process.env.VUE_APP_API_URL}/api/v1/posts/${postId}`;

                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                console.log(response.data);
                state.post = response.data;
            } catch (e) {
                console.error(e);
            }
        },
    },
    namespaced: true
};
