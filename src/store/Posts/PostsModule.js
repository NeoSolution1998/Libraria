import axios from 'axios';
import Cookies from 'js-cookie';

export const postsModule = {
    state: () => ({
        posts: [],
        post: [],
        totalPages: 0,
        currentPage: 1,
        perPage: 12,
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

                const url = new URL(window.location.href);
                url.searchParams.set('page', page);
                url.searchParams.set('search', state.searchQuery);
                url.searchParams.set('sortDate', state.sortByDate);
                url.searchParams.set('sortName', state.sortByName);
                window.history.pushState({}, '', url);

                const response = await axios.get(rootState.domain + "/api/v1/posts", {
                    params: {
                        page: page,
                        per_page: per_page,
                        search: state.searchQuery,
                        sortDate: state.sortByDate,
                        sortName: state.sortByName
                    },
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                commit('setPosts', response.data.posts);
                commit('setTotalPages', Math.ceil(response.data.meta.total_posts / response.data.meta.per_page));
                commit('setCurrentPage', state.currentPage++);
            } catch (e) {
                console.error(e);
            }
        },
        async getPost({ commit, state, rootState }, postId) {
            try {
                const authToken = Cookies.get("auth_token") ?? "";
                const response = await axios.get(rootState.domain + `/api/v1/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                state.post = response.data;
            } catch (e) {
                console.error(e);
            }
        },
        initializeStateFromURL({ commit, dispatch }) {
            const url = new URL(window.location.href);
            const page = parseInt(url.searchParams.get('page')) || 1;
            const searchQuery = url.searchParams.get('search') || '';
            const sortByDate = url.searchParams.get('sortDate') || 'date_desc';
            const sortByName = url.searchParams.get('sortName') || '';

            commit('setCurrentPage', page);
            commit('setSearchQuery', searchQuery);
            commit('setSortByDate', sortByDate);
            commit('setSortByName', sortByName);
            dispatch('fetchPosts', page);
        }
    },
    namespaced: true
};
