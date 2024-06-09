import axios from 'axios';
import Cookies from 'js-cookie';

export const postsModule = {
    state: () => ({
        posts: [],
        totalPages: 0,
        currentPage: 1,
        perPage: 3,
        page: 1
    }),
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
        handlePostsPageChanged(state, { pageNumber, dispatch }) {

            state.currentPage = pageNumber;
            dispatch('posts/fetchPosts', state.currentPage);
          },
    },
    actions: {
        async fetchPosts({ state, commit, rootState }, page = state.currentPage, per_page = state.perPage) {
            try {
                const authToken = Cookies.get("auth_token") ?? "";
                const response = await axios.get( rootState.domain + "/api/v1/posts", {
                    params: {
                        page: page,
                        per_page: per_page,
                    },
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                commit("setPosts", response.data.posts);
                const totalPosts = Math.ceil(response.data.total_posts / response.data.per_page);
                commit("setTotalPages", totalPosts);
            } catch (e) {
                console.error(e);
            }
        },
    },
    namespaced: true
};
