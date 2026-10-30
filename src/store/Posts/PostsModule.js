import axios from 'axios';
import Cookies from 'js-cookie';

// Abort the previous list request so a slow response cannot overwrite newer filters.
let postsRequestController = null;
let postsRequestSequence = 0;

const emptyFilters = () => ({
    selectedCategoryIds: [],
    authorId: null,
    authorName: '',
    startDate: '',
    endDate: '',
    minLikes: 0,
    maxLikes: 0,
    minRating: 0,
    maxRating: 5,
    selectedTags: [],
});

const cleanParams = (params) => {
    Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return params;
};

export const postsModule = {
    state: () => ({
        posts: [],
        post: null,
        totalPosts: 0,
        totalPages: 0,
        currentPage: 1,
        perPage: 6,
        searchQuery: '',
        sort: 'date_desc',
        sortByDate: '',
        sortByName: '',
        sortByLikes: '',
        ...emptyFilters(),
        categories: [],
        authors: [],
        categoriesLoading: false,
        authorsLoading: false,
        filterOptionsError: null,
        loading: false,
        error: null,
    }),

    getters: {
        posts: (state) => state.posts,
        post: (state) => state.post,
        totalPosts: (state) => state.totalPosts,
        totalPages: (state) => state.totalPages,
        currentPage: (state) => state.currentPage,
        perPage: (state) => state.perPage,
        searchQuery: (state) => state.searchQuery,
        sort: (state) => state.sort,
        selectedCategoryIds: (state) => state.selectedCategoryIds,
        authorId: (state) => state.authorId,
        authorName: (state) => state.authorName,
        startDate: (state) => state.startDate,
        endDate: (state) => state.endDate,
        minLikes: (state) => state.minLikes,
        maxLikes: (state) => state.maxLikes,
        minRating: (state) => state.minRating,
        maxRating: (state) => state.maxRating,
        selectedTags: (state) => state.selectedTags,
        categories: (state) => state.categories,
        authors: (state) => state.authors,
        categoriesLoading: (state) => state.categoriesLoading,
        authorsLoading: (state) => state.authorsLoading,
        filterOptionsError: (state) => state.filterOptionsError,
        loading: (state) => state.loading,
        error: (state) => state.error,
        hasActiveFilters: (state) => {
            return Boolean(
                state.selectedCategoryIds.length ||
                state.authorId ||
                state.startDate ||
                state.endDate ||
                state.minLikes > 0 ||
                state.maxLikes > 0 ||
                state.minRating > 0 ||
                state.selectedTags.length
            );
        },
        activeFiltersCount: (state) => {
            return [
                state.selectedCategoryIds.length > 0,
                Boolean(state.authorId),
                Boolean(state.startDate || state.endDate),
                state.minLikes > 0 || state.maxLikes > 0,
                state.minRating > 0,
                state.selectedTags.length > 0,
            ].filter(Boolean).length;
        },
        hasActiveSearch: (state) => Boolean(state.searchQuery),
    },

    mutations: {
        setPosts(state, posts) {
            state.posts = Array.isArray(posts) ? posts : [];
        },
        setPost(state, post) {
            state.post = post;
        },
        setTotalPosts(state, totalPosts) {
            state.totalPosts = Number(totalPosts) || 0;
        },
        setTotalPages(state, totalPages) {
            state.totalPages = Number(totalPages) || 0;
        },
        setCurrentPage(state, currentPage) {
            state.currentPage = Number(currentPage) || 1;
        },
        setPerPage(state, perPage) {
            state.perPage = Number(perPage) || 12;
        },
        setSearchQuery(state, query) {
            state.searchQuery = String(query ?? '');
        },
        setSort(state, sort) {
            state.sort = sort || 'date_desc';
        },
        setSelectedCategoryIds(state, ids) {
            state.selectedCategoryIds = Array.isArray(ids)
                ? ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
                : [];
        },
        setAuthor(state, { id = null, name = '' } = {}) {
            state.authorId = id ? Number(id) : null;
            state.authorName = name || '';
        },
        setDates(state, { startDate = '', endDate = '' } = {}) {
            state.startDate = startDate || '';
            state.endDate = endDate || '';
        },
        setLikesRange(state, { minLikes = 0, maxLikes = 0 } = {}) {
            state.minLikes = Math.max(0, Number(minLikes) || 0);
            state.maxLikes = Math.max(0, Number(maxLikes) || 0);
        },
        setRatingRange(state, { minRating = 0, maxRating = 5 } = {}) {
            state.minRating = Math.min(5, Math.max(0, Number(minRating) || 0));
            state.maxRating = Math.min(5, Math.max(0, Number(maxRating) || 5));
        },
        setSelectedTags(state, tags) {
            state.selectedTags = Array.isArray(tags)
                ? [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))]
                : [];
        },
        setFilters(state, filters = {}) {
            if (Array.isArray(filters.categoryIds)) {
                state.selectedCategoryIds = filters.categoryIds
                    .map((id) => Number(id))
                    .filter((id) => Number.isInteger(id) && id > 0);
            }
            if ('authorId' in filters) {
                state.authorId = filters.authorId ? Number(filters.authorId) : null;
            }
            if ('authorName' in filters) {
                state.authorName = filters.authorName || '';
            }
            if ('startDate' in filters) {
                state.startDate = filters.startDate || '';
            }
            if ('endDate' in filters) {
                state.endDate = filters.endDate || '';
            }
            if ('minLikes' in filters) {
                state.minLikes = Math.max(0, Number(filters.minLikes) || 0);
            }
            if ('maxLikes' in filters) {
                state.maxLikes = Math.max(0, Number(filters.maxLikes) || 0);
            }
            if ('minRating' in filters) {
                state.minRating = Math.min(5, Math.max(0, Number(filters.minRating) || 0));
            }
            if ('maxRating' in filters) {
                state.maxRating = Math.min(5, Math.max(0, Number(filters.maxRating) || 5));
            }
            if (Array.isArray(filters.tags)) {
                state.selectedTags = [...new Set(filters.tags.map((tag) => String(tag).trim()).filter(Boolean))];
            }
        },
        clearFilters(state) {
            Object.assign(state, emptyFilters());
        },
        setCategories(state, categories) {
            state.categories = Array.isArray(categories) ? categories : [];
        },
        setAuthors(state, authors) {
            state.authors = Array.isArray(authors) ? authors : [];
        },
        setCategoriesLoading(state, loading) {
            state.categoriesLoading = Boolean(loading);
        },
        setAuthorsLoading(state, loading) {
            state.authorsLoading = Boolean(loading);
        },
        setFilterOptionsError(state, error) {
            state.filterOptionsError = error;
        },
        setLoading(state, loading) {
            state.loading = Boolean(loading);
        },
        setError(state, error) {
            state.error = error;
        },
        updatePostLike(state, { postId, isLiked, likesCount }) {
            const postIndex = state.posts.findIndex((post) => post.id === postId);
            if (postIndex !== -1) {
                state.posts[postIndex].is_liked = isLiked;
                state.posts[postIndex].likes_count = likesCount;
            }
            if (state.post && state.post.id === postId) {
                state.post.is_liked = isLiked;
                state.post.likes_count = likesCount;
            }
        },
    },

    actions: {
        async fetchPosts({ state, commit }, page = state.currentPage, perPage = state.perPage) {
            const sequence = ++postsRequestSequence;

            if (postsRequestController) {
                postsRequestController.abort();
            }
            const controller = new AbortController();
            postsRequestController = controller;

            commit('setLoading', true);
            commit('setError', null);

            const params = cleanParams({
                page,
                per_page: perPage,
                search: state.searchQuery || undefined,
                sort: state.sort || undefined,
                author_id: state.authorId || undefined,
                category_ids: state.selectedCategoryIds.length
                    ? state.selectedCategoryIds.join(',')
                    : undefined,
                tags: state.selectedTags.length ? state.selectedTags.join(',') : undefined,
                startDate: state.startDate || undefined,
                endDate: state.endDate || undefined,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                minLikes: state.minLikes > 0 ? state.minLikes : undefined,
                maxLikes: state.maxLikes > 0 ? state.maxLikes : undefined,
                minRating: state.minRating > 0 ? state.minRating : undefined,
                maxRating: state.maxRating < 5 ? state.maxRating : undefined,
            });

            try {
                const authToken = Cookies.get('auth_token') ?? '';
                const response = await axios.get(
                    `${process.env.VUE_APP_API_URL}/api/v1/posts`,
                    {
                        params,
                        signal: controller.signal,
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            Accept: 'application/json',
                        },
                    }
                );

                if (sequence !== postsRequestSequence) {
                    return;
                }

                const data = response.data || {};
                commit('setPosts', data.posts);
                commit('setTotalPosts', data.total_posts);
                commit('setTotalPages', data.last_page);
                commit('setCurrentPage', data.current_page || page);
                commit('setPerPage', data.per_page || perPage);
            } catch (error) {
                const isCanceled =
                    axios.isCancel?.(error) ||
                    error.code === 'ERR_CANCELED' ||
                    error.name === 'CanceledError';

                if (isCanceled || sequence !== postsRequestSequence) {
                    return;
                }

                commit(
                    'setError',
                    error.response?.data?.message ||
                        'Не удалось загрузить посты. Проверьте подключение и попробуйте ещё раз.'
                );
            } finally {
                if (sequence === postsRequestSequence) {
                    commit('setLoading', false);
                }
            }
        },

        async fetchCategories({ commit }) {
            commit('setCategoriesLoading', true);
            commit('setFilterOptionsError', null);

            try {
                const response = await axios.get(
                    `${process.env.VUE_APP_API_URL}/api/v1/categories`,
                    { headers: { Accept: 'application/json' } }
                );
                const data = response.data?.data ?? response.data;
                commit('setCategories', Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Ошибка при загрузке категорий:', error);
                commit('setFilterOptionsError', 'Не удалось загрузить категории.');
            } finally {
                commit('setCategoriesLoading', false);
            }
        },

        async fetchAuthors({ commit }) {
            commit('setAuthorsLoading', true);
            commit('setFilterOptionsError', null);

            try {
                const response = await axios.get(
                    `${process.env.VUE_APP_API_URL}/api/v1/posts/authors`,
                    { headers: { Accept: 'application/json' } }
                );
                const data = response.data?.authors ?? response.data?.data ?? response.data;
                commit('setAuthors', Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Ошибка при загрузке авторов:', error);
                commit('setFilterOptionsError', 'Не удалось загрузить список авторов.');
            } finally {
                commit('setAuthorsLoading', false);
            }
        },

        async fetchFilterOptions({ dispatch }) {
            await Promise.allSettled([
                dispatch('fetchCategories'),
                dispatch('fetchAuthors'),
            ]);
        },

        async getPost({ commit, rootState }, postId) {
            commit('setPost', null);
            try {
                const authToken = Cookies.get('auth_token') ?? '';
                const response = await axios.get(
                    `${process.env.VUE_APP_API_URL}/api/v1/posts/${postId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            Accept: 'application/json',
                        },
                    }
                );
                commit('setPost', response.data?.data || response.data);
            } catch (error) {
                console.error('Ошибка при получении поста:', error);
                throw error;
            }
        },

        async likePost({ commit, rootState }, postId) {
            const authToken = Cookies.get('auth_token') ?? '';
            if (!authToken) {
                return;
            }

            const response = await axios.post(
                `${process.env.VUE_APP_API_URL}/api/v1/posts/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        Accept: 'application/json',
                    },
                }
            );

            commit('updatePostLike', {
                postId,
                isLiked: true,
                likesCount: response.data.likes_count,
            });
        },

        async unlikePost({ commit }, postId) {
            const authToken = Cookies.get('auth_token') ?? '';
            if (!authToken) {
                return;
            }

            const response = await axios.delete(
                `${process.env.VUE_APP_API_URL}/api/v1/posts/${postId}/like`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        Accept: 'application/json',
                    },
                }
            );

            commit('updatePostLike', {
                postId,
                isLiked: false,
                likesCount: response.data.likes_count,
            });
        },

        async togglePostLike({ state, dispatch }, postId) {
            const post = state.posts.find((item) => item.id === postId) || state.post;
            if (!post) {
                return;
            }

            if (post.is_liked) {
                await dispatch('unlikePost', postId);
            } else {
                await dispatch('likePost', postId);
            }
        },
    },

    namespaced: true,
};
